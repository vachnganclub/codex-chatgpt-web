# TCG Vault – Theme Shopify cho cửa hàng thẻ bài Pokémon & One Piece

Theme Online Store 2.0 được dựng theo tài liệu `shopify_tcg_master_prompt_full.md` (hạng mục S00 → S11).
Giao diện cửa hàng (storefront) hoàn toàn bằng **tiếng Anh**; chỉ tài liệu này viết tiếng Việt. Khi tạo menu, page và collection trong Admin cũng đặt tên tiếng Anh.
Theme không cần app trả phí: dùng Shopify Markets cho đa tiền tệ, form liên hệ có sẵn của Shopify cho Wholesale Inquiry,
bộ lọc có sẵn của Shopify (app miễn phí *Search & Discovery*), và Checkout mặc định của Shopify.

Quy ước nhãn trong tài liệu này:

- **[ĐÃ XÁC ĐỊNH]** theo yêu cầu dự án
- **[ĐỀ XUẤT]** khuyến nghị, cần khách duyệt
- **[CẦN CUNG CẤP]** dữ liệu còn thiếu, khách hàng phải gửi

---

## 1. Cài theme vào Shopify

1. Lấy file `tcg-vault-theme.zip` (trong thư mục `dist/`, hoặc tự đóng gói: `cd shopify-theme/theme && zip -r ../dist/tcg-vault-theme.zip .`).
2. Shopify Admin → **Online Store → Themes → Add theme → Upload zip file** → chọn file zip.
3. Bấm **Customize** để kiểm tra trước, sau đó **Actions → Publish** khi đã xong.

Cấu trúc theme (thư mục `theme/`):

| Thư mục | Nội dung |
|---|---|
| `layout/` | `theme.liquid` (khung chung), `password.liquid` |
| `templates/` | JSON templates: `index`, `product`, `collection`, `cart`, `page`, `page.wholesale-inquiry`, `page.privacy-policy`, `page.feedback`, `search`, `404`, `blog`, `article`, `list-collections`, `password`, `customers/*`, `gift_card.liquid` |
| `sections/` | Header, Footer, banner, link cards, featured collection, product, collection, cart, wholesale form, feedback, policy… |
| `snippets/` | `product-card`, `price`, `product-meta` (đọc đơn vị card/pack, hạng hiếm, dòng game), `localization-form` (chọn quốc gia/tiền tệ) |
| `assets/` | `base.css`, `theme.js` (JavaScript thuần, không thư viện ngoài) |
| `config/`, `locales/` | Theme settings, chuỗi tiếng Anh cho khách quốc tế |

Theme đã chạy **Shopify Theme Check** (`@shopify/theme-check-node`, cấu hình recommended): 0 lỗi, 0 cảnh báo.

---

## 2. Bước 1 – Phạm vi và danh sách cần khách hàng cung cấp

| Mã | Hạng mục | Đường dẫn | Phần theme đảm nhận |
|---|---|---|---|
| S00 | Thiết lập chung | — | Theme settings (logo, màu, dữ liệu TCG, liên hệ) |
| S01 | Trang chủ | `/` | `templates/index.json` |
| S04 | Wholesale Inquiry | `/pages/wholesale-inquiry` | `page.wholesale-inquiry` + `sections/wholesale-form.liquid` |
| S05 | Privacy & Cookie Policy | `/pages/privacy-policy` | `page.privacy-policy` + `sections/main-policy.liquid` |
| S06 | Chi tiết sản phẩm | `/products/<handle>` | `sections/main-product.liquid` |
| S07 | Giỏ hàng | `/cart` | `sections/main-cart.liquid` |
| S08 | Checkout | trang Shopify | Cấu hình trong Admin (theme không can thiệp được) |
| S09 | Header, Footer, chọn tiền tệ | mọi trang | `sections/header.liquid`, `sections/footer.liquid` |
| S10 | Collection Pokémon / One Piece | `/collections/pokemon`, `/collections/one-piece` | `sections/main-collection.liquid` |
| S11 | Feedback | `/pages/feedback` | `page.feedback` + `sections/main-feedback.liquid` |

**[CẦN CUNG CẤP]**

1. Quyền Staff/Collaborator vào Shopify Admin (Settings, Payments, Online Store).
2. Logo (SVG hoặc PNG nền trong, rộng ≥ 600 px), favicon 32×32, màu thương hiệu (nếu khác mặc định).
3. Ảnh banner trang chủ (desktop 16:9 ≥ 2000 px, mobile 4:5 ≥ 900 px) và ảnh 4 thẻ liên kết (vuông ≥ 800 px).
4. Nội dung giới thiệu cửa hàng (trang chủ + footer).
5. Danh sách sản phẩm theo file mẫu `product-import-template.csv`: tên, mô tả, ảnh, giá từng variant card/pack, SKU, tồn kho, hạng hiếm, set, số thẻ, tình trạng, ngôn ngữ, nội dung pack.
6. Xác nhận thị trường Anh (GBP) có bán hay không.
7. Phí vận chuyển, khu vực giao hàng, chính sách thuế/VAT cho Mỹ, EU, Singapore (và UK nếu có).
8. Thông tin doanh nghiệp và tài khoản ngân hàng cho Shopify Payments.
9. Email nhận Wholesale Inquiry và email hiển thị ở footer.
10. Văn bản Privacy Policy và Cookie Policy đã được luật sư/khách duyệt, tên pháp nhân, email xử lý yêu cầu riêng tư, ngày hiệu lực.
11. Nội dung feedback thật: tên, quốc gia, nhận xét, ảnh sản phẩm khách nhận (nếu có) và sự đồng ý của khách khi đăng.
12. Link kênh liên hệ: WhatsApp, LINE, Telegram, Instagram, Facebook, TikTok… (chỉ kênh có thật).

## 3. Bước 2 – Thứ tự triển khai [ĐỀ XUẤT]

| Giai đoạn | Hạng mục | Điều kiện bắt đầu |
|---|---|---|
| 1. Nền tảng | Upload theme, S00 (tag, collection, Markets, Payments) | Có quyền Admin |
| 2. Luồng mua hàng | S10 → S06 → S07 → S08 (kiểm thử đầu–cuối 1 lượt) | Có ít nhất vài sản phẩm thật + Markets bật |
| 3. Khung chung | S09 Header/Footer, S01 Trang chủ | Có logo, banner, menu |
| 4. Nội dung tĩnh | S04, S05, S11 (làm song song khi chờ dữ liệu) | Có email nhận, văn bản pháp lý, feedback |
| 5. Nghiệm thu | Chạy toàn bộ test case bên dưới trên desktop + mobile | Hoàn tất 1–4 |

---

## 4. Hướng dẫn từng hạng mục

### S00 – Thiết lập chung & cấu hình cửa hàng

**a. Mục tiêu:** cửa hàng có đủ cấu hình nền: thông tin cửa hàng, collection, quy ước tag, Markets đa tiền tệ, Shopify Payments.

**b. Các bước**

1. **Settings → General**: tên cửa hàng, email liên hệ, email người gửi (Sender email), múi giờ, địa chỉ doanh nghiệp, đơn vị cân nặng.
2. **Settings → Domains**: kết nối tên miền chính.
3. **Products → Collections → Create collection** (loại *Automated*):
   - `Pokémon` (handle `pokemon`): điều kiện *Product tag is equal to* `pokemon`.
   - `One Piece` (handle `one-piece`): điều kiện *Product tag is equal to* `one-piece`.
   - [ĐỀ XUẤT] `Single cards` (handle `single-cards`, tag `unit:card`) và `Bulk packs` (handle `bulk-packs`, tag `unit:pack`) cho menu "Mua lẻ" / "Mua số lượng lớn".
4. **Quy ước tag [ĐỀ XUẤT]** (chữ thường, không dấu, gạch nối):

   | Tag | Ý nghĩa | Ví dụ |
   |---|---|---|
   | `pokemon` / `one-piece` | Dòng game (bắt buộc, đúng 1 tag) | `pokemon` |
   | `unit:card` / `unit:pack` | Hình thức bán (sản phẩm có variant card + pack thì gắn cả hai) | `unit:pack` |
   | `rarity:<hang-hiem>` | Hạng hiếm | `rarity:secret-rare` |

5. **Settings → Custom data → Products → Add definition** (namespace `custom`): `rarity`, `set_name`, `card_number`, `condition`, `language` (Single line text), `pack_contents` (Multi-line text). Theme tự hiển thị nếu có dữ liệu.
6. **Settings → Markets**: tạo market *United States* (USD), *Europe* (EUR – các nước EU), *Singapore* (SGD); thêm *United Kingdom* (GBP) khi khách xác nhận. Trong mỗi market: bật *Currency* đúng loại tiền, chọn làm tròn giá nếu muốn.
   - Giới hạn: đa tiền tệ chỉ hoạt động khi dùng **Shopify Payments**; tỷ giá tự động (hoặc nhập tay theo market); khách chỉ thanh toán bằng tiền tệ của market đang chọn.
7. **Settings → Payments → Shopify Payments**: hoàn tất thông tin doanh nghiệp, tài khoản nhận tiền, bật thẻ / Shop Pay / Apple Pay / Google Pay. Bật **Test mode** để chạy đơn thử, tắt sau khi nghiệm thu.
8. **Settings → Shipping and delivery**: tạo shipping zone cho US, EU, Singapore (UK).
9. **Online Store → Themes → Customize → Theme settings → TCG data**: giữ `Purchase type` làm tên option variant, prefix tag `rarity:` và `unit:`.

**c. Dữ liệu đầu vào:** mục 1, 6, 7, 8 của danh sách [CẦN CUNG CẤP].

**Câu hỏi cho khách về vận chuyển và thuế:** phí ship theo khối lượng hay đồng giá? Có miễn phí ship từ mức nào? Ship card lẻ và pack có khác cách đóng gói? Đã đăng ký VAT EU (OSS/IOSS) chưa? Có thu GST Singapore? Giá niêm yết đã gồm thuế hay chưa (EU thường hiển thị giá gồm VAT)? Thuế bang ở Mỹ (sales tax nexus)?

**d. Test case**

| # | Thao tác | Kết quả mong đợi |
|---|---|---|
| 1 | Tạo sản phẩm có tag `pokemon` | Tự vào collection Pokémon, không vào One Piece |
| 2 | Đổi quốc gia sang Singapore ở header | Mọi giá hiển thị SGD |
| 3 | Đặt đơn thử ở Test mode | Đơn xuất hiện trong Orders, email xác nhận gửi đi |

**e. Nghiệm thu:** ☐ Store details đầy đủ ☐ 2 collection tự động đúng điều kiện ☐ Markets USD/EUR/SGD bật ☐ Shopify Payments active ☐ Shipping zones đủ khu vực.

### S01 – Trang chủ `/`

**a. Mục tiêu:** trang chủ dẫn khách tới 2 dòng game, wholesale và feedback.

**b. Các bước:** Customize → Home page. Thứ tự section có sẵn trong theme:

| # | Section | Mục đích | CTA |
|---|---|---|---|
| 1 | Image banner | Thông điệp chính | `/collections/pokemon`, `/collections/one-piece` |
| 2 | Link cards "Shop by game" | 4 lối tắt | Pokémon, One Piece, `/pages/wholesale-inquiry`, `/pages/feedback` |
| 3 | Featured collection Pokémon | Sản phẩm nổi bật | `/collections/pokemon` |
| 4 | Featured collection One Piece | Sản phẩm nổi bật | `/collections/one-piece` |
| 5 | Rich text "About us" | Giới thiệu cửa hàng | — |

Thay ảnh banner (desktop + mobile), thay câu chữ placeholder bằng nội dung khách cung cấp.

**c. Dữ liệu:** banner 16:9 ≥ 2000 px (≤ 500 KB, JPG/WEBP), bản mobile 4:5 ≥ 900 px, ảnh link card 1:1 ≥ 800 px, đoạn giới thiệu [CẦN CUNG CẤP].

**d. Test case:** bấm từng CTA mở đúng đường dẫn; mobile 375 px không tràn ngang, banner dùng ảnh mobile; collection trống hiện ô placeholder.

**e. Nghiệm thu:** ☐ Không còn chữ mẫu ☐ 4 CTA đúng link ☐ Ảnh không méo trên mobile ☐ Giá ở Featured collection đúng tiền tệ đang chọn.

### S04 – Wholesale Inquiry `/pages/wholesale-inquiry`

**a. Mục tiêu:** khách sỉ gửi yêu cầu, cửa hàng nhận qua email.

**b. Các bước**

1. **Online Store → Pages → Add page**: tiêu đề "Wholesale Inquiry", handle `wholesale-inquiry`, **Theme template = `page.wholesale-inquiry`**. Nội dung trang (nếu có) hiển thị làm đoạn giới thiệu trên form.
2. Form có sẵn trường: Name, Country, Email, Products & Quantity, Preferred contact (WhatsApp / LINE / Instagram / Telegram), Contact ID, Message.
3. Email nhận: form dùng *contact form* của Shopify, gửi về **Settings → General → Store contact email**. Kiểm tra thêm **Settings → Notifications → Sender email** đã xác minh tên miền để tránh vào spam.

**Validation (thông báo tiếng Anh):** Name bắt buộc ≥ 2 ký tự; Country bắt buộc; Email bắt buộc, đúng định dạng; Products & Quantity bắt buộc ≥ 3 ký tự; Preferred contact bắt buộc chọn 1; Contact ID bắt buộc ≥ 3 ký tự; Message không bắt buộc (≤ 2000 ký tự). Shopify kiểm tra lại email ở server và có chống spam (hCaptcha) tự động.

**d. Test case:** gửi đủ trường → hiện "Thank you! Your wholesale inquiry has been sent…" và email về hộp thư; bỏ trống từng trường bắt buộc → hiện lỗi dưới trường đó, không gửi; email `abc@` → lỗi định dạng; gửi trên điện thoại → bàn phím email đúng loại, nút bấm đủ lớn; kiểm tra thư mục Spam.

**e. Nghiệm thu:** ☐ Email về đúng hộp thư ☐ Đủ 7 trường ☐ Thông báo thành công ☐ Link ở footer và trang chủ.

### S05 – Privacy Policy & Cookie Policy `/pages/privacy-policy`

**a. Mục tiêu:** một trang có 2 phần Privacy (`#privacy-policy`) và Cookie (`#cookie-policy`), có link ở footer.

**b. Các bước**

1. **Pages → Add page**: "Privacy Policy", handle `privacy-policy`, template `page.privacy-policy`. Nội dung trang = Phần 1 Privacy Policy.
2. Customize → mở trang này → section *Privacy & Cookie policy* → nhập **Cookie Policy text** (Phần 2) và dòng ngày hiệu lực.
3. Cookie banner cho EU: **Settings → Customer privacy → Cookie banner** → bật cho các vùng cần, chọn *Privacy policy link* trỏ tới `/pages/privacy-policy#cookie-policy`.
4. Footer tự hiển thị 2 link *Privacy Policy* và *Cookie Policy* khi trang `privacy-policy` tồn tại.

**Khung mục lục [ĐỀ XUẤT – chỉ là khung, không phải cam kết pháp lý]:**
Phần 1: Đơn vị kiểm soát dữ liệu · Dữ liệu thu thập · Mục đích · Cơ sở pháp lý · Chia sẻ cho bên thứ ba (Shopify, cổng thanh toán, vận chuyển) · Chuyển dữ liệu quốc tế · Thời gian lưu · Quyền của người dùng · Liên hệ · Ngày hiệu lực.
Phần 2: Cookie là gì · Các loại cookie (cần thiết, phân tích, marketing) · Danh sách cookie · Cách quản lý/từ chối · Cập nhật chính sách.

**c. Dữ liệu [CẦN CUNG CẤP]:** tên pháp nhân, địa chỉ, email xử lý yêu cầu riêng tư, ngày hiệu lực, văn bản đã duyệt.

**d. Test case:** mở link footer → cuộn tới đúng phần; banner cookie hiện khi giả lập IP EU; đọc được trên mobile không tràn chữ.

**e. Nghiệm thu:** ☐ Đủ 2 phần ☐ Không còn nội dung mẫu ☐ Link footer + banner đúng.

### S06 – Trang sản phẩm `/products/<handle>`

**a. Mục tiêu:** khách chọn mua lẻ (card) hoặc mua pack, thấy đúng giá, đơn vị, tồn kho.

**b. Cấu trúc variant [ĐỀ XUẤT]:** Option1 Name = `Purchase type`; Option1 Value = `card` hoặc `pack`. Mỗi variant có giá, SKU, tồn kho, ảnh riêng. Sản phẩm chỉ bán một hình thức thì vẫn dùng 1 variant với option này để thẻ sản phẩm hiện đúng đơn vị.

Bố cục theme: ảnh + thumbnail, nhãn dòng game, hạng hiếm, tên, giá kèm "/ card" hoặc "/ pack", chọn variant, tình trạng kho ("In stock", "Only X left", "Sold out"), số lượng (giới hạn theo tồn kho), Add to cart, nút thanh toán nhanh, mô tả, bảng thông số (đơn vị, hạng hiếm, set, số thẻ, tình trạng, ngôn ngữ, SKU).

Khi đổi variant: giá, giá gốc, đơn vị, SKU, tồn kho, ảnh, số lượng tối đa và URL (`?variant=`) cập nhật ngay.

**c. Dữ liệu:** file `product-import-template.csv`. Cột bắt buộc: `Handle`, `Title`, `Tags`, `Option1 Name`, `Option1 Value`, `Variant SKU`, `Variant Price`, `Variant Inventory Tracker` (= `shopify`), `Variant Inventory Qty`, `Variant Inventory Policy` (= `deny`), `Image Src`, `Status`. Mỗi variant là một dòng; dòng thứ 2 của cùng sản phẩm chỉ cần `Handle` + cột variant. Import: **Products → Import**.

**d. Test case:** đổi card ↔ pack (giá, ảnh, tồn kho đổi); tăng/giảm số lượng; variant hết hàng → nút "Sold out" bị khoá; nhập số lượng vượt tồn kho → báo "Only X available in stock."; đổi USD/EUR/SGD → giá đổi đúng tiền tệ.

**e. Nghiệm thu:** ☐ Mọi sản phẩm có option `Purchase type` ☐ Giá + tồn kho riêng từng variant ☐ Không mua vượt tồn kho.

### S07 – Giỏ hàng `/cart`

**a. Mục tiêu:** card và pack cùng một giỏ, sửa số lượng, tổng tiền đúng tiền tệ.

**b. Thành phần:** ảnh, tên, variant (card/pack), đơn giá "/ card" hoặc "/ pack", số lượng (+/−), thành tiền, ghi chú đơn hàng, tạm tính kèm mã tiền tệ, nút Continue shopping, Check out, nút thanh toán nhanh. Đổi số lượng → giỏ tự cập nhật và Shopify tính lại tổng theo tiền tệ của market đang chọn (cùng nguồn dữ liệu với Checkout nên luôn khớp). Đặt số lượng 0 hoặc bấm Remove để xoá.

**d. Test case:** giỏ trộn 1 card + 1 pack cùng sản phẩm → 2 dòng riêng; đổi số lượng → thành tiền + tổng đúng; số lượng > tồn kho → bị giới hạn; giỏ rỗng → hiện "Your cart is empty" + nút mua tiếp; đổi tiền tệ trong lúc có hàng → tổng đổi theo.

**e. Nghiệm thu:** ☐ Card + pack chung giỏ ☐ Tổng tính lại đúng ☐ Tiền tệ khớp Checkout.

### S08 – Checkout

**a. Mục tiêu:** Checkout mặc định của Shopify mang logo và màu thương hiệu.

**b. Các bước:** **Settings → Checkout → Customize** (Checkout editor): logo, màu nút, màu nền, font. Giới hạn: không chỉnh bố cục/HTML Checkout (chỉ Shopify Plus mới có Checkout Extensibility nâng cao).

**Luồng kiểm tra:** địa chỉ → phương thức vận chuyển → thanh toán → trang xác nhận → email xác nhận (**Settings → Notifications → Order confirmation**).

**Kịch bản đơn thử:** với mỗi market (US/USD, EU/EUR, SG/SGD) đặt 1 đơn trộn card + pack bằng Shopify Payments Test mode (thẻ test `4242 4242 4242 4242`), so sánh tổng ở giỏ hàng và Checkout.

**Rủi ro thường gặp:** Shopify Payments chưa kích hoạt → không đổi được tiền tệ; thiếu shipping zone → báo "no shipping rates"; giá tay trong market khác giá quy đổi → kiểm tra **Markets → Products and pricing**.

**e. Nghiệm thu:** ☐ Logo/màu đồng bộ ☐ Giá và tiền tệ Checkout khớp giỏ ☐ Nhận email xác nhận.

### S09 – Header, Footer & chọn tiền tệ

**Menu đầu trang** (**Online Store → Navigation → Main menu**):

| Mục menu (tên hiển thị tiếng Anh) | Đường dẫn |
|---|---|
| Home | `/` |
| Single cards (Mua lẻ) | `/collections/single-cards` |
| Bulk packs (Mua số lượng lớn) | `/collections/bulk-packs` (có thể thêm mục con Wholesale Inquiry) |
| Pokémon | `/collections/pokemon` |
| One Piece | `/collections/one-piece` |
| Cart (Giỏ hàng) | `/cart` |

**Chọn quốc gia/tiền tệ:** desktop ở góc phải header và trong footer; mobile nằm trong menu thu gọn (☰). Chọn quốc gia → trang tải lại, mọi giá đổi sang USD/EUR/SGD. Selector chỉ hiện khi có từ 2 market trở lên.

**Footer:** logo, email liên hệ (Theme settings → Contact & social), cột Shop (menu chính), cột Information (Wholesale Inquiry, Customer Feedback, Privacy Policy, Cookie Policy + menu `footer` tuỳ chọn), cột Contact us (WhatsApp, LINE, Telegram, Instagram, Facebook, TikTok, X, YouTube – chỉ hiện kênh đã điền), icon thanh toán.

**Test case:** đổi khu vực rồi kiểm tra giá ở Home → Collection → Product → Cart; menu mở/đóng trên mobile; mọi link footer đúng.

**Nghiệm thu:** ☐ Header/Footer trên mọi trang ☐ 6 mục menu đúng link ☐ Selector đổi giá ☐ Không vỡ trên mobile.

### S10 – Collection Pokémon & One Piece

**a. Mục tiêu:** liệt kê đúng sản phẩm, lọc, sắp xếp.

**b. Các bước:** collection tự động theo tag (xem S00). Cài app miễn phí **Search & Discovery** → **Filters**: Availability, Price, Product type, *Rarity* (metafield `custom.rarity` hoặc tag), *Purchase type* (variant option). Sắp xếp có sẵn: Featured, Price low→high, high→low, Date new→old. Thẻ sản phẩm hiện đơn vị `CARD` / `PACK`, hạng hiếm, giá "From …" khi có nhiều variant.

**d. Test case:** sản phẩm tag `pokemon` không xuất hiện ở One Piece; lọc theo giá/hạng hiếm trả đúng; sắp xếp giá tăng dần đúng; 2 cột trên mobile; bấm thẻ → mở đúng trang sản phẩm.

**e. Nghiệm thu:** ☐ Không lọt nhầm collection ☐ Bộ lọc hoạt động ☐ Thẻ ghi rõ card/pack.

### S11 – Feedback `/pages/feedback`

**a. Mục tiêu:** trang trích dẫn feedback do quản trị viên cập nhật, khách không tự gửi được.

**b. Các bước:** **Pages → Add page** "Customer Feedback", handle `feedback`, template `page.feedback`; nội dung trang = đoạn giới thiệu. Thêm/sửa/xoá feedback: **Online Store → Themes → Customize** → chọn trang *feedback* → section *Customer feedback* → **Add block → Feedback** (tên, quốc gia, nội dung, ảnh) → Save. Xoá: chọn block → *Remove block*. Kéo thả để đổi thứ tự.

**Quy cách ảnh:** vuông 1:1, ≥ 800×800 px, JPG/WEBP ≤ 300 KB; theme cắt vuông bằng `object-fit: cover` nên ảnh không bị méo.

**d. Test case:** thêm 1 feedback có ảnh, 1 không ảnh → đều hiển thị đẹp; link từ footer và trang chủ mở đúng trang.

**e. Nghiệm thu:** ☐ Không có form gửi đánh giá ☐ Có tên, quốc gia, nội dung, ảnh (nếu có) ☐ Không có feedback bịa.

---

## 5. Definition of Done (toàn dự án)

- ☐ 2 collection Pokémon và One Piece, sản phẩm đúng tag.
- ☐ Mỗi sản phẩm phân biệt card / pack với giá và đơn vị riêng.
- ☐ Đổi quốc gia → giá đổi đúng USD / EUR / SGD.
- ☐ Card + pack chung giỏ, sửa số lượng tính lại đúng.
- ☐ Đi hết luồng đặt hàng, nhận email xác nhận.
- ☐ Wholesale Inquiry gửi được, có validation và thông báo thành công.
- ☐ Privacy Policy có đủ Privacy + Cookie, link ở footer.
- ☐ Feedback hiển thị trích dẫn, tên, quốc gia, ảnh; có link từ menu/footer.
- ☐ Header/Footer hiển thị mọi trang, không vỡ trên mobile.
