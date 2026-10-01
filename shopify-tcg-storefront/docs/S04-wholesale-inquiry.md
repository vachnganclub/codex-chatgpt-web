# S04 — Form Wholesale Inquiry (`/pages/wholesale-inquiry`)

Dùng `sections/wholesale-form.liquid` và template `templates/page.wholesale-inquiry.json`.
**Cả hai đã có trong theme.** Form đã đủ trường và đã có validation.

Việc còn lại: **tạo page, gán template, cấu hình email nhận, và kiểm thử.**

---

## a. Mục tiêu

1. Trang `/pages/wholesale-inquiry` tồn tại và hiện đúng form (hiện đang **404**).
2. Form có đủ trường theo spec: Name, Country, Email, Products & Quantity, Preferred contact + ID, Message.
3. Validation chặn đúng từng trường, thông báo lỗi tiếng Anh.
4. Gửi xong về đúng hộp thư của cửa hàng, có thông báo gửi thành công trên trang.
5. Hoạt động trên điện thoại.

---

## b. Các bước thực hiện

### B1. Tạo page và gán template

1. Online Store → **Pages** → **Add page**.
2. **Title**: `Wholesale Inquiry`.
3. **Content**: để trống hoặc điền đoạn mở đầu — xem B3.
4. Bên phải, mục **Theme template**, chọn **`wholesale-inquiry`**. Template này đã có trong theme
   nên nó sẽ xuất hiện trong danh sách.
5. Mục **Search engine listing** → kiểm tra **URL and handle** đúng là **`wholesale-inquiry`**.
   Handle phải khớp chính xác, vì footer tự tìm page theo handle này.
6. **Visibility**: Visible.
7. Save.

> Nếu handle bị Shopify đặt thành `wholesale-inquiry-1` (do trùng), xoá page cũ hoặc sửa handle
> về đúng. Sai handle thì liên kết ở footer và thẻ trên trang chủ đều không hoạt động.

### B2. Các trường của form — **[ĐÃ XÁC ĐỊNH theo code]**

Form dùng `{% form 'contact' %}` native của Shopify. **Không cần app.**

| # | Nhãn | `name` gửi đi | Loại | Bắt buộc | Ràng buộc |
|---|---|---|---|---|---|
| — | (ẩn) | `contact[form_type]` | hidden | — | Giá trị cố định `Wholesale Inquiry` — dùng để lọc thư |
| 1 | Name | `contact[name]` | text | ✅ | 2–100 ký tự, `autocomplete="name"` |
| 2 | Country | `contact[country]` | select | ✅ | Danh sách sinh từ `localization.available_countries` + "Other" |
| 3 | Email | `contact[email]` | email | ✅ | Kiểu `email`, `spellcheck=false`, `autocapitalize=off` |
| 4 | Products & Quantity | `contact[Products and quantity]` | textarea 4 dòng | ✅ | ≥ 3 ký tự |
| 5 | Preferred contact | `contact[Preferred contact]` | radio ×4 | ✅ | WhatsApp · LINE · Instagram · Telegram |
| 6 | Contact ID / phone number | `contact[Contact ID]` | text | ✅ | 3–100 ký tự |
| 7 | Message | `contact[body]` | textarea 5 dòng | ❌ | Tối đa 2000 ký tự |

> ⚠️ **Trường Country phụ thuộc Markets.** Danh sách quốc gia lấy từ
> `localization.available_countries`. Store hiện có **1 market duy nhất (Việt Nam)**, nên dropdown
> này **đang chỉ có Việt Nam + Other**. Phải xong [S00-B5](S00-thiet-lap-chung.md#b5-shopify-markets--settings--markets)
> thì khách Mỹ, Đức, Singapore mới chọn được nước của mình.

### B3. Validation — **[ĐÃ XÁC ĐỊNH]**

Form có `novalidate` + `data-validate-form`, nên validation do JS của theme chạy, đọc thông báo lỗi
từ thuộc tính `data-error` của từng trường. Lỗi hiện trong `<p class="field__error">` ngay dưới
trường đó.

| Trường | Quy tắc | Thông báo lỗi (tiếng Anh, đã có trong theme) |
|---|---|---|
| Name | Bắt buộc, ≥ 2 ký tự | `Please enter your name (at least 2 characters).` |
| Country | Bắt buộc chọn | `Please select your country.` |
| Email | Bắt buộc, đúng định dạng | `Please enter a valid email address (e.g. name@example.com).` |
| Products & Quantity | Bắt buộc, ≥ 3 ký tự | `Please list the products and quantities you are interested in.` |
| Preferred contact | Bắt buộc chọn 1 trong 4 | `Please choose how you would like us to contact you.` |
| Contact ID | Bắt buộc, ≥ 3 ký tự | `Please enter your ID or number for the selected channel.` |
| Message | Không bắt buộc | — |

Sửa câu chữ nếu cần: Online Store → Themes → **Edit code** → `sections/wholesale-form.liquid` →
đổi giá trị `data-error`. Đây là lần duy nhất trong dự án cần mở code, và chỉ là đổi chuỗi.

**Validation phía server** vẫn còn làm lớp 2: nếu JS bị tắt, Shopify trả về `form.errors` và theme
in ra khối `form-message--error` kèm `default_errors`.

### B4. Hai điểm lệch với thực tế cần quyết

**(1) Chưa có ô đồng ý xử lý dữ liệu.** Form thu tên, email và kênh liên hệ của khách EU nhưng
không có checkbox consent. Ba phương án:

| Phương án | Cách làm | Đánh giá |
|---|---|---|
| **A (khuyến nghị)** | Thêm 1 câu vào section setting `intro`: nêu dữ liệu dùng để trả lời yêu cầu, kèm link tới Privacy Policy | Không sửa code; đủ cho mức "thông báo". Cần luật sư xác nhận là đủ với GDPR |
| B | Sửa `wholesale-form.liquid` thêm checkbox `contact[Consent]` required | Đúng chuẩn nhất, nhưng phải sửa code |
| C | Không làm gì | Có rủi ro pháp lý với khách EU |

**[CẦN QUYẾT]**, và nên hỏi cùng lúc với nội dung pháp lý ở [S05](S05-privacy-cookie.md).

**(2) Không có lựa chọn "chỉ liên hệ qua email".** Theme bắt buộc chọn 1 trong 4 kênh và bắt buộc
điền Contact ID. Điều này **khớp đúng spec gốc** (spec chỉ liệt kê 4 kênh). Nhưng thực tế có khách
doanh nghiệp chỉ muốn trao đổi qua email.

**[CẦN QUYẾT]**: giữ như spec, hay thêm lựa chọn thứ 5 "Email only" và cho Contact ID thành không
bắt buộc khi chọn nó. Phương án sau cần sửa code.

### B5. Cấu hình email nhận

Submission của `{% form 'contact' %}` được Shopify gửi tới **email liên hệ của cửa hàng**.

1. Settings → **General** → **Store contact email** — đây là hộp thư nhận form.
   Hiện là `ductrananh265@gmail.com`. **[ĐỀ XUẤT]** đổi sang email theo domain, ví dụ
   `wholesale@adamantile.com`, để thư không lẫn vào hộp thư cá nhân.
2. Settings → **Notifications** → **Sender email** → đổi sang email domain → bấm
   **Authenticate** → thêm bản ghi SPF và DKIM ở nhà cung cấp domain.
3. **[ĐỀ XUẤT]** tạo filter ở hộp thư: lọc theo chuỗi `Wholesale Inquiry` (giá trị của
   `contact[form_type]`) để tự gắn nhãn, khỏi lẫn với thư liên hệ thường.

**Cách kiểm tra thư có vào Spam không:**

1. Gửi 1 bản thử từ chính trang `/pages/wholesale-inquiry` (dùng email thật của bạn ở trường Email).
2. Kiểm tra **Inbox**, rồi **Spam**, rồi tab **Promotions** nếu dùng Gmail.
3. Nếu vào Spam: mở thư → **Report not spam**, và kiểm tra lại bước Authenticate ở trên.
4. Gửi thêm 1 bản thử tới một hộp thư **khác nhà cung cấp** (ví dụ Outlook) để chắc chắn không chỉ
   Gmail nhận được.
5. Dùng công cụ kiểm tra SPF/DKIM công khai để xác nhận bản ghi đã lan truyền.

> Shopify **không** lưu lịch sử submission của form contact. Nếu thư bị mất là mất luôn yêu cầu.
> Đây là lý do bước xác thực email là bắt buộc, không phải tuỳ chọn.

### B6. Section settings — Customize → Pages → Wholesale Inquiry

| Setting | Giá trị |
|---|---|
| `heading` | Để trống → dùng tiêu đề page (`Wholesale Inquiry`) |
| `intro` | **[CẦN CUNG CẤP]** đoạn mở đầu + câu về dữ liệu nếu chọn phương án A ở B4. Chỉ hiện khi **Content của page để trống** |
| `button_label` | `Send inquiry` (mặc định) |
| `success_message` | **[ĐỀ XUẤT]** nêu rõ thời gian phản hồi, ví dụ: trả lời trong vòng 1 ngày làm việc, và nhắc khách kiểm tra Spam |

> Lưu ý thứ tự ưu tiên: nếu **Content** của page có nội dung thì `intro` **bị bỏ qua**. Chọn một
> chỗ để viết, đừng viết cả hai.

---

## c. Dữ liệu đầu vào cần có

| # | Mục | Trạng thái |
|---|---|---|
| 1 | Đoạn mở đầu cho trang | **[CẦN CUNG CẤP]** |
| 2 | Thời gian phản hồi cam kết (để viết success message) | **[CẦN CUNG CẤP]** |
| 3 | Email domain nhận yêu cầu wholesale | **[CẦN CUNG CẤP]** |
| 4 | Quyền truy cập DNS của domain để thêm SPF/DKIM | **[CẦN CUNG CẤP]** |
| 5 | Quyết định về ô consent (A / B / C) | **[CẦN QUYẾT]** |
| 6 | Quyết định có thêm lựa chọn "Email only" | **[CẦN QUYẾT]** |
| 7 | Markets đã cấu hình (ảnh hưởng dropdown Country) | Phụ thuộc S00 |

---

## d. Ca kiểm thử

| Mã | Ca kiểm thử | Kết quả mong đợi |
|---|---|---|
| S04-01 | Mở `/pages/wholesale-inquiry` | Trang hiện form, **không 404** |
| S04-02 | Điền đủ 7 trường, bấm Send inquiry | Hiện khối success màu riêng, con trỏ nhảy vào khối đó (có `autofocus`) |
| S04-03 | Kiểm tra hộp thư sau S04-02 | Nhận thư, tiêu đề/nội dung chứa `Wholesale Inquiry`, có đủ 6 trường đã điền |
| S04-04 | Để trống Name, bấm Send | Chặn gửi; lỗi hiện dưới Name; con trỏ nhảy vào Name |
| S04-05 | Name chỉ 1 ký tự | Chặn, báo lỗi yêu cầu ≥ 2 ký tự |
| S04-06 | Không chọn Country | Chặn, lỗi dưới Country |
| S04-07 | Email sai định dạng (`abc@`, `abc.com`, `a b@c.com`) | Cả 3 đều bị chặn với lỗi định dạng |
| S04-08 | Để trống Products & Quantity | Chặn, lỗi dưới trường đó |
| S04-09 | Không chọn Preferred contact | Chặn, lỗi dưới nhóm radio |
| S04-10 | Chọn WhatsApp, để trống Contact ID | Chặn, lỗi dưới Contact ID |
| S04-11 | Để trống Message | **Gửi được** — trường này không bắt buộc |
| S04-12 | Gửi thiếu nhiều trường cùng lúc | Tất cả trường lỗi đều được đánh dấu, không chỉ trường đầu |
| S04-13 | Tắt JavaScript, gửi thiếu Email | Shopify trả lỗi phía server, hiện khối `form-message--error` |
| S04-14 | Gửi form trên điện thoại ở 390 px | Mọi trường bấm được, bàn phím không che nút Send, không cuộn ngang |
| S04-15 | Kiểm tra dropdown Country sau khi xong Markets | Có United States, các nước EU, Singapore (và United Kingdom nếu mở) |
| S04-16 | Gửi tới hộp thư Outlook | Vẫn vào Inbox, không vào Junk |
| S04-17 | Gửi 2 lần liên tiếp | Cả 2 thư đều tới, không bị chặn trùng |
| S04-18 | Nhập Message dài hơn 2000 ký tự | Bị cắt ở 2000, không lỗi |
| S04-19 | Bấm link Privacy Policy trong đoạn intro (nếu dùng phương án A) | Mở đúng `/pages/privacy-policy` |
| S04-20 | Kiểm tra liên kết Wholesale ở footer và ở thẻ trang chủ | Cả hai mở đúng trang này |

---

## e. Tiêu chí nghiệm thu

- [ ] Page tồn tại với handle đúng `wholesale-inquiry` và đã gán template `wholesale-inquiry`
- [ ] Form có đủ 7 trường theo bảng B2
- [ ] Mỗi trường bắt buộc đều chặn được khi để trống, lỗi hiện ngay dưới trường đó
- [ ] Thông báo lỗi bằng tiếng Anh
- [ ] Gửi thành công hiện khối success, không chỉ tải lại trang
- [ ] Thư về đúng hộp thư đã chỉ định, **không** vào Spam
- [ ] Đã kiểm tra với tối thiểu 2 nhà cung cấp email khác nhau
- [ ] Sender email ở trạng thái Authenticated
- [ ] Dropdown Country có đủ các nước thuộc 3 thị trường đích
- [ ] Đã chốt phương án cho ô consent
- [ ] Hoạt động đầy đủ ở 390 px
- [ ] Liên kết tới trang này hoạt động từ cả footer và trang chủ
