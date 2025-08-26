#!/usr/bin/env python3
"""
Conversation Manager for Eco Bắc Giang Chatbot
Quản lý conversation và training chatbot từ dữ liệu thực tế
"""

import json
import datetime
import argparse
import sys
import os
from pathlib import Path

# Add current directory to path to import app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import ConversationService, ChatbotEngine

class ConversationManager:
    """Quản lý conversation và training chatbot"""
    
    def __init__(self):
        self.conversation_service = ConversationService()
        self.chatbot = ChatbotEngine()
        
    def show_stats(self):
        """Hiển thị thống kê conversation"""
        print("📊 CONVERSATION STATISTICS")
        print("=" * 50)
        
        try:
            stats = self.conversation_service.get_conversation_stats()
            
            if stats:
                print(f"Total Conversations: {stats.get('total_conversations', 0)}")
                print(f"Training Ready: {stats.get('training_ready', 0)}")
                print(f"Processed: {stats.get('processed', 0)}")
                print(f"Pending: {stats.get('pending', 0)}")
                print(f"Failed: {stats.get('failed', 0)}")
                
                # Tính tỷ lệ
                total = stats.get('total_conversations', 0)
                if total > 0:
                    ready_pct = (stats.get('training_ready', 0) / total) * 100
                    processed_pct = (stats.get('processed', 0) / total) * 100
                    print(f"\nTraining Ready Rate: {ready_pct:.1f}%")
                    print(f"Processed Rate: {processed_pct:.1f}%")
            else:
                print("❌ No statistics available")
                
        except Exception as e:
            print(f"❌ Error getting stats: {e}")
    
    def export_training_data(self, format_type="json", output_file=None):
        """Xuất dữ liệu training"""
        print(f"📤 EXPORTING TRAINING DATA (Format: {format_type.upper()})")
        print("=" * 50)
        
        try:
            training_data = self.conversation_service.export_training_data(format=format_type)
            
            if not training_data:
                print("❌ No training data available")
                return
            
            if format_type == "json":
                count = len(training_data)
                print(f"✅ Exported {count} conversation records")
                
                if output_file:
                    with open(output_file, 'w', encoding='utf-8') as f:
                        json.dump(training_data, f, ensure_ascii=False, indent=2)
                    print(f"💾 Saved to: {output_file}")
                else:
                    # Hiển thị sample data
                    print("\n📋 Sample Data:")
                    for i, conv in enumerate(training_data[:3]):
                        print(f"{i+1}. User: {conv.get('user_message', '')[:50]}...")
                        print(f"   Bot: {conv.get('bot_response', '')[:50]}...")
                        print(f"   Intent: {conv.get('intent', 'N/A')}")
                        print()
                    
            elif format_type == "intents":
                intents = training_data.get('intents', [])
                print(f"✅ Exported {len(intents)} intent groups")
                
                if output_file:
                    with open(output_file, 'w', encoding='utf-8') as f:
                        json.dump(training_data, f, ensure_ascii=False, indent=2)
                    print(f"💾 Saved to: {output_file}")
                else:
                    # Hiển thị intent summary
                    print("\n📋 Intent Summary:")
                    for intent in intents:
                        tag = intent.get('tag', 'N/A')
                        patterns = len(intent.get('patterns', []))
                        responses = len(intent.get('responses', []))
                        print(f"  {tag}: {patterns} patterns, {responses} responses")
                        
        except Exception as e:
            print(f"❌ Error exporting training data: {e}")
    
    def train_from_conversations(self, limit=1000, update_intents=True, backup=True):
        """Training chatbot từ conversations"""
        print("🤖 TRAINING CHATBOT FROM CONVERSATIONS")
        print("=" * 50)
        
        try:
            # Lấy conversations để training
            conversations = self.conversation_service.get_conversations_for_training(limit=limit)
            
            if not conversations:
                print("❌ No conversations available for training")
                return
            
            print(f"📚 Found {len(conversations)} conversations for training")
            
            # Tạo training data
            intent_mapping = {}
            for conv in conversations:
                user_msg = conv.get('user_message', '').strip()
                bot_resp = conv.get('bot_response', '').strip()
                intent = conv.get('intent', 'general')
                
                if user_msg and bot_resp:
                    if intent not in intent_mapping:
                        intent_mapping[intent] = {
                            'patterns': [],
                            'responses': []
                        }
                    
                    intent_mapping[intent]['patterns'].append(user_msg)
                    intent_mapping[intent]['responses'].append(bot_resp)
            
            print(f"🎯 Identified {len(intent_mapping)} intent groups")
            
            if update_intents and intent_mapping:
                # Backup intents file
                if backup:
                    timestamp = int(datetime.datetime.utcnow().timestamp())
                    backup_file = f"intents_backup_{timestamp}.json"
                    
                    try:
                        import shutil
                        shutil.copy2(self.chatbot.intents_file, backup_file)
                        print(f"💾 Backed up intents to: {backup_file}")
                    except Exception as e:
                        print(f"⚠️ Backup failed: {e}")
                        backup_file = None
                
                # Cập nhật intents
                print("🔄 Updating intents file...")
                
                updated_intents = {"intents": []}
                
                # Giữ lại intents cũ
                if self.chatbot.intents_data and self.chatbot.intents_data.get('intents'):
                    updated_intents['intents'] = self.chatbot.intents_data['intents'].copy()
                
                # Thêm patterns và responses mới
                patterns_added = 0
                responses_added = 0
                
                for intent, data in intent_mapping.items():
                    # Tìm intent hiện có
                    existing_intent = None
                    for existing in updated_intents['intents']:
                        if existing.get('tag') == intent:
                            existing_intent = existing
                            break
                    
                    if existing_intent:
                        # Cập nhật intent hiện có
                        existing_patterns = set(existing_intent.get('patterns', []))
                        existing_responses = set(existing_intent.get('responses', []))
                        
                        old_patterns = len(existing_patterns)
                        old_responses = len(existing_responses)
                        
                        # Thêm patterns mới (không trùng lặp)
                        for pattern in data['patterns']:
                            if pattern not in existing_patterns:
                                existing_patterns.add(pattern)
                        
                        # Thêm responses mới (không trùng lặp)
                        for response in data['responses']:
                            if response not in existing_responses:
                                existing_responses.add(response)
                        
                        existing_intent['patterns'] = list(existing_patterns)
                        existing_intent['responses'] = list(existing_responses)
                        
                        patterns_added += len(existing_patterns) - old_patterns
                        responses_added += len(existing_responses) - old_responses
                        
                    else:
                        # Tạo intent mới
                        new_intent = {
                            'tag': intent,
                            'patterns': data['patterns'],
                            'responses': data['responses']
                        }
                        updated_intents['intents'].append(new_intent)
                        
                        patterns_added += len(data['patterns'])
                        responses_added += len(data['responses'])
                
                # Lưu intents đã cập nhật
                with open(self.chatbot.intents_file, 'w', encoding='utf-8') as f:
                    json.dump(updated_intents, f, ensure_ascii=False, indent=2)
                
                print(f"✅ Updated intents file")
                print(f"   Patterns added: {patterns_added}")
                print(f"   Responses added: {responses_added}")
                
                # Reload intents và retrain model
                print("🔄 Reloading intents and retraining model...")
                self.chatbot.load_intents()
                self.chatbot.train_model()
                
                # Đánh dấu conversations đã được xử lý
                processed_count = 0
                for conv in conversations:
                    if self.conversation_service.mark_conversation_processed(conv['_id']):
                        processed_count += 1
                
                print(f"✅ Marked {processed_count} conversations as processed")
                
                print(f"\n🎉 Training completed successfully!")
                print(f"   Conversations processed: {len(conversations)}")
                print(f"   Intents updated: {len(intent_mapping)}")
                print(f"   Patterns added: {patterns_added}")
                print(f"   Responses added: {responses_added}")
                
                if backup_file:
                    print(f"   Backup saved: {backup_file}")
                    
            else:
                # Chỉ đánh dấu đã xử lý
                print("📝 Marking conversations as processed...")
                
                processed_count = 0
                for conv in conversations:
                    if self.conversation_service.mark_conversation_processed(conv['_id']):
                        processed_count += 1
                
                print(f"✅ Processed {processed_count} conversations without updating intents")
                
        except Exception as e:
            print(f"❌ Error during training: {e}")
            import traceback
            traceback.print_exc()
    
    def cleanup_old_conversations(self, days_old=90):
        """Dọn dẹp conversations cũ"""
        print(f"🧹 CLEANING UP OLD CONVERSATIONS (older than {days_old} days)")
        print("=" * 50)
        
        try:
            deleted_count = self.conversation_service.cleanup_old_conversations(days_old=days_old)
            
            if deleted_count > 0:
                print(f"✅ Cleaned up {deleted_count} old conversations")
            else:
                print("ℹ️ No old conversations to clean up")
                
        except Exception as e:
            print(f"❌ Error cleaning up conversations: {e}")
    
    def show_recent_conversations(self, limit=10):
        """Hiển thị conversations gần đây"""
        print(f"📝 RECENT CONVERSATIONS (Last {limit})")
        print("=" * 50)
        
        try:
            conversations = self.conversation_service.get_conversations_for_training(limit=limit)
            
            if not conversations:
                print("❌ No conversations found")
                return
            
            for i, conv in enumerate(conversations):
                timestamp = conv.get('timestamp', 'N/A')
                if isinstance(timestamp, datetime.datetime):
                    timestamp = timestamp.strftime("%Y-%m-%d %H:%M:%S")
                
                user_msg = conv.get('user_message', '')[:60]
                bot_resp = conv.get('bot_response', '')[:60]
                intent = conv.get('intent', 'N/A')
                status = conv.get('training_status', 'N/A')
                
                print(f"{i+1}. [{timestamp}] {status.upper()}")
                print(f"   User: {user_msg}...")
                print(f"   Bot: {bot_resp}...")
                print(f"   Intent: {intent}")
                print()
                
        except Exception as e:
            print(f"❌ Error showing recent conversations: {e}")

def main():
    """Main function"""
    parser = argparse.ArgumentParser(description="Conversation Manager for Eco Bắc Giang Chatbot")
    parser.add_argument('action', choices=['stats', 'export', 'train', 'cleanup', 'recent'], 
                       help='Action to perform')
    parser.add_argument('--format', choices=['json', 'intents'], default='json',
                       help='Export format (default: json)')
    parser.add_argument('--output', '-o', help='Output file for export')
    parser.add_argument('--limit', type=int, default=1000, help='Limit for conversations (default: 1000)')
    parser.add_argument('--days', type=int, default=90, help='Days old for cleanup (default: 90)')
    parser.add_argument('--no-update', action='store_true', help='Do not update intents during training')
    parser.add_argument('--no-backup', action='store_true', help='Do not backup intents file')
    
    args = parser.parse_args()
    
    manager = ConversationManager()
    
    try:
        if args.action == 'stats':
            manager.show_stats()
            
        elif args.action == 'export':
            manager.export_training_data(args.format, args.output)
            
        elif args.action == 'train':
            update_intents = not args.no_update
            backup = not args.no_backup
            manager.train_from_conversations(args.limit, update_intents, backup)
            
        elif args.action == 'cleanup':
            manager.cleanup_old_conversations(args.days)
            
        elif args.action == 'recent':
            manager.show_recent_conversations(args.limit)
            
    except KeyboardInterrupt:
        print("\n⚠️ Operation cancelled by user")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()
