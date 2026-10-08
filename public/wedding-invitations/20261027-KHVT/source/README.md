# Thiệp cưới Kim Hiên & Văn Tài

Thiệp online màu đỏ rượu vang, tối ưu cho điện thoại. Bìa phong thư mở bằng nút **Mở thiệp**, phát bài “một đời” ngay từ thao tác bấm. Có hiệu ứng mở hai cánh thiệp, cánh hoa, xuất hiện theo cuộn, album toàn màn hình với vuốt và phím mũi tên, đếm ngược, tải lịch và nút bật/tắt nhạc.

## Xem trên máy

Yêu cầu Node.js 22.12+ hoặc Node.js 24 LTS.

```powershell
npm install
npm run dev
```

Mở địa chỉ mà terminal hiển thị (thường là http://localhost:5173). Điện thoại cùng Wi-Fi có thể truy cập địa chỉ Network do Vite hiển thị nếu tường lửa cho phép.

## Đưa lên Vercel

1. Đưa thư mục dự án này lên repository GitHub của bạn (không đưa `node_modules` hoặc `dist`). Ảnh và nhạc trong `public` cần có trong repository.
2. Trong Vercel, chọn **Add New → Project**, nhập repository.
3. Framework **Vite**, Build Command **npm run build**, Output Directory **dist**. Cấu hình đã có sẵn trong `vercel.json`.
4. Bấm **Deploy** và dùng đường link Vercel để gửi thiệp.

Hoặc chạy `npx vercel` trong thư mục dự án để đăng nhập và tạo bản xem trước; chạy `npx vercel --prod` khi muốn đưa lên production.

Tài liệu chính thức: https://vercel.com/docs/frameworks/frontend/vite

## Google Maps

Đã gắn bản đồ nhúng do gia đình cung cấp và nút **Chỉ đường** đến ghim `11°36'41.6"N 106°00'07.6"E`. Địa chỉ, bản đồ và nút chỉ đường nằm gần cuối thiệp, sau album ảnh và trước lời cảm ơn; bản đồ tự co theo màn hình điện thoại.

Nếu đổi địa điểm, sửa trong `src/config.js`: `mapsEmbedUrl` là URL trong thuộc tính `src` của iframe Google Maps; `mapsUrl` là link mở chỉ đường đến cùng địa điểm.

Sau khi sửa, deploy lại (push lên GitHub nếu đã liên kết Vercel).

## Chỉnh sửa

- Nội dung thiệp: `src/main.js`.
- Màu sắc, bố cục và hiệu ứng: `src/style.css`.
- Bố cục đầu thiệp theo màn hình PC, laptop và điện thoại: `src/hero.css`.
- Ngày giờ, bản đồ, danh sách ảnh: `src/config.js`.
- Ảnh chính: `public/images/0V7A7519-1200.webp`.
- Nhạc: `public/audio/mot-doi.m4a`.
- Tiêu đề và nội dung chia sẻ: `index.html`. Sau khi có tên miền chính thức, có thể đổi `og:image` sang URL tuyệt đối của ảnh trên tên miền đó để tương thích tốt hơn khi chia sẻ.

Ảnh đã có bản WebP 800px và 1200px; không cần thư mục ảnh gốc khi build hay deploy. Album có 11 ảnh: đã bỏ bản 0V7A7082(1) trùng với 0V7A7082. Các ảnh gốc bên ngoài dự án không bị chỉnh sửa. Ảnh chính hiển thị nguyên hình; bố cục mở đầu trên PC được giới hạn theo chiều cao màn hình để tên và ngày cưới hiện đầy đủ.

Nhạc được gọi phát trực tiếp trong sự kiện bấm mở thiệp; thời gian bắt đầu nghe phụ thuộc tốc độ tải và cài đặt của trình duyệt. Có nút nhạc để phát lại nếu trình duyệt chặn. Hỗ trợ tùy chọn giảm chuyển động của thiết bị.

## Kiểm tra

```powershell
npm run build
npx playwright install chromium
npm run test
```

Bài kiểm tra tự chạy server preview và xác minh mở thiệp, nhạc, nội dung, album, lịch, bố cục điện thoại/máy tính và chế độ giảm chuyển động.
