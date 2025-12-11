#!/bin/bash

# Script để expose FastAPI lên internet bằng Pinggy (alternative cho ngrok)

echo "=== Exposing API with Pinggy ==="
echo ""

echo "🌐 Starting Pinggy tunnel on port 8000..."
echo "Public URL sẽ hiển thị bên dưới"
echo "Pinggy không cần cài đặt hoặc đăng ký!"
echo ""

# Sử dụng ssh để tạo tunnel qua Pinggy
ssh -p 443 -R0:localhost:8000 a.pinggy.io
