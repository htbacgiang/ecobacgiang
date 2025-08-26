import mongoose from 'mongoose';
import db from '../../../utils/db';
import SurveyResponse from '../../../models/SurveyResponse';

export default async function handler(req, res) {
  await db.connectDb();

  try {
    if (req.method === 'POST') {
      const formData = req.body;

      // Kiểm tra các trường bắt buộc
      const requiredFields = ['q1', 'q2', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14', 'q15', 'q16', 'q17', 'q18', 'q19', 'q22', 'q23', 'q24'];
      for (let field of requiredFields) {
        if (!formData[field]) {
          return res.status(400).json({ message: `Vui lòng trả lời câu hỏi bắt buộc: ${field}` });
        }
      }

      // Kiểm tra định dạng rating (1-5)
      const ratingFields = ['q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q13', 'q14', 'q15', 'q16', 'q17', 'q18', 'q19'];
      for (let field of ratingFields) {
        const value = parseInt(formData[field]);
        if (isNaN(value) || value < 1 || value > 5) {
          return res.status(400).json({ message: `Điểm số cho ${field} phải từ 1 đến 5` });
        }
      }

      // Lưu vào MongoDB
      const surveyResponse = new SurveyResponse({
        ...formData,
        createdAt: new Date(),
      });
      await surveyResponse.save();

      // Gửi dữ liệu tới server AI để phân tích
      const aiResponse = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [formData] }),
      });

      let aiData = { clusters: [0], sentiments: [0.0] };
      if (aiResponse.ok) {
        aiData = await aiResponse.json();
        // Cập nhật cluster và sentiment vào MongoDB
        await SurveyResponse.findByIdAndUpdate(surveyResponse._id, {
          cluster: aiData.clusters[0],
          sentiment: aiData.sentiments[0],
        });
      } else {
        console.error('AI analysis failed:', await aiResponse.text());
      }

      return res.status(200).json({
        message: 'Survey response saved and analyzed successfully',
        cluster: aiData.clusters[0],
        sentiment: aiData.sentiments[0],
      });
    } else {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Survey API error:', error);
    return res.status(500).json({ message: 'Server error' });
  } finally {
    await mongoose.connection.close();
  }
}