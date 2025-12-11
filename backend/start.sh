#!/bin/bash

# Script để chạy FastAPI backend với ngrok hoặc pinggy

echo "=== Vietnam Tourism API Backend Setup ==="
echo ""

# Kiểm tra Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 không được cài đặt!"
    exit 1
fi

echo "✅ Python3 found"

# Cài đặt dependencies
echo ""
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Chạy FastAPI server
echo ""
echo "🚀 Starting FastAPI server..."
echo "API will be available at http://localhost:8000"
echo "API Documentation: http://localhost:8000/docs"
echo ""

python3 main.py
