# 🇻🇳 Vietnam Tourism Website with AI Translation

Website du lịch Việt Nam với tính năng dịch thuật thông minh sử dụng HuggingFace AI.

## ✨ Tính năng

### Frontend
- 🗺️ **Tìm kiếm điểm tham quan** - Tìm địa điểm du lịch tại Việt Nam
- 🌤️ **Thời tiết** - Hiển thị thông tin thời tiết tại địa điểm
- 🗺️ **Bản đồ tương tác** - Leaflet map với markers
- 🔐 **Đăng nhập/Đăng ký** - Firebase Authentication (Email & Google)
- 🌐 **Dịch thuật AI** - Dịch Anh-Việt và Việt-Anh với HuggingFace

### Backend API
- 🤖 **HuggingFace Models** - Helsinki-NLP translation models
- ⚡ **FastAPI** - High performance API framework
- 🔄 **Batch Translation** - Dịch nhiều văn bản cùng lúc
- 📡 **CORS enabled** - Hỗ trợ cross-origin requests
- 🔄 **Auto-fallback** - Tự động chuyển sang Google Translate nếu backend lỗi

## 🚀 Quick Start

### Frontend

```bash
# Cài đặt dependencies
npm install

# Chạy dev server
npm run dev

# Build production
npm run build

# Deploy lên Firebase
firebase deploy --only hosting
```

### Backend

```bash
cd backend

# Cài đặt dependencies
pip install -r requirements.txt

# Chạy API server
python3 main.py

# Hoặc dùng script
./start.sh
```

### Expose Backend lên Internet

```bash
# Terminal 2 - Dùng Pinggy (không cần cài đặt)
cd backend
./pinggy.sh

# Hoặc dùng Ngrok
./ngrok.sh
```

## 📦 Tech Stack

### Frontend
- React 19.1
- Vite 7.2
- Leaflet (Maps)
- Axios
- Firebase (Auth & Hosting)
- React Leaflet

### Backend
- FastAPI
- HuggingFace Transformers
- PyTorch
- Uvicorn

## 🌐 Deployment

### Frontend (Firebase Hosting)
```bash
npm run build
firebase deploy --only hosting
```

### Backend (với Ngrok/Pinggy)
Xem chi tiết tại [DEPLOYMENT.md](DEPLOYMENT.md)

**Các bước:**
1. Chạy backend locally
2. Expose qua ngrok/pinggy
3. Copy public URL
4. Cập nhật `VITE_BACKEND_API_URL` trong `.env`
5. Rebuild và deploy frontend

## 🔗 Live Demo

- **Website**: https://lab-computational-thinking.web.app
- **API Docs**: http://localhost:8000/docs (khi chạy local)

## 📝 Environment Variables

Tạo file `.env`:

```env
# OpenWeather API
VITE_OPENWEATHER_API_KEY=your_key

# Backend API URL (localhost hoặc ngrok/pinggy URL)
VITE_BACKEND_API_URL=http://localhost:8000

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 📖 API Endpoints

### Health Check
- `GET /` - API status
- `GET /health` - Models status

### Translation
- `POST /translate` - Dịch văn bản đơn
- `POST /translate/batch` - Dịch batch

Example:
```bash
curl -X POST "http://localhost:8000/translate" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I love Vietnam",
    "source_lang": "en",
    "target_lang": "vi"
  }'
```

## 🧪 Testing

### Test Backend API
```bash
cd backend
python3 test_api.py
```

### Test Frontend
```bash
npm run dev
# Mở http://localhost:5173
# Click "Dịch thuật" và test
```

## 📚 Documentation

- [Backend README](backend/README.md) - Chi tiết về API
- [Deployment Guide](DEPLOYMENT.md) - Hướng dẫn deploy đầy đủ

## 🎯 Kiến trúc

```
┌─────────────┐      HTTPS      ┌──────────────┐
│   Frontend  │ ───────────────> │   Firebase   │
│  (React)    │                  │   Hosting    │
└─────────────┘                  └──────────────┘
       │
       │ API Call
       ▼
┌─────────────┐                  ┌──────────────┐
│   Backend   │ ◄──── Tunnel ────│ Ngrok/Pinggy │
│  (FastAPI)  │                  └──────────────┘
└─────────────┘
       │
       │ Model Inference
       ▼
┌─────────────┐
│ HuggingFace │
│   Models    │
└─────────────┘
```

## 💡 Features Highlight

### Dịch thuật thông minh
- Sử dụng AI models từ HuggingFace
- Hỗ trợ 2 chiều: Anh-Việt và Việt-Anh
- Auto-fallback về Google Translate nếu backend offline
- Cache models để tăng tốc độ

### Authentication
- Đăng ký/Đăng nhập bằng Email
- Đăng nhập nhanh với Google
- Hiển thị avatar và thông tin user
- Firebase Authentication

### Maps & Weather
- Tìm kiếm địa điểm du lịch trong Việt Nam
- Hiển thị POI (Points of Interest) trên bản đồ
- Thông tin thời tiết realtime
- Interactive map với Leaflet

## 🐛 Troubleshooting

### Backend không chạy
```bash
# Kill port 8000 nếu bị chiếm
lsof -i :8000
kill -9 PID
```

### Models load lâu
- Lần đầu chạy cần download models (~300MB)
- Kiểm tra kết nối internet
- Models sẽ được cache cho lần sau

### Frontend không gọi được API
- Kiểm tra CORS trong `main.py`
- Kiểm tra `VITE_BACKEND_API_URL` trong `.env`
- Rebuild frontend sau khi đổi .env

## 📄 License

MIT License

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

## 👨‍💻 Author

JohnZ9696
