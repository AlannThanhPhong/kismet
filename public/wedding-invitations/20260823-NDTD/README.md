# Thanh Điền & Ngọc Dung

Màn mở đầu hiện dùng nền xanh lá nhạt, ảnh hai bạn đeo kính (`images/web/hero.webp`), tiêu đề viết tay “Chỉ cần là em”, ngày cưới 23/08/2026, dòng nhạc “Đang phát, Giai điệu đôi ta!” và tên “Dunger x ĐT”. Giữ font Script cho chữ trên polaroid và ngày phía dưới. Nút ban đầu là ▶; chỉ phát nhạc và mở thiệp khi khách bấm.

Hai poster mở đầu nằm trên cùng một hàng ở mọi kích thước màn hình, giữ trọn ảnh và tự thu theo chiều cao viewport để mở thiệp là thấy đủ cả hai. `posters.css` chỉnh layout và chữ/nét vẽ theo độ rộng từng ảnh; ảnh xem trước trong `previews/poster-pair-390.png` và `previews/poster-pair-1440.png`.

## Tiện ích Premium

### Sổ lưu bút riêng có mật khẩu

Trang riêng có hai mục “Danh sách xác nhận” và “Lời chúc”. Danh sách gồm mọi phản hồi (kể cả không có lời chúc), tên khách, tham dự/không thể đến, tổng số khách, người đi cùng, toàn văn lời chúc và thời điểm gửi/cập nhật. Có tìm theo tên/lời chúc và lọc trạng thái. Dữ liệu chi tiết chỉ trả về cho thiệp này sau khi kiểm tra phiên có mật khẩu; cập nhật real-time, không giới hạn 100 phản hồi/lời chúc ở trang riêng.

Tên và mọi lời chúc có nội dung tự động xuất hiện trong sổ riêng, không còn checkbox chọn hiển thị. Áp dụng cả phản hồi cũ dù trước đây chưa chọn checkbox; trang và API vẫn yêu cầu phiên đã xác thực. Các thiệp khác giữ chính sách chọn hiển thị hiện có.

Bảng thống kê và lời chúc nằm ở `/thiep/20260823-NDTD/loi-chuc`, không tải hay hiển thị trong thiệp công khai. Nút “Mở sổ lưu bút” trên thiệp mở dialog nhập mật khẩu; xác thực thành công sẽ chuyển sang trang riêng. Truy cập trực tiếp khi chưa đăng nhập cũng yêu cầu nhập mật khẩu. Mật khẩu được kiểm tra bằng hash ở server, không có trong HTML/JavaScript công khai. Phiên đăng nhập 8 giờ dùng cookie HttpOnly/SameSite Strict và token ngẫu nhiên lưu hash trong MongoDB; API summary và SSE đều kiểm tra phiên. Nút “Khóa sổ lưu bút” thu hồi phiên ở server. TTL chỉ áp dụng cho collection `guestbookSessions`, không áp dụng cho thiệp hay RSVP.

- RSVP lưu MongoDB qua `/api/invitations/20260823-NDTD/rsvps`. Khách có thể đổi tham dự/số người/lời chúc trên cùng trình duyệt; token ngẫu nhiên được lưu trên thiết bị, server chỉ giữ hash. Gửi lại cập nhật một phản hồi, không cộng khách hai lần. Xóa dữ liệu trình duyệt sẽ mất khả năng sửa phản hồi cũ.
- Sổ lưu bút và tổng số phản hồi/khách/lời chúc nhận cập nhật qua SSE, kiểm tra dữ liệu mỗi 2 giây. Chỉ công khai tên và lời chúc khi khách chủ động đồng ý; API không trả chi tiết tham dự cá nhân hoặc token. Hiển thị tối đa 100 lời chúc mới nhất, tổng đếm gồm tất cả. Luồng kết nối được đóng khi tab ẩn, tự nối lại khi quay về; có nút cập nhật thủ công.
- Hạt phim nhẹ phủ trên thiệp, intro bong bóng được giữ nguyên, pháo hoa chạy khi mở thiệp và gửi RSVP thành công. Tôn trọng `prefers-reduced-motion`.
- Hai bản đồ: địa chỉ chính xác nhà trai và khu vực Thạnh An, Cần Thơ của nhà gái. Điền `brideAddress` trong `premium-config.js` để chuyển bản đồ nhà gái sang địa chỉ cụ thể. Không tự suy đoán vị trí nhà gái.
- `premium-config.js` hỗ trợ video MP4/WebM và hai tài khoản mừng cưới có hình VietQR đã xác minh. Chỉ hiện khi có đủ dữ liệu; hiện chưa có video, thông tin ngân hàng hoặc mã QR thật. Album giữ toàn bộ 22 ảnh được cung cấp; gói hỗ trợ đến 30 ảnh, không tạo ảnh bổ sung giả.
- Designer chỉnh palette, font và số cột trong `personalization.css`; bố cục/thông tin riêng trong `index.html`, `style.css`, `premium.css`. Các đặc quyền designer 1–1, chỉnh sửa không giới hạn, hỗ trợ 24/7 và thời hạn hoàn thiện thuộc quy trình dịch vụ của studio.

### Lưu trữ và vận hành

Ứng dụng không đặt hạn hết thiệp hay tự xóa RSVP sau ngày cưới. Thiệp tĩnh được lưu trong repository, RSVP/lời chúc được lưu MongoDB. “Trọn đời” cần duy trì hosting, domain, cơ sở dữ liệu và sao lưu ngoài ứng dụng; chỉ thêm một nhãn lên thiệp không bảo đảm điều này. Bật backup MongoDB ở hạ tầng đang triển khai và kiểm tra phục hồi định kỳ. Không cấu hình TTL cho bản ghi của thiệp này. Chưa cấu hình tác vụ backup tự động hay gửi bảng tổng hợp cho cặp đôi; cần quy trình vận hành của studio. Hai mốc tổng hợp Standard tương ứng 16/08/2026 và 21/08/2026 (Asia/Saigon), đã qua tại thời điểm bổ sung tính năng, nên không tự gửi báo cáo muộn.

### Kiểm tra

Chạy Next trên cổng 3000 và `node --test tests/premium-rsvp.test.mjs` để kiểm tra lưu/sửa, chống lặp, quyền công khai và SSE trên MongoDB thật. Test tự xóa bản ghi QA trong `finally`. `tests/premium-browser.test.mjs` kiểm tra giao diện 320/390/1440px, an toàn hiển thị lời chúc, giảm chuyển động, intro và pháo hoa bằng Playwright/Edge; đặt `PLAYWRIGHT_MODULE` tới module Playwright nếu cài ngoài repository. Ảnh chụp mobile tại `previews/premium-rsvp-390.png`.

Khung lời mời (`#loi-moi`) theo phong cách thiệp giấy botanical: nền ngà có vân giấy, viền xanh lá đậm, chữ serif, thông tin nhà trai/nhà gái cân giữa và vòng lá quanh tên hai bạn. Họa tiết vector trong `botanical-sprig.svg`, bố cục và kích thước điện thoại trong nhóm CSS “Botanical stationery”. Ảnh xem trước: `previews/botanical-320.png`, `previews/botanical-390.png`, `previews/botanical-1440.png`.

Màn mở đầu dùng nền giấy hạt xanh lá nhạt (`paper-grain.svg`), ảnh cưới trong khung polaroid và khung nhạc màu vàng kem, chữ và nút điều khiển xanh lá. Khung nhạc có tiêu đề căn giữa, tên cô dâu/chú rể, biểu tượng sóng âm, thanh tiến trình theo thời gian bản nhạc, nút tua lùi/tới 10 giây và nút phát ở giữa. Bấm nút ▶ phát ngay “ONLY” — LeeHi từ `music/leehi-only.mp3`, lặp lại ở âm lượng 45%, đồng thời đổi biểu tượng sang tạm dừng. Có 192 bong bóng vàng và xanh lá nối tiếp bay lên liên tục, phủ kín màn hình rồi bay hết lên trên trong khoảng 3 giây. Thiệp hiện dần ở cuối hiệu ứng, không có đoạn dừng hoặc tản ngang. Nút Bật/Tắt nhạc bên trong tiếp tục điều khiển cùng bản nhạc. Hiệu ứng dùng CSS, có chế độ giảm chuyển động theo thiết lập thiết bị; khi tắt JavaScript, nội dung thiệp vẫn đọc được.

Thiệp tại `/thiep/20260823-NDTD`. Mã theo quy ước cô dâu trước, chú rể sau: Ngọc Dung (ND), Thanh Điền (TD).

Thông tin chép từ ảnh thiệp giấy: lễ tân hôn 09:00, tiệc 11:00 Chủ nhật 23/08/2026, nhằm 11/07 năm Bính Ngọ. Địa điểm: tư gia, số 139 Hồ Tùng Mậu, khóm Hòa Bình, phường Châu Đốc, tỉnh An Giang. Giữ ngày trên ảnh dù đã qua thời điểm tạo thiệp.

Thiết kế phong cách Hàn Quốc: xanh lá đậm `#244b35`, xanh nhạt `#e9efdf`, nền trắng ngà, chữ serif mảnh và khoảng trắng thoáng. Màn đầu dùng `images/Hình chủ đề.jpg`; phần “We are getting married” dùng đúng ảnh cùng tên. Album dùng toàn bộ 22 ảnh trong thư mục `images/`, giữ tỷ lệ ảnh ngang/dọc, mở bằng dialog, chuyển ảnh bằng nút hoặc phím mũi tên, đóng bằng nút hoặc Escape. Ảnh gốc được giữ nguyên; bản WebP 1600px trong `images/web/` giảm dung lượng tải; `album.json` ánh xạ ảnh gốc với ảnh web. Ảnh chủ đề cũng là ảnh bìa danh sách và Open Graph.

Ảnh mở đầu và “We are getting married” trình bày như poster ảnh cưới Hàn Quốc: chữ viết tay lớn trên ảnh, tim và mũi tên vẽ bằng SVG, tên và ngày cưới. Chữ và nét vẽ là lớp HTML/SVG có thể sửa trong `index.html`; ảnh gốc không bị thay đổi.

Hai ảnh riêng cô dâu (`album-16.webp`) và chú rể (`album-17.webp`) nằm trong phần `.portraits` trước album, với tên và lời nhắn tình cảm. Sửa nội dung `.portrait-message` và `.portrait-signature` trong `index.html` để viết lời riêng cho từng người. Máy tính xếp ảnh và chữ so le; điện thoại xếp chữ dưới ảnh. Album còn 20 ảnh, cả 22 ảnh vẫn mở được trong dialog.

Trang chính hiển thị dự án tại `/#danh-sach-thiep`, trong những mẫu đầu của `/#kho-mau-thiep`, menu và bộ lọc Premium, cùng nút xem mẫu trong bảng giá. Gói Premium là 299 USD theo cấu hình giá quốc tế của dự án; giá Việt Nam theo cấu hình sẵn có.

Dùng font có sẵn trong thiệp 20260110-NHVVAM. Lời mời dành cho quý khách nói chung, không dùng tên người nhận “Anh Vũ” viết tay trong ảnh.

Danh sách trang chủ và MongoDB tự nhận mục mới qua `src/lib/designed-invitations.ts`. Sửa thiết kế trong `index.html` và `style.css`. Nút bản đồ tra địa chỉ, không khẳng định tọa độ. Lịch dùng UTC 04:00 = 11:00 Việt Nam; không đặt giờ kết thúc vì thiệp gốc không cung cấp.
