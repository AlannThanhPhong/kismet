# Huyền Vy & Anh Minh — Hồng Kông xưa

Xem thiệp tại `/thiep/20260110-NHVVAM`, hoặc mở trực tiếp `/wedding-invitations/20260110-NHVVAM/index.html` qua máy chủ của dự án.

- Màu chủ đạo: maroon `#550000`, theo `references/maroon-550000.jpg`; phối vàng cổ và giấy kem.
- Thông tin tên, gia đình, địa điểm và giờ lễ được chép từ `references/photo_2026-10-05_14-22-02.jpg`. Giữ nguyên ngày **10.01.2026** theo thiệp gốc và mã được yêu cầu.
- Dùng 14 ảnh JPG mới trong `images/`. Màn đầu có nút Play, khung viền và vòm vàng cổ, chữ song hỷ, tên cặp đôi và ngày cưới trên nền maroon. Sau khi bấm, nhạc `audio/nhac-nen.m4a` bắt đầu và ảnh được giải mã trước khi chạy intro: cuộn phim 3,9 giây, dừng ở `best.jpg` 0,25 giây rồi zoom mở thiệp 0,85 giây (tổng 5 giây). `best.jpg` cũng là ảnh đầu thiệp và ảnh cuối album. Chế độ giảm chuyển động dùng chuyển mờ 0,5 giây.
- Sửa giao diện tại `index.html`, `style.css`, `invitation.js`. Sửa thông tin danh sách tại `src/lib/designed-invitations.ts` và cập nhật nội dung HTML tương ứng.
- Hồi âm gọi API của dự án và lưu MongoDB; trạng thái thành công chỉ hiện sau khi API xác nhận. Thiệp tự được đăng ký vào danh sách qua API, sử dụng `$setOnInsert` để giữ dữ liệu đã có.
- Lịch `.ics` dùng UTC: `10:00Z` tương ứng 17:00 giờ Việt Nam ngày 10.01.2026.
- Font Cormorant Garamond lưu cục bộ trong `fonts/` kèm giấy phép OFL; các font Vietnam và Vibes dùng tài nguyên cục bộ có sẵn của dự án.
- Ảnh xem trước nằm trong `previews/`.

Kiểm tra intro mới trên Chromium ở 390/1440px và chế độ giảm chuyển động 320px: nút Play, khóa nội dung trước khi mở, thời lượng khoảng 5 giây, tải đủ 14 ảnh không lỗi, ảnh cuối `best.jpg`, album mở/đóng bằng Escape và không tràn ngang. Ảnh kiểm tra lưu với tiền tố `play-`, `intro-`, `intro-best-`, `open-`.

Đã kiểm tra bản build Next.js, giao diện 320/390/768/1440px, tải ảnh/font, trạng thái nhạc, xem album và đóng bằng Escape, lịch theo giờ Việt Nam, gửi hồi âm thành công/thất bại bằng API mô phỏng. Không tạo hồi âm thử trong MongoDB.
