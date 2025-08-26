#!/usr/bin/env python3
"""
Auto Trainer for Eco Bắc Giang Chatbot
Tự động training chatbot từ conversations mới
"""

import time
import schedule
import requests
import json
import logging
from datetime import datetime, timedelta
import os
import sys

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from conversation_manager import ConversationManager

# Configuration
BACKEND_URL = "http://localhost:5000"
TRAINING_INTERVAL_HOURS = 6  # Training mỗi 6 giờ
MIN_CONVERSATIONS_FOR_TRAINING = 50  # Ít nhất 50 conversations mới
MAX_CONVERSATIONS_PER_TRAINING = 1000  # Tối đa 1000 conversations mỗi lần training
AUTO_BACKUP = True  # Tự động backup intents
AUTO_CLEANUP_DAYS = 90  # Tự động dọn dẹp conversations cũ

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('auto_trainer.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class AutoTrainer:
    """Tự động training chatbot từ conversations"""
    
    def __init__(self):
        self.conversation_manager = ConversationManager()
        self.last_training_time = None
        self.training_count = 0
        self.successful_trainings = 0
        self.failed_trainings = 0
        
    def check_conversations_ready(self):
        """Kiểm tra số conversations sẵn sàng training"""
        try:
            stats = self.conversation_manager.conversation_service.get_conversation_stats()
            pending_count = stats.get('pending', 0)
            total_count = stats.get('total_conversations', 0)
            
            logger.info(f"📊 Conversations status: {pending_count} pending, {total_count} total")
            return pending_count, total_count
            
        except Exception as e:
            logger.error(f"❌ Error checking conversations: {e}")
            return 0, 0
    
    def auto_train(self):
        """Tự động training từ conversations mới"""
        try:
            logger.info("🤖 Starting auto-training...")
            
            # Kiểm tra conversations sẵn sàng
            pending_count, total_count = self.check_conversations_ready()
            
            if pending_count < MIN_CONVERSATIONS_FOR_TRAINING:
                logger.info(f"⏳ Not enough conversations for training: {pending_count} < {MIN_CONVERSATIONS_FOR_TRAINING}")
                return False
            
            # Giới hạn số conversations để training
            training_limit = min(pending_count, MAX_CONVERSATIONS_PER_TRAINING)
            
            logger.info(f"🎯 Training from {training_limit} conversations (out of {pending_count} pending)")
            
            # Thực hiện training
            start_time = time.time()
            
            # Sử dụng conversation manager để training
            self.conversation_manager.train_from_conversations(
                limit=training_limit,
                update_intents=True,
                backup=AUTO_BACKUP
            )
            
            training_time = time.time() - start_time
            
            # Cập nhật thống kê
            self.training_count += 1
            self.successful_trainings += 1
            self.last_training_time = datetime.now()
            
            logger.info(f"✅ Auto-training completed successfully in {training_time:.2f}s")
            logger.info(f"📈 Training stats: {self.successful_trainings} successful, {self.failed_trainings} failed")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Auto-training failed: {e}")
            self.failed_trainings += 1
            return False
    
    def auto_cleanup(self):
        """Tự động dọn dẹp conversations cũ"""
        try:
            logger.info(f"🧹 Starting auto-cleanup (older than {AUTO_CLEANUP_DAYS} days)...")
            
            deleted_count = self.conversation_manager.conversation_service.cleanup_old_conversations(
                days_old=AUTO_CLEANUP_DAYS
            )
            
            if deleted_count > 0:
                logger.info(f"✅ Auto-cleanup completed: {deleted_count} conversations deleted")
            else:
                logger.info("ℹ️ Auto-cleanup: No old conversations to delete")
                
        except Exception as e:
            logger.error(f"❌ Auto-cleanup failed: {e}")
    
    def export_training_summary(self):
        """Xuất báo cáo training định kỳ"""
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"training_summary_{timestamp}.json"
            
            summary = {
                "timestamp": datetime.now().isoformat(),
                "training_stats": {
                    "total_trainings": self.training_count,
                    "successful": self.successful_trainings,
                    "failed": self.failed_trainings,
                    "success_rate": (self.successful_trainings / self.training_count * 100) if self.training_count > 0 else 0
                },
                "last_training": self.last_training_time.isoformat() if self.last_training_time else None,
                "conversation_stats": self.conversation_manager.conversation_service.get_conversation_stats()
            }
            
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(summary, f, ensure_ascii=False, indent=2)
            
            logger.info(f"📊 Training summary exported to: {filename}")
            
        except Exception as e:
            logger.error(f"❌ Error exporting training summary: {e}")
    
    def health_check(self):
        """Kiểm tra sức khỏe hệ thống"""
        try:
            response = requests.get(f"{BACKEND_URL}/health", timeout=5)
            if response.status_code == 200:
                logger.info("🏥 Backend health check: OK")
                return True
            else:
                logger.warning(f"⚠️ Backend health check: Status {response.status_code}")
                return False
        except Exception as e:
            logger.error(f"❌ Backend health check failed: {e}")
            return False
    
    def run_scheduled_training(self):
        """Chạy training theo lịch"""
        logger.info("⏰ Scheduled training triggered")
        
        # Kiểm tra sức khỏe backend trước
        if not self.health_check():
            logger.warning("⚠️ Backend not healthy, skipping scheduled training")
            return
        
        # Thực hiện training
        success = self.auto_train()
        
        if success:
            # Xuất báo cáo mỗi 10 lần training thành công
            if self.successful_trainings % 10 == 0:
                self.export_training_summary()
    
    def run_scheduled_cleanup(self):
        """Chạy cleanup theo lịch"""
        logger.info("⏰ Scheduled cleanup triggered")
        self.auto_cleanup()
    
    def start_scheduler(self):
        """Khởi động scheduler"""
        logger.info("🚀 Starting Auto-Trainer Scheduler...")
        
        # Lập lịch training
        schedule.every(TRAINING_INTERVAL_HOURS).hours.do(self.run_scheduled_training)
        logger.info(f"📅 Training scheduled every {TRAINING_INTERVAL_HOURS} hours")
        
        # Lập lịch cleanup (mỗi ngày lúc 3h sáng)
        schedule.every().day.at("03:00").do(self.run_scheduled_cleanup)
        logger.info("📅 Cleanup scheduled daily at 03:00")
        
        # Lập lịch xuất báo cáo (mỗi tuần)
        schedule.every().sunday.at("02:00").do(self.export_training_summary)
        logger.info("📅 Summary export scheduled weekly on Sunday at 02:00")
        
        logger.info("✅ Scheduler started successfully")
        
        try:
            while True:
                schedule.run_pending()
                time.sleep(60)  # Kiểm tra mỗi phút
                
        except KeyboardInterrupt:
            logger.info("⚠️ Scheduler stopped by user")
        except Exception as e:
            logger.error(f"❌ Scheduler error: {e}")
    
    def run_once(self):
        """Chạy training một lần"""
        logger.info("🎯 Running one-time training...")
        
        if not self.health_check():
            logger.error("❌ Backend not healthy, cannot proceed")
            return False
        
        success = self.auto_train()
        
        if success:
            logger.info("✅ One-time training completed successfully")
        else:
            logger.error("❌ One-time training failed")
        
        return success
    
    def get_status(self):
        """Lấy trạng thái hiện tại"""
        status = {
            "running": True,
            "last_training": self.last_training_time.isoformat() if self.last_training_time else None,
            "training_stats": {
                "total": self.training_count,
                "successful": self.successful_trainings,
                "failed": self.failed_trainings,
                "success_rate": (self.successful_trainings / self.training_count * 100) if self.training_count > 0 else 0
            },
            "next_training": schedule.next_run().isoformat() if schedule.jobs else None,
            "conversation_stats": self.conversation_manager.conversation_service.get_conversation_stats()
        }
        
        return status

def main():
    """Main function"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Auto Trainer for Eco Bắc Giang Chatbot")
    parser.add_argument('--mode', choices=['scheduler', 'once', 'status'], default='scheduler',
                       help='Run mode: scheduler (continuous), once (one-time), status (check status)')
    parser.add_argument('--interval', type=int, default=6,
                       help='Training interval in hours (default: 6)')
    parser.add_argument('--min-conversations', type=int, default=50,
                       help='Minimum conversations for training (default: 50)')
    parser.add_argument('--max-conversations', type=int, default=1000,
                       help='Maximum conversations per training (default: 1000)')
    
    args = parser.parse_args()
    
    # Cập nhật config
    TRAINING_INTERVAL_HOURS = args.interval
    MIN_CONVERSATIONS_FOR_TRAINING = args.min_conversations
    MAX_CONVERSATIONS_PER_TRAINING = args.max_conversations
    
    # Khởi tạo auto trainer
    trainer = AutoTrainer()
    
    try:
        if args.mode == 'scheduler':
            logger.info(f"🚀 Starting Auto-Trainer in scheduler mode")
            logger.info(f"📊 Config: {TRAINING_INTERVAL_HOURS}h interval, {MIN_CONVERSATIONS_FOR_TRAINING} min convs, {MAX_CONVERSATIONS_PER_TRAINING} max convs")
            trainer.start_scheduler()
            
        elif args.mode == 'once':
            logger.info("🎯 Running one-time training")
            success = trainer.run_once()
            sys.exit(0 if success else 1)
            
        elif args.mode == 'status':
            status = trainer.get_status()
            print(json.dumps(status, indent=2, ensure_ascii=False))
            
    except KeyboardInterrupt:
        logger.info("⚠️ Auto-Trainer stopped by user")
    except Exception as e:
        logger.error(f"❌ Auto-Trainer error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()
