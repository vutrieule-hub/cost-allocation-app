# Phần Mềm Phân Bổ Chi Phí & Dashboard P&L Xanh Tuệ Đức

Đây là ứng dụng phần mềm độc lập (Standalone Web Application) được phát triển riêng cho trường **Xanh Tuệ Đức** để quản trị tài chính, tối ưu hóa quỹ lương, mặt bằng và tự động tính toán báo cáo lợi nhuận P&L của từng khối (Tiểu học, THCS, THPT, Nội trú) dựa trên các phương pháp phân bổ chi phí (Cost Allocation) tiên tiến.

---

## 🚀 Hướng Dẫn Mở Phần Mềm Trên Máy Mac

Ứng dụng chạy trực tiếp trên trình duyệt Web (Safari, Google Chrome, Firefox) của anh mà không cần cài đặt bất kỳ cơ sở dữ liệu hay máy chủ phức tạp nào.

1.  Mở Finder trên máy Mac.
2.  Truy cập thư mục `Cost_Allocation_App`.
3.  **Click đúp chuột** vào file `index.html` để chạy phần mềm ngay lập tức!
4.  *(Tùy chọn)* Anh có thể lưu địa chỉ file này vào thanh dấu trang (Bookmarks) của trình duyệt để truy cập nhanh lần sau.

---

## ⚙️ Các Phân Hệ Quản Trị Của Phần Mềm

### 1. Dashboard & Bảng P&L
*   **KPIs Tổng Hợp:** Hiển thị tổng quỹ lương, tổng tiền mặt bằng, số lượng nhân sự và số khối doanh thu trực tiếp.
*   **Báo Cáo P&L Động:** Tự động tính toán Doanh thu, Chi phí trực tiếp, Chi phí gián tiếp phân bổ và **Lợi nhuận thuần** cho từng khối.
*   **Audit Trail (Tra Cứu Chi Tiết):** Click vào bất kỳ số tiền chi phí phân bổ nào (màu xanh lá cây), phần mềm sẽ hiển thị pop-up giải trình công thức toán học chi tiết.
*   **Biểu Đồ Trực Quan:** Biểu đồ so sánh tương quan Doanh thu vs Chi phí thực tế giữa các khối sử dụng thư viện Chart.js.

### 2. Quản Lý Phòng Ban (Departments)
*   Thêm mới các phòng ban gián tiếp hoặc khối trực tiếp.
*   Chọn **Cost Driver (Tiêu chí phân bổ)** tương ứng cho từng phòng ban gián tiếp (Sĩ số, m2, số nhân viên, số suất ăn, tỷ lệ học sinh mới tuyển, doanh thu).
*   Nhập liệu **Doanh thu thực tế hàng tháng** cho các khối trực tiếp ngay tại đây.

### 3. Nhân Sự & Quỹ Lương (Staff & Payroll)
*   Thêm mới nhân sự, gán bộ phận và nhập lương.
*   **Giáo viên Đa cấp học (Multi-level Teachers):** Tích chọn ô dạy chéo và điền tỷ lệ % phân bổ dạy học (ví dụ: Dạy Tiểu học 50%, THCS 50%). Hệ thống sẽ tự động bóc tách và phân chia quỹ lương giáo viên này về các khối tương ứng.

### 4. Cơ Sở Vật Chất & Tiền Thuê Mặt Bằng (Facilities)
*   Quản lý danh sách 31 hạng mục mặt bằng (Lớp học, thư viện, sân bóng, nhà đa năng, bếp ăn...) với tổng tiền thuê **230M VNĐ/tháng**.
*   Thiết lập tỷ lệ phòng ban sử dụng mặt bằng động. Hỗ trợ chia phòng ban đơn khối (lớp học 100% THPT) và phòng ban đa khối (thư viện chia đều 3 khối, phòng hành chính chia cho HCKT/Truyền thông).

### 5. Chỉ Số Phân Bổ Tháng (Monthly Drivers)
*   Nhập các chỉ số thực tế thu được trong tháng (Sĩ số học sinh bán trú, diện tích sử dụng phòng học thực tế, số suất ăn, số học sinh mới tuyển). Hệ thống sẽ tự động tính toán làm cơ sở phân chia chi phí.

---

## 💾 Lưu Trữ & Sao Lưu An Toàn (Data Security)

*   **Tự Động Lưu (Auto-Save):** Dữ liệu được mã hóa và tự động lưu vào bộ nhớ cục bộ `localStorage` của trình duyệt trên máy Mac của anh. Khi anh tắt máy hoặc reload trang, toàn bộ danh sách phòng ban, nhân viên và số liệu anh nhập vẫn được giữ nguyên.
*   **Xuất File JSON (Backup):** Bấm nút **"Backup Dữ liệu (JSON)"** ở chân Sidebar để tải file sao lưu về máy. Anh có thể cất file này hoặc gửi cho người khác.
*   **Nhập File JSON (Restore):** Bấm nút **"Restore Dữ liệu"** để tải file sao lưu JSON lên phần mềm.
*   **Khôi Phục Mẫu Gốc (Reset):** Bấm nút **"Khôi phục mẫu gốc"** để xóa toàn bộ dữ liệu hiện tại và nạp lại cấu trúc dữ liệu mẫu chuẩn của Xanh Tuệ Đức ban đầu.

---

Chúc anh có những trải nghiệm tuyệt vời cùng phần mềm quản trị tài chính thông minh của trường Xanh Tuệ Đức!

# Updated deployment trigger

# Deploy trigger post activation
