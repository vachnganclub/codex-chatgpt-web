# S05 — Privacy Policy & Cookie Policy (`/pages/privacy-policy`)

Dùng `sections/main-policy.liquid` và template `templates/page.privacy-policy.json`.
**Cả hai đã có trong theme.**

**Ràng buộc tuyệt đối:** nội dung pháp lý do khách hàng hoặc luật sư của khách cung cấp và duyệt.
Tài liệu này **chỉ đề xuất khung mục lục** và hướng dẫn cấu hình. Không có câu chữ pháp lý nào
được tự viết.

---

## a. Mục tiêu

1. Một trang chứa đủ 2 phần: Privacy Policy và Cookie Policy, có mục lục nhảy được.
2. Có cookie banner cho khách Châu Âu, banner trỏ đúng về phần 2 của trang này.
3. Có liên kết ở footer, tách riêng 2 liên kết Privacy và Cookie.
4. Xoá sạch nội dung mẫu của theme trước khi đăng.
5. Đọc được trên điện thoại.

---

## b. Các bước thực hiện

### B1. Cấu trúc 2 phần — **[ĐÃ XÁC ĐỊNH theo code]**

`main-policy.liquid` dựng trang theo cách sau, cần hiểu rõ trước khi nhập nội dung:

| Phần | Anchor | Nội dung lấy từ đâu |
|---|---|---|
| Mục lục | — | Tự sinh từ 2 setting `privacy_heading` và `cookie_heading` |
| **Phần 1 — Privacy Policy** | `#privacy-policy` | **Content của page** (Online Store → Pages → Privacy Policy → ô nội dung) |
| **Phần 2 — Cookie Policy** | `#cookie-policy` | Setting `cookie_text` (rich text trong Theme Editor), **hoặc** setting `cookie_page` trỏ sang một page khác — `cookie_page` thắng nếu được chọn |
| Dòng ngày hiệu lực | — | Setting `last_updated` |

Hệ quả cần nhớ: **nội dung 2 phần nằm ở 2 chỗ khác nhau**. Phần 1 ở Pages, phần 2 ở Theme Editor.
Người cập nhật về sau rất dễ tìm sai chỗ — ghi rõ điều này khi bàn giao.

**[ĐỀ XUẤT]** nếu Cookie Policy dài (trên ~1500 từ) hoặc cần sửa thường xuyên, tạo một page riêng
handle `cookie-policy` rồi chọn nó vào setting `cookie_page`. Sửa nội dung ở Pages dễ hơn sửa trong
Theme Editor, và không rủi ro mất nội dung khi đổi theme.

### B2. Tạo page

1. Online Store → **Pages** → **Add page**.
2. **Title**: `Privacy Policy & Cookie Policy`.
3. **Content**: dán **toàn văn phần 1** do khách/luật sư cung cấp.
4. **Theme template**: chọn **`privacy-policy`**.
5. **Search engine listing** → **URL and handle** phải đúng là **`privacy-policy`** —
   footer tự tìm page theo handle này.
6. Visibility: Visible. Save.

### B3. Xoá nội dung mẫu — **bước bắt buộc**

Template `page.privacy-policy.json` hiện **đã được seed sẵn** một đoạn placeholder:

```
"cookie_text": "<p><strong>DEMO PLACEHOLDER.</strong> The Cookie Policy text approved by
your lawyer goes here ...</p>"
```

Nếu không xoá, trang public sẽ hiện dòng "DEMO PLACEHOLDER" cho khách đọc.

1. Online Store → Themes → Customize → chọn page **Privacy Policy** ở dropdown trên.
2. Click section **Privacy & Cookie policy**.
3. Xoá sạch nội dung ô **Cookie Policy text**, dán toàn văn phần 2 do khách cung cấp.
4. Save.

### B4. Khung mục lục đề xuất

**[ĐỀ XUẤT]** — đây là danh mục đề mục để khách/luật sư biết cần soạn những gì. Không phải nội dung.

**Phần 1 — Privacy Policy**

| # | Đề mục |
|---|---|
| 1 | Chúng tôi là ai và cách liên hệ về vấn đề dữ liệu |
| 2 | Dữ liệu thu thập khi bạn mua hàng (tên, email, địa chỉ giao, thông tin thanh toán) |
| 3 | Dữ liệu thu thập khi bạn gửi Wholesale Inquiry (gồm cả ID kênh liên hệ) |
| 4 | Dữ liệu thu thập tự động khi bạn truy cập (cookie, log, thiết bị) |
| 5 | Mục đích sử dụng dữ liệu |
| 6 | Cơ sở pháp lý xử lý dữ liệu (bắt buộc với khách EU — GDPR) |
| 7 | Bên thứ ba nhận dữ liệu: Shopify, Shopify Payments, đơn vị vận chuyển |
| 8 | Chuyển dữ liệu ra ngoài khu vực (quan trọng vì pháp nhân ở Mỹ, vận hành ở Việt Nam, khách ở EU) |
| 9 | Thời gian lưu trữ |
| 10 | Quyền của bạn và cách thực hiện (truy cập, sửa, xoá, phản đối, mang đi) |
| 11 | Dữ liệu của trẻ vị thành niên — **cân nhắc riêng**, thẻ bài có nhóm khách dưới 18 tuổi |
| 12 | Khiếu nại với cơ quan bảo vệ dữ liệu |
| 13 | Thay đổi chính sách |

**Phần 2 — Cookie Policy**

| # | Đề mục |
|---|---|
| 14 | Cookie là gì |
| 15 | Cookie cần thiết (giỏ hàng, checkout, bảo mật) — không tắt được |
| 16 | Cookie phân tích và hiệu năng |
| 17 | Cookie quảng cáo, nếu có chạy quảng cáo |
| 18 | Bảng danh sách cookie: tên · mục đích · thời hạn · bên đặt |
| 19 | Cách bạn thay đổi lựa chọn cookie sau này |
| 20 | Cookie của bên thứ ba |

> Mục 18 cần danh sách cookie thật. Shopify đặt một số cookie cố định (`_shopify_*`, `cart`,
> `_secure_session_id`…). Lấy danh sách chuẩn từ tài liệu của Shopify về cookie, đừng liệt kê theo
> phỏng đoán.

### B5. Cookie banner — Settings → Customer privacy

Banner **không** thuộc theme. Shopify cung cấp sẵn, miễn phí, không cần app.

1. Settings → **Customer privacy**.
2. Mục **Cookie banner** → **Show cookie banner**.
3. **Region visibility**: chọn **European Economic Area (EEA)** và **United Kingdom**.
   **[ĐỀ XUẤT]** cân nhắc thêm California nếu bán nhiều cho Mỹ (CCPA).
4. Mục **Customize** → sửa màu cho khớp theme (`#1d3fbb` cho nút chính).
5. Mục **Cookie policy link** → trỏ về **`/pages/privacy-policy#cookie-policy`** —
   đúng anchor của phần 2, không trỏ về đầu trang.
6. Mục **Data sharing / Privacy policy link** → trỏ về `/pages/privacy-policy#privacy-policy`.
7. Save.
8. Kiểm tra thêm mục **Data sale opt-out** nếu có chạy quảng cáo hướng đối tượng.

> Cookie banner của Shopify chỉ hoạt động đầy đủ khi các app và script trên store tôn trọng
> Customer Privacy API. Hiện store chưa cài app nào ngoài Search & Discovery (sẽ cài ở S10), nên
> không có xung đột.

### B6. Liên kết ở Footer

**Không cần làm gì.** `sections/footer.liquid` tự tìm page handle `privacy-policy` và tự tạo
**2 liên kết riêng**:

- `Privacy Policy` → `/pages/privacy-policy#privacy-policy`
- `Cookie Policy` → `/pages/privacy-policy#cookie-policy`

Điều kiện duy nhất: page phải tồn tại với handle đúng. Nếu handle khác, vào Customize → Footer →
chọn tay page vào setting **Privacy & Cookie Policy page**.

### B7. Chính sách mặc định của Shopify — đừng bỏ sót

Settings → **Policies** có 5 ô riêng: Refund policy, Privacy policy, Terms of service, Shipping
policy, Contact information. Chúng hiện ở **Checkout** và ở footer qua menu `footer`.

> ⚠️ **Rủi ro trùng lặp.** Nếu điền cả ô **Privacy policy** ở Settings → Policies **và** page
> `/pages/privacy-policy`, store sẽ có **2 bản chính sách riêng biệt** ở 2 URL
> (`/policies/privacy-policy` và `/pages/privacy-policy`). Hai bản lệch nhau là rủi ro pháp lý.

**[ĐỀ XUẤT]** chọn một trong hai:

| Phương án | Cách làm |
|---|---|
| **A (khuyến nghị)** | Page `/pages/privacy-policy` là bản chính. Ở Settings → Policies, ô Privacy policy chỉ đặt 1 dòng dẫn sang page đó |
| B | Settings → Policies là bản chính, và không tạo page — nhưng khi đó mất cấu trúc 2 phần và mục lục của theme |

Các policy còn lại (Refund, Shipping, Terms) **[CẦN CUNG CẤP]** — bắt buộc phải có để Checkout
không hiện link rỗng.

---

## c. Dữ liệu đầu vào cần có

| # | Mục | Trạng thái |
|---|---|---|
| 1 | Toàn văn **Privacy Policy** đã được duyệt | **[CẦN CUNG CẤP]** |
| 2 | Toàn văn **Cookie Policy** đã được duyệt, gồm bảng danh sách cookie | **[CẦN CUNG CẤP]** |
| 3 | Tên pháp nhân đầy đủ và địa chỉ đăng ký | **[CẦN CUNG CẤP]** |
| 4 | Số đăng ký doanh nghiệp / mã số thuế | **[CẦN CUNG CẤP]** |
| 5 | Email xử lý yêu cầu riêng tư (khác email bán hàng) | **[CẦN CUNG CẤP]** |
| 6 | Ngày hiệu lực | **[CẦN CUNG CẤP]** |
| 7 | Có đại diện tại EU (EU representative) theo GDPR không | **[CẦN CUNG CẤP]** |
| 8 | Refund policy, Shipping policy, Terms of service | **[CẦN CUNG CẤP]** |
| 9 | Quyết định phương án A hay B ở B7 | **[CẦN QUYẾT]** |
| 10 | Quyết định Cookie Policy để trong Theme Editor hay tạo page riêng | **[CẦN QUYẾT]** |
| 11 | Có chạy quảng cáo hướng đối tượng không (ảnh hưởng mục 17 và opt-out) | **[CẦN QUYẾT]** |

> **Không bắt đầu B2 và B3 trước khi có mục 1 và 2.** Đăng trang chính sách rỗng hoặc chứa nội dung
> mẫu còn tệ hơn chưa có trang.

---

## d. Ca kiểm thử

| Mã | Ca kiểm thử | Kết quả mong đợi |
|---|---|---|
| S05-01 | Mở `/pages/privacy-policy` | Trang hiện, **không 404** |
| S05-02 | Tìm chuỗi "DEMO PLACEHOLDER" trên trang | Không còn kết quả |
| S05-03 | Tìm nội dung mẫu mặc định của theme | Không còn |
| S05-04 | Xem đầu trang | Có mục lục với 2 liên kết |
| S05-05 | Bấm liên kết thứ 2 trong mục lục | Cuộn tới đúng phần Cookie Policy |
| S05-06 | Mở trực tiếp `/pages/privacy-policy#cookie-policy` | Trang mở và cuộn ngay tới phần 2 |
| S05-07 | Mở trực tiếp `/pages/privacy-policy#privacy-policy` | Cuộn tới phần 1 |
| S05-08 | Xem cuối trang | Có dòng ngày hiệu lực |
| S05-09 | Mở store bằng IP / VPN ở Đức, ở chế độ ẩn danh | Cookie banner hiện ra |
| S05-10 | Bấm liên kết Cookie Policy trên banner | Mở đúng `#cookie-policy`, không về đầu trang |
| S05-11 | Bấm "Chỉ cookie cần thiết" trên banner | Banner đóng; tải lại trang banner không hiện lại |
| S05-12 | Mở store bằng IP Mỹ (nếu không bật California) | Banner **không** hiện — đúng cấu hình region |
| S05-13 | Kiểm tra footer | Có **2 liên kết riêng**: Privacy Policy và Cookie Policy |
| S05-14 | Kiểm tra link chính sách ở trang Checkout | Không có link nào rỗng hoặc 404 |
| S05-15 | So nội dung `/policies/privacy-policy` với `/pages/privacy-policy` | Không có 2 bản nội dung khác nhau (theo phương án đã chọn ở B7) |
| S05-16 | Đọc trang ở 390 px | Chữ không quá nhỏ, bảng cookie cuộn ngang trong khung riêng chứ không làm cả trang cuộn ngang |
| S05-17 | Đọc ở nền tối | Chữ đủ tương phản trên nền `#080b12` |
| S05-18 | Kiểm tra mọi liên kết trong nội dung chính sách | Không link nào chết |

---

## e. Tiêu chí nghiệm thu

- [ ] Page tồn tại, handle đúng `privacy-policy`, đã gán template `privacy-policy`
- [ ] **Toàn bộ nội dung là bản do khách/luật sư cung cấp và duyệt** — không có câu nào do bên triển khai viết
- [ ] Không còn chuỗi "DEMO PLACEHOLDER" hay nội dung mẫu của theme
- [ ] Trang có đủ 2 phần, mỗi phần có anchor hoạt động
- [ ] Mục lục nhảy đúng tới cả 2 phần
- [ ] Có dòng ngày hiệu lực
- [ ] Cookie banner hiện với khách EEA và UK, trỏ đúng về `#cookie-policy`
- [ ] Footer có 2 liên kết riêng Privacy và Cookie
- [ ] Không tồn tại 2 bản chính sách lệch nội dung ở 2 URL
- [ ] 3 policy còn lại (Refund, Shipping, Terms) đã điền, không còn link rỗng ở Checkout
- [ ] Đọc được ở 390 px và ở nền tối
- [ ] Đã bàn giao rõ: phần 1 sửa ở Pages, phần 2 sửa ở Theme Editor
