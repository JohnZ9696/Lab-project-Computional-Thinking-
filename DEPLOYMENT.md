# 🚀 Hướng dẫn Deploy Backend API

## Bước 1: Cài đặt Backend

```bash
cd backend
pip install -r requirements.txt
```

## Bước 2: Chạy Backend (Terminal 1)

```bash
cd backend
./start.sh
```

Hoặc:
```bash
python3 main.py
```

Backend sẽ chạy tại `http://localhost:8000`

## Bước 3: Expose Backend lên Internet

### Option A: Sử dụng Ngrok (Terminal 2)

1. Cài đặt ngrok:
```bash
# Linux
sudo snap install ngrok

# hoặc download từ: https://ngrok.com/download
```

2. Đăng ký tài khoản tại https://ngrok.com
3. Lấy authtoken và cấu hình:
```bash
ngrok config add-authtoken YOUR_TOKEN
```

4. Chạy ngrok:
```bash
cd backend
./ngrok.sh
```

5. Copy URL hiển thị (dạng: `https://xxxx-xx-xxx-xxx-xxx.ngrok-free.app`)

### Option B: Sử dụng Pinggy (Terminal 2) - Đơn giản hơn

```bash
cd backend
./pinggy.sh
```

Copy URL hiển thị (dạng: `https://xxxx.a.pinggy.online`)

## Bước 4: Cập nhật Frontend

Mở file `.env` và cập nhật:

```env
VITE_BACKEND_API_URL=https://your-ngrok-or-pinggy-url
```

Ví dụ:
```env
VITE_BACKEND_API_URL=https://abc123.ngrok-free.app
```

hoặc:
```env
VITE_BACKEND_API_URL=https://abc123.a.pinggy.online
```

## Bước 5: Rebuild và Deploy Frontend

```bash
# Build lại frontend
npm run build

# Deploy lên Firebase
firebase deploy --only hosting
```

## ✅ Kiểm tra

1. Mở website: https://lab-computational-thinking.web.app
2. Click nút "🌐 Dịch thuật"
3. Nhập văn bản và dịch
4. Kiểm tra Console (F12) để xem API được gọi

## 📊 Test Backend API

Truy cập các endpoint sau:
- API Docs: `https://your-url/docs`
- Health Check: `https://your-url/health`

Hoặc test bằng curl:
```bash
curl -X POST "https://your-url/translate" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I love Vietnam",
    "source_lang": "en",
    "target_lang": "vi"
  }'
```

## 🔄 Auto-restart Backend (Optional)

Để backend tự động restart khi có lỗi:

```bash
pip install supervisor
```

Hoặc dùng `screen`:
```bash
screen -S backend
cd backend && python3 main.py
# Nhấn Ctrl+A, D để detach
# screen -r backend để attach lại
```

## 💡 Lưu ý

- **Ngrok**: Free tier có giới hạn, URL thay đổi mỗi lần restart
- **Pinggy**: Miễn phí, không cần đăng ký, nhưng URL cũng thay đổi
- Nên dùng các service này cho demo/testing
- Production nên deploy backend lên server thật (Railway, Render, DigitalOcean...)

## 🐛 Troubleshooting

### Backend không chạy:
```bash
# Kiểm tra port đã được dùng chưa
lsof -i :8000
# Kill process nếu cần
kill -9 PID
```

### Frontend không gọi được API:
- Kiểm tra CORS đã được cấu hình trong `main.py`
- Kiểm tra URL trong `.env` đúng chưa
- Mở Developer Console (F12) xem lỗi chi tiết

### Models load lâu:
- Lần đầu chạy models sẽ được download (300MB+)
- Sau đó sẽ cache và nhanh hơn
