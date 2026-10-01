# Nhật ký triển khai thật trên adamantile.com

Ngày 01/10/2026. Mọi thay đổi dưới đây đã được **thực hiện thật** trên store qua Admin API.

**Không chạm vào:** giá bán, số lượng tồn kho, file theme, Checkout, bảng phí vận chuyển, cấu hình
thuế, Shopify Payments, Privacy policy đang có ở Settings → Policies, market "Việt Nam",
collection `frontpage`, page "Liên hệ".

---

## 1. Metafield — đã tạo 6 definition

Namespace `custom`, owner PRODUCT, đều **pinned** và mở quyền đọc cho storefront để
`main-product.liquid` render được khối thông số.

| Key | Name | Type | Khả năng thêm |
|---|---|---|---|
| `custom.rarity` | Rarity | single_line_text_field | Dùng được làm điều kiện collection tự động + lọc trong Admin |
| `custom.set_name` | Set | single_line_text_field | Lọc trong Admin |
| `custom.card_number` | Card number | single_line_text_field | — |
| `custom.condition` | Condition | single_line_text_field | Lọc trong Admin |
| `custom.language` | Language | single_line_text_field | Lọc trong Admin |
| `custom.pack_contents` | Pack contents | single_line_text_field | — |

## 2. 18 sản phẩm sealed — đã gắn tag, productType và metafield

Tag: `pokemon` (13) hoặc `one-piece` (5), cộng `unit:sealed` cho tất cả.
productType: `Sealed product` (17) và `Deck` (1 — bộ Constructed Deck Espeon/Umbreon).

Metafield được **trích từ chính mô tả sản phẩm của bạn**, không suy đoán:

| Sản phẩm | `set_name` | `pack_contents` |
|---|---|---|
| 30th CELEBRATION Box | m6a — 30th CELEBRATION | 20 booster packs × 6 cards |
| Storm Emeralda Box | m6 — Storm Emeralda | 30 booster packs × 5 cards |
| Abyss Eye Box | m5 — Abyss Eye | 30 booster packs × 5 cards |
| MEGA Dream ex Box | m2a — MEGA Dream ex (High Class) | 10 booster packs × 10 cards |
| Inferno X Box | m2 — Inferno X | 30 booster packs × 5 cards |
| Ninja Spinner Box | m4 — Ninja Spinner | 30 booster packs × 5 cards |
| Munikis / Nihil Zero Box | m3 — Munikis / Nihil Zero | 30 booster packs × 5 cards |
| 30th CELEBRATION FUTURISTIC BOX | 30th CELEBRATION | 2 Pikachu ex FUR promo cards + accessories (no booster packs) |
| Constructed Deck Espeon & Umbreon | 30th CELEBRATION | 2 × 60-card constructed decks + promo cards and accessories |
| SV Special Box — Pokémon Center Hiroshima | Scarlet & Violet — Pokemon Center Hiroshima | 1 promo card + deck box, sleeves, coin, booster pack(s) |
| SV Special Box — Pokémon Center Fukuoka | Scarlet & Violet — Pokemon Center Fukuoka | 1 promo card + deck box, sleeves, coin, booster packs |
| SV Special Box — Pokémon Center Tohoku | Scarlet & Violet — Pokemon Center Tohoku | 1 promo card + deck box, sleeves, coin, booster packs |
| OP THE WORLD'S STRONGEST WARRIORS Box | THE WORLD'S STRONGEST WARRIORS | 24 booster packs × 6 cards |
| OP THE TIME OF BATTLE Box | THE TIME OF BATTLE | 24 booster packs × 6 cards |
| OP Adventure on KAMI's Island Box | Adventure on KAMI's Island | 24 booster packs × 6 cards |
| OP THE AZURE SEA'S SEVEN Box | THE AZURE SEA'S SEVEN | 24 booster packs × 6 cards |
| OP CARRYING ON HIS WILL Box | CARRYING ON HIS WILL | 24 booster packs × 6 cards |

`condition` = `Sealed` và `language` = `Japanese` cho tất cả.

> ⚠️ **Một suy luận cần bạn xác nhận.** 17/18 mô tả ghi rõ chữ "Japanese". Riêng
> **30th CELEBRATION FUTURISTIC BOX** không ghi; tôi vẫn đặt `Japanese` vì nó thuộc dòng
> MEGA Nhật. Nếu sai, sửa 1 trường.

## 3. SKU và chặn bán quá tồn kho — 17 variant

Quy ước SKU: `<GAME>-<LOẠI>-<SET>-<DẠNG>`.

| SKU | | SKU | |
|---|---|---|---|
| `PKM-SEALED-M6A-BOX` | 30th Celebration | `PKM-SEALED-SV-PC-HIROSHIMA` | Hiroshima |
| `PKM-SEALED-M6-BOX` | Storm Emeralda | `PKM-SEALED-SV-PC-FUKUOKA` | Fukuoka |
| `PKM-SEALED-M5-BOX` | Abyss Eye | `PKM-SEALED-SV-PC-TOHOKU` | Tohoku |
| `PKM-SEALED-M2A-BOX` | MEGA Dream ex | `OPC-SEALED-WORLDS-STRONGEST` | World's Strongest |
| `PKM-SEALED-M2-BOX` | Inferno X | `OPC-SEALED-TIME-OF-BATTLE` | Time of Battle |
| `PKM-SEALED-M4-BOX` | Ninja Spinner | `OPC-SEALED-KAMIS-ISLAND` | KAMI's Island |
| `PKM-SEALED-M3-BOX` | Nihil Zero | `OPC-SEALED-AZURE-SEAS-SEVEN` | Azure Sea's Seven |
| `PKM-SEALED-30TH-FUTURISTIC` | Futuristic Box | `OPC-SEALED-CARRYING-ON-WILL` | Carrying On His Will |
| `PKM-DECK-30TH-ESPEON-UMBREON` | Deck Espeon/Umbreon | | |

Mỗi variant cũng đã đặt: `tracked = true`, **`inventoryPolicy = DENY`** (hết hàng là không bán
nữa), `requiresShipping = true`.

`DENY` là điều kiện để theme hiện cảnh báo "còn N" và đặt `max` cho ô số lượng — xem
[S06 khối B5](S06-trang-san-pham.md).

**Số lượng tồn kho vẫn nguyên giá trị cũ (10 cho mọi sản phẩm).** Đây vẫn là số tạm,
bạn cần nhập số thật.

## 4. Sản phẩm trùng lặp — đã chuyển Draft

"Pokemon Card Game MEGA High Class Pack MEGA Dream ex Box" tồn tại 2 bản. Bản có handle
`...-box-1` đã chuyển **DRAFT** và gắn thêm tag `duplicate`. Không xoá, để bạn tự quyết định.

## 5. Collection — 4 cái, đều tự động

| Handle | Điều kiện | Sort | Số SP (gồm cả Draft) | Hiện trên storefront |
|---|---|---|---|---|
| `pokemon` | tag = `pokemon` | Newest | 21 | 12 |
| `one-piece` | tag = `one-piece` | Newest | 13 | 5 |
| `single-cards` | tag = `unit:card` | Newest | 10 | **0** |
| `bulk-packs` | tag = `unit:pack` | Newest | 16 | **0** |

`pokemon` và `one-piece` đã **chuyển từ thủ công sang tự động**. Đã kiểm tra: tạo xong là
collection tự nhận sản phẩm theo tag, không cần gán tay.

Hai collection mới có mô tả tiếng Anh ngắn, mang tính mô tả cấu trúc. **Thay bằng nội dung
marketing của bạn khi có.**

## 6. Pages — 3 trang

| Handle | Template | Trạng thái | Lý do |
|---|---|---|---|
| `wholesale-inquiry` | `wholesale-inquiry` | **Hiện** | Form chạy được ngay, không cần nội dung gì thêm |
| `privacy-policy` | `privacy-policy` | **Ẩn** | Template còn chứa chữ "DEMO PLACEHOLDER" ở phần Cookie — xem mục 10 |
| `feedback` | `feedback` | **Ẩn** | Template còn 3 block "Sample review" — xem mục 10 |

**Vì sao tôi không copy nội dung pháp lý sang trang mới.** Store đã có Privacy policy thật ở
Settings → Policies (Shopify sinh ngày 29/09/2026), nêu pháp nhân **ADAMANTITE LLC**,
117 S Lexington St Ste 100, Harrisonville MO 64701, điện thoại +1 816-237-0767. Nếu tôi copy
sang `/pages/privacy-policy` thì store có **hai bản chính sách ở hai URL**, và khi bạn sửa một
bên, bên kia lặng lẽ cũ đi — đó là rủi ro pháp lý. Bạn chốt bản nào là bản gốc trước
(xem [S05 khối B7](S05-privacy-cookie.md)).

> ⚠️ **Tên pháp nhân lệch tên store.** Store tên **ADAMANTILE**, pháp nhân là
> **ADAMANTITE LLC** (chữ T, không phải L). Một trong hai có thể là lỗi chính tả. Cần xác nhận,
> vì tên này xuất hiện trong chính sách và hoá đơn.

## 7. Menu — đúng 6 mục theo S09

`main-menu`:

| # | Mục | Đường dẫn |
|---|---|---|
| 1 | Home | `/` |
| 2 | Single cards | `/collections/single-cards` |
| 3 | Bulk packs | `/collections/bulk-packs` |
| 4 | Pokémon | `/collections/pokemon` |
| 5 | One Piece | `/collections/one-piece` |
| 6 | Cart | `/cart` |

Đã **xoá** mục "Product → `/collections/all`" (nó hiện lẫn mọi thứ) và **chuyển** mục Contact
xuống footer.

`footer`: Contact · Privacy policy (trỏ `/policies/privacy-policy`) · Search.
Shopify tự thêm "Your Privacy Choices" (trang opt-out chia sẻ dữ liệu) — giữ nguyên.

**Ngôn ngữ:** tôi dùng **tiếng Anh** cho menu, để khớp với nội dung tiếng Anh mà theme đã viết
sẵn ở trang chủ ("Shop Pokémon", "About us") và vì khách là US / EU / SG. Nếu bạn muốn tiếng
Việt, nói để tôi đổi — nhưng phải đổi cả nội dung trang chủ cho thống nhất.

## 8. Markets — đã bật đa tiền tệ

| Market | Handle | Quốc gia | Tiền tệ | Làm tròn |
|---|---|---|---|---|
| United States | `us` | US | **USD** | bật |
| Europe | `eu` | AT BE CZ DE DK ES FI FR IE IT NL NO PL PT SE CH | **EUR** | bật |
| Singapore | `sg` | SG | **SGD** | bật |
| Việt Nam | `vn` | VN | (không đổi) | — |

Cả 3 market mới đặt `localCurrencies = false`, nghĩa là **mọi khách trong market thấy đúng một
tiền tệ** — đúng yêu cầu "EUR cho Châu Âu". Hệ quả: khách **Na Uy và Thuỵ Sĩ cũng thấy EUR**
chứ không phải NOK/CHF. Nếu muốn tách, tạo market riêng cho 2 nước đó.

**Chưa tạo market Anh (GBP)** vì bạn chưa chốt. Store hiện có 4 market; plan Basic có giới hạn
số market nên khi thêm cái thứ 5 Shopify có thể yêu cầu nâng plan.

> Bộ chọn quốc gia trong theme chỉ render khi có hơn 1 quốc gia khả dụng. Giờ đã đủ điều kiện,
> nên nó **sẽ hiện ra**. Tôi không tự mở được `adamantile.com` từ môi trường này để xem tận mắt
> — bạn mở trang chủ xác nhận giúp.

## 9. 16 sản phẩm demo — đã chuyển Draft

"Ember Drake – Fire Basic", "Astral Wyrm – Dragon Secret Rare", "Pokémon-style Bulk Pack – 100
Common Cards"… 16 sản phẩm này là dữ liệu dựng thử, **tên sản phẩm không tồn tại thật**, nhưng
đang ở trạng thái ACTIVE trên một store live có domain và SSL. Nếu có khách đặt, bạn không có
hàng để giao.

Tôi đã chuyển cả 16 sang **DRAFT**. Hoàn tác là một cú bấm nếu bạn cần chúng để demo.

**Hệ quả cần biết:** `single-cards` và `bulk-packs` giờ **rỗng** trên storefront, vì 16 sản phẩm
demo là thứ duy nhất có tag `unit:card` / `unit:pack`. Hai mục menu đó dẫn tới trang rỗng (theme
có empty state đàng hoàng, không phải trang trắng). Ba cách xử lý:

| | Cách | Khi nào chọn |
|---|---|---|
| A | Để nguyên, đợi dữ liệu lá bài lẻ thật | Khuyến nghị — automation đã sẵn, nhập sản phẩm là tự hiện |
| B | Bật lại 16 sản phẩm demo | Chỉ khi bạn đang demo cho ai đó xem |
| C | Tạm bỏ 2 mục khỏi menu | Nếu còn lâu mới có hàng lẻ |

---

## 10. Phần chỉ bạn làm được

### 10a. Theme Editor — **bắt buộc trước khi hiện 2 trang còn ẩn**

Tôi không ghi được file vào theme đang live (bị chặn, và đúng ra nên làm trong Theme Editor).

| # | Việc | Đường đi |
|---|---|---|
| 1 | **Xoá chữ "DEMO PLACEHOLDER"** | Customize → dropdown trên → Pages → *Privacy Policy & Cookie Policy* → section **Privacy & Cookie policy** → ô **Cookie Policy text** → xoá sạch, dán nội dung thật |
| 2 | **Xoá 3 block "Sample review"** | Customize → Pages → *Customer feedback* → section **Customer feedback** → xoá `Sample review 1/2/3` |
| 3 | Sau bước 1 → **hiện trang Privacy** | Pages → Privacy Policy & Cookie Policy → Visibility → Visible |
| 4 | Sau bước 2 và khi có feedback thật → **hiện trang Feedback** | Pages → Customer feedback → Visible |
| 5 | **Thay ảnh hero** | Customize → Home page → Image banner → Image. Ảnh hiện tại tên `AdobeStock_…Preview_Editorial_Use_Only.jpg` — **bản preview, không được dùng cho store thương mại** |
| 6 | Thay 4 ảnh thẻ | Customize → Home page → section **Shop by game** → từng block |
| 7 | Thay chữ demo mục About | Customize → Home page → **About us** → đang là "This is demo text…" |
| 8 | Điền thông tin liên hệ | Customize → **Theme settings** → Contact & social: `contact_email`, `contact_whatsapp`, `contact_line`, `contact_telegram`, `social_instagram`… Đang **trống hết**, nên cột "Contact us" ở footer đang rỗng |
| 9 | Điền đoạn giới thiệu footer | Customize → Footer → **Short text under the logo** |
| 10 | Giảm bề rộng logo | Theme settings → logo width: 300 → **160–200** |

### 10b. Cài app lọc

Apps → **Search & Discovery** (miễn phí, của Shopify) → Install → Filters → thêm
Availability, Price, Product type, và `custom.rarity`. Chi tiết ở
[S10 khối B3](S10-collection.md).

### 10c. Settings

| # | Việc | Đường đi |
|---|---|---|
| 1 | Chốt múi giờ | Settings → General → đang `Asia/Bangkok` nhưng địa chỉ ở Missouri, US |
| 2 | Email store sang domain | Settings → General → Store contact email — đang là Gmail cá nhân |
| 3 | Xác thực sender email | Settings → Notifications → Sender email → **Authenticate** (cần thêm SPF/DKIM ở nhà cung cấp domain) |
| 4 | Branding Checkout | Settings → Checkout → Customize. Màu lấy từ theme: primary `#1d3fbb`, bo góc 10px |
| 5 | Bảng phí vận chuyển | Settings → Shipping and delivery. **Kiểm từng zone có ít nhất 1 rate** — zone thiếu rate là khách nước đó không checkout được |
| 6 | Cookie banner | Settings → Customer privacy → bật, chọn EEA + UK, trỏ link về `/pages/privacy-policy#cookie-policy` (sau khi trang đã Visible) |
| 7 | Kiểm tra Shopify Payments | Settings → Payments → trạng thái Active |
| 8 | Chạy đơn thử | Bật Test mode → đặt 1 đơn cho US, 1 cho EU, 1 cho SG → kiểm email xác nhận → **tắt Test mode** |

### 10d. Dữ liệu còn thiếu

| # | Mục |
|---|---|
| 1 | **Danh sách lá bài lẻ thật** — store hiện có 0 sản phẩm hàng lẻ. Dùng quy cách CSV ở [S06 khối B7](S06-trang-san-pham.md) |
| 2 | Tồn kho thật của 17 sản phẩm sealed (đang đồng loạt 10) |
| 3 | Trọng lượng (gram) từng variant — thiếu cái này không tính được phí ship theo trọng lượng |
| 4 | Toàn văn Cookie Policy đã được duyệt |
| 5 | Nội dung feedback thật + bằng chứng khách đồng ý cho đăng |
| 6 | 5 đoạn nội dung mục About ([S01 khối B5](S01-trang-chu.md)) |
| 7 | Ảnh hero và 4 ảnh thẻ có quyền sử dụng thương mại |
| 8 | Link WhatsApp / LINE / Telegram / Instagram |
| 9 | Bảng phí ship cho US, EU, SG |
| 10 | Trạng thái đăng ký VAT / IOSS / GST, và HS code cho thẻ bài |
| 11 | Xác nhận có mở thị trường Anh (GBP) |
| 12 | Xác nhận tên pháp nhân: ADAMANTILE hay ADAMANTITE LLC |

---

## Trạng thái tổng kết

| Mã | Hạng mục | Trạng thái |
|---|---|---|
| S00 | Thiết lập chung, tag, Markets | **Xong phần cấu hình.** Còn: múi giờ, email, tồn kho thật, đơn thử |
| S09 | Header, Footer, chọn tiền tệ | **Xong menu và Markets.** Còn: điền thông tin liên hệ trong Theme settings |
| S10 | Collection | **Xong.** Còn: cài Search & Discovery để có filter |
| S01 | Trang chủ | **Cấu trúc xong từ trước.** Còn: thay ảnh và chữ demo |
| S06 | Trang sản phẩm | **Xong cho hàng sealed.** Còn: toàn bộ dữ liệu lá bài lẻ |
| S07 | Giỏ hàng | **Xong.** Chỉ còn kiểm thử |
| S08 | Thanh toán | **Chưa.** Cần branding, phí ship, và chạy đơn thử — store vẫn 0 đơn |
| S04 | Wholesale Inquiry | **Xong và đang hiện.** Còn: đổi email nhận sang domain |
| S05 | Privacy & Cookie | **Trang đã tạo, đang ẩn.** Chờ nội dung Cookie Policy |
| S11 | Feedback | **Trang đã tạo, đang ẩn.** Chờ feedback thật (store chưa có đơn nào) |
