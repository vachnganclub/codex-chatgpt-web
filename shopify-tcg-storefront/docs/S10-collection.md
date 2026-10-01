# S10 — Collection Pokémon và One Piece

`/collections/pokemon` · `/collections/one-piece` (và `/collections/single-cards`,
`/collections/bulk-packs` mà header của theme đang trỏ tới).

Dùng trang collection mặc định của Shopify qua `sections/main-collection.liquid`. Không dựng trang
danh mục tuỳ biến.

---

## a. Mục tiêu

1. Mỗi sản phẩm vào đúng collection theo dòng game, bằng **điều kiện tự động theo tag**, không gán tay.
2. Thẻ sản phẩm ghi rõ đơn vị tính: `card` cho hàng lẻ, `pack` cho hàng số lượng lớn.
3. Bật filter và sort bằng tính năng có sẵn của Shopify, không dùng app trả phí.
4. Không có sản phẩm lọt chéo giữa 2 dòng game.

---

## b. Các bước thực hiện

### B1. Collection tự động

Đã mô tả ở [S00-B4](S00-thiet-lap-chung.md#b4-collection--products--collections). Nhắc lại điều
kiện, vì đây là gốc của toàn bộ S10:

| Handle | Điều kiện Automated | Sort |
|---|---|---|
| `pokemon` | Product tag is equal to `pokemon` | Newest |
| `one-piece` | Product tag is equal to `one-piece` | Newest |
| `single-cards` | Product tag is equal to `unit:card` | Newest |
| `bulk-packs` | Product tag is equal to `unit:pack` | Newest |

> Hai collection `pokemon` và `one-piece` hiện là **thủ công**. Phải gắn tag cho 18 sản phẩm sealed
> **trước**, rồi mới chuyển sang Automated, nếu không collection sẽ rỗng.

Mô tả collection (hiện trên đầu trang qua `collection.description`):
**[CẦN CUNG CẤP]** 1–2 câu cho mỗi collection. Viết rõ collection này gồm cả hàng lẻ và hàng pack,
vì khách vào từ menu "Pokémon" sẽ thấy lẫn 3 loại đơn vị.

### B2. Thẻ sản phẩm — đơn vị tính

`snippets/product-card.liquid` đã lo phần này, **không cần sửa code**. Cách nó làm việc
**[ĐÃ XÁC ĐỊNH]**:

1. Gọi `product-meta` với `output: 'units'`.
2. `product-meta` ưu tiên **variant option tên `Purchase type`** → lấy toàn bộ value, nối bằng ` · `.
3. Nếu sản phẩm không có option đó → fallback sang **tag `unit:*`**.
4. Thẻ sản phẩm in mỗi đơn vị thành một "unit pill": `<span class="unit-pill unit-pill--card">`.
5. Nếu sản phẩm chỉ có **một** đơn vị, đơn vị đó được truyền xuống snippet `price` và hiện thành
   `/ card` ngay cạnh giá. Nếu có **nhiều** đơn vị (chuỗi chứa ` · `), phần `/ đơn-vị` cạnh giá
   bị bỏ, và giá hiện dạng **"From $x.xx"** (vì `show_from: true` và `product.price_varies`).

Hệ quả thực tế cần nắm:

| Loại sản phẩm | Cấu hình | Thẻ sản phẩm hiện |
|---|---|---|
| Lá lẻ chỉ bán card | Tag `unit:card`, 1 variant | pill `card`, giá `$x.xx / card` |
| Lá lẻ bán cả card và pack | Option `Purchase type` = card, pack | 2 pill `card` `pack`, giá `From $x.xx` |
| Bulk pack | Tag `unit:pack` | pill `pack`, giá `$x.xx / pack` |
| Booster box sealed | Tag `unit:sealed` (nếu chọn phương án A ở S00) | pill `sealed`, giá `$x.xx / sealed` |

Badge hạng hiếm trên thẻ: lấy từ `custom.rarity`, fallback tag `rarity:*`. Sản phẩm không có cả
hai thì không hiện badge — hiện tại **18 sản phẩm sealed sẽ không có badge** cho tới khi điền.

Badge "Sold out" và "Sale" theme tự xử lý từ `product.available` và `compare_at_price`.

### B3. Filter — Online Store → Navigation → **Collection and search filters**

`main-collection.liquid` render `collection.filters`, tức là filter **native của Shopify**, cấu
hình qua app miễn phí **Search & Discovery** của chính Shopify.

1. Apps → tìm **Search & Discovery** → Install (miễn phí, do Shopify phát hành).
2. Vào app → **Filters** → **Add filter**.
3. Thêm theo thứ tự này **[ĐỀ XUẤT]**:

| # | Filter | Nguồn | Nhãn hiển thị | Ghi chú |
|---|---|---|---|---|
| 1 | Availability | Có sẵn | `In stock` | Bắt buộc theo spec |
| 2 | Price | Có sẵn | `Price` | Theme render thành 2 ô min/max kèm ký hiệu tiền tệ **theo market đang chọn** |
| 3 | Product type | Có sẵn | `Product type` | Hiện đã có giá trị `Single card`, `Bulk pack`; 18 SP sealed có `productType` **rỗng** → xem cảnh báo dưới |
| 4 | Product tag | Có sẵn | `Rarity` hoặc `Options` | Cách rẻ nhất để lọc hạng hiếm; nhược điểm là list tag hiện cả `unit:*`, `demo`, `pokemon` |
| 5 | Metafield `custom.rarity` | Cần bật filterable | `Rarity` | **Khuyến nghị** — sạch hơn tag, chỉ hiện giá trị hạng hiếm |

**[ĐỀ XUẤT] về filter hạng hiếm.** Dùng metafield (`#5`) thay vì tag (`#4`):

- Vào Settings → Custom data → Products → `custom.rarity` → bật **"Use as filter"** (Storefronts →
  Filterable).
- Rồi trong Search & Discovery thêm filter từ metafield đó.
- Nếu dùng tag, danh sách filter sẽ lộ cả `unit:card`, `demo`, `pokemon` — khách thấy rối.

**⚠️ Cảnh báo về `productType`.** 18 sản phẩm sealed đang có `productType` rỗng. Nếu bật filter
Product type mà không điền, chúng **rơi vào nhóm không có giá trị** và biến mất khi khách lọc.
Phải điền `productType` cho cả 18 SP trước khi bật filter này. **[ĐỀ XUẤT]** giá trị:
`Sealed product` cho booster box và special box, `Deck` cho constructed deck.

**Chi phí:** Search & Discovery miễn phí. Không cần app filter trả phí. Nếu sau này cần lọc theo
set (`custom.set_name`) hoặc tình trạng (`custom.condition`), vẫn làm được bằng cách bật
filterable cho metafield đó — vẫn không phát sinh phí.

### B4. Sort

`main-collection.liquid` dùng `collection.sort_options` — danh sách sort mặc định của Shopify,
không cần cấu hình gì. Khách có sẵn: Featured, Best selling, Alphabetically, **Price low to high**,
**Price high to low**, **Date new to old**, Date old to new.

Chỉ cần đặt **default sort** của từng collection trong Admin (S00-B4 bước 4) thành **Newest**.

> Spec yêu cầu "theo giá và theo hàng mới nhất" — cả hai đã có sẵn, không phải làm gì thêm.
> Lưu ý sort theo giá dùng giá **của market đang chọn**, nên thứ tự có thể khác đôi chút giữa
> USD và EUR do price rounding `.99`.

### B5. Số sản phẩm mỗi trang — Customize → Collection → Product grid

`products_per_page`, mặc định 24, dải 8–48. **[ĐỀ XUẤT]** giữ 24. Pagination đã có sẵn
(`snippets/pagination`).

### B6. Mở collection từ menu

Đã làm ở [S09-B1](S09-header-footer-tien-te.md#b1-menu-chính--online-store--navigation--menu-chính-main-menu).
Trang chủ cũng có 2 đường vào qua section `link-cards` (S01).

---

## c. Dữ liệu đầu vào cần có

| # | Mục | Trạng thái |
|---|---|---|
| 1 | Tag `pokemon` / `one-piece` + `unit:*` cho 18 SP sealed | Phụ thuộc S00-B2 |
| 2 | `productType` cho 18 SP sealed | **[CẦN CUNG CẤP]** nếu muốn bật filter Product type |
| 3 | `custom.rarity` cho hàng lẻ và bulk pack | **[CẦN CUNG CẤP]** |
| 4 | Mô tả 1–2 câu cho mỗi collection | **[CẦN CUNG CẤP]** |
| 5 | Ảnh collection 1600 × 1000, ≤ 300 KB | **[CẦN CUNG CẤP]** |
| 6 | Quyết định dùng filter theo tag hay theo metafield | **[CẦN QUYẾT]** |

---

## d. Ca kiểm thử

| Mã | Ca kiểm thử | Kết quả mong đợi |
|---|---|---|
| S10-01 | Mở `/collections/pokemon` | Chỉ có sản phẩm Pokémon; không có sản phẩm One Piece nào |
| S10-02 | Mở `/collections/one-piece` | Ngược lại — không có sản phẩm Pokémon nào |
| S10-03 | Đếm số sản phẩm hiện với số ở Admin | Khớp; dòng `collections.product_count` đúng |
| S10-04 | Mở `/collections/single-cards` | Chỉ hàng lẻ, mọi thẻ đều có pill `card` |
| S10-05 | Mở `/collections/bulk-packs` | Chỉ hàng pack, mọi thẻ đều có pill `pack` |
| S10-06 | Xem thẻ của 1 lá bài có cả card và pack | Hiện 2 pill, giá hiện dạng `From $x.xx`, không hiện `/ card` |
| S10-07 | Xem thẻ của 1 bulk pack | Hiện 1 pill `pack`, giá hiện `$x.xx / pack` |
| S10-08 | Tick filter **In stock** | Sản phẩm hết hàng biến mất; số đếm giảm đúng |
| S10-09 | Tick 1 giá trị hạng hiếm | Chỉ còn sản phẩm hạng đó; số trong ngoặc cạnh mỗi giá trị khớp số kết quả |
| S10-10 | Tick 2 hạng hiếm cùng lúc | Kết quả là hợp của 2 nhóm (OR trong cùng filter) |
| S10-11 | Tick hạng hiếm + In stock | Kết quả là giao của 2 điều kiện (AND giữa 2 filter khác nhau) |
| S10-12 | Tick 1 filter rồi xem nút Filter | Hiện số lượng điều kiện đang bật, ví dụ `Filter (2)`, và drawer tự mở |
| S10-13 | Bấm **Clear all** | Về danh sách đầy đủ, giữ nguyên sort đang chọn |
| S10-14 | Lọc tới khi không còn kết quả | Hiện khối empty state kèm nút Clear all, không phải trang trắng |
| S10-15 | Sort **Price low to high** | Thứ tự tăng dần theo giá của market đang chọn |
| S10-16 | Đổi sang market EU rồi sort theo giá | Thứ tự vẫn đúng theo giá EUR; ô filter Price hiện ký hiệu `€` |
| S10-17 | Nhập min/max vào filter Price rồi Apply | Chỉ còn sản phẩm trong khoảng; giá trị vừa nhập vẫn còn trong ô |
| S10-18 | Giá trị filter có `(0)` | Ô tick bị disable, không bấm được |
| S10-19 | Click 1 sản phẩm | Mở đúng `/products/<handle>` của sản phẩm đó |
| S10-20 | Mở collection ở 390 px | Lưới sản phẩm xuống 2 cột, drawer filter đóng mở được, không cuộn ngang |
| S10-21 | Collection có hơn 24 sản phẩm | Hiện pagination; trang 2 giữ nguyên filter và sort trên URL |
| S10-22 | Thêm tag `pokemon` cho 1 sản phẩm mới | Tự xuất hiện trong collection, không cần thao tác thêm |

---

## e. Tiêu chí nghiệm thu

- [ ] 4 collection đều là Automated, điều kiện đúng bảng B1
- [ ] Không có sản phẩm lọt chéo giữa Pokémon và One Piece
- [ ] Mọi thẻ sản phẩm đều hiện ít nhất 1 pill đơn vị tính
- [ ] Hàng lẻ hiện `card`, hàng pack hiện `pack` — không có thẻ nào thiếu đơn vị
- [ ] Đã cài Search & Discovery và bật tối thiểu 3 filter: Availability, Price, hạng hiếm
- [ ] Filter hạng hiếm **không** lộ các tag nội bộ (`unit:*`, `demo`)
- [ ] Số đếm cạnh mỗi giá trị filter khớp số kết quả thật
- [ ] Sort theo giá đúng ở cả USD, EUR và SGD
- [ ] Empty state hiện đúng khi lọc không ra kết quả
- [ ] Mỗi collection có mô tả và ảnh
- [ ] Ở 390 px: lưới không vỡ, filter dùng được, không cuộn ngang
- [ ] Không phát sinh chi phí app
