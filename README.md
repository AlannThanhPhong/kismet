# Mơ — Thiệp cưới online

Landing page giới thiệu dịch vụ thiệp cưới online, xây dựng với Next.js App Router, TypeScript và Tailwind CSS v4.

## Chạy trên máy

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem trang.

## MongoDB và danh sách thiệp

Tạo file `.env.local` từ `.env.example`, điền MongoDB connection string (MongoDB Atlas hoặc MongoDB local). Không commit `.env.local` lên Git. Database mặc định là `mo_wedding`, gồm hai collection `invitations` và `rsvps`.

Danh sách thiệp hiển thị trên trang chính. Mỗi thiệp có trang riêng `/thiep/:code`. Mã được tạo theo định dạng `YYYYMMDD-<viết tắt cô dâu><viết tắt chú rể>`, lấy ngày cưới và chữ cái đầu của từng phần tên. Ví dụ Kim Hiên và Văn Tài cưới ngày 27/10/2026 có mã `20261027-KHVT`. Thiệp đầu tiên được thêm vào MongoDB tự động khi danh sách được tải.

Thiệp Kim Hiên và Văn Tài giữ nguyên giao diện Vite gốc ở `D:\THIEPMOICUOI`, hiển thị tại `/wedding-invitations/20261027-KHVT/`. Mã nguồn, tài nguyên, ảnh chụp và bản build nằm trong `public/wedding-invitations/20261027-KHVT/`; chỉ loại `node_modules`, `.git` và bản `dist` trùng với build đã sao chép.

API hiện có:

- `GET /api/invitations` — lấy danh sách thiệp và khởi tạo thiệp đầu tiên nếu chưa có.
- `POST /api/invitations` — tạo thiệp bằng `couple` (`partnerOne`, `partnerTwo`) và `event` (`date` theo `YYYY-MM-DD`, `venue`, tùy chọn `address`). API tự tạo `code` và `slug`.
- `POST /api/invitations/:slug/rsvps` — lưu phản hồi khách gồm `guestName`, `attending`, tùy chọn `guestCount` và `message`.

Để thêm thiệp có thiết kế riêng, thêm source và build giao diện vào `public/wedding-invitations/<code>/`, sau đó ánh xạ trang `/thiep/[code]` tới giao diện đó. API hiện chưa có xác thực; cần bổ sung đăng nhập và phân quyền trước khi cho tạo thiệp công khai.
