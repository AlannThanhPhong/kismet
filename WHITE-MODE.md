# KISMET — giao diện sáng

Trang chủ `/` sử dụng bảng màu `#FBF6F3`, `#D1C4B8`, `#B7A895`, `#D1D9C8`, `#EFC7C2`. Giao diện trang chủ trước đó được giữ ở `src/app/components/LegacyHome.tsx`.

## Sử dụng

- Chọn gói Basic, Standard, Premium, Customized hoặc Self-Customized; kết hợp tìm kiếm, phong cách, loại thiệp, tính năng và sắp xếp. Bộ lọc gọi API không tải lại trang, có hủy yêu cầu cũ và quay về dữ liệu sẵn có khi mất kết nối.
- Nút trái tim lưu mẫu yêu thích trên thiết bị. Xem nhanh hỗ trợ hai mặt; mẫu website mở bản xem trực tiếp hiện có.
- `/design?template=sage-vows` mở trình thiết kế SVG: chọn lớp, sửa nội dung, font, cỡ, màu, vị trí; kéo thả, thêm/xóa chữ, đổi nền, phóng to, xem hai mặt, tải SVG. Bản nháp tự lưu trên thiết bị.
- Bấm **Lưu lên đám mây** để lưu vào MongoDB và bật tự lưu sau mỗi thay đổi. Bản nháp đám mây được bảo vệ bằng cookie ngẫu nhiên HttpOnly, SameSite=Strict; quyền đọc chỉ thuộc phiên trình duyệt đó. Đây chưa phải tài khoản đồng bộ đa thiết bị. Xóa cookie sẽ mất quyền truy cập bản đám mây. Dùng **Tải bản đã lưu** trước khi chỉnh sửa để tiếp tục bản trên máy chủ.
- Bộ thiệp có các bản xem thiệp mời, RSVP, đếm ngược, dresscode và thẻ vị trí. Đây là bản xem stationery; chỉ website thiệp cưới mới có tính năng động.

## API và dữ liệu

Giữ cấu hình `MONGODB_URI` và `MONGODB_DB` hiện có. Không đưa thông tin kết nối vào mã nguồn phía trình duyệt.

- `GET /api/templates`: danh mục gói, lọc `q`, `package`, `style`, `type`, nhiều `feature`, `collection`, `sort`; phân trang `page`, `limit` (tối đa 24). Giá vẫn dựa theo quốc gia IP.
- `GET /api/templates/:id`: thông tin mẫu, lớp chữ và font được hỗ trợ.
- `GET`, `PUT /api/designs/:id`: tải/lưu bản nháp JSON trong collection `design_drafts`. Có kiểm tra mẫu hợp lệ, origin, kích thước và cấu trúc dữ liệu; trả 503 khi MongoDB không khả dụng.
- `GET /api/reviews?stars=5`: chỉ đọc đánh giá có `approved: true` trong collection `reviews`. Các trường: `name` (chuỗi), `text` (chuỗi), `rating` (số nguyên 1–5), `templateName` (chuỗi tùy chọn), `createdAt` (Date). Khi chưa có dữ liệu, giao diện hiển thị trạng thái trống.
- `POST /api/newsletter`: kiểm tra email và đồng ý nhận bản tin; lưu vào `newsletter_subscribers`, chống trùng email. Chưa kết nối Mailchimp/Klaviyo hoặc gửi email tự động.

## Phần cần cấu hình/triển khai tiếp

Danh mục và banner hiện cấu hình trong mã nguồn, chưa có CMS quản trị. Chưa có đăng nhập, giỏ hàng/thanh toán, tích hợp CRM, hoặc SLA uptime đã xác minh. Đánh giá và thống kê phải dùng dữ liệu thực đã duyệt. SVG xuất theo kích thước viewBox 400×540, chưa phải PDF chuyên dụng có bleed/CMYK cho nhà in. Chỉnh sửa nội dung chữ ở bảng công cụ; chưa gõ trực tiếp trên canvas. Chưa có chức năng thêm ảnh/họa tiết tùy ý.

## Chạy và kiểm tra

```powershell
npm.cmd run dev
npm.cmd run build
```

Không tự triển khai lên tên miền hoặc dịch vụ hosting từ thay đổi này.

Bản production dùng `.next-white`, bản development dùng `.next` để tránh ghi đè tệp khi chạy song song. Có thể chọn thư mục khác bằng biến môi trường `KISMET_BUILD_DIR`.

Kiểm tra đã thực hiện: build production và TypeScript đạt; HTTP 200 cho `/`, `/design`, `/thu-thiep`, `/tao-thiep`; API lọc theo gói/tính năng, giá VNĐ theo quốc gia, kết quả trống, phân trang, chi tiết mẫu và các phản hồi 400/403/404/413 đạt. Không ghi dữ liệu thật vào database khi kiểm tra. Chưa kiểm thử tương tác bằng trình duyệt và chưa xác minh lưu MongoDB/đăng ký email thành công với dịch vụ thực tế.
