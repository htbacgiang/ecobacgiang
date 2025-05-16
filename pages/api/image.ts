import type { NextApiHandler } from "next";
import { IncomingForm } from "formidable";
import cloudinary from "../../lib/cloudinary";

// Tắt bodyParser để formidable xử lý request
export const config = {
  api: { bodyParser: false },
};

// Hàm tiện ích để parse form multipart/form-data, hỗ trợ multiples
const parseForm = (req: any): Promise<{ files: any }> => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ multiples: true });
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ files });
    });
  });
};

const handler: NextApiHandler = (req, res) => {
  const { method } = req;
  switch (method) {
    case "POST": {
      const { multiple, type } = req.query;
      if (type === "avatar") {
        return uploadAvatar(req, res);
      }
      if (multiple === "true") {
        return uploadMultipleImages(req, res);
      }
      return uploadNewImage(req, res);
    }
    case "GET":
      return readAllImages(req, res);
    default:
      return res.status(404).send("Not found!");
  }
};

// Upload một ảnh lên Cloudinary
const uploadNewImage: NextApiHandler = async (req, res) => {
  try {
    const { files } = await parseForm(req);
    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

    // Validate loại file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(imageFile.mimetype)) {
      return res.status(400).json({ error: 'Chỉ hỗ trợ file JPEG, JPG, PNG, WEBP' });
    }

    const { secure_url: url } = await cloudinary.uploader.upload(
      imageFile.filepath,
      { folder: "ecobacgiang" }
    );

    res.json({ src: url });
  } catch (error: any) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).json({ error: error.message });
  }
};

// Upload avatar lên Cloudinary
const uploadAvatar: NextApiHandler = async (req, res) => {
  try {
    const { files } = await parseForm(req);
    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

    // Validate loại file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(imageFile.mimetype)) {
      return res.status(400).json({ error: 'Chỉ hỗ trợ file JPEG, JPG, PNG, WEBP' });
    }

    // Validate kích thước file (tối đa 5MB)
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (imageFile.size > maxFileSize) {
      return res.status(400).json({ error: 'Kích thước file không được vượt quá 5MB' });
    }

    const { secure_url: url } = await cloudinary.uploader.upload(
      imageFile.filepath,
      { folder: "ecobacgiang/avatar" }
    );

    res.json({ src: url });
  } catch (error: any) {
    console.error('Error uploading avatar to Cloudinary:', error);
    res.status(500).json({ error: error.message });
  }
};

// Upload nhiều ảnh lên Cloudinary cùng lúc
const uploadMultipleImages: NextApiHandler = async (req, res) => {
  try {
    const { files } = await parseForm(req);
    const imageFiles = Array.isArray(files.image) ? files.image : [files.image];
    const uploadedUrls: string[] = [];

    // Validate và upload từng file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    for (const file of imageFiles) {
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({ error: 'Chỉ hỗ trợ file JPEG, JPG, PNG, WEBP' });
      }
      const { secure_url: url } = await cloudinary.uploader.upload(
        file.filepath,
        { folder: "ecobacgiang" }
      );
      uploadedUrls.push(url);
    }

    res.json({ src: uploadedUrls });
  } catch (error: any) {
    console.error('Error uploading multiple images to Cloudinary:', error);
    res.status(500).json({ error: error.message });
  }
};

// Đọc danh sách ảnh đã upload từ Cloudinary
const readAllImages: NextApiHandler = async (req, res) => {
  try {
    const { resources } = await cloudinary.api.resources({
      resource_type: "image",
      type: "upload",
      prefix: "ecobacgiang",
      max_results: 1000,
    });
    const images = resources.map((r: any) => ({ src: r.secure_url }));
    res.json({ images });
  } catch (error: any) {
    console.error('Error fetching images from Cloudinary:', error);
    res.status(500).json({ error: error.message });
  }
};

export default handler;