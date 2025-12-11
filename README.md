## Yêu cầu hệ thống

### Frontend
- Node.js phiên bản 16.0 trở lên (khuyến nghị 18.x hoặc 20.x)
- npm phiên bản 7.0 trở lên
- Trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge)
- Kết nối Internet

### Backend (Tùy chọn)
- Python 3.8 trở lên
- pip (Python package manager)
- RAM tối thiểu 2GB (để load AI models)

### Kiểm tra phiên bản đã cài
```bash
node --version
npm --version
python3 --version
```

Nếu chưa có Node.js, tải tại: https://nodejs.org/

## Cài đặt và chạy

### Phần 1: Cài đặt Frontend

#### Bước 1: Clone repository
```bash
git clone https://github.com/JohnZ9696/Lab-project-Computional-Thinking-.git
cd Lab-project-Computional-Thinking-
```

#### Bước 2: Cài đặt dependencies
```bash
npm install
```

Lệnh này sẽ cài đặt các thư viện cần thiết:
- React 19.1.1
- Vite 7.1.7
- Leaflet 1.9.4
- React Leaflet 5.0.0
- Axios 1.13.2
- Firebase 11.x

#### Bước 3: Cấu hình biến môi trường

Tạo file `.env` trong thư mục gốc:
```bash
cp .env.example .env
```

Hoặc tạo file `.env` mới và thêm nội dung:

```env
# OpenWeather API Key
VITE_OPENWEATHER_API_KEY=your_openweather_api_key

# Backend API URL (mặc định localhost)
VITE_BACKEND_API_URL=http://localhost:8000

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Hướng dẫn lấy API Keys:**

**OpenWeather API Key** (Bắt buộc):
1. Truy cập https://openweathermap.org/api
2. Đăng ký tài khoản miễn phí
3. Vào trang API Keys và copy key
4. Paste vào `VITE_OPENWEATHER_API_KEY`

**Firebase Configuration** (Bắt buộc cho đăng nhập):
1. Truy cập https://console.firebase.google.com/
2. Tạo project mới hoặc chọn project có sẵn
3. Vào Project Settings > General > Your apps
4. Chọn Web app và copy config
5. Paste các giá trị vào file `.env`
6. Trong Firebase Console, vào Authentication > Sign-in method
7. Bật Email/Password và Google

**Backend API URL** (Tùy chọn):
- Để mặc định `http://localhost:8000` nếu chạy backend local
- Hoặc thay bằng URL công khai từ Pinggy khi deploy

#### Bước 4: Chạy development server
```bash
npm run dev
```

Website sẽ chạy tại `http://localhost:5173`

Mở trình duyệt và truy cập địa chỉ trên để sử dụng.

#### Bước 5: Build cho production (Tùy chọn)
```bash
npm run build
```

File build sẽ được tạo trong thư mục `dist/`

### Phần 2: Cài đặt Backend API (Tùy chọn)

Backend API cung cấp tính năng dịch thuật bằng HuggingFace AI. Nếu không cài backend, website sẽ tự động dùng Google Translate.

#### Bước 1: Cài đặt dependencies Python
```bash
cd backend
pip install -r requirements.txt
```

Quá trình cài đặt có thể mất 5-10 phút.

#### Bước 2: Chạy API server
```bash
python3 main.py
```

Hoặc dùng script:
```bash
./start.sh
```

API sẽ chạy tại `http://localhost:8000`

Kiểm tra API hoạt động:
- Truy cập http://localhost:8000 để xem status
- Truy cập http://localhost:8000/docs để xem API documentation

#### Bước 3: Expose backend lên Internet (Tùy chọn)

Để website công khai có thể gọi backend, cần expose API qua Internet bằng Pinggy.

Pinggy không cần cài đặt hoặc đăng ký, chỉ cần SSH.

Mở terminal mới:
```bash
cd backend
./pinggy.sh
```

Copy URL hiển thị (dạng `https://xxxx.a.pinggy.online`)

#### Bước 4: Cập nhật Frontend với Backend URL

Mở file `.env` và cập nhật:
```env
VITE_BACKEND_API_URL=https://your-backend-url-here
```

Sau đó rebuild frontend:
```bash
npm run build
```

### Phần 3: Deploy lên Firebase Hosting (Tùy chọn)

#### Bước 1: Cài đặt Firebase CLI
```bash
npm install -g firebase-tools
```

#### Bước 2: Đăng nhập Firebase
```bash
firebase login --no-localhost
```

Làm theo hướng dẫn để đăng nhập.

#### Bước 3: Deploy
```bash
npm run build
firebase deploy --only hosting
```

Website sẽ được deploy lên URL dạng `https://your-project.web.app`

## Cấu trúc thư mục

```
Lab-project-Computional-Thinking-/
├── backend/                    # Backend API với FastAPI
│   ├── main.py                # FastAPI server chính
│   ├── requirements.txt       # Python dependencies
│   ├── start.sh              # Script chạy backend
│   ├── pinggy.sh             # Script expose qua Pinggy
│   ├── test_api.py           # Script test API
│   └── README.md             # Hướng dẫn backend
├── src/                       # Source code frontend
│   ├── App.jsx               # Component chính
│   ├── App.css               # Styles chính
│   ├── AuthModal.jsx         # Component đăng nhập
│   ├── AuthModal.css         # Styles đăng nhập
│   ├── firebase.js           # Cấu hình Firebase
│   └── main.jsx              # Entry point
├── public/                    # Static files
├── .env                       # Biến môi trường (không commit)
├── .env.example              # Template cho .env
├── .gitignore                # Files không commit
├── firebase.json             # Cấu hình Firebase
├── package.json              # NPM dependencies
├── vite.config.js            # Cấu hình Vite
├── DEPLOYMENT.md             # Hướng dẫn deploy chi tiết
└── README.md                 # File này
```

## Các lệnh có sẵn

### Frontend
```bash
npm run dev          # Chạy development server
npm run build        # Build production
npm run preview      # Preview production build
npm run lint         # Kiểm tra code với ESLint
```

### Backend
```bash
cd backend
python3 main.py      # Chạy API server
python3 test_api.py  # Test API endpoints
./start.sh           # Chạy backend với script
./pinggy.sh          # Expose qua Pinggy
```

### Firebase
```bash
firebase login              # Đăng nhập Firebase
firebase deploy --only hosting  # Deploy website
firebase projects:list      # Liệt kê projects
```

## Hướng dẫn sử dụng

### Tìm kiếm địa điểm
1. Nhập tên tỉnh/thành phố vào ô tìm kiếm (ví dụ: "Hà Nội", "Đà Nẵng")
2. Hoặc click vào một tag gợi ý nhanh
3. Hệ thống sẽ tìm và hiển thị 5 điểm tham quan nổi bật
4. Xem thông tin thời tiết của địa điểm đó
5. Click vào địa điểm trong danh sách để zoom trên bản đồ

### Sử dụng dịch thuật
1. Click nút "Dịch thuật" ở góc phải trên
2. Nhập văn bản tiếng Anh hoặc tiếng Việt
3. Click nút đổi chiều nếu muốn đổi ngôn ngữ nguồn/đích
4. Click "Dịch" để xem kết quả
5. Kết quả dịch sẽ hiển thị ngay bên dưới

### Đăng nhập/Đăng ký
1. Click nút "Đăng nhập" ở góc phải trên
2. Chọn "Đăng ký" nếu chưa có tài khoản
3. Nhập email và mật khẩu (hoặc đăng nhập bằng Google)
4. Sau khi đăng nhập, tên và avatar sẽ hiển thị trên header

## Công nghệ sử dụng

### Frontend
- **React 19**: Thư viện UI component-based
- **Vite**: Build tool nhanh cho modern web
- **Leaflet**: Thư viện bản đồ tương tác
- **Axios**: HTTP client để gọi API
- **Firebase**: Authentication và Hosting

### Backend
- **FastAPI**: Framework Python hiệu năng cao
- **HuggingFace Transformers**: Thư viện AI/ML
- **PyTorch**: Framework deep learning
- **Helsinki-NLP Models**: Translation models chuyên nghiệp
- **Uvicorn**: ASGI server

### APIs & Services
- **OpenStreetMap**: Dữ liệu bản đồ và địa điểm
- **OpenWeather API**: Thông tin thời tiết
- **Firebase Authentication**: Xác thực người dùng
- **Firebase Hosting**: Deploy website
- **Pinggy**: Expose local server lên Internet

## Xử lý lỗi thường gặp

### Lỗi "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Không hiển thị thông tin thời tiết
- Kiểm tra file `.env` có tồn tại và đúng API key
- Đảm bảo tên biến là `VITE_OPENWEATHER_API_KEY`
- Restart server sau khi sửa `.env`
- Đợi 10-15 phút để API key được kích hoạt
- Kiểm tra console log (F12) để xem lỗi chi tiết

### Đăng nhập không hoạt động
- Kiểm tra Firebase config trong `.env`
- Vào Firebase Console > Authentication > Sign-in method
- Đảm bảo Email/Password và Google đã được bật
- Thêm domain vào Authorized domains nếu cần

### Backend API không hoạt động
- Kiểm tra backend đang chạy: `curl http://localhost:8000`
- Kiểm tra logs trong terminal chạy backend
- Đảm bảo port 8000 không bị chiếm bởi app khác
- Nếu models load lâu, đợi thêm 2-3 phút

### Port 5173 đã được sử dụng
Vite tự động chọn port khác. Kiểm tra terminal để xem port đang dùng.

### Map không hiển thị
- Kiểm tra kết nối Internet
- Mở DevTools (F12) > Console để xem lỗi
- Xóa cache trình duyệt và refresh

### Không tìm thấy điểm tham quan
- Một số tỉnh có ít dữ liệu trên OpenStreetMap
- Thử tìm kiếm thành phố lớn trong tỉnh
- Hệ thống sẽ tự động mở rộng tìm kiếm

### Translation bị lỗi
- Nếu backend offline, hệ thống tự động dùng Google Translate
- Kiểm tra `VITE_BACKEND_API_URL` trong `.env`
- Kiểm tra backend có đang chạy không

## API Endpoints

### Backend Translation API

**Base URL**: `http://localhost:8000` hoặc URL công khai của bạn

#### Health Check
```
GET /
GET /health
```

#### Dịch văn bản đơn
```
POST /translate
Content-Type: application/json

{
  "text": "I love Vietnam",
  "source_lang": "en",
  "target_lang": "vi"
}
```

#### Dịch nhiều văn bản
```
POST /translate/batch
Content-Type: application/json

{
  "texts": ["Hello", "How are you?"],
  "source_lang": "en",
  "target_lang": "vi"
}
```

Xem API documentation chi tiết tại: `http://localhost:8000/docs`

## Testing

### Test Frontend
```bash
npm run dev
# Mở http://localhost:5173 và test các tính năng
```

### Test Backend
```bash
cd backend
python3 test_api.py
```

Hoặc dùng curl:
```bash
curl -X POST "http://localhost:8000/translate" \
  -H "Content-Type: application/json" \
  -d '{"text":"I love Vietnam","source_lang":"en","target_lang":"vi"}'
```

## Live Demo

Website: https://lab-computational-thinking.web.app

## Tài liệu tham khảo

- [Backend README](backend/README.md) - Hướng dẫn chi tiết về Backend API
- [DEPLOYMENT.md](DEPLOYMENT.md) - Hướng dẫn deploy đầy đủ
- [Firebase Documentation](https://firebase.google.com/docs)
- [Leaflet Documentation](https://leafletjs.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

## Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng:
1. Fork repository
2. Tạo branch mới cho tính năng của bạn
3. Commit changes
4. Push lên branch
5. Tạo Pull Request

## License

MIT License - Tự do sử dụng cho mục đích học tập và thương mại.

## Tác giả

JohnZ9696

## Repository

GitHub: https://github.com/JohnZ9696/Lab-project-Computional-Thinking-
Project made by: Nguyễn Minh Đức (MSSV: 24127345)