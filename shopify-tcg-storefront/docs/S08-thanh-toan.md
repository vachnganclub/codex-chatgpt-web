# S08 — Thanh toán (Checkout)

Trang của Shopify. **Không dựng lại.** Chỉ chỉnh logo và màu trong giới hạn Shopify cho phép.

Lưu ý mở đầu: store hiện có **0 đơn hàng**, nghĩa là luồng thanh toán **chưa từng được chạy thử
lần nào**. Đây là hạng mục rủi ro nhất vì lỗi chỉ lộ ra khi chạy thật.

---

## a. Mục tiêu

1. Checkout đồng bộ hình ảnh với storefront: logo, màu, bo góc.
2. Đi hết luồng đặt hàng tới trang xác nhận và nhận được email xác nhận.
3. Giá và tiền tệ ở Checkout **khớp tuyệt đối** với giỏ hàng, ở cả 3 thị trường.
4. Mỗi khu vực có Shipping zone hợp lệ, không có nước nào bị chặn giữa luồng.

---

## b. Các bước thực hiện

### B1. Branding — Settings → Checkout → Customize

Mở Settings → Checkout → nút **Customize** (mở Checkout editor).

| Mục | Giá trị **[ĐỀ XUẤT]** lấy từ theme | Nguồn |
|---|---|---|
| Logo | Bản ngang của logo hiện tại | Theme đang dùng `cthmppe.png` |
| Kích thước logo | Medium | |
| Màu nhấn / nút chính | `#1d3fbb` | Theme setting `color_primary` |
| Chữ trên nút | `#ffffff` | `color_primary_contrast` |
| Màu nền | `#ffffff` **hoặc** `#080b12` | **[CẦN QUYẾT]** — theme storefront đang dùng nền tối `#080b12`. Checkout nền tối ít gặp và có thể làm khách ngần ngại. Khuyến nghị nền sáng cho Checkout, chấp nhận khác storefront |
| Bo góc | 10 px | `corner_radius` |
| Font | Assistant | `assistant_n7` / `assistant_n4` |
| Ảnh nền | Không dùng | Ảnh nền ở Checkout làm giảm tỉ lệ hoàn tất |

> ⚠️ **Giới hạn [ĐÃ XÁC ĐỊNH].** Store ở plan **Basic**. Checkout chỉ cho đổi logo, màu, font, bo
> góc và ảnh nền. **Không** thêm được trường tuỳ ý, **không** đổi được thứ tự bước, **không** chèn
> được nội dung tuỳ biến. Những việc đó cần **Shopify Plus** (Checkout Extensibility / checkout UI
> extensions). Nếu khách muốn thêm trường kiểu "mã người giới thiệu", phương án thay thế trong giới
> hạn hiện tại là dùng **ô ghi chú đơn hàng ở giỏ** (S07) hoặc **cart attributes**.

### B2. Thiết lập phụ trợ — Settings → Checkout

| Mục | Giá trị **[ĐỀ XUẤT]** | Lý do |
|---|---|---|
| Customer accounts | Optional | Bắt tạo tài khoản làm giảm tỉ lệ hoàn tất; khách quốc tế mua 1 lần là chính |
| Email marketing consent | Hiện ô, **không** tick sẵn | Tick sẵn vi phạm GDPR với khách EU |
| Thu số điện thoại | Optional | Đơn quốc tế cần số cho chuyển phát nhanh, nhưng đừng bắt buộc |
| Tipping | Tắt | Không phù hợp |
| Abandoned checkout email | Bật, gửi sau 10 giờ | |
| Địa chỉ: yêu cầu họ + tên | Bật | Cần cho khai báo hải quan |

### B3. Shipping zone — Settings → Shipping and delivery

Hiện có **1 delivery profile** ("General profile", mặc định) phủ **29 quốc gia**, đã bao gồm US,
SG, GB và 14 nước EU. Nền tảng đã sẵn, nhưng:

1. Mở profile → kiểm tra **từng zone có ít nhất 1 rate**. Zone không có rate = khách nước đó
   **không checkout được**, dù sản phẩm vẫn hiện bình thường trên storefront. Đây là lỗi phổ biến
   nhất và khó phát hiện nhất.
2. **[CẦN CUNG CẤP]** bảng phí cho từng zone. Đề xuất cấu trúc:

   | Zone | Rate |
   |---|---|
   | United States | Theo trọng lượng, 3 bậc |
   | Europe | Theo trọng lượng, 3 bậc |
   | Singapore / Asia | Theo trọng lượng, 3 bậc |
   | United Kingdom | Chỉ thêm khi khách duyệt mở GBP |

3. Rate theo trọng lượng **yêu cầu mọi variant đã điền gram** (xem S06-B7). Thiếu gram thì Shopify
   coi là 0 g và luôn trả về bậc rẻ nhất.
4. **[ĐỀ XUẤT]** cân nhắc ngưỡng miễn phí ship. Nếu dùng, đặt riêng cho từng zone vì chi phí gửi
   đi Mỹ và đi EU khác nhau.

### B4. Thuế — Settings → Taxes and duties

Store đang `taxesIncluded = true` (giá đã gồm thuế) và `taxShipping = false`.

| Việc cần làm | Trạng thái |
|---|---|
| Xác nhận giá niêm yết gồm thuế là đúng ý khách | **[CẦN QUYẾT]** |
| Có đăng ký VAT ở EU (hoặc IOSS) → khai vào Settings → Taxes | **[CẦN CUNG CẤP]** |
| Có đăng ký VAT UK → khai vào | **[CẦN CUNG CẤP]** |
| Singapore GST với hàng nhập khẩu giá trị thấp | **[CẦN CUNG CẤP]** |
| Bật **Collect duties and import taxes at checkout** hay không | **[CẦN QUYẾT]** — bật thì khách thấy tổng cuối cùng, không bị thu thêm ở cửa khẩu; nhưng cần khai HS code cho sản phẩm |
| HS code cho thẻ bài | **[CẦN CUNG CẤP]** — thường là nhóm 9504 (trading cards), cần kế toán xác nhận |

### B5. Email xác nhận — Settings → Notifications

1. **Sender email**: đổi sang email theo domain (xem S09-B3) và bấm **Authenticate**.
2. Mở template **Order confirmation** → kiểm tra logo và màu đã theo branding.
3. **[ĐỀ XUẤT]** sửa phần mở đầu để nói rõ thời gian đóng gói hàng thẻ bài, vì khách quốc tế quan
   tâm hàng được bọc thế nào.

---

## c. Dữ liệu đầu vào cần có

| # | Mục | Trạng thái |
|---|---|---|
| 1 | Logo bản ngang cho Checkout, 560 × 140, PNG nền trong | **[CẦN CUNG CẤP]** |
| 2 | Quyết định Checkout nền sáng hay nền tối | **[CẦN QUYẾT]** |
| 3 | Bảng phí vận chuyển cho US / EU / SG (và GB nếu mở) | **[CẦN CUNG CẤP]** |
| 4 | Trọng lượng (gram) từng variant | Phụ thuộc S06 |
| 5 | Trạng thái đăng ký VAT / IOSS / GST | **[CẦN CUNG CẤP]** |
| 6 | HS code cho thẻ bài | **[CẦN CUNG CẤP]** |
| 7 | Quyết định có thu duties ở Checkout | **[CẦN QUYẾT]** |
| 8 | Email theo domain đã xác thực SPF/DKIM | **[CẦN CUNG CẤP]** |
| 9 | Shopify Payments ở trạng thái Active | Phụ thuộc S00-B6 |

---

## d. Ca kiểm thử

Chạy bằng **Test mode** (Settings → Payments → Shopify Payments → Manage → bật **Test mode**), rồi
dùng thẻ test của Shopify. **Nhớ tắt Test mode sau khi xong.**

| Mã | Ca kiểm thử | Kết quả mong đợi |
|---|---|---|
| S08-01 | Giỏ 1 card + 1 pack, market US, vào Checkout | Tổng khớp giỏ; tiền tệ USD |
| S08-02 | Đổi sang EU rồi vào Checkout | Toàn bộ dòng và tổng hiện EUR; số lẻ `.99` |
| S08-03 | Đổi sang SG rồi vào Checkout | Hiện SGD; phí ship lấy từ zone chứa Singapore |
| S08-04 | Nhập địa chỉ US, chọn rate, trả tiền test | Tới trang xác nhận; có số đơn |
| S08-05 | Kiểm tra hộp thư sau S08-04 | Nhận email xác nhận, **kiểm tra cả Spam** |
| S08-06 | Lặp S08-04 với địa chỉ Đức | Thành công, tiền tệ EUR trong email |
| S08-07 | Lặp S08-04 với địa chỉ Singapore | Thành công, tiền tệ SGD |
| S08-08 | Nhập địa chỉ ở nước **không** trong 29 nước | Shopify báo không giao được — đúng, nhưng xác nhận đây là nước khách thật sự không bán |
| S08-09 | Nhập địa chỉ ở nước có zone nhưng zone **thiếu rate** | Hiện lỗi không có phương thức giao — **phải sửa**, đây là lỗi cấu hình |
| S08-10 | Checkout khi variant vừa hết hàng ở tab khác | Shopify chặn và báo số lượng còn lại |
| S08-11 | Checkout đơn chỉ có hàng sealed (nặng) vs đơn chỉ có 1 lá (nhẹ) | Phí ship **khác nhau** — chứng minh gram đã điền đúng |
| S08-12 | Kiểm tra logo và màu ở Checkout | Khớp branding đã đặt ở B1 |
| S08-13 | Mở Checkout ở 390 px | Không vỡ; logo không tràn |
| S08-14 | Đặt đơn có ghi chú ở giỏ | Ghi chú hiện trong Admin → Orders → Additional details |
| S08-15 | Ghi lại tổng ở `/cart` rồi so với tổng ở bước cuối Checkout | **Khớp từng đồng**, ở cả 3 tiền tệ |
| S08-16 | Thử Shop Pay / Apple Pay (nếu bật) | Vào đúng luồng express, tổng vẫn khớp |
| S08-17 | Bỏ giỏ giữa Checkout, chờ 10 giờ | Nhận email abandoned checkout |
| S08-18 | Sau khi xong toàn bộ: kiểm tra Settings → Payments | **Test mode đã tắt** |

---

## e. Tiêu chí nghiệm thu

- [ ] **Giá và tiền tệ ở Checkout khớp tuyệt đối với giỏ hàng** — kiểm ở cả USD, EUR, SGD
- [ ] Logo và màu ở Checkout đồng bộ với storefront
- [ ] Mọi Shipping zone đều có ít nhất 1 rate; không nước nào trong danh sách bán bị chặn
- [ ] Phí ship phản ứng đúng với trọng lượng đơn hàng
- [ ] Đã hoàn tất thành công ít nhất 3 đơn thử: 1 US, 1 EU, 1 SG
- [ ] Mỗi đơn thử đều tới được trang xác nhận và nhận được email xác nhận
- [ ] Email xác nhận không vào Spam; sender email ở trạng thái Authenticated
- [ ] Cấu hình thuế khớp với trạng thái đăng ký VAT/GST thật của doanh nghiệp
- [ ] Customer accounts đặt Optional; ô marketing consent không tick sẵn
- [ ] Mua vượt tồn kho bị Shopify chặn
- [ ] Test mode đã tắt; các đơn thử đã được cancel hoặc đánh dấu để không tính vào báo cáo
- [ ] Đã ghi lại rõ cho khách những gì **không** sửa được ở Checkout trên plan Basic
