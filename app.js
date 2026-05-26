/* ==========================================================================
   UPDATED STATE & DYNAMIC ALLOCATION ENGINE: XANH TUỆ ĐỨC
   ========================================================================== */

const STORAGE_KEY = "XTD_COST_ALLOCATION_STATE_V2";

// Advanced Dynamic Default Template representing both sheets
const DEFAULT_TEMPLATE = {
    "departments": [
        {
            "id": "dept_tieuhoc",
            "name": "Khối Tiểu học",
            "type": "revenue",
            "students": 45
        },
        {
            "id": "dept_thcs",
            "name": "Khối THCS",
            "type": "revenue",
            "students": 55
        },
        {
            "id": "dept_thpt",
            "name": "Khối THPT",
            "type": "revenue",
            "students": 147
        },
        {
            "id": "dept_noitru",
            "name": "Ban Nội trú",
            "type": "revenue",
            "students": 42
        },
        {
            "id": "dept_bdh",
            "name": "Ban Điều hành (BĐH)",
            "type": "support",
            "driver": "custom_percent",
            "note": "Trong giai đoạn này: \nBan Điều Hành tập trung vào phát triển cấp 1 và cấp 2 nên phân bổ chi phí của BĐH vào 2 khối này nhiều hơn\nNội trú được coi là dịch vụ kèm, không phải dịch vụ chính, vì vậy nhận phân bổ chi phí ít hơn \n\n"
        },
        {
            "id": "dept_bgh",
            "name": "Ban Giám hiệu (BGH)",
            "type": "support",
            "driver": "student_count",
            "note": "Tiểu học có cô Hiền BGH tập trung\nTHCS có cô Hiền BGH làm kiêm nhiệm \nTHPT có thầy Phan BGH tập trung"
        },
        {
            "id": "dept_hckt",
            "name": "Hành chính Kế toán (HCKT)",
            "type": "support",
            "driver": "staff_count",
            "note": "",
            "allocationMethod": "student"
        },
        {
            "id": "dept_tuyensinh",
            "name": "Tuyển sinh",
            "type": "support",
            "driver": "new_students",
            "note": "Ghi nhận nguồn lực thực tế nhìn nhận của bộ phận tuyển sinh giành cho từng khối\nTHPT chủ động tự tuyển sinh nhiều hơn\nNội trú chủ yếu PH phát sinh nhu cầu tìm đến"
        },
        {
            "id": "dept_truyenthong",
            "name": "Truyền thông",
            "type": "support",
            "driver": "new_students"
        },
        {
            "id": "dept_tongvu",
            "name": "Tổng vụ",
            "type": "support",
            "driver": "area_m2",
            "allocationMethod": "student"
        },
        {
            "id": "dept_bep",
            "name": "Bếp ăn",
            "type": "support",
            "driver": "meals",
            "allocationMethod": "manual",
            "note": "Phân bổ đều cho các bộ phận. \nNội trú sử dụng riêng biệt bếp ăn buổi tối\nTHPT chưa sử dụng bếp, do lượng học sinh bán trú chưa nhiều, nhưng nhà trường cung cấp dịch vụ này và THPT cần hướng đến việc tuyển sinh hệ xanh, vì vậy sẽ vẫn phải ghi nhận chi phí phân bổ này"
        },
        {
            "id": "dept_anninh",
            "name": "An ninh",
            "type": "support",
            "driver": "area_m2",
            "allocationMethod": "student"
        },
        {
            "id": "dept_sachdep",
            "name": "Sạch đẹp",
            "type": "support",
            "driver": "area_m2",
            "note": "THPT đông học sinh, và ý thức kém nhất, vì vậy chịu phân bổ nhiều nhất\nTHCS và Tiểu học chịu phân bổ ít hơn do số lượng học sinh ít hơn và cũng đã có ý thức giữ gìn hơn\nNội trú tự dọn dẹp phòng ốc và phòng vệ sinh, nên phân bổ chi phí xanh sạch ít hơn các bộ phận khác, chủ yếu phân bổ chi phí đổ rác và dọn dẹp cảnh quan chung của sân trường\n"
        },
        {
            "id": "dept_dien",
            "name": "Chi phí Điện",
            "type": "support",
            "isUtility": true
        },
        {
            "id": "dept_nuoc",
            "name": "Chi phí Nước",
            "type": "support",
            "isUtility": true
        },
        {
            "id": "dept_1779722697629",
            "name": "Văn Hóa",
            "type": "support",
            "allocationMethod": "manual",
            "note": ""
        },
        {
            "id": "dept_1779781275635",
            "name": "Xe bus",
            "type": "support"
        },
        {
            "id": "dept_1779782090457",
            "name": "Kỹ năng - Sự kiện",
            "type": "support",
            "note": "THPT được tổ chức ít chương trình hơn vì không có hệ xanh\nTiểu học và THCS hệ xanh được tập trung tổ chức nhiều sự kiện hơn vì vậy sẽ chịu chi phí phân bổ nhiều hơn\nNội trú tự tổ chức do thầy cô nội trú nên không chịu phân bổ của tổ này"
        },
        {
            "id": "dept_1779782898139",
            "name": "Kỷ luật",
            "type": "support",
            "note": "Kỷ luật chưa làm tốt cho khối THPT nên chỉ phân bổ TH và THCS là chính\nThầy cô nội trú tự quản lý kỷ luật học sinh nên không chịu phân bổ",
            "allocationMethod": "manual"
        }
    ],
    "rentBlocks": [
        {
            "id": "blk_hieubo",
            "name": "Nhà Hiệu Bộ",
            "totalRent": 39100000
        },
        {
            "id": "blk_10phong",
            "name": "Khu 10 phòng",
            "totalRent": 39100000
        },
        {
            "id": "blk_8phong",
            "name": "Khu 8 phòng (Dãy Tiểu học)",
            "totalRent": 32200000
        },
        {
            "id": "blk_toamoi_l",
            "name": "Khu toà mới L (8 phòng - Dãy THCS)",
            "totalRent": 32200000
        },
        {
            "id": "blk_toai",
            "name": "Khu toà i (4 phòng - Dãy THPT)",
            "totalRent": 23000000
        },
        {
            "id": "blk_sanbong",
            "name": "Sân Bóng đá",
            "totalRent": 11500000
        },
        {
            "id": "blk_westpoint",
            "name": "Khu Westpoint cao + đất",
            "totalRent": 11500000
        },
        {
            "id": "blk_bepan",
            "name": "Khu Bếp Ăn & Nhà ăn",
            "totalRent": 11500000
        },
        {
            "id": "blk_danang",
            "name": "Nhà Đa năng",
            "totalRent": 23000000
        }
    ],
    "rooms": [
        {
            "id": "rm_hieubo_1",
            "name": "Thư viện (T1)",
            "blockId": "blk_hieubo",
            "type": "functional",
            "status": "active",
            "capacity": 50,
            "currentStudents": 0,
            "splits": {
                "dept_tieuhoc": 33.3,
                "dept_thcs": 33.3,
                "dept_thpt": 33.4
            }
        },
        {
            "id": "rm_hieubo_2",
            "name": "Phòng Hành chính (T1)",
            "blockId": "blk_hieubo",
            "type": "functional",
            "status": "active",
            "capacity": 15,
            "currentStudents": 0,
            "splits": {
                "dept_hckt": 50,
                "dept_truyenthong": 30,
                "dept_tongvu": 20
            }
        },
        {
            "id": "rm_hieubo_3",
            "name": "Văn phòng chuyên môn THPT (T1)",
            "blockId": "blk_hieubo",
            "type": "functional",
            "status": "active",
            "capacity": 10,
            "currentStudents": 0,
            "splits": {
                "dept_thpt": 100
            }
        },
        {
            "id": "rm_hieubo_4",
            "name": "Phòng Tĩnh Tâm (T2)",
            "blockId": "blk_hieubo",
            "type": "functional",
            "status": "active",
            "capacity": 40,
            "currentStudents": 0,
            "splits": {
                "dept_tieuhoc": 33.3,
                "dept_thcs": 33.3,
                "dept_thpt": 33.4
            }
        },
        {
            "id": "rm_hieubo_5",
            "name": "Phòng nghỉ trưa thầy cô (T2)",
            "blockId": "blk_hieubo",
            "type": "functional",
            "status": "active",
            "capacity": 20,
            "currentStudents": 0,
            "splits": {
                "dept_tieuhoc": 40,
                "dept_thcs": 40,
                "dept_thpt": 20
            }
        },
        {
            "id": "rm_hieubo_6",
            "name": "Phòng Kho (T2)",
            "blockId": "blk_hieubo",
            "type": "functional",
            "status": "active",
            "capacity": 0,
            "currentStudents": 0,
            "splits": {
                "dept_tieuhoc": 50,
                "dept_thcs": 50
            }
        },
        {
            "id": "rm_hieubo_7",
            "name": "Phòng Tuyển sinh (T2)",
            "blockId": "blk_hieubo",
            "type": "functional",
            "status": "active",
            "capacity": 10,
            "currentStudents": 0,
            "splits": {
                "dept_tuyensinh": 100
            }
        },
        {
            "id": "rm_tieuhoc_1",
            "name": "Lớp 1 (Phòng học hệ xanh)",
            "blockId": "blk_8phong",
            "type": "classroom",
            "status": "active",
            "capacity": 22,
            "currentStudents": 6,
            "splits": {
                "dept_tieuhoc": 100
            }
        },
        {
            "id": "rm_tieuhoc_2",
            "name": "Lớp 2 (Phòng học hệ xanh)",
            "blockId": "blk_8phong",
            "type": "classroom",
            "status": "active",
            "capacity": 22,
            "currentStudents": 5,
            "splits": {
                "dept_tieuhoc": 100
            }
        },
        {
            "id": "rm_tieuhoc_3",
            "name": "Lớp 3 (Phòng học hệ xanh)",
            "blockId": "blk_8phong",
            "type": "classroom",
            "status": "active",
            "capacity": 22,
            "currentStudents": 11,
            "splits": {
                "dept_tieuhoc": 100
            }
        },
        {
            "id": "rm_tieuhoc_4",
            "name": "Lớp 4 (Phòng học hệ xanh)",
            "blockId": "blk_8phong",
            "type": "classroom",
            "status": "active",
            "capacity": 22,
            "currentStudents": 6,
            "splits": {
                "dept_tieuhoc": 100
            }
        },
        {
            "id": "rm_tieuhoc_5",
            "name": "Lớp 5 (Phòng học hệ xanh)",
            "blockId": "blk_8phong",
            "type": "classroom",
            "status": "active",
            "capacity": 22,
            "currentStudents": 17,
            "splits": {
                "dept_tieuhoc": 100
            }
        },
        {
            "id": "rm_tieuhoc_6",
            "name": "Phòng Tiểu học chưa sử dụng",
            "blockId": "blk_8phong",
            "type": "classroom",
            "status": "empty",
            "capacity": 22,
            "currentStudents": 0,
            "splits": {
                "dept_tieuhoc": 100
            }
        },
        {
            "id": "rm_tieuhoc_7",
            "name": "Phòng Sáng tạo",
            "blockId": "blk_8phong",
            "type": "functional",
            "status": "active",
            "capacity": 30,
            "currentStudents": 0,
            "splits": {
                "dept_tieuhoc": 100
            }
        },
        {
            "id": "rm_tieuhoc_8",
            "name": "Phòng Chuyên môn TH",
            "blockId": "blk_8phong",
            "type": "functional",
            "status": "empty",
            "capacity": 20,
            "currentStudents": 0,
            "splits": {
                "dept_tieuhoc": 100
            }
        },
        {
            "id": "rm_thcs_1",
            "name": "Lớp 6 (Phòng học hệ xanh)",
            "blockId": "blk_toamoi_l",
            "type": "classroom",
            "status": "active",
            "capacity": 22,
            "currentStudents": 18,
            "splits": {
                "dept_thcs": 100
            }
        },
        {
            "id": "rm_thcs_2",
            "name": "Lớp 7 (Phòng học hệ xanh)",
            "blockId": "blk_toamoi_l",
            "type": "classroom",
            "status": "active",
            "capacity": 22,
            "currentStudents": 9,
            "splits": {
                "dept_thcs": 100
            }
        },
        {
            "id": "rm_thcs_3",
            "name": "Lớp 8 (Phòng học hệ xanh)",
            "blockId": "blk_toamoi_l",
            "type": "classroom",
            "status": "active",
            "capacity": 22,
            "currentStudents": 16,
            "splits": {
                "dept_thcs": 100
            }
        },
        {
            "id": "rm_thcs_4",
            "name": "Lớp 9 (Phòng học hệ xanh)",
            "blockId": "blk_toamoi_l",
            "type": "classroom",
            "status": "active",
            "capacity": 22,
            "currentStudents": 12,
            "splits": {
                "dept_thcs": 100
            }
        },
        {
            "id": "rm_thcs_5",
            "name": "Phòng THCS chưa sử dụng A",
            "blockId": "blk_toamoi_l",
            "type": "classroom",
            "status": "empty",
            "capacity": 22,
            "currentStudents": 0,
            "splits": {
                "dept_thcs": 100
            }
        },
        {
            "id": "rm_thcs_6",
            "name": "Phòng THCS chưa sử dụng B",
            "blockId": "blk_toamoi_l",
            "type": "classroom",
            "status": "empty",
            "capacity": 22,
            "currentStudents": 0,
            "splits": {
                "dept_thcs": 100
            }
        },
        {
            "id": "rm_thcs_7",
            "name": "Phòng nội trú nữ B1",
            "blockId": "blk_toamoi_l",
            "type": "boarding",
            "status": "active",
            "capacity": 18,
            "currentStudents": 0,
            "splits": {
                "dept_noitru": 100
            }
        },
        {
            "id": "rm_thcs_8",
            "name": "Phòng nội trú nữ B2",
            "blockId": "blk_toamoi_l",
            "type": "boarding",
            "status": "active",
            "capacity": 18,
            "currentStudents": 12,
            "splits": {
                "dept_noitru": 100
            }
        },
        {
            "id": "rm_thpt_1",
            "name": "Lớp 10A1 (Hệ thường)",
            "blockId": "blk_10phong",
            "type": "classroom",
            "status": "active",
            "capacity": 45,
            "currentStudents": 28,
            "splits": {
                "dept_thpt": 100
            }
        },
        {
            "id": "rm_thpt_2",
            "name": "Lớp 10A2 (Hệ thường)",
            "blockId": "blk_10phong",
            "type": "classroom",
            "status": "active",
            "capacity": 45,
            "currentStudents": 27,
            "splits": {
                "dept_thpt": 100
            }
        },
        {
            "id": "rm_thpt_3",
            "name": "Lớp 10A3 (Hệ xanh)",
            "blockId": "blk_10phong",
            "type": "classroom",
            "status": "active",
            "capacity": 22,
            "currentStudents": 8,
            "splits": {
                "dept_thpt": 100
            }
        },
        {
            "id": "rm_thpt_4",
            "name": "Lớp 11A1 (Hệ thường)",
            "blockId": "blk_10phong",
            "type": "classroom",
            "status": "active",
            "capacity": 45,
            "currentStudents": 15,
            "splits": {
                "dept_thpt": 100
            }
        },
        {
            "id": "rm_thpt_5",
            "name": "Lớp 12A1 (Hệ thường)",
            "blockId": "blk_10phong",
            "type": "classroom",
            "status": "active",
            "capacity": 45,
            "currentStudents": 36,
            "splits": {
                "dept_thpt": 100
            }
        },
        {
            "id": "rm_thpt_6",
            "name": "Lớp 12A2 (Hệ thường)",
            "blockId": "blk_10phong",
            "type": "classroom",
            "status": "active",
            "capacity": 45,
            "currentStudents": 33,
            "splits": {
                "dept_thpt": 100
            }
        },
        {
            "id": "rm_thpt_7",
            "name": "Phòng chuyên môn THPT",
            "blockId": "blk_10phong",
            "type": "functional",
            "status": "active",
            "capacity": 20,
            "currentStudents": 0,
            "splits": {
                "dept_thpt": 100
            }
        },
        {
            "id": "rm_thpt_8",
            "name": "Phòng hóa sinh THPT",
            "blockId": "blk_10phong",
            "type": "functional",
            "status": "empty",
            "capacity": 30,
            "currentStudents": 0,
            "splits": {
                "dept_thcs": 50,
                "dept_thpt": 50
            }
        },
        {
            "id": "rm_thpt_9",
            "name": "Phòng Nội trú nam A1",
            "blockId": "blk_10phong",
            "type": "boarding",
            "status": "active",
            "capacity": 18,
            "currentStudents": 18,
            "splits": {
                "dept_noitru": 100
            }
        },
        {
            "id": "rm_thpt_10",
            "name": "Phòng Nội trú nam A2",
            "blockId": "blk_10phong",
            "type": "boarding",
            "status": "active",
            "capacity": 18,
            "currentStudents": 12,
            "splits": {
                "dept_noitru": 100
            }
        },
        {
            "id": "rm_toai_1",
            "name": "Phòng Tin Học 1",
            "blockId": "blk_toai",
            "type": "functional",
            "status": "active",
            "capacity": 30,
            "currentStudents": 0,
            "splits": {
                "dept_tieuhoc": 33.3,
                "dept_thcs": 33.3,
                "dept_thpt": 33.4
            }
        },
        {
            "id": "rm_toai_2",
            "name": "Phòng Tin Học 2",
            "blockId": "blk_toai",
            "type": "functional",
            "status": "empty",
            "capacity": 30,
            "currentStudents": 0,
            "splits": {
                "dept_tieuhoc": 33.3,
                "dept_thcs": 33.3,
                "dept_thpt": 33.4
            }
        },
        {
            "id": "rm_toai_3",
            "name": "Phòng học dự trữ T1",
            "blockId": "blk_toai",
            "type": "classroom",
            "status": "empty",
            "capacity": 45,
            "currentStudents": 0,
            "splits": {
                "dept_thpt": 100
            }
        },
        {
            "id": "rm_toai_4",
            "name": "Phòng học dự trữ T2",
            "blockId": "blk_toai",
            "type": "classroom",
            "status": "empty",
            "capacity": 45,
            "currentStudents": 0,
            "splits": {
                "dept_thpt": 100
            }
        },
        {
            "id": "rm_shared_1",
            "name": "Sân bóng đá lớn",
            "blockId": "blk_sanbong",
            "type": "functional",
            "status": "active",
            "capacity": 200,
            "currentStudents": 0,
            "splits": {
                "dept_tieuhoc": 25,
                "dept_thcs": 25,
                "dept_thpt": 25,
                "dept_noitru": 25
            }
        },
        {
            "id": "rm_shared_2",
            "name": "Khu rèn luyện Westpoint",
            "blockId": "blk_westpoint",
            "type": "functional",
            "status": "active",
            "capacity": 300,
            "currentStudents": 0,
            "splits": {
                "dept_tieuhoc": 35,
                "dept_thcs": 35,
                "dept_thpt": 30
            }
        },
        {
            "id": "rm_shared_3",
            "name": "Bếp ăn & Khu ăn uống",
            "blockId": "blk_bepan",
            "type": "functional",
            "status": "active",
            "capacity": 500,
            "currentStudents": 0,
            "splits": {
                "dept_bep": 100
            }
        },
        {
            "id": "rm_shared_4",
            "name": "Nhà Đa năng rộng lớn",
            "blockId": "blk_danang",
            "type": "functional",
            "status": "active",
            "capacity": 600,
            "currentStudents": 0,
            "splits": {
                "dept_tieuhoc": 30,
                "dept_thcs": 30,
                "dept_thpt": 30,
                "dept_noitru": 10
            }
        }
    ],
    "employees": [
        {
            "id": "emp_real_1",
            "name": "Nguyễn Duy Phan",
            "deptId": "dept_bgh",
            "salary": 16500000,
            "isMultiLevel": true,
            "ratios": {
                "dept_tieuhoc": 0,
                "dept_thcs": 0,
                "dept_thpt": 100,
                "dept_noitru": 0,
                "dept_bdh": 0,
                "dept_bgh": 0,
                "dept_hckt": 0,
                "dept_tuyensinh": 0,
                "dept_truyenthong": 0,
                "dept_tongvu": 0,
                "dept_bep": 0,
                "dept_anninh": 0,
                "dept_sachdep": 0,
                "dept_1779722697629": 0
            }
        },
        {
            "id": "emp_real_2",
            "name": "Nguyễn Thị Hiền",
            "deptId": "dept_bgh",
            "salary": 15000000,
            "isMultiLevel": true,
            "ratios": {
                "dept_tieuhoc": 80,
                "dept_thcs": 20,
                "dept_thpt": 0,
                "dept_noitru": 0,
                "dept_bdh": 0,
                "dept_bgh": 0,
                "dept_hckt": 0,
                "dept_tuyensinh": 0,
                "dept_truyenthong": 0,
                "dept_tongvu": 0,
                "dept_bep": 0,
                "dept_anninh": 0,
                "dept_sachdep": 0,
                "dept_1779722697629": 0
            }
        },
        {
            "id": "emp_real_3",
            "name": "Lê Thị Hằng",
            "deptId": "dept_tieuhoc",
            "salary": 7041667,
            "isMultiLevel": true,
            "ratios": {
                "dept_tieuhoc": 100,
                "dept_thcs": 0,
                "dept_thpt": 0,
                "dept_noitru": 0,
                "dept_bdh": 0,
                "dept_bgh": 0,
                "dept_hckt": 0,
                "dept_tuyensinh": 0,
                "dept_truyenthong": 0,
                "dept_tongvu": 0,
                "dept_bep": 0,
                "dept_anninh": 0,
                "dept_sachdep": 0,
                "dept_1779722697629": 0
            }
        },
        {
            "id": "emp_real_4",
            "name": "Nguyễn Thị Mai Hoa",
            "deptId": "dept_tieuhoc",
            "salary": 8834475,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_5",
            "name": "Phạm Thị Thu Hiền",
            "deptId": "dept_tieuhoc",
            "salary": 11916667,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_6",
            "name": "Lê Thị Lụa",
            "deptId": "dept_thcs",
            "salary": 10626000,
            "isMultiLevel": true,
            "ratios": {
                "dept_tieuhoc": 0,
                "dept_thcs": 100,
                "dept_thpt": 0,
                "dept_noitru": 0,
                "dept_bdh": 0,
                "dept_bgh": 0,
                "dept_hckt": 0,
                "dept_tuyensinh": 0,
                "dept_truyenthong": 0,
                "dept_tongvu": 0,
                "dept_bep": 0,
                "dept_anninh": 0,
                "dept_sachdep": 0,
                "dept_1779722697629": 0
            }
        },
        {
            "id": "emp_real_7",
            "name": "Lương Thị Hiền",
            "deptId": "dept_thcs",
            "salary": 10876667,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_8",
            "name": "Phạm Thị Kim Thoa",
            "deptId": "dept_thpt",
            "salary": 8729146,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_9",
            "name": "Trịnh Thị Thu Ngân",
            "deptId": "dept_thcs",
            "salary": 9218400,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_10",
            "name": "Lê Thị Tuyên",
            "deptId": "dept_thpt",
            "salary": 10667500,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_11",
            "name": "Lương Thị Xuân",
            "deptId": "dept_thpt",
            "salary": 9018240,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_12",
            "name": "Nguyễn Thị Phương",
            "deptId": "dept_thpt",
            "salary": 12000000,
            "isMultiLevel": true,
            "ratios": {
                "dept_tieuhoc": 0,
                "dept_thcs": 20,
                "dept_thpt": 80,
                "dept_noitru": 0,
                "dept_bdh": 0,
                "dept_bgh": 0,
                "dept_hckt": 0,
                "dept_tuyensinh": 0,
                "dept_truyenthong": 0,
                "dept_tongvu": 0,
                "dept_bep": 0,
                "dept_anninh": 0,
                "dept_sachdep": 0,
                "dept_1779722697629": 0
            }
        },
        {
            "id": "emp_real_13",
            "name": "Nguyễn Thị Thu Trang",
            "deptId": "dept_thpt",
            "salary": 10089100,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_14",
            "name": "Nguyễn Vũ Minh",
            "deptId": "dept_thpt",
            "salary": 9000000,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_15",
            "name": "Bùi Gia Khiêm",
            "deptId": "dept_hckt",
            "salary": 12833333,
            "isMultiLevel": true,
            "ratios": {
                "dept_tieuhoc": 0,
                "dept_thcs": 0,
                "dept_thpt": 0,
                "dept_noitru": 0,
                "dept_bdh": 0,
                "dept_bgh": 0,
                "dept_hckt": 0,
                "dept_tuyensinh": 0,
                "dept_truyenthong": 0,
                "dept_tongvu": 80,
                "dept_bep": 0,
                "dept_anninh": 0,
                "dept_sachdep": 0,
                "dept_1779722697629": 0,
                "dept_1779781275635": 20
            }
        },
        {
            "id": "emp_real_16",
            "name": "Bùi Văn Lượng",
            "deptId": "dept_anninh",
            "salary": 5000000,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_17",
            "name": "Đào Thị Kim Dung",
            "deptId": "dept_thpt",
            "salary": 7000000,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_18",
            "name": "Đỗ Thị Miện",
            "deptId": "dept_sachdep",
            "salary": 5900000,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_19",
            "name": "Phạm Thị Gấm",
            "deptId": "dept_sachdep",
            "salary": 5900000,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_20",
            "name": "Phạm Thị Nga",
            "deptId": "dept_sachdep",
            "salary": 5900000,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_21",
            "name": "Phạm Thị Quỳnh",
            "deptId": "dept_bep",
            "salary": 7000000,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_22",
            "name": "Phạm Thị Tuyết",
            "deptId": "dept_bep",
            "salary": 8000000,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_23",
            "name": "Trần Duy Hưng",
            "deptId": "dept_tongvu",
            "salary": 8000000,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_24",
            "name": "Trần Minh Trường",
            "deptId": "dept_tongvu",
            "salary": 9300000,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_25",
            "name": "Trần Văn Quyết",
            "deptId": "dept_anninh",
            "salary": 5000000,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_26",
            "name": "Vũ Văn Tính",
            "deptId": "dept_anninh",
            "salary": 5000000,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_27",
            "name": "Hoàng Thị Thúy",
            "deptId": "dept_thpt",
            "salary": 11575000,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_28",
            "name": "Nguyễn Ngọc Dương",
            "deptId": "dept_thpt",
            "salary": 9051840,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_29",
            "name": "Nguyễn Phương Thảo",
            "deptId": "dept_tieuhoc",
            "salary": 8553600,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_30",
            "name": "Nguyễn Thị Lan",
            "deptId": "dept_tieuhoc",
            "salary": 10483200,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_31",
            "name": "Phạm Ngọc Thúy",
            "deptId": "dept_thcs",
            "salary": 10784900,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_32",
            "name": "Trịnh Hà An",
            "deptId": "dept_tieuhoc",
            "salary": 10368300,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_33",
            "name": "Bùi Ngọc Trà",
            "deptId": "dept_truyenthong",
            "salary": 12525000,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_34",
            "name": "Đặng Thị Hoan",
            "deptId": "dept_tuyensinh",
            "salary": 6467916,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_35",
            "name": "Phạm Mai Linh",
            "deptId": "dept_thcs",
            "salary": 11731000,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_36",
            "name": "Trần Thị Nhung",
            "deptId": "dept_tuyensinh",
            "salary": 14667916,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_37",
            "name": "Bùi Mạnh Hùng",
            "deptId": "dept_tieuhoc",
            "salary": 12000000,
            "isMultiLevel": true,
            "ratios": {
                "dept_tieuhoc": 45,
                "dept_thcs": 45,
                "dept_thpt": 10,
                "dept_noitru": 0,
                "dept_bdh": 0,
                "dept_bgh": 0,
                "dept_hckt": 0,
                "dept_tuyensinh": 0,
                "dept_truyenthong": 0,
                "dept_tongvu": 0,
                "dept_bep": 0,
                "dept_anninh": 0,
                "dept_sachdep": 0,
                "dept_1779722697629": 0,
                "dept_1779781275635": 0
            }
        },
        {
            "id": "emp_real_38",
            "name": "Đoàn Thu Hà",
            "deptId": "dept_tieuhoc",
            "salary": 9240000,
            "isMultiLevel": true,
            "ratios": {
                "dept_tieuhoc": 45,
                "dept_thcs": 45,
                "dept_thpt": 10
            }
        },
        {
            "id": "emp_real_39",
            "name": "Mạc Lệ Quỳnh",
            "deptId": "dept_1779782090457",
            "salary": 17025000,
            "isMultiLevel": true,
            "ratios": {
                "dept_tieuhoc": 50,
                "dept_thcs": 0,
                "dept_thpt": 0,
                "dept_noitru": 0,
                "dept_bdh": 0,
                "dept_bgh": 0,
                "dept_hckt": 0,
                "dept_tuyensinh": 0,
                "dept_truyenthong": 0,
                "dept_tongvu": 0,
                "dept_bep": 0,
                "dept_anninh": 0,
                "dept_sachdep": 0,
                "dept_1779722697629": 0,
                "dept_1779781275635": 0,
                "dept_1779782090457": 50
            }
        },
        {
            "id": "emp_real_40",
            "name": "Nguyễn Duy Hoàng",
            "deptId": "dept_1779782090457",
            "salary": 16755000,
            "isMultiLevel": true,
            "ratios": {
                "dept_tieuhoc": 20,
                "dept_thcs": 20,
                "dept_thpt": 20,
                "dept_1779782090457": 10,
                "dept_noitru": 20,
                "dept_1779782898139": 10
            }
        },
        {
            "id": "emp_real_41",
            "name": "Lê Thị Thảo Nguyên",
            "deptId": "dept_tuyensinh",
            "salary": 8000000,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_42",
            "name": "Tô Thị Huệ",
            "deptId": "dept_tieuhoc",
            "salary": 7366667,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_43",
            "name": "Lê Thị Linh",
            "deptId": "dept_hckt",
            "salary": 6600000,
            "isMultiLevel": true,
            "ratios": {
                "dept_tieuhoc": 20,
                "dept_thcs": 0,
                "dept_thpt": 0,
                "dept_noitru": 20,
                "dept_bdh": 0,
                "dept_bgh": 0,
                "dept_hckt": 20,
                "dept_tuyensinh": 20,
                "dept_truyenthong": 0,
                "dept_tongvu": 0,
                "dept_bep": 0,
                "dept_anninh": 0,
                "dept_sachdep": 0,
                "dept_1779722697629": 0,
                "dept_1779781275635": 0,
                "dept_1779782090457": 0,
                "dept_1779782898139": 20
            }
        },
        {
            "id": "emp_real_44",
            "name": "Trần Công Thìn",
            "deptId": "dept_truyenthong",
            "salary": 10000000,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_45",
            "name": "Lê Triều Vũ",
            "deptId": "dept_bdh",
            "salary": 10000000,
            "isMultiLevel": true,
            "ratios": {
                "dept_tieuhoc": 0,
                "dept_thcs": 0,
                "dept_thpt": 0,
                "dept_noitru": 10,
                "dept_bdh": 20,
                "dept_bgh": 0,
                "dept_hckt": 0,
                "dept_tuyensinh": 10,
                "dept_truyenthong": 20,
                "dept_tongvu": 20,
                "dept_bep": 0,
                "dept_anninh": 0,
                "dept_sachdep": 0,
                "dept_1779722697629": 0,
                "dept_1779781275635": 0,
                "dept_1779782090457": 10,
                "dept_1779782898139": 10
            }
        },
        {
            "id": "emp_real_46",
            "name": "Trần Nguyễn Thùy Trang",
            "deptId": "dept_bdh",
            "salary": 17000000,
            "isMultiLevel": true,
            "ratios": {
                "dept_tieuhoc": 30,
                "dept_thcs": 30,
                "dept_thpt": 10,
                "dept_noitru": 0,
                "dept_bdh": 10,
                "dept_bgh": 0,
                "dept_hckt": 0,
                "dept_tuyensinh": 0,
                "dept_truyenthong": 0,
                "dept_tongvu": 0,
                "dept_bep": 0,
                "dept_anninh": 0,
                "dept_sachdep": 0,
                "dept_1779722697629": 0,
                "dept_1779781275635": 0,
                "dept_1779782090457": 20,
                "dept_1779782898139": 0
            }
        },
        {
            "id": "emp_real_47",
            "name": "Đỗ Thanh Tùng",
            "deptId": "dept_bdh",
            "salary": 25000000,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_48",
            "name": "Lê Thị Ngọc Quỳnh",
            "deptId": "dept_hckt",
            "salary": 12000000,
            "isMultiLevel": true,
            "ratios": {
                "dept_tieuhoc": 10,
                "dept_thcs": 0,
                "dept_thpt": 0,
                "dept_noitru": 10,
                "dept_bdh": 20,
                "dept_bgh": 0,
                "dept_hckt": 0,
                "dept_tuyensinh": 0,
                "dept_truyenthong": 0,
                "dept_tongvu": 0,
                "dept_bep": 20,
                "dept_anninh": 0,
                "dept_sachdep": 20,
                "dept_1779722697629": 0,
                "dept_1779781275635": 0,
                "dept_1779782090457": 0,
                "dept_1779782898139": 20
            }
        },
        {
            "id": "emp_real_49",
            "name": "Đào Thu Hà",
            "deptId": "dept_1779782090457",
            "salary": 0,
            "isMultiLevel": true,
            "ratios": {
                "dept_tieuhoc": 45,
                "dept_thcs": 45,
                "dept_thpt": 10,
                "dept_noitru": 0,
                "dept_bdh": 0,
                "dept_bgh": 0,
                "dept_hckt": 0,
                "dept_tuyensinh": 0,
                "dept_truyenthong": 0,
                "dept_tongvu": 0,
                "dept_bep": 0,
                "dept_anninh": 0,
                "dept_sachdep": 0,
                "dept_1779722697629": 0,
                "dept_1779781275635": 0,
                "dept_1779782090457": 0,
                "dept_1779782898139": 0
            }
        },
        {
            "id": "emp_real_50",
            "name": "Phạm Thị Thu Hà",
            "deptId": "dept_noitru",
            "salary": 7890000,
            "isMultiLevel": true,
            "ratios": {
                "dept_tieuhoc": 0,
                "dept_thcs": 0,
                "dept_thpt": 0,
                "dept_noitru": 60,
                "dept_bdh": 0,
                "dept_bgh": 0,
                "dept_hckt": 0,
                "dept_tuyensinh": 0,
                "dept_truyenthong": 0,
                "dept_tongvu": 0,
                "dept_bep": 0,
                "dept_anninh": 0,
                "dept_sachdep": 0,
                "dept_1779722697629": 0,
                "dept_1779781275635": 0,
                "dept_1779782090457": 40,
                "dept_1779782898139": 0
            }
        },
        {
            "id": "emp_real_51",
            "name": "Trần Thị Kim Thoa",
            "deptId": "dept_thpt",
            "salary": 10140000,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_52",
            "name": "Nguyễn Thị Hải Yến",
            "deptId": "dept_hckt",
            "salary": 9000000,
            "isMultiLevel": true,
            "ratios": {
                "dept_tieuhoc": 0,
                "dept_thcs": 0,
                "dept_thpt": 0,
                "dept_noitru": 0,
                "dept_bdh": 0,
                "dept_bgh": 0,
                "dept_hckt": 70,
                "dept_tuyensinh": 30,
                "dept_truyenthong": 0,
                "dept_tongvu": 0,
                "dept_bep": 0,
                "dept_anninh": 0,
                "dept_sachdep": 0,
                "dept_1779722697629": 0,
                "dept_1779781275635": 0,
                "dept_1779782090457": 0,
                "dept_1779782898139": 0
            }
        },
        {
            "id": "emp_real_53",
            "name": "Lương Hồng Loan",
            "deptId": "dept_hckt",
            "salary": 6310000,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_54",
            "name": "Phạm Văn Quyết",
            "deptId": "dept_anninh",
            "salary": 3034615,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_55",
            "name": "Nguyễn Minh Lộc",
            "deptId": "dept_anninh",
            "salary": 3150000,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_56",
            "name": "Trần Công Thìn",
            "deptId": "dept_truyenthong",
            "salary": 2600000,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_57",
            "name": "Nguyễn Thị Yên",
            "deptId": "dept_thpt",
            "salary": 2520000,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_58",
            "name": "Hoàng Thị Hương",
            "deptId": "dept_thpt",
            "salary": 4920000,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_59",
            "name": "Bùi Thị Kim Thoa",
            "deptId": "dept_thpt",
            "salary": 5640000,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_60",
            "name": "Trần Văn Đồng",
            "deptId": "dept_thpt",
            "salary": 3835000,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_61",
            "name": "Nguyễn Phương Thảo",
            "deptId": "dept_tieuhoc",
            "salary": 3000000,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_62",
            "name": "Đồng Thị Nghiệp",
            "deptId": "dept_thcs",
            "salary": 3600000,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_63",
            "name": "Vũ Thị Phượng",
            "deptId": "dept_thpt",
            "salary": 4380000,
            "isMultiLevel": false
        },
        {
            "id": "emp_real_64",
            "name": "Phạm Quang Hưng",
            "deptId": "dept_1779782090457",
            "salary": 6240000,
            "isMultiLevel": true,
            "ratios": {
                "dept_tieuhoc": 45,
                "dept_thcs": 45,
                "dept_thpt": 10,
                "dept_noitru": 0,
                "dept_bdh": 0,
                "dept_bgh": 0,
                "dept_hckt": 0,
                "dept_tuyensinh": 0,
                "dept_truyenthong": 0,
                "dept_tongvu": 0,
                "dept_bep": 0,
                "dept_anninh": 0,
                "dept_sachdep": 0,
                "dept_1779722697629": 0,
                "dept_1779781275635": 0,
                "dept_1779782090457": 0,
                "dept_1779782898139": 0
            }
        },
        {
            "id": "emp_real_65",
            "name": "Phạm Thanh Dịu",
            "deptId": "dept_noitru",
            "salary": 4900000,
            "isMultiLevel": false
        }
    ],
    "drivers": {
        "student_count": {
            "dept_tieuhoc": 45,
            "dept_thcs": 55,
            "dept_thpt": 147,
            "dept_noitru": 0
        },
        "new_students": {
            "dept_tieuhoc": 40,
            "dept_thcs": 30,
            "dept_thpt": 50,
            "dept_noitru": 0
        },
        "meals": {
            "dept_tieuhoc": 41,
            "dept_thcs": 50,
            "dept_thpt": 132,
            "dept_noitru": 42
        },
        "area_m2": {
            "dept_tieuhoc": 770.56,
            "dept_thcs": 650.56,
            "dept_thpt": 870.8800000000001,
            "dept_noitru": 148
        },
        "staff_count": {
            "dept_tieuhoc": 7.8,
            "dept_thcs": 8.9,
            "dept_thpt": 7.300000000000001,
            "dept_noitru": 4
        },
        "revenue_share": {
            "dept_tieuhoc": 29.75206611570248,
            "dept_thcs": 23.96694214876033,
            "dept_thpt": 35.12396694214876,
            "dept_noitru": 11.15702479338843
        },
        "custom_percent": {
            "dept_1779722697629": {
                "dept_tieuhoc": 30,
                "dept_thcs": 30,
                "dept_thpt": 30,
                "dept_noitru": 10
            },
            "dept_sachdep": {
                "dept_noitru": 5,
                "dept_tieuhoc": 30,
                "dept_thcs": 30,
                "dept_thpt": 35
            },
            "dept_anninh": {
                "dept_tieuhoc": 30,
                "dept_thcs": 30,
                "dept_thpt": 30,
                "dept_noitru": 10
            },
            "dept_tongvu": {
                "dept_noitru": 12,
                "dept_tieuhoc": 30,
                "dept_thcs": 30,
                "dept_thpt": 30
            },
            "dept_bdh": {
                "dept_tieuhoc": 40,
                "dept_thcs": 40,
                "dept_thpt": 15,
                "dept_noitru": 5
            },
            "dept_bgh": {
                "dept_tieuhoc": 40,
                "dept_thcs": 15,
                "dept_thpt": 45,
                "dept_noitru": 0
            },
            "dept_hckt": {
                "dept_noitru": 0,
                "dept_tieuhoc": 32,
                "dept_thcs": 32,
                "dept_thpt": 32
            },
            "dept_tuyensinh": {
                "dept_noitru": 5,
                "dept_thpt": 15,
                "dept_tieuhoc": 40,
                "dept_thcs": 40
            },
            "dept_truyenthong": {
                "dept_noitru": 5,
                "dept_tieuhoc": 40,
                "dept_thcs": 40,
                "dept_thpt": 15
            },
            "dept_bep": {
                "dept_tieuhoc": 25,
                "dept_thcs": 25,
                "dept_thpt": 25,
                "dept_noitru": 25
            },
            "dept_1779781275635": {
                "dept_tieuhoc": 34,
                "dept_thcs": 33,
                "dept_thpt": 33,
                "dept_noitru": 0
            },
            "dept_1779782090457": {
                "dept_tieuhoc": 40,
                "dept_thcs": 40,
                "dept_thpt": 20,
                "dept_noitru": 0
            },
            "dept_1779782898139": {
                "dept_tieuhoc": 45,
                "dept_thcs": 45,
                "dept_thpt": 10,
                "dept_noitru": 0
            }
        }
    },
    "revenues": {
        "dept_tieuhoc": 112500000,
        "dept_thcs": 112500000,
        "dept_thpt": 165000000,
        "dept_noitru": 81000000
    },
    "utilityCosts": {
        "dept_dien": 45000000,
        "dept_nuoc": 12000000
    },
    "boardingNotes": {
        "ratioNote": "- BGH & Ban Điều hành (BĐH): Định mức đề xuất (0% - 5%) nhằm phản ánh đúng tập trung chuyên môn cốt lõi vào chương trình chính khóa.\n- Tuyển sinh & Truyền thông: Định mức đề xuất (2% - 5%) do hoạt động tuyển sinh nội trú là dịch vụ tích hợp đi kèm.\n- Hành chính Kế toán (HCKT): Định mức đề xuất (3% - 5%) tương ứng với tần suất giao dịch và quản lý học phí thực tế.\n- Tổng vụ (Cơ sở vật chất): Định mức đề xuất (8% - 12%) để bù đắp hao mòn vận hành và công tác trực ca ngoài giờ.",
        "facilityNote": "- Phương pháp phân bổ trực tiếp: Nhằm phản ánh chính xác diện tích sử dụng thực tế của khối Nội trú (chỉ gồm 4 phòng).\n- Hướng dẫn cấu hình: Truy cập tab \"Mặt bằng & Phòng học\", nhấp nút \"Sửa tỷ lệ %\" tại 4 phòng nội trú và gán đúng 100% tỷ lệ gánh chi phí cho khối Nội trú.\n- Lợi ích: Khối Nội trú tự chịu trách nhiệm tài chính trọn vẹn trên đúng phạm vi cơ sở vật chất thực tế đang vận hành."
    },
    "aprilSalaryUpdated": true
};


let appState = {};

// Load state from local storage or default template
function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            appState = JSON.parse(saved);
            
            // Một lần duy nhất cập nhật danh sách lương 65 nhân sự chính thức tháng 4 từ Excel
            if (!appState.aprilSalaryUpdated) {
                appState.employees = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE.employees));
                appState.aprilSalaryUpdated = true;
                saveState();
            }
            // Backup compatibility checks for new keys
            if (!appState.rentBlocks) appState.rentBlocks = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE.rentBlocks));
            if (!appState.rooms) appState.rooms = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE.rooms));
            if (!appState.drivers || !appState.drivers.custom_percent) {
                appState.drivers = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE.drivers));
            }
            if (!appState.utilityCosts) {
                appState.utilityCosts = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE.utilityCosts));
            }
            if (!appState.boardingNotes) {
                appState.boardingNotes = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE.boardingNotes));
            }
            // Sync new departments (like utility depts) from template if they don't exist
            DEFAULT_TEMPLATE.departments.forEach(defaultDept => {
                const exists = appState.departments.find(d => d.id === defaultDept.id);
                if (!exists) {
                    appState.departments.push(JSON.parse(JSON.stringify(defaultDept)));
                }
            });
            // Ensure student counts are sync'd for direct depts
            appState.departments.forEach(dept => {
                if (dept.type === "revenue" && dept.students === undefined) {
                    const defaultDept = DEFAULT_TEMPLATE.departments.find(d => d.id === dept.id);
                    dept.students = defaultDept ? defaultDept.students : 0;
                }
            });
        } catch (e) {
            console.error("Failed to parse saved state, resetting...", e);
            appState = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE));
        }
    } else {
        appState = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE));
    }
}

function saveState() {
    saveStateLocalOnly();
    if (currentProjectCode && firebaseDb && !isSyncingFromCloud) {
        pushLocalDataToCloud();
    }
}

function saveStateLocalOnly() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function resetToDefault() {
    if (confirm("Bạn có chắc chắn muốn khôi phục dữ liệu mẫu ban đầu của Xanh Tuệ Đức? Toàn bộ các thay đổi hiện tại của bạn sẽ bị xóa.")) {
        appState = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE));
        saveState();
        initApp();
        alert("Khôi phục dữ liệu mẫu thành công!");
    }
}


function getStaffCounts() {
    const staffCounts = {
        "dept_tieuhoc": 0,
        "dept_thcs": 0,
        "dept_thpt": 0,
        "dept_noitru": 0
    };

    appState.employees.forEach(emp => {
        if (emp.isMultiLevel && emp.ratios) {
            let totalRatio = Object.values(emp.ratios).reduce((a, b) => a + b, 0);
            Object.keys(emp.ratios).forEach(deptId => {
                if (staffCounts[deptId] !== undefined && totalRatio > 0) {
                    staffCounts[deptId] += (emp.ratios[deptId] || 0) / totalRatio;
                }
            });
        } else {
            if (staffCounts[emp.deptId] !== undefined) {
                staffCounts[emp.deptId] += 1;
            }
        }
    });

    return staffCounts;
}

function getActiveStudentCounts() {
    const studentCounts = {
        "dept_tieuhoc": 0,
        "dept_thcs": 0,
        "dept_thpt": 0,
        "dept_noitru": 0
    };

    appState.departments.filter(d => d.type === "revenue").forEach(rd => {
        studentCounts[rd.id] = rd.students || 0;
    });

    return studentCounts;
}

function getActiveRoomCounts() {
    const roomCounts = {};
    appState.departments.filter(d => d.type === "revenue").forEach(rd => {
        roomCounts[rd.id] = 0;
    });

    appState.rooms.forEach(room => {
        if (room.status === "active") {
            Object.keys(room.splits).forEach(did => {
                if (roomCounts[did] !== undefined) {
                    roomCounts[did] += (room.splits[did] || 0) / 100;
                }
            });
        }
    });

    return roomCounts;
}

// --- 2. COST ALLOCATION CALCULATION ENGINE ---
let allocationResult = {};

function runAllocation() {
    const revenueDepts = appState.departments.filter(d => d.type === "revenue");
    const supportDepts = appState.departments.filter(d => d.type === "support" && !d.isUtility);
    const utilityDepts = appState.departments.filter(d => d.type === "support" && d.isUtility);

    // Initialize tracking structures
    const result = {
        directSalary: {},
        directRent: {},
        indirectSalary: {},
        indirectRent: {},
        allocatedCosts: {},
        allocatedUtilityCosts: {},
        allocatedDetails: {},
        allocatedSalaryCosts: {},
        allocatedRentCosts: {},
        totalIndirectSalaryAllocated: {},
        totalIndirectRentAllocated: {},
        totalUtilityAllocated: {},
        departmentTotalCosts: {},
        totalRevenue: 0,
        totalDirectCost: 0,
        totalAllocated: 0,
        totalUtility: 0,
        netProfit: {}
    };

    // Prepare structure
    revenueDepts.forEach(d => {
        result.directSalary[d.id] = 0;
        result.directRent[d.id] = 0;
        result.totalIndirectSalaryAllocated[d.id] = 0;
        result.totalIndirectRentAllocated[d.id] = 0;
        result.totalUtilityAllocated[d.id] = 0;
        result.allocatedCosts[d.id] = {};
        result.allocatedUtilityCosts[d.id] = {};
        result.allocatedDetails[d.id] = {};
        result.allocatedSalaryCosts[d.id] = {};
        result.allocatedRentCosts[d.id] = {};
        supportDepts.forEach(sd => {
            result.allocatedCosts[d.id][sd.id] = 0;
            result.allocatedSalaryCosts[d.id][sd.id] = 0;
            result.allocatedRentCosts[d.id][sd.id] = 0;
        });
        utilityDepts.forEach(ud => {
            result.allocatedUtilityCosts[d.id][ud.id] = 0;
        });
    });
    supportDepts.forEach(d => {
        result.indirectSalary[d.id] = 0;
        result.indirectRent[d.id] = 0;
        result.departmentTotalCosts[d.id] = 0;
    });

    // ==========================================
    // BƯỚC 1 & 2: PHÂN BỔ LƯƠNG NHÂN SỰ
    // ==========================================
    appState.employees.forEach(emp => {
        if (emp.isMultiLevel && emp.ratios) {
            // Calculate total ratios for weight calculation (bulletproof math!)
            let totalRatio = 0;
            Object.keys(emp.ratios).forEach(deptId => {
                totalRatio += emp.ratios[deptId] || 0;
            });

            // Allocate multi-level/kiêm nhiệm employee salary across any departments based on weights
            Object.keys(emp.ratios).forEach(deptId => {
                const ratioVal = emp.ratios[deptId] || 0;
                if (ratioVal > 0 && totalRatio > 0) {
                    const ratio = ratioVal / totalRatio;
                    const allocatedSalary = emp.salary * ratio;
                    const dept = appState.departments.find(d => d.id === deptId);
                    if (dept) {
                        if (dept.type === "revenue") {
                            result.directSalary[deptId] += allocatedSalary;
                        } else {
                            result.indirectSalary[deptId] += allocatedSalary;
                        }
                    }
                }
            });
        } else {
            // Single-department employee
            const dept = appState.departments.find(d => d.id === emp.deptId);
            if (dept) {
                if (dept.type === "revenue") {
                    result.directSalary[emp.deptId] += emp.salary;
                } else {
                    result.indirectSalary[emp.deptId] += emp.salary;
                }
            }
        }
    });

    // ==========================================
    // BƯỚC 3: DYNAMIC ROOMS TO BLOCKS RENT ALLOCATION
    // ==========================================
    // 1. Count rooms per block
    const blockRoomCounts = {};
    appState.rentBlocks.forEach(blk => {
        blockRoomCounts[blk.id] = 0;
    });
    appState.rooms.forEach(room => {
        if (blockRoomCounts[room.blockId] !== undefined) {
            blockRoomCounts[room.blockId]++;
        }
    });

    // 2. Calculate dynamic room rent and allocate it to departments
    appState.rooms.forEach(room => {
        const block = appState.rentBlocks.find(b => b.id === room.blockId);
        if (!block) return;

        const roomCount = blockRoomCounts[block.id] || 1;
        const roomRent = block.totalRent / roomCount; // Divided equally within the block!

        // Distribute room rent to departments according to split ratios
        Object.keys(room.splits).forEach(deptId => {
            const ratio = room.splits[deptId];
            if (ratio > 0) {
                const allocatedRent = roomRent * (ratio / 100.0);
                const dept = appState.departments.find(d => d.id === deptId);
                if (dept) {
                    if (dept.type === "revenue") {
                        result.directRent[deptId] += allocatedRent;
                    } else {
                        result.indirectRent[deptId] += allocatedRent;
                    }
                }
            }
        });
    });

    // ==========================================
    // BƯỚC 4: HỢP NHẤT VÀ PHÂN BỔ CHI PHÍ PHÒNG BAN GIÁN TIẾP
    // ==========================================
    // 1. Calculate Consolidated Total Cost for each Support Department
    supportDepts.forEach(sd => {
        result.departmentTotalCosts[sd.id] = result.indirectSalary[sd.id] + result.indirectRent[sd.id];
    });

    // 2. Allocate Support Department Costs to Revenue Departments
    supportDepts.forEach(sd => {
        const totalPool = result.departmentTotalCosts[sd.id];
        if (totalPool <= 0) return;

        const method = sd.allocationMethod || "manual";
        let targetValues = {};
        let totalSum = 0;
        let driverName = "";

        if (method === "student") {
            targetValues = getActiveStudentCounts();
            totalSum = Object.values(targetValues).reduce((a, b) => a + b, 0);
            driverName = "Sỹ số học sinh";
        } else if (method === "staff") {
            targetValues = getStaffCounts();
            totalSum = Object.values(targetValues).reduce((a, b) => a + b, 0);
            driverName = "Số lượng nhân sự";
        } else {
            // manual
            const customPercent = appState.drivers.custom_percent[sd.id] || {};
            revenueDepts.forEach(rd => {
                targetValues[rd.id] = customPercent[rd.id] || 0;
                totalSum += targetValues[rd.id];
            });
            driverName = "Phân bổ thủ công (%)";
        }

        revenueDepts.forEach(rd => {
            const rdDriverVal = targetValues[rd.id] || 0;
            let ratio = 0;
            let allocatedVal = 0;

            if (totalSum > 0) {
                ratio = rdDriverVal / totalSum;
                allocatedVal = totalPool * ratio;
            } else {
                ratio = 1 / revenueDepts.length;
                allocatedVal = totalPool * ratio;
            }

            const allocatedSalary = result.indirectSalary[sd.id] * ratio;
            const allocatedRent = result.indirectRent[sd.id] * ratio;

            result.allocatedCosts[rd.id][sd.id] = allocatedVal;
            result.allocatedSalaryCosts[rd.id][sd.id] = allocatedSalary;
            result.allocatedRentCosts[rd.id][sd.id] = allocatedRent;

            result.totalIndirectSalaryAllocated[rd.id] += allocatedSalary;
            result.totalIndirectRentAllocated[rd.id] += allocatedRent;

            result.allocatedDetails[rd.id][sd.id] = {
                deptName: sd.name,
                poolTotal: totalPool,
                driverName: driverName,
                rdValue: rdDriverVal,
                sumValue: totalSum,
                ratioPercent: (ratio * 100).toFixed(2),
                allocatedVal: allocatedVal
            };
        });
    });

    // ==========================================
    // BƯỚC 5: PHÂN BỔ LINH ĐỘNG TIỆN ÍCH (ĐIỆN & NƯỚC)
    // ==========================================
    utilityDepts.forEach(ud => {
        const totalPool = appState.utilityCosts[ud.id] || 0;
        result.totalUtility += totalPool;
        if (totalPool <= 0) return;

        const method = ud.allocationMethod || "student"; // Tiện ích mặc định phân bổ theo sỹ số học sinh
        let targetValues = {};
        let totalSum = 0;
        let driverName = "";

        if (method === "student") {
            targetValues = getActiveStudentCounts();
            totalSum = Object.values(targetValues).reduce((a, b) => a + b, 0);
            driverName = "Sỹ số học sinh";
        } else if (method === "staff") {
            targetValues = getStaffCounts();
            totalSum = Object.values(targetValues).reduce((a, b) => a + b, 0);
            driverName = "Số lượng nhân sự";
        } else {
            // manual % allocation
            const customPercent = appState.drivers.custom_percent[ud.id] || {};
            revenueDepts.forEach(rd => {
                targetValues[rd.id] = customPercent[rd.id] || 0;
                totalSum += targetValues[rd.id];
            });
            driverName = "Phân bổ thủ công (%)";
        }

        revenueDepts.forEach(rd => {
            const rdValue = targetValues[rd.id] || 0;
            let ratio = 0;
            let allocatedVal = 0;

            if (totalSum > 0) {
                ratio = rdValue / totalSum;
                allocatedVal = totalPool * ratio;
            } else {
                ratio = 1 / revenueDepts.length;
                allocatedVal = totalPool * ratio;
            }

            result.allocatedUtilityCosts[rd.id][ud.id] = allocatedVal;
            result.totalUtilityAllocated[rd.id] += allocatedVal;

            result.allocatedDetails[rd.id][ud.id] = {
                deptName: ud.name,
                poolTotal: totalPool,
                driverName: driverName,
                rdValue: rdValue,
                sumValue: totalSum,
                ratioPercent: (ratio * 100).toFixed(2),
                allocatedVal: allocatedVal
            };
        });
    });


    // Sum overall calculations
    result.totalRevenue = Object.values(appState.revenues).reduce((a, b) => a + b, 0);
    
    revenueDepts.forEach(rd => {
        const rdDirectCost = result.directSalary[rd.id] + result.directRent[rd.id];
        let rdAllocatedSum = 0;
        supportDepts.forEach(sd => {
            rdAllocatedSum += result.allocatedCosts[rd.id][sd.id];
        });
        
        const rdUtilitySum = result.totalUtilityAllocated[rd.id] || 0;

        result.totalDirectCost += rdDirectCost;
        result.totalAllocated += rdAllocatedSum;

        const rdRev = appState.revenues[rd.id] || 0;
        result.netProfit[rd.id] = rdRev - rdDirectCost - rdAllocatedSum - rdUtilitySum;
    });

    allocationResult = result;
    return result;
}

function getDriverNameVietnamese(key) {
    const names = {
        "student_count": "Sĩ số học sinh",
        "new_students": "Học sinh mới",
        "meals": "Số suất ăn",
        "area_m2": "Diện tích sử dụng (m2)",
        "staff_count": "Số lượng nhân sự",
        "revenue_share": "Tỷ trọng doanh thu",
        "custom_percent": "Phân bổ thủ công (%)"
    };
    return names[key] || key;
}


// --- 3. DYNAMIC UI RENDERING & ROUTING ---

function switchTab(tabId) {
    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.remove("active");
    });
    const clickedItem = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
    if (clickedItem) clickedItem.classList.add("active");

    document.querySelectorAll(".view-section").forEach(sec => {
        sec.classList.remove("active");
    });
    const targetSec = document.getElementById(tabId);
    if (targetSec) targetSec.classList.add("active");

    // Update Apple Helper Bot Step Checklist
    updateHelperSteps(tabId);

    // Re-render the active tab
    if (tabId === "view_dashboard") renderDashboard();
    else if (tabId === "view_departments") renderDepartments();
    else if (tabId === "view_employees") renderEmployees();
    else if (tabId === "view_facilities") renderFacilities();
    else if (tabId === "view_payroll_matrix") renderPayrollMatrix();
}

// 3.1 RENDERING VIEW: DASHBOARD & P&L
let dashboardChart = null;

function renderDashboard() {
    const data = runAllocation() || {};

    // Render KPI Values
    const totalSalary = (appState.employees || []).reduce((acc, curr) => acc + (curr.salary || 0), 0);
    const totalRent = (appState.rentBlocks || []).reduce((acc, curr) => acc + (curr.totalRent || 0), 0);
    const staffCount = (appState.employees || []).length;
    const revDeptsCount = (appState.departments || []).filter(d => d.type === "revenue").length;

    document.getElementById("kpi_total_salary").innerText = formatCurrency(totalSalary);
    document.getElementById("kpi_total_rent").innerText = formatCurrency(totalRent);
    document.getElementById("kpi_staff_count").innerText = `${staffCount} Nhân sự`;
    document.getElementById("kpi_revenue_centers").innerText = `${revDeptsCount} Khối Doanh thu`;

    // Render P&L Report Table
    const plBody = document.getElementById("pl_report_body");
    if (!plBody) return;
    plBody.innerHTML = "";

    const revenueDepts = (appState.departments || []).filter(d => d.type === "revenue");
    const supportDepts = (appState.departments || []).filter(d => d.type === "support");

    // Row 1: Doanh thu
    let revHtml = `<tr class="pl-row-revenue">
        <td>Doanh Thu (Tiền Học Phí & Dịch Vụ)</td>`;
    revenueDepts.forEach(rd => {
        revHtml += `<td class="text-right">${formatCurrency(appState.revenues?.[rd.id] || 0)}</td>`;
    });
    revHtml += `<td class="text-right">${formatCurrency(data.totalRevenue || 0)}</td></tr>`;
    plBody.innerHTML += revHtml;

    // SECTION I: CHI PHÍ LƯƠNG NHÂN SỰ
    plBody.innerHTML += `<tr style="font-weight: 600; color: #FFF; background: rgba(52, 199, 89, 0.02)">
        <td colspan="${revenueDepts.length + 2}">I. CHI PHÍ LƯƠNG NHÂN SỰ</td>
    </tr>`;

    // Row I.1: Lương trực tiếp
    let salaryDirectHtml = `<tr>
        <td style="padding-left: 24px;">1. Lương Giáo viên & Quản nhiệm Trực tiếp (Click xem chi tiết) <i class="fa-solid fa-magnifying-glass-chart" style="font-size: 11px;"></i></td>`;
    revenueDepts.forEach(rd => {
        salaryDirectHtml += `<td class="text-right">
            <a href="#" class="audit-link" onclick="openDirectSalaryAuditModal('${rd.id}'); return false;" style="color: var(--success); text-decoration: underline;">
                ${formatCurrency(data.directSalary?.[rd.id] || 0)}
            </a>
        </td>`;
    });
    const sumDirectSalary = Object.values(data.directSalary || {}).reduce((a, b) => a + b, 0);
    salaryDirectHtml += `<td class="text-right text-muted">${formatCurrency(sumDirectSalary)}</td></tr>`;
    plBody.innerHTML += salaryDirectHtml;

    // Row I.2: Lương gián tiếp phân bổ
    let salaryIndirectHtml = `<tr>
        <td style="padding-left: 24px;">2. Lương Gián tiếp Phân bổ (Click xem chi tiết) <i class="fa-solid fa-magnifying-glass-chart" style="font-size: 11px;"></i></td>`;
    revenueDepts.forEach(rd => {
        const val = data.totalIndirectSalaryAllocated?.[rd.id] || 0;
        salaryIndirectHtml += `<td class="text-right">
            <a href="#" class="audit-link" onclick="openSalaryAuditModal('${rd.id}'); return false;" style="color: var(--primary); text-decoration: underline;">
                ${formatCurrency(val)}
            </a>
        </td>`;
    });
    const sumIndirectSalary = Object.values(data.totalIndirectSalaryAllocated || {}).reduce((a, b) => a + b, 0);
    salaryIndirectHtml += `<td class="text-right text-muted">${formatCurrency(sumIndirectSalary)}</td></tr>`;
    plBody.innerHTML += salaryIndirectHtml;

    // Row I.3: TỔNG CHI PHÍ LƯƠNG
    let totalSalaryHtml = `<tr class="pl-row-subtotal">
        <td>➔ TỔNG CHI PHÍ LƯƠNG HỢP NHẤT</td>`;
    revenueDepts.forEach(rd => {
        const sum = (data.directSalary?.[rd.id] || 0) + (data.totalIndirectSalaryAllocated?.[rd.id] || 0);
        totalSalaryHtml += `<td class="text-right">${formatCurrency(sum)}</td>`;
    });
    const overallSalary = sumDirectSalary + sumIndirectSalary;
    totalSalaryHtml += `<td class="text-right">${formatCurrency(overallSalary)}</td></tr>`;
    plBody.innerHTML += totalSalaryHtml;


    // SECTION II: CHI PHÍ MẶT BẰNG & TIỀN THUÊ
    plBody.innerHTML += `<tr style="font-weight: 600; color: #FFF; background: rgba(0, 122, 255, 0.02)">
        <td colspan="${revenueDepts.length + 2}">II. CHI PHÍ MẶT BẰNG & TIỀN THUÊ MẶT BẰNG</td>
    </tr>`;

    // Row II.1: Mặt bằng trực tiếp
    let rentDirectHtml = `<tr>
        <td style="padding-left: 24px;">1. Chi phí thuê lớp học & phòng Nội trú Trực tiếp</td>`;
    revenueDepts.forEach(rd => {
        rentDirectHtml += `<td class="text-right">${formatCurrency(data.directRent?.[rd.id] || 0)}</td>`;
    });
    const sumDirectRent = Object.values(data.directRent || {}).reduce((a, b) => a + b, 0);
    rentDirectHtml += `<td class="text-right text-muted">${formatCurrency(sumDirectRent)}</td></tr>`;
    plBody.innerHTML += rentDirectHtml;

    // Row II.2: Mặt bằng gián tiếp phân bổ
    let rentIndirectHtml = `<tr>
        <td style="padding-left: 24px;">2. Tiền thuê Mặt bằng Gián tiếp Phân bổ (Click xem chi tiết) <i class="fa-solid fa-magnifying-glass-chart" style="font-size: 11px;"></i></td>`;
    revenueDepts.forEach(rd => {
        const val = data.totalIndirectRentAllocated?.[rd.id] || 0;
        rentIndirectHtml += `<td class="text-right">
            <a href="#" class="audit-link" onclick="openRentAuditModal('${rd.id}'); return false;" style="color: var(--primary); text-decoration: underline;">
                ${formatCurrency(val)}
            </a>
        </td>`;
    });
    const sumIndirectRent = Object.values(data.totalIndirectRentAllocated || {}).reduce((a, b) => a + b, 0);
    rentIndirectHtml += `<td class="text-right text-muted">${formatCurrency(sumIndirectRent)}</td></tr>`;
    plBody.innerHTML += rentIndirectHtml;

    // Row II.3: TỔNG CHI PHÍ MẶT BẰNG
    let totalRentHtml = `<tr class="pl-row-subtotal">
        <td>➔ TỔNG CHI PHÍ MẶT BẰNG HỢP NHẤT</td>`;
    revenueDepts.forEach(rd => {
        const sum = (data.directRent?.[rd.id] || 0) + (data.totalIndirectRentAllocated?.[rd.id] || 0);
        totalRentHtml += `<td class="text-right">${formatCurrency(sum)}</td>`;
    });
    const overallRent = sumDirectRent + sumIndirectRent;
    totalRentHtml += `<td class="text-right">${formatCurrency(overallRent)}</td></tr>`;
    plBody.innerHTML += totalRentHtml;

    // SECTION III: CHI PHÍ TIỆN ÍCH & VẬN HÀNH
    plBody.innerHTML += `<tr style="font-weight: 600; color: #FFF; background: rgba(255, 149, 0, 0.02)">
        <td colspan="${revenueDepts.length + 2}">III. CHI PHÍ ĐIỆN NƯỚC & VẬN HÀNH CHUNG</td>
    </tr>`;

    // Row III.1: Chi phí Điện
    let electHtml = `<tr>
        <td style="padding-left: 24px;">1. Chi phí Điện phân bổ (Theo sỹ số thực tế) <i class="fa-solid fa-magnifying-glass-chart" style="font-size: 11px;"></i></td>`;
    revenueDepts.forEach(rd => {
        const val = data.allocatedUtilityCosts?.[rd.id]?.["dept_dien"] || 0;
        electHtml += `<td class="text-right">
            <a href="#" class="audit-link" onclick="openUtilityAuditModal('${rd.id}', 'dept_dien'); return false;" style="color: var(--primary); text-decoration: underline;">
                ${formatCurrency(val)}
            </a>
        </td>`;
    });
    const sumElect = Object.keys(data.allocatedUtilityCosts || {}).reduce((acc, rdId) => acc + (data.allocatedUtilityCosts[rdId]?.["dept_dien"] || 0), 0);
    electHtml += `<td class="text-right text-muted">${formatCurrency(sumElect)}</td></tr>`;
    plBody.innerHTML += electHtml;

    // Row III.2: Chi phí Nước
    let waterHtml = `<tr>
        <td style="padding-left: 24px;">2. Chi phí Nước phân bổ (Theo sỹ số thực tế) <i class="fa-solid fa-magnifying-glass-chart" style="font-size: 11px;"></i></td>`;
    revenueDepts.forEach(rd => {
        const val = data.allocatedUtilityCosts?.[rd.id]?.["dept_nuoc"] || 0;
        waterHtml += `<td class="text-right">
            <a href="#" class="audit-link" onclick="openUtilityAuditModal('${rd.id}', 'dept_nuoc'); return false;" style="color: var(--primary); text-decoration: underline;">
                ${formatCurrency(val)}
            </a>
        </td>`;
    });
    const sumWater = Object.keys(data.allocatedUtilityCosts || {}).reduce((acc, rdId) => acc + (data.allocatedUtilityCosts[rdId]?.["dept_nuoc"] || 0), 0);
    waterHtml += `<td class="text-right text-muted">${formatCurrency(sumWater)}</td></tr>`;
    plBody.innerHTML += waterHtml;

    // Row III.3: TỔNG CHI PHÍ TIỆN ÍCH
    let totalUtilityHtml = `<tr class="pl-row-subtotal">
        <td>➔ TỔNG CHI PHÍ VẬN HÀNH HỢP NHẤT</td>`;
    revenueDepts.forEach(rd => {
        const sum = data.totalUtilityAllocated?.[rd.id] || 0;
        totalUtilityHtml += `<td class="text-right">${formatCurrency(sum)}</td>`;
    });
    const overallUtility = sumElect + sumWater;
    totalUtilityHtml += `<td class="text-right">${formatCurrency(overallUtility)}</td></tr>`;
    plBody.innerHTML += totalUtilityHtml;


    // NET PROFIT ROW (LỢI NHUẬN THUẦN)
    let netHtml = `<tr class="pl-row-net">
        <td>LỢI NHUẬN THUẦN CUỐI CÙNG</td>`;
    revenueDepts.forEach(rd => {
        const profit = data.netProfit?.[rd.id] || 0;
        const colorClass = profit >= 0 ? "text-success" : "text-danger";
        netHtml += `<td class="text-right ${colorClass}">${formatCurrency(profit)}</td>`;
    });
    const totalProfit = (data.totalRevenue || 0) - (data.totalDirectCost || 0) - (data.totalAllocated || 0) - (data.totalUtility || 0);
    const totalColorClass = totalProfit >= 0 ? "text-success" : "text-danger";
    netHtml += `<td class="text-right ${totalColorClass}">${formatCurrency(totalProfit)}</td></tr>`;
    plBody.innerHTML += netHtml;

    // Draw Chart using Chart.js
    renderDashboardChart(revenueDepts, data);
}

function renderDashboardChart(revenueDepts, data) {
    if (typeof Chart === 'undefined') {
        console.warn("Chart.js library is not loaded. Cannot render dashboard chart.");
        const chartContainer = document.querySelector(".chart-container");
        if (chartContainer) {
            chartContainer.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-secondary); text-align: center; padding: 20px;">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size: 2rem; color: var(--warning); margin-bottom: 10px;"></i>
                    <p style="font-weight: 500;">Không thể tải biểu đồ</p>
                    <p style="font-size: 0.8rem; max-width: 250px;">Vui lòng kiểm tra kết nối mạng (Chart.js CDN) để hiển thị biểu đồ hiệu năng tài chính.</p>
                </div>
            `;
        }
        return;
    }

    const canvas = document.getElementById("dashboard_chart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (dashboardChart) {
        dashboardChart.destroy();
    }

    const labels = (revenueDepts || []).map(rd => rd.name);
    const revenueData = (revenueDepts || []).map(rd => appState.revenues?.[rd.id] || 0);
    const costData = (revenueDepts || []).map(rd => {
        const direct = (data.directSalary?.[rd.id] || 0) + (data.directRent?.[rd.id] || 0);
        const indirect = Object.values(data.allocatedCosts?.[rd.id] || {}).reduce((a, b) => a + b, 0);
        const utility = Object.values(data.allocatedUtilityCosts?.[rd.id] || {}).reduce((a, b) => a + b, 0);
        return direct + indirect + utility;
    });

    dashboardChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Doanh Thu',
                    data: revenueData,
                    backgroundColor: '#10B981',
                    borderRadius: 6
                },
                {
                    label: 'Tổng Chi Phí (Trực tiếp + Phân bổ)',
                    data: costData,
                    backgroundColor: '#EF4444',
                    borderRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#9CA3AF', font: { family: 'Outfit' } }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#9CA3AF', font: { family: 'Outfit' } }
                },
                y: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { 
                        color: '#9CA3AF', 
                        font: { family: 'Outfit' },
                        callback: function(value) {
                            return (value / 1000000).toLocaleString() + 'M';
                        }
                    }
                }
            }
        }
    });
}

function openAuditModal(rdId, sdId) {
    const data = allocationResult;
    const detail = data.allocatedDetails[rdId] && data.allocatedDetails[rdId][sdId];
    if (!detail) return;

    const rdName = appState.departments.find(d => d.id === rdId).name;
    const sdSalary = data.indirectSalary[sdId] || 0;
    const sdRent = data.indirectRent[sdId] || 0;

    document.getElementById("audit_modal_title").innerText = `Giải Trình Phân Bổ: ${detail.deptName} ➔ ${rdName}`;
    
    const body = document.getElementById("audit_modal_body");
    body.innerHTML = `
        <div class="audit-list-item" style="border-bottom: 1.5px dashed var(--border-color); padding-bottom: 10px; margin-bottom: 12px; display: block; height: auto;">
            <strong style="display: block; margin-bottom: 6px;">1. Cấu thành chi phí bộ phận gián tiếp [${detail.deptName}]:</strong>
            <div style="font-size: 0.85rem; color: var(--text-secondary); padding-left: 14px; line-height: 1.6;">
                • Chi phí Lương nhân sự gộp: <span style="float: right; font-weight: 500;">${formatCurrency(sdSalary)}</span><br>
                • Chi phí Mặt bằng sử dụng: <span style="float: right; font-weight: 500;">${formatCurrency(sdRent)}</span><br>
                <strong style="color: var(--text-primary); margin-top: 4px; display: inline-block;">➔ Tổng quỹ chi phí cấu thành:</strong> 
                <strong style="float: right; color: var(--primary);">${formatCurrency(detail.poolTotal)}</strong>
            </div>
        </div>
        
        <div class="audit-list-item" style="display: block; height: auto; margin-bottom: 12px;">
            <strong style="display: block; margin-bottom: 6px;">2. Công thức phân bổ sang khối [${rdName}]:</strong>
            <div style="font-size: 0.85rem; line-height: 1.6; padding-left: 14px;">
                • Cơ sở phân chia chi phí: <strong style="color: var(--text-primary); float: right;">${detail.driverName}</strong><br>
                • Chỉ số riêng của ${rdName}: <strong style="color: var(--text-primary); float: right;">${detail.rdValue.toLocaleString()}</strong><br>
                • Tổng chỉ số toàn trường: <strong style="color: var(--text-primary); float: right;">${detail.sumValue.toLocaleString()}</strong><br>
                • Tỷ lệ gánh chi phí: <strong class="text-success" style="float: right;">${detail.ratioPercent}%</strong>
            </div>
        </div>

        <div class="audit-list-item" style="font-size: 1.05rem; font-weight: bold; margin-top: 15px; border-top: 1px solid var(--border-color); padding-top: 10px;">
            <strong>Số tiền phân bổ cuối cùng:</strong>
            <span class="text-success">${formatCurrency(detail.allocatedVal)}</span>
        </div>
        
        <div class="audit-calculation" style="margin-top: 12px; font-size: 0.78rem; background: rgba(0,0,0,0.02); padding: 10px; border-radius: 6px; color: var(--text-secondary); line-height: 1.5;">
            <strong>Phép toán tính toán:</strong><br>
            Chi phí phân bổ = Tổng chi phí cấu thành x (Chỉ số riêng / Tổng chỉ số)<br>
            = ${formatCurrency(detail.poolTotal)} x (${detail.rdValue} / ${detail.sumValue})<br>
            = ${formatCurrency(detail.allocatedVal)}
        </div>
    `;

    document.getElementById("audit_modal").classList.add("open");
}

function openDirectSalaryAuditModal(rdId) {
    const rd = appState.departments.find(d => d.id === rdId);
    if (!rd) return;

    document.getElementById("audit_modal_title").innerText = `Giải Trình Cấu Thành Lương Trực Tiếp: ${rd.name}`;
    const body = document.getElementById("audit_modal_body");

    // Analyze all employees and classify them relative to rdId
    let permanentList = [];
    let transferInList = [];
    let transferOutList = [];

    appState.employees.forEach(emp => {
        if (!emp.isMultiLevel) {
            if (emp.deptId === rdId) {
                permanentList.push({
                    name: emp.name,
                    grossSalary: emp.salary,
                    contribution: emp.salary
                });
            }
        } else {
            // Multi-level employee
            const ratios = emp.ratios || {};
            let totalRatio = 0;
            Object.values(ratios).forEach(r => totalRatio += r);
            if (totalRatio <= 0) return;

            const ratioVal = ratios[rdId] || 0;
            const share = ratioVal / totalRatio;
            const contribution = emp.salary * share;

            if (emp.deptId === rdId) {
                // Main department is rdId, but they are kiêm nhiệm
                const transferredOut = emp.salary * (1 - share);
                transferOutList.push({
                    name: emp.name,
                    grossSalary: emp.salary,
                    ownSharePercent: Math.round(share * 100),
                    contribution: contribution,
                    transferredOut: transferredOut
                });
            } else {
                // Main department is different, but they contribute to rdId
                if (contribution > 0) {
                    const originDept = appState.departments.find(d => d.id === emp.deptId)?.name || "Khác";
                    transferInList.push({
                        name: emp.name,
                        originDept: originDept,
                        grossSalary: emp.salary,
                        sharePercent: Math.round(share * 100),
                        contribution: contribution
                    });
                }
            }
        }
    });

    let listHtml = `
        <div style="font-size: 0.9rem; margin-bottom: 12px; line-height: 1.5; color: var(--text-secondary);">
            Báo cáo chi tiết nguồn nhân sự kiêm nhiệm & cơ hữu gánh lương trực tiếp của khối <strong>${rd.name}</strong>:
        </div>
    `;

    // 1. Permanent Staff
    listHtml += `<h4 style="margin: 14px 0 6px 0; color: #FFF; font-size: 0.9rem;"><i class="fa-solid fa-user-tie text-success"></i> 1. Nhân Sự Cơ Hữu Đơn Ban (100% gánh ở đây)</h4>`;
    if (permanentList.length === 0) {
        listHtml += `<div style="font-size:0.8rem; color: var(--text-secondary); padding-left: 20px; font-style: italic; margin-bottom: 10px;">Không có nhân sự cố định</div>`;
    } else {
        listHtml += `
            <table class="pl-table" style="width: 100%; font-size: 0.85rem; border-collapse: collapse; margin-bottom: 15px;">
                <thead>
                    <tr style="border-bottom: 1px solid var(--border-color); text-align: left; opacity:0.7;">
                        <th style="padding: 4px 6px;">Họ và Tên</th>
                        <th style="padding: 4px 6px; text-align: right;">Mức Lương tháng</th>
                        <th style="padding: 4px 6px; text-align: right;">Đóng góp thực tế</th>
                    </tr>
                </thead>
                <tbody>
        `;
        let sumPerm = 0;
        permanentList.forEach(emp => {
            sumPerm += emp.contribution;
            listHtml += `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.03);">
                    <td style="padding: 6px;"><strong>${emp.name}</strong></td>
                    <td style="padding: 6px; text-align: right;">${formatCurrency(emp.grossSalary)}</td>
                    <td style="padding: 6px; text-align: right; font-weight: 600; color: var(--success);">${formatCurrency(emp.contribution)}</td>
                </tr>
            `;
        });
        listHtml += `
                </tbody>
                <tfoot>
                    <tr style="font-weight: bold; border-top: 1px solid var(--border-color);">
                        <td style="padding: 6px;">Cộng cơ hữu:</td>
                        <td colspan="2" style="padding: 6px; text-align: right; color: var(--success);">${formatCurrency(sumPerm)}</td>
                    </tr>
                </tfoot>
            </table>
        `;
    }

    // 2. Kiêm nhiệm chuyển đến
    listHtml += `<h4 style="margin: 14px 0 6px 0; color: #FFF; font-size: 0.9rem;"><i class="fa-solid fa-circle-arrow-down text-primary"></i> 2. Nhân Sự Kiêm Nhiệm Chuyển Đến (Nhận thêm +)</h4>`;
    if (transferInList.length === 0) {
        listHtml += `<div style="font-size:0.8rem; color: var(--text-secondary); padding-left: 20px; font-style: italic; margin-bottom: 10px;">Không có giáo viên dạy chéo từ khối khác chuyển sang</div>`;
    } else {
        listHtml += `
            <table class="pl-table" style="width: 100%; font-size: 0.85rem; border-collapse: collapse; margin-bottom: 15px;">
                <thead>
                    <tr style="border-bottom: 1px solid var(--border-color); text-align: left; opacity:0.7;">
                        <th style="padding: 4px 6px;">Họ và Tên</th>
                        <th style="padding: 4px 6px;">Từ Bộ phận chính</th>
                        <th style="padding: 4px 6px; text-align: right;">Lương gốc</th>
                        <th style="padding: 4px 6px; text-align: right;">Tỉ lệ gánh (%)</th>
                        <th style="padding: 4px 6px; text-align: right;">Cộng thêm vào khối</th>
                    </tr>
                </thead>
                <tbody>
        `;
        let sumIn = 0;
        transferInList.forEach(emp => {
            sumIn += emp.contribution;
            listHtml += `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.03);">
                    <td style="padding: 6px;"><strong>${emp.name}</strong></td>
                    <td style="padding: 6px; font-size: 0.8rem; color: var(--text-secondary);">${emp.originDept}</td>
                    <td style="padding: 6px; text-align: right;">${formatCurrency(emp.grossSalary)}</td>
                    <td style="padding: 6px; text-align: right; color: var(--primary); font-weight:600;">${emp.sharePercent}%</td>
                    <td style="padding: 6px; text-align: right; font-weight: 600; color: var(--success);">${formatCurrency(emp.contribution)}</td>
                </tr>
            `;
        });
        listHtml += `
                </tbody>
                <tfoot>
                    <tr style="font-weight: bold; border-top: 1px solid var(--border-color);">
                        <td colspan="2" style="padding: 6px;">Cộng kiêm nhiệm nhận thêm:</td>
                        <td colspan="3" style="padding: 6px; text-align: right; color: var(--success);">${formatCurrency(sumIn)}</td>
                    </tr>
                </tfoot>
            </table>
        `;
    }

    // 3. Kiêm nhiệm chuyển đi
    listHtml += `<h4 style="margin: 14px 0 6px 0; color: #FFF; font-size: 0.9rem;"><i class="fa-solid fa-circle-arrow-up text-warning"></i> 3. Nhân Sự Kiêm Nhiệm Chuyển Đi (Cắt giảm -)</h4>`;
    if (transferOutList.length === 0) {
        listHtml += `<div style="font-size:0.8rem; color: var(--text-secondary); padding-left: 20px; font-style: italic; margin-bottom: 10px;">Không có giáo viên của khối đi kiêm nhiệm dạy chéo khối khác</div>`;
    } else {
        listHtml += `
            <table class="pl-table" style="width: 100%; font-size: 0.85rem; border-collapse: collapse; margin-bottom: 15px;">
                <thead>
                    <tr style="border-bottom: 1px solid var(--border-color); text-align: left; opacity:0.7;">
                        <th style="padding: 4px 6px;">Họ và Tên</th>
                        <th style="padding: 4px 6px; text-align: right;">Lương gốc</th>
                        <th style="padding: 4px 6px; text-align: right;">Giữ lại khối (%)</th>
                        <th style="padding: 4px 6px; text-align: right;">Khấu trừ sang ban khác</th>
                        <th style="padding: 4px 6px; text-align: right;">Thực tế gánh tại khối</th>
                    </tr>
                </thead>
                <tbody>
        `;
        let sumOutKeep = 0;
        let sumOutCut = 0;
        transferOutList.forEach(emp => {
            sumOutKeep += emp.contribution;
            sumOutCut += emp.transferredOut;
            listHtml += `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.03);">
                    <td style="padding: 6px;"><strong>${emp.name}</strong></td>
                    <td style="padding: 6px; text-align: right;">${formatCurrency(emp.grossSalary)}</td>
                    <td style="padding: 6px; text-align: right; color: var(--warning); font-weight:600;">${emp.ownSharePercent}%</td>
                    <td style="padding: 6px; text-align: right; color: var(--text-muted); font-style:italic;">-${formatCurrency(emp.transferredOut)}</td>
                    <td style="padding: 6px; text-align: right; font-weight: 600; color: var(--success);">${formatCurrency(emp.contribution)}</td>
                </tr>
            `;
        });
        listHtml += `
                </tbody>
                <tfoot>
                    <tr style="font-weight: bold; border-top: 1px solid var(--border-color);">
                        <td style="padding: 6px;">Tổng giữ lại & Khấu trừ:</td>
                        <td style="padding: 6px; text-align: right;"></td>
                        <td style="padding: 6px; text-align: right;"></td>
                        <td style="padding: 6px; text-align: right; color: var(--text-muted); font-style:italic;">-${formatCurrency(sumOutCut)}</td>
                        <td style="padding: 6px; text-align: right; color: var(--success);">${formatCurrency(sumOutKeep)}</td>
                    </tr>
                </tfoot>
            </table>
        `;
    }

    // 4. Tổng quỹ lương
    const totalSalaryDirect = (permanentList.reduce((acc, curr) => acc + curr.contribution, 0) +
                               transferInList.reduce((acc, curr) => acc + curr.contribution, 0) +
                               transferOutList.reduce((acc, curr) => acc + curr.contribution, 0));
    listHtml += `
        <div style="margin-top: 20px; padding: 12px; background: rgba(52, 199, 89, 0.08); border: 1.5px solid var(--primary); border-radius: 6px; display: flex; justify-content: space-between; align-items: center; font-size: 1rem; font-weight: bold; color: #FFF;">
            <span>➔ TỔNG QUỸ LƯƠNG TRỰC TIẾP THỰC TẾ:</span>
            <span style="font-size: 1.15rem; color: var(--success);">${formatCurrency(totalSalaryDirect)}</span>
        </div>
    `;

    body.innerHTML = listHtml;
    document.getElementById("audit_modal").classList.add("open");
}

function openSalaryAuditModal(rdId) {
    const rd = appState.departments.find(d => d.id === rdId);
    if (!rd) return;

    const data = allocationResult;
    const supportDepts = appState.departments.filter(d => d.type === "support" && !d.isUtility);

    document.getElementById("audit_modal_title").innerText = `Giải Trình Lương Gián Tiếp Phân Bổ: ${rd.name}`;
    
    const body = document.getElementById("audit_modal_body");
    let listHtml = `
        <div style="font-size: 0.9rem; margin-bottom: 12px; line-height: 1.5; color: var(--text-secondary);">
            Dưới đây là chi tiết nguồn lương gián tiếp gộp được phân bổ từ các phòng ban chức năng về cho khối <strong>${rd.name}</strong> để cấu thành nên chi phí lương thực tế:
        </div>
        <table class="pl-table" style="width: 100%; font-size: 0.85rem; border-collapse: collapse;">
            <thead>
                <tr style="border-bottom: 1px solid var(--border-color); text-align: left;">
                    <th style="padding: 6px;">Ban gián tiếp</th>
                    <th style="padding: 6px;">Cơ sở phân chia</th>
                    <th style="padding: 6px; text-align: right;">Lương gốc</th>
                    <th style="padding: 6px; text-align: right;">Tỷ lệ gánh</th>
                    <th style="padding: 6px; text-align: right;">Lương phân bổ</th>
                </tr>
            </thead>
            <tbody>
    `;

    let totalAllocated = 0;
    supportDepts.forEach(sd => {
        const salaryAllocated = data.allocatedSalaryCosts[rdId]?.[sd.id] || 0;
        if (salaryAllocated <= 0) return;

        totalAllocated += salaryAllocated;
        const details = data.allocatedDetails[rdId]?.[sd.id] || {};
        const ratioPercent = details.ratioPercent || 0;

        listHtml += `
            <tr style="border-bottom: 1px solid rgba(0,0,0,0.03);">
                <td style="padding: 6px;"><strong>${sd.name}</strong></td>
                <td style="padding: 6px; font-size: 0.75rem; color: var(--text-secondary);">Phân bổ thủ công (%)</td>
                <td style="padding: 6px; text-align: right;">${formatCurrency(data.indirectSalary[sd.id] || 0)}</td>
                <td style="padding: 6px; text-align: right; color: var(--success);">${ratioPercent}%</td>
                <td style="padding: 6px; text-align: right; font-weight: 500; color: var(--primary);">${formatCurrency(salaryAllocated)}</td>
            </tr>
        `;
    });

    listHtml += `
            </tbody>
            <tfoot>
                <tr style="border-top: 1.5px solid var(--border-color); font-weight: bold; font-size: 0.9rem;">
                    <td colspan="4" style="padding: 8px 6px;">Tổng lương gián tiếp:</td>
                    <td style="padding: 8px 6px; text-align: right; color: var(--primary);">${formatCurrency(totalAllocated)}</td>
                </tr>
            </tfoot>
        </table>
        
        <div style="margin-top: 15px; padding: 10px; background: rgba(16,185,129,0.04); border-left: 3px solid var(--primary); border-radius: 4px; font-size: 0.8rem; line-height: 1.5; color: var(--text-secondary);">
            💡 <strong>Giải thích:</strong> Lương gián tiếp phân bổ được lấy từ quỹ lương thực tế của mỗi ban gián tiếp (bao gồm cả nhân sự chính thức lẫn lương kiêm nhiệm chuyển về), nhân với tỷ lệ gánh chi phí tương ứng của khối ${rd.name}.
        </div>
    `;

    body.innerHTML = listHtml;
    document.getElementById("audit_modal").classList.add("open");
}

function openRentAuditModal(rdId) {
    const rd = appState.departments.find(d => d.id === rdId);
    if (!rd) return;

    const data = allocationResult;
    const supportDepts = appState.departments.filter(d => d.type === "support" && !d.isUtility);

    document.getElementById("audit_modal_title").innerText = `Giải Trình Mặt Bằng Gián Tiếp Phân Bổ: ${rd.name}`;
    
    const body = document.getElementById("audit_modal_body");
    let listHtml = `
        <div style="font-size: 0.9rem; margin-bottom: 12px; line-height: 1.5; color: var(--text-secondary);">
            Dưới đây là chi tiết tiền thuê văn phòng/không gian làm việc của các ban gián tiếp được phân bổ về cho khối <strong>${rd.name}</strong> gánh chịu:
        </div>
        <table class="pl-table" style="width: 100%; font-size: 0.85rem; border-collapse: collapse;">
            <thead>
                <tr style="border-bottom: 1px solid var(--border-color); text-align: left;">
                    <th style="padding: 6px;">Ban gián tiếp</th>
                    <th style="padding: 6px;">Cơ sở phân chia</th>
                    <th style="padding: 6px; text-align: right;">Tiền thuê gốc</th>
                    <th style="padding: 6px; text-align: right;">Tỷ lệ gánh</th>
                    <th style="padding: 6px; text-align: right;">Tiền thuê phân bổ</th>
                </tr>
            </thead>
            <tbody>
    `;

    let totalAllocated = 0;
    supportDepts.forEach(sd => {
        const rentAllocated = data.allocatedRentCosts[rdId]?.[sd.id] || 0;
        if (rentAllocated <= 0) return;

        totalAllocated += rentAllocated;
        const details = data.allocatedDetails[rdId]?.[sd.id] || {};
        const ratioPercent = details.ratioPercent || 0;

        listHtml += `
            <tr style="border-bottom: 1px solid rgba(0,0,0,0.03);">
                <td style="padding: 6px;"><strong>${sd.name}</strong></td>
                <td style="padding: 6px; font-size: 0.75rem; color: var(--text-secondary);">Phân bổ thủ công (%)</td>
                <td style="padding: 6px; text-align: right;">${formatCurrency(data.indirectRent[sd.id] || 0)}</td>
                <td style="padding: 6px; text-align: right; color: var(--success);">${ratioPercent}%</td>
                <td style="padding: 6px; text-align: right; font-weight: 500; color: var(--primary);">${formatCurrency(rentAllocated)}</td>
            </tr>
        `;
    });

    listHtml += `
            </tbody>
            <tfoot>
                <tr style="border-top: 1.5px solid var(--border-color); font-weight: bold; font-size: 0.9rem;">
                    <td colspan="4" style="padding: 8px 6px;">Tổng mặt bằng gián tiếp:</td>
                    <td style="padding: 8px 6px; text-align: right; color: var(--primary);">${formatCurrency(totalAllocated)}</td>
                </tr>
            </tfoot>
        </table>
        
        <div style="margin-top: 15px; padding: 10px; background: rgba(16,185,129,0.04); border-left: 3px solid var(--primary); border-radius: 4px; font-size: 0.8rem; line-height: 1.5; color: var(--text-secondary);">
            💡 <strong>Giải thích:</strong> Tiền mặt bằng gián tiếp phân bổ được cộng dồn từ tiền thuê văn phòng vật lý mà các ban gián tiếp sử dụng thực tế (chia đều từ các dãy nhà), sau đó nhân với tỷ lệ gánh chi phí tương ứng của khối ${rd.name}.
        </div>
    `;

    body.innerHTML = listHtml;
    document.getElementById("audit_modal").classList.add("open");
}

function openUtilityAuditModal(rdId, utilityId) {
    const rd = appState.departments.find(d => d.id === rdId);
    const ud = appState.departments.find(d => d.id === utilityId);
    if (!rd || !ud) return;

    const data = allocationResult || {};
    const detail = data.allocatedDetails?.[rdId]?.[utilityId];
    if (!detail) return;

    const billTotal = appState.utilityCosts?.[utilityId] || 0;
    const allocated = data.allocatedUtilityCosts?.[rdId]?.[utilityId] || 0;

    let explanationText = "";
    if (utilityId === "dept_dien") {
        explanationText = `Chi phí <strong>Điện</strong> phân bổ cho khối <strong>${rd.name}</strong> theo phương pháp **${detail.driverName}**:`;
    } else {
        explanationText = `Chi phí <strong>Nước</strong> sinh hoạt phân bổ cho khối <strong>${rd.name}</strong> theo phương pháp **${detail.driverName}**:`;
    }

    let unitLabel = "đơn vị";
    if (detail.driverName.includes("Sỹ số") || detail.driverName.includes("học sinh")) unitLabel = "Học sinh";
    else if (detail.driverName.includes("nhân sự") || detail.driverName.includes("người")) unitLabel = "Người";
    else if (detail.driverName.includes("thủ công") || detail.driverName.includes("%")) unitLabel = "% tỷ lệ";

    document.getElementById("audit_modal_title").innerText = `Giải Trình Phân Bổ ${ud.name}: ${rd.name}`;
    
    const body = document.getElementById("audit_modal_body");
    body.innerHTML = `
        <div style="font-size: 0.9rem; margin-bottom: 12px; line-height: 1.5; color: var(--text-secondary);">
            ${explanationText}
        </div>
        
        <div style="background: rgba(0,0,0,0.015); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 14px; margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: var(--text-secondary);">Tổng hóa đơn ${ud.name} cả trường:</span>
                <strong style="color: var(--text-primary);">${formatCurrency(billTotal)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: var(--text-secondary);">Chỉ số thực tế gánh của khối ${rd.name}:</span>
                <strong style="color: var(--primary);">${detail.rdValue.toLocaleString()} ${unitLabel}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: var(--text-secondary);">Tổng chỉ số toàn trường gộp:</span>
                <strong style="color: var(--text-primary);">${detail.sumValue.toLocaleString()} ${unitLabel}</strong>
            </div>
            <div style="border-top: 1px dashed var(--border-color); margin: 8px 0; padding-top: 8px; display: flex; justify-content: space-between;">
                <span style="color: var(--text-secondary); font-weight: 500;">Tỷ lệ gánh chi phí của khối:</span>
                <strong style="color: var(--success);">${detail.ratioPercent}%</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-secondary); font-weight: 600;">Số tiền phân bổ về khối:</span>
                <strong style="color: var(--primary); font-size: 1.05rem;">${formatCurrency(allocated)}</strong>
            </div>
        </div>

        <div style="margin-top: 15px; padding: 10px; background: rgba(16,185,129,0.04); border-left: 3px solid var(--primary); border-radius: 4px; font-size: 0.8rem; line-height: 1.5; color: var(--text-secondary);">
            💡 <strong>Công thức tính:</strong><br>
            Số tiền phân bổ = Tổng hóa đơn × (Chỉ số riêng / Tổng chỉ số)<br>
            = ${formatCurrency(billTotal)} × (${detail.rdValue.toLocaleString()} / ${detail.sumValue.toLocaleString()}) = ${formatCurrency(allocated)}
        </div>
    `;

    document.getElementById("audit_modal").classList.add("open");
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove("open");
}


// 3.2 RENDERING VIEW: DEPARTMENTS (CRUD)
function renderDepartments() {
    const listRevenue = document.getElementById("dept_list_revenue");
    const listSupport = document.getElementById("dept_list_support");
    const listUtility = document.getElementById("dept_list_utility");
    
    if (listRevenue) listRevenue.innerHTML = "";
    if (listSupport) listSupport.innerHTML = "";
    if (listUtility) listUtility.innerHTML = "";

    const revenueSelects = document.querySelectorAll(".revenue-dept-select");
    revenueSelects.forEach(sel => {
        sel.innerHTML = '<option value="">-- Chọn Khối Trực tiếp --</option>';
        appState.departments.filter(d => d.type === "revenue").forEach(rd => {
            sel.innerHTML += `<option value="${rd.id}">${rd.name}</option>`;
        });
    });

    const revenueDepts = appState.departments.filter(d => d.type === "revenue");
    const supportDepts = appState.departments.filter(d => d.type === "support" && !d.isUtility);
    const utilityDepts = appState.departments.filter(d => d.type === "support" && d.isUtility);

    // 1. RENDER KHỐI TRỰC TIẾP (REVENUE CENTERS)
    revenueDepts.forEach((dept, index) => {
        const rev = appState.revenues[dept.id] || 0;
        const stud = dept.students || 0;
        
        const rowHtml = `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <strong style="color: var(--success); cursor: pointer;" onclick="openDepartmentCostAuditModal('${dept.id}')" title="Nhấp chuột để xem giải trình cơ cấu chi phí chi tiết">
                        ${dept.name} <i class="fa-solid fa-magnifying-glass-chart" style="font-size: 0.7rem; margin-left: 4px; opacity: 0.8;"></i>
                    </strong>
                </td>
                <td>
                    <div class="priority-container" style="display: inline-block;">
                        <input type="number" class="base-select-dropdown" style="width:100px; display:inline;" value="${stud}" onchange="updateDeptStudents('${dept.id}', this.value)">
                        <span class="priority-dot priority-dot-blue" title="Cần điền Sỹ số học sinh thực tế để phân bổ tự động Điện & Nước"></span>
                    </div>
                </td>
                <td>
                    <div class="priority-container" style="display: inline-block;">
                        <input type="text" class="base-select-dropdown" style="width:160px; display:inline; font-weight: 500;" value="${formatNumberWithDots(rev)}" oninput="handleMoneyInput(this)" onchange="updateRevenue('${dept.id}', this.value)">
                        <span class="priority-dot" title="Cần điền Doanh thu thực tế hàng tháng của khối để tính P&L"></span>
                    </div>
                </td>
                <td class="text-center">
                    <button class="btn btn-danger btn-sm" onclick="deleteDepartment('${dept.id}')">
                        <i class="fas fa-trash"></i> Xóa
                    </button>
                </td>
            </tr>
        `;
        if (listRevenue) listRevenue.innerHTML += rowHtml;
    });

    // 2. RENDER CÁC BAN GIÁN TIẾP (SUPPORT CENTERS)
    supportDepts.forEach((dept, index) => {
        const method = dept.allocationMethod || "manual";
        
        // 2.1 Dropdown phương pháp phân bổ
        let dropdownHtml = `
            <select onchange="updateAllocationMethod('${dept.id}', this.value)" class="base-select-dropdown" style="padding: 4px 8px; font-size: 0.8rem; font-weight: 600; cursor: pointer; border: 1px solid var(--border-color); border-radius: 4px; outline: none; background: #FFF; width: 100%;">
                <option value="manual" ${method === "manual" ? "selected" : ""}>🎛️ Phân bổ thủ công (%)</option>
                <option value="student" ${method === "student" ? "selected" : ""}>👥 Phân bổ theo Sỹ số học sinh</option>
                <option value="staff" ${method === "staff" ? "selected" : ""}>🧑‍🏫 Phân bổ theo Số lượng nhân sự</option>
            </select>
        `;

        // Kính lúp giải trình
        const hasNote = dept.note && dept.note.trim() !== "";
        const noteIconClass = "fa-solid fa-magnifying-glass";
        const noteIconStyle = hasNote 
            ? "cursor: pointer; font-size: 0.85rem; color: var(--primary); transition: transform 0.2s; display: inline-block; padding: 6px 8px; background: rgba(0, 122, 255, 0.08); border-radius: 4px;" 
            : "cursor: pointer; font-size: 0.85rem; color: var(--text-secondary); opacity: 0.4; transition: transform 0.2s; display: inline-block; padding: 6px 8px;";
        
        const safeNoteContent = hasNote 
            ? dept.note.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
            : "";

        const tooltipText = hasNote 
            ? `<strong style="color: #34C759; display: block; margin-bottom: 6px; font-size: 0.82rem;"><i class="fa-solid fa-square-check"></i> Đã giải trình phương án:</strong><span style="font-style: italic; white-space: pre-wrap; display: block; font-weight: 500; font-size: 0.8rem; color: #E5E5EA;">${safeNoteContent}</span><hr style="border: 0; border-top: 1px solid rgba(255, 255, 255, 0.15); margin: 8px 0 6px 0;"><span style="font-size: 0.75rem; opacity: 0.7; display: block; text-align: center; color: #007AFF;"><i class="fa-solid fa-pen"></i> Nhấp chuột để chỉnh sửa</span>`
            : `<span style="opacity: 0.9; display: block; text-align: center;"><i class="fa-solid fa-pen-fancy"></i> Chưa có giải trình.<br>Nhấp chuột để thêm mới!</span>`;

        const noteIconHtml = `
            <div class="dept-note-tooltip-trigger">
                <i class="${noteIconClass}" style="${noteIconStyle}" onclick="editDepartmentNote('${dept.id}')" onmouseover="this.style.transform='scale(1.25)'" onmouseout="this.style.transform='scale(1)'"></i>
                <div class="custom-note-tooltip">
                    ${tooltipText}
                </div>
            </div>
        `;

        const dropdownWrapperHtml = `
            <div style="display: flex; align-items: center; gap: 8px;">
                ${dropdownHtml}
                ${noteIconHtml}
            </div>
        `;

        let mainAllocationHtml = "";

        if (method === "student") {
            const activeStudents = getActiveStudentCounts();
            const listText = Object.keys(activeStudents).map(did => {
                const name = appState.departments.find(d => d.id === did)?.name.replace("Khối ", "").replace("Ban ", "") || did;
                return `${name}: ${activeStudents[did]} HS`;
            }).join(", ");

            mainAllocationHtml = `
                <div style="font-size:0.75rem; color: var(--success); font-weight:500; padding: 6px 10px; background: rgba(52, 199, 89, 0.04); border: 1px dashed rgba(52, 199, 89, 0.2); border-radius: 6px; display: inline-flex; align-items: center; gap: 6px; white-space: normal;">
                    <i class="fa-solid fa-circle-check"></i>
                    <span>Tự động kết chuyển theo sỹ số học sinh (${listText})</span>
                </div>
            `;
        } else if (method === "staff") {
            const staffCounts = getStaffCounts();
            const listText = Object.keys(staffCounts).map(did => {
                const name = appState.departments.find(d => d.id === did)?.name.replace("Khối ", "").replace("Ban ", "") || did;
                const count = staffCounts[did].toFixed(1).replace(".0", "");
                return `${name}: ${count} người`;
            }).join(", ");

            mainAllocationHtml = `
                <div style="font-size:0.75rem; color: var(--success); font-weight:500; padding: 6px 10px; background: rgba(52, 199, 89, 0.04); border: 1px dashed rgba(52, 199, 89, 0.2); border-radius: 6px; display: inline-flex; align-items: center; gap: 6px; white-space: normal;">
                    <i class="fa-solid fa-circle-check"></i>
                    <span>Tự động kết chuyển theo định biên nhân sự (${listText})</span>
                </div>
            `;
        } else {
            // manual pct
            let totalPct = 0;
            revenueDepts.forEach(rd => {
                const val = (appState.drivers.custom_percent?.[dept.id]?.[rd.id] !== undefined)
                    ? appState.drivers.custom_percent[dept.id][rd.id]
                    : 25;
                totalPct += val;
            });

            let badgeHtml = "";
            if (totalPct === 100) {
                badgeHtml = `<span id="dept_badge_${dept.id}" class="badge badge-revenue" style="font-size:0.7rem; padding: 2px 6px; display:inline-block;"><i class="fa-solid fa-circle-check"></i> Đủ 100%</span>`;
            } else if (totalPct < 100) {
                badgeHtml = `<span id="dept_badge_${dept.id}" class="badge" style="background-color: rgba(255, 149, 0, 0.08); color: var(--warning); font-size:0.7rem; padding: 2px 6px; display:inline-block;"><i class="fa-solid fa-circle-exclamation"></i> Tổng: ${totalPct}% (Thiếu ${100 - totalPct}%)</span>`;
            } else {
                badgeHtml = `<span id="dept_badge_${dept.id}" class="badge" style="background-color: rgba(255, 59, 48, 0.08); color: #FF3B30; font-size:0.7rem; padding: 2px 6px; display:inline-block;"><i class="fa-solid fa-circle-xmark"></i> Tổng: ${totalPct}% (Thừa ${totalPct - 100}%)</span>`;
            }

            let inputsHtml = `<div class="ratios-grid" style="padding: 6px; grid-template-columns: repeat(4, 1fr); gap: 6px; background: rgba(0,0,0,0.015); border: 1px dashed var(--border-color); border-radius: 4px; margin-top: 6px;">`;
            revenueDepts.forEach(rd => {
                const val = (appState.drivers.custom_percent?.[dept.id]?.[rd.id] !== undefined)
                    ? appState.drivers.custom_percent[dept.id][rd.id]
                    : 25;
                inputsHtml += `
                    <div class="ratio-input-wrapper">
                        <label style="font-size:0.65rem; color: var(--text-secondary); text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">
                            ${rd.name.replace("Khối ", "").replace("Ban ", "")} (%)
                        </label>
                        <input type="number" min="0" max="100" class="base-select-dropdown" style="padding: 2px 4px; font-size: 0.75rem; width: 100%; display: block;" 
                          value="${val}" onchange="updateCustomPercent('${dept.id}', '${rd.id}', this.value)">
                    </div>
                `;
            });
            inputsHtml += `</div>`;

            mainAllocationHtml = `
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    ${badgeHtml}
                </div>
                ${inputsHtml}
            `;
        }

        const rowHtml = `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <strong style="color: var(--primary); cursor: pointer;" onclick="openDepartmentCostAuditModal('${dept.id}')" title="Nhấp chuột để xem giải trình cơ cấu chi phí chi tiết">
                        ${dept.name} <i class="fa-solid fa-magnifying-glass-chart" style="font-size: 0.7rem; margin-left: 4px; opacity: 0.8;"></i>
                    </strong>
                </td>
                <td>${dropdownWrapperHtml}</td>
                <td>${mainAllocationHtml}</td>
                <td class="text-center">
                    <button class="btn btn-danger btn-sm" onclick="deleteDepartment('${dept.id}')">
                        <i class="fas fa-trash"></i> Xóa
                    </button>
                </td>
            </tr>
        `;
        if (listSupport) listSupport.innerHTML += rowHtml;
    });

    // 3. RENDER HẠNG MỤC TIỆN ÍCH & ĐIỆN NƯỚC (UTILITY COSTS)
    utilityDepts.forEach((dept, index) => {
        const bill = appState.utilityCosts?.[dept.id] || 0;
        const method = dept.allocationMethod || "student"; // Tiện ích mặc định theo sỹ số

        // 3.1 Dropdown phân bổ tiện ích
        let dropdownHtml = `
            <select onchange="updateAllocationMethod('${dept.id}', this.value)" class="base-select-dropdown" style="padding: 4px 8px; font-size: 0.8rem; font-weight: 600; cursor: pointer; border: 1px solid var(--border-color); border-radius: 4px; outline: none; background: #FFF; width: 100%;">
                <option value="student" ${method === "student" ? "selected" : ""}>👥 Phân bổ theo Sỹ số học sinh</option>
                <option value="staff" ${method === "staff" ? "selected" : ""}>🧑‍🏫 Phân bổ theo Số lượng nhân sự</option>
                <option value="manual" ${method === "manual" ? "selected" : ""}>🎛️ Phân bổ thủ công (%)</option>
            </select>
        `;

        // Kính lúp giải trình
        const hasNote = dept.note && dept.note.trim() !== "";
        const noteIconClass = "fa-solid fa-magnifying-glass";
        const noteIconStyle = hasNote 
            ? "cursor: pointer; font-size: 0.85rem; color: var(--primary); transition: transform 0.2s; display: inline-block; padding: 6px 8px; background: rgba(0, 122, 255, 0.08); border-radius: 4px;" 
            : "cursor: pointer; font-size: 0.85rem; color: var(--text-secondary); opacity: 0.4; transition: transform 0.2s; display: inline-block; padding: 6px 8px;";
        
        const safeNoteContent = hasNote 
            ? dept.note.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
            : "";

        const tooltipText = hasNote 
            ? `<strong style="color: #34C759; display: block; margin-bottom: 6px; font-size: 0.82rem;"><i class="fa-solid fa-square-check"></i> Đã giải trình phương án:</strong><span style="font-style: italic; white-space: pre-wrap; display: block; font-weight: 500; font-size: 0.8rem; color: #E5E5EA;">${safeNoteContent}</span><hr style="border: 0; border-top: 1px solid rgba(255, 255, 255, 0.15); margin: 8px 0 6px 0;"><span style="font-size: 0.75rem; opacity: 0.7; display: block; text-align: center; color: #007AFF;"><i class="fa-solid fa-pen"></i> Nhấp chuột để chỉnh sửa</span>`
            : `<span style="opacity: 0.9; display: block; text-align: center;"><i class="fa-solid fa-pen-fancy"></i> Chưa có giải trình.<br>Nhấp chuột để thêm mới!</span>`;

        const noteIconHtml = `
            <div class="dept-note-tooltip-trigger">
                <i class="${noteIconClass}" style="${noteIconStyle}" onclick="editDepartmentNote('${dept.id}')" onmouseover="this.style.transform='scale(1.25)'" onmouseout="this.style.transform='scale(1)'"></i>
                <div class="custom-note-tooltip">
                    ${tooltipText}
                </div>
            </div>
        `;

        const dropdownWrapperHtml = `
            <div style="display: flex; align-items: center; gap: 8px;">
                ${dropdownHtml}
                ${noteIconHtml}
            </div>
        `;

        let mainAllocationHtml = "";

        if (method === "student") {
            const activeStudents = getActiveStudentCounts();
            const listText = Object.keys(activeStudents).map(did => {
                const name = appState.departments.find(d => d.id === did)?.name.replace("Khối ", "").replace("Ban ", "") || did;
                return `${name}: ${activeStudents[did]} HS`;
            }).join(", ");

            mainAllocationHtml = `
                <div style="font-size:0.75rem; color: var(--success); font-weight:500; padding: 6px 10px; background: rgba(52, 199, 89, 0.04); border: 1px dashed rgba(52, 199, 89, 0.2); border-radius: 6px; display: inline-flex; align-items: center; gap: 6px; white-space: normal;">
                    <i class="fa-solid fa-circle-check"></i>
                    <span>Tự động theo sỹ số học sinh (${listText})</span>
                </div>
            `;
        } else if (method === "staff") {
            const staffCounts = getStaffCounts();
            const listText = Object.keys(staffCounts).map(did => {
                const name = appState.departments.find(d => d.id === did)?.name.replace("Khối ", "").replace("Ban ", "") || did;
                const count = staffCounts[did].toFixed(1).replace(".0", "");
                return `${name}: ${count} người`;
            }).join(", ");

            mainAllocationHtml = `
                <div style="font-size:0.75rem; color: var(--success); font-weight:500; padding: 6px 10px; background: rgba(52, 199, 89, 0.04); border: 1px dashed rgba(52, 199, 89, 0.2); border-radius: 6px; display: inline-flex; align-items: center; gap: 6px; white-space: normal;">
                    <i class="fa-solid fa-circle-check"></i>
                    <span>Tự động theo định biên nhân sự (${listText})</span>
                </div>
            `;
        } else {
            // manual pct
            let totalPct = 0;
            revenueDepts.forEach(rd => {
                const val = (appState.drivers.custom_percent?.[dept.id]?.[rd.id] !== undefined)
                    ? appState.drivers.custom_percent[dept.id][rd.id]
                    : 25;
                totalPct += val;
            });

            let badgeHtml = "";
            if (totalPct === 100) {
                badgeHtml = `<span id="dept_badge_${dept.id}" class="badge badge-revenue" style="font-size:0.7rem; padding: 2px 6px; display:inline-block;"><i class="fa-solid fa-circle-check"></i> Đủ 100%</span>`;
            } else if (totalPct < 100) {
                badgeHtml = `<span id="dept_badge_${dept.id}" class="badge" style="background-color: rgba(255, 149, 0, 0.08); color: var(--warning); font-size:0.7rem; padding: 2px 6px; display:inline-block;"><i class="fa-solid fa-circle-exclamation"></i> Tổng: ${totalPct}% (Thiếu ${100 - totalPct}%)</span>`;
            } else {
                badgeHtml = `<span id="dept_badge_${dept.id}" class="badge" style="background-color: rgba(255, 59, 48, 0.08); color: #FF3B30; font-size:0.7rem; padding: 2px 6px; display:inline-block;"><i class="fa-solid fa-circle-xmark"></i> Tổng: ${totalPct}% (Thừa ${totalPct - 100}%)</span>`;
            }

            let inputsHtml = `<div class="ratios-grid" style="padding: 6px; grid-template-columns: repeat(4, 1fr); gap: 6px; background: rgba(0,0,0,0.015); border: 1px dashed var(--border-color); border-radius: 4px; margin-top: 6px;">`;
            revenueDepts.forEach(rd => {
                const val = (appState.drivers.custom_percent?.[dept.id]?.[rd.id] !== undefined)
                    ? appState.drivers.custom_percent[dept.id][rd.id]
                    : 25;
                inputsHtml += `
                    <div class="ratio-input-wrapper">
                        <label style="font-size:0.65rem; color: var(--text-secondary); text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">
                            ${rd.name.replace("Khối ", "").replace("Ban ", "")} (%)
                        </label>
                        <input type="number" min="0" max="100" class="base-select-dropdown" style="padding: 2px 4px; font-size: 0.75rem; width: 100%; display: block;" 
                          value="${val}" onchange="updateCustomPercent('${dept.id}', '${rd.id}', this.value)">
                    </div>
                `;
            });
            inputsHtml += `</div>`;

            mainAllocationHtml = `
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    ${badgeHtml}
                </div>
                ${inputsHtml}
            `;
        }

        const rowHtml = `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <strong style="color: var(--warning); cursor: pointer;" onclick="openDepartmentCostAuditModal('${dept.id}')" title="Nhấp chuột để xem giải trình cơ cấu chi phí chi tiết">
                        ${dept.name} <i class="fa-solid fa-magnifying-glass-chart" style="font-size: 0.7rem; margin-left: 4px; opacity: 0.8;"></i>
                    </strong>
                </td>
                <td>
                    <div class="priority-container" style="display: inline-block;">
                        <input type="text" class="base-select-dropdown" style="width:160px; display:inline; font-weight: bold; border-color: rgba(0, 122, 255, 0.3);" value="${formatNumberWithDots(bill)}" oninput="handleMoneyInput(this)" onchange="updateUtilityCost('${dept.id}', this.value)">
                        <span class="priority-dot" title="Cần điền Doanh thu thực tế hàng tháng của khối để tính P&L"></span>
                    </div>
                </td>
                <td>${dropdownWrapperHtml}</td>
                <td>${mainAllocationHtml}</td>
                <td class="text-center">
                    <button class="btn btn-danger btn-sm" onclick="deleteDepartment('${dept.id}')">
                        <i class="fas fa-trash"></i> Xóa
                    </button>
                </td>
            </tr>
        `;
        if (listUtility) listUtility.innerHTML += rowHtml;
    });

    // Load Boarding notes if elements exist
    const ratioNoteEl = document.getElementById("note_ratio_text");
    const facilityNoteEl = document.getElementById("note_facility_text");
    if (ratioNoteEl && appState.boardingNotes) {
        ratioNoteEl.value = appState.boardingNotes.ratioNote || "";
    }
    if (facilityNoteEl && appState.boardingNotes) {
        facilityNoteEl.value = appState.boardingNotes.facilityNote || "";
    }
}

// Lưu ghi chú cẩm nang phân bổ của khối Nội trú đặc thù
function saveBoardingNotes() {
    const ratioVal = document.getElementById("note_ratio_text").value;
    const facilityVal = document.getElementById("note_facility_text").value;
    appState.boardingNotes = {
        ratioNote: ratioVal,
        facilityNote: facilityVal
    };
    saveState();
}

// Bảng giải trình chi tiết cơ cấu chi phí phòng ban
function openDepartmentCostAuditModal(deptId) {
    const data = runAllocation();
    const dept = appState.departments.find(d => d.id === deptId);
    if (!dept) return;

    // Set title
    document.getElementById("audit_modal_title").innerHTML = `
        <i class="fa-solid fa-magnifying-glass-chart"></i> Giải Trình Cơ Cấu Chi Phí Phòng Ban: <strong>${dept.name}</strong>
    `;

    // 1. Chi phí nhân sự (Lương)
    let totalSalary = 0;
    const deptEmployees = appState.employees.filter(emp => {
        if (emp.isMultiLevel && emp.ratios && emp.ratios[deptId] > 0) return true;
        return emp.deptId === deptId;
    });

    let employeesListHtml = '<ul style="margin: 0; padding-left: 20px; font-size: 0.8rem; line-height: 1.6; color: var(--text-secondary);">';
    if (deptEmployees.length > 0) {
        deptEmployees.forEach(emp => {
            if (emp.isMultiLevel && emp.ratios) {
                let totalRatio = Object.values(emp.ratios).reduce((a, b) => a + b, 0);
                const ratioVal = emp.ratios[deptId] || 0;
                const allocatedSalary = emp.salary * (ratioVal / totalRatio);
                totalSalary += allocatedSalary;
                employeesListHtml += `
                    <li style="margin-bottom: 4px;">
                        ${emp.name}: <strong class="text-success">${formatCurrency(allocatedSalary)}</strong> 
                        <span class="badge" style="font-size: 0.65rem; padding: 1px 4px; background: rgba(52, 199, 89, 0.06); color: var(--success);">Kiêm nhiệm - Gánh ${ratioVal}% trên tổng lương ${formatCurrency(emp.salary)}</span>
                    </li>
                `;
            } else {
                totalSalary += emp.salary;
                employeesListHtml += `
                    <li style="margin-bottom: 4px;">
                        ${emp.name}: <strong class="text-success">${formatCurrency(emp.salary)}</strong> (Định biên Toàn thời gian)
                    </li>
                `;
            }
        });
    } else {
        employeesListHtml += '<li><em>Không có nhân sự trực thuộc phòng ban này.</em></li>';
    }
    employeesListHtml += '</ul>';

    // 2. Chi phí thuê mặt bằng
    let totalRent = 0;
    const blockRoomCounts = {};
    appState.rentBlocks.forEach(blk => blockRoomCounts[blk.id] = 0);
    appState.rooms.forEach(room => {
        if (blockRoomCounts[room.blockId] !== undefined) blockRoomCounts[room.blockId]++;
    });

    const deptRooms = appState.rooms.filter(room => room.splits && room.splits[deptId] > 0);
    let roomsListHtml = '<ul style="margin: 0; padding-left: 20px; font-size: 0.8rem; line-height: 1.6; color: var(--text-secondary);">';
    if (deptRooms.length > 0) {
        deptRooms.forEach(room => {
            const block = appState.rentBlocks.find(b => b.id === room.blockId);
            if (!block) return;
            const roomCount = blockRoomCounts[block.id] || 1;
            const roomRent = block.totalRent / roomCount;
            const ratio = room.splits[deptId] || 0;
            const allocatedRent = roomRent * (ratio / 100);
            totalRent += allocatedRent;
            roomsListHtml += `
                <li style="margin-bottom: 4px;">
                    ${room.name} (Thuộc ${block.name}): <strong class="text-primary">${formatCurrency(allocatedRent)}</strong> 
                    <span class="badge" style="font-size: 0.65rem; padding: 1px 4px; background: rgba(0, 122, 255, 0.08); color: var(--accent);">
                        Tỷ lệ sử dụng: ${ratio}% (tiền phòng gốc: ${formatCurrency(roomRent)}/tháng)
                    </span>
                </li>
            `;
        });
    } else {
        roomsListHtml += '<li><em>Không gán chi phí thuê mặt bằng riêng lẻ.</em></li>';
    }
    roomsListHtml += '</ul>';

    // 3. Chi phí tiện ích (đối với các ban Điện, Nước tự thân nếu có hóa đơn gốc)
    let totalUtilitySelf = 0;
    if (dept.isUtility) {
        totalUtilitySelf = appState.utilityCosts[deptId] || 0;
    }

    const totalBaseCost = totalSalary + totalRent + totalUtilitySelf;

    // 4. Định hình tài chính phân bổ
    let allocationTitle = "";
    let allocationDetailHtml = "";

    if (dept.type === "support") {
        allocationTitle = "<i class='fa-solid fa-share-nodes'></i> HƯỚNG PHÂN BỔ KẾT CHUYỂN CHI PHÍ";
        let listRowsHtml = "";
        const revenueDepts = appState.departments.filter(d => d.type === "revenue");
        
        // Đối với cả các ban support và tiện ích (giờ đã phân bổ đồng bộ)
        const method = dept.allocationMethod || (dept.isUtility ? "student" : "manual");
        
        revenueDepts.forEach(rd => {
            const allocatedVal = dept.isUtility 
                ? (data.allocatedUtilityCosts?.[rd.id]?.[deptId] || 0)
                : (data.allocatedCosts?.[rd.id]?.[deptId] || 0);
            const detail = data.allocatedDetails?.[rd.id]?.[deptId] || {};
            const percent = detail.ratioPercent || 0;
            const rawVal = detail.rdValue || 0;
            const sumVal = detail.sumValue || 0;

            let ratioExplanation = "";
            if (method === "student") {
                ratioExplanation = `Tự động theo sỹ số: ${rawVal} HS / ${sumVal} HS &rarr; tỷ lệ: ${percent}%`;
            } else if (method === "staff") {
                ratioExplanation = `Tự động theo nhân sự: ${Number(rawVal).toFixed(1).replace(".0", "")} người / ${Number(sumVal).toFixed(1).replace(".0", "")} người &rarr; tỷ lệ: ${percent}%`;
            } else {
                const rawPercent = appState.drivers.custom_percent[deptId]?.[rd.id] || 0;
                ratioExplanation = `Tỷ lệ gán thủ công: ${rawPercent}% &rarr; quy đổi trọng số: ${percent}%`;
            }

            listRowsHtml += `
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; padding: 6px 0; border-bottom: 1px dashed var(--border-color);">
                    <span><strong>${rd.name}</strong> (${ratioExplanation})</span>
                    <strong style="color: var(--success);">${formatCurrency(allocatedVal)}</strong>
                </div>
            `;
        });


        let noteHtml = "";
        if (dept.note) {
            noteHtml = `
                <div class="callout-box info" style="margin-bottom: 12px; padding: 10px; font-size: 0.75rem; border-left: 3px solid var(--accent); background: rgba(0, 122, 255, 0.02); border-radius: 6px; white-space: pre-wrap; line-height: 1.45;">
                    <strong>✍️ Thuyết minh chiến lược phân bổ:</strong> <em style="white-space: pre-wrap; display: block; margin-top: 4px; color: var(--text-primary); font-weight: 500;">"${dept.note}"</em>
                </div>
            `;
        }


        allocationDetailHtml = `
            ${noteHtml}
            <p style="font-size:0.75rem; color: var(--text-secondary); margin-bottom: 10px;">
                Tổng chi phí tự thân <strong>${formatCurrency(totalBaseCost)}</strong> của ban được kết chuyển trọn vẹn 100% sang các khối doanh thu để cùng chịu trách nhiệm tài chính:
            </p>
            ${listRowsHtml}
        `;
    } else {
        // Đối với Khối trực tiếp (Tiểu học, THCS, THPT, Nội trú)
        allocationTitle = "<i class='fa-solid fa-plus-minus'></i> CHI PHÍ NHẬN PHÂN BỔ TỪ CÁC BAN CHUNG";
        let listRowsHtml = "";
        
        // Chi phí từ ban support
        const supportDepts = appState.departments.filter(d => d.type === "support" && !d.isUtility);
        supportDepts.forEach(sd => {
            const val = data.allocatedCosts?.[deptId]?.[sd.id] || 0;
            if (val > 0) {
                listRowsHtml += `
                    <div style="display: flex; justify-content: space-between; font-size: 0.8rem; padding: 6px 0; border-bottom: 1px dashed var(--border-color);">
                        <span>Nhận từ <strong>${sd.name}</strong></span>
                        <strong style="color: var(--danger);">${formatCurrency(val)}</strong>
                    </div>
                `;
            }
        });

        // Chi phí điện nước
        const dienVal = data.allocatedUtilityCosts?.[deptId]?.["dept_dien"] || 0;
        const nuocVal = data.allocatedUtilityCosts?.[deptId]?.["dept_nuoc"] || 0;
        if (dienVal > 0) {
            listRowsHtml += `
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; padding: 6px 0; border-bottom: 1px dashed var(--border-color);">
                    <span>Phân bổ <strong>Chi phí Điện</strong> (Theo số phòng dùng thực tế)</span>
                    <strong style="color: var(--danger);">${formatCurrency(dienVal)}</strong>
                </div>
            `;
        }
        if (nuocVal > 0) {
            listRowsHtml += `
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; padding: 6px 0; border-bottom: 1px dashed var(--border-color);">
                    <span>Phân bổ <strong>Chi phí Nước</strong> (Theo sỹ số học sinh thực tế)</span>
                    <strong style="color: var(--danger);">${formatCurrency(nuocVal)}</strong>
                </div>
            `;
        }

        let totalAllocatedReceived = dienVal + nuocVal;
        supportDepts.forEach(sd => {
            totalAllocatedReceived += data.allocatedCosts?.[deptId]?.[sd.id] || 0;
        });
        const finalConsolidatedCost = totalBaseCost + totalAllocatedReceived;

        allocationDetailHtml = `
            <p style="font-size:0.75rem; color: var(--text-secondary); margin-bottom: 10px;">
                Bên cạnh chi phí trực tiếp của mình, khối nhận thêm chi phí gián tiếp kết chuyển về để định hình bức tranh P&L thực tế:
            </p>
            ${listRowsHtml}
            <div style="display: flex; justify-content: space-between; font-size: 0.95rem; font-weight: 700; margin-top: 12px; padding-top: 10px; border-top: 2px solid var(--border-color); color: var(--danger);">
                <span>Tổng chi phí hoạt động sau phân bổ cuối cùng:</span>
                <span>${formatCurrency(finalConsolidatedCost)}</span>
            </div>
        `;
    }

    const modalBody = document.getElementById("audit_modal_body");
    modalBody.innerHTML = `
        <div class="audit-section" style="max-height: 70vh; overflow-y: auto; padding-right: 5px;">
            <!-- 1. Consolidated Summary Card -->
            <div style="background: rgba(0, 122, 255, 0.04); padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid var(--border-color);">
                <h4 style="margin:0 0 8px 0; color: var(--accent); font-size: 0.85rem; font-weight: 700;">I. CƠ CẤU CHI PHÍ TỰ THÂN TRỰC TIẾP</h4>
                <div style="display: flex; justify-content: space-between; font-size: 0.95rem; font-weight: 700; margin-bottom: 12px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
                    <span>Tổng chi phí tự thân ban đầu:</span>
                    <span style="color: var(--danger);">${formatCurrency(totalBaseCost)}</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                    <div style="background: #FFF; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color);">
                        <strong style="font-size: 0.65rem; color: var(--text-secondary); display: block;">1. Quỹ Lương:</strong>
                        <span style="display: block; font-size: 0.85rem; font-weight: 600; margin-top: 2px; color: var(--success);">${formatCurrency(totalSalary)}</span>
                    </div>
                    <div style="background: #FFF; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color);">
                        <strong style="font-size: 0.65rem; color: var(--text-secondary); display: block;">2. Tiền Mặt bằng:</strong>
                        <span style="display: block; font-size: 0.85rem; font-weight: 600; margin-top: 2px; color: var(--accent);">${formatCurrency(totalRent)}</span>
                    </div>
                    <div style="background: #FFF; padding: 8px; border-radius: 6px; border: 1px solid var(--border-color);">
                        <strong style="font-size: 0.65rem; color: var(--text-secondary); display: block;">3. Tiền Tiện ích:</strong>
                        <span style="display: block; font-size: 0.85rem; font-weight: 600; margin-top: 2px; color: #FF9500;">${formatCurrency(totalUtilitySelf)}</span>
                    </div>
                </div>
            </div>

            <!-- 2. Employees Section -->
            <div style="margin-bottom: 20px;">
                <h4 style="margin: 0 0 10px 0; font-size: 0.85rem; color: var(--text-primary); border-bottom: 1px solid var(--border-color); padding-bottom: 4px; display: flex; align-items: center; gap: 6px;">
                    <i class="fa-solid fa-users" style="color: var(--success);"></i> CHI TIẾT NHÂN SỰ & QUỸ LƯƠNG
                </h4>
                ${employeesListHtml}
            </div>

            <!-- 3. Rooms Section -->
            <div style="margin-bottom: 20px;">
                <h4 style="margin: 0 0 10px 0; font-size: 0.85rem; color: var(--text-primary); border-bottom: 1px solid var(--border-color); padding-bottom: 4px; display: flex; align-items: center; gap: 6px;">
                    <i class="fa-solid fa-hotel" style="color: var(--accent);"></i> CHI TIẾT CƠ SỞ VẬT CHẤT & TIỀN PHÒNG
                </h4>
                ${roomsListHtml}
            </div>

            <!-- 4. Allocation Details Section -->
            <div style="background: rgba(52, 199, 89, 0.04); padding: 15px; border-radius: 8px; border: 1px solid rgba(52, 199, 89, 0.15);">
                <h4 style="margin:0 0 10px 0; color: var(--success); font-size: 0.85rem; font-weight: 700; display: flex; align-items: center; gap: 6px;">
                    ${allocationTitle}
                </h4>
                ${allocationDetailHtml}
            </div>
        </div>
    `;

    document.getElementById("audit_modal").classList.add("open");
}

// Cập nhật phương thức phân bổ chi phí của phòng ban gián tiếp
function updateAllocationMethod(deptId, method) {
    const dept = appState.departments.find(d => d.id === deptId);
    if (dept) {
        dept.allocationMethod = method;
        saveState();
        runAllocation();
        renderDepartments();
        renderDashboard();
    }
}

// Cập nhật ghi chú giải trình phương án phân bổ cho từng phòng ban thông qua Custom Modal Đa Dòng
function editDepartmentNote(deptId) {
    const dept = appState.departments.find(d => d.id === deptId);
    if (!dept) return;

    document.getElementById("edit_dept_note_id").value = deptId;
    document.getElementById("dept_note_modal_desc").innerHTML = `Nhập giải trình phương án phân bổ cho bộ phận <strong>${dept.name}</strong>:`;
    document.getElementById("dept_note_textarea").value = dept.note || "";
    
    document.getElementById("dept_note_modal").classList.add("open");
    
    setTimeout(() => {
        const ta = document.getElementById("dept_note_textarea");
        ta.focus();
        ta.selectionStart = ta.selectionEnd = ta.value.length;
    }, 120);
}

function saveDepartmentNoteFromModal() {
    const deptId = document.getElementById("edit_dept_note_id").value;
    const textVal = document.getElementById("dept_note_textarea").value;
    const dept = appState.departments.find(d => d.id === deptId);
    if (dept) {
        dept.note = textVal; // Giữ nguyên khoảng trắng và ký tự xuống dòng
        saveState();
        renderDepartments();
        renderDashboard();
    }
    closeModal("dept_note_modal");
}


function updateRevenue(deptId, value) {
    const val = parseMoneyValue(value);
    appState.revenues[deptId] = val;
    saveState();
    renderDepartments();
    renderDashboard();
}

function updateDeptStudents(deptId, value) {
    const val = parseInt(value) || 0;
    const dept = appState.departments.find(d => d.id === deptId);
    if (dept) {
        dept.students = val;
        saveState();
        renderDepartments();
        renderDashboard();
    }
}

function updateUtilityCost(deptId, value) {
    const val = parseMoneyValue(value);
    if (!appState.utilityCosts) appState.utilityCosts = {};
    appState.utilityCosts[deptId] = val;
    saveState();
    renderDepartments();
    renderDashboard();
}

function updateCustomPercent(sdId, rdId, value) {
    const val = parseFloat(value) || 0;
    if (!appState.drivers.custom_percent) appState.drivers.custom_percent = {};
    if (!appState.drivers.custom_percent[sdId]) {
        appState.drivers.custom_percent[sdId] = {};
    }
    appState.drivers.custom_percent[sdId][rdId] = val;
    saveState();
    renderDashboard();
    updateDeptBadgeInDOM(sdId);
}

function updateDeptBadgeInDOM(sdId) {
    const badgeEl = document.getElementById(`dept_badge_${sdId}`);
    if (!badgeEl) return;

    let totalPct = 0;
    const revenueDepts = appState.departments.filter(d => d.type === "revenue");
    revenueDepts.forEach(rd => {
        const val = (appState.drivers.custom_percent?.[sdId]?.[rd.id] !== undefined)
            ? appState.drivers.custom_percent[sdId][rd.id]
            : 25;
        totalPct += val;
    });

    if (totalPct === 100) {
        badgeEl.className = "badge badge-revenue";
        badgeEl.style.backgroundColor = "rgba(52, 199, 89, 0.08)";
        badgeEl.style.color = "var(--success)";
        badgeEl.style.fontSize = "0.75rem";
        badgeEl.style.padding = "2px 6px";
        badgeEl.style.marginLeft = "8px";
        badgeEl.style.display = "inline-block";
        badgeEl.innerHTML = `<i class="fa-solid fa-circle-check"></i> Đủ 100%`;
    } else if (totalPct < 100) {
        badgeEl.className = "badge";
        badgeEl.style.backgroundColor = "rgba(255, 149, 0, 0.08)";
        badgeEl.style.color = "var(--warning)";
        badgeEl.style.fontSize = "0.75rem";
        badgeEl.style.padding = "2px 6px";
        badgeEl.style.marginLeft = "8px";
        badgeEl.style.display = "inline-block";
        badgeEl.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Tổng: ${totalPct}% (Thiếu ${100 - totalPct}%)`;
    } else {
        badgeEl.className = "badge";
        badgeEl.style.backgroundColor = "rgba(255, 59, 48, 0.08)";
        badgeEl.style.color = "#FF3B30";
        badgeEl.style.fontSize = "0.75rem";
        badgeEl.style.padding = "2px 6px";
        badgeEl.style.marginLeft = "8px";
        badgeEl.style.display = "inline-block";
        badgeEl.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Tổng: ${totalPct}% (Thừa ${totalPct - 100}%)`;
    }
}

function addDepartment(event) {
    event.preventDefault();
    const name = document.getElementById("dept_add_name").value.trim();
    const type = document.getElementById("dept_add_type").value;

    if (!name) return;

    const newId = "dept_" + Date.now();
    const newDept = { id: newId, name: name, type: type };
    if (type === "support") {
        if (!appState.drivers.custom_percent) appState.drivers.custom_percent = {};
        appState.drivers.custom_percent[newId] = {
            "dept_tieuhoc": 25,
            "dept_thcs": 25,
            "dept_thpt": 25,
            "dept_noitru": 25
        };
    } else {
        appState.revenues[newId] = 0;
    }

    appState.departments.push(newDept);
    saveState();
    
    document.getElementById("dept_add_form").reset();
    renderDepartments();
}

function deleteDepartment(deptId) {
    if (confirm("CẢNH BÁO: Xóa phòng ban này sẽ giải phóng nhân sự và mặt bằng liên kết. Bạn muốn tiếp tục?")) {
        appState.departments = appState.departments.filter(d => d.id !== deptId);
        appState.employees = appState.employees.filter(emp => {
            if (emp.deptId === deptId) return false;
            if (emp.isMultiLevel && emp.ratios[deptId]) delete emp.ratios[deptId];
            return true;
        });
        appState.rooms.forEach(room => {
            if (room.splits[deptId]) delete room.splits[deptId];
        });
        if (appState.revenues[deptId]) delete appState.revenues[deptId];

        saveState();
        renderDepartments();
    }
}
function renderEmployees() {
    const listBody = document.getElementById("emp_list_body");
    listBody.innerHTML = "";

    const empDeptSelect = document.getElementById("emp_add_dept");
    empDeptSelect.innerHTML = '<option value="">-- Chọn phòng ban --</option>';
    appState.departments.filter(d => !d.isUtility).forEach(d => {
        const label = d.type === "revenue" ? "Khối trực tiếp" : "Ban gián tiếp";
        empDeptSelect.innerHTML += `<option value="${d.id}">${d.name} (${label})</option>`;
    });

    toggleMultiLevelInputs();

    appState.employees.forEach((emp, index) => {
        const dept = appState.departments.find(d => d.id === emp.deptId);
        
        let deptSelectHtml = `<select class="base-select-dropdown" style="width:100%; padding: 4px;" onchange="updateEmployeeDept('${emp.id}', this.value)">`;
        appState.departments.filter(d => !d.isUtility).forEach(d => {
            deptSelectHtml += `<option value="${d.id}" ${d.id === emp.deptId ? "selected" : ""}>${d.name}</option>`;
        });
        deptSelectHtml += `</select>`;

        let breakdownText = "";
        if (emp.isMultiLevel) {
            let totalEmpPct = 0;
            const nonUtilityDepts = appState.departments.filter(d => !d.isUtility);
            nonUtilityDepts.forEach(d => {
                const val = (emp.ratios?.[d.id] !== undefined) ? emp.ratios[d.id] : 0;
                totalEmpPct += val;
            });

            let empBadgeHtml = "";
            if (totalEmpPct === 100) {
                empBadgeHtml = `<span id="emp_badge_${emp.id}" class="badge badge-revenue" style="font-size:0.65rem; padding: 1px 4px; display:inline-block; margin-left:6px;"><i class="fa-solid fa-circle-check"></i> Đủ 100%</span>`;
            } else if (totalEmpPct < 100) {
                empBadgeHtml = `<span id="emp_badge_${emp.id}" class="badge" style="background-color: rgba(255, 149, 0, 0.08); color: var(--warning); font-size:0.65rem; padding: 1px 4px; display:inline-block; margin-left:6px;"><i class="fa-solid fa-circle-exclamation"></i> Tổng: ${totalEmpPct}% (Thiếu ${100 - totalEmpPct}%)</span>`;
            } else {
                empBadgeHtml = `<span id="emp_badge_${emp.id}" class="badge" style="background-color: rgba(255, 59, 48, 0.08); color: #FF3B30; font-size:0.65rem; padding: 1px 4px; display:inline-block; margin-left:6px;"><i class="fa-solid fa-circle-xmark"></i> Tổng: ${totalEmpPct}% (Thừa ${totalEmpPct - 100}%)</span>`;
            }

            let ratiosGridHtml = `
                <div style="display:flex; align-items:center; margin-top:6px; gap:4px; flex-wrap: wrap;">
                    <span style="font-size:0.75rem; font-weight:600; color:var(--text-primary);">Tỷ lệ phân bổ kiêm nhiệm:</span>
                    ${empBadgeHtml}
                </div>
                <div class="ratios-grid" style="padding: 4px; grid-template-columns: repeat(4, 1fr); gap: 4px; background: rgba(0,0,0,0.015); border: 1px dashed var(--border-color); margin-top: 4px;">`;
            
            nonUtilityDepts.forEach(d => {
                const val = (emp.ratios?.[d.id] !== undefined) ? emp.ratios[d.id] : 0;
                ratiosGridHtml += `
                    <div class="ratio-input-wrapper">
                        <label style="font-size:0.6rem; color: var(--text-secondary); text-overflow:ellipsis; overflow:hidden; white-space:nowrap; display:block;">
                            ${d.name.replace("Khối ", "").replace("Ban ", "")} (%)
                        </label>
                        <input type="number" min="0" max="100" class="base-select-dropdown" style="padding: 2px; font-size: 0.7rem; width: 100%;" 
                          value="${val}" onchange="updateEmployeeRatio('${emp.id}', '${d.id}', this.value)">
                    </div>
                `;
            });
            ratiosGridHtml += `</div>`;
            breakdownText = ratiosGridHtml;
        } else {
            breakdownText = `<div style="font-size: 0.75rem; color: var(--text-secondary); margin-top:4px;"><i class="fa-solid fa-circle-info"></i> Lương phân bổ 100% cho ban quản lý chính</div>`;
        }

        const typeLabel = `
            <div style="display: flex; align-items: center; gap: 6px;">
                <input type="checkbox" id="chk_ml_${emp.id}" ${emp.isMultiLevel ? "checked" : ""} onchange="toggleEmployeeMultiLevel('${emp.id}', this.checked)" style="width:16px; height:16px; cursor:pointer;">
                <label for="chk_ml_${emp.id}" style="cursor:pointer; font-size:0.85rem; font-weight:500;">Kiêm nhiệm</label>
            </div>
        `;

        listBody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <strong>${emp.name}</strong>
                    ${breakdownText}
                </td>
                <td style="width: 200px; min-width: 180px;">${deptSelectHtml}</td>
                <td>${typeLabel}</td>
                <td class="text-right">
                    <input type="text" class="base-select-dropdown" style="width:125px; text-align:right; display:inline; padding: 4px;" value="${formatNumberWithDots(emp.salary)}" oninput="handleMoneyInput(this)" onchange="updateEmployeeSalary('${emp.id}', this.value)">
                </td>
                <td class="text-center">
                    <button class="btn btn-danger btn-sm" onclick="deleteEmployee('${emp.id}')">
                        <i class="fas fa-trash"></i> Xóa
                    </button>
                </td>
            </tr>
        `;
    });
}

function renderPayrollMatrix() {
    const table = document.getElementById("matrix_table");
    if (!table) return;

    // Get non-utility departments
    const depts = appState.departments.filter(d => !d.isUtility);
    
    // Generate Header Row
    let headerHtml = `
        <thead>
            <tr style="border-bottom: 1.5px solid var(--border-color); text-align: left;">
                <th style="padding: 10px 8px; width: 50px;">STT</th>
                <th style="padding: 10px 8px; min-width: 150px;">Họ và Tên</th>
                <th style="padding: 10px 8px; min-width: 120px;">Bộ phận chính</th>
                <th style="padding: 10px 8px; text-align: right; min-width: 120px;">Lương gốc (VNĐ)</th>
    `;
    depts.forEach(d => {
        headerHtml += `<th style="padding: 10px 8px; text-align: right; min-width: 130px;">${d.name.replace("Khối ", "").replace("Ban ", "")}</th>`;
    });
    headerHtml += `
                <th style="padding: 10px 8px; text-align: right; min-width: 120px; font-weight: bold; background: rgba(255,255,255,0.02);">Tổng phân bổ</th>
            </tr>
        </thead>
        <tbody>
    `;

    // Tracking totals for each column
    const colTotals = {};
    depts.forEach(d => colTotals[d.id] = 0);
    let grandGrossTotal = 0;
    let grandAllocatedTotal = 0;

    // Build Rows for each employee
    appState.employees.forEach((emp, index) => {
        const deptName = appState.departments.find(d => d.id === emp.deptId)?.name || "Chưa rõ";
        grandGrossTotal += emp.salary;

        let rowHtml = `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.03);">
                <td style="padding: 8px;">${index + 1}</td>
                <td style="padding: 8px;">
                    <strong>${emp.name}</strong>
                    ${emp.isMultiLevel ? ' <span class="badge" style="background-color: rgba(255, 149, 0, 0.08); color: var(--warning); padding: 1px 4px; font-size: 0.6rem;">Kiêm nhiệm</span>' : ''}
                </td>
                <td style="padding: 8px; font-size: 0.8rem; color: var(--text-secondary);">${deptName}</td>
                <td style="padding: 8px; text-align: right; font-weight: 500;">${formatCurrency(emp.salary)}</td>
        `;

        let empAllocSum = 0;
        depts.forEach(d => {
            let cellText = "-";
            let cellVal = 0;

            if (!emp.isMultiLevel) {
                if (emp.deptId === d.id) {
                    cellVal = emp.salary;
                    cellText = `<span style="font-weight: 500; color: var(--success);">${formatCurrency(cellVal)}</span> <small class="text-muted">(100%)</small>`;
                }
            } else {
                const ratios = emp.ratios || {};
                let totalRatio = 0;
                Object.values(ratios).forEach(r => totalRatio += r);
                if (totalRatio > 0 && ratios[d.id] > 0) {
                    const pct = ratios[d.id];
                    cellVal = emp.salary * (pct / totalRatio);
                    cellText = `<span style="font-weight: 500; color: var(--primary);">${formatCurrency(cellVal)}</span> <small class="text-muted">(${pct}%)</small>`;
                }
            }

            colTotals[d.id] += cellVal;
            empAllocSum += cellVal;

            rowHtml += `<td style="padding: 8px; text-align: right; font-size: 0.85rem;">${cellText}</td>`;
        });

        grandAllocatedTotal += empAllocSum;

        rowHtml += `
                <td style="padding: 8px; text-align: right; font-weight: bold; background: rgba(255,255,255,0.02); color: #FFF;">${formatCurrency(empAllocSum)}</td>
            </tr>
        `;
        headerHtml += rowHtml;
    });

    // Build Footer Row with TOTAL SUMS
    let footerHtml = `
        </tbody>
        <tfoot>
            <tr style="border-top: 2px solid var(--border-color); font-weight: bold; background: rgba(52, 199, 89, 0.05); color: #FFF; font-size: 0.9rem;">
                <td colspan="3" style="padding: 10px 8px; text-align: left;">➔ TỔNG CỘNG QUỸ LƯƠNG PHÒNG BAN:</td>
                <td style="padding: 10px 8px; text-align: right; color: var(--success);">${formatCurrency(grandGrossTotal)}</td>
    `;
    
    depts.forEach(d => {
        footerHtml += `<td style="padding: 10px 8px; text-align: right; color: var(--success);">${formatCurrency(colTotals[d.id])}</td>`;
    });

    footerHtml += `
                <td style="padding: 10px 8px; text-align: right; color: var(--success); background: rgba(52, 199, 89, 0.08);">${formatCurrency(grandAllocatedTotal)}</td>
            </tr>
        </tfoot>
    `;

    table.innerHTML = headerHtml + footerHtml;
}

function updateEmployeeSalary(empId, value) {
    const val = parseMoneyValue(value);
    const emp = appState.employees.find(e => e.id === empId);
    if (emp) {
        emp.salary = val;
        saveState();
        renderDashboard();
    }
}

function updateEmployeeDept(empId, deptId) {
    const emp = appState.employees.find(e => e.id === empId);
    if (emp) {
        emp.deptId = deptId;
        saveState();
        renderEmployees();
        renderDashboard();
    }
}

function toggleEmployeeMultiLevel(empId, checked) {
    const emp = appState.employees.find(e => e.id === empId);
    if (emp) {
        emp.isMultiLevel = checked;
        if (checked) {
            emp.ratios = {};
            appState.departments.filter(d => !d.isUtility).forEach(d => {
                emp.ratios[d.id] = (d.id === emp.deptId) ? 100 : 0;
            });
        } else {
            delete emp.ratios;
        }
        saveState();
        renderEmployees();
        renderDashboard();
    }
}

function updateEmployeeRatio(empId, deptId, value) {
    const val = parseFloat(value) || 0;
    const emp = appState.employees.find(e => e.id === empId);
    if (emp) {
        if (!emp.ratios) emp.ratios = {};
        emp.ratios[deptId] = val;
        saveState();
        renderDashboard(); // Update calculations in the background without losing input cursor focus!
        updateEmpBadgeInDOM(empId);
    }
}

function updateEmpBadgeInDOM(empId) {
    const emp = appState.employees.find(e => e.id === empId);
    if (!emp) return;
    const badgeEl = document.getElementById(`emp_badge_${empId}`);
    if (!badgeEl) return;

    let totalEmpPct = 0;
    const nonUtilityDepts = appState.departments.filter(d => !d.isUtility);
    nonUtilityDepts.forEach(d => {
        const val = (emp.ratios?.[d.id] !== undefined) ? emp.ratios[d.id] : 0;
        totalEmpPct += val;
    });

    if (totalEmpPct === 100) {
        badgeEl.className = "badge badge-revenue";
        badgeEl.style.backgroundColor = "rgba(52, 199, 89, 0.08)";
        badgeEl.style.color = "var(--success)";
        badgeEl.style.fontSize = "0.65rem";
        badgeEl.style.padding = "1px 4px";
        badgeEl.style.display = "inline-block";
        badgeEl.style.marginLeft = "6px";
        badgeEl.innerHTML = `<i class="fa-solid fa-circle-check"></i> Đủ 100%`;
    } else if (totalEmpPct < 100) {
        badgeEl.className = "badge";
        badgeEl.style.backgroundColor = "rgba(255, 149, 0, 0.08)";
        badgeEl.style.color = "var(--warning)";
        badgeEl.style.fontSize = "0.65rem";
        badgeEl.style.padding = "1px 4px";
        badgeEl.style.display = "inline-block";
        badgeEl.style.marginLeft = "6px";
        badgeEl.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Tổng: ${totalEmpPct}% (Thiếu ${100 - totalEmpPct}%)`;
    } else {
        badgeEl.className = "badge";
        badgeEl.style.backgroundColor = "rgba(255, 59, 48, 0.08)";
        badgeEl.style.color = "#FF3B30";
        badgeEl.style.fontSize = "0.65rem";
        badgeEl.style.padding = "1px 4px";
        badgeEl.style.display = "inline-block";
        badgeEl.style.marginLeft = "6px";
        badgeEl.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Tổng: ${totalEmpPct}% (Thừa ${totalEmpPct - 100}%)`;
    }
}

function toggleMultiLevelInputs() {
    const isMulti = document.getElementById("emp_add_multilevel").checked;
    const ratioWrapper = document.getElementById("emp_add_ratios_wrapper");
    
    if (isMulti) {
        ratioWrapper.style.display = "block";
        const grid = ratioWrapper.querySelector(".ratios-grid");
        grid.innerHTML = "";
        appState.departments.filter(dept => !dept.isUtility).forEach(dept => {
            grid.innerHTML += `
                <div class="ratio-input-wrapper">
                    <label class="priority-container" style="font-size:0.75rem;">
                        ${dept.name} (%) <span class="priority-dot priority-dot-blue" title="Nhập tỷ lệ (%) lương phân bổ về bộ phận này"></span>
                    </label>
                    <input type="number" min="0" max="100" class="emp-add-ratio-val" data-dept-id="${dept.id}" value="0">
                </div>
            `;
        });
    } else {
        ratioWrapper.style.display = "none";
    }
}

function addEmployee(event) {
    event.preventDefault();
    const name = document.getElementById("emp_add_name").value.trim();
    const deptId = document.getElementById("emp_add_dept").value;
    const salary = parseMoneyValue(document.getElementById("emp_add_salary").value);
    const isMultiLevel = document.getElementById("emp_add_multilevel").checked;

    if (!name || !deptId || salary <= 0) {
        alert("Vui lòng điền tên, phòng ban và lương!");
        return;
    }

    const newEmp = {
        id: "emp_" + Date.now(),
        name: name,
        deptId: deptId,
        salary: salary,
        isMultiLevel: isMultiLevel
    };

    if (isMultiLevel) {
        const ratios = {};
        let totalRatio = 0;
        document.querySelectorAll(".emp-add-ratio-val").forEach(input => {
            const dId = input.getAttribute("data-dept-id");
            const rVal = parseFloat(input.value) || 0;
            if (rVal > 0) {
                ratios[dId] = rVal;
                totalRatio += rVal;
            }
        });

        if (totalRatio !== 100) {
            alert(`Tổng tỷ lệ phân bổ nhân sự kiêm nhiệm phải bằng 100%! Hiện tại là: ${totalRatio}%`);
            return;
        }
        newEmp.ratios = ratios;
    }

    appState.employees.push(newEmp);
    saveState();

    document.getElementById("emp_add_form").reset();
    document.getElementById("emp_add_multilevel").checked = false;
    toggleMultiLevelInputs();
    
    renderEmployees();
}

function deleteEmployee(empId) {
    if (confirm("Xóa nhân viên này?")) {
        appState.employees = appState.employees.filter(e => e.id !== empId);
        saveState();
        renderEmployees();
    }
}


// 3.4 RENDERING VIEW: RENT BLOCKS & DETAILED ROOMS (ADVANCED CRUD)
function renderFacilities() {
    // 1. Render Rent Blocks (Dãy nhà)
    const blocksBody = document.getElementById("block_list_body");
    blocksBody.innerHTML = "";

    // Count rooms in blocks dynamically for display
    const blockRoomCounts = {};
    appState.rentBlocks.forEach(blk => blockRoomCounts[blk.id] = 0);
    appState.rooms.forEach(room => {
        if (blockRoomCounts[room.blockId] !== undefined) blockRoomCounts[room.blockId]++;
    });

    appState.rentBlocks.forEach((blk, idx) => {
        const roomCount = blockRoomCounts[blk.id] || 0;
        const roomPrice = roomCount > 0 ? blk.totalRent / roomCount : blk.totalRent;

        blocksBody.innerHTML += `
            <tr>
                <td>${idx + 1}</td>
                <td><strong>${blk.name}</strong></td>
                <td class="text-right"><strong>${formatCurrency(blk.totalRent)}</strong></td>
                <td class="text-center"><span class="badge badge-revenue" style="font-size:0.8rem;">${roomCount} Phòng</span></td>
                <td class="text-right text-success"><strong>${formatCurrency(roomPrice)} / phòng</strong></td>
                <td class="text-center">
                    <button class="btn btn-danger btn-sm" onclick="deleteRentBlock('${blk.id}')">Xóa</button>
                </td>
            </tr>
        `;
    });

    // Populate block select in add room form
    const blockSelect = document.getElementById("room_add_block");
    blockSelect.innerHTML = '<option value="">-- Chọn Dãy nhà / Khu vực thuê --</option>';
    appState.rentBlocks.forEach(blk => {
        blockSelect.innerHTML += `<option value="${blk.id}">${blk.name}</option>`;
    });

    // Populate filter select
    const filterBlockSelect = document.getElementById("filter_room_block");
    if (filterBlockSelect) {
        const currentVal = filterBlockSelect.value;
        filterBlockSelect.innerHTML = '<option value="">-- Tất cả Dãy nhà --</option>';
        appState.rentBlocks.forEach(blk => {
            filterBlockSelect.innerHTML += `<option value="${blk.id}" ${blk.id === currentVal ? 'selected' : ''}>${blk.name}</option>`;
        });
    }

    // 2. Render Rooms (Danh sách Phòng chi tiết)
    const roomsBody = document.getElementById("room_list_body");
    roomsBody.innerHTML = "";

    // Rebuild room split controls in form
    toggleRoomSplitInputs();

    let globalRoomIdx = 0;

    // Group rooms by block
    appState.rentBlocks.forEach(blk => {
        // Find rooms belonging to this block
        const blockRooms = appState.rooms.filter(r => r.blockId === blk.id);
        const roomCount = blockRooms.length;
        const roomPrice = roomCount > 0 ? blk.totalRent / roomCount : blk.totalRent;

        if (roomCount > 0) {
            // Render block header row
            roomsBody.innerHTML += `
                <tr class="block-header-row" data-block-id="${blk.id}" style="background: rgba(0, 122, 255, 0.05); font-weight: bold; border-top: 1.5px solid rgba(0, 122, 255, 0.15);">
                    <td colspan="7" style="padding: 10px 14px; font-size: 0.9rem; color: var(--primary); text-align: left;">
                        <i class="fa-solid fa-building"></i> Dãy nhà: <strong style="font-size: 0.95rem;">${blk.name}</strong> 
                        <span style="font-weight: normal; margin-left: 10px; font-size: 0.78rem; color: var(--text-secondary);">(Tiền thuê: ${formatCurrency(blk.totalRent)}/tháng | Có ${roomCount} phòng &rarr; Quy đổi: ${formatCurrency(roomPrice)}/phòng)</span>
                    </td>
                </tr>
            `;

            // Render rooms under this block
            blockRooms.forEach(room => {
                const countInBlock = blockRoomCounts[room.blockId] || 1;
                const calculatedRoomCost = blk ? blk.totalRent / countInBlock : 0;

                // Render splits text as beautiful badges/chips
                const splitsArray = [];
                Object.keys(room.splits).forEach(did => {
                    const ratio = room.splits[did];
                    if (ratio > 0) {
                        const dName = appState.departments.find(d => d.id === did)?.name || did;
                        let badgeClass = "badge-dept-tag";
                        if (did === "dept_tieuhoc") badgeClass += " badge-dept-tieuhoc";
                        else if (did === "dept_thcs") badgeClass += " badge-dept-thcs";
                        else if (did === "dept_thpt") badgeClass += " badge-dept-thpt";
                        else if (did === "dept_noitru") badgeClass += " badge-dept-noitru";
                        else badgeClass += " badge-dept-support";
                        
                        splitsArray.push(`<span class="${badgeClass}">${dName}: ${ratio}%</span>`);
                    }
                });
                let splitsText = splitsArray.length > 0 ? splitsArray.join(" ") : '<span class="badge-dept-tag badge-dept-support">Chưa gán chi phí</span>';
                splitsText += `
                    <div style="margin-top: 6px;">
                        <button class="btn btn-secondary btn-sm" onclick="openRoomSplitEditModal('${room.id}')" style="padding: 2px 6px; font-size: 0.7rem; display: inline-flex; align-items: center; gap: 4px; border: 1px solid var(--border-color); cursor: pointer; border-radius: 4px;">
                            <i class="fa-solid fa-pen-to-square"></i> Sửa tỷ lệ %
                        </button>
                    </div>
                `;

                let typeLabel = "";
                if (room.type === "classroom") typeLabel = "Lớp học";
                else if (room.type === "boarding") typeLabel = "Nội trú";
                else typeLabel = "Dùng chung";

                globalRoomIdx++;

                roomsBody.innerHTML += `
                    <tr data-room-id="${room.id}" data-block-id="${room.blockId}" data-status="${room.status}">
                        <td>${globalRoomIdx}</td>
                        <td>
                            <div style="display: flex; align-items: center; gap: 6px;">
                                <input type="text" class="base-select-dropdown room-name-input" value="${room.name}" 
                                  onchange="renameRoom('${room.id}', this.value)" 
                                  title="Bấm trực tiếp vào để đổi tên phòng học"
                                  style="font-weight: 600; border: 1px solid transparent; background: transparent; padding: 4px 6px; border-radius: 6px; font-size: 0.88rem; width: 180px; cursor: pointer; color: var(--text-primary);" 
                                  onmouseover="this.style.borderColor='var(--border-color)'" 
                                  onmouseout="this.style.borderColor='transparent'">
                                <span style="font-size: 0.72rem; color: var(--text-secondary); opacity: 0.8;">(${typeLabel})</span>
                            </div>
                        </td>
                        <td class="text-right"><strong>${formatCurrency(calculatedRoomCost)}</strong></td>
                        <td class="text-center">
                            <select onchange="updateRoomStatus('${room.id}', this.value)" class="base-select-dropdown" style="padding: 4px 8px; font-size: 0.78rem; font-weight: 500; cursor: pointer; border-radius: 6px; width: 145px; border-color: rgba(0, 122, 255, 0.2);">
                                <option value="active" ${room.status === "active" ? "selected" : ""}>🟢 Đang sử dụng</option>
                                <option value="empty" ${room.status === "empty" ? "selected" : ""}>⚪ Phòng trống / Dự trữ</option>
                            </select>
                        </td>
                        <td>
                            <div class="priority-container" style="display: inline-flex; align-items: center; gap: 4px;">
                                <input type="number" class="base-select-dropdown" style="width: 65px; text-align: center; padding: 2px 4px;" value="${room.currentStudents}" 
                                  onchange="updateRoomStudents('${room.id}', this.value); runAllocation(); renderFacilities();" min="0">
                                <small class="text-muted">/ ${room.capacity} HS</small>
                            </div>
                        </td>
                        <td style="line-height: 1.8;">${splitsText}</td>
                        <td class="text-center">
                            <button class="btn btn-danger btn-sm" onclick="deleteRoom('${room.id}')" style="padding: 2px 6px; font-size: 0.72rem;">Xóa</button>
                        </td>
                    </tr>
                `;
            });
        }
    });

    // Render any orphan rooms (without active blocks)
    const orphanRooms = appState.rooms.filter(room => !appState.rentBlocks.some(b => b.id === room.blockId));
    if (orphanRooms.length > 0) {
        roomsBody.innerHTML += `
            <tr class="block-header-row" data-block-id="orphan" style="background: rgba(142, 142, 147, 0.08); font-weight: bold; border-top: 1.5px solid rgba(142, 142, 147, 0.2);">
                <td colspan="7" style="padding: 10px 14px; font-size: 0.9rem; color: #8E8E93; text-align: left;">
                    <i class="fa-solid fa-circle-question"></i> Khu vực khác / Chưa xác định dãy nhà
                    <span style="font-weight: normal; margin-left: 10px; font-size: 0.78rem; color: var(--text-secondary);">(Có ${orphanRooms.length} phòng)</span>
                </td>
            </tr>
        `;

        orphanRooms.forEach(room => {
            const splitsArray = [];
            Object.keys(room.splits).forEach(did => {
                const ratio = room.splits[did];
                if (ratio > 0) {
                    const dName = appState.departments.find(d => d.id === did)?.name || did;
                    let badgeClass = "badge-dept-tag";
                    if (did === "dept_tieuhoc") badgeClass += " badge-dept-tieuhoc";
                    else if (did === "dept_thcs") badgeClass += " badge-dept-thcs";
                    else if (did === "dept_thpt") badgeClass += " badge-dept-thpt";
                    else if (did === "dept_noitru") badgeClass += " badge-dept-noitru";
                    else badgeClass += " badge-dept-support";
                    
                    splitsArray.push(`<span class="${badgeClass}">${dName}: ${ratio}%</span>`);
                }
            });
            let splitsText = splitsArray.length > 0 ? splitsArray.join(" ") : '<span class="badge-dept-tag badge-dept-support">Chưa gán chi phí</span>';
            splitsText += `
                <div style="margin-top: 6px;">
                    <button class="btn btn-secondary btn-sm" onclick="openRoomSplitEditModal('${room.id}')" style="padding: 2px 6px; font-size: 0.7rem; display: inline-flex; align-items: center; gap: 4px; border: 1px solid var(--border-color); cursor: pointer; border-radius: 4px;">
                        <i class="fa-solid fa-pen-to-square"></i> Sửa tỷ lệ %
                    </button>
                </div>
            `;

            let typeLabel = "";
            if (room.type === "classroom") typeLabel = "Lớp học";
            else if (room.type === "boarding") typeLabel = "Nội trú";
            else typeLabel = "Dùng chung";

            globalRoomIdx++;

            roomsBody.innerHTML += `
                <tr data-room-id="${room.id}" data-block-id="${room.blockId}" data-status="${room.status}">
                    <td>${globalRoomIdx}</td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <input type="text" class="base-select-dropdown room-name-input" value="${room.name}" 
                              onchange="renameRoom('${room.id}', this.value)" 
                              title="Bấm trực tiếp vào để đổi tên phòng học"
                              style="font-weight: 600; border: 1px solid transparent; background: transparent; padding: 4px 6px; border-radius: 6px; font-size: 0.88rem; width: 180px; cursor: pointer; color: var(--text-primary);" 
                              onmouseover="this.style.borderColor='var(--border-color)'" 
                              onmouseout="this.style.borderColor='transparent'">
                            <span style="font-size: 0.72rem; color: var(--text-secondary); opacity: 0.8;">(${typeLabel})</span>
                        </div>
                    </td>
                    <td class="text-right"><strong>0 đ</strong></td>
                    <td class="text-center">
                        <select onchange="updateRoomStatus('${room.id}', this.value)" class="base-select-dropdown" style="padding: 4px 8px; font-size: 0.78rem; font-weight: 500; cursor: pointer; border-radius: 6px; width: 145px; border-color: rgba(0, 122, 255, 0.2);">
                            <option value="active" ${room.status === "active" ? "selected" : ""}>🟢 Đang sử dụng</option>
                            <option value="empty" ${room.status === "empty" ? "selected" : ""}>⚪ Phòng trống / Dự trữ</option>
                        </select>
                    </td>
                    <td>
                        <div class="priority-container" style="display: inline-flex; align-items: center; gap: 4px;">
                            <input type="number" class="base-select-dropdown" style="width: 65px; text-align: center; padding: 2px 4px;" value="${room.currentStudents}" 
                              onchange="updateRoomStudents('${room.id}', this.value); runAllocation(); renderFacilities();" min="0">
                            <small class="text-muted">/ ${room.capacity} HS</small>
                        </div>
                    </td>
                    <td style="line-height: 1.8;">${splitsText}</td>
                    <td class="text-center">
                        <button class="btn btn-danger btn-sm" onclick="deleteRoom('${room.id}')" style="padding: 2px 6px; font-size: 0.72rem;">Xóa</button>
                    </td>
                </tr>
            `;
        });
    }

    // Run Filter automatically
    filterRoomsList();
}

function switchFacilitySubtab(subtabId) {
    document.querySelectorAll(".facility-subtab-section").forEach(sec => {
        sec.style.display = "none";
    });
    document.querySelectorAll(".facility-subtab-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    const targetSec = document.getElementById(subtabId);
    if (targetSec) targetSec.style.display = "block";

    const targetBtn = document.getElementById("btn_" + subtabId);
    if (targetBtn) targetBtn.classList.add("active");
}

function toggleCollapsible(wrapperId, arrowId) {
    const el = document.getElementById(wrapperId);
    const arrow = document.getElementById(arrowId);
    if (el) {
        if (el.style.display === "none") {
            el.style.display = "block";
            if (arrow) arrow.classList.add("collapsible-arrow-rotate");
        } else {
            el.style.display = "none";
            if (arrow) arrow.classList.remove("collapsible-arrow-rotate");
        }
    }
}

function filterRoomsList() {
    const blockFilter = document.getElementById("filter_room_block").value;
    const statusFilter = document.getElementById("filter_room_status").value;
    
    const roomRows = document.querySelectorAll("#room_list_body tr[data-room-id]");
    const blockHeaderRows = document.querySelectorAll("#room_list_body tr.block-header-row");
    
    let visibleCount = 0;
    let totalCount = appState.rooms.length;

    // Filter all room rows
    roomRows.forEach(row => {
        const blockId = row.getAttribute("data-block-id");
        const status = row.getAttribute("data-status");

        const matchBlock = !blockFilter || blockId === blockFilter;
        const matchStatus = !statusFilter || status === statusFilter;

        if (matchBlock && matchStatus) {
            row.style.display = "";
            visibleCount++;
        } else {
            row.style.display = "none";
        }
    });

    // Toggle block header rows based on visible children
    blockHeaderRows.forEach(header => {
        const blockId = header.getAttribute("data-block-id");
        const hasVisibleRooms = Array.from(roomRows).some(row => {
            return row.getAttribute("data-block-id") === blockId && row.style.display === "";
        });

        if (hasVisibleRooms) {
            header.style.display = "";
        } else {
            header.style.display = "none";
        }
    });

    const countEl = document.getElementById("filtered_room_count");
    if (countEl) {
        countEl.innerText = `Hiển thị: ${visibleCount} / ${totalCount} phòng`;
    }
}


function updateRoomStudents(roomId, value) {
    const val = parseInt(value) || 0;
    const room = appState.rooms.find(r => r.id === roomId);
    if (room) {
        room.currentStudents = val;
        saveState();
    }
}

function renameRoom(roomId, newName) {
    if (!newName || newName.trim() === "") return;
    const room = appState.rooms.find(r => r.id === roomId);
    if (room) {
        room.name = newName.trim();
        saveState();
        runAllocation();
        renderFacilities();
        renderDashboard();
    }
}

function updateRoomStatus(roomId, newStatus) {
    const room = appState.rooms.find(r => r.id === roomId);
    if (room) {
        room.status = newStatus;
        saveState();
        runAllocation();
        renderFacilities();
        renderDashboard();
    }
}


// Hàm mở Modal chỉnh sửa tỷ lệ % phân bổ cho phòng học
function openRoomSplitEditModal(roomId) {
    const room = appState.rooms.find(r => r.id === roomId);
    if (!room) return;

    document.getElementById("edit_room_id").value = roomId;
    document.getElementById("room_split_modal_desc").innerHTML = 
        `Cài đặt tỷ lệ phần trăm (%) gán chi phí thuê dãy nhà của phòng học <strong>${room.name}</strong> cho các khối trực tiếp hoặc bộ phận gián tiếp sử dụng.`;

    const container = document.getElementById("room_split_inputs_container");
    container.innerHTML = "";

    appState.departments.forEach(dept => {
        const ratio = room.splits[dept.id] || 0;
        container.innerHTML += `
            <div class="ratio-input-wrapper" style="display: flex; flex-direction: column; gap: 4px;">
                <label style="font-size:0.75rem; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;" class="priority-container">
                    ${dept.name} (%) <span class="priority-dot priority-dot-blue" title="Nhập tỷ lệ (%) phòng ban sử dụng phòng học"></span>
                </label>
                <input type="number" min="0" max="100" class="room-edit-ratio-val base-select-dropdown" style="width: 100%;" data-dept-id="${dept.id}" value="${ratio}" oninput="updateRoomSplitTotalLive()">
            </div>
        `;
    });

    document.getElementById("room_split_modal").classList.add("open");
    updateRoomSplitTotalLive();
}

// Cập nhật tổng % thời gian thực
function updateRoomSplitTotalLive() {
    const inputs = document.querySelectorAll(".room-edit-ratio-val");
    let total = 0;
    inputs.forEach(input => {
        total += parseFloat(input.value) || 0;
    });

    const badge = document.getElementById("room_split_total_badge");
    badge.innerText = `Tổng cộng: ${total}%`;
    
    // Reset classes
    badge.className = "badge"; 
    
    if (Math.abs(total - 100) < 0.1) {
        badge.style.backgroundColor = "var(--success)";
        badge.style.color = "#FFF";
    } else {
        badge.style.backgroundColor = "var(--danger)";
        badge.style.color = "#FFF";
    }
}

// Lưu tỷ lệ % phân bổ mới cho phòng học
function updateRoomSplits(event) {
    event.preventDefault();
    const roomId = document.getElementById("edit_room_id").value;
    const room = appState.rooms.find(r => r.id === roomId);
    if (!room) return;

    const inputs = document.querySelectorAll(".room-edit-ratio-val");
    let total = 0;
    const newSplits = {};
    
    inputs.forEach(input => {
        const deptId = input.getAttribute("data-dept-id");
        const val = parseFloat(input.value) || 0;
        if (val > 0) {
            newSplits[deptId] = val;
            total += val;
        }
    });

    if (Math.abs(total - 100) > 0.1) {
        alert(`Tổng tỷ lệ phần trăm phân bổ phải bằng đúng 100% để đảm bảo chi phí phòng học được phân bổ trọn vẹn. Hiện tại đang là ${total}%.`);
        return;
    }

    room.splits = newSplits;
    saveState();
    runAllocation();
    renderFacilities();
    renderDashboard();
    closeModal("room_split_modal");
}

function addRentBlock(event) {
    event.preventDefault();
    const name = document.getElementById("blk_add_name").value.trim();
    const rent = parseMoneyValue(document.getElementById("blk_add_rent").value);

    if (!name || rent <= 0) return;

    appState.rentBlocks.push({
        id: "blk_" + Date.now(),
        name: name,
        totalRent: rent
    });
    saveState();

    document.getElementById("blk_add_form").reset();
    renderFacilities();
}

function deleteRentBlock(blockId) {
    if (confirm("Xóa Dãy nhà này? Toàn bộ các phòng thuộc Dãy nhà này sẽ được gán lại.")) {
        appState.rentBlocks = appState.rentBlocks.filter(b => b.id !== blockId);
        saveState();
        renderFacilities();
    }
}

function toggleRoomSplitInputs() {
    const container = document.getElementById("room_add_splits_container");
    container.innerHTML = "";
    appState.departments.forEach(dept => {
        container.innerHTML += `
            <div class="ratio-input-wrapper">
                <label style="font-size:0.75rem; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;" class="priority-container">
                    ${dept.name} (%) <span class="priority-dot priority-dot-blue" title="Nhập tỷ lệ (%) phòng ban sử dụng phòng học"></span>
                </label>
                <input type="number" min="0" max="100" class="room-add-ratio-val" data-dept-id="${dept.id}" value="0">
            </div>
        `;
    });
}

function addRoom(event) {
    event.preventDefault();
    const name = document.getElementById("room_add_name").value.trim();
    const blockId = document.getElementById("room_add_block").value;
    const type = document.getElementById("room_add_type").value;
    const status = document.getElementById("room_add_status").value;
    const capacity = parseInt(document.getElementById("room_add_capacity").value) || 22;
    const students = parseInt(document.getElementById("room_add_students").value) || 0;

    if (!name || !blockId) {
        alert("Vui lòng nhập tên phòng và chọn Dãy nhà!");
        return;
    }

    const splits = {};
    let totalRatio = 0;
    document.querySelectorAll(".room-add-ratio-val").forEach(input => {
        const dId = input.getAttribute("data-dept-id");
        const rVal = parseFloat(input.value) || 0;
        if (rVal > 0) {
            splits[dId] = rVal;
            totalRatio += rVal;
        }
    });

    if (totalRatio < 99.9 || totalRatio > 100.1) {
        alert(`Tổng tỷ lệ phòng ban sử dụng phòng học phải bằng 100%! Hiện tại là: ${totalRatio}%`);
        return;
    }

    const newRoom = {
        id: "rm_" + Date.now(),
        name: name,
        blockId: blockId,
        type: type,
        status: status,
        capacity: capacity,
        currentStudents: students,
        splits: splits
    };

    appState.rooms.push(newRoom);
    saveState();

    document.getElementById("room_add_form").reset();
    toggleRoomSplitInputs();
    
    renderFacilities();
}

function deleteRoom(roomId) {
    if (confirm("Xóa phòng học này khỏi hệ thống cơ sở vật chất?")) {
        appState.rooms = appState.rooms.filter(r => r.id !== roomId);
        saveState();
        renderFacilities();
    }
}





// --- 4. BACKUP & EXPORT UTILITIES ---

function exportStateJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 4));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `XTD_CostAllocation_AppState_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function importStateJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            if (imported.departments && imported.employees && imported.rentBlocks && imported.rooms) {
                appState = imported;
                saveState();
                initApp();
                alert("Nhập dữ liệu cấu hình thành công!");
            } else {
                alert("File cấu hình không tương thích!");
            }
        } catch (err) {
            alert("Lỗi đọc file cấu hình: " + err.message);
        }
    };
    reader.readAsText(file);
}


// --- 5. INITIALIZATION ---

// Tự động định dạng số có dấu chấm phân cách hàng nghìn khi đang gõ
function formatNumberWithDots(val) {
    if (val === undefined || val === null) return "";
    let num = val.toString().replace(/\D/g, "");
    if (!num) return "";
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Xử lý sự kiện oninput cho các ô nhập tiền mặt, doanh thu, tiện ích
function handleMoneyInput(inputEl) {
    let cursorPosition = inputEl.selectionStart;
    let originalLength = inputEl.value.length;
    
    let formatted = formatNumberWithDots(inputEl.value);
    inputEl.value = formatted;
    
    let newLength = formatted.length;
    let diff = newLength - originalLength;
    let newPos = cursorPosition + diff;
    inputEl.setSelectionRange(newPos, newPos);
}

// Chuyển đổi chuỗi tiền mặt có dấu chấm thành số thực để tính toán
function parseMoneyValue(val) {
    if (val === undefined || val === null || val === "") return 0;
    return parseFloat(val.toString().replace(/\./g, "")) || 0;
}

function formatCurrency(val) {
    if (val === null || val === undefined || isNaN(val)) return "0 ₫";
    return Math.round(val).toLocaleString() + " ₫";
}

function initApp() {
    loadState();
    
    // Auto-reconnect to Firebase Cloud Sync if code exists
    const savedCloudCode = localStorage.getItem("XTD_CLOUD_PROJECT_CODE");
    if (savedCloudCode) {
        connectCloudSync(savedCloudCode);
    }
    
    document.querySelectorAll(".nav-item").forEach(item => {
        item.addEventListener("click", () => {
            const tabId = item.getAttribute("data-tab");
            switchTab(tabId);
        });
    });

    // Guidelines Table of Contents smooth scroll and active highlighting
    document.querySelectorAll(".guidelines-toc-item").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href");
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' });
                
                document.querySelectorAll(".guidelines-toc-item").forEach(item => item.classList.remove("active"));
                link.classList.add("active");
            }
        });
    });

    switchTab("view_dashboard");
}

/* ==========================================================================
   INTERACTIVE SIRI HELPER BOT LOGIC
   ========================================================================== */

function toggleHelperBot() {
    const card = document.getElementById("helper_bot_card");
    if (card) {
        card.classList.toggle("open");
    }
}

function updateHelperSteps(tabId) {
    const steps = [
        { id: "step_dept", tab: "view_departments", icon: "step_icon_dept" },
        { id: "step_fac", tab: "view_facilities", icon: "step_icon_fac" },
        { id: "step_emp", tab: "view_employees", icon: "step_icon_emp" },
        { id: "step_dash", tab: "view_dashboard", icon: "step_icon_dash" }
    ];

    let currentStepIndex = steps.findIndex(s => s.tab === tabId);
    if (currentStepIndex === -1) currentStepIndex = 3; // default to dashboard

    // Reset and redraw steps checklist classes
    steps.forEach((step, idx) => {
        const itemEl = document.getElementById(step.id);
        const iconEl = document.getElementById(step.icon);
        if (!itemEl || !iconEl) return;

        itemEl.classList.remove("active", "completed");
        iconEl.className = "status-icon"; // Reset FontAwesome classes

        if (idx < currentStepIndex) {
            // Completed Steps
            itemEl.classList.add("completed");
            iconEl.className = "fa-solid fa-circle-check status-icon text-success";
        } else if (idx === currentStepIndex) {
            // Active Step
            itemEl.classList.add("active");
            iconEl.className = "fa-solid fa-circle-play status-icon text-primary";
        } else {
            // Future Steps
            iconEl.className = "fa-regular fa-circle status-icon";
        }
    });

    // Update helper advice text dynamically
    const adviceEl = document.getElementById("helper_bot_advice");
    if (adviceEl) {
        const advices = {
            "view_departments": "<strong>Trợ lý gợi ý:</strong> Đảm bảo anh đã tạo đủ các khối trực tiếp (mang doanh thu) và các ban gián tiếp. Với các ban gián tiếp, hãy nhập tỷ lệ % gánh chi phí thực tế trực tiếp vào lưới nhé!",
            "view_facilities": "<strong>Trợ lý gợi ý:</strong> Khai báo Dãy nhà lớn và Tiền thuê trần trước. Sau đó anh thêm các phòng chi tiết, gán vào dãy nhà đó và điền sỹ số học sinh hiện tại. Hệ thống sẽ tự động chia đều tiền thuê mỗi phòng!",
            "view_employees": "<strong>Trợ lý gợi ý:</strong> Thêm giáo viên và gán bộ phận chính. Nếu là giáo viên đa cấp học (dạy chéo khối), tích chọn và điền tỷ lệ % phân bổ dạy học (ví dụ: Tiểu học 50%, THCS 50%) để hệ thống tự bóc tách lương!",
            "view_dashboard": "<strong>Trợ lý gợi ý:</strong> Hoàn thành! Quay lại xem Báo cáo Lợi nhuận gộp của 4 khối trực tiếp. Bấm vào các con số gánh chi phí phân bổ (màu xanh lá) để xem giải trình công thức toán học chi tiết nhé!"
        };
        adviceEl.innerHTML = advices[tabId] || advices["view_dashboard"];
    }
}

/* ==========================================================================
   REAL-TIME CLOUD DATABASE SYNCHRONIZATION LOGIC (GOOGLE FIREBASE)
   ========================================================================== */

let firebaseDb = null;
let currentProjectCode = "";
let isSyncingFromCloud = false;

function connectCloudSync(projectCode) {
    if (!projectCode || projectCode.trim() === "") {
        // Disconnect
        currentProjectCode = "";
        localStorage.removeItem("XTD_CLOUD_PROJECT_CODE");
        const inputEl = document.getElementById("cloud_project_code");
        if (inputEl) inputEl.value = "";
        updateCloudSyncUI("offline");
        return;
    }

    projectCode = projectCode.trim().toUpperCase().replace(/[^A-Z0-9_]/g, "");
    currentProjectCode = projectCode;
    localStorage.setItem("XTD_CLOUD_PROJECT_CODE", projectCode);
    const inputEl = document.getElementById("cloud_project_code");
    if (inputEl) inputEl.value = projectCode;

    // Khởi tạo Firebase nếu chưa khởi tạo
    if (typeof firebase === 'undefined') {
        console.error("Firebase SDK is not loaded.");
        updateCloudSyncUI("offline");
        return;
    }

    updateCloudSyncUI("syncing");

    if (!firebaseDb) {
        const firebaseConfig = {
            apiKey: "AIzaSyAs-XTdCostAllocationEngine2026",
            authDomain: "xanh-tue-duc-cost.firebaseapp.com",
            databaseURL: "https://xanh-tue-duc-cost-default-rtdb.firebaseio.com",
            projectId: "xanh-tue-duc-cost",
            storageBucket: "xanh-tue-duc-cost.appspot.com",
            messagingSenderId: "38924610578",
            appId: "1:38924610578:web:b125439a8cde167c"
        };
        try {
            firebase.initializeApp(firebaseConfig);
            firebaseDb = firebase.database();
        } catch (e) {
            console.error("Firebase initialization failed:", e);
            updateCloudSyncUI("offline");
            return;
        }
    }

    // Lắng nghe dữ liệu realtime từ đám mây trên node của dự án
    const dbRef = firebaseDb.ref("sessions/" + projectCode);
    dbRef.off(); // Gỡ các listener cũ nếu có
    dbRef.on("value", (snapshot) => {
        const cloudData = snapshot.val();
        if (cloudData) {
            console.log("Cloud data updated from Firebase!");
            isSyncingFromCloud = true;
            
            // Cập nhật appState và lưu cục bộ để đồng bộ
            appState = cloudData;
            saveStateLocalOnly(); 
            
            // Chạy lại toán và làm mới giao diện
            runAllocation();
            
            // Làm mới tab đang mở
            const activeTab = document.querySelector(".nav-item.active")?.getAttribute("data-tab") || "view_dashboard";
            switchTab(activeTab);
            
            isSyncingFromCloud = false;
            updateCloudSyncUI("online");
        } else {
            // Nếu node trống, đẩy dữ liệu hiện tại từ máy lên đám mây làm dữ liệu gốc ban đầu
            console.log("Cloud node is empty. Initializing with local data...");
            pushLocalDataToCloud();
        }
    }, (error) => {
        console.error("Database read failed:", error);
        updateCloudSyncUI("offline");
    });
}

function updateCloudSyncUI(status) {
    const statusDot = document.getElementById("cloud_sync_status");
    const statusText = document.getElementById("cloud_sync_text");
    if (!statusDot || !statusText) return;

    statusDot.className = "cloud-status-dot " + status;
    if (status === "online") {
        statusDot.setAttribute("title", "Đã kết nối Đám mây. Dữ liệu đang được đồng bộ hóa thời gian thực (Real-time)");
        statusText.innerHTML = `<i class="fa-solid fa-cloud-arrow-up" style="color: var(--success);"></i> Đã đồng bộ`;
    } else if (status === "syncing") {
        statusDot.setAttribute("title", "Đang kết nối đám mây và đồng bộ hóa số liệu...");
        statusText.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="color: var(--warning);"></i> Đang đồng bộ`;
    } else {
        statusDot.setAttribute("title", "Chưa kết nối Đám mây. Dữ liệu đang được lưu cục bộ (Offline)");
        statusText.innerHTML = `<i class="fa-solid fa-cloud-arrow-up" style="opacity: 0.5;"></i> Offline`;
    }
}

function pushLocalDataToCloud() {
    if (!currentProjectCode || !firebaseDb) return;
    
    updateCloudSyncUI("syncing");
    firebaseDb.ref("sessions/" + currentProjectCode).set(appState)
        .then(() => {
            console.log("Local data successfully synchronized to Firebase Cloud!");
            updateCloudSyncUI("online");
        })
        .catch(e => {
            console.error("Cloud synchronization failed:", e);
            updateCloudSyncUI("offline");
        });
}

window.addEventListener("DOMContentLoaded", () => {
    initApp();
});

