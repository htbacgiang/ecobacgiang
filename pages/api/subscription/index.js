import db from '../../../utils/db';
import Subscription from '../../../models/Subscription';
import { subscriptionEmailTemplate } from '../../../emails/subscriptionEmailTemplate';
import { sendEmail } from '../../../utils/sendEmails';

export default async function handler(req, res) {
  await db.connectDb();

  if (req.method === 'POST') {
    try {
      const { email, source = 'website', ipAddress, userAgent } = req.body;

      // Validate email
      if (!email || !email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email không hợp lệ' 
        });
      }

      // Check if email already exists
      const existingSubscription = await Subscription.findOne({ 
        email: email.toLowerCase() 
      });

      if (existingSubscription) {
        if (existingSubscription.status === 'active') {
          return res.status(400).json({ 
            success: false, 
            message: 'Email này đã được đăng ký nhận bản tin' 
          });
        } else {
          // Reactivate subscription
          existingSubscription.status = 'active';
          existingSubscription.unsubscribedAt = null;
          await existingSubscription.save();
          
          // Send welcome back email
          await sendSubscriptionEmail(email);
          
          return res.status(200).json({ 
            success: true, 
            message: 'Đăng ký lại thành công! Chào mừng bạn quay trở lại.' 
          });
        }
      }

      // Create new subscription
      const subscription = new Subscription({
        email: email.toLowerCase(),
        source,
        ipAddress,
        userAgent
      });

      await subscription.save();

      // Send welcome email
      await sendSubscriptionEmail(email);

      res.status(201).json({ 
        success: true, 
        message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.' 
      });

    } catch (error) {
      console.error('Subscription error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Có lỗi xảy ra, vui lòng thử lại sau' 
      });
    }
  } else if (req.method === 'GET') {
    try {
      const { page = 1, limit = 10, status, search } = req.query;
      
      const query = {};
      if (status) query.status = status;
      if (search) {
        query.email = { $regex: search, $options: 'i' };
      }

      const skip = (page - 1) * limit;
      
      const subscriptions = await Subscription.find(query)
        .sort({ subscribedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v');

      const total = await Subscription.countDocuments(query);

      res.status(200).json({
        success: true,
        data: subscriptions,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          totalItems: total
        }
      });

    } catch (error) {
      console.error('Get subscriptions error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Có lỗi xảy ra khi lấy danh sách đăng ký' 
      });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).json({ 
      success: false, 
      message: `Method ${req.method} Not Allowed` 
    });
  }
}

async function sendSubscriptionEmail(email) {
  try {
    const emailContent = subscriptionEmailTemplate(email);
    const url = 'https://ecobacgiang.vn'; // URL for the button in email
    
    // Send email using the existing sendEmail utility (same as signup API)
    await sendEmail(email, url, "Đăng ký nhận bản tin thành công", "🎉 Đăng ký nhận bản tin thành công - Eco Bắc Giang", emailContent);
    
    console.log(`Subscription email sent to: ${email}`);
    
  } catch (error) {
    console.error('Error sending subscription email:', error);
    // Don't throw error to avoid breaking the subscription process
  }
}
