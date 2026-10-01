# S09 — Header, Footer & bộ chọn tiền tệ

Hiện ở mọi trang. Code đã xong trong `sections/header.liquid` và `sections/footer.liquid`; việc
còn lại là **menu và theme settings**.

---

## a. Mục tiêu

1. Menu đầu trang đúng 6 mục theo spec, trỏ đúng đường dẫn.
2. Bộ chọn quốc gia hiện ra và đổi được tiền tệ ở cả desktop và menu thu gọn trên điện thoại.
3. Footer có logo, email liên hệ, 4 liên kết bắt buộc (Privacy, Cookie, Wholesale, Feedback) và
   các kênh liên hệ.
4. Không vỡ bố cục ở bề rộng 390 px.

---

## b. Các bước thực hiện

### B1. Menu chính — Online Store → Navigation → Menu chính (`main-menu`)

Hiện có 3 mục: Home, Product (`/collections/all`), Contact. Cần thành:

| # | Tên mục **[ĐỀ XUẤT]** | Link | Ghi chú |
|---|---|---|---|
| 1 | Home | Home page (`/`) | Giữ |
| 2 | Mua lẻ | Collections → Single cards (`/collections/single-cards`) | Tạo ở S00-B4 trước |
| 3 | Mua số lượng lớn | Collections → Bulk packs (`/collections/bulk-packs`) | Tạo ở S00-B4 trước |
| 4 | Pokémon | Collections → Pokémon (`/collections/pokemon`) | |
| 5 | One Piece | Collections → One Piece (`/collections/one-piece`) | |
| 6 | Giỏ hàng | `/cart` | Nhập link thủ công, Shopify không gợi ý `/cart` |

- Xoá mục **Product → `/collections/all`**: nó hiện lẫn cả hàng sealed, hàng lẻ, pack và 16 SP demo.
- Mục **Contact** **[ĐỀ XUẤT]** chuyển xuống footer, vì header chỉ nên có 6 mục theo spec.

**Lưu ý về ngôn ngữ.** Comment trong `header.liquid` đề xuất tên tiếng Anh (*Single cards*,
*Bulk packs*). Admin của store đang dùng tiếng Việt, còn khách là quốc tế.
**[CẦN QUYẾT]** chọn 1 trong 2:

| Phương án | Menu | Phù hợp khi |
|---|---|---|
| **A (khuyến nghị)** | Tiếng Anh: Home, Single cards, Bulk packs, Pokémon, One Piece, Cart | Khách là US / EU / SG — toàn bộ storefront nên tiếng Anh |
| B | Tiếng Việt như bảng trên | Có cả khách Việt, hoặc dùng Shopify Translate & Adapt để có 2 ngôn ngữ |

Dù chọn gì thì **phải thống nhất với toàn bộ nội dung storefront**, không trộn nửa Việt nửa Anh.

Icon giỏ hàng ở header là **riêng, luôn hiện**, không phụ thuộc menu — nên mục "Giỏ hàng" trong
menu là dự phòng cho mobile. Nếu chọn phương án A thì vẫn giữ 6 mục cho đúng spec.

### B2. Menu chân trang — Navigation → Menu chân trang (`footer`)

Footer của theme dựng 4 cột và lấy dữ liệu từ nhiều nguồn khác nhau:

| Cột | Nguồn dữ liệu | Hiện trạng |
|---|---|---|
| 1 — Thương hiệu | `settings.logo` + section setting `about` + `settings.contact_email` | Logo OK; `about` và `contact_email` **trống** |
| 2 — Shop | section setting `menu`, mặc định `main-menu` | Sẽ tự đúng sau B1 |
| 3 — Information | **tự động** tìm page `wholesale-inquiry`, `feedback`, `privacy-policy` + menu phụ `info_menu` | 3 page **chưa tồn tại** → cột này đang gần như rỗng |
| 4 — Contact us | theme settings `contact_whatsapp`, `contact_line`, `contact_telegram`, `social_*` | **tất cả trống** → cột rỗng |

Điểm quan trọng: footer **tự tìm page theo handle**, nên chỉ cần tạo đúng 3 page với handle
`wholesale-inquiry`, `feedback`, `privacy-policy` (S04, S11, S05) là 4 liên kết bắt buộc tự xuất
hiện, gồm **2 liên kết riêng** cho Privacy (`#privacy-policy`) và Cookie (`#cookie-policy`).

Menu `footer` hiện chỉ có "Tìm kiếm". **[ĐỀ XUẤT]** dùng nó cho các policy mặc định của Shopify:

1. Navigation → Menu chân trang → **Add menu item**.
2. Thêm: Refund policy, Shipping policy, Terms of service, Contact (Shopify gợi ý sẵn ở nhóm
   **Policies**).
3. Giữ hoặc bỏ "Tìm kiếm" tuỳ ý.

### B3. Theme settings còn trống — Online Store → Themes → Customize → Theme settings

| Setting | Nhóm | Giá trị cần điền |
|---|---|---|
| `contact_email` | Contact & social | **[CẦN CUNG CẤP]** email theo domain. Nếu để trống, footer fallback về `shop.email` = Gmail cá nhân |
| `contact_whatsapp` | Contact & social | **[CẦN CUNG CẤP]** link `https://wa.me/<số có mã quốc gia>` |
| `contact_line` | Contact & social | **[CẦN CUNG CẤP]** link `https://line.me/ti/p/~<id>` |
| `contact_telegram` | Contact & social | **[CẦN CUNG CẤP]** link `https://t.me/<username>` |
| `social_instagram` | Contact & social | **[CẦN CUNG CẤP]** |
| `social_facebook` · `social_tiktok` · `social_x` · `social_youtube` | Contact & social | **[CẦN CUNG CẤP]**, kênh nào không có thì để trống — theme tự ẩn |

Section setting của Footer (Customize → Footer):

| Setting | Giá trị |
|---|---|
| `about` | **[CẦN CUNG CẤP]** 1–2 câu giới thiệu dưới logo |
| `shop_heading` | `Shop` (mặc định) |
| `info_heading` | `Information` (mặc định) |
| `wholesale_page` / `feedback_page` / `privacy_page` | Để **trống** — theme tự tìm theo handle. Chỉ chọn tay nếu handle khác chuẩn |
| `info_menu` | Chọn `footer` |
| `show_payment_icons` | Bật — icon lấy từ `shop.enabled_payment_types`, nên sẽ đúng với Shopify Payments thật |

### B4. Bộ chọn quốc gia / tiền tệ

Theme render snippet `localization-form` ở **3 chỗ**: header (desktop), menu drawer (mobile),
footer. Mỗi chỗ một `id_suffix` riêng nên không trùng id.

Hành vi **[ĐÃ XÁC ĐỊNH theo code]**:

- Snippet chỉ hiện khi `localization.available_countries.size > 1`. **Hiện tại store có 1 market
  nên nó đang không hiện.** Phải hoàn thành S00-B5 trước.
- Mỗi option hiện dạng `Tên nước (MÃ ký-hiệu)`, ví dụ `Germany (EUR €)` — khách thấy luôn tiền tệ
  trước khi chọn, không phải đoán.
- `data-autosubmit`: chọn xong là form tự submit, trang tải lại trong tiền tệ mới. Không cần bấm
  nút. Có `<noscript>` fallback với nút Update.
- Trong Theme Editor, nếu chưa có Markets, chỗ này hiện dòng nhắc (`localization.markets_hint`)
  thay vì bỏ trống — dùng dấu hiệu này để biết cấu hình chưa xong.

Không cần sửa code gì cho S09. Toàn bộ phụ thuộc Markets ở S00.

### B5. Header settings — Customize → Header

| Setting | Giá trị |
|---|---|
| `menu` | `main-menu` |
| `sticky` | Bật (mặc định) |
| `show_search` | **[ĐỀ XUẤT]** bật — với catalogue thẻ bài, khách tìm theo tên lá bài là hành vi chính |

Logo: `settings.logo` = `cthmppe.png`, `logo_width = 300`. **[ĐỀ XUẤT]** 300 px là rộng cho
header; giảm về 160–200 px và kiểm tra lại ở 390 px. Preset "Default" của theme dùng 140.

---

## c. Dữ liệu đầu vào cần có

| # | Mục | Trạng thái |
|---|---|---|
| 1 | Chọn ngôn ngữ storefront (A: tiếng Anh / B: tiếng Việt) | **[CẦN QUYẾT]** |
| 2 | Email liên hệ theo domain | **[CẦN CUNG CẤP]** |
| 3 | Link WhatsApp, LINE, Telegram, Instagram (và kênh khác nếu có) | **[CẦN CUNG CẤP]** |
| 4 | 1–2 câu giới thiệu cho footer | **[CẦN CUNG CẤP]** |
| 5 | Logo bản nền trong, cao ≥ 120 px (PNG hoặc SVG) | Đã có `cthmppe.png` — xác nhận đây là bản cuối |
| 6 | Markets đã cấu hình (S00-B5) | Phụ thuộc S00 |
| 7 | 3 page `wholesale-inquiry`, `feedback`, `privacy-policy` | Phụ thuộc S04, S11, S05 |

---

## d. Ca kiểm thử

| Mã | Ca kiểm thử | Kết quả mong đợi |
|---|---|---|
| S09-01 | Mở trang chủ trên desktop | Header hiện 6 mục menu, bộ chọn quốc gia, icon tìm kiếm, icon giỏ |
| S09-02 | Thu bề rộng về 390 px | Menu gộp vào nút hamburger; bộ chọn quốc gia nằm trong drawer; không cuộn ngang |
| S09-03 | Mở drawer trên mobile, chọn Germany | Trang tải lại, giá EUR, drawer đóng lại |
| S09-04 | Đổi quốc gia ở **footer** | Hoạt động giống hệt ở header (3 selector dùng cùng một form) |
| S09-05 | Đổi sang EU rồi lần lượt mở Home → Collection → Product → Cart | Giá EUR ở cả 4 trang, không có trang nào còn USD |
| S09-06 | Bấm từng mục menu | Không mục nào ra 404; mục đang xem có `aria-current="page"` |
| S09-07 | Kiểm tra cột Information ở footer | Có đủ 4 liên kết: Wholesale, Feedback, Privacy Policy, Cookie Policy |
| S09-08 | Bấm "Cookie Policy" ở footer | Nhảy tới `/pages/privacy-policy#cookie-policy`, cuộn đúng phần 2 |
| S09-09 | Kiểm tra cột Contact us | Hiện đúng các kênh đã điền, không hiện kênh để trống |
| S09-10 | Bấm email ở footer | Mở trình gửi thư với đúng địa chỉ domain, không phải Gmail cá nhân |
| S09-11 | Thêm 1 SP vào giỏ | Số trên icon giỏ ở header tăng ngay |
| S09-12 | Mở trang bất kỳ không phải trang chủ | Logo nằm trong `<div>`, không phải `<h1>` (chỉ trang chủ dùng `h1`) |
| S09-13 | Kiểm tra icon thanh toán ở footer | Khớp đúng các phương thức đang bật ở Settings → Payments |

---

## e. Tiêu chí nghiệm thu

- [ ] Menu chính đúng 6 mục, mỗi mục trỏ đúng đường dẫn trong bảng B1
- [ ] Đã xoá mục `/collections/all` khỏi header
- [ ] Ngôn ngữ storefront thống nhất, không trộn Việt – Anh
- [ ] Bộ chọn quốc gia hiện ở cả 3 vị trí: header, drawer mobile, footer
- [ ] Đổi quốc gia làm giá đổi nhất quán ở Home, Collection, Product, Cart
- [ ] Mỗi option trong bộ chọn hiện kèm mã tiền tệ
- [ ] Footer có logo, đoạn giới thiệu, email theo domain
- [ ] Cột Information có đủ 4 liên kết, trong đó Privacy và Cookie là 2 liên kết riêng
- [ ] Cột Contact us hiện ít nhất 2 kênh liên hệ thật
- [ ] Icon thanh toán khớp phương thức đang bật
- [ ] Ở 390 px: không cuộn ngang, logo không tràn, drawer đóng mở được bằng bàn phím
- [ ] Header và footer hiện trên **mọi** trang, kể cả 404, search, cart, policy
