# S11 — Trang Feedback khách hàng (`/pages/feedback`)

Dùng `sections/main-feedback.liquid` và template `templates/page.feedback.json`.
**Cả hai đã có trong theme.**

**Ràng buộc quan trọng:** trang **không** có chức năng để người mua tự gửi đánh giá. Nội dung do
quản trị viên cập nhật thủ công. Theme đã làm đúng điều này — không có form nào trong section.

Hệ quả tốt: **không cần app review, không phát sinh chi phí.**

---

## a. Mục tiêu

1. Trang `/pages/feedback` tồn tại (hiện đang **404**) và hiện danh sách trích dẫn feedback.
2. Mỗi mục có: tên khách, quốc gia, nội dung nhận xét, ảnh sản phẩm nhận được (nếu có).
3. Có đoạn giới thiệu ở đầu trang.
4. Quản trị viên tự thêm / sửa / xoá được feedback về sau mà không cần lập trình viên.
5. Ảnh không bị méo.
6. Có liên kết từ footer và từ trang chủ.

---

## b. Các bước thực hiện

### B1. Tạo page

1. Online Store → **Pages** → **Add page**.
2. **Title**: `Customer feedback` (hoặc `Feedback`).
3. **Content**: đoạn giới thiệu — xem B3.
4. **Theme template**: chọn **`feedback`**.
5. **Search engine listing** → **URL and handle** phải đúng là **`feedback`** —
   footer và thẻ trên trang chủ tìm page theo handle này.
6. Visibility: Visible. Save.

### B2. Cấu trúc mỗi mục feedback — **[ĐÃ XÁC ĐỊNH theo code]**

Mỗi feedback là một **theme block** loại `feedback`, với đúng 4 setting:

| Setting | Nhãn trong Theme Editor | Loại | Bắt buộc |
|---|---|---|---|
| `name` | Customer name | Text | ✅ |
| `country` | Country | Text | ❌ (theme tự ẩn dòng nếu trống) |
| `quote` | Feedback text | Rich text | ✅ |
| `image` | Photo of received product (optional) | Image picker | ❌ |

Thứ tự hiển thị trong mỗi thẻ: **ảnh ở trên**, rồi trích dẫn, rồi tên + quốc gia ở dưới cùng.

Giới hạn cần biết: Shopify cho tối đa **50 block** mỗi section. Quá 50 feedback thì phải chia
section hoặc chuyển sang metaobject. **[ĐỀ XUẤT]** giữ 12–24 feedback tốt nhất, không cần nhiều hơn.

### B3. Đoạn giới thiệu — chú ý thứ tự ưu tiên

`main-feedback.liquid` chọn nguồn theo thứ tự này:

1. Nếu **Content của page** có nội dung → dùng nó.
2. Nếu Content trống → dùng section setting **`intro`**.

Tương tự với tiêu đề: setting `heading` nếu có, không thì dùng **tiêu đề page**.

**[ĐỀ XUẤT]** viết đoạn giới thiệu vào **Content của page** (dễ sửa hơn Theme Editor), và để
`intro` trống.

Khung nội dung **[CẦN CUNG CẤP]**:

```
[Câu 1] Nêu rõ đây là cảm nhận của khách đã nhận hàng.
[Câu 2] Nêu rõ shop đăng lại khi được khách đồng ý.
[Câu 3] (tuỳ chọn) Nêu khách có thể gửi cảm nhận qua kênh nào — email, WhatsApp...
        Lưu ý: trang này KHÔNG có form, nên phải chỉ rõ kênh khác.
```

Câu 2 không chỉ là lịch sự — đăng tên, quốc gia và ảnh của người khác mà không có sự đồng ý là rủi
ro pháp lý, đặc biệt với khách EU.

### B4. Xoá nội dung mẫu — **bước bắt buộc**

Template `page.feedback.json` hiện **đã được seed sẵn 3 block mẫu**:

```
sample-1, sample-2, sample-3
  name:    "Sample review 1 / 2 / 3"
  country: "Country"
  quote:   "This is a sample review that shows the layout. Replace it with real feedback
            from a customer, with their permission, in the theme editor."
```

Nếu không xoá, khách sẽ đọc được "Sample review 1" trên trang public.

1. Online Store → Themes → Customize → chọn page **Customer feedback** ở dropdown trên.
2. Click section **Customer feedback** → thấy 3 block `Feedback`.
3. Với mỗi block: thay cả 4 giá trị bằng feedback thật, **hoặc** xoá block nếu chưa có đủ feedback.
4. Save.

> Nếu xoá hết block, trang sẽ trống phần danh sách. Trong Theme Editor hiện dòng nhắc
> (`sections.feedback.editor_empty`), nhưng **trang public chỉ hiện tiêu đề và đoạn giới thiệu**.
> **[ĐỀ XUẤT]** chưa có feedback thật thì chưa đưa trang này vào menu và footer — hoặc đặt page ở
> trạng thái Hidden cho tới khi có ít nhất 3 feedback.

### B5. Hướng dẫn quản trị viên tự cập nhật về sau

Đây là phần bàn giao. Ghi lại nguyên văn các bước này cho người vận hành:

**Thêm một feedback mới**

| # | Thao tác |
|---|---|
| 1 | Online Store → Themes → nút **Customize** của theme đang dùng |
| 2 | Dropdown ở thanh trên, chọn **Pages** → **Customer feedback** |
| 3 | Cột trái, click section **Customer feedback** |
| 4 | Bấm **Add block** → chọn **Feedback** |
| 5 | Điền **Customer name** và **Country** |
| 6 | Dán nhận xét vào **Feedback text** — dán nguyên văn, không sửa ý của khách |
| 7 | Nếu có ảnh: bấm **Select image** → **Upload** (hoặc chọn từ Content → Files) |
| 8 | Kéo block lên xuống trong cột trái để đổi thứ tự |
| 9 | Bấm **Save** |
| 10 | Mở trang thật trên **điện thoại** kiểm tra ảnh không bị cắt mất phần quan trọng |

**Sửa một feedback**: bước 1–3, click vào block cần sửa, sửa, Save.

**Xoá một feedback**: bước 1–3, click block → bấm icon thùng rác (hoặc **Remove block**) → Save.
Theme tự dồn lưới lại, không để lại ô trống.

### B6. Quy cách ảnh — **[ĐÃ XÁC ĐỊNH theo theme]**

Theme ghi rõ trong phần `info` của setting ảnh:

| Mục | Yêu cầu |
|---|---|
| Tỉ lệ | **Vuông 1:1** |
| Kích thước tối thiểu | **800 × 800 px** |
| Định dạng | JPG hoặc WEBP |
| Dung lượng | **dưới 300 KB** |
| Cách chống méo | Theme render ở `width: 800` với các bản `300, 500, 800`, và ô ảnh crop về vuông. **Ảnh bị cắt bớt, không bị kéo méo** |

Khuyến nghị thực tế:

- Ảnh khách gửi thường là ảnh dọc chụp bằng điện thoại. **Crop về vuông trước khi upload**, đặt lá
  bài hoặc gói hàng vào giữa khung. Nếu để nguyên ảnh dọc, phần trên và dưới sẽ bị cắt.
- Ảnh quá tối hoặc mờ thì xin lại hoặc bỏ ảnh — thà không có ảnh hơn có ảnh không đọc được.
- **Alt text**: theme dùng `image.alt`, fallback về `block.settings.name`. Nên đặt alt khi upload
  trong Content → Files, ví dụ mô tả ngắn cái gì trong ảnh.
- Không dùng ảnh có mặt người nếu chưa có sự đồng ý rõ ràng.

### B7. Liên kết tới trang này

| Nguồn | Trạng thái |
|---|---|
| **Footer** | **Tự động.** `footer.liquid` tìm page handle `feedback` và tự tạo liên kết. Không cần làm gì |
| **Trang chủ** | Đã có — thẻ `card-feedback` trong section `link-cards` trỏ `/pages/feedback` (S01-B3) |
| **Menu đầu trang** | **[ĐỀ XUẤT] không thêm.** Spec chốt header đúng 6 mục; thêm nữa sẽ vỡ ở mobile |

---

## c. Dữ liệu đầu vào cần có

| # | Mục | Trạng thái |
|---|---|---|
| 1 | Nội dung nhận xét thật của từng khách, nguyên văn | **[CẦN CUNG CẤP]** |
| 2 | Tên khách (hoặc tên viết tắt nếu khách muốn) | **[CẦN CUNG CẤP]** |
| 3 | Quốc gia của từng khách | **[CẦN CUNG CẤP]** |
| 4 | Ảnh sản phẩm khách nhận được, đã crop vuông ≥ 800 × 800 | **[CẦN CUNG CẤP]** |
| 5 | **Bằng chứng khách đồng ý cho đăng tên, quốc gia và ảnh** | **[CẦN CUNG CẤP]** — lưu lại tin nhắn hoặc email đồng ý |
| 6 | Đoạn giới thiệu đầu trang | **[CẦN CUNG CẤP]** |
| 7 | Kênh để khách gửi cảm nhận (vì trang không có form) | **[CẦN QUYẾT]** |
| 8 | Quyết định ẩn trang cho tới khi có ≥ 3 feedback thật | **[CẦN QUYẾT]** |

> Store hiện có **0 đơn hàng**, nên **chưa thể có feedback thật nào**. Hạng mục này về kỹ thuật
> xong rất nhanh, nhưng về nội dung phải chờ sau khi bán được hàng. Đừng để nó chặn go-live —
> ẩn trang hoặc đưa lên sau.

---

## d. Ca kiểm thử

| Mã | Ca kiểm thử | Kết quả mong đợi |
|---|---|---|
| S11-01 | Mở `/pages/feedback` | Trang hiện, **không 404** |
| S11-02 | Tìm chuỗi "Sample review" trên trang | Không còn kết quả |
| S11-03 | Tìm chuỗi "This is a sample review" | Không còn kết quả |
| S11-04 | Tìm form hoặc nút gửi đánh giá trên trang | **Không có** — đúng theo spec |
| S11-05 | Xem 1 mục feedback đầy đủ | Hiện ảnh, trích dẫn, tên và quốc gia |
| S11-06 | Xem 1 mục không có ảnh | Thẻ vẫn gọn, không để khoảng trống ảnh |
| S11-07 | Xem 1 mục không có quốc gia | Dòng quốc gia bị ẩn, không hiện dấu phân cách lạc |
| S11-08 | Upload 1 ảnh dọc 1200 × 1600 | Ảnh bị **cắt** về vuông, **không bị kéo méo** |
| S11-09 | Upload 1 ảnh nhỏ 400 × 400 | Ảnh bị phóng to và mờ — xác nhận lý do yêu cầu tối thiểu 800 × 800 |
| S11-10 | Thêm 1 block mới theo B5 | Xuất hiện trên trang sau khi Save |
| S11-11 | Kéo đổi thứ tự 2 block | Thứ tự trên trang đổi theo |
| S11-12 | Xoá 1 block ở giữa | Lưới dồn lại, không còn ô trống |
| S11-13 | Thêm tới 13 block | Lưới vẫn đều, không có thẻ nào bị kéo cao bất thường |
| S11-14 | Mở trang ở 390 px | Thẻ xuống 1 cột, ảnh không tràn, chữ không bị cắt |
| S11-15 | Mở trang ở nền tối | Trích dẫn và tên đủ tương phản |
| S11-16 | Tắt tải ảnh | Mỗi ảnh hiện alt text có nghĩa |
| S11-17 | Bấm liên kết Feedback ở footer | Mở đúng trang này |
| S11-18 | Bấm thẻ Customer feedback ở trang chủ | Mở đúng trang này |
| S11-19 | Nhận xét có nhiều đoạn | Rich text giữ đúng các đoạn, không gộp thành một khối |

---

## e. Tiêu chí nghiệm thu

- [ ] Page tồn tại, handle đúng `feedback`, đã gán template `feedback`
- [ ] **Không có form hay nút nào cho người mua tự gửi đánh giá**
- [ ] Đã xoá sạch 3 block mẫu `Sample review 1/2/3`
- [ ] Mỗi mục feedback có tên và nội dung nhận xét; có quốc gia và ảnh nếu khách cung cấp
- [ ] Nội dung nhận xét là nguyên văn của khách, không bị sửa ý
- [ ] Đã lưu được bằng chứng khách đồng ý cho đăng
- [ ] Ảnh đúng tỉ lệ vuông, tối thiểu 800 × 800, dưới 300 KB, không bị méo
- [ ] Mọi ảnh có alt text
- [ ] Có đoạn giới thiệu nói rõ đây là cảm nhận của khách đã nhận hàng
- [ ] Có liên kết từ footer và từ trang chủ, cả hai hoạt động
- [ ] Đã bàn giao hướng dẫn 10 bước ở B5 cho người vận hành, và họ tự thêm được 1 feedback thử
- [ ] Hiển thị đúng ở 390 px và ở nền tối
- [ ] Không cài app review nào, không phát sinh chi phí
