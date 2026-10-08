# Huyền Vy & Anh Minh — Hồng Kông xưa

Xem thiệp tại `/thiep/20260110-NHVVAM`, hoặc mở trực tiếp `/wedding-invitations/20260110-NHVVAM/index.html` qua máy chủ của dự án.

- Màu chủ đạo: maroon `#550000`, theo `references/maroon-550000.jpg`; phối vàng cổ và giấy kem.
- Thông tin tên, gia đình, địa điểm và giờ lễ được chép từ `references/photo_2026-10-05_14-22-02.jpg`. Giữ nguyên ngày **10.01.2026** theo thiệp gốc và mã được yêu cầu.
- Dùng 14 ảnh JPG mới trong `images/`. Màn đầu có chữ song hỷ lớn, khung viền và vòm vàng cổ, tên cặp đôi và ngày cưới trên nền maroon. Màn đầu dùng chữ “HONG KONG 1999” với Bodoni Moda, nét thanh đậm gần ảnh mẫu; font chỉ áp dụng cho dòng này. Nút mở thiệp dùng xe đạp trong ảnh tham chiếu, tách nền và lật sang trái. Khung xe đứng yên; hai bánh gắn sẵn trên xe, nan hoa xoay quanh đúng trục liên tục. Chữ “MỞ THIỆP” hiện ngay. SVG mask giữ các phần khung, phuộc và hộp xích tại chỗ. Nút hỗ trợ bàn phím; chế độ giảm chuyển động hiện xe hoàn chỉnh ngay. Đã bỏ các chữ Trung Quốc khác, chỉ giữ chữ song hỷ. Bấm trực tiếp vào xe đạp hoặc chữ “MỞ THIỆP” để mở thiệp ngay và phát nhạc `audio/nhac-nen.m4a`; có thể bấm ngay khi trang hiện ra.
- Sửa giao diện tại `index.html`, `style.css`, `invitation.js`. Sửa thông tin danh sách tại `src/lib/designed-invitations.ts` và cập nhật nội dung HTML tương ứng.
- Hồi âm gọi API của dự án và lưu MongoDB; trạng thái thành công chỉ hiện sau khi API xác nhận. Thiệp tự được đăng ký vào danh sách qua API, sử dụng `$setOnInsert` để giữ dữ liệu đã có.
- Lịch `.ics` dùng UTC: `10:00Z` tương ứng 17:00 giờ Việt Nam ngày 10.01.2026.
- Font Cormorant Garamond lưu cục bộ trong `fonts/` kèm giấy phép OFL; các font Vietnam và Vibes dùng tài nguyên cục bộ có sẵn của dự án.
- Ảnh xem trước nằm trong `previews/`; bản xe đạp dùng tiền tố `bicycle-`; bản nút bánh xe trước đó dùng `wheel-`.

Kiểm tra intro mới trên Chromium ở 390/1440px và chế độ giảm chuyển động 320px: nút Play, khóa nội dung trước khi mở, thời lượng khoảng 5 giây, tải đủ 14 ảnh không lỗi, ảnh cuối `best.jpg`, album mở/đóng bằng Escape và không tràn ngang. Ảnh kiểm tra lưu với tiền tố `play-`, `intro-`, `intro-best-`, `open-`.

Đã kiểm tra bản build Next.js, giao diện 320/390/768/1440px, tải ảnh/font, trạng thái nhạc, xem album và đóng bằng Escape, lịch theo giờ Việt Nam, gửi hồi âm thành công/thất bại bằng API mô phỏng. Không tạo hồi âm thử trong MongoDB.

## Tài nguyên màn mở đầu

- Xe: `images/vintage-bicycle-left.png` (PNG có alpha), tạo bằng công cụ imagegen tích hợp từ ảnh xe đạp người dùng cung cấp. Prompt cuối: “Giữ kiểu dáng và màu xe đạp cổ điển trong ảnh, xóa nền trắng cả giữa các nan hoa, xóa bóng nền, lật ngang để xe hướng trái, giữ nguyên hai bánh và toàn bộ xe, xuất PNG nền trong suốt, không thêm chữ hay chi tiết khác.”
- Font: `fonts/bodoni-moda.ttf`, lấy từ Google Fonts; giấy phép `fonts/BodoniModa-OFL.txt`. Ảnh chữ tham chiếu không cung cấp tên font nên Bodoni Moda được chọn để tái hiện nét thanh đậm tương tự.
- Giao diện màn đầu: `bicycle-intro.css`; hai bánh xoay bằng CSS; `invitation.js` mở thiệp trực tiếp khi bấm xe.
- Đã kiểm tra 1440/390/320px, điện thoại xoay ngang và chế độ giảm chuyển động: khung xe đứng yên, thứ tự lắp bánh rồi hiện nhãn, mở phim, nhạc và không tràn ngang.

Cập nhật: xe đạp mở nội dung thiệp trực tiếp khi bấm, không chờ cuộn phim. Đã kiểm tra thao tác bấm xe trước/sau khi lắp bánh, bấm nhãn và mở bằng bàn phím.

Bản hiện tại: bánh gắn sẵn, xoay tại chỗ mỗi vòng 3 giây; khung, phuộc, chắn bùn và hộp xích đứng yên. Chế độ giảm chuyển động dừng bánh.


## B? hoa v? cu?n phim (08.10.2026)

B? hoa cam ?? ???c ??t tr?n baga ph?a sau y?n xe. B?m xe ho?c M? THI?P s? ph?t nh?c, ch?y l?i cu?n phim 15 khung c?, d?ng ? best.jpg r?i m? n?i dung thi?p (kho?ng 5 gi?y). Ch? ?? gi?m chuy?n ??ng b? cu?n v? chuy?n nh? v?o thi?p.

T?i nguy?n: images/tropical-bouquet.png, PNG trong su?t t?o b?ng imagegen t?ch h?p t? ?nh photo_2026-10-08_14-34-02.jpg. Prompt: t?ch ri?ng b? hoa thi?n ?i?u cam, hoa g?ng ??, l? xanh v? cu?ng; b? ng??i, tay, xe v? n?n; d?ng l?i cu?ng b? tay che; gi? ch?t ?nh t? nhi?n, n?n alpha trong su?t, kh?ng ch?.

?? ki?m tra Chromium ? 1440/390/320px: b? hoa sau y?n, n?t xe v? nh?n m? phim, nh?c ph?t, kh?a n?i dung trong l?c cu?n, m? thi?p sau phim, gi?m chuy?n ??ng v? kh?ng tr?n ngang. ?nh ki?m tra: previews/bouquet-*.png v? previews/restored-film-*.png.


## Hoa g?n baga v? font n?i dung

Hoa d?ng images/tropical-bouquet-v2.png, b?n d?i v? thon h?n, n?m d?c baga v?i d?y bu?c v?ng qua thanh baga v? b?ng ti?p x?c. T?o b?ng imagegen t?ch h?p t? b? hoa tr??c v? ?nh xe l?m tham chi?u phong c?ch. Prompt: k?o d?i cu?ng kho?ng 25%, b? hoa thi?n ?i?u cam v? g?ng ?? thon h?n; n?t minh h?a m?u n??c c? ?i?n, m?u cam ??t, ?? tr?m, xanh olive theo chi?c xe; th?m ruy b?ng kem tr?n cu?ng; ch? b? hoa tr?n n?n alpha trong su?t. L??t ch?nh cu?i gi? nguy?n hoa v? lo?i b? to?n b? n?n, qu?ng m?u quanh hoa.

Font b?n trong d?ng content-typography.css: Great Vibes (Vibes) cho t?n v? ti?u ??; Be Vietnam Pro (Vietnam) cho n?i dung, bi?u m?u, gi? v? ng?y. Hai font d?ng ??ng t?p WOFF2 c?a 20261027-KHVT ?? c? trong d? ?n. CSS gi?i h?n trong #invitation-content.

?? ki?m tra Chromium ? 1440/390/320px: t?i c? hai font, kh?ng tr?n ngang; cu?n phim, m? n?i dung v? nh?c ho?t ??ng. ?nh: previews/bouquet-v2-*.png, previews/font-hero-*.png, previews/font-invitation-*.png.


## S?i hoa xanh r? t? b? hoa

Th?m ba s?i amaranthus xanh olive r? t? ph?n d??i b? hoa, d?i ng?n kh?c nhau (282/321/224 ??n v? SVG). G?c s?i n?m sau l?p b? hoa ?? n?i t? nhi?n; t?ng s?i ?ung ??a quanh ??u cu?ng, bi?n ?? -1.8 ??n 2 ??, chu k? 5.1/5.8/6.6 gi?y v? l?ch nh?p. Ch? ?? gi?m chuy?n ??ng gi? s?i ??ng y?n.

?nh: images/green-amaranthus-trail.png, t?o b?ng imagegen t?ch h?p d?a tr?n ?nh ng??i d?ng ??nh k?m. Prompt: m?t s?i hoa amaranthus xanh d?i, m?nh, r? xu?ng v?i c?c c?m n? nh?; n?t minh h?a m?u n??c th?c v?t c? ?i?n, m?u olive/sage d?u ?? h?p b? hoa v? xe; g?c cu?ng ? ??u tr?n, cong nh? v? thu?n ? cu?i; n?n alpha trong su?t, kh?ng ng??i, b?ng hay ch?.

?? ki?m tra Chromium 1440/390/320px: ?? ba s?i, chuy?n ??ng nh? c? thay ??i theo th?i gian, gi?m chuy?n ??ng d?ng ho?n to?n, cu?n phim v? nh?c v?n ho?t ??ng, kh?ng tr?n ngang. ?nh xem tr??c: previews/trailing-greenery-*.png.


Font m?n ??u ??ng b? v?i 20261027-KHVT: Great Vibes cho HONG KONG 1999, t?n v? ng?y c??i; Be Vietnam Pro cho nh?n m? thi?p v? h??ng d?n. ?? b? khai b?o font Bodoni kh?i m?n ??u.


Font n?i dung ?? tr? l?i b?n ban ??u: b? t?i content-typography.css, d?ng l?i to?n b? typography trong style.css (Cormorant cho t?n, ti?u ?? v? c?c ph?n serif; Be Vietnam Pro cho n?i dung th??ng; Great Vibes cho ch? k? nh? b?n g?c).
