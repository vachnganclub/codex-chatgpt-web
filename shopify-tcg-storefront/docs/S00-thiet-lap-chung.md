# S00 — Thiết lập chung & cấu hình cửa hàng

Không có trang riêng. Đây là nền móng: tag, metafield, collection và Markets. Làm sai ở đây thì
S06 và S10 không chạy được.

---

## a. Mục tiêu

1. Đưa 18 sản phẩm sealed hiện có vào đúng quy ước tag mà theme đã định nghĩa, để collection tự
   động và filter hoạt động.
2. Tạo đủ 4 collection mà theme đang trỏ tới: `pokemon`, `one-piece`, `single-cards`, `bulk-packs`.
3. Khai báo 6 metafield mà `main-product.liquid` đang đọc.
4. Cấu hình Shopify Markets cho USD / EUR / SGD để bộ chọn quốc gia hiện ra và giá đổi theo khu vực.
5. Xác nhận Shopify Payments đã kích hoạt và chạy được 1 đơn thử.
6. Dọn các điểm lệch trong cấu hình store: múi giờ, email, sản phẩm trùng, tồn kho tạm.

---

## b. Các bước thực hiện

### B1. Dọn cấu hình store — Settings

| # | Thao tác | Đường dẫn trong Admin | Hiện tại | Đích |
|---|---|---|---|---|
| 1 | Sửa múi giờ | Settings → General → Store defaults → Timezone | `Asia/Bangkok` | **[CẦN QUYẾT]** Nếu đội vận hành ở Việt Nam thì giữ Bangkok và chấp nhận mốc giờ đơn hàng theo VN. Nếu báo cáo tính theo giờ Mỹ thì đổi sang `America/Chicago` cho khớp địa chỉ Harrisonville |
| 2 | Kiểm tra địa chỉ doanh nghiệp | Settings → General → Store details | Harrisonville, US | Xác nhận đây là pháp nhân xuất hoá đơn |
| 3 | Đổi email store sang domain | Settings → General → Store details → Store contact email | `ductrananh265@gmail.com` | **[ĐỀ XUẤT]** `hello@adamantile.com` — Gmail cá nhân làm email người gửi dễ bị vào spam |
| 4 | Xác thực email người gửi | Settings → Notifications → Sender email → Authenticate | Chưa rõ | Trạng thái "Authenticated" (cần thêm bản ghi SPF/DKIM ở nhà cung cấp domain) |
| 5 | Giữ nguyên định dạng tiền | Settings → General → Store currency → Change formatting | `${{amount}}` và `${{amount}} USD` | **Không sửa.** Theme bật `show_currency_code: true` nên dùng `money_with_currency`, ra `$48.00 USD`. Nếu tắt setting đó thì USD và SGD sẽ đều hiện `$` và khách nhầm giá |
| 6 | Xoá sản phẩm trùng | Products → tìm "MEGA Dream ex" | Tồn tại 2 bản: handle `...-box` và `...-box-1` | Xoá 1 bản. Giữ bản có handle không có đuôi `-1` |
| 7 | Nhập tồn kho thật | Products → Inventory | Cả 18 SP sealed đều đúng 10 | **[CẦN CUNG CẤP]** số tồn thật từng SKU |

### B2. Chốt quy ước tag — **[ĐÃ XÁC ĐỊNH theo theme]**

Theme đọc tag qua `snippets/product-meta.liquid`, với tiền tố lấy từ Theme settings. Đây không
phải quy ước tự đặt mà là hợp đồng đã có trong code:

| Nhóm | Tag | Theme đọc ở đâu | Dùng để |
|---|---|---|---|
| Dòng game | `pokemon` · `one-piece` | `product-meta` output `line` | Màu nhãn Pokémon / One Piece, class `card--pokemon` |
| Đơn vị bán | `unit:card` · `unit:pack` | `product-meta` output `units`, tiền tố từ `unit_tag_prefix` | Nhãn đơn vị trên product card và dòng `/ card` cạnh giá |
| Hạng hiếm | `rarity:<giá-trị>` | `product-meta` output `rarity`, tiền tố từ `rarity_tag_prefix` | Badge hạng hiếm, và filter ở collection |

Chi tiết cần nhớ:

- `product-meta` ưu tiên **variant option** tên `Purchase type` trước, chỉ fallback sang tag
  `unit:*` khi sản phẩm không có option đó. Nên với sản phẩm có variant card/pack thật thì tag
  `unit:*` chỉ còn dùng cho filter.
- Với `line`, theme nhận **cả hai dạng**: `pokemon` và `game:pokemon` (vì nó so sánh bằng
  `| handle`, mà `game:pokemon` → `game-pokemon`). 16 sản phẩm demo đang dùng dạng ngắn
  `pokemon`. **[ĐỀ XUẤT]** giữ dạng ngắn cho khỏi phải sửa 16 sản phẩm, vì theme hỗ trợ sẵn.
- `rarity:` nhận giá trị gạch nối, theme tự đổi `-` thành khoảng trắng và viết hoa chữ đầu:
  `rarity:secret-rare` → hiện ra `Secret rare`.
- Giá trị `rarity` đang dùng trong store: `common`, `uncommon`, `rare`, `super-rare`,
  `holo-rare`, `ultra-rare`, `secret-rare`, `leader`.

**[ĐỀ XUẤT] bổ sung cho hàng sealed.** 18 sản phẩm thật là booster box và deck — không phải lá
lẻ, cũng không phải pack lẻ theo hạng hiếm. Spec gốc chỉ có `card` và `pack`. Hai lựa chọn:

| Phương án | Tag | Hệ quả |
|---|---|---|
| **A (khuyến nghị)** | `unit:sealed` | Nhãn hiện chữ "sealed", phân biệt rõ với pack lẻ. Theme không cần sửa code — nó in thẳng phần sau `unit:` |
| B | `unit:pack` | Gộp chung với bulk pack. Khách lọc "pack" sẽ thấy lẫn booster box với pack 100 lá common |

**[CẦN QUYẾT]** Chọn A hay B trước khi gắn tag, vì đổi sau phải sửa cả filter và collection.

Tag cần gắn cho 18 sản phẩm sealed (hiện đang trống hoàn toàn):

```
13 SP Pokémon:    pokemon, unit:sealed
 5 SP One Piece:   one-piece, unit:sealed
```

Cách gắn nhanh: Products → chọn ô tick ở đầu danh sách → **Bulk edit** → thêm cột Tags, hoặc
Products → chọn nhiều → **Add tags**.

### B3. Khai báo metafield — Settings → Custom data → Products

`main-product.liquid` đọc 6 metafield trong namespace `custom`. Chưa khai báo thì khối "Thông số"
trên trang sản phẩm bỏ trống.

| # | Namespace.key | Name hiển thị | Type | Bắt buộc cho |
|---|---|---|---|---|
| 1 | `custom.rarity` | Rarity | Single line text | Hàng lẻ và bulk pack (ưu tiên hơn tag `rarity:`) |
| 2 | `custom.set_name` | Set | Single line text | Hàng lẻ, hàng sealed |
| 3 | `custom.card_number` | Card number | Single line text | Chỉ hàng lẻ |
| 4 | `custom.condition` | Condition | Single line text | Chỉ hàng lẻ (NM / LP / MP / HP) |
| 5 | `custom.language` | Language | Single line text | Tất cả (Japanese / English / Chinese…) |
| 6 | `custom.pack_contents` | Pack contents | Single line text | Chỉ pack và sealed, ví dụ "30 booster packs × 5 cards" |

Khi tạo: Add definition → điền Name → Namespace and key điền đúng `custom` và key ở trên →
chọn type → Save. **Key phải khớp từng ký tự**, theme không có fallback.

### B4. Collection — Products → Collections

`sections/header.liquid` ghi rõ menu nên trỏ tới `/collections/single-cards` và
`/collections/bulk-packs`. Cả hai **chưa tồn tại**.

| # | Handle | Tiêu đề | Loại | Điều kiện |
|---|---|---|---|---|
| 1 | `pokemon` | Pokémon | **Chuyển từ thủ công sang Automated** | Product tag is equal to `pokemon` |
| 2 | `one-piece` | One Piece | **Chuyển từ thủ công sang Automated** | Product tag is equal to `one-piece` |
| 3 | `single-cards` | Single cards | Automated (tạo mới) | Product tag is equal to `unit:card` |
| 4 | `bulk-packs` | Bulk packs | Automated (tạo mới) | Product tag is equal to `unit:pack` |

Các bước cho từng collection:

1. Products → Collections → chọn collection (hoặc **Create collection**).
2. Phần **Collection type** chọn **Smart / Automated**.
3. **Conditions**: Product tag → is equal to → điền tag.
4. **Sort**: đổi từ `Best selling` sang **Newest** — store chưa có đơn nào nên Best selling
   không có dữ liệu để xếp.
5. Kiểm tra **Handle** ở mục Search engine listing đúng như bảng trên.
6. Ảnh collection: **[CẦN CUNG CẤP]** 1600 × 1000, ≤ 300 KB.

> ⚠️ Chuyển `pokemon` và `one-piece` sang Automated **chỉ an toàn sau khi đã gắn tag ở B2**.
> Làm ngược lại thì collection sẽ rỗng và trang chủ mất sản phẩm.

Sau khi chuyển, 16 sản phẩm demo sẽ tự vào collection vì đã có tag `pokemon` / `one-piece`.
**[CẦN QUYẾT]** 16 sản phẩm demo đó để lại làm mẫu, hay đổi status sang Draft / xoá trước khi
go-live? Chúng có tag `demo` nên dễ lọc: Products → filter Tagged with `demo` → Bulk edit.

### B5. Shopify Markets — Settings → Markets

Hiện có **đúng 1 market**: tên "Việt Nam", handle `vn`, `currencySettings = null`. Vì snippet
`localization-form.liquid` chỉ render khi có **hơn 1** quốc gia khả dụng, bộ chọn quốc gia đang
**không hiện ra** trên storefront.

1. Mở Settings → Markets. Ghi lại market nào đang là **Primary**.
   **[CẦN QUYẾT]** Tiền tệ store là USD nhưng primary market là Việt Nam — lệch nhau. Nếu bán chủ
   yếu cho Mỹ thì primary market nên là United States.
2. **Add market** → United States → currency USD.
3. **Add market** → gom Châu Âu vào một market: Austria, Belgium, Czechia, Denmark, Finland,
   France, Germany, Ireland, Italy, Netherlands, Norway, Poland, Portugal, Spain, Sweden,
   Switzerland → currency **EUR**.
   *Lưu ý Norway và Switzerland không dùng EUR; nếu muốn đúng tiền tệ bản địa thì tách riêng,
   hoặc chấp nhận hiển thị EUR cho cả nhóm.* **[CẦN QUYẾT]**
4. **Add market** → Singapore → currency SGD.
5. **[CẦN QUYẾT]** United Kingdom / GBP: spec ghi "nếu khách xác nhận thị trường Anh".
   Shipping zone đã có GB nên bật được ngay khi khách đồng ý.
6. Với từng market: **Products and pricing** → bật **Price rounding** → chọn
   **Round to nearest .99**.
7. Với từng market: kiểm tra **Status = Active** và **Domains / languages** trỏ về
   `adamantile.com` (dùng country selector, không cần subdomain riêng).

**Giới hạn nền tảng [ĐÃ XÁC ĐỊNH]:**

- Store đang ở plan **Basic**. Số market tối đa phụ thuộc plan. **Đếm trực tiếp trong Settings →
  Markets trước khi hứa cả 4 thị trường** — nếu Shopify chặn khi thêm market thứ n, nó sẽ hiện
  màn hình nâng plan. Đừng cam kết với khách trước khi thử.
- Giá tự quy đổi theo khu vực **chỉ hoạt động với Shopify Payments**. Dùng cổng thanh toán ngoài
  thì khách vẫn bị tính bằng USD.
- Tỉ giá do Shopify lấy theo thị trường, **không sửa tay được**. Chỉ điều chỉnh được qua
  price adjustment (%) và price rounding.

### B6. Shopify Payments — Settings → Payments

| # | Kiểm tra | Đích |
|---|---|---|
| 1 | Shopify Payments đang Active | Không còn nút "Complete account setup" |
| 2 | Thông tin pháp nhân | Khớp địa chỉ ở Settings → General |
| 3 | Tài khoản nhận tiền | Có ít nhất 1 payout account hợp lệ |
| 4 | Phương thức đang bật | Visa, Mastercard, Amex; Shop Pay / Apple Pay / Google Pay nếu muốn (theme đã bật `show_dynamic_checkout`) |
| 5 | Chạy đơn thử | Bật **Test mode** (Bogus Gateway) → đặt 1 đơn → kiểm tra có trang xác nhận và email → **tắt Test mode** |

Store hiện có **0 đơn hàng**, nên bước 5 là bắt buộc, không phải tuỳ chọn.

### B7. Theme — dọn bớt

Đang có 5 theme: `tcg-vault-theme-3` (MAIN), `tcg-vault-theme`, `vault-theme`, `Horizon`,
`Tinker`. **[ĐỀ XUẤT]** giữ MAIN + 1 bản backup, xoá 3 bản còn lại để khỏi sửa nhầm theme.

---

## c. Dữ liệu đầu vào cần có

| # | Mục | Trạng thái |
|---|---|---|
| 1 | Quyết định `unit:sealed` hay `unit:pack` cho 18 SP booster box | **[CẦN QUYẾT]** |
| 2 | Quyết định primary market (Việt Nam hay United States) | **[CẦN QUYẾT]** |
| 3 | Quyết định có mở thị trường Anh / GBP | **[CẦN QUYẾT]** |
| 4 | Quyết định Norway + Switzerland gộp vào EUR hay tách riêng | **[CẦN QUYẾT]** |
| 5 | Quyết định xử lý 16 sản phẩm demo (giữ / Draft / xoá) | **[CẦN QUYẾT]** |
| 6 | Quyết định múi giờ (Bangkok hay Chicago) | **[CẦN QUYẾT]** |
| 7 | Tồn kho thật của 18 SP sealed | **[CẦN CUNG CẤP]** |
| 8 | Email theo domain để làm sender email | **[CẦN CUNG CẤP]** |
| 9 | Ảnh collection cho 4 collection, 1600 × 1000 | **[CẦN CUNG CẤP]** |
| 10 | Bảng phí + thời gian giao cho US, EU, SG (và GB nếu mở) | **[CẦN CUNG CẤP]** |
| 11 | Có đăng ký VAT ở EU / UK chưa; ngưỡng doanh thu | **[CẦN CUNG CẤP]** |
| 12 | Giá niêm yết gồm thuế hay chưa gồm thuế (store đang `taxesIncluded = true`) | **[CẦN CUNG CẤP]** |
| 13 | Có thu thuế trên phí vận chuyển không (đang `taxShipping = false`) | **[CẦN CUNG CẤP]** |

### Câu hỏi về thuế và phí ship cần khách trả lời

1. Pháp nhân đặt ở Mỹ (Harrisonville) nhưng đội vận hành ở Việt Nam — hàng gửi đi **từ nước nào**?
   Nó quyết định thuế nhập khẩu và thời gian giao.
2. Có đăng ký **IOSS** cho EU không? Nếu không, khách EU sẽ bị thu VAT ở cửa khẩu và dễ phát sinh
   khiếu nại.
3. Có đăng ký **VAT UK** không? Ngưỡng £135 cho hàng giá trị thấp áp dụng thế nào với đơn thẻ bài?
4. Singapore có **GST** 9% với hàng nhập khẩu giá trị thấp — đã tính vào giá chưa?
5. Phí ship tính theo **đơn giá cố định** hay theo **trọng lượng**? Hàng lẻ 1 lá và pack 500 lá
   lệch khối lượng rất nhiều.
6. Có ngưỡng **miễn phí ship** không, và tính theo từng market hay chung?

---

## d. Ca kiểm thử

| Mã | Ca kiểm thử | Kết quả mong đợi |
|---|---|---|
| S00-01 | Gắn tag `pokemon` cho 13 SP, mở `/collections/pokemon` | Thấy đủ 13 SP sealed + các SP demo có tag `pokemon` |
| S00-02 | Mở `/collections/single-cards` | Chỉ thấy SP có tag `unit:card`, không có booster box nào |
| S00-03 | Mở `/collections/bulk-packs` | Chỉ thấy SP có tag `unit:pack` |
| S00-04 | Tạo 1 SP mới, gắn tag `one-piece` + `unit:card` | SP tự xuất hiện ở cả `/collections/one-piece` và `/collections/single-cards` trong vài phút, không cần gán tay |
| S00-05 | Gỡ tag `pokemon` khỏi 1 SP | SP tự rời `/collections/pokemon` |
| S00-06 | Điền `custom.rarity = Secret Rare` cho 1 SP, mở trang SP | Khối "Thông số" hiện dòng Rarity: Secret Rare, và badge hạng hiếm hiện trên product card |
| S00-07 | Xoá `custom.rarity`, để lại tag `rarity:secret-rare` | Vẫn hiện `Secret rare` (fallback sang tag hoạt động) |
| S00-08 | Sau khi tạo market US + EU, tải lại trang chủ | Bộ chọn quốc gia **hiện ra** ở header, footer và menu mobile |
| S00-09 | Chọn Germany trong bộ chọn | Trang tải lại, giá hiện EUR, số lẻ kết thúc `.99` |
| S00-10 | Chọn Singapore | Giá hiện SGD kèm mã tiền tệ (`$x.xx SGD`), không trùng hình với USD |
| S00-11 | Đặt 1 đơn ở Test mode | Có trang xác nhận + email xác nhận gửi về đúng hộp thư |
| S00-12 | Tìm "MEGA Dream ex" trong Products | Chỉ còn 1 kết quả |

---

## e. Tiêu chí nghiệm thu

- [ ] 18 sản phẩm sealed đều có tag dòng game và tag đơn vị bán; không còn sản phẩm nào `tags` rỗng
- [ ] Không còn sản phẩm trùng lặp
- [ ] Tồn kho của 18 sản phẩm là số thật, không còn đồng loạt bằng 10
- [ ] 4 collection `pokemon`, `one-piece`, `single-cards`, `bulk-packs` đều tồn tại và đều là Automated
- [ ] Mỗi collection sort theo Newest, có ảnh, có mô tả
- [ ] Không có sản phẩm nào lọt sai collection (Pokémon không xuất hiện trong One Piece và ngược lại)
- [ ] 6 metafield `custom.*` đã khai báo, key khớp đúng, hiện được trên trang sản phẩm
- [ ] Có tối thiểu 3 market Active: US/USD, EU/EUR, SG/SGD (+ GB/GBP nếu khách duyệt)
- [ ] Mỗi market đã bật price rounding `.99`
- [ ] Bộ chọn quốc gia hiện ra trên storefront ở cả desktop và mobile
- [ ] Shopify Payments ở trạng thái Active, có payout account
- [ ] Đã chạy ít nhất 1 đơn thử thành công và đã tắt Test mode
- [ ] Sender email ở trạng thái Authenticated
- [ ] Đã chốt phương án xử lý 16 sản phẩm demo
- [ ] Số theme giảm còn tối đa 2
