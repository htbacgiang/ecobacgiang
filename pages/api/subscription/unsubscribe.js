import db from '../../../utils/db';
import Subscription from '../../../models/Subscription';

export default async function handler(req, res) {
  await db.connectDb();

  if (req.method === 'POST') {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email là bắt buộc' 
        });
      }

      const subscription = await Subscription.findOne({ 
        email: email.toLowerCase() 
      });

      if (!subscription) {
        return res.status(404).json({ 
          success: false, 
          message: 'Email không tìm thấy trong danh sách đăng ký' 
        });
      }

      if (subscription.status === 'unsubscribed') {
        return res.status(400).json({ 
          success: false, 
          message: 'Email này đã được hủy đăng ký trước đó' 
        });
      }

      subscription.status = 'unsubscribed';
      subscription.unsubscribedAt = new Date();
      await subscription.save();

      res.status(200).json({ 
        success: true, 
        message: 'Hủy đăng ký thành công. Chúng tôi rất tiếc khi bạn rời đi!' 
      });

    } catch (error) {
      console.error('Unsubscribe error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Có lỗi xảy ra, vui lòng thử lại sau' 
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ 
      success: false, 
      message: `Method ${req.method} Not Allowed` 
    });
  }
}
