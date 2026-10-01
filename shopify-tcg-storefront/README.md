# Giao diện Shopify — cửa hàng thẻ bài Pokémon & One Piece

Bản thiết kế giao diện (prototype chạy được) cho store Shopify bán thẻ bài, theo tài liệu
`shopify_tcg_master_prompt_full.md`. Dùng để **duyệt bố cục và luồng mua hàng trước khi
dựng thật trong Theme Editor**.

## Mở bản thiết kế

| Cách | Thao tác |
|---|---|
| Trên web | Mở link Artifact đã publish (xem phần cuối cuộc hội thoại) |
| Trên máy | `python3 -m http.server` trong thư mục này rồi mở `http://localhost:8000/index.html` |

`index.html` được viết theo khung của Claude Artifacts (không có `<!doctype>`, `<html>`, `<body>`
— phần đó do nền tảng bọc khi publish). Mở trực tiếp bằng `file://` vẫn chạy nhưng trình duyệt
vào quirks mode; dùng một HTTP server tĩnh cho đúng.

## Thanh điều khiển (chỉ có trên prototype, không có trên store thật)

| Nút | Tác dụng |
|---|---|
| **Chú thích S00–S11** | Hiện nhãn tím trên từng khối: khối đó thuộc hạng mục nào, map sang theme section nào |
| **Xem mobile** | Ép bố cục về bề rộng điện thoại để kiểm tra menu thu gọn và lưới sản phẩm |
| **Nền tối** | Đổi giữa nền sáng / nền tối |
| **Xoá giỏ** | Reset giỏ hàng đang lưu trong localStorage |

## Các trang

| Mã | Trang trong prototype | Đường dẫn Shopify thật |
|---|---|---|
| S01 | `#home` | `/` |
| S10 | `#pokemon`, `#one-piece` | `/collections/pokemon`, `/collections/one-piece` |
| S10 | `#singles`, `#bulk` | `/collections/singles`, `/collections/bulk` |
| S06 | `#p-<id>` (ví dụ `#p-pk-sar`) | `/products/<handle>` |
| S07 | `#cart` | `/cart` |
| S08 | `#checkout` | Trang Checkout của Shopify (chỉ xem trước branding) |
| S04 | `#wholesale` | `/pages/wholesale-inquiry` |
| S05 | `#privacy` | `/pages/privacy-policy` |
| S11 | `#feedback` | `/pages/feedback` |
| S09 | Header + footer + bộ chọn quốc gia | Mọi trang |
| S00 | `#spec` | Không có trang riêng — đây là bảng giao việc nội bộ |

## Những gì prototype chứng minh được

- **Đổi tiền tệ xuyên trang.** Chọn quốc gia ở header: giá đổi đồng thời ở Home, Collection,
  Product, Cart và bản xem trước Checkout. Quy đổi theo tỉ giá mẫu rồi làm tròn `.99` giống
  tuỳ chọn *Round to nearest .99* của Shopify Markets. SGD hiển thị `S$` để không lẫn với USD.
- **Giỏ trộn card + pack.** Mỗi dòng giữ đúng đơn vị tính riêng, sửa số lượng là tính lại ngay,
  đặt số lượng 0 thì xoá dòng, giỏ rỗng có trạng thái riêng.
- **Variant card / pack.** Mỗi variant có giá, SKU, số lá mỗi pack và tồn kho riêng; variant hết
  hàng bị vô hiệu hoá chứ không bị ẩn.
- **Bộ lọc collection.** Lọc theo hình thức bán, dòng game, hạng hiếm, còn hàng; sắp xếp theo giá
  và hàng mới — tất cả bằng tính năng Search & Discovery có sẵn, không cần app ngoài.
- **Validation form Wholesale.** Chặn từng trường thiếu, thông báo lỗi tiếng Anh, trường
  *Account ID* chỉ bắt buộc khi kênh liên hệ khác *Email only*.

## Dữ liệu trong bản thiết kế là CHỖ TRỐNG

Theo nguyên tắc số 1 của tài liệu, không có dữ liệu thật nào được tự tạo:

- Tên lá bài là `[tên lá bài]`. Set, số thứ tự, hạng hiếm và tình trạng dùng quy ước thật của
  Pokémon TCG / One Piece Card Game để thấy đúng cấu trúc dữ liệu cần nhập.
- Giá là số mẫu để kiểm tra luồng tính tiền, **không phải giá bán**.
- Feedback, nội dung pháp lý, link mạng xã hội, phí ship: để trống, đánh dấu `[...]`.
- Tên cửa hàng tạm dùng `ADAMANTILE` — tên store đang kết nối trên tài khoản. Đổi ở 3 chỗ
  trong `index.html` nếu khách muốn tên khác.

Danh sách đầy đủ những gì còn thiếu nằm ở trang `#spec` → **Cần khách hàng cung cấp**.

## Lưu ý về nền tảng trước khi dựng thật

- Store đang ở plan **Basic**, tiền tệ gốc **USD**. Số market tối đa phụ thuộc plan — vào
  Settings → Markets đếm trước khi hứa cả 4 thị trường US / EU / SG / GB.
- Đa tiền tệ chỉ hoạt động khi **Shopify Payments** đã kích hoạt cho pháp nhân.
- Checkout trên Basic chỉ sửa được logo, màu, kiểu nút. Thêm trường hay đổi thứ tự bước cần
  Shopify Plus.
- Thiếu Shipping zone cho một nước là khách nước đó không checkout được dù sản phẩm vẫn hiện.

## Trạng thái store thật

Bản thiết kế này **chưa thay đổi gì** trên store `adamantile.com`: không tạo product,
collection, page, market hay theme nào. Mọi thứ ở đây là file tĩnh.
