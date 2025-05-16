import db from "../utils/db";
import User from "../models/User";
import { createActivationToken } from "../utils/tokens";
import { sendEmail } from "../utils/sendEmails";

const TWO_DAYS_IN_MS = 2 * 24 * 60 * 60 * 1000;

const resendActivationEmails = async () => {
  try {
    await db.connectDb();

    // Tìm user chưa xác nhận email và đã quá hạn 2 ngày
    const users = await User.find({
      emailVerified: false,
      emailVerificationSentAt: { $lt: new Date(Date.now() - TWO_DAYS_IN_MS) },
    });

    for (const user of users) {
      const activation_token = createActivationToken({ id: user._id.toString() });
      const url = `${process.env.BASE_URL}/activate/${activation_token}`;

      await sendEmail(user.email, url, "", "Kích hoạt tài khoản.");

      // Cập nhật thời gian gửi email mới nhất
      user.emailVerificationSentAt = new Date();
      await user.save();
    }

    await db.disconnectDb();
  } catch (error) {
    console.error("Lỗi khi gửi lại email xác nhận:", error);
  }
};

export default resendActivationEmails;
