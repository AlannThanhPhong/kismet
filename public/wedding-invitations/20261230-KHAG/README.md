# KHAM HUYNH & ANH GIA

Thư mục thiệp mới: `20261230-KHAG`, lấy chữ cái đầu theo thứ tự tên người dùng cung cấp.

- Ngày: **30.12.2026**.
- Giờ: **5:30PM** (17:30, giờ Việt Nam).
- Địa điểm: **Diamond Palace**.
- Sảnh: **GRAND BALLROOM - 2ND FLOOR**.
- Địa chỉ: **333 NGUYEN VAN LUONG, PHU LAM, TP HCM**.

Trang thiệp: `/thiep/20261230-KHAG`.
Trang tĩnh: `/wedding-invitations/20261230-KHAG/index.html`.

`index.html`, `style.css`, `opening.css` và `opening.js` chứa thiệp hoàn chỉnh. Giữ nguyên cách viết tên và địa chỉ đã cung cấp. Bìa danh sách dùng `images/hero-bw.jpg`; album dùng 22 ảnh cưới trong thư mục `images/`. Chưa có thông tin gia đình.

Nhạc dùng file `videoplayback.weba` do người dùng cung cấp (3 phút 43,86 giây), lưu bản gốc tại `audio/wedding-music.weba` và bản AAC tại `audio/wedding-music.m4a` để hỗ trợ trình duyệt. Nhạc phát trực tiếp trong sự kiện bấm mở phong bì, lặp lại ở âm lượng 55%. Nút Bật/Tắt nhạc ở cuối màn hình; xem lại mở thiệp sẽ dừng và đặt nhạc về đầu, lần bấm mở tiếp theo phát lại.

Thông tin danh sách thiệp nằm trong `src/lib/designed-invitations.ts`. Thời điểm lưu là `2026-12-30T10:30:00.000Z`, tương ứng 17:30 tại Việt Nam (UTC+7).

Bảng màu: xanh navy `#152238` và kem `#FAEBD7`. Màn máy đánh chữ và các phần nội dung phía dưới nền navy, chữ và viền màu be. Riêng phần đầu thiệp sau khi mở (tên hai bạn, phong bì và đoạn “Found you, kept you.”) nền be phủ toàn chiều ngang, chữ navy. Tờ giấy, khung ảnh và giấy hình tim bên trong phong bì vẫn màu kem với chữ navy để dễ đọc.

Màn mở đầu giữ máy đánh chữ và hiệu ứng tờ giấy chạy lên. Trên tờ giấy chỉ có hình phong bì navy, không có chữ hoặc ảnh cưới. Hình phong bì là nút bấm để mở thiệp; chế độ giảm chuyển động hiển thị giấy ngay.

Phong bì dùng hai trạng thái ảnh `assets/envelope-closed.png` và `assets/envelope-open.png`, kiểu giấy navy có vân và dấu sáp theo mẫu người dùng gửi. Khi bấm con dấu, ảnh cưới trong khung oval kem với viền nổi và hoa hồng (`assets/ivory-rose-frame.png`) bên trái, giấy sọc navy phía sau tờ giấy có dòng chữ lớn “Walk With Us” bên phải, giấy hình tim viền chấm nổi ghi ngày 30.12.2026 và giờ 5:30PM ở giữa, cùng hoa trắng xanh trồi lên đồng thời trong 2 giây. Con dấu sau khi mở dùng lại phần con dấu vàng của ảnh phong bì đóng bằng CSS clip-path để giữ nguyên màu. Bó hoa `assets/white-green-bouquet-reference.png` được chỉnh bằng Imagegen từ ảnh tham chiếu người dùng gửi, bỏ tay và nền, giữ bố cục cụm hoa rum, hồng môn xanh, lan trắng phía trên, cành xanh bên phải và các dây dền rủ dài phía dưới; nền trong suốt. Sau 2,2 giây, chính phần tử `.opening-envelope` phóng lớn và di chuyển vào đầu trang nội dung bằng Web Animations/FLIP trong 1,8 giây. Máy đánh chữ mờ dần trong lúc phóng lớn. Nút xem lại đưa toàn bộ bố cục về phong bì đóng; chế độ giảm chuyển động mở ngay.

Tên KHAM HUYNH & ANH GIA đặt thành một dòng riêng phía trên phong bì đã mở; tờ giấy bên trong giữ chữ “Walk With Us”. Phong bì đã mở được giữ lại trong luồng trang; cuộn xuống là thông tin tiệc, đếm ngược, ảnh chủ đề, câu chuyện và album 22 ảnh. Ảnh cưới dùng bộ ảnh riêng của hai bạn. Có chế độ giảm chuyển động và nút xem lại, đưa chính phong bì về giấy. Khi tắt JavaScript, lá thiệp mở và nội dung vẫn đọc được.

Nội dung tiếng Anh lấy từ bộ text và quotes người dùng gửi, được bố trí theo câu chuyện đồng nghiệp, dạo phố và bạn đồng hành trọn đời. Bản đầy đủ lưu tại `content-copy.md`.

Thiệp xuất hiện trong “Dự án thiệp theo gói” và bộ lọc Premium trên trang chủ nhờ `src/lib/templates-data.ts`, tier nội bộ `bespoke`, tương ứng $299 USD. Giá Việt Nam tiếp tục lấy từ cấu hình chung của dự án.

Máy đánh chữ dùng `assets/typewriter-hd.png` (1448 × 1086, nền trong suốt), tạo bằng imagegen. Thân navy, phím tròn kem, khung chrome; cùng ảnh được chia lớp bằng CSS để giấy chạy qua khe trục. Bản ảnh cũ được giữ trong thư mục nhưng không còn được tải.
