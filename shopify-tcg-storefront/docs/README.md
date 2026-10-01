# Tài liệu triển khai — ADAMANTILE (Pokémon & One Piece TCG)

Tài liệu cho store **adamantile.com**, theo master prompt S00–S11. Mỗi hạng mục có đủ 5 khối:
mục tiêu, các bước trong Shopify Admin, dữ liệu đầu vào, ca kiểm thử, tiêu chí nghiệm thu.

Ký hiệu dùng xuyên suốt:

| Ký hiệu | Nghĩa |
|---|---|
| **[ĐÃ XÁC ĐỊNH]** | Chốt theo yêu cầu dự án hoặc theo thực trạng store/theme |
| **[ĐỀ XUẤT]** | Khuyến nghị của bên triển khai, chờ khách duyệt |
| **[CẦN CUNG CẤP]** | Dữ liệu còn thiếu, không được tự bịa |

---

## Phát hiện lớn nhất: theme đã được dựng riêng cho dự án này

Theme đang chạy là **`tcg-vault-theme-3`** (role MAIN, id `188241117295`) — **không phải** Dawn hay
Horizon. Đây là theme custom viết đúng cho bài toán thẻ bài, đã có sẵn:

| Section | Phục vụ hạng mục |
|---|---|
| `header.liquid`, `footer.liquid` | S09 — có cả bộ chọn quốc gia (`localization-form`) ở header, footer và menu mobile |
| `image-banner`, `link-cards`, `featured-collection`, `rich-text`, `announcement-bar` | S01 |
| `main-collection.liquid` | S10 — filter + sort native, dùng Search & Discovery |
| `main-product.liquid` | S06 — variant picker, JSON variant data, JSON-LD |
| `main-cart.liquid` | S07 |
| `wholesale-form.liquid` | S04 — form `contact` native, đã đủ trường |
| `main-policy.liquid` | S05 — 2 phần, 2 anchor |
| `main-feedback.liquid` | S11 — feedback bằng theme block, không cần app |

Và 3 template trang đã tồn tại: `page.wholesale-inquiry.json`, `page.privacy-policy.json`,
`page.feedback.json`.

**Nhưng 3 trang tương ứng thì chưa được tạo** — store chỉ có duy nhất 1 page là "Liên hệ".
Nghĩa là phần lớn công việc còn lại **không phải viết code, mà là tạo dữ liệu và cấu hình**.

---

## Thực trạng store (đọc trực tiếp từ Admin API, 01/10/2026)

### Cấu hình chung

| Mục | Giá trị thật | Đánh giá |
|---|---|---|
| Tên / domain | ADAMANTILE / `adamantile.com`, SSL bật | OK |
| Plan | **Basic** | Giới hạn số market và không sửa được luồng Checkout |
| Tiền tệ gốc | USD | OK, khớp yêu cầu |
| Money format | `${{amount}}` / `${{amount}} USD` | OK — theme bật `show_currency_code` nên dùng bản có mã tiền tệ, ra `$48.00 USD`. Không được tắt setting đó |
| Giá gồm thuế | `taxesIncluded = true` | ⚠️ Cần xác nhận với thị trường EU/UK |
| Thuế trên phí ship | `taxShipping = false` | Cần xác nhận |
| Múi giờ | **Asia/Bangkok** | ⚠️ Lệch với địa chỉ doanh nghiệp ở Harrisonville, US |
| Email store | `ductrananh265@gmail.com` | ⚠️ Gmail cá nhân, không phải email theo domain |
| Giao tới | 29 quốc gia (có US, SG, GB và 14 nước EU) | OK — shipping zone đã phủ đủ 4 thị trường |
| Delivery profile | 1 cái, "General profile", 29 nước | OK |
| Số đơn hàng | **0** | Luồng checkout chưa từng được chạy thật lần nào |

### Markets — đây là khoảng trống lớn nhất

| Mục | Giá trị thật |
|---|---|
| Số market | **1** |
| Market duy nhất | tên "Việt Nam", handle `vn`, type `REGION`, status `ACTIVE` |
| `currencySettings` | **null** |

Hệ quả: yêu cầu đa tiền tệ USD / EUR / SGD **chưa được cấu hình chút nào**. Và vì snippet
`localization-form.liquid` chỉ render khi `localization.available_countries.size > 1`, **bộ chọn
quốc gia hiện đang không hiện ra** trên storefront. Xử lý ở [S00](S00-thiet-lap-chung.md).

### Navigation & Pages

| Mục | Hiện có | Cần có |
|---|---|---|
| `main-menu` | Home, Product (`/collections/all`), Contact | 6 mục theo S09 |
| `footer` menu | Tìm kiếm | Theo S09 |
| Pages | Liên hệ (`contact`) | + `wholesale-inquiry`, `privacy-policy`, `feedback` |

### Sản phẩm — 34 sản phẩm, chia làm 2 nhóm rất khác nhau

**Nhóm A — 18 sản phẩm sealed thật** (13 Pokémon + 5 One Piece): booster box, special box,
constructed deck. Giá 65–440 USD.

- `tags` = **rỗng** → không thể làm collection tự động, không thể làm filter
- `productType` = **rỗng**
- 1 variant `Default Title` → không có cấu trúc card/pack
- `sku` = **null**
- Tồn kho **đúng 10 cho cả 18 sản phẩm** → gần như chắc chắn là số tạm
- Có 1 cặp **trùng lặp**: "MEGA High Class Pack MEGA Dream ex Box" tồn tại 2 lần
  (`...-box` và `...-box-1`)

**Nhóm B — 16 sản phẩm demo** (`tags` chứa `demo`), **không nằm trong collection nào**:

- 10 sản phẩm `productType = "Single card"`, mỗi cái 2 variant
- 6 sản phẩm `productType = "Bulk pack"`, mỗi cái 1 variant
- Tag đã theo đúng quy ước theme: `pokemon` / `one-piece`, `unit:card`, `unit:pack`,
  `rarity:common|uncommon|rare|super-rare|holo-rare|ultra-rare|secret-rare|leader`

**Kết luận quan trọng:** catalogue thật hiện **chỉ có hàng sealed, không có một lá bài lẻ nào**.
Mảng "bán lẻ từng lá" (card) đang có 0 sản phẩm thật. Xem [S00](S00-thiet-lap-chung.md) khối c.

### Collections

| Handle | Tiêu đề | Số SP | Loại | Ghi chú |
|---|---|---|---|---|
| `pokemon` | Pokemon | 13 | **Thủ công** (`ruleSet = null`) | Chỉ chứa hàng sealed |
| `one-piece` | One Piece | 5 | **Thủ công** | Chỉ chứa hàng sealed |
| `frontpage` | Trang chủ | 1 | Thủ công | Mặc định của Shopify |
| `single-cards` | — | — | — | **Chưa tồn tại**, nhưng header của theme trỏ tới |
| `bulk-packs` | — | — | — | **Chưa tồn tại**, nhưng header của theme trỏ tới |

### Theme settings đã có và còn thiếu

Đã đặt trong `config/settings_data.json`:

```
logo: cthmppe.png (logo_width 300)   page_width: 1300        corner_radius: 10
color_background: #080b12 (nền tối)  color_surface: #171c29   color_text: #f4f6fb
color_primary: #1d3fbb               color_accent: #ffcb05
color_pokemon: #e3350d               color_onepiece: #0b4f8a  color_sale: #ff2d6f
font: assistant_n7 / assistant_n4
purchase_option_name: "Purchase type"
unit_tag_prefix: "unit:"             rarity_tag_prefix: "rarity:"
show_currency_code: true             low_stock_threshold: 5   show_cart_note: true
```

Còn **trống** (footer có dùng, nên cột "Contact us" hiện đang rỗng):
`contact_email`, `contact_whatsapp`, `contact_line`, `contact_telegram`,
`social_instagram`, `social_facebook`, `social_tiktok`, `social_x`, `social_youtube`.

---

## Thứ tự triển khai

S00 phải xong trước vì tag, metafield và Markets là nền của tất cả các hạng mục sau.

| # | Mã | Hạng mục | Khối lượng còn lại | Tài liệu |
|---|---|---|---|---|
| 1 | S00 | Thiết lập chung, tag, Markets | **Lớn** — Markets chưa có, 18 SP chưa tag | [S00](S00-thiet-lap-chung.md) |
| 2 | S09 | Header, Footer, bộ chọn tiền tệ | Trung bình — code xong, thiếu menu + settings | [S09](S09-header-footer-tien-te.md) |
| 3 | S10 | Collection Pokémon / One Piece | Trung bình — cần 2 collection mới + filter | [S10](S10-collection.md) |
| 4 | S01 | Trang chủ | Nhỏ — section xong, chỉ thay ảnh và chữ | [S01](S01-trang-chu.md) |
| 5 | S06 | Trang chi tiết sản phẩm | **Lớn** — cần dựng variant + metafield cho 18 SP | [S06](S06-trang-san-pham.md) |
| 6 | S07 | Giỏ hàng | Nhỏ — chủ yếu kiểm thử | [S07](S07-gio-hang.md) |
| 7 | S08 | Thanh toán | Trung bình — chưa có đơn nào, cần chạy thử | [S08](S08-thanh-toan.md) |
| 8 | S04 | Form Wholesale Inquiry | Nhỏ — chỉ cần tạo page + cấu hình email | [S04](S04-wholesale-inquiry.md) |
| 9 | S05 | Privacy & Cookie Policy | Nhỏ về kỹ thuật — **chờ nội dung pháp lý** | [S05](S05-privacy-cookie.md) |
| 10 | S11 | Trang Feedback | Nhỏ — chờ feedback thật | [S11](S11-feedback.md) |

Nhóm S10 → S06 → S07 → S08 nên làm liền một mạch để kiểm thử đầu–cuối trong một lượt.

---

## Bản thiết kế giao diện

Prototype chạy được, có chú thích từng khối theo mã hạng mục: xem [`../README.md`](../README.md).
