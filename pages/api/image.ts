import type { NextApiHandler } from "next";
import { IncomingForm } from "formidable";
import cloudinary from "../../lib/cloudinary";
import db from "../../utils/db";
import Image from "../../models/Image";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { getToken } from "next-auth/jwt";

// Tắt bodyParser để formidable xử lý request
export const config = {
  api: { bodyParser: false },
};

// Hàm tiện ích để parse form multipart/form-data, hỗ trợ multiples
const parseForm = (req: any): Promise<{ files: any; fields: any }> => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ multiples: true });
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ files, fields });
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
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const session = token ? { user: token } : null;
    if (!session || !session.user || !(session.user as any).sub) {
      return res.status(401).json({ error: "Bạn cần đăng nhập để upload ảnh!" });
    }

    const { files, fields } = await parseForm(req);
    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
    const altText = fields.altText || "";

    // Validate loại file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(imageFile.mimetype)) {
      return res.status(400).json({ error: 'Chỉ hỗ trợ file JPEG, JPG, PNG, WEBP' });
    }

    const { secure_url: url, public_id } = await cloudinary.uploader.upload(
      imageFile.filepath,
      { folder: "ecobacgiang" }
    );

    // Lưu thông tin ảnh vào database
    await db.connectDb();
    const newImage = new Image({
      src: url,
      altText,
      publicId: public_id,
      uploadedBy: (session.user as any).sub,
    });
    await newImage.save();

    res.json({ src: url, altText, id: newImage._id });
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
    await db.connectDb();
    const images = await Image.find().sort({ createdAt: -1 });
    console.log("Found images:", images.length);
    
    const formattedImages = images.map(img => ({
      src: img.src,
      altText: img.altText || "",
      id: img._id.toString()
    }));
    
    console.log("Formatted images:", formattedImages.slice(0, 2)); // Log first 2 images
    
    res.json({ images: formattedImages });
  } catch (error: any) {
    console.error('Error fetching images from database:', error);
    res.status(500).json({ error: error.message });
  }
};

export default handler;