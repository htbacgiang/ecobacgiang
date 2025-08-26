import db from "../../../utils/db";
import User from "../../../models/User";

export default async function handler(req, res) {
  await db.connectDb();
  const { method, query: { userId, addressId } } = req;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    switch (method) {
      case "GET": {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });
        
        // Đảm bảo trường address tồn tại
        if (!user.address) {
          await User.findByIdAndUpdate(userId, { $set: { address: [] } });
          return res.status(200).json({ addresses: [] });
        }
        
        if (addressId) {
          const address = user.address.find(
            (addr) => addr._id.toString() === addressId
          );
          if (!address)
            return res.status(404).json({ error: "Address not found" });
          return res.status(200).json({ address });
        } else {
          return res.status(200).json({ addresses: user.address });
        }
      }
      case "POST": {
        const newAddress = req.body;
        
        // Kiểm tra và khởi tạo trường address nếu chưa tồn tại
        let user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        
        if (!user.address) {
          await User.findByIdAndUpdate(userId, { $set: { address: [] } });
          console.log("Initialized address field for user:", userId);
        }
        
        // Nếu địa chỉ mới là default, bỏ default của các địa chỉ khác
        if (newAddress.isDefault) {
          await User.updateOne(
            { _id: userId },
            { $set: { "address.$[].isDefault": false } }
          );
        }
        
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { $push: { address: newAddress } },
          { new: true }
        );
        
        return res.status(200).json({ 
          addresses: updatedUser.address,
          message: "Địa chỉ đã được thêm thành công"
        });
      }
      case "PUT": {
        const updatedAddress = req.body;
        const addrId = updatedAddress.addressId || updatedAddress._id;
        if (!addrId) {
          return res.status(400).json({ error: "Missing addressId" });
        }
        
        // Kiểm tra và khởi tạo trường address nếu chưa tồn tại
        let user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        
        if (!user.address || user.address.length === 0) {
          return res.status(400).json({ 
            error: "Không có địa chỉ nào để cập nhật. Vui lòng thêm địa chỉ mới." 
          });
        }
        
        // Kiểm tra địa chỉ có tồn tại không
        const existingAddress = user.address.find(addr => addr._id.toString() === addrId);
        if (!existingAddress) {
          return res.status(404).json({ error: "Địa chỉ không tồn tại" });
        }
        
        // Nếu địa chỉ cập nhật là default, bỏ default của các địa chỉ khác
        if (updatedAddress.isDefault) {
          await User.updateOne(
            { _id: userId },
            { $set: { "address.$[].isDefault": false } }
          );
        }
        
        const updatedUser = await User.findOneAndUpdate(
          { _id: userId, "address._id": addrId },
          { $set: { "address.$": updatedAddress } },
          { new: true }
        );
        
        if (!updatedUser) {
          return res.status(404).json({ error: "Không thể cập nhật địa chỉ" });
        }
        
        return res.status(200).json({ 
          addresses: updatedUser.address,
          message: "Địa chỉ đã được cập nhật thành công"
        });
      }
      case "DELETE": {
        const id = addressId || req.body.addressId;
        if (!id) {
          return res.status(400).json({ error: "Missing addressId" });
        }
        
        // Kiểm tra và khởi tạo trường address nếu chưa tồn tại
        let user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        
        if (!user.address || user.address.length === 0) {
          return res.status(200).json({ addresses: [] });
        }
        
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { $pull: { address: { _id: id } } },
          { new: true }
        );
        
        return res.status(200).json({ 
          addresses: updatedUser.address,
          message: "Địa chỉ đã được xóa thành công"
        });
      }
      default: {
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
      }
    }
  } catch (error) {
    console.error("Address API error:", error);
    return res.status(500).json({ 
      error: "Lỗi máy chủ", 
      details: error.message 
    });
  }
}
