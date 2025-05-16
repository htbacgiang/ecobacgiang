import { NextApiHandler } from "next";
import User from "../../../models/User";
import { LatestUserProfile } from "../../../utils/types";

const handler: NextApiHandler = (req, res) => {
  const { method } = req;
  switch (method) {
    case "GET":
      return getLatestUsers(req, res);
    default:
      res.status(404).send("Not found!");
  }
};

const getLatestUsers: NextApiHandler = async (req, res) => {
  const { pageNo = "0", limit = "5" } = req.query as {
    pageNo: string;
    limit: string;
  };

  const page = parseInt(pageNo);
  const pageSize = parseInt(limit);

  try {
    const [results, total] = await Promise.all([
      User.find({ role: "user" })
        .sort({ createdAt: "desc" })
        .skip(page * pageSize)
        .limit(pageSize)
        .select("name email avatar provider phone address gender"), // Added phone, address, gender
      User.countDocuments({ role: "user" }),
    ]);

    const users: LatestUserProfile[] = results.map(
      ({ _id, name, email, avatar, provider, phone, address, gender,emailVerified }) => ({
        id: _id.toString(),
        name,
        email,
        avatar,
        provider,
        phone,
        address, // Array of address objects
        gender,
        emailVerified
      })
    );

    res.json({ users, total });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export default handler;