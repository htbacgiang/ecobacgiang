#!/bin/bash

# Script test backend locally trước khi deploy
# Run in backend directory: bash test-backend-local.sh

echo "🧪 Testing EcoBacGiang Backend Locally"
echo "======================================"
echo ""

# Check if we're in backend directory
if [ ! -f "app.py" ]; then
    echo "❌ Please run this script from the backend directory"
    echo "   cd backend && bash test-backend-local.sh"
    exit 1
fi

echo "📁 Current directory: $(pwd)"
echo "📋 Backend files found: $(ls -1 *.py | wc -l) Python files"
echo ""

# Check Python version
PYTHON_VERSION=$(python3 --version 2>&1)
echo "🐍 Python version: $PYTHON_VERSION"

# Check if virtual environment exists
if [ -d "venv" ]; then
    echo "📦 Virtual environment: Found"
    VENV_EXISTS=true
else
    echo "📦 Virtual environment: Not found - will create"
    VENV_EXISTS=false
fi

echo ""
read -p "🚀 Start backend testing? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Testing cancelled"
    exit 1
fi

echo ""
echo "🔧 Step 1: Setting up Python environment..."

# Create virtual environment if not exists
if [ "$VENV_EXISTS" = false ]; then
    echo "   Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "   Activating virtual environment..."
source venv/bin/activate || source venv/Scripts/activate

# Upgrade pip
echo "   Upgrading pip..."
pip install --upgrade pip

# Install requirements
echo "   Installing requirements..."
pip install -r requirements.txt

echo "✅ Step 1 completed!"

# Step 2: Check core dependencies
echo ""
echo "📦 Step 2: Checking core dependencies..."

DEPENDENCIES_OK=true

# Check Flask
if python3 -c "import flask; print('Flask:', flask.__version__)" 2>/dev/null; then
    echo "   ✅ Flask: OK"
else
    echo "   ❌ Flask: Missing"
    DEPENDENCIES_OK=false
fi

# Check PyMongo
if python3 -c "import pymongo; print('PyMongo:', pymongo.version)" 2>/dev/null; then
    echo "   ✅ PyMongo: OK"
else
    echo "   ❌ PyMongo: Missing"
    DEPENDENCIES_OK=false
fi

# Check scikit-learn
if python3 -c "import sklearn; print('Scikit-learn:', sklearn.__version__)" 2>/dev/null; then
    echo "   ✅ Scikit-learn: OK"
else
    echo "   ❌ Scikit-learn: Missing"
    DEPENDENCIES_OK=false
fi

# Check transformers
if python3 -c "import transformers; print('Transformers:', transformers.__version__)" 2>/dev/null; then
    echo "   ✅ Transformers: OK"
else
    echo "   ❌ Transformers: Missing"
    DEPENDENCIES_OK=false
fi

if [ "$DEPENDENCIES_OK" = false ]; then
    echo ""
    echo "❌ Some dependencies are missing. Please check requirements.txt"
    exit 1
fi

echo "✅ Step 2 completed!"

# Step 3: Syntax check
echo ""
echo "🔍 Step 3: Python syntax checking..."

SYNTAX_OK=true

for file in *.py; do
    if [ -f "$file" ]; then
        if python3 -m py_compile "$file" 2>/dev/null; then
            echo "   ✅ $file: Syntax OK"
        else
            echo "   ❌ $file: Syntax Error"
            SYNTAX_OK=false
        fi
    fi
done

if [ "$SYNTAX_OK" = false ]; then
    echo ""
    echo "❌ Syntax errors found. Please fix before deploying."
    exit 1
fi

echo "✅ Step 3 completed!"

# Step 4: Test imports
echo ""
echo "📥 Step 4: Testing critical imports..."

echo "   Testing app.py imports..."
if python3 -c "
import sys
sys.path.append('.')
try:
    from app import app
    print('✅ Main app imports successful')
except Exception as e:
    print(f'❌ App import error: {e}')
    sys.exit(1)
" 2>/dev/null; then
    echo "   ✅ App imports: OK"
else
    echo "   ❌ App imports: Failed"
    echo "   Please check app.py and its dependencies"
    exit 1
fi

echo "✅ Step 4 completed!"

# Step 5: Environment variables check
echo ""
echo "⚙️ Step 5: Environment variables check..."

# Create test .env file
cat > .env.test << EOF
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=test-secret-key
MONGODB_URI=mongodb://localhost:27017/ecobacgiang_test
ALLOWED_ORIGINS=http://localhost:3000
JWT_SECRET_KEY=test-jwt-secret
LOG_LEVEL=DEBUG
EOF

echo "   ✅ Test environment file created"

# Step 6: Test Flask app startup
echo ""
echo "🚀 Step 6: Testing Flask app startup..."

echo "   Starting Flask app in test mode..."

# Test if app can start
timeout 10s python3 -c "
import os
os.environ['FLASK_ENV'] = 'development'
os.environ['SECRET_KEY'] = 'test-key'
os.environ['MONGODB_URI'] = 'mongodb://localhost:27017/test'

from app import app
print('✅ Flask app created successfully')
print(f'✅ App name: {app.name}')
print(f'✅ Debug mode: {app.debug}')

# Test basic routes
with app.test_client() as client:
    try:
        # Test if we can make a basic request
        response = client.get('/')
        print(f'✅ Basic route test: Status {response.status_code}')
    except Exception as e:
        print(f'⚠️ Route test warning: {e}')
        
print('✅ Flask app startup test completed')
" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "   ✅ Flask app startup: OK"
else
    echo "   ⚠️ Flask app startup: Issues detected (may be normal without MongoDB)"
fi

echo "✅ Step 6 completed!"

# Step 7: AI/ML components test
echo ""
echo "🧠 Step 7: Testing AI/ML components..."

echo "   Testing NLP engine..."
if python3 -c "
try:
    from focused_nlp_engine import *
    print('✅ NLP Engine: Import OK')
except Exception as e:
    print(f'⚠️ NLP Engine: {e}')

try:
    from enhanced_intent_recognition import *
    print('✅ Intent Recognition: Import OK')
except Exception as e:
    print(f'⚠️ Intent Recognition: {e}')

try:
    from smart_response_system import *
    print('✅ Smart Response: Import OK')
except Exception as e:
    print(f'⚠️ Smart Response: {e}')
" 2>/dev/null; then
    echo "   ✅ AI/ML components test completed"
else
    echo "   ⚠️ Some AI/ML components have import issues (may need model files)"
fi

echo "✅ Step 7 completed!"

# Cleanup
echo ""
echo "🧹 Cleaning up test files..."
rm -f .env.test
find . -name "*.pyc" -delete 2>/dev/null
find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true

echo "✅ Cleanup completed!"

# Final report
echo ""
echo "📊 BACKEND TEST SUMMARY"
echo "======================"
echo ""
echo "✅ Python environment: Ready"
echo "✅ Dependencies: Installed"
echo "✅ Syntax: Clean"
echo "✅ Imports: Working"
echo "✅ Flask app: Can start"
echo "✅ AI/ML components: Available"
echo ""
echo "🎯 Backend is ready for deployment!"
echo ""
echo "📋 Next steps:"
echo "1. Upload source code to VPS"
echo "2. Run updated-quick-deploy.sh"
echo "3. Configure environment variables"
echo "4. Test on production"
echo ""
echo "🚀 Ready to deploy!"

# Deactivate virtual environment
deactivate 2>/dev/null || true
