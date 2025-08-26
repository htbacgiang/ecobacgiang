import db from '../../../utils/db';
import Subscription from '../../../models/Subscription';

export default async function handler(req, res) {
  await db.connectDb();

  if (req.method === 'GET') {
    try {
      const [total, active, unsubscribed] = await Promise.all([
        Subscription.countDocuments(),
        Subscription.countDocuments({ status: 'active' }),
        Subscription.countDocuments({ status: 'unsubscribed' })
      ]);

      res.status(200).json({
        success: true,
        data: {
          total,
          active,
          unsubscribed
        }
      });

    } catch (error) {
      console.error('Stats error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Có lỗi xảy ra khi lấy thống kê' 
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ 
      success: false, 
      message: `Method ${req.method} Not Allowed` 
    });
  }
}
