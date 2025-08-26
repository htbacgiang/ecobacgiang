#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Profile Knowledge Builder
Xây dựng knowledge base về Ngô Quang Trường từ dữ liệu có sẵn và dữ liệu đã scrape
"""

import json
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class ProfileKnowledgeBuilder:
    def __init__(self):
        """Khởi tạo Profile Knowledge Builder"""
        self.profile_data = {
            'basic_info': {},
            'professional_info': {},
            'company_info': {},
            'skills_expertise': [],
            'contact_info': {},
            'web_presence': {},
            'achievements': [],
            'knowledge_areas': [],
            'created_at': datetime.now().isoformat()
        }
        
        # Load scraped data nếu có
        self.load_scraped_data()
        
        # Xây dựng knowledge base từ thông tin có sẵn
        self.build_basic_knowledge()
    
    def load_scraped_data(self):
        """Load dữ liệu đã scrape từ website"""
        try:
            with open('truongnq_scraped_data.json', 'r', encoding='utf-8') as f:
                scraped_data = json.load(f)
                
            # Tích hợp dữ liệu đã scrape
            if scraped_data.get('personal_info'):
                self.profile_data['web_presence'].update(scraped_data['personal_info'])
            
            if scraped_data.get('contact'):
                self.profile_data['contact_info'].update(scraped_data['contact'])
            
            logger.info("Loaded scraped data successfully")
            
        except FileNotFoundError:
            logger.info("No scraped data file found, using base knowledge only")
        except Exception as e:
            logger.error(f"Error loading scraped data: {e}")
    
    def build_basic_knowledge(self):
        """Xây dựng knowledge base cơ bản từ thông tin đã biết"""
        
        # Thông tin cơ bản
        self.profile_data['basic_info'] = {
            'full_name': 'Ngô Quang Trường',
            'english_name': 'Ngo Quang Truong',
            'position': 'Founder & CEO',
            'company': 'Eco Bắc Giang',
            'website': 'truongnq.vn',
            'industry': 'Nông nghiệp hữu cơ và Công nghệ'
        }
        
        # Thông tin nghề nghiệp
        self.profile_data['professional_info'] = {
            'current_role': 'Founder & CEO tại Eco Bắc Giang',
            'company_focus': 'Nông nghiệp thông minh và sản xuất hữu cơ bền vững',
            'business_areas': [
                'Nông nghiệp hữu cơ',
                'Công nghệ nông nghiệp (AgTech)',
                'Agriculture of Thinks (AoT)',
                'Sản xuất thực phẩm hữu cơ',
                'Phát triển bền vững'
            ],
            'leadership_style': 'Dẫn dắt tầm nhìn nông nghiệp thông minh'
        }
        
        # Thông tin công ty
        self.profile_data['company_info'] = {
            'company_name': 'Eco Bắc Giang',
            'company_vision': 'Trở thành thương hiệu dẫn đầu trong lĩnh vực nông nghiệp thông minh và sản xuất hữu cơ bền vững tại Việt Nam',
            'company_mission': [
                'Sản xuất hữu cơ chất lượng cao',
                'Canh tác thuận tự nhiên',
                'Ứng dụng công nghệ thông minh',
                'Phát triển kinh tế xanh',
                'Hỗ trợ cộng đồng nông nghiệp'
            ],
            'core_values': [
                'Bền vững', 'Thuận tự nhiên', 'Đổi mới sáng tạo',
                'Chất lượng', 'Trách nhiệm xã hội', 'Đồng hành kết nối',
                'Tận tâm chính trực', 'Hướng đến tương lai'
            ],
            'operating_principles': '5 nguyên tắc KHÔNG (không thuốc bảo vệ thực vật hóa học, không phân bón hóa học, không cây biến đổi gen, không chất kích thích sinh trưởng, không thuốc diệt cỏ)'
        }
        
        # Kỹ năng và chuyên môn
        self.profile_data['skills_expertise'] = [
            'Quản lý doanh nghiệp',
            'Nông nghiệp hữu cơ',
            'Công nghệ nông nghiệp (AI, IoT, Robot)',
            'Phát triển sản phẩm',
            'Quản lý chuỗi cung ứng',
            'Marketing nông sản',
            'Phát triển bền vững',
            'Lãnh đạo đội nhóm',
            'Tư vấn chiến lược'
        ]
        
        # Thông tin liên hệ và web presence
        self.profile_data['contact_info'] = {
            'website': 'truongnq.vn',
            'company_website': 'ecobacgiang.com (giả định)',
            'professional_focus': 'Thiết kế website và dịch vụ SEO chuyên nghiệp'
        }
        
        # Từ scraped data
        if self.profile_data.get('web_presence', {}).get('page_title'):
            title = self.profile_data['web_presence']['page_title']
            if 'thiết kế website' in title.lower() and 'seo' in title.lower():
                self.profile_data['skills_expertise'].extend([
                    'Thiết kế website',
                    'SEO (Search Engine Optimization)',
                    'Digital Marketing',
                    'Web Development'
                ])
        
        # Lĩnh vực kiến thức
        self.profile_data['knowledge_areas'] = [
            'Nông nghiệp hữu cơ và bền vững',
            'Công nghệ trong nông nghiệp (AgTech)',
            'Quản trị doanh nghiệp',
            'Phát triển sản phẩm hữu cơ',
            'Chuyển đổi số trong nông nghiệp',
            'Thiết kế website và SEO',
            'Marketing online',
            'Phát triển thương hiệu'
        ]
        
        # Thành tựu (dựa trên thông tin công ty)
        self.profile_data['achievements'] = [
            'Sáng lập và phát triển Eco Bắc Giang',
            'Xây dựng thương hiệu nông sản hữu cơ',
            'Ứng dụng thành công công nghệ AI, IoT vào nông nghiệp',
            'Phát triển hệ thống 5 nguyên tắc KHÔNG',
            'Tạo ra 46+ sản phẩm nông sản hữu cơ chất lượng',
            'Dẫn dắt tầm nhìn Agriculture of Thinks',
            'Xây dựng mô hình kinh tế xanh bền vững'
        ]
    
    def create_training_intents(self):
        """Tạo intents training từ knowledge base"""
        intents = []
        
        # Intent về thông tin cá nhân
        personal_intent = {
            "tag": "truong_personal_info",
            "patterns": [
                "Ngô Quang Trường là ai",
                "Giới thiệu về Ngô Quang Trường",
                "Thông tin về anh Trường",
                "Trường CEO Eco Bắc Giang",
                "Profile Ngô Quang Trường",
                "Background của Founder",
                "Kinh nghiệm của CEO",
                "Anh Trường làm gì"
            ],
            "responses": [
                f"Ông Ngô Quang Trường là Founder & CEO của Eco Bắc Giang, chuyên về {', '.join(self.profile_data['professional_info']['business_areas'][:3])}. Chi tiết tại truongnq.vn",
                f"CEO Ngô Quang Trường dẫn dắt Eco Bắc Giang với tầm nhìn {self.profile_data['company_info']['company_vision'][:50]}...",
                f"Anh Trường là người sáng lập và điều hành Eco Bắc Giang, tập trung vào nông nghiệp thông minh và sản xuất hữu cơ bền vững."
            ]
        }
        intents.append(personal_intent)
        
        # Intent về kỹ năng và chuyên môn
        skills_intent = {
            "tag": "truong_skills_expertise",
            "patterns": [
                "Kỹ năng của Ngô Quang Trường",
                "Chuyên môn của CEO",
                "Anh Trường giỏi về gì",
                "Expertise của Founder",
                "Lĩnh vực mạnh của CEO",
                "Trường có kinh nghiệm gì"
            ],
            "responses": [
                f"Ông Ngô Quang Trường có chuyên môn về: {', '.join(self.profile_data['skills_expertise'][:5])} và nhiều lĩnh vực khác.",
                f"CEO có kinh nghiệm trong {len(self.profile_data['knowledge_areas'])} lĩnh vực chính: {', '.join(self.profile_data['knowledge_areas'][:3])}...",
                f"Anh Trường chuyên về nông nghiệp hữu cơ, công nghệ AgTech và phát triển doanh nghiệp bền vững."
            ]
        }
        intents.append(skills_intent)
        
        # Intent về thành tựu
        achievements_intent = {
            "tag": "truong_achievements",
            "patterns": [
                "Thành tựu của Ngô Quang Trường",
                "Anh Trường đã làm được gì",
                "Achievements của CEO",
                "Thành công của Founder",
                "Đóng góp của anh Trường",
                "Công trình của CEO"
            ],
            "responses": [
                f"Ông Ngô Quang Trường đã {self.profile_data['achievements'][0]}, {self.profile_data['achievements'][1]} và {self.profile_data['achievements'][2]}.",
                f"CEO đã thành công trong việc {', '.join(self.profile_data['achievements'][:3])}.",
                f"Anh Trường có nhiều thành tựu trong nông nghiệp hữu cơ và ứng dụng công nghệ vào sản xuất."
            ]
        }
        intents.append(achievements_intent)
        
        return intents
    
    def generate_ai_training_text(self):
        """Tạo text training cho AI từ knowledge base"""
        training_texts = []
        
        # Text về thông tin cơ bản
        basic_text = f"""
        Ngô Quang Trường là {self.profile_data['basic_info']['position']} của {self.profile_data['basic_info']['company']}.
        Ông là người dẫn dắt tầm nhìn {self.profile_data['professional_info']['company_focus']}.
        Website cá nhân: {self.profile_data['basic_info']['website']}.
        Chuyên về các lĩnh vực: {', '.join(self.profile_data['professional_info']['business_areas'])}.
        """
        training_texts.append(basic_text.strip())
        
        # Text về công ty
        company_text = f"""
        Eco Bắc Giang do Ngô Quang Trường sáng lập có tầm nhìn: {self.profile_data['company_info']['company_vision']}.
        Sứ mệnh công ty: {', '.join(self.profile_data['company_info']['company_mission'])}.
        8 giá trị cốt lõi: {', '.join(self.profile_data['company_info']['core_values'])}.
        Hoạt động theo {self.profile_data['company_info']['operating_principles']}.
        """
        training_texts.append(company_text.strip())
        
        # Text về kỹ năng
        skills_text = f"""
        Ngô Quang Trường có chuyên môn và kỹ năng trong các lĩnh vực:
        {', '.join(self.profile_data['skills_expertise'])}.
        Ông am hiểu sâu về {', '.join(self.profile_data['knowledge_areas'])}.
        """
        training_texts.append(skills_text.strip())
        
        # Text về thành tựu
        achievements_text = f"""
        Những thành tựu nổi bật của CEO Ngô Quang Trường:
        {'. '.join(self.profile_data['achievements'])}.
        """
        training_texts.append(achievements_text.strip())
        
        return training_texts
    
    def save_knowledge_base(self, filename="truong_knowledge_base.json"):
        """Lưu knowledge base"""
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(self.profile_data, f, ensure_ascii=False, indent=2)
            logger.info(f"Saved knowledge base to {filename}")
            return True
        except Exception as e:
            logger.error(f"Error saving knowledge base: {e}")
            return False
    
    def save_training_intents(self, filename="truong_training_intents.json"):
        """Lưu training intents"""
        try:
            intents = self.create_training_intents()
            training_data = {"intents": intents}
            
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(training_data, f, ensure_ascii=False, indent=2)
            logger.info(f"Saved training intents to {filename}")
            return True
        except Exception as e:
            logger.error(f"Error saving training intents: {e}")
            return False
    
    def save_ai_training_texts(self, filename="truong_ai_training.txt"):
        """Lưu AI training texts"""
        try:
            training_texts = self.generate_ai_training_text()
            
            with open(filename, 'w', encoding='utf-8') as f:
                for i, text in enumerate(training_texts):
                    f.write(f"# Training Text {i+1}\n")
                    f.write(text)
                    f.write("\n\n" + "="*50 + "\n\n")
            
            logger.info(f"Saved AI training texts to {filename}")
            return True
        except Exception as e:
            logger.error(f"Error saving AI training texts: {e}")
            return False
    
    def build_complete_profile(self):
        """Xây dựng hoàn chỉnh profile knowledge"""
        logger.info("Building complete profile knowledge...")
        
        # Lưu tất cả các file
        success_count = 0
        
        if self.save_knowledge_base():
            success_count += 1
        
        if self.save_training_intents():
            success_count += 1
        
        if self.save_ai_training_texts():
            success_count += 1
        
        # Tạo summary
        summary = {
            'files_created': success_count,
            'knowledge_areas': len(self.profile_data['knowledge_areas']),
            'skills_count': len(self.profile_data['skills_expertise']),
            'achievements_count': len(self.profile_data['achievements']),
            'training_intents': len(self.create_training_intents()),
            'ai_training_texts': len(self.generate_ai_training_text())
        }
        
        return summary


def main():
    """Test profile knowledge builder"""
    builder = ProfileKnowledgeBuilder()
    
    summary = builder.build_complete_profile()
    
    print("=== Profile Knowledge Builder Summary ===")
    for key, value in summary.items():
        print(f"{key}: {value}")
    
    # Hiển thị một phần knowledge base
    print("\n=== Sample Knowledge ===")
    print(f"Name: {builder.profile_data['basic_info']['full_name']}")
    print(f"Position: {builder.profile_data['basic_info']['position']}")
    print(f"Company: {builder.profile_data['basic_info']['company']}")
    print(f"Skills: {builder.profile_data['skills_expertise'][:3]}...")


if __name__ == "__main__":
    main()
