# Backend API
Backend API sử dụng FastAPI và HuggingFace cho tính năng dịch thuật của website du lịch Việt Nam.

## Cài đặt và Chạy

### 1. Cài đặt dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Chạy API Server

```bash
python3 main.py
```

Hoặc sử dụng script:

```bash
./start.sh
```

API sẽ chạy tại: `http://localhost:8000`

API Documentation: `http://localhost:8000/docs`

### 3. Expose API lên Internet

#### Sử dụng Ngrok:

```bash
# Terminal 1: Chạy API
./start.sh

# Terminal 2: Chạy ngrok
./ngrok.sh
```

#### Sử dụng Pinggy (không cần cài đặt):

```bash
# Terminal 1: Chạy API
./start.sh

# Terminal 2: Chạy pinggy
./pinggy.sh
```

## API Endpoints

### Health Check
- `GET /` - Kiểm tra API đang chạy
- `GET /health` - Kiểm tra trạng thái models

### Translation
- `POST /translate` - Dịch văn bản đơn
  ```json
  {
    "text": "I love Vietnam",
    "source_lang": "en",
    "target_lang": "vi"
  }
  ```

- `POST /translate/batch` - Dịch nhiều văn bản
  ```json
  {
    "texts": ["Hello", "How are you?"],
    "source_lang": "en",
    "target_lang": "vi"
  }
  ```

## Models

API sử dụng các model từ HuggingFace:
- **English → Vietnamese**: Helsinki-NLP/opus-mt-en-vi
- **Vietnamese → English**: Helsinki-NLP/opus-mt-vi-en

## Sử dụng trong Frontend

Sau khi có public URL từ ngrok/pinggy, cập nhật trong frontend:

```javascript
const API_URL = "https://your-ngrok-url.ngrok-free.app";

// hoặc
const API_URL = "https://your-pinggy-url.a.pinggy.online";
```

## Lưu ý

- Models sẽ được tải xuống lần đầu chạy (khoảng 300MB)
- Thời gian khởi động lần đầu có thể hơi lâu
- Sử dụng CPU mode mặc định, có thể bật GPU nếu có
