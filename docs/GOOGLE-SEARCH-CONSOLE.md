# Lập chỉ mục Google và sử dụng Search Console cho KISMET LOVE

Tài liệu dành cho website `https://www.kismet-love.com`, đối chiếu hướng dẫn Google ngày 15/10/2026. Tên nút có thể thay đổi theo ngôn ngữ hoặc giao diện tài khoản. Dùng tên tiếng Anh trong ngoặc để tìm mục tương ứng.

## 1. Phân biệt các kết quả cần đạt

| Kết quả | Cách xác nhận |
| --- | --- |
| Website xuất hiện trong tài khoản Search Console | Chọn được tài sản và đã xác minh quyền sở hữu |
| Google đọc được sitemap | Báo cáo Sơ đồ trang web báo thành công |
| Trang được lập chỉ mục | Kiểm tra URL báo URL có trên Google |
| Website có lượt hiển thị trên tìm kiếm | Báo cáo Hiệu suất có lượt hiển thị |
| Website có khách từ tìm kiếm | Báo cáo Hiệu suất có lượt nhấp |

Thêm tài sản chỉ tạo nơi quản lý dữ liệu, không tự đưa website lên kết quả tìm kiếm. Xem [giải thích về tài sản của Google](https://support.google.com/webmasters/answer/34592?hl=vi).

## 2. Những phần đã chuẩn bị trong dự án

| Phần | Vị trí | Vai trò |
| --- | --- | --- |
| Tên miền chính | `src/lib/seo.ts` | Nguồn URL dùng chung |
| Sitemap | `src/app/sitemap.ts` → `/sitemap.xml` | Liệt kê trang công khai muốn đề xuất lập chỉ mục |
| Robots | `src/app/robots.ts` → `/robots.txt` | Cho phép crawl website; hạn chế crawl API |
| Mã xác minh Google | `src/app/layout.tsx` | Đọc `GOOGLE_SITE_VERIFICATION` để xuất thẻ meta |
| Metadata trang chủ | `src/app/page.tsx` | Tiêu đề, mô tả, canonical, thông tin chia sẻ |
| Tên website | JSON-LD `WebSite` trên trang chủ | Khai báo tên kIsmet love và URL |
| Trang tạo thiệp | `src/app/tao-thiep/page.tsx` | Canonical riêng, metadata riêng |
| Trang thử thiệp | `src/app/thu-thiep/page.tsx` | Canonical về `/tao-thiep` vì dùng cùng giao diện |
| Bàn thiết kế | `src/app/design/page.tsx` | `noindex, follow` cho công cụ chỉnh sửa |

Sitemap hiện có **ít nhất 6 URL**: trang chủ, `/tao-thiep` và bốn thiệp có sẵn bên dưới. Thiệp khác trong collection `invitations` của MongoDB được tự động thêm theo `code`, không lặp lại thiệp có sẵn. Sitemap đọc dữ liệu mỗi lần được yêu cầu; không cần deploy lại chỉ để thêm thiệp trong database.

| Cặp đôi | URL thiệp trong sitemap |
| --- | --- |
| An Huynh & Pham Anh | `/thiep/20261230-KHAG` |
| Ngọc Dung & Thanh Điền | `/thiep/20260823-NDTD` |
| Kim Hiên & Văn Tài | `/thiep/20261027-KHVT` |
| Nguyễn Huyền Vy & Viên Anh Minh | `/thiep/20260110-NHVVAM` |

Không đưa `/thu-thiep`, `/design`, API, URL tham số hoặc sổ lưu bút vào sitemap. Không có ngày `lastmod` giả theo mỗi lần tải/build. Nếu MongoDB chưa được cấu hình hoặc tạm lỗi, sitemap vẫn chứa hai trang dịch vụ và bốn thiệp có sẵn; các thiệp chỉ có trong database sẽ thiếu cho tới khi kết nối hoạt động lại.

Trang `/thiep/<code>` có canonical riêng và cho phép lập chỉ mục. Sitemap dùng đường dẫn này thay vì thêm cả bản HTML `/wedding-invitations/<code>/`. Sổ lưu bút giữ `noindex`. Nếu muốn thiệp riêng tư, cần thiết kế quyền truy cập; `noindex` chỉ xử lý tìm kiếm, không bảo vệ nội dung khỏi người biết URL.

Tham khảo [quy tắc noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing?hl=vi) và [cách khai báo tên website](https://developers.google.com/search/docs/appearance/site-names?hl=vi).

## 3. Chuẩn bị trước khi mở Search Console

- [ ] Có tài khoản Google dùng để quản lý website lâu dài.
- [ ] Có quyền quản lý DNS của `kismet-love.com`, hoặc quyền triển khai website để xác minh bằng thẻ HTML.
- [ ] Đã triển khai bản mã nguồn có các thay đổi SEO này lên hosting.
- [ ] Truy cập được trang chủ từ cửa sổ ẩn danh, không cần đăng nhập.
- [ ] HTTPS hoạt động, không lỗi chứng chỉ.
- [ ] Mở được `/robots.txt` và `/sitemap.xml` trên tên miền thật.
- [ ] Trang chủ và `/tao-thiep` không bị hosting/CDN thêm `noindex` hoặc chặn bot.

Không gửi URL `localhost`, IP nội bộ hay tên miền preview làm URL chính. Nếu tên miền sản xuất khác URL trong tài liệu, cập nhật `SITE_URL` trước khi build, rồi dùng tên miền đó xuyên suốt các bước.

## 4. Kiểm tra bản đã triển khai

Mở lần lượt:

```text
https://www.kismet-love.com/
https://www.kismet-love.com/tao-thiep
https://www.kismet-love.com/robots.txt
https://www.kismet-love.com/sitemap.xml
```

`robots.txt` dự kiến:

```text
User-Agent: *
Allow: /
Disallow: /api/

Sitemap: https://www.kismet-love.com/sitemap.xml
```

Sitemap phải là XML chứa các địa chỉ đúng tên miền, bao gồm bốn thiệp kể trên, không phải trang HTML báo lỗi. Các trang cần lập chỉ mục phải trả `200`, không bị chuyển về trang lỗi.

Để kiểm tra bằng PowerShell:

```powershell
curl.exe -I https://www.kismet-love.com/
curl.exe -I https://www.kismet-love.com/tao-thiep
curl.exe -sS https://www.kismet-love.com/robots.txt
curl.exe -sS https://www.kismet-love.com/sitemap.xml
```

Trên trình duyệt, dùng **Xem nguồn trang / View page source**, tìm `canonical`, `description`, `application/ld+json` và nếu xác minh bằng HTML thì tìm `google-site-verification`. Canonical trang chủ phải là `https://www.kismet-love.com/` (Next.js có thể xuất không có dấu `/` cuối ở URL gốc, hai dạng tương đương); trang tạo và thử thiệp cùng trỏ về `https://www.kismet-love.com/tao-thiep`.

Nên cấu hình hosting chuyển HTTP và tên miền không `www` về HTTPS có `www`, giữ đường dẫn và query. Ví dụ `https://kismet-love.com/tao-thiep` → `https://www.kismet-love.com/tao-thiep`. Kiểm tra hosting trước để tránh vòng lặp chuyển hướng. Mã nguồn lần này chưa thay đổi DNS hoặc cấu hình hosting.

Canonical là tín hiệu đề xuất; Google vẫn có thể chọn URL khác. [Hướng dẫn canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls?hl=vi).

## 5. Tạo tài sản miền bằng DNS — cách nên dùng khi có quyền DNS

1. Mở [Google Search Console](https://search.google.com/search-console/), đăng nhập.
2. Mở bộ chọn tài sản góc trên bên trái → **Thêm tài sản / Add property**.
3. Chọn **Miền / Domain**.
4. Nhập `kismet-love.com`, không thêm `https://`, `www` hoặc đường dẫn.
5. Bấm **Tiếp tục / Continue** và sao chép bản ghi TXT Google cấp.
6. Đăng nhập nơi đang quản lý DNS, mở danh sách bản ghi của tên miền.
7. Thêm bản ghi theo mẫu dưới đây rồi lưu.
8. Quay lại Search Console → **Xác minh / Verify**.

| Trường DNS | Giá trị |
| --- | --- |
| Type | `TXT` |
| Name / Host | `@` hoặc để trống theo quy định nhà cung cấp |
| Value / Content | Toàn bộ `google-site-verification=...` do Google cấp |
| TTL | Giá trị mặc định của nhà cung cấp |

Thêm TXT mới, không sửa bản ghi A, CNAME hoặc TXT phục vụ dịch vụ khác. Khi đã xác minh, giữ TXT để Google có thể kiểm tra lại.

Nếu thất bại: kiểm tra đúng DNS đang có hiệu lực, đúng tên bản ghi và đủ nội dung; chờ DNS cập nhật rồi xác minh lại. Có thể tự xem TXT công khai bằng:

```powershell
Resolve-DnsName -Name kismet-love.com -Type TXT
```

[Hướng dẫn xác minh quyền sở hữu](https://support.google.com/webmasters/answer/9008080?hl=vi).

## 6. Phương án thay thế: tài sản tiền tố URL bằng thẻ HTML

Áp dụng khi có quyền deploy nhưng chưa có quyền DNS. Tài sản này chỉ bao phủ đúng tiền tố URL đã nhập.

1. **Thêm tài sản** → **Tiền tố URL / URL prefix**.
2. Nhập `https://www.kismet-love.com/` → **Tiếp tục**.
3. Trong lựa chọn xác minh, mở **Thẻ HTML / HTML tag**.
4. Lấy riêng giá trị `content` từ thẻ Google cung cấp.
5. Đặt biến môi trường trên hosting, build và deploy lại.
6. Kiểm tra nguồn trang chủ đã có thẻ xác minh, rồi bấm **Xác minh**.

Ví dụ minh họa, không dùng nguyên giá trị mẫu:

```html
<meta name="google-site-verification" content="MA_GOOGLE_CAP_CHO_BAN" />
```

Biến môi trường tương ứng:

```dotenv
GOOGLE_SITE_VERIFICATION=MA_GOOGLE_CAP_CHO_BAN
```

Không nhập cả thẻ `<meta>` hoặc chuỗi `google-site-verification=` vào biến này. Mã nguồn đã tự tạo thẻ. Giữ biến sau xác minh. Local dùng `.env.local`; production đặt trong phần Environment Variables của hosting. Với tài sản miền xác minh DNS ở phần 5, không cần biến này.

## 7. Gửi sitemap trong Search Console

1. Chọn tài sản `kismet-love.com` hoặc tiền tố HTTPS có `www`.
2. Menu trái → **Lập chỉ mục / Indexing** → **Sơ đồ trang web / Sitemaps**.
3. Ô **Thêm sơ đồ trang web mới / Add a new sitemap**: nhập URL đầy đủ bên dưới. Nếu giao diện đã điền tiền tố tên miền thì chỉ nhập `sitemap.xml`.
4. Bấm **Gửi / Submit**.
5. Mở dòng sitemap vừa gửi, kiểm tra trạng thái, thời gian đọc và số trang được phát hiện.

```text
https://www.kismet-love.com/sitemap.xml
```

Kỳ vọng sau khi xử lý: trạng thái **Thành công / Success**, phát hiện ít nhất sáu URL theo cấu hình hiện tại. Số URL phát hiện không phải số URL đã được lập chỉ mục. Nếu báo **Không thể tìm nạp / Couldn't fetch**, kiểm tra URL ở trình duyệt, HTTP status, CDN/firewall và đúng phạm vi tài sản trước khi gửi lại.

[Hướng dẫn báo cáo sitemap](https://support.google.com/webmasters/answer/7451001?hl=vi).

## 8. Kiểm tra và yêu cầu lập chỉ mục từng trang

Làm trước với trang chủ, sau đó `/tao-thiep` và các URL `/thiep/<code>` trong sitemap:

1. Dán URL đầy đủ vào thanh **Kiểm tra URL / Inspect any URL** ở trên cùng → Enter.
2. Đọc kết quả của bản Google đã biết.
3. Bấm **Kiểm tra URL đang hoạt động / Test live URL** để kiểm tra bản hiện tại.
4. Mở chi tiết: tải được trang, được phép crawl/index, HTML có nội dung và canonical đúng.
5. Nếu đủ điều kiện, bấm **Yêu cầu lập chỉ mục / Request indexing**.
6. Ghi ngày yêu cầu và quay lại kiểm tra ở lần theo dõi tiếp theo.

Live test đạt không chứng minh trang đã được lập chỉ mục. Kết quả bản đã lập chỉ mục và bản đang hoạt động có thể khác nhau. Không yêu cầu `/thu-thiep` như một trang SEO độc lập vì canonical đã trỏ về `/tao-thiep`.

[Hướng dẫn công cụ kiểm tra URL](https://support.google.com/webmasters/answer/9012289?hl=vi).

Google có thể mất vài ngày đến vài tuần để thu thập lại; gửi yêu cầu nhiều lần không làm nhanh hơn và không bảo đảm được lập chỉ mục hay có thứ hạng. [Hướng dẫn yêu cầu thu thập lại](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl?hl=vi).

## 9. Đọc báo cáo Trang và xử lý đúng vấn đề

Vào **Lập chỉ mục → Trang / Pages**; chọn một lý do, mở URL mẫu và kiểm tra URL đó. Chỉ bấm **Xác thực bản sửa lỗi / Validate fix** khi có nút này và đã sửa lỗi trên bản production.

| Trạng thái thường gặp | Hướng xử lý cho KISMET |
| --- | --- |
| Đã phát hiện, chưa lập chỉ mục | Kiểm tra hosting ổn định và liên kết đến trang; tiếp tục theo dõi |
| Đã thu thập, chưa lập chỉ mục | Kiểm tra nội dung thực tế, giá trị riêng và trùng lặp; bổ sung thông tin hữu ích |
| Bị loại trừ bởi noindex | `/design` là chủ đích; nếu trang chủ bị báo thì kiểm tra metadata và header hosting |
| Bị chặn bởi robots.txt | API là chủ đích; trang chủ và trang tạo thiệp cần crawl được |
| Trang thay thế có canonical phù hợp | Có thể đúng với `/thu-thiep`; xác nhận đích là `/tao-thiep` |
| Google chọn canonical khác | Kiểm tra host, chuyển hướng, liên kết và nội dung trùng |
| Trang có chuyển hướng | Kiểm tra đích; sitemap phải dùng URL cuối cùng |
| Không tìm thấy / 404 | Sửa liên kết hoặc khôi phục nếu URL cần tồn tại |
| Soft 404 | Xem trang có rỗng, báo lỗi hoặc thiếu nội dung dù trả 200 không |
| Lỗi máy chủ / 5xx | Kiểm tra log, kết nối database, timeout và hosting |

Không cần mọi URL đều được lập chỉ mục. Mục tiêu là các URL quan trọng có trạng thái đúng. [Giải thích báo cáo lập chỉ mục](https://support.google.com/webmasters/answer/7440203?hl=vi).

## 10. Xem website đã xuất hiện trên Google chưa

Vào **Hiệu suất / Performance → Kết quả tìm kiếm / Search results**; chọn khoảng thời gian phù hợp, bật lượt nhấp, lượt hiển thị, CTR và vị trí trung bình.

- Tab **Truy vấn / Queries**: xem cụm từ nào tạo hiển thị.
- Tab **Trang / Pages**: xem URL nào có dữ liệu; lọc riêng trang chủ hoặc `/tao-thiep`.
- Dùng bộ lọc quốc gia/thiết bị khi cần tìm khác biệt.
- Xuất dữ liệu theo tuần để so sánh trên cùng khoảng thời gian.

Hiển thị là xuất hiện trong kết quả; nhấp là người dùng bấm vào website; CTR là tỷ lệ nhấp trên hiển thị. Vị trí trung bình không phải thứ hạng cố định. Tài sản mới có thể chưa có dữ liệu ngay. [Hướng dẫn báo cáo Hiệu suất](https://support.google.com/webmasters/answer/7576553?hl=vi).

## 11. Chuẩn bị nội dung giúp trang có giá trị tìm kiếm

Đề xuất nội dung tiếp theo cho KISMET, chưa tạo thành trang mới trong lần thay đổi này:

| Nhóm nội dung | Chi tiết cần có |
| --- | --- |
| Dịch vụ thiệp cưới online | Đối tượng phù hợp, sản phẩm nhận được, ví dụ sử dụng |
| Bảng giá | Giá theo thị trường, giới hạn chỉnh sửa, thời gian hoàn thành, phần phát sinh |
| Hướng dẫn tạo thiệp | Chọn mẫu → chuẩn bị ảnh → điền thông tin → kiểm tra → gửi khách |
| RSVP | Cách khách phản hồi, cặp đôi xem kết quả và xử lý thay đổi |
| Mẫu thiệp | Ảnh minh họa, phong cách, tính năng, liên kết đến mẫu thực tế |
| Câu hỏi thường gặp | Nhạc, bản đồ, thay ảnh, gửi Zalo, thời hạn sử dụng và hỗ trợ |

Mỗi trang mới cần nội dung riêng, tiêu đề và mô tả sát nội dung, một URL canonical ổn định và liên kết HTML từ trang đang tồn tại. Sau đó thêm đường dẫn vào `INDEXABLE_PATHS`, build/deploy rồi kiểm tra trong Search Console. Các mục `/#bang-gia` hoặc `/#kho-mau-thiep` vẫn là phần của trang chủ, không thêm thành URL độc lập trong sitemap.

Google có thể tạo lại tiêu đề hoặc mô tả khi hiển thị. Không cam kết nguyên văn metadata hoặc thứ hạng cho các từ khóa như “thiệp cưới online”. Xem [tiêu đề kết quả tìm kiếm](https://developers.google.com/search/docs/appearance/title-link?hl=vi) và [mô tả kết quả](https://developers.google.com/search/docs/appearance/snippet?hl=vi).

## 12. Lịch thao tác và biên bản theo dõi

Đây là lịch làm việc đề xuất cho người quản trị, không phải thời hạn Google xử lý.

| Thời điểm | Công việc | Bằng chứng cần lưu |
| --- | --- | --- |
| Ngày triển khai | Kiểm tra HTTPS, nguồn HTML, sitemap, robots | Ngày deploy và kết quả HTTP |
| Sau triển khai | Xác minh tài sản, gửi sitemap, yêu cầu các URL quan trọng | Ngày xác minh và trạng thái gửi |
| Sau 2–3 ngày | Kiểm tra sitemap và URL quan trọng | Lần đọc sitemap, trạng thái URL |
| Hàng tuần | Xem báo cáo Trang, xử lý lỗi cần sửa | URL lỗi, nguyên nhân, ngày sửa |
| Hàng tháng | So sánh hiệu suất và cải thiện nội dung | Trang/truy vấn có hiển thị, lượt nhấp |
| Khi có trang mới | Kiểm tra canonical, thêm sitemap, deploy | URL mới và kết quả live test |

Mẫu ghi chép:

```text
Ngày thực hiện:
Người thực hiện:
Tài sản đang chọn:
URL cần kiểm tra:
HTTP status / canonical:
Kết quả live test:
Kết quả bản đã lập chỉ mục:
Ngày yêu cầu lập chỉ mục:
Vấn đề cần sửa:
Ngày kiểm tra tiếp:
```

## 13. Checklist bàn giao

- [ ] Bản SEO đã được triển khai trên đúng tên miền.
- [ ] Các URL trong sitemap tải được và canonical đúng, bao gồm thiệp từng cặp đôi.
- [ ] Tài sản đã được xác minh bằng tài khoản quản lý lâu dài.
- [ ] Sitemap đã gửi và được Google đọc thành công.
- [ ] Đã kiểm tra trực tiếp các URL quan trọng, gửi yêu cầu nếu phù hợp.
- [ ] Phân biệt được kết quả live test với trạng thái đã lập chỉ mục.
- [ ] Đã ghi nhận người phụ trách và lịch theo dõi.

Các ô này chỉ đánh dấu khi có kết quả thật trên production/Search Console. Việc bổ sung mã nguồn không tự hoàn tất xác minh DNS, gửi sitemap hoặc xác nhận Google đã lập chỉ mục.

## 14. Logo cạnh đường dẫn trên Google (favicon)

Đã dùng ảnh logo do chủ website cung cấp: chữ K đỏ trên nền kem. File được sao chép nguyên bản, không vẽ lại hoặc đổi màu.

| Thông tin | Cấu hình |
| --- | --- |
| Tên thương hiệu | kIsmet love |
| Tên thay thế | KISMET LOVE |
| Website | `https://www.kismet-love.com/` |
| Ảnh logo công khai | `https://www.kismet-love.com/brand/kismet-love-logo.jpg` |
| Kích thước, định dạng | 1254 × 1254 px, JPEG, hình vuông |
| Favicon | Thẻ `rel="icon"` trong metadata toàn website |
| Biểu tượng iOS | Thẻ `rel="apple-touch-icon"` |
| Khai báo thương hiệu | JSON-LD `Organization.logo`, liên kết với `WebSite.publisher` trên trang chủ |
| Ảnh khi chia sẻ trang chủ | Open Graph và Twitter dùng cùng logo |

Favicon là biểu tượng nhỏ cạnh tên website trong kết quả tìm kiếm. Khai báo `Organization.logo` bổ sung thông tin nhận diện tổ chức; đây là hai khai báo riêng. Biểu tượng SVG cũ đã được bỏ để tránh trình duyệt chọn nhầm. Không thêm địa chỉ, hồ sơ mạng xã hội hay thông tin pháp lý chưa được xác nhận.

Sau khi deploy lên Vercel:

1. Mở URL ảnh logo ở bảng trên, kiểm tra hiển thị đúng và không cần đăng nhập.
2. Mở trang chủ, xem nguồn HTML, tìm `rel="icon"` để xác nhận dùng `/brand/kismet-love-logo.jpg`.
3. Tìm `application/ld+json`, xác nhận có `Organization` và URL logo đúng tên miền chính.
4. Dùng [Rich Results Test](https://search.google.com/test/rich-results) kiểm tra URL trang chủ và lỗi dữ liệu tổ chức nếu có.
5. Trong Search Console, kiểm tra `https://www.kismet-love.com/`, chạy live test rồi yêu cầu lập chỉ mục trang chủ.
6. Chờ Google thu thập lại. Không có nút tải riêng favicon lên Search Console. Giữ URL ảnh ổn định và không chặn Googlebot/Googlebot-Image.

Logo trên tab trình duyệt có thể còn lưu cache; thử cửa sổ ẩn danh. Việc Google thay favicon có thể mất vài ngày đến vài tuần và không được bảo đảm. Google dùng favicon theo hostname, nên các thiệp cùng `www.kismet-love.com` sẽ dùng biểu tượng website trong tìm kiếm, không có favicon Google riêng cho từng cặp đôi.

Tham khảo [favicon trong Google Tìm kiếm](https://developers.google.com/search/docs/appearance/favicon-in-search?hl=vi) và [dữ liệu có cấu trúc Organization](https://developers.google.com/search/docs/appearance/structured-data/organization?hl=vi).
