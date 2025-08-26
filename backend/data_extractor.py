#!/usr/bin/env python3
"""
Script để lấy dữ liệu từ MongoDB và trang giới thiệu để train AI
"""

import json
import os
import sys
from pymongo import MongoClient
from dotenv import load_dotenv
import re
from datetime import datetime

# Load environment variables
load_dotenv()

class DataExtractor:
    def __init__(self):
        self.mongo_uri = 'mongodb+srv://baccgiangeco7:Truong2024@cluster0.8cx3qwo.mongodb.net/ecobacgiang_db?retryWrites=true&w=majority'
        self.client = None
        self.db = None
        self.connect_db()
        
    def connect_db(self):
        """Kết nối MongoDB"""
        try:
            self.client = MongoClient(self.mongo_uri)
            # Extract database name from URI
            if 'ecobacgiang_db' in self.mongo_uri:
                db_name = 'ecobacgiang_db'
            else:
                db_name = self.mongo_uri.split('/')[-1].split('?')[0] if '/' in self.mongo_uri else 'ecobacgiang'
            self.db = self.client[db_name]
            
            # Test connection
            self.client.admin.command('ping')
            print(f"✅ Kết nối MongoDB thành công: {db_name}")
            
        except Exception as e:
            print(f"❌ Lỗi kết nối MongoDB: {e}")
            print("💡 Đảm bảo MongoDB đang chạy và MONGODB_URI đúng")
            
    def extract_products(self):
        """Lấy dữ liệu sản phẩm từ MongoDB"""
        try:
            products_collection = self.db.products
            products = list(products_collection.find({}, {
                'name': 1,
                'description': 1, 
                'price': 1,
                'category': 1,
                'tags': 1,
                '_id': 0
            }))
            
            print(f"✅ Lấy được {len(products)} sản phẩm")
            return products
            
        except Exception as e:
            print(f"❌ Lỗi lấy dữ liệu sản phẩm: {e}")
            return []
            
    def extract_posts(self):
        """Lấy dữ liệu bài viết từ MongoDB"""
        try:
            posts_collection = self.db.posts
            posts = list(posts_collection.find({}, {
                'title': 1,
                'content': 1,
                'excerpt': 1,
                'tags': 1,
                '_id': 0
            }))
            
            print(f"✅ Lấy được {len(posts)} bài viết")
            return posts
            
        except Exception as e:
            print(f"❌ Lỗi lấy dữ liệu bài viết: {e}")
            return []
            
    def extract_about_content(self):
        """Trích xuất nội dung từ các file giới thiệu"""
        about_content = {
            "company_info": {
                "name": "Eco Bắc Giang",
                "philosophy": "Sản xuất hữu cơ thuận tự nhiên với 5 nguyên tắc KHÔNG",
                "principles": [
                    "KHÔNG THUỐC BẢO VỆ THỰC VẬT HOÁ HỌC",
                    "KHÔNG PHÂN BÓN HOÁ HỌC", 
                    "KHÔNG CÂY TRỒNG BIẾN ĐỔI GEN",
                    "KHÔNG CHẤT KÍCH THÍCH SINH TRƯỞNG",
                    "KHÔNG THUỐC DIỆT CỎ"
                ],
                "description": "Eco Bắc Giang không chỉ đơn thuần là một công ty nông nghiệp, mà còn là biểu tượng của sự đổi mới trong ngành nông nghiệp Việt Nam. Được thành lập dựa trên nền tảng của tri thức hiện đại và tình yêu thiên nhiên.",
                "vision": {
                    "description": "Eco Bắc Giang hướng tới trở thành thương hiệu dẫn đầu trong lĩnh vực nông nghiệp thông minh và sản xuất hữu cơ bền vững tại Việt Nam",
                    "goals": [
                        "Thương hiệu dẫn đầu trong nông nghiệp thông minh và sản xuất hữu cơ bền vững",
                        "Phát triển mô hình kinh tế xanh, tôn trọng quy luật tự nhiên",
                        "Góp phần vào mục tiêu Net Zero 2050",
                        "Xây dựng nền nông nghiệp bền vững, hài hòa giữa lợi ích kinh tế, trách nhiệm xã hội và bảo vệ môi trường"
                    ]
                },
                "mission": {
                    "description": "Thực hiện những sứ mệnh quan trọng để xây dựng tương lai nông nghiệp bền vững",
                    "goals": [
                        "Sản xuất hữu cơ chất lượng cao - Cung cấp các loại rau củ hữu cơ sạch, an toàn, đảm bảo tiêu chuẩn quốc tế",
                        "Thuận tự nhiên - Canh tác theo quy luật tự nhiên, giảm thiểu tác động xấu đến môi trường",
                        "Ứng dụng công nghệ thông minh - Phát triển IoT, hệ thống tự động hóa và robot để tối ưu hóa sản xuất",
                        "Phát triển kinh tế xanh - Thực hiện nguyên tắc ESG (Môi trường, Xã hội và Quản trị)",
                        "Hỗ trợ cộng đồng nông nghiệp - Đồng hành cùng nông dân chuyển đổi sang nông nghiệp thông minh"
                    ]
                },
                "strategy": {
                    "name": "Chuyển đổi kép",
                    "description": "Một trong những chiến lược quan trọng của Eco Bắc Giang",
                    "components": [
                        "Chuyển đổi số - Tối ưu hóa quy trình sản xuất qua dữ liệu và công nghệ IoT, Robots",
                        "Chuyển đổi xanh - Sử dụng phương pháp sản xuất thân thiện với môi trường"
                    ],
                    "benefits": [
                        "Nâng cao năng suất và hiệu quả kinh tế",
                        "Đảm bảo bảo vệ môi trường",
                        "Nâng cao chất lượng cuộc sống",
                        "Góp phần vào mục tiêu phát triển bền vững của quốc gia"
                    ]
                },
                "core_values": [
                    "Bền vững (Sustainability) - Cam kết phát triển hài hòa giữa kinh tế, xã hội và bảo vệ môi trường",
                    "Thuận tự nhiên (Harmony with Nature) - Tôn trọng và giữ vững sự cân bằng tự nhiên",
                    "Đổi mới sáng tạo (Innovation) - Liên tục nghiên cứu và ứng dụng công nghệ hiện đại",
                    "Chất lượng (Quality) - Đảm bảo cung cấp sản phẩm rau củ hữu cơ đạt tiêu chuẩn cao nhất",
                    "Trách nhiệm xã hội (Social Responsibility) - Thực hiện trách nhiệm với cộng đồng và hệ sinh thái",
                    "Đồng hành và kết nối (Collaboration) - Xây dựng mạng lưới hợp tác chặt chẽ với nông dân",
                    "Tận tâm và chính trực (Commitment & Integrity) - Hoạt động minh bạch và có đạo đức",
                    "Hướng đến tương lai (Future-oriented) - Hướng tới các giải pháp lâu dài cho tương lai xanh"
                ],
                "logo_meaning": {
                    "slogan": "Agriculture of Thinks",
                    "description": "Biểu tượng kết hợp hoàn hảo giữa nông nghiệp hữu cơ và công nghệ cao",
                    "meaning": "Nhấn mạnh vào tư duy sáng tạo và đổi mới trong nông nghiệp, áp dụng AI, IoT, và robot để cải thiện hiệu quả sản xuất",
                    "inspiration": [
                        "AI (Artificial Intelligence) - Ứng dụng trí tuệ nhân tạo vào nông nghiệp",
                        "IoT (Internet of Things) - Quản lý môi trường canh tác thông minh và tự động hóa"
                    ],
                    "colors": [
                        "Màu xanh lá cây (#009245) - Đại diện cho sự phát triển bền vững và thân thiện với môi trường",
                        "Màu cam (#FBB03B) - Tượng trưng cho sự sáng tạo, đổi mới và năng lượng tích cực",
                        "Màu đen (#000000) - Mang lại sự chuyên nghiệp và hiện đại"
                    ],
                    "symbol": "Chữ 'C' được tạo thành bởi hai hình tròn lồng ghép, gợi liên tưởng đến biểu tượng vô cực, thể hiện sáng tạo không giới hạn"
                },
                "technology": [
                    "Agriculture of Thinks (AoT) - Nông nghiệp trong suy nghĩ",
                    "Ứng dụng AI và IoT trong nông nghiệp",
                    "Hệ thống tự động hóa và robot",
                    "Giám sát 24/7 môi trường canh tác",
                    "Quản lý thông minh dựa trên dữ liệu"
                ]
            }
        }
        
        print("✅ Trích xuất thông tin công ty thành công")
        return about_content
        
    def generate_training_intents(self, products, posts, about_content):
        """Tạo training data cho AI từ dữ liệu thật"""
        
        # Base intents (giữ nguyên)
        intents = {
            "intents": [
                {
                    "tag": "greeting",
                    "patterns": [
                        "Xin chào", "Chào bạn", "Hi", "Hello", "Chào",
                        "Hey", "Chào buổi sáng", "Chào buổi chiều", "Chào buổi tối"
                    ],
                    "responses": [
                        "Xin chào! 😊 Em là Mai trợ lý ảo của Eco Bắc Giang! Rất vui được gặp anh chị hôm nay! Anh chị đang quan tâm đến sản phẩm nào của chúng em? Em sẵn sàng tư vấn tận tình nhé! 🌿✨",
                        "Chào anh chị thân yêu! 🤗 Em là Mai - tư vấn viên của Eco Bắc Giang! Hôm nay anh chị cần em hỗ trợ gì về các sản phẩm hữu cơ không? Cứ thoải mái nhé! 💚",
                        "Hello! 👋 Em là Mai đây! Rất hạnh phúc được chia sẻ với anh chị về những sản phẩm hữu cơ tuyệt vời của Eco Bắc Giang! Anh chị muốn tìm hiểu về gì nhỉ? 🌱"
                    ]
                },
                {
                    "tag": "company_info", 
                    "patterns": [
                        "Công ty của bạn là gì", "Eco Bắc Giang là gì", "Giới thiệu công ty",
                        "Bạn làm gì", "Về công ty", "Công ty bạn hoạt động lĩnh vực gì",
                        "Eco Bắc Giang chuyên về gì", "Tôi muốn biết về công ty"
                    ],
                    "responses": [
                        f"Ôi! Em rất tự hào khi nói về Eco Bắc Giang! 😍 {about_content['company_info']['description']} Em cam kết {about_content['company_info']['philosophy']} với 5 nguyên tắc KHÔNG siêu nghiêm ngặt! 🌟💚",
                        f"Em là thành viên của đại gia đình Eco Bắc Giang! 🏡 {about_content['company_info']['vision']['description']} với {about_content['company_info']['strategy']['name']} - một ước mơ mà em theo đuổi mỗi ngày! ✨🌱",
                        f"Eco Bắc Giang - đó chính là niềm đam mê của em! 💖 Chúng em tin tưởng tuyệt đối vào {about_content['company_info']['logo_meaning']['slogan']} và {about_content['company_info']['philosophy']}, tôn trọng từng cọng cỏ, từng hạt đất! 🌿"
                    ]
                },
                {
                    "tag": "organic_principles",
                    "patterns": [
                        "5 nguyên tắc KHÔNG là gì", "Nguyên tắc sản xuất", "Sản xuất hữu cơ",
                        "Không dùng hóa chất", "An toàn thực phẩm", "Quy trình sản xuất",
                        "Tiêu chuẩn hữu cơ", "Sản phẩm có an toàn không"
                    ],
                    "responses": [
                        f"Chúng tôi áp dụng 5 nguyên tắc KHÔNG: {', '.join(about_content['company_info']['principles'])}.",
                        f"Sản phẩm Eco Bắc Giang được sản xuất với {about_content['company_info']['philosophy']} theo 5 nguyên tắc KHÔNG để đảm bảo an toàn tuyệt đối.",
                        "Tất cả sản phẩm của chúng tôi đều không sử dụng thuốc bảo vệ thực vật, phân bón hóa học, cây biến đổi gen, chất kích thích sinh trưởng và thuốc diệt cỏ."
                    ]
                }
            ]
        }
        
        # Thêm intent cho sản phẩm
        if products:
            product_names = [p.get('name', '') for p in products if p.get('name')]
            product_categories = list(set([p.get('category', '') for p in products if p.get('category')]))
            
            intents["intents"].append({
                "tag": "product_inquiry",
                "patterns": [
                    "Sản phẩm gì", "Bán gì", "Có những sản phẩm nào", "Menu",
                    "Danh sách sản phẩm", "Sản phẩm nào hot", "Sản phẩm bán chạy",
                    "Tôi muốn mua", "Có bán gì", "Sản phẩm nổi bật"
                ] + [f"Có {name} không" for name in product_names[:5]],
                "responses": [
                    f"Chúng tôi có {len(products)} sản phẩm hữu cơ chất lượng cao. Các danh mục chính: {', '.join(product_categories[:3])}.",
                    f"Sản phẩm nổi bật của Eco Bắc Giang bao gồm: {', '.join(product_names[:3])}. Tất cả đều được sản xuất theo tiêu chuẩn hữu cơ.",
                    "Chúng tôi chuyên cung cấp rau củ quả hữu cơ tươi ngon, an toàn. Bạn quan tâm sản phẩm nào cụ thể?"
                ]
            })
            
        # Thêm intent cho giá cả
        if products:
            price_products = [p for p in products if p.get('price')]
            intents["intents"].append({
                "tag": "pricing",
                "patterns": [
                    "Giá", "Bao nhiêu tiền", "Chi phí", "Giá cả", "Giá sản phẩm",
                    "Có đắt không", "Giá rẻ", "Khuyến mãi", "Giảm giá"
                ],
                "responses": [
                    "Giá sản phẩm hữu cơ của chúng em rất cạnh tranh. Anh chị muốn hỏi giá sản phẩm nào cụ thể?",
                    "Chúng em cam kết giá tốt nhất cho sản phẩm hữu cơ chất lượng. Vui lòng cho biết sản phẩm anh chị quan tâm.",
                    "Giá của Eco Bắc Giang phù hợp với chất lượng hữu cơ cao cấp. Liên hệ để biết giá chi tiết nhé!"
                ]
            })
            
        # Thêm intent cho tầm nhìn
        intents["intents"].append({
            "tag": "vision",
            "patterns": [
                "Tầm nhìn", "Vision", "Mục tiêu", "Định hướng", "Tương lai", "Kế hoạch phát triển",
                "Hướng đến", "Eco Bắc Giang hướng tới", "Mong muốn", "Ước mơ"
            ],
            "responses": [
                f"🎯 Tầm nhìn của chúng em thật tuyệt vời! {about_content['company_info']['vision']['description']}! Em mơ ước một ngày nông nghiệp Việt Nam dẫn đầu thế giới! 🚀",
                f"Em tin rằng tương lai sẽ rất xanh! 🌱 Chúng em hướng tới {about_content['company_info']['vision']['goals'][0]} và {about_content['company_info']['vision']['goals'][1]}! Cùng em xây dựng tương lai bền vững nhé! 💚",
                f"Ôi, anh chị hỏi về tầm nhìn à? Em siêu hào hứng! 😍 Chúng em muốn {about_content['company_info']['vision']['goals'][2]} và {about_content['company_info']['vision']['goals'][3]}! Thật ý nghĩa phải không? 🌍✨"
            ]
        })
        
        # Thêm intent cho sứ mệnh
        intents["intents"].append({
            "tag": "mission", 
            "patterns": [
                "Sứ mệnh", "Mission", "Nhiệm vụ", "Trách nhiệm", "Cam kết", "Eco Bắc Giang làm gì",
                "Mục đích", "Ý nghĩa", "Giá trị mang lại", "Đóng góp"
            ],
            "responses": [
                f"💝 Sứ mệnh của em thật ý nghĩa! {about_content['company_info']['mission']['description']}! Em cam kết thực hiện từng ngày để tạo ra thay đổi tích cực! 🌟",
                f"Em có 5 sứ mệnh quan trọng lắm: ✨ {about_content['company_info']['mission']['goals'][0]}, {about_content['company_info']['mission']['goals'][1]}, và {about_content['company_info']['mission']['goals'][2]}! Anh chị thấy ý nghĩa không? 💚",
                f"Wao! Em rất tự hào về sứ mệnh này! 🤗 Chúng em muốn {about_content['company_info']['mission']['goals'][3]} và {about_content['company_info']['mission']['goals'][4]}! Cùng em góp phần xây dựng tương lai xanh nhé! 🌱"
            ]
        })
        
        # Thêm intent cho giá trị cốt lõi
        intents["intents"].append({
            "tag": "core_values",
            "patterns": [
                "Giá trị cốt lõi", "Core values", "Nguyên tắc", "Triết lý", "Văn hóa công ty",
                "Giá trị", "Đặc trưng", "Điểm nổi bật", "Eco Bắc Giang tin vào điều gì"
            ],
            "responses": [
                f"💎 Em có 8 giá trị cốt lõi siêu đặc biệt! Đầu tiên là {about_content['company_info']['core_values'][0]}, {about_content['company_info']['core_values'][1]}, và {about_content['company_info']['core_values'][2]}! Những giá trị này dẫn dắt mọi quyết định của em! ✨",
                f"Ôi em yêu những giá trị này lắm! 😍 {about_content['company_info']['core_values'][3]}, {about_content['company_info']['core_values'][4]}, {about_content['company_info']['core_values'][5]}! Đây chính là DNA của Eco Bắc Giang! 🧬💚",
                f"Giá trị cuối cùng cũng rất quan trọng: {about_content['company_info']['core_values'][6]} và {about_content['company_info']['core_values'][7]}! 🤝 Tổng cộng 8 giá trị tạo nên một Eco Bắc Giang hoàn hảo! Anh chị thích giá trị nào nhất? 🌟"
            ]
        })
        
        # Thêm intent cho ý nghĩa logo
        intents["intents"].append({
            "tag": "logo_meaning",
            "patterns": [
                "Ý nghĩa logo", "Logo", "Biểu tượng", "Agriculture of Thinks", "AoT", "Thiết kế",
                "Màu sắc", "Hình dạng", "Slogan", "Câu khẩu hiệu", "Ý tưởng logo"
            ],
            "responses": [
                f"🎨 Ôi, em siêu tự hào về logo! Slogan '{about_content['company_info']['logo_meaning']['slogan']}' có nghĩa là {about_content['company_info']['logo_meaning']['meaning']}! Quá sáng tạo phải không? 🚀💡",
                f"Logo em được lấy cảm hứng từ {about_content['company_info']['logo_meaning']['inspiration'][0]} và {about_content['company_info']['logo_meaning']['inspiration'][1]}! 🤖🌱 {about_content['company_info']['logo_meaning']['description']}! Em yêu thiết kế này lắm! 💖",
                f"Màu sắc logo cũng rất ý nghĩa! {about_content['company_info']['logo_meaning']['colors'][0]}, {about_content['company_info']['logo_meaning']['colors'][1]}, {about_content['company_info']['logo_meaning']['colors'][2]}! 🎨 Còn {about_content['company_info']['logo_meaning']['symbol']}! Đẹp quá phải không? ✨"
            ]
        })
        
        # Thêm intent cho công nghệ
        intents["intents"].append({
            "tag": "technology",
            "patterns": [
                "Công nghệ", "Technology", "AI", "IoT", "Robot", "Tự động hóa", "Thông minh",
                "Agriculture of Thinks", "Chuyển đổi số", "Innovation", "Hiện đại"
            ],
            "responses": [
                f"🤖 Em siêu hứng thú với công nghệ! Chúng em áp dụng {about_content['company_info']['technology'][0]} và {about_content['company_info']['technology'][1]}! {about_content['company_info']['strategy']['components'][0]}! Tương lai nông nghiệp ở đây rồi! 🚀",
                f"Công nghệ là đam mê của em! 💻 {about_content['company_info']['technology'][2]}, {about_content['company_info']['technology'][3]}, {about_content['company_info']['technology'][4]}! {about_content['company_info']['strategy']['description']} - quá tuyệt vời! 🌟",
                f"Em tin {about_content['company_info']['strategy']['components'][1]} kết hợp với công nghệ sẽ mang lại {about_content['company_info']['strategy']['benefits'][0]} và {about_content['company_info']['strategy']['benefits'][1]}! Anh chị có muốn tìm hiểu thêm không? 🌱💚"
                ]
            })
            
        # Thêm intent từ bài viết/blog
        if posts:
            intents["intents"].append({
                "tag": "knowledge_sharing",
                "patterns": [
                    "Kiến thức", "Học hỏi", "Thông tin", "Bài viết", "Chia sẻ",
                    "Cách trồng", "Chăm sóc", "Dinh dưỡng", "Lợi ích", "Tác dụng"
                ],
                "responses": [
                    f"Chúng em có {len(posts)} bài viết chia sẻ kiến thức về nông nghiệp hữu cơ và sức khỏe.",
                    "Eco Bắc Giang thường xuyên chia sẻ kiến thức về sản xuất hữu cơ, dinh dưỡng và sức khỏe. Anh chị quan tâm chủ đề nào?",
                    "Chúng em có nhiều bài viết hữu ích về cách chăm sóc sức khỏe bằng thực phẩm hữu cơ."
                ]
            })
            
        return intents
        
    def save_training_data(self, intents, filename="intents_updated.json"):
        """Lưu training data"""
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(intents, f, ensure_ascii=False, indent=2)
            
            print(f"✅ Đã lưu training data vào {filename}")
            print(f"📊 Tổng cộng {len(intents['intents'])} intents")
            
        except Exception as e:
            print(f"❌ Lỗi lưu file: {e}")
            
    def run(self):
        """Chạy toàn bộ quá trình"""
        print("🚀 Bắt đầu thu thập dữ liệu...")
        
        # 1. Lấy dữ liệu từ DB
        products = self.extract_products()
        posts = self.extract_posts() 
        
        # 2. Lấy thông tin công ty
        about_content = self.extract_about_content()
        
        # 3. Tạo training data
        intents = self.generate_training_intents(products, posts, about_content)
        
        # 4. Lưu file
        self.save_training_data(intents)
        
        # 5. Thống kê
        print("\n📈 THỐNG KÊ:")
        print(f"   📦 Sản phẩm: {len(products)}")
        print(f"   📝 Bài viết: {len(posts)}")
        print(f"   🎯 Intents: {len(intents['intents'])}")
        print(f"   🤖 Training patterns: {sum(len(intent['patterns']) for intent in intents['intents'])}")
        
        if self.client:
            self.client.close()
            
        print("\n✅ Hoàn thành! Sử dụng intents_updated.json để train AI.")

if __name__ == "__main__":
    extractor = DataExtractor()
    extractor.run()
