# KISMET LOVE — Thiệp cưới online

Landing page giới thiệu dịch vụ thiệp cưới online, xây dựng với Next.js App Router, TypeScript và Tailwind CSS v4.

## Google Search Console và lập chỉ mục

Xem [hướng dẫn chi tiết bằng tiếng Việt](docs/GOOGLE-SEARCH-CONSOLE.md) để kiểm tra bản triển khai, xác minh DNS/thẻ HTML, gửi sitemap, yêu cầu lập chỉ mục và theo dõi lỗi trong Search Console.

Website cung cấp `/robots.txt` và `/sitemap.xml`; tên miền chuẩn được cấu hình trong `src/lib/seo.ts`. Nếu xác minh tài sản tiền tố URL bằng thẻ HTML, đặt `GOOGLE_SITE_VERIFICATION` theo `.env.example`, sau đó build/deploy lại. Xác minh tài sản miền bằng DNS không cần biến này.

## Chạy trên máy

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem trang.

Development dùng `.next-dev`, còn `npm run build` và `npm run start` dùng `.next` để build production không ghi đè cache của dev server đang chạy. Sau khi thay đổi cấu hình này, khởi động lại dev server.

`npm run dev` cố định cổng 3000. Nếu cổng đang được dùng, lệnh báo lỗi thay vì tự mở thêm server ở 3001; chỉ chạy một dev server cho dự án để tránh hai tiến trình cùng ghi vào `.next-dev`.

## Cloudinary và ảnh trong thiệp xuất bản

Ảnh người dùng thay trong mẫu được tối ưu ở trình duyệt, tải lên Cloudinary qua API server và lưu URL CDN cùng dữ liệu thiệp trong collection `published_trials` của MongoDB `mo_wedding`. Thiệp chỉ xuất bản thành công sau khi tài khoản đăng nhập và MongoDB lưu bản ghi; link chia sẻ đọc lại từ MongoDB. Để bật tải ảnh, thêm `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` và `CLOUDINARY_API_SECRET` từ Cloudinary Console vào `.env.local` khi chạy local và vào biến môi trường của hosting khi deploy. Đây là biến server-only; không thêm tiền tố `NEXT_PUBLIC_` và không commit giá trị thật. Chỉ nhận ảnh JPEG, PNG hoặc WebP; ảnh được giới hạn 4 MB sau khi tối ưu để giữ request tải lên gọn và ổn định.

## Giá theo quốc gia IP

Trang chủ xác định quốc gia trên server cho từng lượt truy cập. Chỉ mã quốc gia `VN` dùng VNĐ; các nước khác hoặc không xác định được quốc gia đều dùng USD. Không sử dụng ngôn ngữ trình duyệt, múi giờ hoặc cookie để chọn giá.

| Gói | IP Việt Nam | IP khác / không xác định |
| --- | --- | --- |
| Tiêu Chuẩn | 500.000đ | 99 USD |
| Nâng Cao | 800.000đ | 199 USD |
| May Đo Độc Bản | 1.800.000đ | 299 USD |
| Custom | Liên hệ | Liên hệ |

Ưu tiên header quốc gia từ [Vercel](https://vercel.com/docs/headers/request-headers) (`x-vercel-ip-country`) hoặc [Cloudflare IP Geolocation](https://developers.cloudflare.com/network/ip-geolocation/) (`cf-ipcountry`). Nếu hosting không cung cấp quốc gia, server tra IP khách qua [Country.is](https://country.is/) với thời gian chờ tối đa 1,5 giây; lỗi tra cứu mặc định USD. Chỉ IP khách được gửi đến Country.is, không gửi thông tin thiệp hay thông tin liên hệ. Không tra cứu IP máy chủ khi thiếu IP khách.

Khi triển khai sau reverse proxy, proxy phải đặt/ghi đè các header quốc gia và IP (`cf-connecting-ip`, `x-forwarded-for` hoặc `x-real-ip`) bằng dữ liệu đáng tin cậy. Không cache HTML trang chủ dùng chung giữa các quốc gia; Next.js render trang theo request khi đọc `headers()`. Chạy localhost không có header IP/quốc gia sẽ hiển thị USD.

Giá được cấu hình trong `src/lib/pricing.ts`, dùng chung cho bảng giá, kho mẫu, popup xem mẫu và các nội dung giới thiệu giá dịch vụ. Chi phí in thiệp giấy tại Việt Nam vẫn giữ số liệu VNĐ; ưu đãi quốc tế không hiển thị giá trị quà tặng VNĐ.

## MongoDB và danh sách thiệp

Tạo file `.env.local` từ `.env.example`, điền MongoDB connection string (MongoDB Atlas hoặc MongoDB local). Không commit `.env.local` lên Git. Database mặc định là `mo_wedding`, gồm collection `invitations`, `rsvps`, `users`, `user_sessions` và `published_trials` cho các thiệp xem thử đã xuất bản.

## Tài khoản và hạn sử dụng thiệp xem thử

Đăng nhập và đăng ký chỉ dùng Google tại `/tai-khoan`; lần đầu đăng nhập Google sẽ tự tạo tài khoản. Tạo OAuth Client ID loại Web application trong Google Cloud Console, khai báo callback URI `https://<tên-miền>/api/auth/google/callback` (và `http://localhost:3000/api/auth/google/callback` khi chạy local), rồi điền `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` và `GOOGLE_REDIRECT_URI` vào `.env.local` cùng biến môi trường hosting. `GOOGLE_REDIRECT_URI` phải khớp chính xác với URI đã khai báo trong Google Cloud Console; nếu để trống, ứng dụng tự dùng callback của miền đang mở.

Chỉ tài khoản Google đã xác minh email `kismetlove.invitation@gmail.com` được cấp quyền quản trị; không cần mã kích hoạt riêng. Cần đăng nhập để xuất bản; mỗi bản thiệp được gắn với tài khoản tạo và lưu trong `published_trials`. Bản thiệp có hiệu lực 7 ngày từ lúc xuất bản. Khi hết hạn, link chia sẻ sẽ khóa nhưng tài khoản vẫn thấy ngày tạo, ngày hết hạn và trạng thái; quản trị viên có thể gia hạn từng bản thêm 7 ngày. Trang quản trị nằm cùng `/tai-khoan`.

Danh sách thiệp hiển thị trên trang chính. Mỗi thiệp có trang riêng `/thiep/:code`. Mã được tạo theo định dạng `YYYYMMDD-<viết tắt cô dâu><viết tắt chú rể>`, lấy ngày cưới và chữ cái đầu của từng phần tên. Ví dụ Kim Hiên và Văn Tài cưới ngày 27/10/2026 có mã `20261027-KHVT`. Thiệp đầu tiên được thêm vào MongoDB tự động khi danh sách được tải.

Thiệp Kim Hiên và Văn Tài giữ nguyên giao diện Vite gốc ở `D:\THIEPMOICUOI`, hiển thị tại `/wedding-invitations/20261027-KHVT/`. Mã nguồn, tài nguyên, ảnh chụp và bản build nằm trong `public/wedding-invitations/20261027-KHVT/`; chỉ loại `node_modules`, `.git` và bản `dist` trùng với build đã sao chép.

API hiện có:

- `GET /api/invitations` — lấy danh sách thiệp và khởi tạo thiệp đầu tiên nếu chưa có.
- `POST /api/invitations` — tạo thiệp bằng `couple` (`partnerOne`, `partnerTwo`) và `event` (`date` theo `YYYY-MM-DD`, `venue`, tùy chọn `address`). API tự tạo `code` và `slug`.
- `POST /api/invitations/:slug/rsvps` — lưu phản hồi khách gồm `guestName`, `attending`, tùy chọn `guestCount` và `message`.

Để thêm thiệp có thiết kế riêng, thêm source và build giao diện vào `public/wedding-invitations/<code>/`, sau đó ánh xạ trang `/thiep/[code]` tới giao diện đó. Thiệp xem thử do người dùng xuất bản được bảo vệ bằng đăng nhập Google và hạn 7 ngày như phần trên; API `invitations` và RSVP được liệt kê riêng cho chức năng thiệp cưới thông thường.
