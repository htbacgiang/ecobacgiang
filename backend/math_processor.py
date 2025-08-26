import re
import math
import logging
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)

class MathProcessor:
    """
    Xử lý các câu hỏi tính toán đơn giản trong chatbot
    Hỗ trợ:
    - Phép tính cơ bản (+, -, *, /)
    - Phép tính phần trăm
    - Tính diện tích, thể tích cơ bản
    - Quy đổi đơn vị đơn giản
    """
    
    def __init__(self):
        self.math_patterns = self._get_math_patterns()
        self.unit_conversions = self._get_unit_conversions()
        
    def _get_math_patterns(self) -> Dict[str, str]:
        """Các pattern để nhận diện câu hỏi tính toán"""
        return {
            'basic_calc': r'(?:tính|bằng)\s*(?:bao nhiêu)?\s*([0-9\+\-\*\/\.\(\)\s]+)',
            'percentage': r'([0-9\.]+)\s*%\s*(?:của|x)\s*([0-9\.]+)',
            'area_rectangle': r'diện tích.*(?:hình chữ nhật|chữ nhật).*(?:dài|chiều dài)\s*([0-9\.]+).*(?:rộng|chiều rộng)\s*([0-9\.]+)',
            'area_circle': r'diện tích.*(?:hình tròn|tròn).*(?:bán kính|radius)\s*([0-9\.]+)',
            'volume_box': r'thể tích.*(?:hộp|hình hộp).*(?:dài)\s*([0-9\.]+).*(?:rộng)\s*([0-9\.]+).*(?:cao)\s*([0-9\.]+)',
            'currency_calc': r'([0-9\.]+)\s*(?:đồng|vnd|usd|dollar)?\s*(?:\+|\-|\*|\/)\s*([0-9\.]+)\s*(?:đồng|vnd|usd|dollar)?',
            'price_calc': r'(?:giá|cost|chi phí).*([0-9\.]+).*(?:kg|gram|lít|meter|m|liter).*([0-9\.]+).*(?:kg|gram|lít|meter|m|liter)'
        }
    
    def _get_unit_conversions(self) -> Dict[str, Dict[str, float]]:
        """Các quy đổi đơn vị cơ bản"""
        return {
            'weight': {
                'kg_to_gram': 1000,
                'gram_to_kg': 0.001,
                'kg_to_pound': 2.20462,
                'pound_to_kg': 0.453592
            },
            'length': {
                'm_to_cm': 100,
                'cm_to_m': 0.01,
                'm_to_km': 0.001,
                'km_to_m': 1000
            },
            'volume': {
                'liter_to_ml': 1000,
                'ml_to_liter': 0.001
            }
        }
    
    def is_math_question(self, message: str) -> bool:
        """Kiểm tra xem có phải câu hỏi tính toán không"""
        message_lower = message.lower()
        
        # Từ khóa tính toán
        math_keywords = [
            'tính', 'bằng bao nhiêu', 'kết quả', 'phép tính', 'cộng', 'trừ', 'nhân', 'chia',
            'diện tích', 'thể tích', 'chu vi', 'phần trăm', '%', '=', '+', '-', '*', '/',
            'quy đổi', 'chuyển đổi', 'đơn vị', 'kg', 'gram', 'lít', 'meter'
        ]
        
        # Kiểm tra có chứa từ khóa tính toán và số
        has_math_keyword = any(keyword in message_lower for keyword in math_keywords)
        has_numbers = bool(re.search(r'\d+', message))
        
        return has_math_keyword and has_numbers
    
    def process_math_question(self, message: str, user_info: Dict = None) -> Optional[str]:
        """Xử lý câu hỏi tính toán và trả về kết quả"""
        try:
            message_lower = message.lower()
            greeting = self._get_greeting(user_info)
            
            # Thử các pattern khác nhau
            for pattern_name, pattern in self.math_patterns.items():
                match = re.search(pattern, message_lower)
                if match:
                    result = self._calculate_by_pattern(pattern_name, match, message)
                    if result:
                        return f"Em tính được kết quả cho {greeting}: {result} 🧮"
            
            # Thử tính toán cơ bản với eval (an toàn)
            calc_result = self._safe_eval(message)
            if calc_result:
                return f"Kết quả tính toán: {calc_result} ✅"
            
            return None
            
        except Exception as e:
            logger.error(f"Error processing math question: {e}")
            return None
    
    def _calculate_by_pattern(self, pattern_name: str, match: re.Match, original_message: str) -> Optional[str]:
        """Tính toán dựa trên pattern cụ thể"""
        try:
            if pattern_name == 'basic_calc':
                expression = match.group(1).strip()
                result = self._safe_eval(expression)
                return str(result) if result is not None else None
                
            elif pattern_name == 'percentage':
                percentage = float(match.group(1))
                value = float(match.group(2))
                result = (percentage / 100) * value
                return f"{percentage}% của {value} = {result:,.2f}"
                
            elif pattern_name == 'area_rectangle':
                length = float(match.group(1))
                width = float(match.group(2))
                area = length * width
                return f"Diện tích hình chữ nhật: {length} × {width} = {area:,.2f} m²"
                
            elif pattern_name == 'area_circle':
                radius = float(match.group(1))
                area = math.pi * radius * radius
                return f"Diện tích hình tròn (r={radius}): π × {radius}² = {area:,.2f} m²"
                
            elif pattern_name == 'volume_box':
                length = float(match.group(1))
                width = float(match.group(2))
                height = float(match.group(3))
                volume = length * width * height
                return f"Thể tích hình hộp: {length} × {width} × {height} = {volume:,.2f} m³"
                
            elif pattern_name == 'currency_calc':
                # Xử lý tính toán tiền tệ đơn giản
                nums = re.findall(r'[0-9\.]+', original_message)
                if len(nums) >= 2:
                    num1, num2 = float(nums[0]), float(nums[1])
                    if '+' in original_message:
                        result = num1 + num2
                        return f"{num1:,.0f} + {num2:,.0f} = {result:,.0f} đồng"
                    elif '-' in original_message:
                        result = num1 - num2
                        return f"{num1:,.0f} - {num2:,.0f} = {result:,.0f} đồng"
                    elif '*' in original_message or 'x' in original_message.lower():
                        result = num1 * num2
                        return f"{num1:,.0f} × {num2:,.0f} = {result:,.0f} đồng"
                        
        except (ValueError, ZeroDivisionError) as e:
            logger.error(f"Calculation error in pattern {pattern_name}: {e}")
            return None
            
        return None
    
    def _safe_eval(self, expression: str) -> Optional[float]:
        """Eval an toàn cho phép tính cơ bản"""
        try:
            # Chỉ cho phép các ký tự số và phép tính cơ bản
            allowed_chars = set('0123456789+-*/.() ')
            if not all(c in allowed_chars for c in expression):
                return None
            
            # Thay thế các ký tự tiếng Việt
            expression = expression.replace('x', '*').replace('×', '*')
            expression = expression.replace(':', '/').replace('÷', '/')
            
            # Loại bỏ khoảng trắng
            expression = expression.replace(' ', '')
            
            # Kiểm tra expression hợp lệ (không có __import__ etc.)
            if any(dangerous in expression for dangerous in ['import', '__', 'eval', 'exec']):
                return None
            
            result = eval(expression)
            return float(result) if isinstance(result, (int, float)) else None
            
        except:
            return None
    
    def _get_greeting(self, user_info: Dict = None) -> str:
        """Lấy cách xưng hô phù hợp"""
        if not user_info:
            return "anh chị"
        
        name = user_info.get('name', '')
        gender = user_info.get('gender', '')
        
        if name:
            name_parts = name.split()
            short_name = name_parts[-1] if name_parts else ''
            
            if gender == "Nam" and short_name:
                return f"anh {short_name}"
            elif gender == "Nữ" and short_name:
                return f"chị {short_name}"
        
        return "anh chị"
    
    def get_math_help(self, user_info: Dict = None) -> str:
        """Trả về hướng dẫn sử dụng tính năng tính toán"""
        greeting = self._get_greeting(user_info)
        
        return f"""Em có thể giúp {greeting} tính toán các phép tính đơn giản:

🧮 **Phép tính cơ bản:**
- "2 + 3 bằng mây nhiêu?"
- "100 - 25 = ?"
- "5 x 6 tính ra bao nhiêu?"

📐 **Hình học:**
- "Diện tích hình chữ nhật dài 5m rộng 3m"
- "Diện tích hình tròn bán kính 2m"
- "Thể tích hình hộp dài 2m rộng 3m cao 1.5m"

💰 **Tính toán giá cả:**
- "50000 + 30000 đồng"
- "20% của 100000"

{greeting.capitalize()} hãy thử hỏi em nhé! 😊"""

# Khởi tạo processor
math_processor = MathProcessor()
