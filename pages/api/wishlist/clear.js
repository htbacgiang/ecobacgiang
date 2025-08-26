import db from "../../../utils/db";
import User from "../../../models/User";

export default async function handler(req, res) {
  await db.connectDb();

  if (req.method === "DELETE") {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ message: "Thiếu userId" });
      }
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.wishlist = [];
      await user.save();
      return res.status(200).json({ wishlist: [] });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} không được hỗ trợ` });
  }
}