# S07 — Giỏ hàng (`/cart`)

Dùng `sections/main-cart.liquid`. Yêu cầu bắt buộc: **mua lẻ (card) và mua số lượng lớn (pack)
bỏ chung một giỏ**. Điều này đã đúng về bản chất vì cả hai đều là variant của sản phẩm thường —
Shopify không phân biệt.

---

## a. Mục tiêu

1. Giỏ chứa đồng thời card, pack và sealed, mỗi dòng ghi rõ đơn vị tính của nó.
2. Sửa số lượng thì thành tiền và tổng tính lại đúng.
3. Tổng tiền hiển thị theo tiền tệ đang chọn và **khớp từng đồng với Checkout**.
4. Có ghi chú đơn hàng cho yêu cầu riêng.
5. Giỏ rỗng có trạng thái riêng, không phải trang trắng.

---

## b. Các bước thực hiện

### B1. Thành phần đã có — **[ĐÃ XÁC ĐỊNH theo code]**

Theme dựng giỏ thành bảng 4 cột: Product · Price · Quantity · Total.

| Thành phần | Nguồn | Ghi chú |
|---|---|---|
| Ảnh sản phẩm | `item.image`, rộng 240 | Fallback placeholder nếu SP không có ảnh |
| Tên sản phẩm | `item.product.title`, link về trang SP | |
| Variant | `item.options_with_values` → in dạng `Purchase type: card` | Chỉ hiện khi SP không phải default variant |
| **Unit pill** | Lấy từ option `Purchase type`, fallback tag `unit:*` | Đây là phần thoả yêu cầu "ghi rõ đơn vị tính" |
| Line item properties | `item.properties` | Tự bỏ qua key bắt đầu bằng `_` |
| Đơn giá | `item.final_price \| money` + `/ <đơn vị>` | |
| Giá gạch ngang | Hiện khi `original_price != final_price` | Chỉ có khi áp discount |
| Số lượng | `input name="updates[]"`, `min=0` | `max` = tồn kho **chỉ khi** variant track + deny |
| Thành tiền | `item.final_line_price` | |
| Xoá | Link `item.url_to_remove` | |
| Discount theo dòng | `item.line_level_discount_allocations` | |
| Ghi chú đơn | `textarea name="note"` | Chỉ hiện khi theme setting `show_cart_note` bật — **hiện đang bật** |
| Tổng tạm tính | `cart.total_price \| money_with_currency` | **Luôn có mã tiền tệ** |
| Nút Checkout | `button name="checkout"` | Form POST về `/cart` |
| Express checkout | `content_for_additional_checkout_buttons` | Theo section setting `show_additional_checkout` |

**Không cần sửa code.** Việc của S07 chủ yếu là kiểm thử và 2 chỉnh nhỏ dưới đây.

### B2. Sửa link "Continue shopping" — **[ĐỀ XUẤT]**

Theme trỏ "Continue shopping" và nút ở giỏ rỗng về `routes.all_products_collection_url`, tức
`/collections/all`. Collection đó hiện **gộp tất cả 34 sản phẩm, gồm cả 16 sản phẩm demo**.

Hai cách xử lý:

| Phương án | Cách làm | Đánh giá |
|---|---|---|
| **A (khuyến nghị)** | Xử lý 16 SP demo ở S00 (Draft hoặc xoá) | Sửa gốc, `/collections/all` tự sạch, không cần sửa theme |
| B | Sửa `main-cart.liquid`, thay `routes.all_products_collection_url` bằng `/collections/single-cards` | Phải sửa code, trái nguyên tắc "hạn chế can thiệp mã nguồn" |

Chọn A.

### B3. Chú ý về định dạng tiền tệ trong giỏ — **[ĐÃ XÁC ĐỊNH]**

Có một điểm bất đối xứng trong theme, cần biết để không báo lỗi oan:

| Vị trí | Filter dùng | Kết quả |
|---|---|---|
| Đơn giá từng dòng | `money` | `$12.50` — **không** có mã tiền tệ |
| Thành tiền từng dòng | `money` | `$25.00` |
| **Tổng tạm tính** | `money_with_currency` | `$25.00 USD` — **có** mã tiền tệ |

Đây là thiết kế hợp lý: mã tiền tệ xuất hiện ở con số quan trọng nhất, không lặp lại ở mọi dòng.
**Không coi đây là lỗi.** Nhưng khi kiểm thử market SG, phải đối chiếu **tổng** (có `SGD`), vì đơn
giá từng dòng chỉ hiện `$` và trông giống USD.

### B4. Số lượng = 0

`min="0"` là cố ý: Shopify hiểu `updates[] = 0` là xoá dòng. Nên khách có 2 cách xoá: bấm link
Remove, hoặc giảm số lượng xuống 0. Cả hai phải cho cùng kết quả.

### B5. Ghi chú đơn hàng

Setting `show_cart_note` đang bật. Nội dung ghi chú sẽ xuất hiện trong Admin → Orders → chi tiết
đơn, mục **Additional details**.

**[ĐỀ XUẤT]** placeholder gợi ý khách điền thông tin có ích cho hàng thẻ bài, ví dụ: ghép pack cùng
hạng vào một hộp, ưu tiên bản in tiếng Nhật, hoặc yêu cầu chụp ảnh trước khi gửi. Nội dung
placeholder nằm trong file ngôn ngữ (`templates.cart.note_placeholder`), sửa ở Online Store →
Themes → Edit default theme content → tìm `note_placeholder`.

### B6. Section settings — Customize → Cart

| Setting | Giá trị **[ĐỀ XUẤT]** |
|---|---|
| `show_additional_checkout` | Bật — Shop Pay / Apple Pay ở giỏ hàng |

---

## c. Dữ liệu đầu vào cần có

| # | Mục | Trạng thái |
|---|---|---|
| 1 | Quyết định xử lý 16 SP demo (ảnh hưởng `/collections/all`) | **[CẦN QUYẾT]** — xem S00 |
| 2 | Nội dung placeholder cho ô ghi chú đơn hàng | **[CẦN CUNG CẤP]** |
| 3 | Có dùng mã giảm giá không (ảnh hưởng dòng discount) | **[CẦN QUYẾT]** |
| 4 | Markets đã cấu hình | Phụ thuộc S00 |
| 5 | Tồn kho thật và `inventory_policy = deny` | Phụ thuộc S06 |

---

## d. Ca kiểm thử

| Mã | Ca kiểm thử | Kết quả mong đợi |
|---|---|---|
| S07-01 | Mở `/cart` khi chưa thêm gì | Hiện khối empty state kèm nút Continue shopping, không phải trang trắng |
| S07-02 | Thêm 1 lá lẻ (`card`) rồi mở giỏ | 1 dòng, unit pill `card`, dòng `Purchase type: card`, đơn giá kèm `/ card` |
| S07-03 | **Thêm tiếp 1 bulk pack vào cùng giỏ** | **2 dòng trong cùng một giỏ**, dòng 2 có pill `pack` — đây là yêu cầu bắt buộc của spec |
| S07-04 | Thêm tiếp 1 booster box sealed | 3 dòng, pill lần lượt `card`, `pack`, `sealed` |
| S07-05 | Thêm cả variant `card` và `pack` **của cùng một lá bài** | 2 dòng riêng biệt, không gộp, mỗi dòng đúng giá của nó |
| S07-06 | Bấm + ở 1 dòng | Số lượng tăng, thành tiền dòng đó và tổng tính lại đúng |
| S07-07 | Gõ trực tiếp số lượng vào ô | Cập nhật đúng sau khi rời ô |
| S07-08 | Giảm số lượng xuống 0 | Dòng bị xoá, tổng cập nhật |
| S07-09 | Bấm link Remove | Cùng kết quả như S07-08 |
| S07-10 | Xoá dòng cuối cùng | Giỏ về trạng thái rỗng |
| S07-11 | Thử tăng số lượng vượt tồn kho (variant track + deny) | Ô có `max`, không nhập vượt được |
| S07-12 | Variant **không** bật track quantity | Ô không có `max` — đây là lý do S06-B5 bắt buộc bật track |
| S07-13 | Kiểm tra tổng = cộng tay các dòng | Khớp tuyệt đối |
| S07-14 | Đổi market sang EU rồi mở lại giỏ | Mọi đơn giá, thành tiền và tổng hiện EUR; **số lượng giữ nguyên** |
| S07-15 | Đổi sang SG | Tổng hiện kèm `SGD` |
| S07-16 | Nhập ghi chú rồi bấm Checkout rồi quay lại | Ghi chú còn nguyên trong ô |
| S07-17 | Đặt đơn có ghi chú, mở đơn trong Admin | Ghi chú hiện ở mục Additional details |
| S07-18 | Tắt JavaScript, sửa số lượng | Nút "Update" trong `<noscript>` hiện ra và cập nhật được |
| S07-19 | Mở giỏ ở 390 px | Bảng không cuộn ngang; đơn giá hiện ở dòng mobile (`cart-item__unit-price-mobile`) |
| S07-20 | Bấm tên sản phẩm trong giỏ | Về đúng trang sản phẩm, đúng variant |
| S07-21 | Bấm Continue shopping | Về collection không chứa sản phẩm demo |
| S07-22 | Áp 1 mã giảm giá (nếu dùng) | Dòng discount hiện ở mục tổng; giá gốc gạch ngang ở dòng liên quan |
| S07-23 | Ghi lại tổng ở giỏ rồi vào Checkout | Hai số **khớp từng đồng** |

---

## e. Tiêu chí nghiệm thu

- [ ] Giỏ chứa đồng thời card, pack và sealed trong cùng một lần đặt
- [ ] Mỗi dòng hiện unit pill đúng đơn vị tính của variant đó
- [ ] Hai variant của cùng một sản phẩm nằm thành 2 dòng riêng, không gộp
- [ ] Sửa số lượng tính lại thành tiền và tổng ngay, không cần tải lại trang
- [ ] Số lượng 0 và nút Remove cho cùng kết quả
- [ ] Không nhập được số lượng vượt tồn kho
- [ ] Tổng tạm tính hiện kèm mã tiền tệ
- [ ] Tổng ở giỏ khớp tuyệt đối với tổng ở Checkout, ở cả 3 tiền tệ
- [ ] Đổi tiền tệ không làm mất sản phẩm hay sai số lượng
- [ ] Ghi chú đơn hàng lưu được và hiện trong Admin
- [ ] Giỏ rỗng có trạng thái riêng kèm đường dẫn mua tiếp
- [ ] "Continue shopping" không dẫn tới danh sách còn sản phẩm demo
- [ ] Ở 390 px: không cuộn ngang
