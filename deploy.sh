#!/bin/bash
# Đưa app Phân Bổ Chi Phí lên mạng (Vercel production) — CÓ KIỂM TRA AN TOÀN TRƯỚC.
# Cách dùng:  ./deploy.sh
set -e
cd "$(dirname "$0")"

echo "1/3 Kiểm tra cú pháp app_v10.js..."
node --check app_v10.js

echo "2/3 Kiểm tra thẻ <script> trong index.html..."
OPEN=$(grep -o '<script' index.html | wc -l | tr -d ' ')
CLOSE=$(grep -o '</script>' index.html | wc -l | tr -d ' ')
if [ "$OPEN" -ne "$CLOSE" ]; then
    echo "❌ DỪNG: index.html có $OPEN thẻ mở <script> nhưng chỉ có $CLOSE thẻ đóng </script>."
    echo "   (Đây chính là lỗi từng làm website trắng dữ liệu ngày 3/7/2026 — hãy thêm thẻ đóng còn thiếu.)"
    exit 1
fi

echo "3/3 Kiểm tra OK ✅ — bắt đầu đưa lên Vercel..."
vercel deploy --prod --yes
echo "🎉 Xong! Website: https://cost-allocation-app.vercel.app/"
