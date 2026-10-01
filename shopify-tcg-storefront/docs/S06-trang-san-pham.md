# S06 — Trang chi tiết sản phẩm (`/products/<handle>`)

Dùng `sections/main-product.liquid`. Code đã xong. Việc còn lại là **dựng dữ liệu sản phẩm cho
đúng cấu trúc theme đang đọc** — đây là hạng mục nặng nhất của cả dự án.

---

## a. Mục tiêu

1. Mỗi lá bài lẻ cho khách chọn được hình thức mua: **card** (1 lá) hoặc **pack** (nhiều lá cùng hạng),
   mỗi lựa chọn có giá, SKU và tồn kho riêng.
2. Đổi variant thì giá, SKU, tồn kho và ảnh đổi theo ngay, không tải lại trang.
3. Khối thông số hiện đủ: hạng hiếm, set, số thứ tự, tình trạng, ngôn ngữ in, đơn vị tính.
4. Sản phẩm hết hàng không cho thêm vào giỏ.
5. Đặt được quy cách dữ liệu để khách tự nhập hàng loạt về sau.

---

## b. Các bước thực hiện

### B1. Cấu trúc Variant — **[ĐÃ XÁC ĐỊNH theo theme]**

`main-product.liquid` và `snippets/product-meta.liquid` so sánh tên option với
`settings.purchase_option_name`, hiện đang là **`Purchase type`**.

| Thành phần | Quy ước | Bắt buộc |
|---|---|---|
| Tên Option | **`Purchase type`** — đúng từng chữ | ✅ Theme so sánh sau khi `downcase`, nên `purchase type` cũng được, nhưng đừng đổi từ |
| Value cho hàng lẻ | **`card`** | ✅ |
| Value cho hàng pack | **`pack`** | ✅ |
| Viết hoa | Theme tự `downcase` khi hiển thị, nên `Card` / `card` đều ra `card`. **[ĐỀ XUẤT]** nhập chữ thường cho thống nhất | |

> ⚠️ Nếu đổi `purchase_option_name` trong Theme settings mà không đổi tên option của sản phẩm,
> hoặc ngược lại, thì theme mất liên kết: unit pill biến mất, dòng `/ card` cạnh giá biến mất,
> fallback về tag `unit:*`. Đây là lỗi âm thầm, không báo gì.

Cấu trúc theo 3 loại sản phẩm:

| Loại | Option | Variant | Tag | Ghi chú |
|---|---|---|---|---|
| **Lá bài lẻ** | `Purchase type` | `card` + `pack` | `pokemon`\|`one-piece`, `unit:card`, `unit:pack`, `rarity:*` | Đúng mô hình 10 SP demo đang có |
| **Bulk pack** (100 common, 25 holo…) | Không có option | 1 variant mặc định | `pokemon`\|`one-piece`, `unit:pack`, `rarity:*` | Đúng mô hình 6 SP demo đang có |
| **Booster box / deck sealed** | Không có option | 1 variant mặc định | `pokemon`\|`one-piece`, `unit:sealed` | 18 SP thật hiện có; tag chưa gắn |

Lý do bulk pack và sealed **không** cần option: chúng chỉ có một hình thức bán. Theme sẽ lấy đơn vị
từ tag `unit:*` qua đường fallback, kết quả hiển thị giống hệt.

### B2. SKU — **[ĐỀ XUẤT]**

Hiện **toàn bộ 18 sản phẩm sealed có `sku = null`**. Theme in SKU ở khối thông số
(`data-spec-sku`), nên để trống sẽ ra dấu `—`.

Quy ước đề xuất:

```
<GAME>-<SET>-<SỐ>-<HẠNG>-<ĐƠN VỊ>

PKM-SV8A-187-SAR-C      1 lá Special Art Rare
PKM-SV8A-187-SAR-P10    pack 10 lá cùng hạng
OPC-OP09-118-SEC-C      1 lá Secret Rare One Piece
PKM-BULK-R-100          bulk pack 100 lá Rare
PKM-SEALED-M6A-BOX      booster box 30th Celebration
```

- `C` = card, `P<n>` = pack n lá.
- Bulk pack không có số thứ tự nên bỏ phần đó.
- Sealed dùng mã set Nhật (`m6a`, `m6`, `m5`, `m2a`, `m2`, `m3`, `m4`) đã có trong mô tả sản phẩm.

SKU **phải khác nhau giữa các variant** của cùng một sản phẩm, nếu không báo cáo tồn kho không
truy được.

### B3. Metafield — điền dữ liệu

Khai báo định nghĩa ở [S00-B3](S00-thiet-lap-chung.md#b3-khai-báo-metafield--settings--custom-data--products).
Ở đây là điền giá trị. Theme in chúng trong `<dl class="product__specs">` theo đúng thứ tự:

| Thứ tự hiện | Nguồn | Hàng lẻ | Bulk pack | Sealed |
|---|---|---|---|---|
| 1. Unit | Option `Purchase type` hoặc tag `unit:*` | ✅ | ✅ | ✅ |
| 2. Rarity | `custom.rarity` → fallback tag `rarity:*` | ✅ bắt buộc | ✅ bắt buộc | ❌ không áp dụng |
| 3. Set | `custom.set_name` | ✅ bắt buộc | "Mixed sets" | ✅ bắt buộc |
| 4. Card number | `custom.card_number` | ✅ bắt buộc | ❌ | ❌ |
| 5. Condition | `custom.condition` | ✅ bắt buộc (NM/LP/MP/HP) | `NM–LP` | `Sealed` |
| 6. Language | `custom.language` | ✅ bắt buộc | ✅ | ✅ (18 SP hiện là **Japanese**) |
| 7. SKU | `variant.sku` | ✅ | ✅ | ✅ |

Ngoài ra `main-product.liquid` in riêng `custom.pack_contents` thành dòng chú thích ngay dưới
variant picker (`product__pack-note`) — dùng cho pack và sealed:

```
Bulk pack:  "100 cards, all Rare, mixed sets, NM–LP"
Sealed box: "30 booster packs × 5 cards"
```

Dữ liệu này **đã có sẵn trong phần description của 18 sản phẩm sealed** (ví dụ "This Booster Box
contains 30 Booster Packs. Each Booster Pack contains 5 cards.") — chỉ cần chuyển sang metafield.

### B4. Ảnh sản phẩm

Theme hiện ảnh chính + dải thumbnail, và **đổi ảnh khi đổi variant** nếu variant có
`featured_media`.

| Mục | Quy cách |
|---|---|
| Ảnh chính | 1:1, 1600 × 1600, nền trắng hoặc nền tối thuần, ≤ 300 KB |
| Số ảnh cho hàng lẻ giá cao | **[ĐỀ XUẤT]** 4 ảnh: mặt trước, mặt sau, góc & cạnh (để khách tự đánh giá tình trạng), ảnh trong sleeve |
| Số ảnh cho hàng lẻ giá thấp | 1 ảnh mặt trước là đủ |
| Ảnh riêng cho variant | Gán ảnh cho variant `pack` khác ảnh variant `card` (ví dụ ảnh xấp bài) để đổi variant thấy khác biệt |
| Sealed | Ảnh box thật, không dùng ảnh render của nhà phát hành nếu không có quyền |
| Alt text | Bắt buộc. Theme fallback về `product.title` nên bỏ trống vẫn chạy nhưng kém SEO |

Shopify tự sinh các bản `400, 600, 800, 1000, 1200` — chỉ upload 1 bản lớn nhất.

Sản phẩm không có ảnh sẽ hiện `placeholder_svg_tag` của Shopify (hình xám) — chấp nhận được khi
đang dựng, **không được còn khi go-live**.

### B5. Tồn kho

| Mục | Cấu hình |
|---|---|
| Track quantity | **Bật** cho mọi variant |
| Khi hết hàng | **"Stop selling"** (`inventory_policy = deny`) |
| Vì sao bắt buộc | Theme chỉ hiện cảnh báo "còn ít" và chỉ đặt `max` cho ô số lượng khi `inventory_management == 'shopify'` **và** `inventory_policy == 'deny'`. Nếu cho phép bán khi hết hàng, khách đặt được số lượng vô hạn |
| Ngưỡng cảnh báo | Theme settings `low_stock_threshold` = **5**. Còn ≤ 5 thì hiện "còn N". **[ĐỀ XUẤT]** giữ 5 cho hàng lẻ; nếu bán nhiều bulk pack, nâng lên 10 |
| Hiện tại | 18 SP sealed đều đang đúng 10 — **[CẦN CUNG CẤP]** số thật |

### B6. Hành vi khi đổi variant — **[ĐÃ XÁC ĐỊNH, không cần làm gì]**

Theme in sẵn một khối JSON (`<script data-product-json>`) chứa mọi variant kèm: `id`, `options`,
`available`, `price` (đã format theo market), `compareAtPrice`, `sku`, `tracked`, `inventory`,
`mediaId`. JS của theme đọc khối này để cập nhật tức thì:

| Đổi variant → cập nhật | Cơ chế |
|---|---|
| Giá | `price` trong JSON, đã chạy qua `money_with_currency` vì `show_currency_code: true` |
| Giá gạch ngang | `compareAtPrice`, chỉ có khi `compare_at_price > price` |
| SKU | `sku` → `data-spec-sku` |
| Đơn vị tính | `options` → `data-spec-unit` và `data-price-unit` |
| Tồn kho / cảnh báo | `tracked` + `inventory` so với `lowStock` |
| Ảnh | `mediaId` → đổi ảnh chính |
| Nút Add to cart | `available` → bật/tắt `disabled` |
| URL | Theme cập nhật `?variant=` để chia sẻ link được |

**Điều kiện để chạy đúng:** giá trong JSON đã được format bằng market hiện tại, nên **đổi tiền tệ
phải tải lại trang** (và `localization-form` đúng là submit + reload). Không có lỗi ở đây.

### B7. Quy cách file dữ liệu để khách tự nhập

Dùng Shopify CSV import (Products → Import). **[ĐỀ XUẤT]** cột bắt buộc:

| Cột CSV | Bắt buộc | Giá trị ví dụ | Ghi chú |
|---|---|---|---|
| `Handle` | ✅ | `pkm-sv8a-187-special-art-rare` | Các dòng variant của cùng SP dùng chung handle |
| `Title` | ✅ (dòng đầu) | `Special Art Rare — <tên lá bài>` | Chỉ điền ở dòng variant đầu tiên |
| `Body (HTML)` | ✅ (dòng đầu) | mô tả | |
| `Vendor` | ✅ | `ADAMANTILE` | |
| `Type` | ✅ | `Single card` / `Bulk pack` / `Sealed product` | Dùng cho filter Product type |
| `Tags` | ✅ | `pokemon, unit:card, unit:pack, rarity:special-art-rare` | Phẩy phân cách |
| `Published` | ✅ | `TRUE` | |
| `Option1 Name` | ✅ cho hàng lẻ | `Purchase type` | Để trống với bulk pack và sealed |
| `Option1 Value` | ✅ cho hàng lẻ | `card` / `pack` | Mỗi variant 1 dòng |
| `Variant SKU` | ✅ | `PKM-SV8A-187-SAR-C` | Theo B2 |
| `Variant Grams` | ✅ | `2` cho 1 lá, `25` cho pack 10 | Cần cho ship theo trọng lượng |
| `Variant Inventory Tracker` | ✅ | `shopify` | |
| `Variant Inventory Qty` | ✅ | `3` | |
| `Variant Inventory Policy` | ✅ | `deny` | **Bắt buộc `deny`**, xem B5 |
| `Variant Price` | ✅ | `48.00` | Giá USD, Shopify tự quy đổi sang market khác |
| `Variant Compare At Price` | ❌ | `60.00` | Chỉ khi thật sự giảm giá |
| `Variant Requires Shipping` | ✅ | `TRUE` | |
| `Variant Taxable` | ✅ | `TRUE` | |
| `Image Src` | ✅ | URL ảnh | |
| `Image Alt Text` | ✅ | | |
| `Variant Image` | ❌ | URL | Ảnh riêng cho variant |
| `Status` | ✅ | `active` | |
| `rarity (product.metafields.custom.rarity)` | ✅ | `Special Art Rare` | Tên cột metafield theo đúng định dạng Shopify sinh ra khi export |
| `set_name (product.metafields.custom.set_name)` | ✅ | `SV8a` | |
| `card_number (product.metafields.custom.card_number)` | lá lẻ | `187/187` | |
| `condition (product.metafields.custom.condition)` | ✅ | `NM` | |
| `language (product.metafields.custom.language)` | ✅ | `Japanese` | |
| `pack_contents (product.metafields.custom.pack_contents)` | pack/sealed | `10 cards, all SAR` | |

**Cách lấy header chính xác:** khai báo 6 metafield trước (S00-B3), tạo **1 sản phẩm mẫu** đầy đủ
bằng tay, rồi **Export** sản phẩm đó ra CSV. File export chính là template đúng chuẩn — đưa file
đó cho khách điền, đừng tự gõ tên cột.

### B8. Section settings — Customize → Products → Product information

| Setting | Giá trị **[ĐỀ XUẤT]** | Lý do |
|---|---|---|
| `show_vendor` | Tắt | Vendor của cả 34 SP đều là `ADAMANTILE`, hiện ra không có thông tin gì |
| `show_dynamic_checkout` | Bật | Shop Pay / Apple Pay giảm bỏ giỏ; chỉ hiện khi Shopify Payments active |

---

## c. Dữ liệu đầu vào cần có

| # | Mục | Trạng thái |
|---|---|---|
| 1 | Danh sách lá bài lẻ: tên, set, số thứ tự, hạng hiếm, tình trạng, ngôn ngữ in, giá card, giá pack, số lá mỗi pack, tồn kho từng variant, ảnh | **[CẦN CUNG CẤP]** — hiện có **0 lá bài lẻ thật** trong store |
| 2 | Tồn kho thật của 18 SP sealed | **[CẦN CUNG CẤP]** |
| 3 | Ảnh thật cho 18 SP sealed (đang dùng ảnh lấy từ web) | **[CẦN QUYẾT]** có quyền dùng không |
| 4 | Trọng lượng (gram) của 1 lá, pack 10/25/100/500, và 1 booster box | **[CẦN CUNG CẤP]** — thiếu cái này không tính được phí ship theo trọng lượng |
| 5 | Pack gồm bao nhiêu lá, cùng hạng hay trộn hạng | **[CẦN CUNG CẤP]** |
| 6 | Quy ước SKU: duyệt theo B2 hay dùng mã nội bộ sẵn có | **[CẦN QUYẾT]** |
| 7 | Chính sách đổi trả cho hàng lẻ và hàng pack | **[CẦN CUNG CẤP]** |
| 8 | Thang đánh giá tình trạng: dùng NM/LP/MP/HP hay thang riêng | **[CẦN QUYẾT]** |

---

## d. Ca kiểm thử

| Mã | Ca kiểm thử | Kết quả mong đợi |
|---|---|---|
| S06-01 | Mở 1 lá bài lẻ có 2 variant | Hiện picker `Purchase type` với 2 lựa chọn `card` và `pack` |
| S06-02 | Đổi từ `card` sang `pack` | Giá, SKU, dòng đơn vị, số tồn và ảnh đều đổi; **không** tải lại trang |
| S06-03 | Đổi variant rồi copy URL, mở ở tab mới | Mở đúng variant đó (`?variant=`) |
| S06-04 | Mở SP có variant hết hàng | Variant đó vẫn hiện nhưng không chọn được / nút báo Sold out |
| S06-05 | Mở SP hết hàng toàn bộ | Nút Add to cart `disabled`, chữ "Sold out" |
| S06-06 | SP còn 3, `low_stock_threshold = 5` | Hiện cảnh báo "còn 3" |
| S06-07 | SP còn 40 | Hiện "In stock", không hiện số |
| S06-08 | Gõ số lượng lớn hơn tồn kho vào ô quantity | Ô có `max` = tồn kho, không nhập vượt được |
| S06-09 | Bấm + / − | Số lượng tăng giảm, không xuống dưới 1 |
| S06-10 | Thêm vào giỏ | Số trên icon giỏ ở header tăng đúng số lượng |
| S06-11 | Đổi market sang EU rồi mở lại SP | Giá EUR, kết thúc `.99`; đổi variant vẫn ra giá EUR |
| S06-12 | Đổi market sang SG | Giá hiện kèm mã `SGD`, không nhầm với USD |
| S06-13 | Kiểm tra khối thông số của 1 lá lẻ đã điền đủ metafield | Hiện 7 dòng: Unit, Rarity, Set, Card number, Condition, Language, SKU |
| S06-14 | Mở 1 bulk pack | Không có variant picker; hiện dòng `pack_contents` dưới picker; đơn vị là `pack` |
| S06-15 | Mở 1 booster box sealed | Đơn vị hiện `sealed`; không hiện dòng Rarity |
| S06-16 | SP chưa điền `custom.rarity` nhưng có tag `rarity:holo-rare` | Vẫn hiện `Holo rare` (fallback tag) |
| S06-17 | SP không có ảnh | Hiện placeholder xám của Shopify, không lỗi layout |
| S06-18 | Xem mã nguồn, kiểm tra JSON-LD | `offers` có đủ variant, `priceCurrency` khớp market đang chọn |
| S06-19 | Mở SP ở 390 px | Ảnh trên, thông tin dưới; thumbnail cuộn ngang trong khung riêng; không cuộn ngang toàn trang |
| S06-20 | Tắt JavaScript | Vẫn thêm được vào giỏ bằng form submit; chỉ mất phần cập nhật tức thì |

---

## e. Tiêu chí nghiệm thu

- [ ] Mọi lá bài lẻ có option tên đúng `Purchase type` với value `card` và `pack`
- [ ] Mỗi variant có SKU riêng, giá riêng, tồn kho riêng
- [ ] Mọi variant đều `Track quantity` bật và `Stop selling when out of stock`
- [ ] Đổi variant cập nhật giá, SKU, đơn vị, tồn kho, ảnh trong cùng một lần không tải lại trang
- [ ] 6 metafield `custom.*` đã điền cho toàn bộ sản phẩm theo bảng ở B3
- [ ] Mọi sản phẩm có ít nhất 1 ảnh thật, có alt text; không còn placeholder xám
- [ ] Hàng lẻ giá cao có ảnh mặt sau và ảnh góc cạnh
- [ ] Trọng lượng (gram) đã điền cho mọi variant
- [ ] Sản phẩm hết hàng không thêm được vào giỏ
- [ ] Giá đúng và nhất quán ở USD, EUR, SGD
- [ ] Đã có 1 file CSV mẫu export từ sản phẩm thật, bàn giao cho khách làm template
- [ ] Không còn sản phẩm nào `sku = null`
