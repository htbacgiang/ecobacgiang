import db from '../../../utils/db';
import Subscription from '../../../models/Subscription';

export default async function handler(req, res) {
  await db.connectDb();

  if (req.method === 'GET') {
    try {
      const subscriptions = await Subscription.find({})
        .sort({ subscribedAt: -1 })
        .select('email status subscribedAt unsubscribedAt source');

      // Create CSV content
      const csvHeader = 'Email,Trạng thái,Ngày đăng ký,Ngày hủy đăng ký,Nguồn\n';
      const csvRows = subscriptions.map(sub => {
        const status = sub.status === 'active' ? 'Đang hoạt động' : 'Đã hủy';
        const subscribedDate = new Date(sub.subscribedAt).toLocaleDateString('vi-VN');
        const unsubscribedDate = sub.unsubscribedAt 
          ? new Date(sub.unsubscribedAt).toLocaleDateString('vi-VN')
          : '';
        const source = sub.source || 'Website';
        
        return `"${sub.email}","${status}","${subscribedDate}","${unsubscribedDate}","${source}"`;
      }).join('\n');

      const csvContent = csvHeader + csvRows;

      // Set response headers for file download
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="subscriptions-${new Date().toISOString().split('T')[0]}.csv"`);
      
      // Add BOM for proper UTF-8 encoding in Excel
      res.write('\uFEFF');
      res.end(csvContent);

    } catch (error) {
      console.error('Export error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Có lỗi xảy ra khi xuất file' 
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
