# S01 — Trang chủ (`/`)

Ràng buộc: dùng đúng bố cục section có sẵn của theme, chỉ thay banner và nội dung. Không tạo
section tuỳ biến.

Tin tốt: `templates/index.json` **đã được cấu hình sẵn 5 section**. Việc còn lại gần như chỉ là
thay ảnh demo và chữ demo bằng nội dung thật.

---

## a. Mục tiêu

1. Giữ nguyên thứ tự 5 section đã dựng, thay toàn bộ nội dung demo bằng nội dung thật.
2. Có đường vào rõ ràng cho cả 4 đích: Pokémon, One Piece, Wholesale Inquiry, Feedback.
3. Banner đúng quy cách ảnh, không nặng, không vỡ trên điện thoại.
4. Không còn chữ "demo" nào trên trang public.

---

## b. Các bước thực hiện

### B1. Thứ tự section hiện tại — **[ĐÃ XÁC ĐỊNH, không đổi]**

Mở Online Store → Themes → `tcg-vault-theme-3` → **Customize** → trang **Home page**:

| # | ID section | Type | Mục đích | Trạng thái nội dung |
|---|---|---|---|---|
| 1 | `hero` | `image-banner` | Tuyên bố chính + 2 CTA vào 2 dòng game | Chữ đã viết sẵn (tiếng Anh), **ảnh là ảnh demo** |
| 2 | `shop-by` | `link-cards` | 4 thẻ dẫn: Pokémon, One Piece, Wholesale, Feedback | **4 ảnh đều là demo** |
| 3 | `featured-pokemon` | `featured-collection` | 8 sản phẩm từ collection `pokemon` | OK, tự lấy dữ liệu |
| 4 | `featured-onepiece` | `featured-collection` | 8 sản phẩm từ collection `one-piece` | OK, tự lấy dữ liệu |
| 5 | `about` | `rich-text` | Giới thiệu cửa hàng | **Chữ là chữ demo**, phải thay |

**[ĐỀ XUẤT]** giữ đúng 5 section này. Lý do: section 2 đã phủ hết 4 CTA mà spec yêu cầu, nên
không cần thêm dải CTA riêng cho Wholesale.

Nếu muốn thêm, theme còn `announcement-bar` (dải thông báo mảnh trên header) — dùng cho thông báo
kiểu "Free shipping over $x" khi khách đã chốt chính sách ship.

### B2. Section 1 — Hero (`image-banner`)

Nội dung chữ đã có trong `index.json`:

| Block | Giá trị hiện tại | Cần làm |
|---|---|---|
| `hero-heading` | "Pokémon & One Piece cards, single or by the pack" | **[ĐỀ XUẤT]** giữ — câu này đúng và gọn. Chỉ sửa nếu khách có headline riêng |
| `hero-text` | "Pick the exact card you need, or stock up with bulk packs sorted by rarity. Prices shown in your local currency." | **[ĐỀ XUẤT]** giữ. Câu "Prices shown in your local currency" chỉ đúng **sau khi** xong Markets ở S00 — nếu chưa xong thì tạm bỏ câu đó |
| `hero-button-pokemon` | "Shop Pokémon" → `/collections/pokemon`, style `primary` | Giữ |
| `hero-button-onepiece` | "Shop One Piece" → `/collections/one-piece`, style `accent` | Giữ |

Settings của section: `height: medium`, `text_alignment: left`, `overlay_opacity: 60`.

**Ảnh:** setting `image` đang là `AdobeStock_1772944328_Preview_Editorial_Use_Only.jpg`, và section
có cờ `demo_image: true`.

> ⚠️ Tên file có chữ **"Preview_Editorial_Use_Only"**. Đây là ảnh preview có watermark, chỉ được
> dùng cho mục đích biên tập. **Không được để trên store thương mại.** Phải thay bằng ảnh đã mua
> license hoặc ảnh tự chụp, và bỏ cờ `demo_image`.

Các bước thay: Customize → Home page → Image banner → Image → **Change** → Upload ảnh thật → Save.

### B3. Section 2 — Shop by game (`link-cards`)

4 block đã cấu hình xong về chữ và link:

| Block | Title | Text | CTA | Link | Theme màu |
|---|---|---|---|---|---|
| `card-pokemon` | Pokémon | Single cards & bulk packs | Shop Pokémon | `/collections/pokemon` | `pokemon` (#e3350d) |
| `card-onepiece` | One Piece | Single cards & bulk packs | Shop One Piece | `/collections/one-piece` | `one-piece` (#0b4f8a) |
| `card-wholesale` | Wholesale | Buying in bulk? Send us an inquiry. | Wholesale inquiry | `/pages/wholesale-inquiry` | `accent` (#ffcb05) |
| `card-feedback` | Customer feedback | What our buyers say. | Read feedback | `/pages/feedback` | `default` |

Mỗi block đang dùng `demo_image` (`pokemon`, `onepiece`, `wholesale`, `feedback`) — ảnh dựng sẵn
của theme. Cần thay bằng 4 ảnh thật.

> ⚠️ 2 link `/pages/wholesale-inquiry` và `/pages/feedback` **hiện đang 404** vì page chưa được
> tạo. Phải làm S04 và S11 trước khi đưa trang chủ lên, nếu không khách bấm vào là lỗi.

### B4. Section 3 & 4 — Featured collection

| Setting | `featured-pokemon` | `featured-onepiece` |
|---|---|---|
| `heading` | Pokémon | One Piece |
| `collection_handle` | `pokemon` | `one-piece` |
| `products_to_show` | 8 | 8 |

Không cần sửa. Nhưng lưu ý: 2 section này lấy sản phẩm theo **default sort của collection**. Sau
khi đổi sort sang Newest ở S00-B4, trang chủ sẽ tự hiện hàng mới nhất — đúng ý "Hàng mới về".

Thẻ sản phẩm ở đây dùng chung `snippets/product-card.liquid` với collection, nên **đơn vị tính và
badge hạng hiếm hiện giống hệt** — không cần cấu hình riêng.

### B5. Section 5 — About (`rich-text`)

Chữ hiện tại:

> "This is demo text. Tell buyers who you are, where your cards come from, how you check their
> condition, how you pack them and which countries you ship to."

Đây là **chữ hướng dẫn, không phải nội dung**. Phải thay. Khung nội dung cần khách điền:

```
[Đoạn 1 — Chúng tôi là ai]
  Tên cửa hàng, hoạt động từ năm nào, ở đâu.

[Đoạn 2 — Nguồn hàng]
  Thẻ bài lấy từ đâu (mở trực tiếp từ box Nhật, thu mua lại, đấu giá…).

[Đoạn 3 — Cách kiểm tra tình trạng]
  Dùng thang nào (NM / LP / MP / HP), ai kiểm, có soi đèn không.

[Đoạn 4 — Cách đóng gói]
  Sleeve, toploader, bao chống ẩm, hộp cứng cho đơn pack.

[Đoạn 5 — Giao tới đâu]
  Danh sách khu vực và thời gian giao dự kiến.
```

**[CẦN CUNG CẤP]** toàn bộ 5 đoạn. Không được tự viết — đây là cam kết về quy trình.

### B6. Quy cách ảnh

| Vị trí | Tỉ lệ | Kích thước tối thiểu | Dung lượng | Bản mobile |
|---|---|---|---|---|
| Hero banner | 12:5 | 2400 × 1000 | ≤ 400 KB | Theme dùng `height: medium` và cùng một ảnh; **[ĐỀ XUẤT]** chọn ảnh có chủ thể ở giữa để crop ở mobile không mất chủ thể |
| 4 thẻ `link-cards` | 4:3 | 1200 × 900 | ≤ 250 KB mỗi ảnh | Tự co theo lưới |
| Ảnh collection (hiện ở featured section) | 16:10 | 1600 × 1000 | ≤ 300 KB | |

Định dạng **[ĐỀ XUẤT]**: WebP cho ảnh ảnh thật, PNG nếu có chữ. Shopify tự sinh các bản
`widths: '400, 600, 800, 1000, 1200'` nên chỉ cần upload 1 bản lớn nhất.

Mọi ảnh **phải có alt text** — theme dùng `image.alt` và fallback về `shop.name`, nên bỏ trống sẽ
ra alt vô nghĩa.

---

## c. Dữ liệu đầu vào cần có

| # | Mục | Trạng thái |
|---|---|---|
| 1 | Ảnh hero thật, có license, 2400 × 1000 | **[CẦN CUNG CẤP]** — ảnh hiện tại là bản preview "Editorial Use Only", không dùng được |
| 2 | 4 ảnh cho `link-cards`, 1200 × 900 | **[CẦN CUNG CẤP]** |
| 3 | 5 đoạn nội dung cho section About | **[CẦN CUNG CẤP]** |
| 4 | Xác nhận giữ hay sửa headline và đoạn mô tả hero | **[CẦN QUYẾT]** |
| 5 | Alt text cho từng ảnh | **[CẦN CUNG CẤP]** |
| 6 | Có dùng `announcement-bar` không, và nội dung gì | **[CẦN QUYẾT]** |
| 7 | 3 page `wholesale-inquiry`, `feedback`, `privacy-policy` phải tồn tại | Phụ thuộc S04, S11, S05 |

---

## d. Ca kiểm thử

| Mã | Ca kiểm thử | Kết quả mong đợi |
|---|---|---|
| S01-01 | Mở `/` | Thấy đủ 5 section theo đúng thứ tự hero → shop-by → Pokémon → One Piece → About |
| S01-02 | Tìm chữ "demo" trên trang | Không còn kết quả nào |
| S01-03 | Kiểm tra tên file ảnh hero | Không còn chứa "Editorial_Use_Only" |
| S01-04 | Bấm "Shop Pokémon" ở hero | Mở `/collections/pokemon` |
| S01-05 | Bấm "Shop One Piece" ở hero | Mở `/collections/one-piece` |
| S01-06 | Bấm thẻ Wholesale | Mở `/pages/wholesale-inquiry`, **không 404** |
| S01-07 | Bấm thẻ Customer feedback | Mở `/pages/feedback`, **không 404** |
| S01-08 | Xem 2 section Featured | Mỗi section hiện 8 sản phẩm đúng dòng game |
| S01-09 | Xem thẻ sản phẩm trên trang chủ | Có pill đơn vị tính giống hệt ở trang collection |
| S01-10 | Đổi market sang EU | Toàn bộ giá trên trang chủ hiện EUR |
| S01-11 | Mở `/` ở 390 px | Hero không bị cắt mất chủ thể; 4 thẻ xếp 1–2 cột; không cuộn ngang |
| S01-12 | Kiểm tra bằng Lighthouse / PageSpeed trên mobile | Ảnh hero không phải thủ phạm làm LCP chậm; nếu chậm, giảm dung lượng ảnh |
| S01-13 | Tắt ảnh (chặn tải ảnh) | Mỗi ảnh hiện alt text có nghĩa, không phải tên file |
| S01-14 | Mở `/` ở nền tối của hệ điều hành | Màu nền `#080b12` của theme giữ nguyên, chữ vẫn đọc được |
| S01-15 | Collection `pokemon` rỗng (giả lập) | Section Featured không để lại khoảng trắng vỡ bố cục |

---

## e. Tiêu chí nghiệm thu

- [ ] 5 section đúng thứ tự, không thêm section tuỳ biến
- [ ] Ảnh hero là ảnh có quyền sử dụng thương mại, đã bỏ cờ `demo_image`
- [ ] 4 ảnh `link-cards` là ảnh thật
- [ ] Section About là nội dung thật của cửa hàng, không còn chữ hướng dẫn
- [ ] Không còn chuỗi "demo" nào trên trang
- [ ] 4 CTA đều dẫn tới trang tồn tại: 2 collection + wholesale + feedback
- [ ] Mọi ảnh có alt text có nghĩa
- [ ] Giá trên trang chủ đổi theo market
- [ ] Ở 390 px: không cuộn ngang, hero giữ được chủ thể
- [ ] Mọi ảnh ≤ dung lượng quy định ở B6
