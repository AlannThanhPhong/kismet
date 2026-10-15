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

Tạo file `.env.local` từ `.env.example`, điền MongoDB connection string (MongoDB Atlas hoặc MongoDB local). Không commit `.env.local` lên Git. Database mặc định là `mo_wedding`, gồm hai collection `invitations` và `rsvps`.

Danh sách thiệp hiển thị trên trang chính. Mỗi thiệp có trang riêng `/thiep/:code`. Mã được tạo theo định dạng `YYYYMMDD-<viết tắt cô dâu><viết tắt chú rể>`, lấy ngày cưới và chữ cái đầu của từng phần tên. Ví dụ Kim Hiên và Văn Tài cưới ngày 27/10/2026 có mã `20261027-KHVT`. Thiệp đầu tiên được thêm vào MongoDB tự động khi danh sách được tải.

Thiệp Kim Hiên và Văn Tài giữ nguyên giao diện Vite gốc ở `D:\THIEPMOICUOI`, hiển thị tại `/wedding-invitations/20261027-KHVT/`. Mã nguồn, tài nguyên, ảnh chụp và bản build nằm trong `public/wedding-invitations/20261027-KHVT/`; chỉ loại `node_modules`, `.git` và bản `dist` trùng với build đã sao chép.

API hiện có:

- `GET /api/invitations` — lấy danh sách thiệp và khởi tạo thiệp đầu tiên nếu chưa có.
- `POST /api/invitations` — tạo thiệp bằng `couple` (`partnerOne`, `partnerTwo`) và `event` (`date` theo `YYYY-MM-DD`, `venue`, tùy chọn `address`). API tự tạo `code` và `slug`.
- `POST /api/invitations/:slug/rsvps` — lưu phản hồi khách gồm `guestName`, `attending`, tùy chọn `guestCount` và `message`.

Để thêm thiệp có thiết kế riêng, thêm source và build giao diện vào `public/wedding-invitations/<code>/`, sau đó ánh xạ trang `/thiep/[code]` tới giao diện đó. API hiện chưa có xác thực; cần bổ sung đăng nhập và phân quyền trước khi cho tạo thiệp công khai.
