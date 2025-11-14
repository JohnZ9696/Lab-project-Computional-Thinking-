
## 📋 Requirment của project

- **Node.js** version 16.0 trở lên (khuyến nghị 18.x hoặc 20.x)
- **npm** version 7.0 trở lên (đi kèm với Node.js)
- Kết nối Internet (để tải map tiles và gọi API)

### Kiểm tra version đã cài:
```bash
node --version
npm --version
```

Nếu chưa có Node.js, tải tại: https://nodejs.org/

## Cài đặt và chạy project

### 1. Clone repository
```bash
git clone https://github.com/JohnZ9696/Lab-project-Computional-Thinking-.git
cd Lab-project-Computional-Thinking-
```

### 2. Cài đặt dependencies
```bash
npm install
```

Lệnh này sẽ cài đặt tất cả các package cần thiết:
- React 19.1.1
- Vite 7.1.7
- Leaflet 1.9.4
- react-leaflet 5.0.0
- axios 1.13.2

### 3. Chạy development server
```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173` (hoặc port khác nếu 5173 đã được sử dụng)

### 4. Build cho production (tùy chọn)
```bash
npm run build
```

File build sẽ được tạo trong thư mục `dist/`

### 5. Preview production build (tùy chọn)
```bash
npm run preview
```

## Scripts có sẵn

| Script | Mô tả |
|--------|-------|
| `npm run dev` | Chạy development server với hot reload |
| `npm run build` | Build production-ready bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Chạy ESLint để kiểm tra code |

## Cách sử dụng

1. Mở ứng dụng trong trình duyệt
2. Nhập tên tỉnh/thành phố Việt Nam (ví dụ: "Hà Nội", "Đà Nẵng", "Đồng Tháp")
3. Hoặc click vào một trong các tag gợi ý nhanh
4. Xem danh sách 5 điểm tham quan được hiển thị
5. Click vào địa điểm trong danh sách để zoom trên bản đồ

## Troubleshooting

### Lỗi "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 5173 đã được sử dụng
Vite sẽ tự động chọn port khác. Kiểm tra terminal để xem port đang dùng.

### Map không hiển thị
Kiểm tra kết nối Internet và console log trong DevTools để xem lỗi API.

### Không tìm thấy POI cho một số tỉnh
- Một số tỉnh có ít dữ liệu trên OpenStreetMap
- Thử tìm kiếm thành phố lớn trong tỉnh đó
- Ứng dụng sẽ tự động mở rộng tìm kiếm và hiển thị kết quả có sẵn

## Repository

GitHub: https://github.com/JohnZ9696/Lab-project-Computional-Thinking-.git
Project made by: Nguyễn Minh Đức (MSSV: 24127345)