# Dựng cửa hàng demo TCG Vault (khoảng 15 phút)

Shopify không cho một file zip theme chứa luôn sản phẩm, page hay menu. Vì vậy bộ demo gồm 3 phần, import theo thứ tự:

| # | File | Import ở đâu | Kết quả |
|---|---|---|---|
| 1 | `tcg-vault-theme.zip` | Online Store → Themes → Add theme → Upload zip file | Giao diện đầy đủ: banner, ảnh thẻ, chữ demo, 3 feedback mẫu |
| 2 | `demo-products.csv` | Products → Import | 16 sản phẩm demo có ảnh (10 thẻ lẻ có 2 lựa chọn card/pack, 6 bulk pack theo hạng hiếm) |
| 3 | `pages/*.html` | Online Store → Pages | Nội dung cho 3 trang Wholesale, Feedback, Privacy |

Mọi sản phẩm demo đều là hàng giả lập với tên và ảnh tự vẽ (không dùng hình nhân vật chính thức), gắn tag `demo` để xóa nhanh.

## Bước 1. Upload theme

1. **Online Store → Themes → Add theme → Upload zip file** → chọn `tcg-vault-theme.zip`.
2. Chưa cần Publish. Bấm **Customize** để xem trước.

## Bước 2. Import sản phẩm demo

1. **Products → Import → Add file** → chọn `demo-products.csv` → **Upload and preview** → **Import products**.
2. Shopify tự tải ảnh từ link GitHub trong file CSV (repo công khai). Chờ email báo import xong.

## Bước 3. Tạo 4 collection tự động

**Products → Collections → Create collection**, chọn **Automated**, điều kiện **Product tag is equal to**:

| Title | Tag điều kiện | Handle (mục Search engine listing) |
|---|---|---|
| Pokémon | `pokemon` | `pokemon` |
| One Piece | `one-piece` | `one-piece` |
| Single cards | `unit:card` | `single-cards` |
| Bulk packs | `unit:pack` | `bulk-packs` |

Trang chủ tự hiện sản phẩm của collection `pokemon` và `one-piece`.

## Bước 4. Tạo 3 page

**Online Store → Pages → Add page**. Ở ô nội dung bấm nút `<>` (Show HTML) rồi dán nội dung file tương ứng. Ở cột phải chọn **Theme template**.

| Title | Dán nội dung từ | Theme template | Handle |
|---|---|---|---|
| Wholesale Inquiry | `pages/wholesale-inquiry.html` | `page.wholesale-inquiry` | `wholesale-inquiry` |
| Customer Feedback | `pages/feedback.html` | `page.feedback` | `feedback` |
| Privacy Policy | `pages/privacy-policy.html` | `page.privacy-policy` | `privacy-policy` |

Footer tự hiện link Wholesale Inquiry, Customer Feedback, Privacy Policy và Cookie Policy khi các page này tồn tại.

## Bước 5. Menu chính

**Online Store → Navigation → Main menu**, xóa mục cũ rồi thêm theo thứ tự:

| Tên mục | Link tới |
|---|---|
| Home | Home page |
| Single cards | Collections → Single cards |
| Bulk packs | Collections → Bulk packs (thêm mục con Wholesale Inquiry nếu muốn) |
| Pokémon | Collections → Pokémon |
| One Piece | Collections → One Piece |
| Cart | Gõ `/cart` |

## Bước 6 (tùy chọn). Bộ lọc

Cài app miễn phí **Search & Discovery** của Shopify → **Filters** → thêm Availability, Price, Product type, Tag. Bộ lọc tự hiện ở trang collection.

## Bước 7. Xem và Publish

**Online Store → Themes → TCG Vault → Customize** để xem trên desktop và mobile. Khi ưng ý thì bấm **Publish**.

## Khi chuyển từ demo sang bán thật

1. **Products**, lọc theo tag `demo` → chọn tất cả → **Delete products**.
2. **Customize → Home**: chọn ảnh thật cho Image banner và 4 Link cards (khi có ảnh thật thì ảnh demo tự ẩn), sửa chữ banner và About us.
3. **Customize → Header**: xóa chữ ở Announcement bar (đang ghi "Demo store").
4. **Customize → Pages → feedback**: xóa 3 block "Sample review", thêm feedback thật.
5. Thay toàn bộ nội dung trang Privacy Policy và Cookie Policy bằng văn bản đã được duyệt.
6. Import sản phẩm thật bằng `product-import-template.csv`.
