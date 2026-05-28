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

    // Đảm bảo khởi tạo kịch bản giả lập What-If lấp đầy phòng học
    if (!appState.simulation) {
        appState.simulation = {
            active: false,
            fillRate: 80,
            fillRates: {
                "dept_tieuhoc": 80,
                "dept_thcs": 80,
                "dept_thpt": 80,
                "dept_noitru": 80
            },
            tuition: {
                "dept_tieuhoc_thuong": 5000000,
                "dept_tieuhoc_xanh": 7500000,
                "dept_thcs_thuong": 6000000,
                "dept_thcs_xanh": 9000000,
                "dept_thpt_thuong": 7000000,
                "dept_thpt_xanh": 11000000,
                "dept_noitru": 3000000
            }
        };
    } else {
        if (!appState.simulation.fillRates) {
            appState.simulation.fillRates = {
                "dept_tieuhoc": getActualFillRateForDept("dept_tieuhoc"),
                "dept_thcs": getActualFillRateForDept("dept_thcs"),
                "dept_thpt": getActualFillRateForDept("dept_thpt"),
                "dept_noitru": getActualFillRateForDept("dept_noitru")
            };
        } else {
            // Tự động chuyển đổi nếu tất cả tỷ lệ đang là 80% (mặc định cũ trong localStorage)
            const allEighty = Object.values(appState.simulation.fillRates).every(v => v === 80);
            if (allEighty) {
                appState.simulation.fillRates = {
                    "dept_tieuhoc": getActualFillRateForDept("dept_tieuhoc"),
                    "dept_thcs": getActualFillRateForDept("dept_thcs"),
                    "dept_thpt": getActualFillRateForDept("dept_thpt"),
                    "dept_noitru": getActualFillRateForDept("dept_noitru")
                };
            }
        }
        if (!appState.simulation.tuition || !appState.simulation.tuition.dept_tieuhoc_thuong) {
            const oldTuition = appState.simulation.tuition || {};
            appState.simulation.tuition = {
                "dept_tieuhoc_thuong": oldTuition.dept_tieuhoc ? Math.round(oldTuition.dept_tieuhoc * 0.8) : 5000000,
                "dept_tieuhoc_xanh": oldTuition.dept_tieuhoc ? Math.round(oldTuition.dept_tieuhoc * 1.2) : 7500000,
                "dept_thcs_thuong": oldTuition.dept_thcs ? Math.round(oldTuition.dept_thcs * 0.8) : 6000000,
                "dept_thcs_xanh": oldTuition.dept_thcs ? Math.round(oldTuition.dept_thcs * 1.2) : 9000000,
                "dept_thpt_thuong": oldTuition.dept_thpt ? Math.round(oldTuition.dept_thpt * 0.8) : 7000000,
                "dept_thpt_xanh": oldTuition.dept_thpt ? Math.round(oldTuition.dept_thpt * 1.2) : 11000000,
                "dept_noitru": oldTuition.dept_noitru || 3000000
            };
        }
    }

    // Di trú dữ liệu cho thuộc tính "system" (Hệ đào tạo) của phòng học
    if (appState.rooms) {
        appState.rooms.forEach(room => {
            if (room.type === "classroom") {
                const hasTieuhocOrThcs = room.splits && ((room.splits.dept_tieuhoc || 0) > 0 || (room.splits.dept_thcs || 0) > 0);
                const hasThpt = room.splits && (room.splits.dept_thpt || 0) > 0;
                if (hasTieuhocOrThcs && !hasThpt) {
                    room.system = "xanh";
                    room.capacity = 25;
                }
            }
            if (!room.system) {
                const lowerName = (room.name || "").toLowerCase();
                if (lowerName.includes("xanh") || lowerName.includes("sáng tạo")) {
                    room.system = "xanh";
                    if (!room.capacity || room.capacity === 30 || room.capacity === 22) {
                        room.capacity = 25; // Gán mặc định cho hệ xanh
                    }
                } else {
                    room.system = "thuong";
                    if (!room.capacity || room.capacity === 30 || room.capacity === 22) {
                        room.capacity = 40; // Gán mặc định cho hệ thường
                    }
                }
            }
        });
    }

    // Khởi tạo tổng tiền thuê của chủ nhà mặc định khớp với tổng tiền thuê ban đầu (223,100,000đ)
    if (!appState.landlordRent) {
        appState.landlordRent = 223100000;
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

    // Nếu đang ở chế độ giả lập lấp đầy phòng học What-If
    if (appState.simulation && appState.simulation.active) {
        if (!appState.simulation.fillRates) {
            appState.simulation.fillRates = {
                "dept_tieuhoc": appState.simulation.fillRate || 80,
                "dept_thcs": appState.simulation.fillRate || 80,
                "dept_thpt": appState.simulation.fillRate || 80,
                "dept_noitru": appState.simulation.fillRate || 80
            };
        }
        appState.rooms.forEach(room => {
            if (room.status === "active" && room.type !== "functional") {
                Object.keys(room.splits).forEach(did => {
                    if (studentCounts[did] !== undefined && room.splits[did] > 0) {
                        const targetFillRate = appState.simulation.fillRates[did] !== undefined ? appState.simulation.fillRates[did] : 80;
                        const simulatedRoomStudentsForDept = room.capacity * (room.splits[did] / 100) * (targetFillRate / 100);
                        studentCounts[did] += simulatedRoomStudentsForDept;
                    }
                });
            }
        });
        // Làm tròn số học sinh giả lập về số nguyên cho đẹp
        Object.keys(studentCounts).forEach(k => {
            studentCounts[k] = Math.round(studentCounts[k]);
        });
        return studentCounts;
    }

    appState.departments.filter(d => d.type === "revenue").forEach(rd => {
        studentCounts[rd.id] = rd.students || 0;
    });

    return studentCounts;
}

function getActualFillRateForDept(deptId) {
    let maxCapacity = 0;
    if (appState.rooms) {
        appState.rooms.forEach(room => {
            if (room.status === "active" && room.type !== "functional" && room.splits && room.splits[deptId] > 0) {
                const ratio = room.splits[deptId] / 100;
                maxCapacity += room.capacity * ratio;
            }
        });
    }
    const dept = appState.departments ? appState.departments.find(d => d.id === deptId) : null;
    const actualStudents = dept ? (dept.students || 0) : 0;
    return maxCapacity > 0 ? Math.max(0, Math.min(100, Math.round((actualStudents / maxCapacity) * 100))) : 80;
}

function getSimulatedRevenueForDept(deptId) {
    if (!appState.simulation || !appState.simulation.active) return 0;
    
    let totalRevenue = 0;
    const fillRate = appState.simulation.fillRates?.[deptId] !== undefined 
        ? appState.simulation.fillRates[deptId] 
        : (appState.simulation.fillRate || 80);
        
    appState.rooms.forEach(room => {
        if (room.status === "active" && room.type !== "functional") {
            const splitRatio = room.splits[deptId] || 0;
            if (splitRatio > 0) {
                const roomSimStudents = room.capacity * (splitRatio / 100) * (fillRate / 100);
                
                // Xác định đơn giá học phí theo hệ đào tạo của phòng học
                let isXanh = (room.system === "xanh");
                if (deptId === "dept_tieuhoc" || deptId === "dept_thcs") {
                    isXanh = true; // Chỉ có hệ xanh cho Tiểu học & THCS
                }
                const tuitionKey = `${deptId}_${isXanh ? 'xanh' : 'thuong'}`;
                
                // Fallback nếu không có cấu hình hệ đào tạo riêng (ví dụ: Ban nội trú không phân biệt hệ)
                const tuitionRate = appState.simulation.tuition[tuitionKey] !== undefined 
                    ? appState.simulation.tuition[tuitionKey] 
                    : (appState.simulation.tuition[deptId] || 0);
                    
                totalRevenue += roomSimStudents * tuitionRate;
            }
        }
    });
    
    return Math.round(totalRevenue);
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
    // Automatically enforce that Primary/THCS classrooms (without THPT) are Green track and max capacity 25
    if (appState.rooms) {
        appState.rooms.forEach(room => {
            if (room.type === "classroom") {
                const hasTieuhocOrThcs = room.splits && ((room.splits.dept_tieuhoc || 0) > 0 || (room.splits.dept_thcs || 0) > 0);
                const hasThpt = room.splits && (room.splits.dept_thpt || 0) > 0;
                if (hasTieuhocOrThcs && !hasThpt) {
                    room.system = "xanh";
                    room.capacity = 25;
                }
            }
        });
    }

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
            const isAmountMode = emp.allocationMode === "amount";
            if (isAmountMode) {
                // Direct amount allocation in VND
                Object.keys(emp.ratios).forEach(deptId => {
                    const allocatedSalary = emp.ratios[deptId] || 0;
                    if (allocatedSalary > 0) {
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
            }
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

        // Tự động tính toán tỷ lệ gánh chi phí dựa trên sỹ số học sinh thực tế nếu được cấu hình
        let splitsToUse = {};
        if (room.allocationMethod === "student") {
            const selectedDepts = room.selectedDepts || [];
            let totalStudents = 0;
            selectedDepts.forEach(did => {
                const dept = appState.departments.find(d => d.id === did);
                if (dept && dept.type === "revenue") {
                    totalStudents += (dept.students || 0);
                }
            });
            if (totalStudents > 0) {
                selectedDepts.forEach(did => {
                    const dept = appState.departments.find(d => d.id === did);
                    if (dept) {
                        splitsToUse[did] = ((dept.students || 0) / totalStudents) * 100;
                    }
                });
            } else if (selectedDepts.length > 0) {
                // Chia đều nếu chưa có học sinh nào nhập vào
                selectedDepts.forEach(did => {
                    splitsToUse[did] = 100 / selectedDepts.length;
                });
            }
            // Cập nhật lại splits của room để hiển thị đồng bộ trên UI
            room.splits = splitsToUse;
        } else {
            splitsToUse = room.splits || {};
        }

        // Distribute room rent to departments according to split ratios
        Object.keys(splitsToUse).forEach(deptId => {
            const ratio = splitsToUse[deptId];
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
    if (appState.simulation && appState.simulation.active) {
        result.totalRevenue = revenueDepts.reduce((sum, rd) => {
            return sum + getSimulatedRevenueForDept(rd.id);
        }, 0);
    } else {
        result.totalRevenue = Object.values(appState.revenues).reduce((a, b) => a + b, 0);
    }
    
    revenueDepts.forEach(rd => {
        const rdDirectCost = result.directSalary[rd.id] + result.directRent[rd.id];
        let rdAllocatedSum = 0;
        supportDepts.forEach(sd => {
            rdAllocatedSum += result.allocatedCosts[rd.id][sd.id];
        });
        
        const rdUtilitySum = result.totalUtilityAllocated[rd.id] || 0;

        result.totalDirectCost += rdDirectCost;
        result.totalAllocated += rdAllocatedSum;

        let rdRev = appState.revenues[rd.id] || 0;
        if (appState.simulation && appState.simulation.active) {
            rdRev = getSimulatedRevenueForDept(rd.id);
        }
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
    localStorage.setItem("XTD_ACTIVE_TAB", tabId);
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

    const plTable = document.querySelector(".pl-table");
    if (plTable) {
        if (appState.simulation && appState.simulation.active) {
            plTable.style.boxShadow = "0 8px 32px rgba(175, 82, 222, 0.15)";
            plTable.style.borderColor = "#AF52DE";
            plTable.style.background = "rgba(175, 82, 222, 0.005)";
        } else {
            plTable.style.boxShadow = "";
            plTable.style.borderColor = "";
            plTable.style.background = "";
        }
    }

    const revenueDepts = (appState.departments || []).filter(d => d.type === "revenue");
    const supportDepts = (appState.departments || []).filter(d => d.type === "support");

    // Row 1: Doanh thu
    let revHtml = `<tr class="pl-row-revenue">
        <td>Doanh Thu (Tiền Học Phí & Dịch Vụ) ${appState.simulation && appState.simulation.active ? '<span class="badge" style="background: var(--info); font-size: 0.65rem;">DỰ PHÓNG</span>' : ''}</td>`;
    revenueDepts.forEach(rd => {
        let rdRev = appState.revenues?.[rd.id] || 0;
        if (appState.simulation && appState.simulation.active) {
            rdRev = getSimulatedRevenueForDept(rd.id);
        }
        revHtml += `<td class="text-right">${formatCurrency(rdRev)}</td>`;
    });
    revHtml += `<td class="text-right" style="font-weight: 800;">${formatCurrency(data.totalRevenue || 0)}</td></tr>`;
    plBody.innerHTML += revHtml;

    // SECTION I: CHI PHÍ LƯƠNG NHÂN SỰ
    plBody.innerHTML += `<tr style="font-weight: 600; color: #FFF; background: rgba(52, 199, 89, 0.02)">
        <td colspan="${revenueDepts.length + 2}">I. CHI PHÍ LƯƠNG NHÂN SỰ</td>
    </tr>`;

    // Row I.1: Lương trực tiếp
    let salaryDirectHtml = `<tr>
        <td style="padding-left: 24px;">1. Lương Giáo viên & Quản nhiệm Trực tiếp</td>`;
    revenueDepts.forEach((rd, idx) => {
        const isFirstCell = idx === 0;
        salaryDirectHtml += `<td class="text-right">
            <a href="#" class="audit-link" onclick="openDirectSalaryAuditModal('${rd.id}'); return false;" style="color: var(--success); text-decoration: underline; position: relative;">
                ${formatCurrency(data.directSalary?.[rd.id] || 0)}
                ${isFirstCell ? '<i class="fa-solid fa-magnifying-glass pulse-magnifier" style="font-size: 0.75rem; margin-left: 4px; font-weight: 900;" title="Nhấp vào bất kỳ số có gạch chân nào để xem giải trình"></i>' : ''}
            </a>
        </td>`;
    });
    const sumDirectSalary = Object.values(data.directSalary || {}).reduce((a, b) => a + b, 0);
    salaryDirectHtml += `<td class="text-right text-muted">${formatCurrency(sumDirectSalary)}</td></tr>`;
    plBody.innerHTML += salaryDirectHtml;

    // Row I.2: Lương gián tiếp phân bổ
    let salaryIndirectHtml = `<tr>
        <td style="padding-left: 24px;">2. Lương Gián tiếp Phân bổ</td>`;
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
        <td style="padding-left: 24px;">2. Tiền thuê Mặt bằng Gián tiếp Phân bổ</td>`;
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
        <td style="padding-left: 24px;">1. Chi phí Điện phân bổ (Theo sỹ số thực tế)</td>`;
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
        <td style="padding-left: 24px;">2. Chi phí Nước phân bổ (Theo sỹ số thực tế)</td>`;
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

    // Tự động đồng bộ hóa thông tin và các thanh trượt giả lập trong bảng thiết lập kịch bản
    updateSimulationUI();
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

    const isSim = appState.simulation && appState.simulation.active;
    const activeStudents = getActiveStudentCounts();
    const labels = (revenueDepts || []).map(rd => rd.name);
    const revenueData = (revenueDepts || []).map(rd => {
        if (isSim) {
            return getSimulatedRevenueForDept(rd.id);
        }
        return appState.revenues?.[rd.id] || 0;
    });
    const costData = (revenueDepts || []).map(rd => {
        const direct = (data.directSalary?.[rd.id] || 0) + (data.directRent?.[rd.id] || 0);
        const indirect = Object.values(data.allocatedCosts?.[rd.id] || {}).reduce((a, b) => a + b, 0);
        const utility = Object.values(data.allocatedUtilityCosts?.[rd.id] || {}).reduce((a, b) => a + b, 0);
        return direct + indirect + utility;
    });
    const profitLossData = (revenueDepts || []).map((rd, i) => revenueData[i] - costData[i]);

    const revColor = isSim ? '#AF52DE' : '#10B981';
    const costColor = isSim ? '#FF9500' : '#EF4444';

    dashboardChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: isSim ? 'Doanh Thu (Giả Lập)' : 'Doanh Thu',
                    data: revenueData,
                    backgroundColor: revColor,
                    borderRadius: 6,
                    order: 2
                },
                {
                    label: isSim ? 'Tổng Chi Phí (Giả Lập)' : 'Tổng Chi Phí (Trực tiếp + Phân bổ)',
                    data: costData,
                    backgroundColor: costColor,
                    borderRadius: 6,
                    order: 2
                },
                {
                    label: 'Lợi Nhuận / (Lỗ) Thuần',
                    data: profitLossData,
                    type: 'line',
                    borderColor: 'transparent',
                    backgroundColor: 'transparent',
                    borderWidth: 0,
                    fill: false,
                    tension: 0.3,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    order: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#9CA3AF', font: { family: 'Outfit' } }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += formatCurrency(context.parsed.y);
                            }
                            return label;
                        },
                        footer: function(tooltipItems) {
                            const index = tooltipItems[0].dataIndex;
                            const diff = profitLossData[index];
                            if (diff >= 0) {
                                return `\n➔ KẾT QUẢ: LÃI +${formatCurrency(diff)}`;
                            } else {
                                return `\n➔ KẾT QUẢ: LỖ ${formatCurrency(diff)}`;
                            }
                        }
                    }
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
                    },
                    min: 0
                }
            }
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { 
                        color: '#9CA3AF', 
                        font: { family: 'Outfit' },
                        filter: function(item, chart) {
                            return item.text !== 'Lợi Nhuận / (Lỗ) Thuần';
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += formatCurrency(context.parsed.y);
                            }
                            return label;
                        },
                        footer: function(tooltipItems) {
                            const index = tooltipItems[0].dataIndex;
                            const diff = profitLossData[index];
                            if (diff >= 0) {
                                return `\n➔ KẾT QUẢ: LÃI +${formatCurrency(diff)}`;
                            } else {
                                return `\n➔ KẾT QUẢ: LỖ ${formatCurrency(diff)}`;
                            }
                        }
                    }
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
        },
        plugins: [
            {
                id: 'custom_datalabels',
                afterDatasetsDraw: function(chart, args, options) {
                    const ctx = chart.ctx;
                    ctx.save();
                    ctx.font = "bold 11px Outfit, sans-serif";
                    ctx.textAlign = "center";
                    
                    const datasetIndex = 2; // Line dataset (index 2)
                    const meta = chart.getDatasetMeta(datasetIndex);
                    if (!meta || meta.hidden) return;
                    
                    meta.data.forEach((element, index) => {
                        const val = chart.data.datasets[datasetIndex].data[index];
                        const formattedVal = (val / 1000000).toFixed(0) + 'M';
                        const text = val >= 0 ? '+' + formattedVal : formattedVal;
                        
                        // Background pill dimensions
                        const paddingX = 8;
                        const paddingY = 4;
                        const textWidth = ctx.measureText(text).width;
                        const rectWidth = textWidth + paddingX * 2;
                        const rectHeight = 18;
                        const rectX = element.x - rectWidth / 2;
                        
                        // Find the height of the tallest bar in this category group to float above it
                        const maxVal = Math.max(revenueData[index], costData[index]);
                        const barTopY = chart.scales.y.getPixelForValue(maxVal);
                        const rectY = barTopY - 26; // Float elegantly 26px above the tallest bar
                        
                        // Draw shadow for premium floating glow
                        ctx.shadowColor = val >= 0 ? 'rgba(16, 185, 129, 0.45)' : 'rgba(239, 68, 68, 0.45)';
                        ctx.shadowBlur = 8;
                        ctx.shadowOffsetX = 0;
                        ctx.shadowOffsetY = 3;
                        
                        // Draw rounded rect pill
                        ctx.fillStyle = val >= 0 ? 'rgba(16, 185, 129, 0.98)' : 'rgba(239, 68, 68, 0.98)';
                        ctx.beginPath();
                        if (ctx.roundRect) {
                            ctx.roundRect(rectX, rectY, rectWidth, rectHeight, 5);
                        } else {
                            ctx.rect(rectX, rectY, rectWidth, rectHeight);
                        }
                        ctx.fill();
                        
                        // Clean border setup (reset shadow for border)
                        ctx.shadowBlur = 0;
                        ctx.shadowOffsetY = 0;
                        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
                        ctx.lineWidth = 1;
                        ctx.stroke();
                        
                        // Draw text inside the pill
                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillText(text, element.x, rectY + 13);
                    });
                    ctx.restore();
                }
            }
        ]
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

// Helper to render luxurious manual ratios with visually segmented progress bar and Apple-style cards
function renderCustomRatiosHtml(dept, revenueDepts, showOnboardingDot = false) {
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

    // Định nghĩa bảng màu thương hiệu sang trọng cho các Khối học (THPT sử dụng màu Tím Hoàng Gia để khác biệt rõ nét với Tiểu Học)
    const getDeptTheme = (name) => {
        const lower = name.toLowerCase();
        if (lower.includes("tiểu học")) return { color: "#007AFF" }; // Blue
        if (lower.includes("thcs")) return { color: "#34C759" };    // Green
        if (lower.includes("thpt")) return { color: "#AF52DE" };    // Premium Violet / Royal Purple
        return { color: "#FF9500" };                                // Gold/Orange for Nội trú
    };

    // 1. Tạo Thanh phân bổ tỷ lệ trực quan (Segmented Progress Bar) siêu sang trọng (Thu nhỏ độ dày 4px thanh lịch)
    let progressBarHtml = `<div style="display: flex; height: 4px; width: 100%; border-radius: 2px; overflow: hidden; background: #EAEAEF; margin-top: 6px; margin-bottom: 8px; box-shadow: inset 0 0.5px 1.5px rgba(0,0,0,0.05);">`;
    revenueDepts.forEach(rd => {
        const val = (appState.drivers.custom_percent?.[dept.id]?.[rd.id] !== undefined)
            ? appState.drivers.custom_percent[dept.id][rd.id]
            : 25;
        if (val > 0) {
            const theme = getDeptTheme(rd.name);
            progressBarHtml += `<div style="width: ${val}%; background-color: ${theme.color}; transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);" title="${rd.name}: ${val}%"></div>`;
        }
    });
    progressBarHtml += `</div>`;

    // 2. Tạo lưới nhập liệu Card/Pill hiện đại (Nền trắng sang trọng, tối giản để chống lóa mắt)
    let cardsHtml = `<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 6px; width: 100%;">`;
    revenueDepts.forEach((rd, rdIndex) => {
        const val = (appState.drivers.custom_percent?.[dept.id]?.[rd.id] !== undefined)
            ? appState.drivers.custom_percent[dept.id][rd.id]
            : 25;
        const theme = getDeptTheme(rd.name);
        const shortName = rd.name.replace("Khối ", "").replace("Ban ", "");
        
        const dotHtml = (showOnboardingDot && rdIndex === 0)
            ? `<span class="ratio-onboarding-dot" title="Nhấp vào ô này để điều chỉnh tỷ lệ phân bổ thủ công"></span>`
            : "";
        
        cardsHtml += `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 5px 8px; background: #FFFFFF; border: 1px solid rgba(0,0,0,0.075); border-radius: 6px; transition: all 0.2s; min-width: 0; box-shadow: 0 1px 2px rgba(0,0,0,0.02);" onmouseover="this.style.borderColor='rgba(0,0,0,0.15)'" onmouseout="this.style.borderColor='rgba(0,0,0,0.075)'">
                <div style="display: flex; align-items: center; min-width: 0; flex-grow: 1; margin-right: 4px;">
                    <span style="display: inline-block; width: 5px; height: 5px; border-radius: 50%; background-color: ${theme.color}; margin-right: 5px; flex-shrink: 0;"></span>
                    <span style="font-size: 0.72rem; font-weight: 700; color: ${theme.color}; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;" title="${rd.name}">${shortName}</span>
                </div>
                <div style="display: flex; align-items: center; background: #FFF; border: 1px solid rgba(0,0,0,0.08); border-radius: 5px; padding: 2px 6px; box-shadow: var(--shadow-sm); width: 50px; justify-content: space-between; height: 22px; flex-shrink: 0; position: relative;">
                    <input type="number" min="0" max="100" class="ratio-pct-input" style="border: none; background: transparent; font-size: 0.75rem; font-weight: 700; color: var(--text-primary); width: 28px; text-align: right; outline: none; padding: 0; font-family: inherit;" 
                      value="${val}" onchange="updateCustomPercent('${dept.id}', '${rd.id}', this.value)" oninput="this.value = !!this.value && Math.abs(this.value) >= 0 ? Math.min(100, Math.abs(this.value)) : ''">
                    <span style="font-size: 0.7rem; font-weight: 600; color: var(--text-secondary); margin-left: 1px; user-select: none;">%</span>
                    ${dotHtml}
                </div>
            </div>
        `;
    });
    cardsHtml += `</div>`;

    return `
        <div style="display: flex; flex-direction: column; width: 100%;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap;">
                ${badgeHtml}
            </div>
            ${progressBarHtml}
            ${cardsHtml}
        </div>
    `;
}

// 3.2 RENDERING VIEW: DEPARTMENTS (CRUD)
function renderDepartments() {
    const listRevenue = document.getElementById("dept_list_revenue");
    const listSupport = document.getElementById("dept_list_support");
    const listUtility = document.getElementById("dept_list_utility");
    
    let firstManualRendered = false;
    
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
        
        // 2.1 Dropdown phương pháp phân bổ - Tối giản & Chuyên nghiệp
        let dropdownHtml = `
            <select onchange="updateAllocationMethod('${dept.id}', this.value)" class="base-select-dropdown" style="padding: 6px 10px; font-size: 0.78rem; font-weight: 550; cursor: pointer; border: 1px solid rgba(0, 122, 255, 0.15); border-radius: 6px; outline: none; background: #FFF; width: 100%; transition: all 0.2s;">
                <option value="manual" ${method === "manual" ? "selected" : ""}>Phân bổ thủ công (%)</option>
                <option value="student" ${method === "student" ? "selected" : ""}>Phân bổ theo Sỹ số học sinh</option>
                <option value="staff" ${method === "staff" ? "selected" : ""}>Phân bổ theo Số lượng nhân sự</option>
            </select>
        `;

        // Biểu tượng Giải trình (Comment Dots) - Tối giản và phân biệt rõ ràng
        const hasNote = dept.note && dept.note.trim() !== "";
        const noteIconClass = hasNote ? "fa-solid fa-comment-dots" : "fa-regular fa-comment-dots";
        const noteIconStyle = hasNote 
            ? "cursor: pointer; font-size: 0.85rem; color: #FF5E00; transition: all 0.2s; display: inline-block; padding: 6px 8px; background: rgba(255, 94, 0, 0.08); border-radius: 6px;" 
            : "cursor: pointer; font-size: 0.85rem; color: var(--text-secondary); opacity: 0.4; transition: all 0.2s; display: inline-block; padding: 6px 8px; border-radius: 6px;";
        
        const safeNoteContent = hasNote 
            ? dept.note.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
            : "";

        const tooltipText = hasNote 
            ? `<strong style="color: #34C759; display: block; margin-bottom: 6px; font-size: 0.82rem;"><i class="fa-solid fa-square-check"></i> Đã giải trình phương án:</strong><span style="font-style: italic; white-space: pre-wrap; display: block; font-weight: 500; font-size: 0.8rem; color: #E5E5EA;">${safeNoteContent}</span><hr style="border: 0; border-top: 1px solid rgba(255, 255, 255, 0.15); margin: 8px 0 6px 0;"><span style="font-size: 0.75rem; opacity: 0.7; display: block; text-align: center; color: #FF5E00;"><i class="fa-solid fa-pen"></i> Nhấp chuột để chỉnh sửa</span>`
            : `<span style="opacity: 0.9; display: block; text-align: center; font-size: 0.78rem;"><i class="fa-regular fa-comment-dots"></i> Chưa có giải trình.<br>Nhấp chuột để thêm mới!</span>`;

        const noteIconHtml = `
            <div class="dept-note-tooltip-trigger">
                <i class="${noteIconClass}" style="${noteIconStyle}" onclick="editDepartmentNote('${dept.id}')" onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='scale(1)'"></i>
                <div class="custom-note-tooltip">
                    ${tooltipText}
                </div>
            </div>
        `;

        const dropdownWrapperHtml = `
            <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
                <div style="flex-grow: 1;">${dropdownHtml}</div>
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
            let showOnboarding = false;
            if (!firstManualRendered) {
                showOnboarding = true;
                firstManualRendered = true;
            }
            mainAllocationHtml = renderCustomRatiosHtml(dept, revenueDepts, showOnboarding);
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

        // 3.1 Dropdown phân bổ tiện ích - Tối giản & Chuyên nghiệp
        let dropdownHtml = `
            <select onchange="updateAllocationMethod('${dept.id}', this.value)" class="base-select-dropdown" style="padding: 6px 10px; font-size: 0.78rem; font-weight: 550; cursor: pointer; border: 1px solid rgba(0, 122, 255, 0.15); border-radius: 6px; outline: none; background: #FFF; width: 100%; transition: all 0.2s;">
                <option value="student" ${method === "student" ? "selected" : ""}>Phân bổ theo Sỹ số học sinh</option>
                <option value="staff" ${method === "staff" ? "selected" : ""}>Phân bổ theo Số lượng nhân sự</option>
                <option value="manual" ${method === "manual" ? "selected" : ""}>Phân bổ thủ công (%)</option>
            </select>
        `;

        // Biểu tượng Giải trình (Comment Dots) - Tối giản và phân biệt rõ ràng
        const hasNote = dept.note && dept.note.trim() !== "";
        const noteIconClass = hasNote ? "fa-solid fa-comment-dots" : "fa-regular fa-comment-dots";
        const noteIconStyle = hasNote 
            ? "cursor: pointer; font-size: 0.85rem; color: #FF5E00; transition: all 0.2s; display: inline-block; padding: 6px 8px; background: rgba(255, 94, 0, 0.08); border-radius: 6px;" 
            : "cursor: pointer; font-size: 0.85rem; color: var(--text-secondary); opacity: 0.4; transition: all 0.2s; display: inline-block; padding: 6px 8px; border-radius: 6px;";
        
        const safeNoteContent = hasNote 
            ? dept.note.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
            : "";

        const tooltipText = hasNote 
            ? `<strong style="color: #34C759; display: block; margin-bottom: 6px; font-size: 0.82rem;"><i class="fa-solid fa-square-check"></i> Đã giải trình phương án:</strong><span style="font-style: italic; white-space: pre-wrap; display: block; font-weight: 500; font-size: 0.8rem; color: #E5E5EA;">${safeNoteContent}</span><hr style="border: 0; border-top: 1px solid rgba(255, 255, 255, 0.15); margin: 8px 0 6px 0;"><span style="font-size: 0.75rem; opacity: 0.7; display: block; text-align: center; color: #FF5E00;"><i class="fa-solid fa-pen"></i> Nhấp chuột để chỉnh sửa</span>`
            : `<span style="opacity: 0.9; display: block; text-align: center; font-size: 0.78rem;"><i class="fa-regular fa-comment-dots"></i> Chưa có giải trình.<br>Nhấp chuột để thêm mới!</span>`;

        const noteIconHtml = `
            <div class="dept-note-tooltip-trigger">
                <i class="${noteIconClass}" style="${noteIconStyle}" onclick="editDepartmentNote('${dept.id}')" onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='scale(1)'"></i>
                <div class="custom-note-tooltip">
                    ${tooltipText}
                </div>
            </div>
        `;

        const dropdownWrapperHtml = `
            <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
                <div style="flex-grow: 1;">${dropdownHtml}</div>
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
            mainAllocationHtml = renderCustomRatiosHtml(dept, revenueDepts, false);
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
// Bảng giải trình chi tiết cơ cấu chi phí phòng ban
function openDepartmentCostAuditModal(deptId) {
    const data = runAllocation();
    const dept = appState.departments.find(d => d.id === deptId);
    if (!dept) return;

    // Set title
    document.getElementById("audit_modal_title").innerHTML = `
        <i class="fa-solid fa-magnifying-glass-chart" style="color: var(--primary);"></i> Giải Trình Cơ Cấu Chi Phí Phòng Ban: <strong style="color: var(--text-primary);">${dept.name}</strong>
    `;

    // 1. Chi phí nhân sự (Lương)
    let totalSalary = 0;
    const deptEmployees = appState.employees.filter(emp => {
        if (emp.isMultiLevel && emp.ratios && emp.ratios[deptId] > 0) return true;
        return emp.deptId === deptId;
    });

    let employeesListHtml = "";
    if (deptEmployees.length > 0) {
        employeesListHtml = `
            <table style="width: 100%; border-collapse: collapse; margin-top: 5px; font-size: 0.78rem; background: #FFF; border-radius: 10px; overflow: hidden; box-shadow: var(--shadow-sm); border: 1px solid var(--border-color);">
                <thead>
                    <tr style="background: #f8fafc; border-bottom: 1px solid var(--border-color); text-align: left;">
                        <th style="padding: 10px 12px; font-weight: 700; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Nhân sự</th>
                        <th style="padding: 10px 12px; font-weight: 700; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; text-align: center; width: 100px;">Loại hình</th>
                        <th style="padding: 10px 12px; font-weight: 700; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Chi tiết công thức</th>
                        <th style="padding: 10px 12px; font-weight: 700; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; text-align: right; width: 130px;">Lương phân bổ</th>
                    </tr>
                </thead>
                <tbody>
        `;
        deptEmployees.forEach(emp => {
            if (emp.isMultiLevel && emp.ratios) {
                let totalRatio = Object.values(emp.ratios).reduce((a, b) => a + b, 0);
                const ratioVal = emp.ratios[deptId] || 0;
                const allocatedSalary = emp.salary * (ratioVal / totalRatio);
                totalSalary += allocatedSalary;
                employeesListHtml += `
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <td style="padding: 10px 12px; font-weight: 600; color: var(--text-primary);"><i class="fa-regular fa-user" style="color: var(--text-muted); margin-right: 8px;"></i>${emp.name}</td>
                        <td style="padding: 10px 12px; text-align: center;">
                            <span class="badge" style="font-size: 0.65rem; padding: 2px 6px; background: rgba(16, 185, 129, 0.08); color: #059669; font-weight: 700; border-radius: 6px;">Kiêm nhiệm</span>
                        </td>
                        <td style="padding: 10px 12px; color: var(--text-secondary); font-size: 0.75rem;">Gánh <strong>${ratioVal}%</strong> trên tổng lương ${formatCurrency(emp.salary)}</td>
                        <td style="padding: 10px 12px; text-align: right; font-weight: 700; color: #059669;">${formatCurrency(allocatedSalary)}</td>
                    </tr>
                `;
            } else {
                totalSalary += emp.salary;
                employeesListHtml += `
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <td style="padding: 10px 12px; font-weight: 600; color: var(--text-primary);"><i class="fa-regular fa-user" style="color: var(--text-muted); margin-right: 8px;"></i>${emp.name}</td>
                        <td style="padding: 10px 12px; text-align: center;">
                            <span class="badge" style="font-size: 0.65rem; padding: 2px 6px; background: rgba(71, 85, 105, 0.08); color: var(--text-secondary); font-weight: 700; border-radius: 6px;">Cơ hữu</span>
                        </td>
                        <td style="padding: 10px 12px; color: var(--text-muted); font-size: 0.75rem; font-style: italic;">Định biên toàn thời gian (100%)</td>
                        <td style="padding: 10px 12px; text-align: right; font-weight: 700; color: var(--text-primary);">${formatCurrency(emp.salary)}</td>
                    </tr>
                `;
            }
        });
        employeesListHtml += '</tbody></table>';
    } else {
        employeesListHtml = `
            <div style="text-align: center; padding: 24px; background: #f8fafc; border-radius: 12px; border: 1px dashed var(--border-color); font-size: 0.8rem; color: var(--text-muted);">
                <i class="fa-solid fa-users-slash" style="font-size: 1.6rem; margin-bottom: 8px; display: block; color: var(--text-muted); opacity: 0.5;"></i>
                <em>Không có nhân sự trực thuộc phòng ban này.</em>
            </div>
        `;
    }

    // 2. Chi phí thuê mặt bằng
    let totalRent = 0;
    const blockRoomCounts = {};
    appState.rentBlocks.forEach(blk => blockRoomCounts[blk.id] = 0);
    appState.rooms.forEach(room => {
        if (blockRoomCounts[room.blockId] !== undefined) blockRoomCounts[room.blockId]++;
    });

    const deptRooms = appState.rooms.filter(room => room.splits && room.splits[deptId] > 0);
    let roomsListHtml = "";
    if (deptRooms.length > 0) {
        roomsListHtml = `
            <table style="width: 100%; border-collapse: collapse; margin-top: 5px; font-size: 0.78rem; background: #FFF; border-radius: 10px; overflow: hidden; box-shadow: var(--shadow-sm); border: 1px solid var(--border-color);">
                <thead>
                    <tr style="background: #f8fafc; border-bottom: 1px solid var(--border-color); text-align: left;">
                        <th style="padding: 10px 12px; font-weight: 700; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Phòng học / Mặt bằng</th>
                        <th style="padding: 10px 12px; font-weight: 700; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Khu / Toà</th>
                        <th style="padding: 10px 12px; font-weight: 700; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Tỷ lệ gánh mặt bằng</th>
                        <th style="padding: 10px 12px; font-weight: 700; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; text-align: right; width: 130px;">Tiền mặt bằng phân bổ</th>
                    </tr>
                </thead>
                <tbody>
        `;
        deptRooms.forEach(room => {
            const block = appState.rentBlocks.find(b => b.id === room.blockId);
            if (!block) return;
            const roomCount = blockRoomCounts[block.id] || 1;
            const roomRent = block.totalRent / roomCount;
            const ratio = room.splits[deptId] || 0;
            const allocatedRent = roomRent * (ratio / 100);
            totalRent += allocatedRent;
            roomsListHtml += `
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 10px 12px; font-weight: 600; color: var(--text-primary);"><i class="fa-regular fa-building" style="color: var(--text-muted); margin-right: 8px;"></i>${room.name}</td>
                    <td style="padding: 10px 12px; color: var(--text-secondary);">${block.name}</td>
                    <td style="padding: 10px 12px; color: var(--text-secondary); font-size: 0.75rem;">Sử dụng <strong>${ratio}%</strong> (Định mức phòng: ${formatCurrency(roomRent)}/tháng)</td>
                    <td style="padding: 10px 12px; text-align: right; font-weight: 700; color: var(--accent);">${formatCurrency(allocatedRent)}</td>
                </tr>
            `;
        });
        roomsListHtml += '</tbody></table>';
    } else {
        roomsListHtml = `
            <div style="text-align: center; padding: 24px; background: #f8fafc; border-radius: 12px; border: 1px dashed var(--border-color); font-size: 0.8rem; color: var(--text-muted);">
                <i class="fa-solid fa-building-circle-slash" style="font-size: 1.6rem; margin-bottom: 8px; display: block; color: var(--text-muted); opacity: 0.5;"></i>
                <em>Không gán chi phí thuê mặt bằng riêng lẻ.</em>
            </div>
        `;
    }

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
        allocationTitle = "<i class='fa-solid fa-share-nodes' style='margin-right:6px;'></i> HƯỚNG PHÂN BỔ KẾT CHUYỂN CHI PHÍ";
        let listRowsHtml = `
            <table style="width: 100%; border-collapse: collapse; font-size: 0.78rem; background: #FFF; border-radius: 10px; overflow: hidden; box-shadow: var(--shadow-sm); border: 1px solid var(--border-color); margin-top: 10px;">
                <thead>
                    <tr style="background: #f8fafc; border-bottom: 1px solid var(--border-color); text-align: left;">
                        <th style="padding: 10px 12px; font-weight: 700; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Bộ phận nhận phân bổ</th>
                        <th style="padding: 10px 12px; font-weight: 700; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Công thức / Phương pháp phân bổ</th>
                        <th style="padding: 10px 12px; font-weight: 700; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; text-align: right; width: 140px;">Tỷ trọng phân bổ</th>
                        <th style="padding: 10px 12px; font-weight: 700; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; text-align: right; width: 140px;">Chi phí phân bổ</th>
                    </tr>
                </thead>
                <tbody>
        `;
        const revenueDepts = appState.departments.filter(d => d.type === "revenue");
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
                ratioExplanation = `Phân bổ sỹ số: <strong>${rawVal} HS</strong> / ${sumVal} HS`;
            } else if (method === "staff") {
                ratioExplanation = `Phân bổ nhân sự: <strong>${Number(rawVal).toFixed(1).replace(".0", "")} người</strong> / ${Number(sumVal).toFixed(1).replace(".0", "")} người`;
            } else {
                const rawPercent = appState.drivers.custom_percent[deptId]?.[rd.id] || 0;
                ratioExplanation = `Tỷ lệ gán thủ công: <strong>${rawPercent}%</strong>`;
            }

            listRowsHtml += `
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 10px 12px; font-weight: 600; color: var(--text-primary);"><i class="fa-solid fa-graduation-cap" style="color: var(--primary); margin-right: 6px;"></i>${rd.name}</td>
                    <td style="padding: 10px 12px; color: var(--text-secondary);">${ratioExplanation}</td>
                    <td style="padding: 10px 12px; text-align: right;">
                        <div style="display: inline-block; width: 60px; background: #e2e8f0; height: 6px; border-radius: 3px; overflow: hidden; margin-right: 8px; vertical-align: middle;">
                            <div style="width: ${percent}%; background: var(--primary); height: 100%;"></div>
                        </div>
                        <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-primary);">${percent}%</span>
                    </td>
                    <td style="padding: 10px 12px; text-align: right; font-weight: 700; color: #059669;">${formatCurrency(allocatedVal)}</td>
                </tr>
            `;
        });
        listRowsHtml += '</tbody></table>';

        let noteHtml = "";
        if (dept.note) {
            noteHtml = `
                <div class="callout-box info" style="margin-bottom: 15px; padding: 12px; font-size: 0.78rem; border-left: 4px solid var(--accent); background: rgba(0, 122, 255, 0.03); border-radius: 8px; white-space: pre-wrap; line-height: 1.5; box-shadow: var(--shadow-sm);">
                    <strong>🎯 Thuyết minh chiến lược phân bổ:</strong> <em style="white-space: pre-wrap; display: block; margin-top: 5px; color: var(--text-primary); font-weight: 500; font-style: normal;">"${dept.note}"</em>
                </div>
            `;
        }

        allocationDetailHtml = `
            ${noteHtml}
            <p style="font-size:0.75rem; color: var(--text-secondary); margin-bottom: 10px;">
                Tổng chi phí tự thân ban đầu <strong style="color: var(--text-primary);">${formatCurrency(totalBaseCost)}</strong> được kết chuyển trọn vẹn sang các khối doanh thu để cùng gánh trách nhiệm tài chính:
            </p>
            ${listRowsHtml}
        `;
    } else {
        // Đối với Khối trực tiếp (Tiểu học, THCS, THPT, Nội trú)
        allocationTitle = "<i class='fa-solid fa-plus-minus' style='margin-right:6px;'></i> CHI PHÍ NHẬN PHÂN BỔ TỪ CÁC BAN CHUNG";
        let listRowsHtml = `
            <table style="width: 100%; border-collapse: collapse; font-size: 0.78rem; background: #FFF; border-radius: 10px; overflow: hidden; box-shadow: var(--shadow-sm); border: 1px solid var(--border-color); margin-top: 10px;">
                <thead>
                    <tr style="background: #f8fafc; border-bottom: 1px solid var(--border-color); text-align: left;">
                        <th style="padding: 10px 12px; font-weight: 700; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Ban Gián Tiếp Kết Chuyển Về</th>
                        <th style="padding: 10px 12px; font-weight: 700; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Phương pháp gán</th>
                        <th style="padding: 10px 12px; font-weight: 700; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; text-align: right; width: 140px;">Tỷ trọng gánh</th>
                        <th style="padding: 10px 12px; font-weight: 700; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; text-align: right; width: 140px;">Chi phí phân bổ nhận về</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        // Chi phí từ ban support
        const supportDepts = appState.departments.filter(d => d.type === "support" && !d.isUtility);
        supportDepts.forEach(sd => {
            const val = data.allocatedCosts?.[deptId]?.[sd.id] || 0;
            if (val > 0) {
                const detail = data.allocatedDetails?.[deptId]?.[sd.id] || {};
                const percent = detail.ratioPercent || 0;
                const method = sd.allocationMethod || "manual";
                let methodLabel = method === "student" ? "Sỹ số học sinh" : (method === "staff" ? "Nhân sự" : "Tỷ lệ gán tay");

                listRowsHtml += `
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <td style="padding: 10px 12px; font-weight: 600; color: var(--text-primary);"><i class="fa-solid fa-users-gear" style="color: var(--text-muted); margin-right: 6px;"></i>${sd.name}</td>
                        <td style="padding: 10px 12px; color: var(--text-secondary);">${methodLabel}</td>
                        <td style="padding: 10px 12px; text-align: right; font-weight: 700; color: var(--text-secondary);">${percent}%</td>
                        <td style="padding: 10px 12px; text-align: right; font-weight: 700; color: var(--danger);">${formatCurrency(val)}</td>
                    </tr>
                `;
            }
        });

        // Chi phí điện nước
        const dienVal = data.allocatedUtilityCosts?.[deptId]?.["dept_dien"] || 0;
        const nuocVal = data.allocatedUtilityCosts?.[deptId]?.["dept_nuoc"] || 0;
        if (dienVal > 0) {
            const detail = data.allocatedUtilityDetails?.[deptId]?.["dept_dien"] || {};
            const percent = detail.ratioPercent || 0;
            listRowsHtml += `
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 10px 12px; font-weight: 600; color: var(--text-primary);"><i class="fa-solid fa-bolt" style="color: #FF9500; margin-right: 8px;"></i>Chi phí Điện</td>
                    <td style="padding: 10px 12px; color: var(--text-secondary);">Mặt bằng dùng thực tế (Phòng)</td>
                    <td style="padding: 10px 12px; text-align: right; font-weight: 700; color: var(--text-secondary);">${percent}%</td>
                    <td style="padding: 10px 12px; text-align: right; font-weight: 700; color: var(--danger);">${formatCurrency(dienVal)}</td>
                </tr>
            `;
        }
        if (nuocVal > 0) {
            const detail = data.allocatedUtilityDetails?.[deptId]?.["dept_nuoc"] || {};
            const percent = detail.ratioPercent || 0;
            listRowsHtml += `
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 10px 12px; font-weight: 600; color: var(--text-primary);"><i class="fa-solid fa-faucet-drip" style="color: var(--accent); margin-right: 8px;"></i>Chi phí Nước</td>
                    <td style="padding: 10px 12px; color: var(--text-secondary);">Sỹ số học sinh thực tế (HS)</td>
                    <td style="padding: 10px 12px; text-align: right; font-weight: 700; color: var(--text-secondary);">${percent}%</td>
                    <td style="padding: 10px 12px; text-align: right; font-weight: 700; color: var(--danger);">${formatCurrency(nuocVal)}</td>
                </tr>
            `;
        }
        listRowsHtml += '</tbody></table>';

        let totalAllocatedReceived = dienVal + nuocVal;
        supportDepts.forEach(sd => {
            totalAllocatedReceived += data.allocatedCosts?.[deptId]?.[sd.id] || 0;
        });
        const finalConsolidatedCost = totalBaseCost + totalAllocatedReceived;

        allocationDetailHtml = `
            <p style="font-size:0.75rem; color: var(--text-secondary); margin-bottom: 10px;">
                Bên cạnh chi phí trực tiếp tự thân, khối được nhận thêm các chi phí gián tiếp kết chuyển về để tạo nên bức tranh P&L thực tế:
            </p>
            ${listRowsHtml}
            <div style="display: flex; justify-content: space-between; font-size: 0.95rem; font-weight: 700; margin-top: 15px; padding-top: 12px; border-top: 2px solid var(--border-color); color: var(--danger);">
                <span>TỔNG CHI PHÍ HOẠT ĐỘNG SAU PHÂN BỔ (FINAL COST):</span>
                <span>${formatCurrency(finalConsolidatedCost)}</span>
            </div>
        `;
    }

    const modalBody = document.getElementById("audit_modal_body");
    modalBody.innerHTML = `
        <div class="audit-section" style="max-height: 70vh; overflow-y: auto; padding-right: 5px;">
            <!-- 1. Consolidated Summary Card -->
            <div style="background: rgba(0, 122, 255, 0.03); padding: 16px; border-radius: 12px; margin-bottom: 20px; border: 1px solid rgba(0, 122, 255, 0.08); box-shadow: var(--shadow-sm);">
                <h4 style="margin:0 0 10px 0; color: var(--accent); font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">I. CƠ CẤU CHI PHÍ TỰ THÂN TRỰC TIẾP</h4>
                <div style="display: flex; justify-content: space-between; font-size: 1rem; font-weight: 700; margin-bottom: 15px; border-bottom: 1px dashed var(--border-color); padding-bottom: 10px;">
                    <span>Tổng chi phí tự thân ban đầu:</span>
                    <span style="color: var(--danger); font-size: 1.1rem;">${formatCurrency(totalBaseCost)}</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
                    <div style="background: #FFF; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                        <strong style="font-size: 0.65rem; color: var(--text-secondary); display: block; text-transform: uppercase;">1. Quỹ Lương:</strong>
                        <span style="display: block; font-size: 0.9rem; font-weight: 700; margin-top: 4px; color: #059669;">${formatCurrency(totalSalary)}</span>
                    </div>
                    <div style="background: #FFF; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                        <strong style="font-size: 0.65rem; color: var(--text-secondary); display: block; text-transform: uppercase;">2. Tiền Mặt bằng:</strong>
                        <span style="display: block; font-size: 0.9rem; font-weight: 700; margin-top: 4px; color: var(--accent);">${formatCurrency(totalRent)}</span>
                    </div>
                    <div style="background: #FFF; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                        <strong style="font-size: 0.65rem; color: var(--text-secondary); display: block; text-transform: uppercase;">3. Tiền Tiện ích:</strong>
                        <span style="display: block; font-size: 0.9rem; font-weight: 700; margin-top: 4px; color: #FF9500;">${formatCurrency(totalUtilitySelf)}</span>
                    </div>
                </div>
            </div>

            <!-- 2. Employees Section -->
            <div style="margin-bottom: 24px;">
                <h4 style="margin: 0 0 12px 0; font-size: 0.85rem; color: var(--text-primary); border-bottom: 1.5px solid var(--border-color); padding-bottom: 6px; display: flex; align-items: center; gap: 8px; font-weight: 700;">
                    <i class="fa-solid fa-users" style="color: #059669;"></i> CHI TIẾT NHÂN SỰ & QUỸ LƯƠNG
                </h4>
                ${employeesListHtml}
            </div>

            <!-- 3. Rooms Section -->
            <div style="margin-bottom: 24px;">
                <h4 style="margin: 0 0 12px 0; font-size: 0.85rem; color: var(--text-primary); border-bottom: 1.5px solid var(--border-color); padding-bottom: 6px; display: flex; align-items: center; gap: 8px; font-weight: 700;">
                    <i class="fa-solid fa-hotel" style="color: var(--accent);"></i> CHI TIẾT CƠ SỞ VẬT CHẤT & TIỀN PHÒNG
                </h4>
                ${roomsListHtml}
            </div>

            <!-- 4. Allocation Details Section -->
            <div style="background: rgba(52, 199, 89, 0.02); padding: 16px; border-radius: 12px; border: 1px solid rgba(52, 199, 89, 0.12); box-shadow: var(--shadow-sm); margin-bottom: 10px;">
                <h4 style="margin:0 0 12px 0; color: #059669; font-size: 0.85rem; font-weight: 700; display: flex; align-items: center; gap: 8px; text-transform: uppercase;">
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

        // Bảng màu cho các Khối học của nhân viên
        const getDeptTheme = (name) => {
            const lower = name.toLowerCase();
            if (lower.includes("tiểu học")) return { color: "#007AFF" };
            if (lower.includes("thcs")) return { color: "#34C759" };
            if (lower.includes("thpt")) return { color: "#AF52DE" };
            return { color: "#FF9500" };
        };

        let breakdownText = "";
        if (emp.isMultiLevel) {
            let totalEmpPct = 0;
            const nonUtilityDepts = appState.departments.filter(d => !d.isUtility);
            nonUtilityDepts.forEach(d => {
                const val = (emp.ratios?.[d.id] !== undefined) ? emp.ratios[d.id] : 0;
                totalEmpPct += val;
            });

            const isAmountMode = emp.allocationMode === "amount";

            let empBadgeHtml = "";
            if (isAmountMode) {
                const totalAlloc = totalEmpPct;
                const diff = emp.salary - totalAlloc;
                if (diff === 0) {
                    empBadgeHtml = `<span id="emp_badge_${emp.id}" class="badge badge-revenue" style="font-size:0.65rem; padding: 1px 4px; display:inline-block; margin-left:6px;"><i class="fa-solid fa-circle-check"></i> Khớp 100% lương</span>`;
                } else if (diff > 0) {
                    empBadgeHtml = `<span id="emp_badge_${emp.id}" class="badge" style="background-color: rgba(255, 149, 0, 0.08); color: var(--warning); font-size:0.65rem; padding: 1px 4px; display:inline-block; margin-left:6px;"><i class="fa-solid fa-circle-exclamation"></i> Tổng: ${formatCurrency(totalAlloc)} (Thiếu ${formatCurrency(diff)})</span>`;
                } else {
                    empBadgeHtml = `<span id="emp_badge_${emp.id}" class="badge" style="background-color: rgba(255, 59, 48, 0.08); color: #FF3B30; font-size:0.65rem; padding: 1px 4px; display:inline-block; margin-left:6px;"><i class="fa-solid fa-circle-xmark"></i> Tổng: ${formatCurrency(totalAlloc)} (Thừa ${formatCurrency(-diff)})</span>`;
                }
            } else {
                if (totalEmpPct === 100) {
                    empBadgeHtml = `<span id="emp_badge_${emp.id}" class="badge badge-revenue" style="font-size:0.65rem; padding: 1px 4px; display:inline-block; margin-left:6px;"><i class="fa-solid fa-circle-check"></i> Đủ 100%</span>`;
                } else if (totalEmpPct < 100) {
                    empBadgeHtml = `<span id="emp_badge_${emp.id}" class="badge" style="background-color: rgba(255, 149, 0, 0.08); color: var(--warning); font-size:0.65rem; padding: 1px 4px; display:inline-block; margin-left:6px;"><i class="fa-solid fa-circle-exclamation"></i> Tổng: ${totalEmpPct}% (Thiếu ${100 - totalEmpPct}%)</span>`;
                } else {
                    empBadgeHtml = `<span id="emp_badge_${emp.id}" class="badge" style="background-color: rgba(255, 59, 48, 0.08); color: #FF3B30; font-size:0.65rem; padding: 1px 4px; display:inline-block; margin-left:6px;"><i class="fa-solid fa-circle-xmark"></i> Tổng: ${totalEmpPct}% (Thừa ${totalEmpPct - 100}%)</span>`;
                }
            }

            // 1. Tạo Thanh phân bổ tỷ lệ trực quan cho nhân sự (Segmented Progress Bar) siêu sang trọng (Dày 4px thanh lịch)
            let progressBarHtml = `<div style="display: flex; height: 4px; width: 100%; border-radius: 2px; overflow: hidden; background: #EAEAEF; margin-top: 5px; margin-bottom: 6px; box-shadow: inset 0 0.5px 1.5px rgba(0,0,0,0.05);">`;
            nonUtilityDepts.forEach(d => {
                const val = (emp.ratios?.[d.id] !== undefined) ? emp.ratios[d.id] : 0;
                if (val > 0) {
                    const theme = getDeptTheme(d.name);
                    const widthPct = isAmountMode ? Math.min(100, val / emp.salary * 100) : val;
                    progressBarHtml += `<div style="width: ${widthPct}%; background-color: ${theme.color}; transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);" title="${d.name}: ${isAmountMode ? formatCurrency(val) : (val + '%')}"></div>`;
                }
            });
            progressBarHtml += `</div>`;

            // 2. Tạo danh sách các phòng ban phân bổ ĐANG HOẠT ĐỘNG (Tỷ lệ > 0) để tóm tắt cực thoáng mắt
            let activeTagsHtml = `<div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; align-items: center;">`;
            let activeCount = 0;
            nonUtilityDepts.forEach(d => {
                const val = (emp.ratios?.[d.id] !== undefined) ? emp.ratios[d.id] : 0;
                if (val > 0) {
                    activeCount++;
                    const theme = getDeptTheme(d.name);
                    const shortName = d.name.replace("Khối ", "").replace("Ban ", "");
                    const noteText = emp.ratioNotes?.[d.id] || '';
                    const noteIcon = noteText ? ` <i class="fa-regular fa-comment-dots" style="color: ${theme.color}; opacity: 0.85; font-size: 0.65rem;" title="${noteText}"></i>` : '';

                    activeTagsHtml += `
                        <span style="font-size: 0.68rem; font-weight: 600; padding: 2px 6px; background: #FFFFFF; border: 1px solid rgba(0,0,0,0.06); color: var(--text-primary); border-radius: 4px; display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.02);"
                              title="${d.name}: ${isAmountMode ? formatCurrency(val) : (val + '%')}${noteText ? ' — Ghi chú: ' + noteText : ''}">
                            <span style="display: inline-block; width: 4px; height: 4px; border-radius: 50%; background-color: ${theme.color};"></span>
                            ${shortName}: <strong style="color: ${theme.color}">${isAmountMode ? formatCurrency(val) : (val + '%')}</strong>${noteIcon}
                        </span>
                    `;
                }
            });
            if (activeCount === 0) {
                activeTagsHtml += `<span style="font-size: 0.68rem; color: var(--text-muted); font-style: italic;">Chưa phân bổ tỷ lệ</span>`;
            }
            activeTagsHtml += `</div>`;

            // 3. Nút mở popup modal phân bổ kiêm nhiệm
            const configBtnHtml = `
                <button class="btn" style="padding: 3px 10px; font-size: 0.72rem; margin-top: 6px; background: rgba(0, 122, 255, 0.07); color: var(--info); border: 1px solid rgba(0, 122, 255, 0.15); border-radius: 5px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; transition: all 0.2s;" 
                    onclick="openEmpRatioModal('${emp.id}')" 
                    onmouseover="this.style.background='rgba(0,122,255,0.12)'" 
                    onmouseout="this.style.background='rgba(0,122,255,0.07)'">
                    <i class="fa-solid fa-sliders"></i> Điều chỉnh phân bổ
                </button>
            `;

            breakdownText = `
                <div style="display:flex; align-items:center; margin-top:6px; gap:4px; flex-wrap: wrap;">
                    <span style="font-size:0.75rem; font-weight:600; color:var(--text-primary);">Phân bổ kiêm nhiệm:</span>
                    ${empBadgeHtml}
                </div>
                <div id="emp_ratio_summary_container_${emp.id}">
                    ${progressBarHtml}
                    ${activeTagsHtml}
                </div>
                ${configBtnHtml}
            `;
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
                const isAmountMode = emp.allocationMode === "amount";
                if (isAmountMode) {
                    if (ratios[d.id] > 0) {
                        cellVal = ratios[d.id];
                        const pct = emp.salary > 0 ? (cellVal / emp.salary * 100).toFixed(0) : 0;
                        cellText = `<span style="font-weight: 500; color: var(--primary);">${formatCurrency(cellVal)}</span> <small class="text-muted">(${pct}%)</small>`;
                    }
                } else {
                    let totalRatio = 0;
                    Object.values(ratios).forEach(r => totalRatio += r);
                    if (totalRatio > 0 && ratios[d.id] > 0) {
                        const pct = ratios[d.id];
                        cellVal = emp.salary * (pct / totalRatio);
                        cellText = `<span style="font-weight: 500; color: var(--primary);">${formatCurrency(cellVal)}</span> <small class="text-muted">(${pct}%)</small>`;
                    }
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
        updateEmpActiveTagsAndProgress(empId);
    }
}

// ========== KIÊM NHIỆM RATIO MODAL SYSTEM ==========

let _empRatioModalId = null; // Current employee being edited in modal
let _empRatioModalMode = 'percentage'; // 'percentage' | 'amount'
let _empRatioModalDraftRatios = {}; // Draft in-modal ratios (not saved until Save click)
let _empRatioModalDraftNotes = {}; // Draft notes

function openEmpRatioModal(empId) {
    const emp = appState.employees.find(e => e.id === empId);
    if (!emp) return;

    _empRatioModalId = empId;
    _empRatioModalMode = emp.allocationMode || 'percentage';
    // Clone current ratios and notes as draft
    _empRatioModalDraftRatios = Object.assign({}, emp.ratios || {});
    _empRatioModalDraftNotes = Object.assign({}, emp.ratioNotes || {});

    // Update modal header
    document.getElementById('emp_ratio_modal_title').textContent = emp.name;
    document.getElementById('emp_ratio_modal_subtitle').textContent =
        'Lương gốc: ' + formatCurrency(emp.salary) + ' — Phân bổ cho từng bộ phận kiêm nhiệm';

    // Render dept list
    _renderEmpRatioModalList();

    // Update mode toggle buttons
    _updateEmpRatioModeButtons();

    // Open modal
    document.getElementById('emp_ratio_modal').classList.add('open');
}

function _renderEmpRatioModalList() {
    const emp = appState.employees.find(e => e.id === _empRatioModalId);
    if (!emp) return;
    const isAmt = _empRatioModalMode === 'amount';
    const nonUtilityDepts = appState.departments.filter(d => !d.isUtility);

    const getDeptTheme = (name) => {
        const lower = name.toLowerCase();
        if (lower.includes('tiểu học')) return { color: '#007AFF' };
        if (lower.includes('thcs')) return { color: '#34C759' };
        if (lower.includes('thpt')) return { color: '#AF52DE' };
        return { color: '#FF9500' };
    };

    let html = '';
    nonUtilityDepts.forEach(d => {
        const theme = getDeptTheme(d.name);
        const shortName = d.name.replace('Khối ', '').replace('Ban ', '');
        const val = _empRatioModalDraftRatios[d.id] || 0;
        const inputColor = val > 0 ? theme.color : '#8E8E93';
        const pctWidth = isAmt
            ? (emp.salary > 0 ? Math.min(100, Math.round(val / emp.salary * 100)) : 0)
            : Math.min(100, val);

        const noteVal = _empRatioModalDraftNotes[d.id] || '';

        html += `<div style="display:flex; flex-direction:column; gap:6px; padding:10px 12px; background:#FFFFFF; border-radius:7px; border-left:4px solid ${theme.color};">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; width:100%;">
                <div style="flex:1; min-width:0;">
                    <div style="font-size:0.85rem; font-weight:700; color:#1D1D1F;">${shortName}</div>
                    <div style="height:3px; border-radius:2px; background:rgba(0,0,0,0.06); overflow:hidden; margin-top:4px;">
                        <div id="emp_ratio_bar_${d.id}" style="height:100%; width:${pctWidth}%; background:${theme.color}; border-radius:2px; transition:width 0.25s;"></div>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:5px; flex-shrink:0;">
                    <input type="${isAmt ? 'text' : 'number'}" ${isAmt ? '' : 'min="0" max="100"'}
                        id="emp_ratio_input_${d.id}"
                        data-dept-id="${d.id}"
                        data-dept-color="${theme.color}"
                        style="width:${isAmt ? '96px' : '56px'}; padding:5px 8px; font-size:0.9rem; font-weight:800; color:${inputColor}; background:#F5F5F7; border:1.5px solid rgba(0,0,0,0.1); border-radius:6px; text-align:right; outline:none; font-family:inherit; transition:border-color 0.15s;"
                        value="${isAmt ? formatNumberWithDots(val) : val}"
                        oninput="${isAmt ? 'handleMoneyInput(this);' : ''}updateEmpRatioModalDraft(this)"
                        onfocus="this.style.borderColor='${theme.color}'"
                        onblur="this.style.borderColor='rgba(0,0,0,0.1)'">
                    <span style="font-size:0.78rem; font-weight:700; color:#8E8E93; min-width:16px;">${isAmt ? 'đ' : '%'}</span>
                </div>
            </div>
            <!-- Ô nhập ghi chú lý do / vai trò kiêm nhiệm -->
            <div style="display:flex; align-items:center; gap:6px; background:#F5F5F7; padding:4px 8px; border-radius:6px; border: 1px dashed rgba(0,0,0,0.05);">
                <i class="fa-regular fa-comment-dots" style="color:#8E8E93; font-size:0.78rem;"></i>
                <input type="text"
                    id="emp_ratio_note_${d.id}"
                    data-dept-id="${d.id}"
                    placeholder="Mô tả vai trò / công việc kiêm nhiệm..."
                    style="flex:1; border:none; background:transparent; font-size:0.75rem; color:#1D1D1F; outline:none; font-family:inherit; padding:0;"
                    value="${noteVal}"
                    oninput="updateEmpRatioModalDraftNote(this)">
            </div>
        </div>`;
    });

    document.getElementById('emp_ratio_dept_list').innerHTML = html;
    updateEmpRatioStatusBar();
}

function updateEmpRatioModalDraft(input) {
    const deptId = input.dataset.deptId;
    const deptColor = input.dataset.deptColor;
    const isAmt = _empRatioModalMode === 'amount';
    const val = isAmt ? parseMoneyValue(input.value) : (parseFloat(input.value) || 0);
    _empRatioModalDraftRatios[deptId] = val;
    input.style.color = val > 0 ? deptColor : '#8E8E93';

    // Update mini progress bar
    const emp = appState.employees.find(e => e.id === _empRatioModalId);
    const barEl = document.getElementById('emp_ratio_bar_' + deptId);
    if (barEl && emp) {
        const pctWidth = isAmt
            ? (emp.salary > 0 ? Math.min(100, Math.round(val / emp.salary * 100)) : 0)
            : Math.min(100, val);
        barEl.style.width = pctWidth + '%';
    }
    updateEmpRatioStatusBar();
}

function updateEmpRatioModalDraftNote(input) {
    const deptId = input.dataset.deptId;
    _empRatioModalDraftNotes[deptId] = input.value.trim();
}

function updateEmpRatioStatusBar() {
    const emp = appState.employees.find(e => e.id === _empRatioModalId);
    if (!emp) return;
    const isAmt = _empRatioModalMode === 'amount';
    const statusBar = document.getElementById('emp_ratio_status_bar');
    if (!statusBar) return;

    let total = 0;
    Object.values(_empRatioModalDraftRatios).forEach(v => total += (v || 0));

    if (isAmt) {
        const diff = emp.salary - total;
        if (diff === 0) {
            statusBar.style.background = 'rgba(52,199,89,0.08)';
            statusBar.style.borderColor = 'rgba(52,199,89,0.3)';
            statusBar.style.color = '#34C759';
            statusBar.innerHTML = '<i class="fa-solid fa-circle-check"></i><span>Khớp lương gốc ✓</span>';
        } else if (diff > 0) {
            statusBar.style.background = 'rgba(255,149,0,0.07)';
            statusBar.style.borderColor = 'rgba(255,149,0,0.25)';
            statusBar.style.color = '#FF9500';
            statusBar.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i><span>Tổng: ' + formatCurrency(total) + ' — Thiếu ' + formatCurrency(diff) + '</span>';
        } else {
            statusBar.style.background = 'rgba(255,59,48,0.07)';
            statusBar.style.borderColor = 'rgba(255,59,48,0.25)';
            statusBar.style.color = '#FF3B30';
            statusBar.innerHTML = '<i class="fa-solid fa-circle-xmark"></i><span>Vượt quá ' + formatCurrency(-diff) + '</span>';
        }
    } else {
        const diff = 100 - total;
        if (Math.abs(diff) < 0.1) {
            statusBar.style.background = 'rgba(52,199,89,0.08)';
            statusBar.style.borderColor = 'rgba(52,199,89,0.3)';
            statusBar.style.color = '#34C759';
            statusBar.innerHTML = '<i class="fa-solid fa-circle-check"></i><span>Đủ 100% ✓</span>';
        } else if (diff > 0) {
            statusBar.style.background = 'rgba(255,149,0,0.07)';
            statusBar.style.borderColor = 'rgba(255,149,0,0.25)';
            statusBar.style.color = '#FF9500';
            statusBar.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i><span>Tổng: ' + total.toFixed(1) + '% — Thiếu ' + diff.toFixed(1) + '%</span>';
        } else {
            statusBar.style.background = 'rgba(255,59,48,0.07)';
            statusBar.style.borderColor = 'rgba(255,59,48,0.25)';
            statusBar.style.color = '#FF3B30';
            statusBar.innerHTML = '<i class="fa-solid fa-circle-xmark"></i><span>Vượt quá ' + (-diff).toFixed(1) + '%</span>';
        }
    }
}

function switchEmpRatioMode(mode) {
    if (_empRatioModalMode === mode) return;
    // Read current input values into draft before switching
    const isAmt = _empRatioModalMode === 'amount';
    document.querySelectorAll('#emp_ratio_dept_list input[id^="emp_ratio_input_"]').forEach(input => {
        const deptId = input.dataset.deptId;
        if (deptId) {
            _empRatioModalDraftRatios[deptId] = isAmt ? parseMoneyValue(input.value) : (parseFloat(input.value) || 0);
        }
    });
    _empRatioModalMode = mode;

    // If switching between modes, convert the draft values
    const emp = appState.employees.find(e => e.id === _empRatioModalId);
    if (emp && emp.salary > 0) {
        const newDraft = {};
        if (mode === 'amount') {
            // Convert % -> VNĐ
            Object.entries(_empRatioModalDraftRatios).forEach(([dId, pct]) => {
                newDraft[dId] = Math.round(emp.salary * (pct / 100));
            });
        } else {
            // Convert VNĐ -> % (proportional)
            const totalAmt = Object.values(_empRatioModalDraftRatios).reduce((s, v) => s + (v || 0), 0);
            if (totalAmt > 0) {
                Object.entries(_empRatioModalDraftRatios).forEach(([dId, amt]) => {
                    newDraft[dId] = Math.round((amt / totalAmt) * 100 * 10) / 10;
                });
            } else {
                Object.keys(_empRatioModalDraftRatios).forEach(dId => { newDraft[dId] = 0; });
            }
        }
        _empRatioModalDraftRatios = newDraft;
    }

    _updateEmpRatioModeButtons();
    _renderEmpRatioModalList();
}

function _updateEmpRatioModeButtons() {
    const btnPct = document.getElementById('emp_ratio_btn_pct');
    const btnAmt = document.getElementById('emp_ratio_btn_amt');
    if (!btnPct || !btnAmt) return;
    const isPct = _empRatioModalMode === 'percentage';
    btnPct.style.background = isPct ? '#FFFFFF' : 'transparent';
    btnPct.style.fontWeight = isPct ? '700' : '500';
    btnPct.style.color = isPct ? 'var(--info)' : 'var(--text-secondary)';
    btnPct.style.boxShadow = isPct ? '0 1px 3px rgba(0,0,0,0.1)' : 'none';
    btnAmt.style.background = !isPct ? '#FFFFFF' : 'transparent';
    btnAmt.style.fontWeight = !isPct ? '700' : '500';
    btnAmt.style.color = !isPct ? 'var(--info)' : 'var(--text-secondary)';
    btnAmt.style.boxShadow = !isPct ? '0 1px 3px rgba(0,0,0,0.1)' : 'none';
}

function saveEmpRatioModal() {
    // Read latest inputs
    const isAmt = _empRatioModalMode === 'amount';
    document.querySelectorAll('#emp_ratio_dept_list input[id^="emp_ratio_input_"]').forEach(input => {
        const deptId = input.dataset.deptId;
        if (deptId) {
            _empRatioModalDraftRatios[deptId] = isAmt ? parseMoneyValue(input.value) : (parseFloat(input.value) || 0);
        }
    });

    // Read latest notes
    document.querySelectorAll('#emp_ratio_dept_list input[id^="emp_ratio_note_"]').forEach(input => {
        const deptId = input.dataset.deptId;
        if (deptId) {
            _empRatioModalDraftNotes[deptId] = input.value.trim();
        }
    });

    // Validate
    const emp = appState.employees.find(e => e.id === _empRatioModalId);
    if (!emp) return;
    let total = Object.values(_empRatioModalDraftRatios).reduce((s, v) => s + (v || 0), 0);
    if (isAmt) {
        if (Math.abs(total - emp.salary) > 1) {
            const diff = emp.salary - total;
            if (!confirm('Tổng phân bổ chưa khớp lương gốc (Thiếu/Thừa ' + formatCurrency(Math.abs(diff)) + '). Vẫn lưu?')) return;
        }
    } else {
        if (Math.abs(total - 100) > 0.5) {
            if (!confirm('Tổng % chưa đủ 100% (Hiện: ' + total.toFixed(1) + '%). Vẫn lưu?')) return;
        }
    }

    // Save to appState
    emp.allocationMode = _empRatioModalMode;
    emp.ratios = Object.assign({}, _empRatioModalDraftRatios);
    
    // Save notes
    emp.ratioNotes = {};
    Object.entries(_empRatioModalDraftNotes).forEach(([dId, text]) => {
        if (text) {
            emp.ratioNotes[dId] = text;
        }
    });

    saveState();

    // Update badge + progress in employee list without full re-render
    updateEmpBadgeInDOM(_empRatioModalId);
    updateEmpActiveTagsAndProgress(_empRatioModalId);
    renderDashboard();

    closeModal('emp_ratio_modal');
}

// =========================================================

function updateEmployeeAllocationMode(empId, mode) {
    // This function now only used for legacy calls — redirect to modal switcher
    if (_empRatioModalId === empId) {
        switchEmpRatioMode(mode);
    }
}

let currentEmpAddAllocationMode = "percentage";

function setEmpAddAllocationMode(mode) {
    currentEmpAddAllocationMode = mode;
    
    const btnPct = document.getElementById("btn_emp_add_mode_pct");
    const btnAmt = document.getElementById("btn_emp_add_mode_amt");
    const titleEl = document.getElementById("emp_add_ratios_title");
    
    if (btnPct && btnAmt) {
        if (mode === "percentage") {
            btnPct.style.background = "#FFFFFF";
            btnPct.style.fontWeight = "700";
            btnPct.style.color = "var(--text-primary)";
            btnAmt.style.background = "transparent";
            btnAmt.style.fontWeight = "500";
            btnAmt.style.color = "var(--text-secondary)";
            if (titleEl) {
                titleEl.innerHTML = `<i class="fa-solid fa-calculator"></i> Nhập tỷ lệ (%) phân bổ lương. Tổng tỷ lệ bắt buộc phải bằng 100%:`;
            }
        } else {
            btnAmt.style.background = "#FFFFFF";
            btnAmt.style.fontWeight = "700";
            btnAmt.style.color = "var(--text-primary)";
            btnPct.style.background = "transparent";
            btnPct.style.fontWeight = "500";
            btnPct.style.color = "var(--text-secondary)";
            if (titleEl) {
                titleEl.innerHTML = `<i class="fa-solid fa-calculator"></i> Nhập số tiền (VNĐ) phân bổ trực tiếp. Tổng số tiền phải khớp với lương gốc:`;
            }
        }
    }
    
    toggleMultiLevelInputs();
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

    const isAmountMode = emp.allocationMode === "amount";
    if (isAmountMode) {
        const totalAlloc = totalEmpPct;
        const diff = emp.salary - totalAlloc;
        if (diff === 0) {
            badgeEl.className = "badge badge-revenue";
            badgeEl.style.backgroundColor = "rgba(52, 199, 89, 0.08)";
            badgeEl.style.color = "var(--success)";
            badgeEl.style.fontSize = "0.65rem";
            badgeEl.style.padding = "1px 4px";
            badgeEl.style.display = "inline-block";
            badgeEl.style.marginLeft = "6px";
            badgeEl.innerHTML = `<i class="fa-solid fa-circle-check"></i> Khớp 100% lương`;
        } else if (diff > 0) {
            badgeEl.className = "badge";
            badgeEl.style.backgroundColor = "rgba(255, 149, 0, 0.08)";
            badgeEl.style.color = "var(--warning)";
            badgeEl.style.fontSize = "0.65rem";
            badgeEl.style.padding = "1px 4px";
            badgeEl.style.display = "inline-block";
            badgeEl.style.marginLeft = "6px";
            badgeEl.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Tổng: ${formatCurrency(totalAlloc)} (Thiếu ${formatCurrency(diff)})`;
        } else {
            badgeEl.className = "badge";
            badgeEl.style.backgroundColor = "rgba(255, 59, 48, 0.08)";
            badgeEl.style.color = "#FF3B30";
            badgeEl.style.fontSize = "0.65rem";
            badgeEl.style.padding = "1px 4px";
            badgeEl.style.display = "inline-block";
            badgeEl.style.marginLeft = "6px";
            badgeEl.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Tổng: ${formatCurrency(totalAlloc)} (Thừa ${formatCurrency(-diff)})`;
        }
    } else {
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
}

// Hàm mở rộng/thu gọn ô nhập tỷ lệ phân bổ kiêm nhiệm của nhân sự
function toggleEmployeeRatioGrid(empId) {
    const container = document.getElementById(`ratio_grid_container_${empId}`);
    const btn = document.getElementById(`ratio_grid_btn_${empId}`);
    if (container && btn) {
        const isHidden = container.style.display === "none" || container.style.display === "";
        container.style.display = isHidden ? "block" : "none";
        btn.innerHTML = isHidden 
            ? `<i class="fa-solid fa-chevron-up"></i> Thu gọn ô nhập` 
            : `<i class="fa-solid fa-sliders"></i> Cấu hình tỷ lệ`;
        btn.style.background = isHidden ? "rgba(255, 94, 0, 0.08)" : "rgba(0, 122, 255, 0.06)";
        btn.style.color = isHidden ? "#FF5E00" : "var(--info)";
        btn.style.borderColor = isHidden ? "rgba(255, 94, 0, 0.15)" : "rgba(0, 122, 255, 0.12)";
    }
}

// Cập nhật động danh sách các badge phòng ban gánh lương & thanh Segmented Progress Bar khi đang gõ
function updateEmpActiveTagsAndProgress(empId) {
    const emp = appState.employees.find(e => e.id === empId);
    if (!emp) return;
    const container = document.getElementById(`emp_ratio_summary_container_${empId}`);
    if (!container) return;

    const nonUtilityDepts = appState.departments.filter(d => !d.isUtility);
    const getDeptTheme = (name) => {
        const lower = name.toLowerCase();
        if (lower.includes("tiểu học")) return { color: "#007AFF" };
        if (lower.includes("thcs")) return { color: "#34C759" };
        if (lower.includes("thpt")) return { color: "#AF52DE" };
        return { color: "#FF9500" };
    };

    const isAmountMode = emp.allocationMode === "amount";

    // Segmented Progress Bar
    let progressBarHtml = `<div style="display: flex; height: 4px; width: 100%; border-radius: 2px; overflow: hidden; background: #EAEAEF; margin-top: 5px; margin-bottom: 6px; box-shadow: inset 0 0.5px 1.5px rgba(0,0,0,0.05);">`;
    nonUtilityDepts.forEach(d => {
        const val = (emp.ratios?.[d.id] !== undefined) ? emp.ratios[d.id] : 0;
        if (val > 0) {
            const theme = getDeptTheme(d.name);
            const widthPct = isAmountMode ? Math.min(100, val / emp.salary * 100) : val;
            progressBarHtml += `<div style="width: ${widthPct}%; background-color: ${theme.color}; transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);" title="${d.name}: ${isAmountMode ? formatCurrency(val) : (val + '%')}"></div>`;
        }
    });
    progressBarHtml += `</div>`;

    // Active tags
    let activeTagsHtml = `<div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; align-items: center;">`;
    let activeCount = 0;
    nonUtilityDepts.forEach(d => {
        const val = (emp.ratios?.[d.id] !== undefined) ? emp.ratios[d.id] : 0;
        if (val > 0) {
            activeCount++;
            const theme = getDeptTheme(d.name);
            const shortName = d.name.replace("Khối ", "").replace("Ban ", "");
            const noteText = emp.ratioNotes?.[d.id] || '';
            const noteIcon = noteText ? ` <i class="fa-regular fa-comment-dots" style="color: ${theme.color}; opacity: 0.85; font-size: 0.65rem;" title="${noteText}"></i>` : '';

            activeTagsHtml += `
                <span style="font-size: 0.68rem; font-weight: 600; padding: 2px 6px; background: #FFFFFF; border: 1px solid rgba(0,0,0,0.06); color: var(--text-primary); border-radius: 4px; display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.02);"
                      title="${d.name}: ${isAmountMode ? formatCurrency(val) : (val + '%')}${noteText ? ' — Ghi chú: ' + noteText : ''}">
                    <span style="display: inline-block; width: 4px; height: 4px; border-radius: 50%; background-color: ${theme.color};"></span>
                    ${shortName}: <strong style="color: ${theme.color}">${isAmountMode ? formatCurrency(val) : (val + '%')}</strong>${noteIcon}
                </span>
            `;
        }
    });
    if (activeCount === 0) {
        activeTagsHtml += `<span style="font-size: 0.68rem; color: var(--text-muted); font-style: italic;">Chưa phân bổ tỷ lệ</span>`;
    }
    activeTagsHtml += `</div>`;

    container.innerHTML = progressBarHtml + activeTagsHtml;
}

function toggleMultiLevelInputs() {
    const isMulti = document.getElementById("emp_add_multilevel").checked;
    const ratioWrapper = document.getElementById("emp_add_ratios_wrapper");
    
    if (isMulti) {
        ratioWrapper.style.display = "block";
        const grid = ratioWrapper.querySelector(".ratios-grid");
        grid.innerHTML = "";
        
        // Bảng màu cho Add Employee ratios
        const getDeptTheme = (name) => {
            const lower = name.toLowerCase();
            if (lower.includes("tiểu học")) return { color: "#007AFF" };
            if (lower.includes("thcs")) return { color: "#34C759" };
            if (lower.includes("thpt")) return { color: "#AF52DE" };
            return { color: "#FF9500" };
        };

        const isAmountMode = currentEmpAddAllocationMode === "amount";
        const empSalary = parseMoneyValue(document.getElementById("emp_add_salary").value) || 0;

        appState.departments.filter(dept => !dept.isUtility).forEach(dept => {
            const theme = getDeptTheme(dept.name);
            const shortName = dept.name.replace("Khối ", "").replace("Ban ", "");
            const defaultVal = dept.id === document.getElementById("emp_add_dept").value ? (isAmountMode ? empSalary : 100) : 0;
            const inputColor = defaultVal > 0 ? theme.color : '#8E8E93';

            grid.innerHTML += `
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 7px 12px; background: #FFFFFF; border-radius: 7px; border-left: 3px solid ${theme.color}; min-height: 36px;">
                    <span style="font-size: 0.82rem; font-weight: 600; color: #1D1D1F;">${shortName}</span>
                    <div style="display: flex; align-items: center; gap: 4px; flex-shrink: 0;">
                        <input type="${isAmountMode ? 'text' : 'number'}" ${isAmountMode ? '' : 'min="0" max="100"'} class="emp-add-ratio-val ${isAmountMode ? 'money-input' : 'ratio-pct-input'}" data-dept-id="${dept.id}"
                          style="width: ${isAmountMode ? '90px' : '48px'}; padding: 4px 7px; font-size: 0.85rem; font-weight: 800; color: ${inputColor}; background: #F5F5F7; border: 1px solid rgba(0,0,0,0.1); border-radius: 5px; text-align: right; outline: none; font-family: inherit;" 
                          value="${isAmountMode ? formatNumberWithDots(defaultVal) : defaultVal}" 
                          oninput="${isAmountMode ? 'handleMoneyInput(this); updateEmpAddRatiosSummary();' : 'updateEmpAddRatiosSummary();'}">
                        <span style="font-size: 0.72rem; font-weight: 700; color: #8E8E93; min-width: 14px;">${isAmountMode ? 'đ' : '%'}</span>
                    </div>
                </div>
            `;
        });
        updateEmpAddRatiosSummary();
    } else {
        ratioWrapper.style.display = "none";
    }
}

function updateEmpAddRatiosSummary() {
    const isAmountMode = currentEmpAddAllocationMode === "amount";
    const empSalary = parseMoneyValue(document.getElementById("emp_add_salary").value) || 0;
    
    let total = 0;
    document.querySelectorAll(".emp-add-ratio-val").forEach(input => {
        const val = isAmountMode ? parseMoneyValue(input.value) : (parseFloat(input.value) || 0);
        total += val;
    });

    const totalEl = document.getElementById("emp_add_total_pct");
    const msgEl = document.getElementById("emp_add_status_msg");
    const summaryBox = document.getElementById("emp_add_ratios_summary");

    if (totalEl && msgEl && summaryBox) {
        if (isAmountMode) {
            totalEl.textContent = formatCurrency(total);
            const diff = empSalary - total;
            
            if (diff === 0) {
                totalEl.style.color = "var(--success)";
                msgEl.innerHTML = `<span style="color: var(--success);"><i class="fa-solid fa-circle-check"></i> Khớp 100% lương gốc</span>`;
                summaryBox.style.borderColor = "rgba(52, 199, 89, 0.35)";
                summaryBox.style.background = "rgba(52, 199, 89, 0.04)";
            } else if (diff > 0) {
                totalEl.style.color = "var(--warning)";
                msgEl.innerHTML = `<span style="color: var(--warning);"><i class="fa-solid fa-circle-exclamation"></i> Chưa khớp (Thiếu ${formatCurrency(diff)})</span>`;
                summaryBox.style.borderColor = "rgba(255, 149, 0, 0.35)";
                summaryBox.style.background = "rgba(255, 149, 0, 0.04)";
            } else {
                totalEl.style.color = "var(--danger)";
                msgEl.innerHTML = `<span style="color: var(--danger);"><i class="fa-solid fa-circle-xmark"></i> Vượt quá (Thừa ${formatCurrency(-diff)})</span>`;
                summaryBox.style.borderColor = "rgba(255, 59, 48, 0.35)";
                summaryBox.style.background = "rgba(255, 59, 48, 0.04)";
            }
        } else {
            totalEl.textContent = total + "%";
            
            if (Math.abs(total - 100) < 0.1) {
                totalEl.style.color = "var(--success)";
                msgEl.innerHTML = `<span style="color: var(--success);"><i class="fa-solid fa-circle-check"></i> Đã đủ 100% (Hợp lệ)</span>`;
                summaryBox.style.borderColor = "rgba(52, 199, 89, 0.35)";
                summaryBox.style.background = "rgba(52, 199, 89, 0.04)";
            } else if (total < 100) {
                totalEl.style.color = "var(--warning)";
                const diff = (100 - total).toFixed(0);
                msgEl.innerHTML = `<span style="color: var(--warning);"><i class="fa-solid fa-circle-exclamation"></i> Chưa đủ 100% (Thiếu ${diff}%)</span>`;
                summaryBox.style.borderColor = "rgba(255, 149, 0, 0.35)";
                summaryBox.style.background = "rgba(255, 149, 0, 0.04)";
            } else {
                totalEl.style.color = "var(--danger)";
                const diff = (total - 100).toFixed(0);
                msgEl.innerHTML = `<span style="color: var(--danger);"><i class="fa-solid fa-circle-xmark"></i> Vượt quá 100% (Thừa ${diff}%)</span>`;
                summaryBox.style.borderColor = "rgba(255, 59, 48, 0.35)";
                summaryBox.style.background = "rgba(255, 59, 48, 0.04)";
            }
        }
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
        const isAmountMode = currentEmpAddAllocationMode === "amount";
        document.querySelectorAll(".emp-add-ratio-val").forEach(input => {
            const dId = input.getAttribute("data-dept-id");
            const rVal = isAmountMode ? parseMoneyValue(input.value) : (parseFloat(input.value) || 0);
            if (rVal > 0) {
                ratios[dId] = rVal;
                totalRatio += rVal;
            }
        });

        if (isAmountMode) {
            if (totalRatio !== salary) {
                alert(`Tổng số tiền phân bổ nhân sự kiêm nhiệm phải bằng đúng lương gốc (${formatCurrency(salary)})! Hiện tại đang là: ${formatCurrency(totalRatio)}`);
                return;
            }
        } else {
            if (totalRatio !== 100) {
                alert(`Tổng tỷ lệ phân bổ nhân sự kiêm nhiệm phải bằng 100%! Hiện tại là: ${totalRatio}%`);
                return;
            }
        }
        newEmp.ratios = ratios;
        newEmp.allocationMode = currentEmpAddAllocationMode;
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


// Hàm phụ trợ sinh mã HTML hiển thị tỷ lệ phân bổ của phòng học (Hỗ trợ phân bổ theo Sỹ số học sinh)
function getRoomSplitsHTML(room) {
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
            
            splitsArray.push(`<span class="${badgeClass}">${dName}:\u00A0${ratio.toFixed(1)}%</span>`);
        }
    });
    
    let splitsText = splitsArray.length > 0 ? splitsArray.join(" ") : '<span class="badge-dept-tag badge-dept-support">Chưa gán chi phí</span>';
    
    if (room.allocationMethod === "student") {
        splitsText = `
            <div style="display: flex; flex-direction: column; gap: 4px; align-items: flex-start;">
                <div style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.72rem; color: #34C759; background: rgba(52, 199, 89, 0.1); padding: 2px 6px; border-radius: 4px; font-weight: 600; border: 1px solid rgba(52, 199, 89, 0.2);">
                    <i class="fa-solid fa-graduation-cap"></i> Phân bổ theo sỹ số HS
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 4px;">${splitsText}</div>
            </div>
        `;
    }
    
    return splitsText + `
        <div style="margin-top: 6px;">
            <button class="btn btn-secondary btn-sm" onclick="openRoomSplitEditModal('${room.id}')" style="padding: 2px 6px; font-size: 0.7rem; display: inline-flex; align-items: center; gap: 4px; border: 1px solid var(--border-color); cursor: pointer; border-radius: 4px;">
                <i class="fa-solid fa-pen-to-square"></i> Sửa tỷ lệ %
            </button>
        </div>
    `;
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

    const absoluteTotalRent = appState.rentBlocks.reduce((sum, b) => sum + b.totalRent, 0);
    let totalRentSum = 0;
    let totalRoomsSum = 0;

    // Chuỗi chứa HTML tổng quan Dãy nhà & Tiền thuê gán bên tab Danh sách để tiện đối chiếu
    let overviewCardsHtml = "";

    appState.rentBlocks.forEach((blk, idx) => {
        const roomCount = blockRoomCounts[blk.id] || 0;
        const roomPrice = roomCount > 0 ? blk.totalRent / roomCount : blk.totalRent;
        totalRentSum += blk.totalRent;
        totalRoomsSum += roomCount;

        const rentPercent = absoluteTotalRent > 0 ? (blk.totalRent / absoluteTotalRent * 100).toFixed(1) : "0.0";

        blocksBody.innerHTML += `
            <tr>
                <td>${idx + 1}</td>
                <td>
                    <input type="text" class="base-select-dropdown block-name-input" value="${blk.name}" 
                      onchange="renameRentBlock('${blk.id}', this.value)" 
                      title="Bấm trực tiếp vào để đổi tên dãy nhà"
                      style="font-weight: 700; border: 1px solid transparent; background: transparent; padding: 4px 6px; border-radius: 6px; font-size: 0.88rem; width: 100%; cursor: pointer; color: var(--text-primary);" 
                      onmouseover="this.style.borderColor='var(--border-color)'" 
                      onmouseout="this.style.borderColor='transparent'">
                </td>
                <td class="text-right">
                    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
                        <input type="text" class="base-select-dropdown" style="width: 140px; text-align: right; font-weight: 700; padding: 4px 8px; display: inline-block;" value="${formatNumberWithDots(blk.totalRent)}" oninput="handleMoneyInput(this)" onchange="updateRentBlockCost('${blk.id}', this.value)">
                        <div style="display: flex; align-items: center; justify-content: flex-end; gap: 4px;">
                            <span style="font-size: 0.72rem; color: var(--text-secondary);">chiếm</span>
                            <input type="number" step="0.1" min="0" max="100" class="base-select-dropdown" style="width: 65px; padding: 2px 4px; font-size: 0.72rem; text-align: center; display: inline-block; height: auto;" value="${rentPercent}" onchange="updateRentBlockPercent('${blk.id}', this.value)">
                            <span style="font-size: 0.72rem; color: var(--text-secondary);">%</span>
                        </div>
                    </div>
                </td>
                <td class="text-center">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 4px;">
                        <input type="number" min="0" max="100" class="base-select-dropdown" style="width: 55px; padding: 4px; font-size: 0.78rem; text-align: center; font-weight: 700; display: inline-block; height: auto;" value="${roomCount}" onchange="updateRentBlockRoomCount('${blk.id}', this.value)">
                        <span style="font-size: 0.72rem; color: var(--text-secondary); font-weight: 600;">phòng</span>
                    </div>
                </td>
                <td class="text-right text-success"><strong>${formatCurrency(roomPrice)} / phòng</strong></td>
                <td class="text-center">
                    <button class="btn btn-danger btn-sm" onclick="deleteRentBlock('${blk.id}')">Xóa</button>
                </td>
            </tr>
        `;

        overviewCardsHtml += `
            <div style="background: #FFFFFF; border: 1px solid rgba(0,0,0,0.075); border-radius: 8px; padding: 12px 14px; display: flex; flex-direction: column; gap: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.02); transition: all 0.2s;" onmouseover="this.style.borderColor='rgba(0,122,255,0.2)'" onmouseout="this.style.borderColor='rgba(0,0,0,0.075)'">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 28px; height: 28px; border-radius: 6px; background: rgba(0, 122, 255, 0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fa-solid fa-building" style="color: var(--info); font-size: 0.85rem;"></i>
                    </div>
                    <div style="min-width: 0; flex-grow: 1;">
                        <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-primary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;" title="${blk.name}">${blk.name}</div>
                        <div style="font-size: 0.72rem; color: var(--text-secondary); margin-top: 1px;">Có ${roomCount} phòng vật lý</div>
                    </div>
                </div>
                <hr style="border: 0; border-top: 1px dashed rgba(0,0,0,0.06); margin: 6px 0;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.72rem; color: var(--text-secondary); font-weight: 500;">Tiền thuê dãy:</span>
                    <strong style="font-size: 0.8rem; color: var(--danger); font-weight: 700;">${formatCurrency(blk.totalRent)}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.72rem; color: var(--text-secondary); font-weight: 500;">Đơn giá phòng:</span>
                    <span class="badge" style="background: rgba(52, 199, 89, 0.06); color: var(--success); font-size: 0.72rem; font-weight: 700; padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(52, 199, 89, 0.1);">
                        ${formatCurrency(roomPrice)} / phòng
                    </span>
                </div>
            </div>
        `;
    });

    const lblTotalRent = document.getElementById("lbl_blocks_total_rent");
    const lblTotalRooms = document.getElementById("lbl_blocks_total_rooms");
    if (lblTotalRent) lblTotalRent.innerText = formatCurrency(totalRentSum);
    if (lblTotalRooms) lblTotalRooms.innerText = `${totalRoomsSum} Phòng`;

    // Render Panel tổng quan Dãy nhà & Tiền thuê
    const overviewPanel = document.getElementById("facility_overview_panel");
    if (overviewPanel) {
        overviewPanel.innerHTML = `
            <div class="card" style="border-left: 4px solid var(--info); background: rgba(0, 122, 255, 0.01); padding: 16px 20px; margin-bottom: 2rem;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
                    <div>
                        <h3 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
                            <i class="fa-solid fa-chart-pie" style="color: var(--info);"></i>
                            TỔNG QUAN CHI PHÍ MẶT BẰNG & PHÒNG HỌC (RENTAL SUMMARY)
                        </h3>
                        <p style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 3px;">
                            Dữ liệu tổng quan: Tiền thuê tháng trần của từng dãy nhà được chia đều cho các phòng thuộc dãy đó làm đơn giá gánh chi phí mặt bằng.
                        </p>
                    </div>
                    <span class="badge" style="background: var(--info); color: #FFF; font-size: 0.7rem; font-weight: 700; padding: 4px 8px; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px;">
                        <i class="fa-solid fa-circle-info"></i> Thông tin nền
                    </span>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 12px; margin-top: 8px;">
                    ${overviewCardsHtml}
                    
                    <!-- Card tổng cộng -->
                    <div style="background: rgba(0, 122, 255, 0.05); border: 1px solid rgba(0, 122, 255, 0.12); border-radius: 8px; padding: 12px 14px; display: flex; flex-direction: column; justify-content: center; gap: 4px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="width: 28px; height: 28px; border-radius: 6px; background: var(--info); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <i class="fa-solid fa-calculator" style="color: #FFF; font-size: 0.85rem;"></i>
                            </div>
                            <div style="min-width: 0; flex-grow: 1;">
                                <div style="font-size: 0.82rem; font-weight: 800; color: var(--text-primary);">TỔNG CỘNG MẶT BẰNG</div>
                                <div style="font-size: 0.72rem; color: var(--text-secondary); font-weight: 550; margin-top: 1px;">Toàn bộ cơ sở trường</div>
                            </div>
                        </div>
                        <hr style="border: 0; border-top: 1px dashed rgba(0, 122, 255, 0.15); margin: 6px 0;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 0.72rem; color: var(--text-secondary); font-weight: 600;">Tổng tiền thuê tháng:</span>
                            <strong style="font-size: 0.88rem; color: var(--danger); font-weight: 800;">${formatCurrency(totalRentSum)}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 0.72rem; color: var(--text-secondary); font-weight: 600;">Tổng số phòng học:</span>
                            <strong style="font-size: 0.8rem; color: var(--info); font-weight: 800;">${totalRoomsSum} Phòng vật lý</strong>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    const currentLandlordRent = appState.landlordRent || totalRentSum;

    // Thêm dòng SUM tổng cộng ở dưới cùng bảng mặt bằng
    blocksBody.innerHTML += `
        <tr style="background: rgba(239, 68, 68, 0.02); font-weight: 700; border-top: 2px solid var(--border-color); border-bottom: 2px solid var(--border-color);">
            <td></td>
            <td style="color: var(--text-primary); text-transform: uppercase; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.5px;">TỔNG TIỀN THUÊ CHỦ NHÀ (LANDLORD TOTAL)</td>
            <td class="text-right">
                <input type="text" class="base-select-dropdown" style="width: 140px; text-align: right; font-weight: 800; color: var(--danger); padding: 4px 8px; display: inline-block; border-color: rgba(239, 68, 68, 0.3);" value="${formatNumberWithDots(currentLandlordRent)}" oninput="handleMoneyInput(this)" onchange="updateLandlordRent(this.value)">
            </td>
            <td class="text-center">
                <span class="badge" style="background: var(--accent); color: #FFF; font-size: 0.78rem; font-weight: 700; padding: 3px 8px; border-radius: 6px;">${totalRoomsSum} Phòng</span>
            </td>
            <td class="text-right text-success"></td>
            <td></td>
        </tr>
    `;

    // Kiểm tra lệch phân bổ mặt bằng so với chủ nhà
    const diff = currentLandlordRent - totalRentSum;
    const alertEl = document.getElementById("block_allocation_alert");
    if (alertEl) {
        if (Math.abs(diff) < 10) { // Sai số làm tròn nhỏ hơn 10 đồng coi như khớp
            alertEl.style.display = "block";
            alertEl.innerHTML = `
                <div style="background: rgba(52, 199, 89, 0.08); border: 1px solid rgba(52, 199, 89, 0.3); color: #34C759; padding: 12px 16px; border-radius: 8px; font-size: 0.82rem; font-weight: 700; display: flex; align-items: center; gap: 10px; box-shadow: var(--shadow-sm);">
                    <i class="fa-solid fa-circle-check" style="font-size: 1.1rem; color: #34C759;"></i>
                    <span>Đã phân bổ khớp 100% tiền thuê của chủ nhà (${formatCurrency(currentLandlordRent)})!</span>
                </div>
            `;
        } else if (diff > 0) {
            alertEl.style.display = "block";
            alertEl.innerHTML = `
                <div style="background: rgba(255, 149, 0, 0.08); border: 1px solid rgba(255, 149, 0, 0.3); color: #FF9500; padding: 12px 16px; border-radius: 8px; font-size: 0.82rem; font-weight: 700; display: flex; align-items: center; gap: 10px; box-shadow: var(--shadow-sm);">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.1rem; color: #FF9500;"></i>
                    <span>Anh chưa phân bổ hết tiền thuê! Còn thiếu <span style="text-decoration: underline; font-size: 0.9rem; font-weight: 800;">${formatCurrency(diff)}</span> chưa được gán vào các dãy nhà (Đã gán: ${formatCurrency(totalRentSum)} / Tổng chủ nhà: ${formatCurrency(currentLandlordRent)}).</span>
                </div>
            `;
        } else {
            alertEl.style.display = "block";
            alertEl.innerHTML = `
                <div style="background: rgba(255, 59, 48, 0.08); border: 1px solid rgba(255, 59, 48, 0.3); color: #FF3B30; padding: 12px 16px; border-radius: 8px; font-size: 0.82rem; font-weight: 700; display: flex; align-items: center; gap: 10px; box-shadow: var(--shadow-sm);">
                    <i class="fa-solid fa-circle-xmark" style="font-size: 1.1rem; color: #FF3B30;"></i>
                    <span>Anh đang phân bổ vượt quá tiền thuê của chủ nhà! Vượt quá <span style="text-decoration: underline; font-size: 0.9rem; font-weight: 800;">${formatCurrency(Math.abs(diff))}</span> (Đã gán: ${formatCurrency(totalRentSum)} / Tổng chủ nhà: ${formatCurrency(currentLandlordRent)}).</span>
                </div>
            `;
        }
    }

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

                // Render splits text as beautiful badges/chips using the helper function
                const splitsText = getRoomSplitsHTML(room);

                let typeLabel = "";
                if (room.type === "classroom") typeLabel = "Lớp học";
                else if (room.type === "boarding") typeLabel = "Nội trú";
                else typeLabel = "Dùng chung";

                globalRoomIdx++;

                roomsBody.innerHTML += `
                    <tr data-room-id="${room.id}" data-block-id="${room.blockId}" data-status="${room.status}" 
                      draggable="true" 
                      ondragstart="handleRoomDragStart(event, '${room.id}')" 
                      ondragover="handleRoomDragOver(event, '${room.id}')" 
                      ondragleave="handleRoomDragLeave(event, '${room.id}')" 
                      ondrop="handleRoomDrop(event, '${room.id}')" 
                      ondragend="handleRoomDragEnd(event)" 
                      style="transition: all 0.2s ease;">
                        <td style="cursor: grab; padding: 12px 10px; color: var(--text-secondary); opacity: 0.8;" title="Kéo thả để sắp xếp lại thứ tự phòng">
                            <i class="fa-solid fa-grip-vertical" style="margin-right: 4px; color: #ccc;"></i>
                            ${globalRoomIdx}
                        </td>
                        <td>
                            <div style="display: flex; align-items: center; gap: 6px;">
                                <input type="text" class="base-select-dropdown room-name-input" value="${room.name}" 
                                  onchange="renameRoom('${room.id}', this.value)" 
                                  title="Bấm trực tiếp vào để đổi tên phòng học"
                                  style="font-weight: 600; border: 1px solid transparent; background: transparent; padding: 4px 6px; border-radius: 6px; font-size: 0.88rem; width: 180px; cursor: pointer; color: var(--text-primary);" 
                                  onmouseover="this.style.borderColor='var(--border-color)'" 
                                  onmouseout="this.style.borderColor='transparent'">
                                <select onchange="updateRoomType('${room.id}', this.value)" class="base-select-dropdown" style="padding: 2px 4px; font-size: 0.72rem; font-weight: 600; cursor: pointer; border-radius: 4px; border-color: rgba(0,0,0,0.1); background: transparent; color: var(--text-secondary); width: auto; height: auto;">
                                    <option value="classroom" ${room.type === "classroom" ? "selected" : ""}>🏫 Lớp học</option>
                                    <option value="boarding" ${room.type === "boarding" ? "selected" : ""}>🛌 Nội trú</option>
                                    <option value="functional" ${room.type === "functional" || !room.type ? "selected" : ""}>🛠 Dùng chung</option>
                                </select>
                                ${room.type === 'classroom' ? (
                                    (room.splits && (room.splits.dept_thpt || 0) > 0) ? `
                                    <select onchange="updateRoomSystem('${room.id}', this.value)" class="base-select-dropdown" style="padding: 2px 4px; font-size: 0.72rem; font-weight: 700; cursor: pointer; border-radius: 4px; border-color: rgba(0,122,255,0.15); background: ${room.system === 'xanh' ? 'rgba(52,199,89,0.08)' : 'rgba(0,122,255,0.08)'}; color: ${room.system === 'xanh' ? 'var(--success)' : 'var(--primary)'}; width: auto; height: auto;">
                                        <option value="thuong" ${room.system === "thuong" || !room.system ? "selected" : ""}>🏫 Thường (max 40)</option>
                                        <option value="xanh" ${room.system === "xanh" ? "selected" : ""}>🌿 Hệ Xanh (max 25)</option>
                                    </select>
                                    ` : `
                                    <span class="badge" style="background: rgba(52, 199, 89, 0.08); color: var(--success); font-size: 0.72rem; font-weight: 700; padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(52, 199, 89, 0.15);">🌿 Hệ Xanh (max 25)</span>
                                    `
                                ) : ''}
                            </div>
                        </td>
                        <td class="text-right" style="white-space: nowrap;"><strong>${formatCurrency(calculatedRoomCost)}</strong></td>
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
            const splitsText = getRoomSplitsHTML(room);

            let typeLabel = "";
            if (room.type === "classroom") typeLabel = "Lớp học";
            else if (room.type === "boarding") typeLabel = "Nội trú";
            else typeLabel = "Dùng chung";

            globalRoomIdx++;

            roomsBody.innerHTML += `
                <tr data-room-id="${room.id}" data-block-id="${room.blockId}" data-status="${room.status}" 
                  draggable="true" 
                  ondragstart="handleRoomDragStart(event, '${room.id}')" 
                  ondragover="handleRoomDragOver(event, '${room.id}')" 
                  ondragleave="handleRoomDragLeave(event, '${room.id}')" 
                  ondrop="handleRoomDrop(event, '${room.id}')" 
                  ondragend="handleRoomDragEnd(event)" 
                  style="transition: all 0.2s ease;">
                    <td style="cursor: grab; padding: 12px 10px; color: var(--text-secondary); opacity: 0.8;" title="Kéo thả để sắp xếp lại thứ tự phòng">
                        <i class="fa-solid fa-grip-vertical" style="margin-right: 4px; color: #ccc;"></i>
                        ${globalRoomIdx}
                    </td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <input type="text" class="base-select-dropdown room-name-input" value="${room.name}" 
                              onchange="renameRoom('${room.id}', this.value)" 
                              title="Bấm trực tiếp vào để đổi tên phòng học"
                              style="font-weight: 600; border: 1px solid transparent; background: transparent; padding: 4px 6px; border-radius: 6px; font-size: 0.88rem; width: 180px; cursor: pointer; color: var(--text-primary);" 
                              onmouseover="this.style.borderColor='var(--border-color)'" 
                              onmouseout="this.style.borderColor='transparent'">
                            <select onchange="updateRoomType('${room.id}', this.value)" class="base-select-dropdown" style="padding: 2px 4px; font-size: 0.72rem; font-weight: 600; cursor: pointer; border-radius: 4px; border-color: rgba(0,0,0,0.1); background: transparent; color: var(--text-secondary); width: auto; height: auto;">
                                <option value="classroom" ${room.type === "classroom" ? "selected" : ""}>🏫 Lớp học</option>
                                <option value="boarding" ${room.type === "boarding" ? "selected" : ""}>🛌 Nội trú</option>
                                <option value="functional" ${room.type === "functional" || !room.type ? "selected" : ""}>🛠 Dùng chung</option>
                            </select>
                            ${room.type === 'classroom' ? (
                                (room.splits && (room.splits.dept_thpt || 0) > 0) ? `
                                <select onchange="updateRoomSystem('${room.id}', this.value)" class="base-select-dropdown" style="padding: 2px 4px; font-size: 0.72rem; font-weight: 700; cursor: pointer; border-radius: 4px; border-color: rgba(0,122,255,0.15); background: ${room.system === 'xanh' ? 'rgba(52,199,89,0.08)' : 'rgba(0,122,255,0.08)'}; color: ${room.system === 'xanh' ? 'var(--success)' : 'var(--primary)'}; width: auto; height: auto;">
                                    <option value="thuong" ${room.system === "thuong" || !room.system ? "selected" : ""}>🏫 Thường (max 40)</option>
                                    <option value="xanh" ${room.system === "xanh" ? "selected" : ""}>🌿 Hệ Xanh (max 25)</option>
                                </select>
                                ` : `
                                <span class="badge" style="background: rgba(52, 199, 89, 0.08); color: var(--success); font-size: 0.72rem; font-weight: 700; padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(52, 199, 89, 0.15);">🌿 Hệ Xanh (max 25)</span>
                                `
                            ) : ''}
                        </div>
                    </td>
                    <td class="text-right" style="white-space: nowrap;"><strong>0 đ</strong></td>
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

    let thuongRoomsCount = 0;
    let thuongRoomsCapacity = 0;
    let xanhRoomsCount = 0;
    let xanhRoomsCapacity = 0;

    appState.rooms.forEach(room => {
        if (room.status === "active" && room.type === "classroom") {
            if (room.system === "xanh") {
                xanhRoomsCount++;
                xanhRoomsCapacity += (room.capacity || 25);
            } else {
                thuongRoomsCount++;
                thuongRoomsCapacity += (room.capacity || 40);
            }
        }
    });

    const countEl = document.getElementById("filtered_room_count");
    if (countEl) {
        countEl.innerHTML = `
            <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap; font-size: 0.78rem;">
                <span class="text-muted" style="font-weight: 600;">Hiển thị: ${visibleCount}/${totalCount} phòng</span>
                <span style="color: rgba(0,0,0,0.15);">|</span>
                <span style="background: rgba(0, 122, 255, 0.06); color: var(--primary); padding: 2px 8px; border-radius: 4px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
                    🏫 Hệ Thường: ${thuongRoomsCount} phòng (Max ${thuongRoomsCapacity} HS)
                </span>
                <span style="background: rgba(52, 199, 89, 0.06); color: var(--success); padding: 2px 8px; border-radius: 4px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
                    🌿 Hệ Xanh: ${xanhRoomsCount} phòng (Max ${xanhRoomsCapacity} HS)
                </span>
            </div>
        `;
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

function updateRoomType(roomId, newType) {
    const room = appState.rooms.find(r => r.id === roomId);
    if (room) {
        room.type = newType;
        saveState();
        runAllocation();
        renderFacilities();
        renderDashboard();
    }
}

function updateRoomSystem(roomId, newSystem) {
    const room = appState.rooms.find(r => r.id === roomId);
    if (room) {
        room.system = newSystem;
        // Tự động gán sỹ số tối đa mặc định
        if (newSystem === "xanh") {
            room.capacity = 25;
        } else {
            room.capacity = 40;
        }
        saveState();
        runAllocation();
        renderFacilities();
        renderDashboard();
    }
}


// Hàm mở Modal chỉnh sửa tỷ lệ % phân bổ cho phòng học
function toggleRoomAllocationUI() {
    const method = document.querySelector('input[name="room_allocation_method"]:checked')?.value || "manual";
    const manualContainer = document.getElementById("room_split_inputs_container");
    const studentContainer = document.getElementById("room_split_student_container");
    
    if (method === "manual") {
        manualContainer.style.display = "grid";
        studentContainer.style.display = "none";
    } else {
        manualContainer.style.display = "none";
        studentContainer.style.display = "block";
    }
    updateRoomSplitTotalLive();
}

function openRoomSplitEditModal(roomId) {
    const room = appState.rooms.find(r => r.id === roomId);
    if (!room) return;

    document.getElementById("edit_room_id").value = roomId;
    document.getElementById("room_split_modal_desc").innerHTML = 
        `Cài đặt phương thức và tỷ lệ phần trăm (%) gán chi phí thuê dãy nhà của phòng học <strong>${room.name}</strong> cho các khối trực tiếp hoặc bộ phận sử dụng.`;

    // Cài đặt trạng thái Radio button
    const method = room.allocationMethod || "manual";
    const radioManual = document.querySelector('input[name="room_allocation_method"][value="manual"]');
    const radioStudent = document.querySelector('input[name="room_allocation_method"][value="student"]');
    if (method === "manual") {
        if (radioManual) radioManual.checked = true;
    } else {
        if (radioStudent) radioStudent.checked = true;
    }

    // 1. Tạo input gán thủ công %
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

    // 2. Tạo checkbox gán theo sỹ số HS
    const studentContainer = document.getElementById("room_split_student_container");
    studentContainer.innerHTML = `
        <div style="font-size: 0.78rem; font-weight: 700; margin-bottom: 8px; color: var(--text-primary);">
            Tích chọn các phòng ban sử dụng phòng học để tự động phân bổ theo sỹ số học sinh:
        </div>
    `;
    const selectedDepts = room.selectedDepts || Object.keys(room.splits).filter(k => room.splits[k] > 0) || [];
    
    appState.departments.filter(d => d.type === "revenue").forEach(dept => {
        const isChecked = selectedDepts.includes(dept.id);
        studentContainer.innerHTML += `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.04);">
                <label style="display: inline-flex; align-items: center; gap: 8px; font-size: 0.82rem; cursor: pointer; color: var(--text-primary); font-weight: 500; margin-bottom: 0;">
                    <input type="checkbox" class="room-edit-student-dept-checkbox" data-dept-id="${dept.id}" ${isChecked ? 'checked' : ''} onchange="updateRoomSplitTotalLive()" style="cursor: pointer;">
                    ${dept.name} <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: normal;">(${dept.students || 0} HS)</span>
                </label>
                <span id="preview_ratio_${dept.id}" class="badge" style="font-size: 0.72rem; font-weight: 600; padding: 2px 6px;">0.0%</span>
            </div>
        `;
    });

    document.getElementById("room_split_modal").classList.add("open");
    toggleRoomAllocationUI();
}

// Cập nhật tổng % hoặc preview sỹ số thời gian thực
function updateRoomSplitTotalLive() {
    const method = document.querySelector('input[name="room_allocation_method"]:checked')?.value || "manual";
    const badge = document.getElementById("room_split_total_badge");
    
    if (method === "manual") {
        const inputs = document.querySelectorAll(".room-edit-ratio-val");
        let total = 0;
        inputs.forEach(input => {
            total += parseFloat(input.value) || 0;
        });

        badge.innerText = `Tổng cộng: ${total}%`;
        badge.className = "badge"; 
        
        if (Math.abs(total - 100) < 0.1) {
            badge.style.backgroundColor = "var(--success)";
            badge.style.color = "#FFF";
        } else {
            badge.style.backgroundColor = "var(--danger)";
            badge.style.color = "#FFF";
        }
    } else {
        // Chế độ Student sỹ số HS
        const checkboxes = document.querySelectorAll(".room-edit-student-dept-checkbox:checked");
        const selectedDepts = Array.from(checkboxes).map(cb => cb.getAttribute("data-dept-id"));
        
        let totalStudents = 0;
        selectedDepts.forEach(did => {
            const dept = appState.departments.find(d => d.id === did);
            if (dept) {
                totalStudents += (dept.students || 0);
            }
        });
        
        // Cập nhật preview tỷ lệ bên cạnh checkbox
        const allCheckboxes = document.querySelectorAll(".room-edit-student-dept-checkbox");
        allCheckboxes.forEach(cb => {
            const did = cb.getAttribute("data-dept-id");
            const isChecked = cb.checked;
            const previewSpan = document.getElementById(`preview_ratio_${did}`);
            
            if (isChecked) {
                const dept = appState.departments.find(d => d.id === did);
                let ratio = 0;
                if (totalStudents > 0) {
                    ratio = ((dept?.students || 0) / totalStudents) * 100;
                } else {
                    ratio = 100 / selectedDepts.length; // Chia đều nếu sỹ số bằng 0
                }
                if (previewSpan) {
                    previewSpan.innerText = `${ratio.toFixed(1)}%`;
                    previewSpan.style.backgroundColor = "rgba(52, 199, 89, 0.12)";
                    previewSpan.style.color = "#34C759";
                }
            } else {
                if (previewSpan) {
                    previewSpan.innerText = "0.0%";
                    previewSpan.style.backgroundColor = "rgba(0,0,0,0.05)";
                    previewSpan.style.color = "var(--text-secondary)";
                }
            }
        });
        
        badge.className = "badge";
        if (selectedDepts.length > 0) {
            badge.innerText = `Chọn ${selectedDepts.length} khối (Tổng ${totalStudents} HS - Sẵn sàng 100%)`;
            badge.style.backgroundColor = "var(--success)";
            badge.style.color = "#FFF";
        } else {
            badge.innerText = `Chưa chọn khối nào (0%)`;
            badge.style.backgroundColor = "var(--danger)";
            badge.style.color = "#FFF";
        }
    }
}

// Lưu tỷ lệ % phân bổ mới cho phòng học
function updateRoomSplits(event) {
    event.preventDefault();
    const roomId = document.getElementById("edit_room_id").value;
    const room = appState.rooms.find(r => r.id === roomId);
    if (!room) return;

    const method = document.querySelector('input[name="room_allocation_method"]:checked')?.value || "manual";
    
    if (method === "manual") {
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

        room.allocationMethod = "manual";
        room.splits = newSplits;
        room.selectedDepts = [];
    } else {
        const checkboxes = document.querySelectorAll(".room-edit-student-dept-checkbox:checked");
        const selectedDepts = Array.from(checkboxes).map(cb => cb.getAttribute("data-dept-id"));
        
        if (selectedDepts.length === 0) {
            alert("Vui lòng tích chọn ít nhất 1 phòng ban gánh chi phí theo sỹ số học sinh.");
            return;
        }
        
        room.allocationMethod = "student";
        room.selectedDepts = selectedDepts;
        
        // Tính toán splits ngay lập tức để đồng bộ hóa
        let totalStudents = 0;
        selectedDepts.forEach(did => {
            const dept = appState.departments.find(d => d.id === did);
            if (dept) {
                totalStudents += (dept.students || 0);
            }
        });
        
        const newSplits = {};
        if (totalStudents > 0) {
            selectedDepts.forEach(did => {
                const dept = appState.departments.find(d => d.id === did);
                if (dept) {
                    newSplits[did] = ((dept.students || 0) / totalStudents) * 100;
                }
            });
        } else {
            selectedDepts.forEach(did => {
                newSplits[did] = 100 / selectedDepts.length;
            });
        }
        room.splits = newSplits;
    }

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
    if (val === null || val === undefined || isNaN(val)) return "0\u00A0₫";
    return Math.round(val).toLocaleString() + "\u00A0₫";
}

function initApp() {
    loadState();

    // Đồng bộ hóa trạng thái giao diện giả lập What-If với dữ liệu đã lưu
    if (appState.simulation) {
        const btnActual = document.getElementById("btn_scenario_actual");
        const btnSim = document.getElementById("btn_scenario_sim");
        const controlsPanel = document.getElementById("simulation_controls_panel");
        const slider = document.getElementById("slider_sim_fill_rate");
        const lbl = document.getElementById("lbl_sim_fill_rate");
        
        if (appState.simulation.active) {
            if (btnActual) btnActual.classList.remove("active");
            if (btnSim) btnSim.classList.add("active");
            if (controlsPanel) controlsPanel.style.display = "block";
        } else {
            if (btnActual) btnActual.classList.add("active");
            if (btnSim) btnSim.classList.remove("active");
            if (controlsPanel) controlsPanel.style.display = "none";
        }

        if (slider) slider.value = appState.simulation.fillRate;
        if (lbl) lbl.innerText = appState.simulation.fillRate + "%";

        // Cập nhật giá trị và thông tin cho 4 thanh trượt mới của từng khối
        updateSimulationUI();

        const txtTieuhocXanh = document.getElementById("txt_sim_tuition_tieuhoc_xanh");
        const txtThcsXanh = document.getElementById("txt_sim_tuition_thcs_xanh");
        const txtThptThuong = document.getElementById("txt_sim_tuition_thpt_thuong");
        const txtThptXanh = document.getElementById("txt_sim_tuition_thpt_xanh");
        const txtNoitru = document.getElementById("txt_sim_tuition_noitru");

        if (txtTieuhocXanh) txtTieuhocXanh.value = formatNumberWithDots(appState.simulation.tuition.dept_tieuhoc_xanh);
        if (txtThcsXanh) txtThcsXanh.value = formatNumberWithDots(appState.simulation.tuition.dept_thcs_xanh);
        if (txtThptThuong) txtThptThuong.value = formatNumberWithDots(appState.simulation.tuition.dept_thpt_thuong);
        if (txtThptXanh) txtThptXanh.value = formatNumberWithDots(appState.simulation.tuition.dept_thpt_xanh);
        if (txtNoitru) txtNoitru.value = formatNumberWithDots(appState.simulation.tuition.dept_noitru);
    }
    
    // Inject dynamic style block for pulsating onboarding magnifier
    if (!document.getElementById("pulse_magnifier_style")) {
        const style = document.createElement('style');
        style.id = "pulse_magnifier_style";
        style.innerHTML = `
            @keyframes pulseMagnifier {
                0% { transform: scale(0.9); opacity: 0.6; }
                100% { transform: scale(1.3); opacity: 1; }
            }
            .pulse-magnifier {
                animation: pulseMagnifier 1.2s infinite alternate;
                display: inline-block;
                color: #FF5E00 !important;
                text-shadow: 0 0 5px rgba(255, 94, 0, 0.4);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Auto-reconnect to Firebase Cloud Sync if code exists (default to THG4XTD)
    const savedCloudCode = localStorage.getItem("XTD_CLOUD_PROJECT_CODE") || "THG4XTD";
    connectCloudSync(savedCloudCode);
    
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

    const savedActiveTab = localStorage.getItem("XTD_ACTIVE_TAB") || "view_dashboard";
    switchTab(savedActiveTab);
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
            apiKey: "AIzaSyBqUnifWKaPeZ03q9cLMCgQNQbQm6mmX5M",
            authDomain: "xanh-tue-duc-apps.firebaseapp.com",
            projectId: "xanh-tue-duc-apps",
            storageBucket: "xanh-tue-duc-apps.firebasestorage.app",
            messagingSenderId: "955600480894",
            appId: "1:955600480894:web:e2bc9d0d34f0d6118dcd83"
        };
        try {
            firebase.initializeApp(firebaseConfig);
            firebaseDb = firebase.firestore();
        } catch (e) {
            console.error("Firebase initialization failed:", e);
            updateCloudSyncUI("offline");
            return;
        }
    }

    // Lắng nghe dữ liệu realtime từ Firestore Cloud trên tài liệu của dự án
    updateCloudSyncUI("syncing");
    
    // Hủy listener cũ nếu có bằng cách gọi hàm unsubscribe cũ
    if (window.firestoreUnsubscribe) {
        window.firestoreUnsubscribe();
    }

    const docRef = firebaseDb.collection("sessions").doc(projectCode);
    window.firestoreUnsubscribe = docRef.onSnapshot((doc) => {
        if (doc.exists) {
            const cloudData = doc.data();
            console.log("Cloud data updated from Firestore!");
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
            console.log("Cloud document is empty. Initializing with local data...");
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
        statusDot.setAttribute("title", "Đã kết nối Firestore Cloud. Dữ liệu đang được đồng bộ hóa thời gian thực (Real-time)");
        statusText.innerHTML = `<i class="fa-solid fa-cloud-arrow-up" style="color: var(--success);"></i> Đã đồng bộ`;
    } else if (status === "syncing") {
        statusDot.setAttribute("title", "Đang kết nối Firestore cloud và đồng bộ hóa số liệu...");
        statusText.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="color: var(--warning);"></i> Đang đồng bộ`;
    } else {
        statusDot.setAttribute("title", "Chưa kết nối Đám mây. Dữ liệu đang được lưu cục bộ (Offline)");
        statusText.innerHTML = `<i class="fa-solid fa-cloud-arrow-up" style="opacity: 0.5;"></i> Offline`;
    }
}

function pushLocalDataToCloud() {
    if (!currentProjectCode || !firebaseDb) return;
    
    updateCloudSyncUI("syncing");
    
    // Firestore yêu cầu gửi đối tượng JSON thuần
    const cleanState = JSON.parse(JSON.stringify(appState));
    
    firebaseDb.collection("sessions").doc(currentProjectCode).set(cleanState)
        .then(() => {
            console.log("Local data successfully synchronized to Firestore Cloud!");
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

// ===================================================================
// DYNAMIC SCENARIO SIMULATION HANDLERS (WHAT-IF PROJECTION ENGINE)
// ===================================================================
function switchScenarioMode(mode) {
    if (!appState.simulation) {
        appState.simulation = {
            active: false,
            fillRate: 80,
            fillRates: {
                "dept_tieuhoc": 80,
                "dept_thcs": 80,
                "dept_thpt": 80,
                "dept_noitru": 80
            },
            tuition: {
                "dept_tieuhoc": 6000000,
                "dept_thcs": 7000000,
                "dept_thpt": 8000000,
                "dept_noitru": 3000000
            }
        };
    } else if (!appState.simulation.fillRates) {
        appState.simulation.fillRates = {
            "dept_tieuhoc": getActualFillRateForDept("dept_tieuhoc"),
            "dept_thcs": getActualFillRateForDept("dept_thcs"),
            "dept_thpt": getActualFillRateForDept("dept_thpt"),
            "dept_noitru": getActualFillRateForDept("dept_noitru")
        };
    }

    const isActive = (mode === "simulation");
    appState.simulation.active = isActive;

    const btnActual = document.getElementById("btn_scenario_actual");
    const btnSim = document.getElementById("btn_scenario_sim");
    const controlsPanel = document.getElementById("simulation_controls_panel");

    if (btnActual && btnSim) {
        if (isActive) {
            btnActual.classList.remove("active");
            btnSim.classList.add("active");
            if (controlsPanel) controlsPanel.style.display = "block";
        } else {
            btnActual.classList.add("active");
            btnSim.classList.remove("active");
            if (controlsPanel) controlsPanel.style.display = "none";
        }
    }

    saveState();
    const result = runAllocation();
    renderDashboard(result);
}

function updateSimulationUI() {
    if (!appState.simulation) return;
    
    if (!appState.simulation.fillRates) {
        appState.simulation.fillRates = {
            "dept_tieuhoc": getActualFillRateForDept("dept_tieuhoc"),
            "dept_thcs": getActualFillRateForDept("dept_thcs"),
            "dept_thpt": getActualFillRateForDept("dept_thpt"),
            "dept_noitru": getActualFillRateForDept("dept_noitru")
        };
    }
    
    const depts = [
        { id: "dept_tieuhoc", name: "Tiểu học" },
        { id: "dept_thcs", name: "THCS" },
        { id: "dept_thpt", name: "THPT" },
        { id: "dept_noitru", name: "Nội trú" }
    ];
    
    depts.forEach(dept => {
        const did = dept.id;
        let maxCapacity = 0;
        let roomCount = 0;
        
        appState.rooms.forEach(room => {
            if (room.status === "active" && room.type !== "functional" && room.splits[did] > 0) {
                const ratio = room.splits[did] / 100;
                maxCapacity += room.capacity * ratio;
                roomCount += ratio;
            }
        });
        
        maxCapacity = Math.round(maxCapacity);
        const fillRate = appState.simulation.fillRates[did] !== undefined ? appState.simulation.fillRates[did] : 80;
        const simulatedStudents = Math.round(maxCapacity * (fillRate / 100));
        
        const deptObj = appState.departments.find(d => d.id === did);
        const actualStudents = deptObj ? (deptObj.students || 0) : 0;
        const actualFillRate = maxCapacity > 0 ? Math.round((actualStudents / maxCapacity) * 100) : 0;
        
        const slider = document.getElementById(`slider_sim_fill_rate_dept_${did}`);
        const lblRate = document.getElementById(`lbl_sim_fill_rate_dept_${did}`);
        const lblInfo = document.getElementById(`lbl_sim_info_dept_${did}`);
        
        if (slider) slider.value = fillRate;
        if (lblRate) lblRate.innerText = fillRate + "%";
        if (lblInfo) {
            lblInfo.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.7rem; color: var(--text-secondary); margin-top: 5px; background: #F8F9FA; padding: 6px 10px; border-radius: 6px; border: 1px solid rgba(0,0,0,0.03); flex-wrap: wrap; gap: 8px;">
                    <span><i class="fa-solid fa-calculator" style="margin-right: 4px; color: var(--text-secondary);"></i>Quy mô: <strong>${roomCount.toFixed(1)} phòng</strong></span>
                    <span>Sức chứa: <strong>${maxCapacity} HS</strong></span>
                    <span>Thực tế: <strong style="color: var(--success);">${actualStudents} HS (${actualFillRate}%)</strong></span>
                    <span style="color: var(--primary); font-weight: 700;"><i class="fa-solid fa-user-check" style="margin-right: 4px;"></i>Giả lập: <strong>${simulatedStudents} HS (${fillRate}%)</strong></span>
                </div>
            `;
        }
    });
}

function updateSimDeptFillRate(deptId, val) {
    if (!appState.simulation) return;
    if (!appState.simulation.fillRates) {
        appState.simulation.fillRates = {
            "dept_tieuhoc": getActualFillRateForDept("dept_tieuhoc"),
            "dept_thcs": getActualFillRateForDept("dept_thcs"),
            "dept_thpt": getActualFillRateForDept("dept_thpt"),
            "dept_noitru": getActualFillRateForDept("dept_noitru")
        };
    }
    const intVal = parseInt(val, 10) || 0;
    appState.simulation.fillRates[deptId] = intVal;
    
    const lbl = document.getElementById(`lbl_sim_fill_rate_dept_${deptId}`);
    if (lbl) lbl.innerText = intVal + "%";

    saveState();
    const result = runAllocation();
    renderDashboard(result);
}

function resetFillRatesToActuals() {
    if (!appState.simulation) return;
    appState.simulation.fillRates = {
        "dept_tieuhoc": getActualFillRateForDept("dept_tieuhoc"),
        "dept_thcs": getActualFillRateForDept("dept_thcs"),
        "dept_thpt": getActualFillRateForDept("dept_thpt"),
        "dept_noitru": getActualFillRateForDept("dept_noitru")
    };
    saveState();
    updateSimulationUI();
    const result = runAllocation();
    renderDashboard(result);
}

function updateSimFillRate(val) {
    if (!appState.simulation) return;
    const intVal = parseInt(val, 10) || 0;
    appState.simulation.fillRate = intVal;
    
    // Đồng bộ sang toàn bộ các khối làm giá trị mặc định khi cập nhật thanh trượt toàn cục
    appState.simulation.fillRates = {
        "dept_tieuhoc": intVal,
        "dept_thcs": intVal,
        "dept_thpt": intVal,
        "dept_noitru": intVal
    };

    saveState();
    const result = runAllocation();
    renderDashboard(result);
}

function updateSimTuition(deptId, val) {
    if (!appState.simulation) return;
    const cleanVal = parseMoneyValue(val);
    appState.simulation.tuition[deptId] = cleanVal;

    saveState();
    const result = runAllocation();
    renderDashboard(result);
}

function updateRentBlockCost(blockId, val) {
    const blk = appState.rentBlocks.find(b => b.id === blockId);
    if (!blk) return;
    blk.totalRent = parseMoneyValue(val);
    saveState();
    const result = runAllocation();
    renderDashboard(result);
    renderFacilities();
}

function updateRentBlockPercent(blockId, percentVal) {
    const blk = appState.rentBlocks.find(b => b.id === blockId);
    if (!blk) return;
    const percent = parseFloat(percentVal) || 0;
    
    // Tính tổng tiền thuê hiện tại trước khi thay đổi để làm gốc quy đổi %
    const absoluteTotalRent = appState.rentBlocks.reduce((sum, b) => sum + b.totalRent, 0);
    
    blk.totalRent = Math.round(absoluteTotalRent * (percent / 100));
    
    saveState();
    const result = runAllocation();
    renderDashboard(result);
    renderFacilities();
}

function updateLandlordRent(val) {
    appState.landlordRent = parseMoneyValue(val);
    saveState();
    const result = runAllocation();
    renderDashboard(result);
    renderFacilities();
}

function updateRentBlockRoomCount(blockId, val) {
    const blk = appState.rentBlocks.find(b => b.id === blockId);
    if (!blk) return;
    const newRoomCount = parseInt(val, 10);
    if (isNaN(newRoomCount) || newRoomCount < 0) return;

    const blockRooms = appState.rooms.filter(r => r.blockId === blockId);
    const currentRoomCount = blockRooms.length;

    if (newRoomCount > currentRoomCount) {
        const diff = newRoomCount - currentRoomCount;
        for (let i = 0; i < diff; i++) {
            appState.rooms.push({
                id: "room_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
                name: `${blk.name} - Phòng bổ sung ${currentRoomCount + i + 1}`,
                blockId: blockId,
                status: "active",
                type: "classroom",
                capacity: 30,
                splits: {
                    "dept_tieuhoc": 100,
                    "dept_thcs": 0,
                    "dept_thpt": 0,
                    "dept_noitru": 0
                }
            });
        }
    } else if (newRoomCount < currentRoomCount) {
        const roomsToRemove = blockRooms.slice(newRoomCount);
        const removeIds = roomsToRemove.map(r => r.id);
        appState.rooms = appState.rooms.filter(r => !removeIds.includes(r.id));
    }

    saveState();
    const result = runAllocation();
    renderDashboard(result);
    renderFacilities();
}

function openSimDeptRoomsModal(deptId) {
    const deptMap = {
        "dept_tieuhoc": { name: "Khối Tiểu học", color: "#007AFF", icon: "fa-graduation-cap" },
        "dept_thcs": { name: "Khối THCS", color: "#34C759", icon: "fa-graduation-cap" },
        "dept_thpt": { name: "Khối THPT", color: "#AF52DE", icon: "fa-graduation-cap" },
        "dept_noitru": { name: "Ban Nội trú", color: "#FF9500", icon: "fa-hotel" }
    };
    
    const info = deptMap[deptId] || { name: "Khối học", color: "var(--primary)", icon: "fa-hotel" };
    
    // Set title
    const titleEl = document.getElementById("sim_dept_rooms_modal_title");
    if (titleEl) {
        titleEl.innerHTML = `<i class="fa-solid ${info.icon}" style="color: ${info.color};"></i> Chi Tiết Phòng Học Giả Lập - ${info.name}`;
    }
    
    // Set description
    const descEl = document.getElementById("sim_dept_rooms_modal_desc");
    const fillRate = appState.simulation && appState.simulation.fillRates && appState.simulation.fillRates[deptId] !== undefined 
        ? appState.simulation.fillRates[deptId] 
        : (appState.simulation ? appState.simulation.fillRate : 80);
        
    if (descEl) {
        descEl.innerHTML = `
            Dưới đây là danh sách các phòng học có phân bổ cho <strong>${info.name}</strong> đang hoạt động. 
            Các <strong>phòng học thường</strong> được áp dụng tỷ lệ lấp đầy mục tiêu là <strong style="color:${info.color}; font-size: 1rem;">${fillRate}%</strong>.
            Các <strong>phòng chức năng/dùng chung</strong> chỉ nhận phân bổ chi phí thuê, không tham gia giả lập sỹ số doanh thu.
        `;
    }
    
    // Generate Table content
    const container = document.getElementById("sim_dept_rooms_table_container");
    if (!container) return;
    
    const blockRooms = appState.rooms.filter(room => room.status === "active" && room.splits[deptId] > 0);
    
    if (blockRooms.length === 0) {
        container.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 180px; color: var(--text-secondary); text-align: center;">
                <i class="fa-solid fa-folder-open" style="font-size: 2.5rem; opacity: 0.3; margin-bottom: 12px;"></i>
                <p style="font-weight: 600; font-size: 0.85rem;">Không có phòng học hoạt động</p>
                <p style="font-size: 0.75rem; max-width: 320px;">Vui lòng kiểm tra lại cấu hình phân chia phòng học cho khối này trong tab "Mặt bằng & Phòng học".</p>
            </div>
        `;
    } else {
        let totalMaxCap = 0;
        let totalSimStudents = 0;
        let totalRoomFraction = 0;
        let totalSimRevenue = 0;
        
        let rowsHtml = "";
        blockRooms.forEach((room, idx) => {
            const splitRatio = room.splits[deptId] || 0;
            const roomFraction = splitRatio / 100;
            
            const isFunctional = (room.type === "functional");
            
            // Nếu là phòng chức năng, sức chứa giả lập và sức chứa quy đổi của khối để tính doanh thu = 0
            const shareMaxCapacity = isFunctional ? 0 : (room.capacity * roomFraction);
            const shareSimStudents = isFunctional ? 0 : (shareMaxCapacity * (fillRate / 100));
            
            totalMaxCap += shareMaxCapacity;
            totalSimStudents += shareSimStudents;
            
            // Chỉ cộng dồn quy mô phòng học thường/nội trú vào tổng quy mô lấp đầy doanh thu
            if (!isFunctional) {
                totalRoomFraction += roomFraction;
            }
            
            const roundedSim = Math.round(shareSimStudents);
            const roundedMax = Math.round(shareMaxCapacity);
            
            // Visual Column for Simulated Fill Rate
            let fillProgressHtml = "";
            if (isFunctional) {
                fillProgressHtml = `
                    <div style="display: flex; flex-direction: column; gap: 2px;">
                        <span class="badge" style="background: rgba(142, 142, 147, 0.08); color: #8E8E93; font-size: 0.68rem; font-weight: 700; padding: 2px 6px; border-radius: 4px; display: inline-block; width: fit-content; text-align: center;">
                            <i class="fa-solid fa-cubes"></i> Phòng chức năng
                        </span>
                        <span style="font-size: 0.62rem; color: var(--text-secondary); font-style: italic;">Chỉ bổ chi phí, không tính sỹ số</span>
                    </div>
                `;
            } else {
                fillProgressHtml = `
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.65rem; font-weight: 700;">
                            <span style="color: ${info.color};"><i class="fa-solid fa-user-check"></i> ${roundedSim} HS</span>
                            <span style="color: var(--text-secondary);">${fillRate}%</span>
                        </div>
                        <div style="width: 100%; height: 6px; background: rgba(0,0,0,0.06); border-radius: 3px; overflow: hidden;">
                            <div style="width: ${fillRate}%; height: 100%; background: ${info.color}; border-radius: 3px; transition: width 0.3s ease;"></div>
                        </div>
                    </div>
                `;
            }
            
            let systemBadge = "";
            let tuitionRevenueHtml = "";
            
            if (!isFunctional && room.type === "classroom") {
                const isXanh = (room.system === "xanh");
                systemBadge = isXanh 
                    ? `<span class="badge" style="background: rgba(52, 199, 89, 0.08); color: var(--success); font-size: 0.68rem; font-weight: 700; padding: 1px 4px; border-radius: 4px; margin-left: 6px;">🌿 Hệ Xanh</span>`
                    : `<span class="badge" style="background: rgba(0, 122, 255, 0.08); color: var(--primary); font-size: 0.68rem; font-weight: 700; padding: 1px 4px; border-radius: 4px; margin-left: 6px;">🏫 Hệ Thường</span>`;
                
                const tuitionKey = `${deptId}_${isXanh ? 'xanh' : 'thuong'}`;
                const tuitionRate = appState.simulation.tuition[tuitionKey] !== undefined 
                    ? appState.simulation.tuition[tuitionKey] 
                    : (appState.simulation.tuition[deptId] || 0);
                    
                const simulatedRoomRevenue = shareSimStudents * tuitionRate;
                totalSimRevenue += simulatedRoomRevenue;
                
                tuitionRevenueHtml = `
                    <div style="font-size: 0.68rem; color: var(--text-secondary); margin-top: 4px; font-weight: 600;">
                        Đơn giá học phí: <span style="color: var(--success); font-weight: 700;">${formatNumberWithDots(tuitionRate)} đ</span>
                        <span style="margin: 0 4px; color: #ccc;">|</span>
                        Doanh thu gán: <span style="color: var(--danger); font-weight: 700;">${formatNumberWithDots(Math.round(simulatedRoomRevenue))} đ</span>
                    </div>
                `;
            } else if (!isFunctional && room.type === "boarding") {
                // Ban nội trú
                systemBadge = `<span class="badge" style="background: rgba(255, 149, 0, 0.08); color: #FF9500; font-size: 0.68rem; font-weight: 700; padding: 1px 4px; border-radius: 4px; margin-left: 6px;">🛌 Nội trú</span>`;
                const tuitionRate = appState.simulation.tuition[deptId] || 0;
                const simulatedRoomRevenue = shareSimStudents * tuitionRate;
                totalSimRevenue += simulatedRoomRevenue;
                
                tuitionRevenueHtml = `
                    <div style="font-size: 0.68rem; color: var(--text-secondary); margin-top: 4px; font-weight: 600;">
                        Phí nội trú: <span style="color: var(--success); font-weight: 700;">${formatNumberWithDots(tuitionRate)} đ</span>
                        <span style="margin: 0 4px; color: #ccc;">|</span>
                        Doanh thu gán: <span style="color: var(--danger); font-weight: 700;">${formatNumberWithDots(Math.round(simulatedRoomRevenue))} đ</span>
                    </div>
                `;
            }
            
            rowsHtml += `
                <tr style="border-bottom: 1px solid rgba(0,0,0,0.04); transition: background 0.2s; ${isFunctional ? 'background: rgba(142,142,147,0.02);' : ''}">
                    <td style="padding: 12px 10px; font-weight: 700; font-size: 0.82rem; color: var(--text-primary);">
                        <div style="display: flex; align-items: center; gap: 2px; flex-wrap: wrap;">
                            <i class="fa-solid ${isFunctional ? 'fa-cubes' : (room.type === 'boarding' ? 'fa-hotel' : 'fa-school')}" style="color: var(--text-secondary); margin-right: 4px; font-size: 0.75rem;"></i>
                            <span>${room.name}</span>
                            ${systemBadge}
                        </div>
                        ${tuitionRevenueHtml}
                    </td>
                    <td style="padding: 12px 10px; text-align: center; font-size: 0.78rem; font-weight: 700; color: #555;">
                        <span class="badge" style="background: rgba(0,0,0,0.04); color: #333; padding: 2px 6px; border-radius: 4px;">${splitRatio}%</span>
                    </td>
                    <td style="padding: 12px 10px; text-align: center; font-size: 0.78rem; font-weight: 600; color: var(--text-secondary);">
                        ${room.capacity} HS
                    </td>
                    <td style="padding: 12px 10px; text-align: center; font-size: 0.78rem; font-weight: 700; color: ${isFunctional ? '#8E8E93' : 'var(--text-primary)'};">
                        ${isFunctional ? '-' : (roundedMax + ' HS')}
                    </td>
                    <td style="padding: 12px 10px; width: 180px;">
                        ${fillProgressHtml}
                    </td>
                </tr>
            `;
        });
        
        const roundedTotalMax = Math.round(totalMaxCap);
        const roundedTotalSim = Math.round(totalSimStudents);
        
        container.innerHTML = `
            <table style="width: 100%; border-collapse: collapse; text-align: left;">
                <thead>
                    <tr style="border-bottom: 2px solid rgba(0,0,0,0.06); background: rgba(0,0,0,0.01);">
                        <th style="padding: 10px; font-size: 0.75rem; font-weight: 800; color: var(--text-secondary); text-transform: uppercase;">Phòng học</th>
                        <th style="padding: 10px; font-size: 0.75rem; font-weight: 800; color: var(--text-secondary); text-transform: uppercase; text-align: center;">Tỉ lệ của khối</th>
                        <th style="padding: 10px; font-size: 0.75rem; font-weight: 800; color: var(--text-secondary); text-transform: uppercase; text-align: center;">Sức chứa phòng</th>
                        <th style="padding: 10px; font-size: 0.75rem; font-weight: 800; color: var(--text-secondary); text-transform: uppercase; text-align: center;">Sức chứa cho khối</th>
                        <th style="padding: 10px; font-size: 0.75rem; font-weight: 800; color: var(--text-secondary); text-transform: uppercase;">Giả lập lấp đầy</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
                <tfoot>
                    <tr style="background: rgba(0,0,0,0.02); font-weight: 800; border-top: 2px solid rgba(0,0,0,0.06);">
                        <td style="padding: 14px 10px; font-size: 0.8rem; color: var(--text-primary);">
                            Quy mô học đường: <strong style="color: ${info.color}; font-size: 0.85rem;">${totalRoomFraction.toFixed(1)} phòng</strong>
                            <div style="margin-top: 6px; font-size: 0.76rem; color: var(--text-secondary); font-weight: 550;">
                                Tổng doanh thu học phí giả lập: <strong style="color: var(--danger); font-size: 0.88rem; font-weight: 800;">${formatCurrency(Math.round(totalSimRevenue))} / tháng</strong>
                            </div>
                        </td>
                        <td style="padding: 14px 10px; text-align: center;">-</td>
                        <td style="padding: 14px 10px; text-align: center;">-</td>
                        <td style="padding: 14px 10px; text-align: center; font-size: 0.8rem; color: var(--text-primary);">
                            ${roundedTotalMax} HS
                        </td>
                        <td style="padding: 14px 10px;">
                            <div style="display: flex; flex-direction: column; gap: 4px;">
                                <div style="display: flex; justify-content: space-between; font-size: 0.7rem; font-weight: 800;">
                                    <span style="color: ${info.color};"><i class="fa-solid fa-circle-check"></i> ${roundedTotalSim} HS</span>
                                    <span style="color: var(--text-secondary);">${fillRate}%</span>
                                </div>
                                <div style="width: 100%; height: 8px; background: rgba(0,0,0,0.1); border-radius: 4px; overflow: hidden;">
                                    <div style="width: ${fillRate}%; height: 100%; background: ${info.color}; border-radius: 4px;"></div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
        `;
    }
    
    document.getElementById("sim_dept_rooms_modal").classList.add("open");
}

let draggedRoomId = null;
let roomDraggedOverId = null;

function handleRoomDragStart(e, roomId) {
    draggedRoomId = roomId;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", roomId);
    
    // Tạo cảm giác kéo thả mượt mà hơn
    const row = e.currentTarget;
    setTimeout(() => {
        row.style.opacity = "0.4";
        row.style.border = "2px dashed var(--primary)";
    }, 0);
}

function handleRoomDragOver(e, roomId) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    
    const row = e.currentTarget;
    if (roomDraggedOverId !== roomId && draggedRoomId !== roomId) {
        roomDraggedOverId = roomId;
        row.style.background = "rgba(0, 122, 255, 0.06)";
        row.style.borderTop = "2px solid var(--primary)";
    }
}

function handleRoomDragLeave(e, roomId) {
    const row = e.currentTarget;
    row.style.background = "";
    row.style.borderTop = "";
    if (roomDraggedOverId === roomId) {
        roomDraggedOverId = null;
    }
}

function handleRoomDrop(e, targetRoomId) {
    e.preventDefault();
    const row = e.currentTarget;
    row.style.background = "";
    row.style.borderTop = "";
    
    if (draggedRoomId && draggedRoomId !== targetRoomId) {
        const fromIndex = appState.rooms.findIndex(r => r.id === draggedRoomId);
        const toIndex = appState.rooms.findIndex(r => r.id === targetRoomId);
        
        if (fromIndex !== -1 && toIndex !== -1) {
            // Thay đổi vị trí của phòng trong mảng dữ liệu
            const [draggedRoom] = appState.rooms.splice(fromIndex, 1);
            appState.rooms.splice(toIndex, 0, draggedRoom);
            
            saveState();
            const result = runAllocation();
            renderDashboard(result);
            renderFacilities();
        }
    }
    draggedRoomId = null;
    roomDraggedOverId = null;
}

function handleRoomDragEnd(e) {
    const row = e.currentTarget;
    row.style.opacity = "";
    row.style.border = "";
    
    // Dọn dẹp tất cả các dòng đề phòng sự kiện kéo thả bị hủy đột ngột
    const rows = document.querySelectorAll("#room_list_body tr");
    rows.forEach(r => {
        r.style.opacity = "";
        r.style.border = "";
        r.style.background = "";
        r.style.borderTop = "";
    });
}

function renameRentBlock(blockId, newName) {
    const blk = appState.rentBlocks.find(b => b.id === blockId);
    if (!blk || !newName.trim()) return;
    blk.name = newName.trim();
    saveState();
    const result = runAllocation();
    renderDashboard(result);
    renderFacilities();
}

window.switchScenarioMode = switchScenarioMode;
window.updateSimFillRate = updateSimFillRate;
window.updateSimDeptFillRate = updateSimDeptFillRate;
window.updateSimulationUI = updateSimulationUI;
window.openSimDeptRoomsModal = openSimDeptRoomsModal;
window.updateRoomType = updateRoomType;
window.updateRoomSystem = updateRoomSystem;
window.updateSimTuition = updateSimTuition;
window.updateRentBlockCost = updateRentBlockCost;
window.updateRentBlockPercent = updateRentBlockPercent;
window.updateLandlordRent = updateLandlordRent;
window.updateRentBlockRoomCount = updateRentBlockRoomCount;
window.renameRentBlock = renameRentBlock;
window.handleRoomDragStart = handleRoomDragStart;
window.handleRoomDragOver = handleRoomDragOver;
window.handleRoomDragLeave = handleRoomDragLeave;
window.handleRoomDrop = handleRoomDrop;
window.handleRoomDragEnd = handleRoomDragEnd;
window.updateEmpAddRatiosSummary = updateEmpAddRatiosSummary;
window.resetFillRatesToActuals = resetFillRatesToActuals;


