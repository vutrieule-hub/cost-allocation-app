/* ==========================================================================
   UPDATED STATE & DYNAMIC ALLOCATION ENGINE: XANH TUỆ ĐỨC
   ========================================================================== */

const STORAGE_KEY = "XTD_COST_ALLOCATION_STATE_V2";

// Advanced Dynamic Default Template representing both sheets
const DEFAULT_TEMPLATE = {
    "departments": [
        {
            "students": 45,
            "type": "revenue",
            "id": "dept_tieuhoc",
            "name": "Khối Tiểu học"
        },
        {
            "name": "Khối THCS",
            "id": "dept_thcs",
            "type": "revenue",
            "students": 55
        },
        {
            "type": "revenue",
            "students": 147,
            "id": "dept_thpt",
            "name": "Khối THPT"
        },
        {
            "name": "Ban Nội trú",
            "students": 42,
            "type": "revenue",
            "id": "dept_noitru"
        },
        {
            "note": "Trong giai đoạn này: \nBan Điều Hành tập trung vào phát triển cấp 1 và cấp 2 nên phân bổ chi phí của BĐH vào 2 khối này nhiều hơn\nNội trú được coi là dịch vụ kèm, không phải dịch vụ chính, vì vậy nhận phân bổ chi phí ít hơn \n\n",
            "driver": "custom_percent",
            "name": "Ban Điều hành (BĐH)",
            "id": "dept_bdh",
            "type": "support"
        },
        {
            "note": "Tiểu học có cô Hiền BGH tập trung\nTHCS có cô Hiền BGH làm kiêm nhiệm \nTHPT có thầy Phan BGH tập trung",
            "driver": "student_count",
            "id": "dept_bgh",
            "type": "support",
            "name": "Ban Giám hiệu (BGH)"
        },
        {
            "type": "support",
            "id": "dept_hckt",
            "name": "Hành chính Kế toán (HCKT)",
            "allocationMethod": "student",
            "driver": "staff_count",
            "note": ""
        },
        {
            "id": "dept_tuyensinh",
            "type": "support",
            "name": "Tuyển sinh",
            "note": "Ghi nhận nguồn lực thực tế nhìn nhận của bộ phận tuyển sinh giành cho từng khối\nTHPT chủ động tự tuyển sinh nhiều hơn\nNội trú chủ yếu PH phát sinh nhu cầu tìm đến",
            "driver": "new_students"
        },
        {
            "id": "dept_truyenthong",
            "type": "support",
            "driver": "new_students",
            "name": "Truyền thông"
        },
        {
            "id": "dept_tongvu",
            "type": "support",
            "allocationMethod": "student",
            "name": "Tổng vụ",
            "driver": "area_m2"
        },
        {
            "driver": "meals",
            "note": "Phân bổ đều cho các bộ phận. \nNội trú sử dụng riêng biệt bếp ăn buổi tối\nTHPT chưa sử dụng bếp, do lượng học sinh bán trú chưa nhiều, nhưng nhà trường cung cấp dịch v�� này và THPT cần hướng đến việc tuyển sinh hệ xanh, vì vậy sẽ vẫn phải ghi nhận chi phí phân bổ này",
            "name": "Bếp ăn",
            "allocationMethod": "manual",
            "type": "support",
            "id": "dept_bep"
        },
        {
            "driver": "area_m2",
            "name": "An ninh",
            "allocationMethod": "student",
            "type": "support",
            "id": "dept_anninh"
        },
        {
            "name": "Sạch đẹp",
            "type": "support",
            "id": "dept_sachdep",
            "driver": "area_m2",
            "note": "THPT đông học sinh, và ý thức kém nhất, vì vậy chịu phân bổ nhiều nhất\nTHCS và Tiểu học chịu phân bổ ít hơn do số lượng học sinh ít hơn và cũng đã có ý thức giữ gìn hơn\nNội trú tự dọn dẹp phòng ốc và phòng vệ sinh, nên phân bổ chi phí xanh sạch ít hơn các bộ phận khác, chủ yếu phân bổ chi phí đổ rác và dọn dẹp cảnh quan chung của sân trường\n"
        },
        {
            "id": "dept_dien",
            "type": "support",
            "name": "Chi phí Điện",
            "isUtility": true
        },
        {
            "type": "support",
            "id": "dept_nuoc",
            "isUtility": true,
            "name": "Chi phí Nước"
        },
        {
            "name": "Văn Hóa",
            "allocationMethod": "manual",
            "type": "support",
            "id": "dept_1779722697629",
            "note": ""
        },
        {
            "id": "dept_1779781275635",
            "type": "support",
            "name": "Xe bus"
        },
        {
            "name": "Kỹ năng - Sự kiện",
            "type": "support",
            "id": "dept_1779782090457",
            "note": "THPT được tổ chức ít chương trình hơn vì không có hệ xanh\nTiểu học và THCS hệ xanh được tập trung tổ chức nhiều sự kiện hơn vì vậy sẽ chịu chi phí phân bổ nhiều hơn\nNội trú tự tổ chức do thầy cô nội trú nên không chịu phân bổ của tổ này"
        },
        {
            "note": "Kỷ luật chưa làm tốt cho khối THPT nên chỉ phân bổ TH và THCS là chính\nThầy cô nội trú tự quản lý kỷ luật học sinh nên không chịu phân bổ",
            "name": "Kỷ luật",
            "allocationMethod": "manual",
            "type": "support",
            "id": "dept_1779782898139"
        }
    ],
    "rentBlocks": [
        {
            "id": "blk_hieubo",
            "totalRent": 39100000,
            "name": "Nhà Hiệu Bộ"
        },
        {
            "id": "blk_10phong",
            "totalRent": 39100000,
            "name": "Khu THPT 10 phòng"
        },
        {
            "totalRent": 32200000,
            "id": "blk_8phong",
            "name": "Khu L - Tiểu học"
        },
        {
            "name": "Khu 8 phòng - THCS",
            "totalRent": 32200000,
            "id": "blk_toamoi_l"
        },
        {
            "totalRent": 23000000,
            "id": "blk_toai",
            "name": "Khu toà CLB"
        },
        {
            "totalRent": 11500000,
            "id": "blk_sanbong",
            "name": "Sân Bóng đá"
        },
        {
            "id": "blk_westpoint",
            "totalRent": 11500000,
            "name": "Khu Westpoint cao + đất"
        },
        {
            "name": "Khu Bếp Ăn & Nhà ăn",
            "totalRent": 11500000,
            "id": "blk_bepan"
        },
        {
            "totalRent": 23000000,
            "id": "blk_danang",
            "name": "Nhà Đa năng"
        }
    ],
    "rooms": [
        {
            "blockId": "blk_hieubo",
            "status": "active",
            "type": "functional",
            "capacity": 50,
            "splits": {
                "dept_thcs": 33.3,
                "dept_thpt": 33.4,
                "dept_tieuhoc": 33.3
            },
            "id": "rm_hieubo_1",
            "currentStudents": 0,
            "name": "T1 Thư viện",
            "system": "thuong"
        },
        {
            "system": "thuong",
            "status": "active",
            "blockId": "blk_hieubo",
            "id": "rm_hieubo_2",
            "capacity": 15,
            "type": "functional",
            "splits": {
                "dept_tongvu": 20,
                "dept_hckt": 50,
                "dept_truyenthong": 30
            },
            "name": "T1 Phòng Hành chính",
            "currentStudents": 0
        },
        {
            "status": "active",
            "blockId": "blk_hieubo",
            "capacity": 10,
            "type": "functional",
            "splits": {
                "dept_tieuhoc": 30,
                "dept_bdh": 40,
                "dept_thcs": 30
            },
            "id": "rm_hieubo_3",
            "currentStudents": 0,
            "name": "T1 Phòng chuyên môn",
            "allocationMethod": "manual",
            "system": "thuong",
            "selectedDepts": []
        },
        {
            "system": "thuong",
            "status": "active",
            "blockId": "blk_hieubo",
            "name": "T2 Phòng Tĩnh Tâm",
            "currentStudents": 0,
            "id": "rm_hieubo_4",
            "splits": {
                "dept_tieuhoc": 33.3,
                "dept_thpt": 33.4,
                "dept_thcs": 33.3
            },
            "capacity": 40,
            "type": "functional"
        },
        {
            "system": "thuong",
            "id": "rm_hieubo_5",
            "capacity": 20,
            "splits": {
                "dept_thcs": 40,
                "dept_thpt": 20,
                "dept_tieuhoc": 40
            },
            "type": "functional",
            "currentStudents": 0,
            "name": "T2 Phòng cô giáo",
            "blockId": "blk_hieubo",
            "status": "active"
        },
        {
            "selectedDepts": [],
            "system": "thuong",
            "status": "active",
            "blockId": "blk_hieubo",
            "id": "rm_hieubo_6",
            "splits": {
                "dept_thcs": 35,
                "dept_thpt": 30,
                "dept_tieuhoc": 35
            },
            "type": "functional",
            "capacity": 40,
            "allocationMethod": "manual",
            "name": "T2 Phòng Kho",
            "currentStudents": 0
        },
        {
            "status": "active",
            "blockId": "blk_hieubo",
            "name": "T1 Phòng Tuyển sinh",
            "currentStudents": 0,
            "id": "rm_hieubo_7",
            "capacity": 10,
            "type": "functional",
            "splits": {
                "dept_tuyensinh": 100
            },
            "system": "thuong"
        },
        {
            "system": "xanh",
            "currentStudents": 6,
            "name": "T1 Lớp 1",
            "id": "rm_tieuhoc_1",
            "type": "classroom",
            "capacity": 25,
            "splits": {
                "dept_tieuhoc": 100
            },
            "blockId": "blk_8phong",
            "status": "active"
        },
        {
            "id": "rm_tieuhoc_2",
            "type": "classroom",
            "splits": {
                "dept_tieuhoc": 100
            },
            "capacity": 25,
            "name": "T1 Lớp 2",
            "currentStudents": 5,
            "blockId": "blk_8phong",
            "status": "active",
            "system": "xanh"
        },
        {
            "system": "xanh",
            "selectedDepts": [],
            "blockId": "blk_8phong",
            "status": "active",
            "currentStudents": 0,
            "name": "T1 Phòng Sáng tạo",
            "allocationMethod": "manual",
            "splits": {
                "dept_thcs": 50,
                "dept_tieuhoc": 50
            },
            "capacity": 25,
            "type": "functional",
            "id": "rm_tieuhoc_7"
        },
        {
            "status": "empty",
            "blockId": "blk_8phong",
            "id": "rm_tieuhoc_6",
            "splits": {
                "dept_tieuhoc": 100
            },
            "type": "classroom",
            "capacity": 25,
            "currentStudents": 0,
            "name": "T1 Phòng trống",
            "system": "xanh"
        },
        {
            "status": "active",
            "blockId": "blk_8phong",
            "splits": {
                "dept_tieuhoc": 100
            },
            "capacity": 25,
            "type": "classroom",
            "id": "rm_tieuhoc_3",
            "currentStudents": 11,
            "name": "T2 Lớp 3",
            "system": "xanh"
        },
        {
            "status": "active",
            "blockId": "blk_8phong",
            "name": "T2 Lớp 4",
            "currentStudents": 6,
            "type": "classroom",
            "splits": {
                "dept_tieuhoc": 100
            },
            "capacity": 25,
            "id": "rm_tieuhoc_4",
            "system": "xanh"
        },
        {
            "system": "xanh",
            "status": "active",
            "blockId": "blk_8phong",
            "splits": {
                "dept_tieuhoc": 100
            },
            "capacity": 25,
            "type": "classroom",
            "id": "rm_tieuhoc_5",
            "currentStudents": 17,
            "name": "T2 Lớp 5"
        },
        {
            "currentStudents": 0,
            "name": "T2 Phòng trống",
            "id": "rm_tieuhoc_8",
            "splits": {
                "dept_tieuhoc": 100
            },
            "capacity": 25,
            "type": "classroom",
            "status": "empty",
            "blockId": "blk_8phong",
            "system": "xanh"
        },
        {
            "system": "xanh",
            "status": "active",
            "blockId": "blk_toamoi_l",
            "currentStudents": 18,
            "name": "T1 Lớp 6",
            "splits": {
                "dept_thcs": 100
            },
            "type": "classroom",
            "capacity": 25,
            "id": "rm_thcs_1"
        },
        {
            "system": "xanh",
            "splits": {
                "dept_thcs": 100
            },
            "type": "classroom",
            "capacity": 25,
            "id": "rm_thcs_2",
            "currentStudents": 9,
            "name": "T1 Lớp 7",
            "blockId": "blk_toamoi_l",
            "status": "active"
        },
        {
            "status": "active",
            "blockId": "blk_toamoi_l",
            "id": "rm_thcs_3",
            "capacity": 25,
            "splits": {
                "dept_thcs": 100
            },
            "type": "classroom",
            "name": "T2 Lớp 8",
            "currentStudents": 16,
            "system": "xanh"
        },
        {
            "capacity": 25,
            "type": "classroom",
            "splits": {
                "dept_thcs": 100
            },
            "id": "rm_thcs_4",
            "currentStudents": 12,
            "name": "T2 Lớp 9",
            "status": "active",
            "blockId": "blk_toamoi_l",
            "system": "xanh"
        },
        {
            "currentStudents": 0,
            "name": "T1 Phòng trưng bày",
            "splits": {
                "dept_thcs": 100
            },
            "type": "functional",
            "capacity": 25,
            "id": "rm_thcs_5",
            "blockId": "blk_toamoi_l",
            "status": "empty",
            "system": "xanh"
        },
        {
            "name": "T1 Phòng trống",
            "currentStudents": 0,
            "type": "classroom",
            "splits": {
                "dept_thcs": 100
            },
            "capacity": 25,
            "id": "rm_thcs_6",
            "status": "empty",
            "blockId": "blk_toamoi_l",
            "system": "xanh"
        },
        {
            "splits": {
                "dept_noitru": 100
            },
            "capacity": 18,
            "type": "boarding",
            "id": "rm_thcs_7",
            "name": "Phòng nội trú nữ B1",
            "currentStudents": 0,
            "blockId": "blk_toamoi_l",
            "status": "active",
            "system": "thuong"
        },
        {
            "id": "rm_thcs_8",
            "type": "boarding",
            "capacity": 18,
            "splits": {
                "dept_noitru": 100
            },
            "name": "Phòng nội trú nữ B2",
            "currentStudents": 12,
            "status": "active",
            "blockId": "blk_toamoi_l",
            "system": "thuong"
        },
        {
            "system": "thuong",
            "name": "T1 Lớp 10A1",
            "currentStudents": 28,
            "capacity": 45,
            "type": "classroom",
            "splits": {
                "dept_thpt": 100
            },
            "id": "rm_thpt_1",
            "status": "active",
            "blockId": "blk_10phong"
        },
        {
            "system": "thuong",
            "type": "classroom",
            "capacity": 45,
            "splits": {
                "dept_thpt": 100
            },
            "id": "rm_thpt_2",
            "name": "T1 Lớp 10A2",
            "currentStudents": 27,
            "status": "active",
            "blockId": "blk_10phong"
        },
        {
            "status": "active",
            "blockId": "blk_10phong",
            "currentStudents": 8,
            "name": "T1 Lớp 10A3",
            "id": "rm_thpt_3",
            "splits": {
                "dept_thpt": 100
            },
            "type": "classroom",
            "capacity": 40,
            "system": "thuong"
        },
        {
            "status": "active",
            "blockId": "blk_10phong",
            "capacity": 45,
            "splits": {
                "dept_thpt": 100
            },
            "type": "classroom",
            "id": "rm_thpt_4",
            "currentStudents": 15,
            "name": "T2 Lớp 11A1",
            "system": "thuong"
        },
        {
            "system": "thuong",
            "name": "T2 Lớp 12A1",
            "currentStudents": 36,
            "id": "rm_thpt_5",
            "type": "classroom",
            "splits": {
                "dept_thpt": 100
            },
            "capacity": 45,
            "blockId": "blk_10phong",
            "status": "active"
        },
        {
            "type": "classroom",
            "splits": {
                "dept_thpt": 100
            },
            "capacity": 45,
            "id": "rm_thpt_6",
            "name": "T2 Lớp 12A2",
            "currentStudents": 33,
            "status": "active",
            "blockId": "blk_10phong",
            "system": "thuong"
        },
        {
            "system": "thuong",
            "id": "rm_thpt_7",
            "capacity": 20,
            "splits": {
                "dept_thpt": 100
            },
            "type": "functional",
            "name": "T1 Phòng CM THPT",
            "currentStudents": 0,
            "blockId": "blk_10phong",
            "status": "active"
        },
        {
            "system": "thuong",
            "status": "empty",
            "blockId": "blk_10phong",
            "currentStudents": 0,
            "name": "T1 Phòng hóa sinh",
            "type": "functional",
            "capacity": 40,
            "splits": {
                "dept_thcs": 50,
                "dept_thpt": 50
            },
            "id": "rm_thpt_8"
        },
        {
            "system": "thuong",
            "name": "T2 Phòng Nội trú nam A1",
            "currentStudents": 18,
            "splits": {
                "dept_noitru": 100
            },
            "type": "boarding",
            "capacity": 18,
            "id": "rm_thpt_9",
            "status": "active",
            "blockId": "blk_10phong"
        },
        {
            "status": "active",
            "blockId": "blk_10phong",
            "name": "T2 Phòng Nội trú nam A2",
            "currentStudents": 12,
            "id": "rm_thpt_10",
            "capacity": 18,
            "type": "boarding",
            "splits": {
                "dept_noitru": 100
            },
            "system": "thuong"
        },
        {
            "status": "active",
            "blockId": "blk_toai",
            "name": "Phòng Tin Học 1 (T2)",
            "currentStudents": 0,
            "type": "functional",
            "capacity": 40,
            "splits": {
                "dept_thcs": 33.3,
                "dept_thpt": 33.4,
                "dept_tieuhoc": 33.3
            },
            "id": "rm_toai_1",
            "system": "thuong"
        },
        {
            "system": "thuong",
            "id": "rm_toai_2",
            "type": "functional",
            "splits": {
                "dept_tieuhoc": 33.3,
                "dept_thpt": 33.4,
                "dept_thcs": 33.3
            },
            "capacity": 40,
            "name": "Phòng Tin Học 2 (T2)",
            "currentStudents": 0,
            "blockId": "blk_toai",
            "status": "empty"
        },
        {
            "id": "rm_toai_3",
            "capacity": 45,
            "type": "functional",
            "splits": {
                "dept_tieuhoc": 40,
                "dept_thpt": 20,
                "dept_thcs": 40
            },
            "allocationMethod": "manual",
            "name": "Phòng âm nhạc T1",
            "currentStudents": 0,
            "blockId": "blk_toai",
            "status": "active",
            "selectedDepts": [],
            "system": "thuong"
        },
        {
            "selectedDepts": [],
            "system": "thuong",
            "blockId": "blk_toai",
            "status": "empty",
            "id": "rm_toai_4",
            "splits": {
                "dept_tieuhoc": 40,
                "dept_thcs": 40,
                "dept_thpt": 20
            },
            "type": "functional",
            "capacity": 45,
            "allocationMethod": "manual",
            "name": "Phòng Múa T1",
            "currentStudents": 0
        },
        {
            "system": "thuong",
            "status": "active",
            "blockId": "blk_sanbong",
            "id": "rm_shared_1",
            "type": "functional",
            "capacity": 200,
            "splits": {
                "dept_noitru": 25,
                "dept_thcs": 25,
                "dept_thpt": 25,
                "dept_tieuhoc": 25
            },
            "currentStudents": 0,
            "name": "Sân bóng đá lớn"
        },
        {
            "currentStudents": 0,
            "name": "Khu rèn luyện Westpoint",
            "id": "rm_shared_2",
            "capacity": 300,
            "type": "functional",
            "splits": {
                "dept_tieuhoc": 35,
                "dept_thpt": 30,
                "dept_thcs": 35
            },
            "blockId": "blk_westpoint",
            "status": "active",
            "system": "thuong"
        },
        {
            "system": "thuong",
            "currentStudents": 0,
            "name": "Bếp ăn & Khu ăn uống",
            "id": "rm_shared_3",
            "splits": {
                "dept_bep": 100
            },
            "capacity": 500,
            "type": "functional",
            "blockId": "blk_bepan",
            "status": "active"
        },
        {
            "id": "rm_shared_4",
            "splits": {
                "dept_tieuhoc": 30,
                "dept_thcs": 30,
                "dept_thpt": 30,
                "dept_noitru": 10
            },
            "capacity": 600,
            "type": "functional",
            "currentStudents": 0,
            "name": "Nhà Đa năng",
            "blockId": "blk_danang",
            "status": "active",
            "system": "thuong"
        },
        {
            "splits": {
                "dept_tieuhoc": 100
            },
            "type": "functional",
            "capacity": 40,
            "id": "rm_1779942558697",
            "name": "Phòng chuyên môn TH",
            "currentStudents": 0,
            "status": "active",
            "blockId": "blk_toai",
            "system": "thuong"
        }
    ],
    "employees": [
        {
            "allocationMode": "percentage",
            "name": "Nguyễn Duy Phan",
            "id": "emp_real_1",
            "deptId": "dept_bgh",
            "isMultiLevel": true,
            "salary": 16500000,
            "ratios": {
                "dept_tuyensinh": 0,
                "dept_thcs": 0,
                "dept_1779722697629": 0,
                "dept_thpt": 100,
                "dept_hckt": 0,
                "dept_bdh": 0,
                "dept_tieuhoc": 0,
                "dept_tongvu": 0,
                "dept_bep": 0,
                "dept_anninh": 0,
                "dept_1779782090457": 0,
                "dept_1779781275635": 0,
                "dept_noitru": 0,
                "dept_1779782898139": 0,
                "dept_truyenthong": 0,
                "dept_bgh": 0,
                "dept_sachdep": 0
            }
        },
        {
            "ratios": {
                "dept_tuyensinh": 0,
                "dept_thcs": 3000000,
                "dept_thpt": 0,
                "dept_1779722697629": 0,
                "dept_hckt": 0,
                "dept_tieuhoc": 12000000,
                "dept_bdh": 0,
                "dept_tongvu": 0,
                "dept_bep": 0,
                "dept_anninh": 0,
                "dept_1779782090457": 0,
                "dept_noitru": 0,
                "dept_1779781275635": 0,
                "dept_1779782898139": 0,
                "dept_bgh": 0,
                "dept_truyenthong": 0,
                "dept_sachdep": 0
            },
            "salary": 15000000,
            "ratioNotes": {},
            "allocationMode": "amount",
            "name": "Nguyễn Thị Hiền",
            "id": "emp_real_2",
            "deptId": "dept_bgh",
            "isMultiLevel": true
        },
        {
            "salary": 7041667,
            "id": "emp_real_3",
            "isMultiLevel": false,
            "deptId": "dept_tieuhoc",
            "allocationMode": "percentage",
            "name": "Lê Thị Hằng"
        },
        {
            "salary": 8834475,
            "id": "emp_real_4",
            "deptId": "dept_tieuhoc",
            "isMultiLevel": false,
            "name": "Nguyễn Thị Mai Hoa"
        },
        {
            "salary": 11916667,
            "deptId": "dept_tieuhoc",
            "isMultiLevel": false,
            "id": "emp_real_5",
            "name": "Phạm Thị Thu Hiền"
        },
        {
            "name": "Lê Thị Lụa",
            "id": "emp_real_6",
            "deptId": "dept_thcs",
            "isMultiLevel": false,
            "salary": 10626000
        },
        {
            "salary": 10876667,
            "name": "Lương Thị Hiền",
            "id": "emp_real_7",
            "deptId": "dept_thcs",
            "isMultiLevel": false
        },
        {
            "deptId": "dept_thpt",
            "isMultiLevel": false,
            "id": "emp_real_8",
            "name": "Phạm Thị Kim Thoa",
            "salary": 8729146
        },
        {
            "name": "Trịnh Thị Thu Ngân",
            "id": "emp_real_9",
            "deptId": "dept_thcs",
            "isMultiLevel": false,
            "salary": 9218400
        },
        {
            "name": "Lê Thị Tuyên",
            "isMultiLevel": false,
            "deptId": "dept_thpt",
            "id": "emp_real_10",
            "salary": 10667500
        },
        {
            "salary": 9018240,
            "id": "emp_real_11",
            "isMultiLevel": false,
            "deptId": "dept_thpt",
            "name": "Lương Thị Xuân"
        },
        {
            "id": "emp_real_12",
            "isMultiLevel": true,
            "deptId": "dept_thpt",
            "name": "Nguyễn Thị Phương",
            "salary": 12000000,
            "ratios": {
                "dept_bep": 0,
                "dept_anninh": 0,
                "dept_tongvu": 0,
                "dept_sachdep": 0,
                "dept_bgh": 0,
                "dept_truyenthong": 0,
                "dept_noitru": 0,
                "dept_thcs": 20,
                "dept_tuyensinh": 0,
                "dept_tieuhoc": 0,
                "dept_bdh": 0,
                "dept_hckt": 0,
                "dept_thpt": 80,
                "dept_1779722697629": 0
            }
        },
        {
            "deptId": "dept_thpt",
            "isMultiLevel": false,
            "id": "emp_real_13",
            "name": "Nguyễn Thị Thu Trang",
            "salary": 10089100
        },
        {
            "name": "Nguyễn Vũ Minh",
            "id": "emp_real_14",
            "deptId": "dept_thpt",
            "isMultiLevel": false,
            "salary": 9000000
        },
        {
            "isMultiLevel": true,
            "deptId": "dept_hckt",
            "id": "emp_real_15",
            "name": "Bùi Gia Khiêm",
            "ratios": {
                "dept_thcs": 0,
                "dept_tuyensinh": 0,
                "dept_bdh": 0,
                "dept_tieuhoc": 0,
                "dept_hckt": 0,
                "dept_thpt": 0,
                "dept_1779722697629": 0,
                "dept_anninh": 0,
                "dept_bep": 0,
                "dept_tongvu": 80,
                "dept_sachdep": 0,
                "dept_truyenthong": 0,
                "dept_bgh": 0,
                "dept_noitru": 0,
                "dept_1779781275635": 20
            },
            "salary": 12833333
        },
        {
            "name": "Bùi Văn Lượng",
            "id": "emp_real_16",
            "isMultiLevel": false,
            "deptId": "dept_anninh",
            "salary": 5000000
        },
        {
            "salary": 7000000,
            "name": "Đào Thị Kim Dung",
            "id": "emp_real_17",
            "deptId": "dept_thpt",
            "isMultiLevel": false
        },
        {
            "salary": 5900000,
            "name": "Đỗ Thị Miện",
            "id": "emp_real_18",
            "deptId": "dept_sachdep",
            "isMultiLevel": false
        },
        {
            "isMultiLevel": false,
            "deptId": "dept_sachdep",
            "id": "emp_real_19",
            "name": "Phạm Thị Gấm",
            "salary": 5900000
        },
        {
            "id": "emp_real_20",
            "isMultiLevel": false,
            "deptId": "dept_sachdep",
            "name": "Phạm Thị Nga",
            "salary": 5900000
        },
        {
            "salary": 7000000,
            "name": "Phạm Thị Quỳnh",
            "id": "emp_real_21",
            "deptId": "dept_bep",
            "isMultiLevel": false
        },
        {
            "salary": 8000000,
            "deptId": "dept_bep",
            "isMultiLevel": false,
            "id": "emp_real_22",
            "name": "Phạm Thị Tuyết"
        },
        {
            "isMultiLevel": false,
            "deptId": "dept_tongvu",
            "id": "emp_real_23",
            "name": "Trần Duy Hưng",
            "salary": 8000000
        },
        {
            "salary": 9300000,
            "name": "Trần Minh Trường",
            "isMultiLevel": false,
            "deptId": "dept_tongvu",
            "id": "emp_real_24"
        },
        {
            "name": "Trần Văn Quyết",
            "id": "emp_real_25",
            "isMultiLevel": false,
            "deptId": "dept_anninh",
            "salary": 5000000
        },
        {
            "isMultiLevel": false,
            "deptId": "dept_anninh",
            "id": "emp_real_26",
            "name": "Vũ Văn Tính",
            "salary": 5000000
        },
        {
            "salary": 11575000,
            "id": "emp_real_27",
            "deptId": "dept_thpt",
            "isMultiLevel": false,
            "name": "Hoàng Thị Thúy"
        },
        {
            "salary": 9051840,
            "name": "Nguyễn Ngọc Dương",
            "deptId": "dept_thpt",
            "isMultiLevel": false,
            "id": "emp_real_28"
        },
        {
            "name": "Nguyễn Phương Thảo",
            "isMultiLevel": false,
            "deptId": "dept_tieuhoc",
            "id": "emp_real_29",
            "salary": 8553600
        },
        {
            "salary": 10483200,
            "name": "Nguyễn Thị Lan",
            "isMultiLevel": false,
            "deptId": "dept_tieuhoc",
            "id": "emp_real_30"
        },
        {
            "salary": 10784900,
            "id": "emp_real_31",
            "isMultiLevel": false,
            "deptId": "dept_thcs",
            "name": "Phạm Ngọc Thúy"
        },
        {
            "salary": 10368300,
            "name": "Trịnh Hà An",
            "id": "emp_real_32",
            "deptId": "dept_tieuhoc",
            "isMultiLevel": false
        },
        {
            "name": "Bùi Ngọc Trà",
            "deptId": "dept_truyenthong",
            "isMultiLevel": false,
            "id": "emp_real_33",
            "salary": 12525000
        },
        {
            "salary": 6467916,
            "isMultiLevel": false,
            "deptId": "dept_tuyensinh",
            "id": "emp_real_34",
            "name": "Đặng Thị Hoan"
        },
        {
            "id": "emp_real_35",
            "deptId": "dept_thcs",
            "isMultiLevel": false,
            "allocationMode": "amount",
            "name": "Phạm Mai Linh",
            "salary": 11731000
        },
        {
            "name": "Trần Thị Nhung",
            "id": "emp_real_36",
            "isMultiLevel": false,
            "deptId": "dept_tuyensinh",
            "salary": 14667916
        },
        {
            "ratios": {
                "dept_tuyensinh": 0,
                "dept_thcs": 45,
                "dept_hckt": 0,
                "dept_tieuhoc": 45,
                "dept_bdh": 0,
                "dept_1779722697629": 0,
                "dept_thpt": 10,
                "dept_tongvu": 0,
                "dept_anninh": 0,
                "dept_bep": 0,
                "dept_truyenthong": 0,
                "dept_bgh": 0,
                "dept_sachdep": 0,
                "dept_1779781275635": 0,
                "dept_noitru": 0
            },
            "salary": 12000000,
            "id": "emp_real_37",
            "deptId": "dept_tieuhoc",
            "isMultiLevel": true,
            "name": "Bùi Mạnh Hùng"
        },
        {
            "name": "Đoàn Thu Hà",
            "deptId": "dept_tieuhoc",
            "isMultiLevel": true,
            "id": "emp_real_38",
            "ratios": {
                "dept_tieuhoc": 45,
                "dept_thpt": 10,
                "dept_thcs": 45
            },
            "salary": 9240000
        },
        {
            "ratios": {
                "dept_1779722697629": 0,
                "dept_thpt": 0,
                "dept_hckt": 0,
                "dept_tieuhoc": 50,
                "dept_bdh": 0,
                "dept_tuyensinh": 0,
                "dept_thcs": 0,
                "dept_1779781275635": 0,
                "dept_noitru": 0,
                "dept_bgh": 0,
                "dept_truyenthong": 0,
                "dept_sachdep": 0,
                "dept_tongvu": 0,
                "dept_bep": 0,
                "dept_anninh": 0,
                "dept_1779782090457": 50
            },
            "salary": 17025000,
            "id": "emp_real_39",
            "isMultiLevel": true,
            "deptId": "dept_1779782090457",
            "name": "Mạc Lệ Quỳnh"
        },
        {
            "ratios": {
                "dept_1779782898139": 10,
                "dept_noitru": 20,
                "dept_thpt": 20,
                "dept_thcs": 20,
                "dept_1779782090457": 10,
                "dept_tieuhoc": 20
            },
            "salary": 16755000,
            "name": "Nguyễn Duy Hoàng",
            "isMultiLevel": true,
            "deptId": "dept_1779782090457",
            "id": "emp_real_40"
        },
        {
            "salary": 8000000,
            "id": "emp_real_41",
            "deptId": "dept_tuyensinh",
            "isMultiLevel": false,
            "name": "Lê Thị Thảo Nguyên"
        },
        {
            "id": "emp_real_42",
            "deptId": "dept_tieuhoc",
            "isMultiLevel": false,
            "name": "Tô Thị Huệ",
            "salary": 7366667
        },
        {
            "salary": 6600000,
            "ratios": {
                "dept_bep": 0,
                "dept_anninh": 0,
                "dept_tongvu": 0,
                "dept_1779782090457": 0,
                "dept_noitru": 20,
                "dept_1779781275635": 0,
                "dept_1779782898139": 20,
                "dept_sachdep": 0,
                "dept_truyenthong": 0,
                "dept_bgh": 0,
                "dept_thcs": 0,
                "dept_tuyensinh": 20,
                "dept_thpt": 0,
                "dept_1779722697629": 0,
                "dept_tieuhoc": 20,
                "dept_bdh": 0,
                "dept_hckt": 20
            },
            "deptId": "dept_hckt",
            "isMultiLevel": true,
            "id": "emp_real_43",
            "name": "Lê Thị Linh"
        },
        {
            "salary": 10000000,
            "name": "Trần Công Thìn",
            "isMultiLevel": false,
            "deptId": "dept_truyenthong",
            "id": "emp_real_44"
        },
        {
            "id": "emp_real_45",
            "isMultiLevel": true,
            "deptId": "dept_bdh",
            "name": "Lê Triều Vũ",
            "ratios": {
                "dept_sachdep": 0,
                "dept_truyenthong": 20,
                "dept_bgh": 0,
                "dept_noitru": 10,
                "dept_1779781275635": 0,
                "dept_1779782898139": 10,
                "dept_1779782090457": 10,
                "dept_bep": 0,
                "dept_anninh": 0,
                "dept_tongvu": 20,
                "dept_tieuhoc": 0,
                "dept_bdh": 20,
                "dept_hckt": 0,
                "dept_thpt": 0,
                "dept_1779722697629": 0,
                "dept_thcs": 0,
                "dept_tuyensinh": 10
            },
            "salary": 10000000
        },
        {
            "id": "emp_real_46",
            "deptId": "dept_bdh",
            "isMultiLevel": true,
            "name": "Trần Nguyễn Thùy Trang",
            "ratios": {
                "dept_sachdep": 0,
                "dept_bgh": 0,
                "dept_truyenthong": 0,
                "dept_1779781275635": 0,
                "dept_noitru": 0,
                "dept_1779782898139": 0,
                "dept_1779782090457": 20,
                "dept_bep": 0,
                "dept_anninh": 0,
                "dept_tongvu": 0,
                "dept_tieuhoc": 30,
                "dept_bdh": 10,
                "dept_hckt": 0,
                "dept_thpt": 10,
                "dept_1779722697629": 0,
                "dept_thcs": 30,
                "dept_tuyensinh": 0
            },
            "salary": 17000000
        },
        {
            "salary": 25000000,
            "deptId": "dept_bdh",
            "isMultiLevel": false,
            "id": "emp_real_47",
            "name": "Đỗ Thanh Tùng"
        },
        {
            "salary": 12000000,
            "ratios": {
                "dept_1779781275635": 0,
                "dept_noitru": 10,
                "dept_1779782898139": 20,
                "dept_truyenthong": 0,
                "dept_bgh": 0,
                "dept_sachdep": 20,
                "dept_tongvu": 0,
                "dept_bep": 20,
                "dept_anninh": 0,
                "dept_1779782090457": 0,
                "dept_1779722697629": 0,
                "dept_thpt": 0,
                "dept_hckt": 0,
                "dept_bdh": 20,
                "dept_tieuhoc": 10,
                "dept_tuyensinh": 0,
                "dept_thcs": 0
            },
            "id": "emp_real_48",
            "deptId": "dept_hckt",
            "isMultiLevel": true,
            "name": "Lê Thị Ngọc Quỳnh"
        },
        {
            "ratios": {
                "dept_1779782090457": 0,
                "dept_tongvu": 0,
                "dept_anninh": 0,
                "dept_bep": 0,
                "dept_truyenthong": 0,
                "dept_bgh": 0,
                "dept_sachdep": 0,
                "dept_1779782898139": 0,
                "dept_1779781275635": 0,
                "dept_noitru": 0,
                "dept_tuyensinh": 0,
                "dept_thcs": 45,
                "dept_hckt": 0,
                "dept_bdh": 0,
                "dept_tieuhoc": 45,
                "dept_thpt": 10,
                "dept_1779722697629": 0
            },
            "salary": 0,
            "isMultiLevel": true,
            "deptId": "dept_1779782090457",
            "id": "emp_real_49",
            "name": "Đào Thu Hà"
        },
        {
            "deptId": "dept_noitru",
            "isMultiLevel": true,
            "id": "emp_real_50",
            "name": "Phạm Thị Thu Hà",
            "salary": 7890000,
            "ratios": {
                "dept_bdh": 0,
                "dept_tieuhoc": 0,
                "dept_hckt": 0,
                "dept_1779722697629": 0,
                "dept_thpt": 0,
                "dept_thcs": 0,
                "dept_tuyensinh": 0,
                "dept_sachdep": 0,
                "dept_truyenthong": 0,
                "dept_bgh": 0,
                "dept_1779782898139": 0,
                "dept_1779781275635": 0,
                "dept_noitru": 60,
                "dept_1779782090457": 40,
                "dept_anninh": 0,
                "dept_bep": 0,
                "dept_tongvu": 0
            }
        },
        {
            "name": "Trần Thị Kim Thoa",
            "id": "emp_real_51",
            "isMultiLevel": false,
            "deptId": "dept_thpt",
            "salary": 10140000
        },
        {
            "ratios": {
                "dept_1779782090457": 0,
                "dept_tongvu": 0,
                "dept_anninh": 0,
                "dept_bep": 0,
                "dept_bgh": 0,
                "dept_truyenthong": 0,
                "dept_sachdep": 0,
                "dept_1779782898139": 0,
                "dept_noitru": 0,
                "dept_1779781275635": 0,
                "dept_tuyensinh": 30,
                "dept_thcs": 0,
                "dept_hckt": 70,
                "dept_bdh": 0,
                "dept_tieuhoc": 0,
                "dept_thpt": 0,
                "dept_1779722697629": 0
            },
            "salary": 9000000,
            "name": "Nguyễn Thị Hải Yến",
            "isMultiLevel": true,
            "deptId": "dept_hckt",
            "id": "emp_real_52"
        },
        {
            "salary": 6310000,
            "name": "Lương Hồng Loan",
            "deptId": "dept_hckt",
            "isMultiLevel": false,
            "id": "emp_real_53"
        },
        {
            "salary": 3034615,
            "name": "Phạm Văn Quyết",
            "isMultiLevel": false,
            "deptId": "dept_anninh",
            "id": "emp_real_54"
        },
        {
            "salary": 3150000,
            "name": "Nguyễn Minh Lộc",
            "id": "emp_real_55",
            "deptId": "dept_anninh",
            "isMultiLevel": false
        },
        {
            "id": "emp_real_56",
            "isMultiLevel": false,
            "deptId": "dept_truyenthong",
            "name": "Trần Công Thìn",
            "salary": 2600000
        },
        {
            "salary": 2520000,
            "name": "Nguyễn Thị Yên",
            "isMultiLevel": false,
            "deptId": "dept_thpt",
            "id": "emp_real_57"
        },
        {
            "salary": 4920000,
            "isMultiLevel": false,
            "deptId": "dept_thpt",
            "id": "emp_real_58",
            "name": "Hoàng Thị Hương"
        },
        {
            "id": "emp_real_59",
            "deptId": "dept_thpt",
            "isMultiLevel": false,
            "name": "Bùi Thị Kim Thoa",
            "salary": 5640000
        },
        {
            "name": "Trần Văn Đồng",
            "id": "emp_real_60",
            "isMultiLevel": false,
            "deptId": "dept_thpt",
            "salary": 3835000
        },
        {
            "salary": 3000000,
            "deptId": "dept_tieuhoc",
            "isMultiLevel": false,
            "id": "emp_real_61",
            "name": "Nguyễn Phương Thảo"
        },
        {
            "salary": 3600000,
            "id": "emp_real_62",
            "isMultiLevel": false,
            "deptId": "dept_thcs",
            "name": "Đồng Thị Nghiệp"
        },
        {
            "salary": 4380000,
            "id": "emp_real_63",
            "isMultiLevel": false,
            "deptId": "dept_thpt",
            "name": "Vũ Thị Phượng"
        },
        {
            "id": "emp_real_64",
            "isMultiLevel": true,
            "deptId": "dept_1779782090457",
            "name": "Phạm Quang Hưng",
            "salary": 6240000,
            "ratios": {
                "dept_1779782898139": 0,
                "dept_1779781275635": 0,
                "dept_noitru": 0,
                "dept_truyenthong": 0,
                "dept_bgh": 0,
                "dept_sachdep": 0,
                "dept_tongvu": 0,
                "dept_anninh": 0,
                "dept_bep": 0,
                "dept_1779782090457": 0,
                "dept_1779722697629": 0,
                "dept_thpt": 10,
                "dept_hckt": 0,
                "dept_bdh": 0,
                "dept_tieuhoc": 45,
                "dept_tuyensinh": 0,
                "dept_thcs": 45
            }
        },
        {
            "name": "Phạm Thanh Dịu",
            "isMultiLevel": false,
            "deptId": "dept_noitru",
            "id": "emp_real_65",
            "salary": 4900000
        },
        {
            "name": "Nguyễn Tiến Hùng",
            "id": "emp_1779956355235",
            "deptId": "dept_noitru",
            "isMultiLevel": true,
            "salary": 10000000,
            "ratios": {
                "dept_noitru": 50,
                "dept_1779782090457": 30,
                "dept_bdh": 20
            }
        },
        {
            "ratios": {
                "dept_noitru": 5000000,
                "dept_1779781275635": 0,
                "dept_1779782898139": 3000000,
                "dept_sachdep": 0,
                "dept_bgh": 0,
                "dept_truyenthong": 0,
                "dept_bep": 0,
                "dept_anninh": 0,
                "dept_tongvu": 0,
                "dept_1779782090457": 0,
                "dept_thpt": 0,
                "dept_1779722697629": 1000000,
                "dept_bdh": 0,
                "dept_tieuhoc": 0,
                "dept_hckt": 0,
                "dept_thcs": 0,
                "dept_tuyensinh": 0
            },
            "salary": 9000000,
            "id": "emp_1779956585967",
            "deptId": "dept_noitru",
            "isMultiLevel": true,
            "allocationMode": "amount",
            "name": "Trần Thị Thoa"
        }
    ],
    "simulation": {
        "fillRates": {
            "dept_thcs": 55,
            "dept_thpt": 55,
            "dept_tieuhoc": 36,
            "dept_noitru": 58
        },
        "active": false,
        "tuition": {
            "dept_thpt_xanh": 1560000,
            "dept_tieuhoc_xanh": 3000000,
            "dept_thcs_xanh": 3000000,
            "dept_thpt_thuong": 1300000,
            "dept_tieuhoc_thuong": 2000000,
            "dept_noitru": 2000000,
            "dept_thcs_thuong": 2000000
        },
        "fillRate": 17
    },
    "drivers": {
        "student_count": {
            "dept_noitru": 0,
            "dept_tieuhoc": 45,
            "dept_thpt": 147,
            "dept_thcs": 55
        },
        "revenue_share": {
            "dept_tieuhoc": 29.75206611570248,
            "dept_thcs": 23.96694214876033,
            "dept_thpt": 35.12396694214876,
            "dept_noitru": 11.15702479338843
        },
        "area_m2": {
            "dept_noitru": 148,
            "dept_thpt": 870.8800000000001,
            "dept_thcs": 650.56,
            "dept_tieuhoc": 770.56
        },
        "staff_count": {
            "dept_noitru": 4,
            "dept_tieuhoc": 7.8,
            "dept_thpt": 7.300000000000001,
            "dept_thcs": 8.9
        },
        "meals": {
            "dept_thpt": 132,
            "dept_thcs": 50,
            "dept_tieuhoc": 41,
            "dept_noitru": 42
        },
        "new_students": {
            "dept_tieuhoc": 40,
            "dept_thpt": 50,
            "dept_thcs": 30,
            "dept_noitru": 0
        },
        "custom_percent": {
            "dept_1779782898139": {
                "dept_thpt": 10,
                "dept_tieuhoc": 45,
                "dept_thcs": 45,
                "dept_noitru": 0
            },
            "dept_1779781275635": {
                "dept_thpt": 33,
                "dept_thcs": 33,
                "dept_tieuhoc": 34,
                "dept_noitru": 0
            },
            "dept_sachdep": {
                "dept_noitru": 5,
                "dept_thpt": 35,
                "dept_thcs": 30,
                "dept_tieuhoc": 30
            },
            "dept_truyenthong": {
                "dept_noitru": 5,
                "dept_thpt": 15,
                "dept_thcs": 40,
                "dept_tieuhoc": 40
            },
            "dept_bgh": {
                "dept_noitru": 0,
                "dept_thcs": 15,
                "dept_tieuhoc": 40,
                "dept_thpt": 45
            },
            "dept_anninh": {
                "dept_thpt": 30,
                "dept_tieuhoc": 30,
                "dept_thcs": 30,
                "dept_noitru": 10
            },
            "dept_bep": {
                "dept_thpt": 25,
                "dept_thcs": 25,
                "dept_tieuhoc": 25,
                "dept_noitru": 25
            },
            "dept_tongvu": {
                "dept_noitru": 12,
                "dept_thpt": 30,
                "dept_thcs": 30,
                "dept_tieuhoc": 30
            },
            "dept_1779782090457": {
                "dept_thpt": 20,
                "dept_thcs": 40,
                "dept_tieuhoc": 40,
                "dept_noitru": 0
            },
            "dept_1779722697629": {
                "dept_tieuhoc": 30,
                "dept_thpt": 30,
                "dept_thcs": 30,
                "dept_noitru": 10
            },
            "dept_bdh": {
                "dept_thcs": 40,
                "dept_thpt": 15,
                "dept_tieuhoc": 40,
                "dept_noitru": 5
            },
            "dept_hckt": {
                "dept_tieuhoc": 32,
                "dept_thpt": 32,
                "dept_thcs": 32,
                "dept_noitru": 0
            },
            "dept_tuyensinh": {
                "dept_noitru": 5,
                "dept_thpt": 15,
                "dept_thcs": 40,
                "dept_tieuhoc": 40
            }
        }
    },
    "revenues": {
        "dept_noitru": 81000000,
        "dept_tieuhoc": 112500000,
        "dept_thcs": 112500000,
        "dept_thpt": 165000000
    },
    "landlordRent": 223100000,
    "aprilSalaryUpdated": true,
    "boardingNotes": {
        "ratioNote": "- BGH & Ban Điều hành (BĐH): Định mức đề xuất (0% - 5%) nhằm phản ánh đúng tập trung chuyên môn cốt lõi vào chương trình chính khóa.\n- Tuyển sinh & Truyền thông: Định mức đề xuất (2% - 5%) do hoạt động tuyển sinh nội trú là dịch vụ tích hợp đi kèm.\n- Hành chính Kế toán (HCKT): Định mức đề xuất (3% - 5%) tương ứng với tần suất giao dịch và quản lý học phí thực tế.\n- Tổng vụ (Cơ sở vật chất): Định mức đề xuất (8% - 12%) để bù đắp hao mòn vận hành và công tác trực ca ngoài giờ.",
        "facilityNote": "- Phương pháp phân bổ trực tiếp: Nhằm phản ánh chính xác diện tích sử dụng thực tế của khối Nội trú (chỉ gồm 4 phòng).\n- Hướng dẫn cấu hình: Truy cập tab \"Mặt bằng & Phòng học\", nhấp nút \"Sửa tỷ lệ %\" tại 4 phòng nội trú và gán đúng 100% tỷ lệ gánh chi phí cho khối Nội trú.\n- L���i ích: Khối Nội trú tự chịu trách nhiệm tài chính trọn vẹn trên đúng phạm vi cơ sở vật chất thực tế đang vận hành."
    },
    "utilityCosts": {
        "dept_nuoc": 10000000,
        "dept_dien": 28000000
    }
};


let appState = {};

// Ensure state has all required keys and schema additions
function ensureStateCompatibility(state) {
    if (!state) return;
    
    // Một lần duy nhất cập nhật danh sách lương 65 nhân sự chính thức tháng 4 từ Excel
    if (!state.aprilSalaryUpdated) {
        state.employees = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE.employees));
        state.aprilSalaryUpdated = true;
    }
    
    // Backup compatibility checks for new keys
    if (!state.rentBlocks) state.rentBlocks = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE.rentBlocks));
    if (!state.rooms) state.rooms = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE.rooms));
    if (!state.drivers || !state.drivers.custom_percent) {
        state.drivers = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE.drivers));
    }
    if (!state.utilityCosts) {
        state.utilityCosts = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE.utilityCosts));
    }
    if (!state.boardingNotes) {
        state.boardingNotes = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE.boardingNotes));
    }
    
    // Sync new departments (like utility depts) from template if they don't exist
    DEFAULT_TEMPLATE.departments.forEach(defaultDept => {
        const exists = state.departments.find(d => d.id === defaultDept.id);
        if (!exists) {
            state.departments.push(JSON.parse(JSON.stringify(defaultDept)));
        }
    });
    
    // Ensure student counts are sync'd for direct depts
    state.departments.forEach(dept => {
        if (dept.type === "revenue" && dept.students === undefined) {
            const defaultDept = DEFAULT_TEMPLATE.departments.find(d => d.id === dept.id);
            dept.students = defaultDept ? defaultDept.students : 0;
        }
    });

    // Đảm bảo khởi tạo kịch bản giả lập What-If lấp đầy phòng học
    if (!state.simulation) {
        state.simulation = {
            active: false,
            fillRate: 80,
            fillRates: {
                "dept_tieuhoc": getActualFillRateForDept("dept_tieuhoc"),
                "dept_thcs": getActualFillRateForDept("dept_thcs"),
                "dept_thpt": getActualFillRateForDept("dept_thpt"),
                "dept_noitru": getActualFillRateForDept("dept_noitru")
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
        if (!state.simulation.fillRates) {
            state.simulation.fillRates = {
                "dept_tieuhoc": getActualFillRateForDept("dept_tieuhoc"),
                "dept_thcs": getActualFillRateForDept("dept_thcs"),
                "dept_thpt": getActualFillRateForDept("dept_thpt"),
                "dept_noitru": getActualFillRateForDept("dept_noitru")
            };
        } else {
            // Tự động chuyển đổi nếu tất cả tỷ lệ đang là 80% (mặc định cũ trong localStorage)
            const allEighty = Object.values(state.simulation.fillRates).every(v => Number(v) === 80);
            if (allEighty) {
                state.simulation.fillRates = {
                    "dept_tieuhoc": getActualFillRateForDept("dept_tieuhoc"),
                    "dept_thcs": getActualFillRateForDept("dept_thcs"),
                    "dept_thpt": getActualFillRateForDept("dept_thpt"),
                    "dept_noitru": getActualFillRateForDept("dept_noitru")
                };
            }
        }
        if (!state.simulation.tuition || !state.simulation.tuition.dept_tieuhoc_thuong) {
            const oldTuition = state.simulation.tuition || {};
            state.simulation.tuition = {
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
    if (state.rooms) {
        state.rooms.forEach(room => {
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
    if (!state.landlordRent) {
        state.landlordRent = 223100000;
    }
}

// Load state from local storage or default template
function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            appState = JSON.parse(saved);
            ensureStateCompatibility(appState);
            saveStateLocalOnly(); // Lưu lại cấu hình tương thích vừa sửa đổi
        } catch (e) {
            console.error("Failed to parse saved state, resetting...", e);
            appState = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE));
            ensureStateCompatibility(appState);
        }
    } else {
        appState = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE));
        ensureStateCompatibility(appState);
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
    customConfirm("Bạn có chắc chắn muốn khôi phục dữ liệu mẫu ban đầu của Xanh Tuệ Đức? Toàn bộ các thay đổi hiện tại của bạn sẽ bị xóa.", () => {
        appState = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE));
        saveState();
        initApp();
        setTimeout(() => alert("Khôi phục dữ liệu mẫu thành công!"), 100);
    });
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

function getSimulatedStudentsMapForDept(deptId, fillRate) {
    const map = {};
    if (!appState.rooms) return map;
    
    // 1. Lấy danh sách các phòng học thường đang hoạt động thuộc khối này
    const deptRooms = appState.rooms.filter(room => 
        room.status === "active" && 
        room.type !== "functional" && 
        room.splits && 
        (room.splits[deptId] || 0) > 0
    );
    
    let totalCapacity = 0;
    let totalActual = 0;
    let totalRemaining = 0;
    
    const roomDetails = deptRooms.map(room => {
        const splitRatio = room.splits[deptId] || 0;
        const ratio = splitRatio / 100;
        const capacity = (room.capacity || 0) * ratio;
        const actual = (room.currentStudents || 0) * ratio;
        const remaining = Math.max(0, capacity - actual);
        
        totalCapacity += capacity;
        totalActual += actual;
        totalRemaining += remaining;
        
        return {
            id: room.id,
            actual,
            capacity,
            remaining
        };
    });
    
    const totalTarget = Math.round(totalCapacity * (fillRate / 100));
    const diff = totalTarget - totalActual;
    
    let allocatedSum = 0;
    
    roomDetails.forEach(rd => {
        let simulated = rd.actual;
        if (diff > 0 && totalRemaining > 0) {
            // Tăng trưởng: Phân phối số học sinh cần thêm tỉ lệ thuận theo SỨC CHỨA CÒN TRỐNG của từng phòng
            simulated += diff * (rd.remaining / totalRemaining);
        } else if (diff < 0 && totalActual > 0) {
            // Thu hẹp: Giảm sĩ số tỉ lệ thuận theo số lượng học sinh thực tế đang có
            simulated += diff * (rd.actual / totalActual);
        }
        
        simulated = Math.max(0, Math.min(rd.capacity, simulated));
        map[rd.id] = simulated;
        allocatedSum += simulated;
    });
    
    // Điều chỉnh sai số làm tròn để tổng sĩ số các phòng khớp chính xác với mục tiêu
    const targetDiff = totalTarget - Math.round(allocatedSum);
    if (targetDiff !== 0 && deptRooms.length > 0) {
        const adjRoom = deptRooms[0];
        if (adjRoom) {
            const maxCapShare = adjRoom.capacity * ((adjRoom.splits[deptId] || 0) / 100);
            map[adjRoom.id] = Math.max(0, Math.min(maxCapShare, (map[adjRoom.id] || 0) + targetDiff));
        }
    }
    
    return map;
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
                "dept_tieuhoc": getActualFillRateForDept("dept_tieuhoc"),
                "dept_thcs": getActualFillRateForDept("dept_thcs"),
                "dept_thpt": getActualFillRateForDept("dept_thpt"),
                "dept_noitru": getActualFillRateForDept("dept_noitru")
            };
        }
        
        Object.keys(studentCounts).forEach(did => {
            const targetFillRate = appState.simulation.fillRates[did] !== undefined ? appState.simulation.fillRates[did] : 80;
            const simMap = getSimulatedStudentsMapForDept(did, targetFillRate);
            let deptSum = 0;
            Object.values(simMap).forEach(v => {
                deptSum += v;
            });
            studentCounts[did] = Math.round(deptSum);
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
    let actualStudents = 0;
    
    const dept = appState.departments ? appState.departments.find(d => d.id === deptId) : null;
    actualStudents = dept ? (dept.students || 0) : 0;

    if (appState.rooms) {
        appState.rooms.forEach(room => {
            if (room && room.status === "active" && room.type !== "functional" && room.splits) {
                const splitRatio = room.splits[deptId] || 0;
                if (splitRatio > 0) {
                    const ratio = splitRatio / 100;
                    maxCapacity += (room.capacity || 0) * ratio;
                }
            }
        });
    }

    console.log(`[getActualFillRateForDept] dept: ${deptId}, students: ${actualStudents}, maxCapacity: ${maxCapacity}`);

    if (maxCapacity > 0) {
        return Math.max(0, Math.min(100, Math.round((actualStudents / maxCapacity) * 100)));
    }
    
    // Realistic fallbacks based on original default dataset:
    if (deptId === "dept_tieuhoc") return 26; // 45 students / 176 capacity
    if (deptId === "dept_thcs") return 25; // 55 students / 220 capacity
    if (deptId === "dept_thpt") return 56; // 147 students / 264 capacity
    if (deptId === "dept_noitru") return 23; // 42 students / 180 capacity
    
    return 80;
}

function getSimulatedRevenueForDept(deptId) {
    if (!appState.simulation || !appState.simulation.active) return 0;
    
    let totalRevenue = 0;
    const fillRate = appState.simulation.fillRates?.[deptId] !== undefined 
        ? appState.simulation.fillRates[deptId] 
        : (appState.simulation.fillRate || 80);
        
    const simMap = getSimulatedStudentsMapForDept(deptId, fillRate);
        
    appState.rooms.forEach(room => {
        if (room.status === "active" && room.type !== "functional") {
            const splitRatio = room.splits[deptId] || 0;
            if (splitRatio > 0) {
                const roomSimStudents = simMap[room.id] || 0;
                
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

// Tính doanh thu thực tế từ số HS thực tế trong từng phòng × học phí theo hệ
function calculateActualRevenueForDept(deptId) {
    const tuition = appState.simulation?.tuition || {};
    let totalRevenue = 0;

    (appState.rooms || []).forEach(room => {
        if (room.status === "active" && room.type !== "functional") {
            const splitRatio = room.splits?.[deptId] || 0;
            if (splitRatio > 0) {
                const actualStudents = (room.currentStudents || 0) * (splitRatio / 100);

                let isXanh = (room.system === "xanh");
                if (deptId === "dept_tieuhoc" || deptId === "dept_thcs") {
                    isXanh = true;
                }
                const tuitionKey = `${deptId}_${isXanh ? 'xanh' : 'thuong'}`;
                const tuitionRate = tuition[tuitionKey] !== undefined
                    ? tuition[tuitionKey]
                    : (tuition[deptId] || 0);

                totalRevenue += actualStudents * tuitionRate;
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
        if (room.status === "active" && room.splits) {
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
    // Tự động tổng hợp động sỹ số học sinh của các khối trực tiếp (dept.students) từ các phòng học đang sử dụng
    if (appState.departments && appState.rooms) {
        appState.departments.forEach(dept => {
            if (dept.type === "revenue") {
                dept.students = appState.rooms.reduce((sum, room) => {
                    if (room && room.status === "active" && room.type !== "functional" && room.splits) {
                        const splitRatio = room.splits[dept.id] || 0;
                        if (splitRatio > 0) {
                            return sum + Math.round((room.currentStudents || 0) * (splitRatio / 100));
                        }
                    }
                    return sum;
                }, 0);
            }
        });
    }

    // Automatically keep simulation fill rates in sync with actual fill rates if simulation is inactive
    if (appState.simulation && !appState.simulation.active) {
        appState.simulation.fillRates = {
            "dept_tieuhoc": getActualFillRateForDept("dept_tieuhoc"),
            "dept_thcs": getActualFillRateForDept("dept_thcs"),
            "dept_thpt": getActualFillRateForDept("dept_thpt"),
            "dept_noitru": getActualFillRateForDept("dept_noitru")
        };
    }

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
        directInsurance: {},
        directRent: {},
        indirectSalary: {},
        indirectInsurance: {},
        indirectRent: {},
        allocatedCosts: {},
        allocatedUtilityCosts: {},
        allocatedDetails: {},
        allocatedSalaryCosts: {},
        allocatedRentCosts: {},
        totalIndirectSalaryAllocated: {},
        totalIndirectInsuranceAllocated: {},
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
        result.directInsurance[d.id] = 0;
        result.directRent[d.id] = 0;
        result.totalIndirectSalaryAllocated[d.id] = 0;
        result.totalIndirectInsuranceAllocated[d.id] = 0;
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
        result.indirectInsurance[d.id] = 0;
        result.indirectRent[d.id] = 0;
        result.departmentTotalCosts[d.id] = 0;
    });

    // ==========================================
    // BƯỚC 1 & 2: PHÂN BỔ LƯƠNG NHÂN SỰ
    // ==========================================
    appState.employees.forEach(emp => {
        const empInsurance = emp.insurance || 0;
        if (emp.isMultiLevel && emp.ratios) {
            const isAmountMode = emp.allocationMode === "amount";
            if (isAmountMode) {
                // Direct amount allocation in VND
                Object.keys(emp.ratios).forEach(deptId => {
                    const allocatedSalary = emp.ratios[deptId] || 0;
                    if (allocatedSalary > 0) {
                        const ratio = emp.salary > 0 ? (allocatedSalary / emp.salary) : 0;
                        const allocatedInsurance = empInsurance * ratio;
                        const dept = appState.departments.find(d => d.id === deptId);
                        if (dept) {
                            if (dept.type === "revenue") {
                                result.directSalary[deptId] += allocatedSalary;
                                result.directInsurance[deptId] += allocatedInsurance;
                            } else {
                                result.indirectSalary[deptId] += allocatedSalary;
                                result.indirectInsurance[deptId] += allocatedInsurance;
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

                // Allocate multi-level/kiêm nhiệm employee salary & insurance across any departments based on weights
                Object.keys(emp.ratios).forEach(deptId => {
                    const ratioVal = emp.ratios[deptId] || 0;
                    if (ratioVal > 0 && totalRatio > 0) {
                        const ratio = ratioVal / totalRatio;
                        const allocatedSalary = emp.salary * ratio;
                        const allocatedInsurance = empInsurance * ratio;
                        const dept = appState.departments.find(d => d.id === deptId);
                        if (dept) {
                            if (dept.type === "revenue") {
                                result.directSalary[deptId] += allocatedSalary;
                                result.directInsurance[deptId] += allocatedInsurance;
                            } else {
                                result.indirectSalary[deptId] += allocatedSalary;
                                result.indirectInsurance[deptId] += allocatedInsurance;
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
                    result.directInsurance[emp.deptId] += empInsurance;
                } else {
                    result.indirectSalary[emp.deptId] += emp.salary;
                    result.indirectInsurance[emp.deptId] += empInsurance;
                }
            }
        }
    });

    // ==========================================
    // BƯỚC 3: DYNAMIC ROOMS TO BLOCKS RENT ALLOCATION
    // ==========================================
    // 1. Count rooms and sum custom rents per block
    const blockRoomCounts = {};
    const blockCustomRentSums = {};
    const blockUnallocatedCounts = {};

    appState.rentBlocks.forEach(blk => {
        blockRoomCounts[blk.id] = 0;
        blockCustomRentSums[blk.id] = 0;
        blockUnallocatedCounts[blk.id] = 0;
    });

    appState.rooms.forEach(room => {
        if (blockRoomCounts[room.blockId] !== undefined) {
            blockRoomCounts[room.blockId]++;
            if (room.customRent !== undefined && room.customRent !== null && !isNaN(room.customRent)) {
                blockCustomRentSums[room.blockId] += room.customRent;
            } else {
                blockUnallocatedCounts[room.blockId]++;
            }
        }
    });

    // 2. Calculate dynamic room rent and allocate it to departments
    appState.rooms.forEach(room => {
        const block = appState.rentBlocks.find(b => b.id === room.blockId);
        if (!block) return;

        let roomRent = 0;
        if (room.customRent !== undefined && room.customRent !== null && !isNaN(room.customRent)) {
            roomRent = room.customRent;
        } else {
            const totalRent = block.totalRent || 0;
            const customSum = blockCustomRentSums[block.id] || 0;
            const unallocatedCount = blockUnallocatedCounts[block.id] || 0;
            const remainingRent = Math.max(0, totalRent - customSum);
            roomRent = unallocatedCount > 0 ? remainingRent / unallocatedCount : 0;
        }
        
        room.calculatedRent = roomRent; // Stash for other views to use

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
        result.departmentTotalCosts[sd.id] = result.indirectSalary[sd.id] + result.indirectInsurance[sd.id] + result.indirectRent[sd.id];
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
            const allocatedInsurance = result.indirectInsurance[sd.id] * ratio;
            const allocatedRent = result.indirectRent[sd.id] * ratio;

            result.allocatedCosts[rd.id][sd.id] = allocatedVal;
            result.allocatedSalaryCosts[rd.id][sd.id] = allocatedSalary;
            result.allocatedRentCosts[rd.id][sd.id] = allocatedRent;

            result.totalIndirectSalaryAllocated[rd.id] += allocatedSalary;
            result.totalIndirectInsuranceAllocated[rd.id] += allocatedInsurance;
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
        const rdDirectCost = result.directSalary[rd.id] + result.directInsurance[rd.id] + result.directRent[rd.id];
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

function openProblemsModal() {
    document.getElementById("problems_walkthrough_modal").classList.add("open");
}

function goToProblemSolution(tabId, extraAction) {
    // 1. Close modal
    closeModal('problems_walkthrough_modal');
    
    // 2. Switch tab
    switchTab(tabId);
    
    // 3. Perform extra actions based on specific problem
    if (extraAction === 'simulation') {
        switchScenarioMode('simulation');
        setTimeout(() => {
            const el = document.getElementById('simulation_controls_panel');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
    } else if (extraAction === 'pnl_table') {
        switchScenarioMode('actual');
        setTimeout(() => {
            const el = document.getElementById('pnl_table_card');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
    } else if (extraAction === 'empty_rooms') {
        setTimeout(() => {
            switchFacilitySubtab('subtab_rooms');
            const selectEl = document.getElementById('filter_room_status');
            if (selectEl) {
                selectEl.value = 'empty';
                if (typeof filterRoomsList === 'function') {
                    filterRoomsList();
                }
            }
            if (selectEl) selectEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
    }
}

// 3.1 RENDERING VIEW: DASHBOARD & P&L
let dashboardChart = null;
let dashboardChartSim = null;

function renderDashboard() {
    const data = runAllocation() || {};

    // Đồng bộ giao diện giả lập What-If để luôn hiển thị khớp với appState thực tế (kể cả khi đồng bộ đám mây)
    updateSimulationUI();

    // Render KPI Values
    const totalSalary = (appState.employees || []).reduce((acc, curr) => acc + (curr.salary || 0) + (curr.insurance || 0), 0);
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

    // SECTION I.B: CHI PHÍ BẢO HIỂM XÃ HỘI
    plBody.innerHTML += `<tr style="font-weight: 600; color: #FFF; background: rgba(52, 199, 89, 0.02)">
        <td colspan="${revenueDepts.length + 2}">I.B. CHI PHÍ BẢO HIỂM XÃ HỘI (BHXH, BHYT...)</td>
    </tr>`;

    // Row I.B.1: Bảo hiểm trực tiếp
    let insuranceDirectHtml = `<tr>
        <td style="padding-left: 24px;">1. Bảo hiểm Nhân sự Trực tiếp (Kế toán điền tay)</td>`;
    revenueDepts.forEach(rd => {
        insuranceDirectHtml += `<td class="text-right">${formatCurrency(data.directInsurance?.[rd.id] || 0)}</td>`;
    });
    const sumDirectInsurance = Object.values(data.directInsurance || {}).reduce((a, b) => a + b, 0);
    insuranceDirectHtml += `<td class="text-right text-muted">${formatCurrency(sumDirectInsurance)}</td></tr>`;
    plBody.innerHTML += insuranceDirectHtml;

    // Row I.B.2: Bảo hiểm gián tiếp phân bổ
    let insuranceIndirectHtml = `<tr>
        <td style="padding-left: 24px;">2. Chi phí Bảo hiểm Gián tiếp Phân bổ</td>`;
    revenueDepts.forEach(rd => {
        const val = data.totalIndirectInsuranceAllocated?.[rd.id] || 0;
        insuranceIndirectHtml += `<td class="text-right">${formatCurrency(val)}</td>`;
    });
    const sumIndirectInsurance = Object.values(data.totalIndirectInsuranceAllocated || {}).reduce((a, b) => a + b, 0);
    insuranceIndirectHtml += `<td class="text-right text-muted">${formatCurrency(sumIndirectInsurance)}</td></tr>`;
    plBody.innerHTML += insuranceIndirectHtml;

    // Row I.B.3: TỔNG CHI PHÍ BẢO HIỂM
    let totalInsuranceHtml = `<tr class="pl-row-subtotal">
        <td>➔ TỔNG CHI PHÍ BẢO HIỂM HỢP NHẤT</td>`;
    revenueDepts.forEach(rd => {
        const sum = (data.directInsurance?.[rd.id] || 0) + (data.totalIndirectInsuranceAllocated?.[rd.id] || 0);
        totalInsuranceHtml += `<td class="text-right">${formatCurrency(sum)}</td>`;
    });
    const overallInsurance = sumDirectInsurance + sumIndirectInsurance;
    totalInsuranceHtml += `<td class="text-right">${formatCurrency(overallInsurance)}</td></tr>`;
    plBody.innerHTML += totalInsuranceHtml;


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

    // Helper function to create standard configuration to avoid code duplication and conflicts
    function createConfig() {
        return {
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
                layout: { padding: { top: 30 } },
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
                        min: 0,
                        beginAtZero: true,
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
                            let rectY = barTopY - 26; // Float elegantly 26px above the tallest bar
                            // Giới hạn: không cho nhãn nhảy lên trên vùng chart
                            const chartTop = chart.chartArea.top;
                            if (rectY < chartTop) rectY = chartTop;
                            
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
        };
    }

    // 1. Draw Main Dashboard Chart
    const canvas = document.getElementById("dashboard_chart");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        if (dashboardChart) {
            dashboardChart.destroy();
        }
        dashboardChart = new Chart(ctx, createConfig());
    }

    // 2. Draw Simulation Control Panel Live Chart
    const canvasSim = document.getElementById("dashboard_chart_sim");
    if (canvasSim) {
        if (dashboardChartSim) {
            dashboardChartSim.destroy();
        }
        if (isSim) {
            const ctxSim = canvasSim.getContext("2d");
            dashboardChartSim = new Chart(ctxSim, createConfig());
        }
    }
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
                    rawEmp: emp,
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
                    rawEmp: emp,
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
                        rawEmp: emp,
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
        <div style="font-size: 0.85rem; margin-bottom: 15px; color: var(--text-secondary);">
            Báo cáo chi tiết quỹ lương trực tiếp của khối <strong style="color: var(--text-primary);">${rd.name}</strong> sau khi đã cộng/trừ các khoản kiêm nhiệm:
        </div>
    `;

    // 1. Permanent Staff
    listHtml += `<h4 style="margin: 14px 0 8px 0; color: var(--text-primary); font-size: 0.85rem; text-transform: uppercase;"><i class="fa-solid fa-user-tie text-success" style="margin-right: 6px;"></i> 1. Nhân Sự Cơ Hữu Đơn Ban (100% gánh ở đây)</h4>`;
    if (permanentList.length === 0) {
        listHtml += `<div style="font-size:0.8rem; color: var(--text-secondary); padding-left: 20px; font-style: italic; margin-bottom: 10px;">Không có nhân sự cố định</div>`;
    } else {
        listHtml += `
            <table style="width: 100%; font-size: 0.78rem; border-collapse: collapse; margin-bottom: 20px; background: #FFF; border-radius: 10px; box-shadow: var(--shadow-sm); border: 1px solid var(--border-color); overflow: hidden;">
                <thead>
                    <tr style="background: #f8fafc; border-bottom: 1px solid var(--border-color); text-align: left;">
                        <th style="padding: 10px 12px; font-weight: 700; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Nhân sự</th>
                        <th style="padding: 10px 12px; font-weight: 700; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; text-align: center; width: 100px;">Loại hình</th>
                        <th style="padding: 10px 12px; font-weight: 700; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; text-align: right;">Lương gốc</th>
                        <th style="padding: 10px 12px; font-weight: 700; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; text-align: right; width: 130px;">Thực gánh</th>
                    </tr>
                </thead>
                <tbody>
        `;
        let sumPerm = 0;
        permanentList.forEach(emp => {
            sumPerm += emp.contribution;
            listHtml += `
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 10px 12px; font-weight: 600; color: var(--text-primary);">${getGlobalEmpTooltipHtml(emp.rawEmp)}</td>
                    <td style="padding: 10px 12px; text-align: center;"><span class="badge" style="font-size: 0.65rem; padding: 2px 6px; background: rgba(71, 85, 105, 0.08); color: var(--text-secondary); font-weight: 700; border-radius: 6px;">Cơ hữu</span></td>
                    <td style="padding: 10px 12px; text-align: right; color: var(--text-secondary);">${formatCurrency(emp.grossSalary)}</td>
                    <td style="padding: 10px 12px; text-align: right; font-weight: 700; color: var(--text-primary);">${formatCurrency(emp.contribution)}</td>
                </tr>
            `;
        });
        listHtml += `
                </tbody>
                <tfoot>
                    <tr style="background: #f8fafc; font-weight: bold; border-top: 1px solid var(--border-color);">
                        <td colspan="3" style="padding: 10px 12px; text-align: right; color: var(--text-secondary); font-size: 0.75rem;">Cộng nhóm (1):</td>
                        <td style="padding: 10px 12px; text-align: right; color: var(--text-primary); font-size: 0.85rem;">${formatCurrency(sumPerm)}</td>
                    </tr>
                </tfoot>
            </table>
        `;
    }

    // 2. Kiêm nhiệm chuyển đến
    listHtml += `<h4 style="margin: 14px 0 8px 0; color: var(--text-primary); font-size: 0.85rem; text-transform: uppercase;"><i class="fa-solid fa-circle-arrow-down text-primary" style="margin-right: 6px;"></i> 2. Nhân Sự Kiêm Nhiệm Chuyển Đến (Nhận thêm +)</h4>`;
    if (transferInList.length === 0) {
        listHtml += `<div style="font-size:0.8rem; color: var(--text-secondary); padding-left: 20px; font-style: italic; margin-bottom: 10px;">Không có nhân sự từ khối khác gánh chung</div>`;
    } else {
        listHtml += `
            <table style="width: 100%; font-size: 0.78rem; border-collapse: collapse; margin-bottom: 20px; background: #FFF; border-radius: 10px; box-shadow: var(--shadow-sm); border: 1px solid var(--border-color); overflow: hidden;">
                <thead>
                    <tr style="background: #f8fafc; border-bottom: 1px solid var(--border-color); text-align: left;">
                        <th style="padding: 10px 12px; font-weight: 700; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Nhân sự</th>
                        <th style="padding: 10px 12px; font-weight: 700; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; text-align: center; width: 100px;">Loại hình</th>
                        <th style="padding: 10px 12px; font-weight: 700; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Chi tiết công thức</th>
                        <th style="padding: 10px 12px; font-weight: 700; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; text-align: right; width: 130px;">Cộng thêm vào khối</th>
                    </tr>
                </thead>
                <tbody>
        `;
        let sumIn = 0;
        transferInList.forEach(emp => {
            sumIn += emp.contribution;
            listHtml += `
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 10px 12px; font-weight: 600; color: var(--text-primary);">
                        ${getGlobalEmpTooltipHtml(emp.rawEmp)}
                        <div style="font-size: 0.65rem; color: var(--text-secondary); font-weight: normal; margin-top: 2px; margin-left: 20px;">Gốc: ${emp.originDept}</div>
                    </td>
                    <td style="padding: 10px 12px; text-align: center;"><span class="badge" style="font-size: 0.65rem; padding: 2px 6px; background: rgba(16, 185, 129, 0.08); color: #059669; font-weight: 700; border-radius: 6px;">Kiêm nhiệm</span></td>
                    <td style="padding: 10px 12px; color: var(--text-secondary); font-size: 0.75rem;">Gánh <strong>${emp.sharePercent}%</strong> trên tổng lương ${formatCurrency(emp.grossSalary)}</td>
                    <td style="padding: 10px 12px; text-align: right; font-weight: 700; color: #059669;">+${formatCurrency(emp.contribution)}</td>
                </tr>
            `;
        });
        listHtml += `
                </tbody>
                <tfoot>
                    <tr style="background: #f8fafc; font-weight: bold; border-top: 1px solid var(--border-color);">
                        <td colspan="3" style="padding: 10px 12px; text-align: right; color: var(--text-secondary); font-size: 0.75rem;">Cộng nhóm (2):</td>
                        <td style="padding: 10px 12px; text-align: right; color: #059669; font-size: 0.85rem;">+${formatCurrency(sumIn)}</td>
                    </tr>
                </tfoot>
            </table>
        `;
    }

    // 3. Kiêm nhiệm chuyển đi
    listHtml += `<h4 style="margin: 14px 0 8px 0; color: var(--text-primary); font-size: 0.85rem; text-transform: uppercase;"><i class="fa-solid fa-circle-arrow-up text-warning" style="margin-right: 6px;"></i> 3. Nhân Sự Kiêm Nhiệm Chuyển Đi (Cắt giảm -)</h4>`;
    if (transferOutList.length === 0) {
        listHtml += `<div style="font-size:0.8rem; color: var(--text-secondary); padding-left: 20px; font-style: italic; margin-bottom: 10px;">Không có nhân sự nào của khối phải chia sẻ chi phí sang ban khác</div>`;
    } else {
        listHtml += `
            <table style="width: 100%; font-size: 0.78rem; border-collapse: collapse; margin-bottom: 20px; background: #FFF; border-radius: 10px; box-shadow: var(--shadow-sm); border: 1px solid var(--border-color); overflow: hidden;">
                <thead>
                    <tr style="background: #f8fafc; border-bottom: 1px solid var(--border-color); text-align: left;">
                        <th style="padding: 10px 12px; font-weight: 700; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Nhân sự</th>
                        <th style="padding: 10px 12px; font-weight: 700; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; text-align: center; width: 100px;">Loại hình</th>
                        <th style="padding: 10px 12px; font-weight: 700; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Chi tiết công thức</th>
                        <th style="padding: 10px 12px; font-weight: 700; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; text-align: right; width: 130px;">Khấu trừ đi</th>
                    </tr>
                </thead>
                <tbody>
        `;
        let sumOutCut = 0;
        let sumOutKeep = 0;
        transferOutList.forEach(emp => {
            sumOutCut += emp.transferredOut;
            sumOutKeep += emp.contribution;
            listHtml += `
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 10px 12px; font-weight: 600; color: var(--text-primary);">${getGlobalEmpTooltipHtml(emp.rawEmp)}</td>
                    <td style="padding: 10px 12px; text-align: center;"><span class="badge" style="font-size: 0.65rem; padding: 2px 6px; background: rgba(245, 158, 11, 0.08); color: var(--warning); font-weight: 700; border-radius: 6px;">Cắt giảm</span></td>
                    <td style="padding: 10px 12px; color: var(--text-secondary); font-size: 0.75rem;">Lương gốc ${formatCurrency(emp.grossSalary)}, Khối chỉ gánh <strong>${emp.ownSharePercent}%</strong></td>
                    <td style="padding: 10px 12px; text-align: right; font-weight: 700; color: var(--text-muted); font-style: italic;">-${formatCurrency(emp.transferredOut)}</td>
                </tr>
            `;
        });
        listHtml += `
                </tbody>
                <tfoot>
                    <tr style="background: #f8fafc; font-weight: bold; border-top: 1px solid var(--border-color);">
                        <td colspan="3" style="padding: 10px 12px; text-align: right; color: var(--text-secondary); font-size: 0.75rem;">Cộng nhóm khấu trừ (3):</td>
                        <td style="padding: 10px 12px; text-align: right; color: var(--text-muted); font-style: italic; font-size: 0.85rem;">-${formatCurrency(sumOutCut)}</td>
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
        <div style="margin-top: 25px; padding: 15px; background: #FFF; border: 1.5px solid var(--success); border-radius: 10px; display: flex; justify-content: space-between; align-items: center; box-shadow: var(--shadow-sm);">
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase;">
                <i class="fa-solid fa-calculator" style="color: var(--success); margin-right: 6px;"></i> Quỹ Lương Chốt: <span style="font-size: 0.75rem; color: var(--text-secondary); text-transform: none; font-weight: 500;">(1) + (2) + gốc của (3)</span>
            </div>
            <span style="font-size: 1.25rem; font-weight: 800; color: var(--success);">${formatCurrency(totalSalaryDirect)}</span>
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

function customConfirm(message, onConfirmCallback) {
    document.getElementById("custom_confirm_message").innerHTML = message;
    const okBtn = document.getElementById("custom_confirm_ok_btn");
    const newOkBtn = okBtn.cloneNode(true);
    okBtn.parentNode.replaceChild(newOkBtn, okBtn);
    
    newOkBtn.addEventListener("click", () => {
        closeModal("custom_confirm_modal");
        if (onConfirmCallback) onConfirmCallback();
    });
    
    document.getElementById("custom_confirm_modal").classList.add("open");
}

// Helper to render luxurious manual ratios with visually segmented progress bar and Apple-style cards
function renderCustomRatiosHtml(dept, revenueDepts, method = "manual") {
    let totalPct = 0;
    let values = {};

    if (method === "student") {
        const activeStudents = getActiveStudentCounts();
        const totalSum = Object.values(activeStudents).reduce((a, b) => a + b, 0);
        revenueDepts.forEach(rd => {
            const rdVal = activeStudents[rd.id] || 0;
            const pct = totalSum > 0 ? (rdVal / totalSum) * 100 : 0;
            values[rd.id] = Math.round(pct);
            totalPct += Math.round(pct);
        });
        if (totalSum > 0 && totalPct !== 100) {
            let maxId = revenueDepts[0].id;
            let maxVal = values[maxId];
            revenueDepts.forEach(rd => {
                if (values[rd.id] > maxVal) { maxVal = values[rd.id]; maxId = rd.id; }
            });
            values[maxId] += (100 - totalPct);
            totalPct = 100;
        }
    } else if (method === "staff") {
        const staffCounts = getStaffCounts();
        const totalSum = Object.values(staffCounts).reduce((a, b) => a + b, 0);
        revenueDepts.forEach(rd => {
            const rdVal = staffCounts[rd.id] || 0;
            const pct = totalSum > 0 ? (rdVal / totalSum) * 100 : 0;
            values[rd.id] = Math.round(pct);
            totalPct += Math.round(pct);
        });
        if (totalSum > 0 && totalPct !== 100) {
            let maxId = revenueDepts[0].id;
            let maxVal = values[maxId];
            revenueDepts.forEach(rd => {
                if (values[rd.id] > maxVal) { maxVal = values[rd.id]; maxId = rd.id; }
            });
            values[maxId] += (100 - totalPct);
            totalPct = 100;
        }
    } else {
        revenueDepts.forEach(rd => {
            const val = (appState.drivers.custom_percent?.[dept.id]?.[rd.id] !== undefined)
                ? appState.drivers.custom_percent[dept.id][rd.id]
                : 25;
            values[rd.id] = val;
            totalPct += val;
        });
    }

    const getDeptTheme = (name) => {
        const lower = name.toLowerCase();
        if (lower.includes("tiểu học")) return { color: "#007AFF", bg: "rgba(0,122,255,0.2)" }; 
        if (lower.includes("thcs")) return { color: "#00C7BE", bg: "rgba(0,199,190,0.2)" };    
        if (lower.includes("thpt")) return { color: "#AF52DE", bg: "rgba(175,82,222,0.2)" };    
        return { color: "#FF9500", bg: "rgba(255,149,0,0.2)" };                                
    };

    let chartHtml = `<div style="display: flex; gap: 12px; align-items: flex-end; height: 48px; padding-bottom: 2px;">`;
    revenueDepts.forEach(rd => {
        const val = values[rd.id];
        const theme = getDeptTheme(rd.name);
        const heightPct = Math.max(8, Math.min(100, val));
        
        const getInitials = (name) => {
            if (name.includes("Tiểu học")) return "TH";
            if (name.includes("THCS")) return "THCS";
            if (name.includes("THPT")) return "THPT";
            if (name.includes("Nội trú")) return "NT";
            return name.substring(0,2).toUpperCase();
        };
        const label = getInitials(rd.name);
        
        chartHtml += `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; gap: 3px;" title="${rd.name}: ${val}%">
                <div style="font-size: 0.65rem; font-weight: 700; color: ${val > 0 ? theme.color : 'transparent'}; line-height: 1;">${val}%</div>
                <div style="width: 24px; height: ${val > 0 ? heightPct + '%' : '2px'}; background-color: ${val > 0 ? theme.bg : '#F2F2F7'}; border: 1px solid ${val > 0 ? theme.color : 'rgba(0,0,0,0.1)'}; border-bottom: none; border-radius: 4px 4px 0 0; transition: height 0.3s ease;"></div>
                <div style="font-size: 0.55rem; font-weight: 600; color: ${val > 0 ? 'var(--text-secondary)' : 'rgba(0,0,0,0.3)'}; line-height: 1;">${label}</div>
            </div>
        `;
    });
    chartHtml += `</div>`;

    let badgeHtml = "";
    if (method === "student") {
        badgeHtml = `<span style="font-size:0.75rem; font-weight: 600; color: #34C759; margin-bottom: 2px;"><i class="fa-solid fa-users"></i> Tự động theo Sỹ số Học sinh</span>`;
    } else if (method === "staff") {
        badgeHtml = `<span style="font-size:0.75rem; font-weight: 600; color: #34C759; margin-bottom: 2px;"><i class="fa-solid fa-user-tie"></i> Tự động theo Định biên Nhân sự</span>`;
    } else {
        if (totalPct === 100) {
            badgeHtml = `<span style="font-size:0.75rem; font-weight: 600; color: #34C759; margin-bottom: 2px;"><i class="fa-solid fa-check"></i> Đủ 100%</span>`;
        } else {
            badgeHtml = `<span style="font-size:0.75rem; font-weight: 600; color: #FF3B30; margin-bottom: 2px;"><i class="fa-solid fa-triangle-exclamation"></i> Lỗi: ${totalPct}%</span>`;
        }
    }

    const editBtnHtml = method === "manual" 
        ? `<div style="font-size: 0.65rem; color: #007AFF; font-weight: 600; background: rgba(0,122,255,0.1); padding: 3px 10px; border-radius: 10px;"><i class="fa-solid fa-pen-to-square"></i> Sửa phân bổ</div>`
        : `<div style="font-size: 0.65rem; color: var(--text-secondary); font-weight: 600; background: rgba(0,0,0,0.05); padding: 3px 10px; border-radius: 10px;"><i class="fa-solid fa-lock"></i> Tự động tính toán</div>`;

    const onclickHtml = method === "manual" ? `onclick="openAllocationModal('${dept.id}')"` : "";
    const cursorHtml = method === "manual" ? "cursor: pointer;" : "cursor: default;";
    const hoverHtml = method === "manual" 
        ? `onmouseover="this.style.borderColor='rgba(0,122,255,0.4)'; this.style.backgroundColor='#F8FBFF';"` 
        : `onmouseover="this.style.borderColor='rgba(52,199,89,0.4)'; this.style.backgroundColor='#F2FFF5';"`;

    return `
        <div ${onclickHtml} style="display: flex; align-items: center; justify-content: space-between; padding: 6px 16px; background: #FFFFFF; border: 1px solid rgba(0,0,0,0.08); border-radius: 8px; ${cursorHtml} transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.02); min-width: 250px;" ${hoverHtml} onmouseout="this.style.borderColor='rgba(0,0,0,0.08)'; this.style.backgroundColor='#FFFFFF';">
            ${chartHtml}
            <div style="display: flex; flex-direction: column; align-items: flex-end; border-left: 1px dashed rgba(0,0,0,0.1); padding-left: 16px; margin-left: auto;">
                ${badgeHtml}
                ${editBtnHtml}
            </div>
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

    // Tính toán lại chi phí để lấy số liệu cập nhật nhất
    const currentResult = runAllocation();

    // 1. RENDER KHỐI TRỰC TIẾP (REVENUE CENTERS)
    revenueDepts.forEach((dept, index) => {
        const stud = dept.students || 0;
        const tuition = appState.simulation?.tuition || {};
        
        // Tính doanh thu thực tế từ phòng học
        const actualRev = calculateActualRevenueForDept(dept.id);
        // Auto-sync vào appState.revenues để dashboard P&L dùng
        appState.revenues[dept.id] = actualRev;
        const rev = actualRev;
        
        const dSalary = currentResult.directSalary[dept.id] || 0;
        const dInsurance = currentResult.directInsurance[dept.id] || 0;
        const dRent = currentResult.directRent[dept.id] || 0;
        const totalDirect = dSalary + dInsurance + dRent;

        // Xây dựng cell Học phí/HS và Doanh thu tháng
        let tuitionCellHtml = '';
        let revenueCellHtml = '';

        if (dept.id === 'dept_thpt') {
            // THPT có 2 hệ: thường + xanh
            const feeThuong = tuition['dept_thpt_thuong'] || 0;
            const feeXanh   = tuition['dept_thpt_xanh']   || 0;
            tuitionCellHtml = `
                <div style="font-size:0.8rem;">
                    <div style="margin-bottom:4px;">
                        <span style="color:var(--text-muted); margin-right:4px;">Hệ thường:</span>
                        <input type="text" class="base-select-dropdown" style="width:130px; display:inline; font-weight:500; font-size:0.8rem;"
                            value="${formatNumberWithDots(feeThuong)}"
                            oninput="handleMoneyInput(this)"
                            onblur="updateSimTuition('dept_thpt_thuong', this.value)"
                            onkeydown="if(event.key==='Enter')this.blur()"
                            placeholder="Học phí/HS...">
                    </div>
                    <div>
                        <span style="color:var(--text-muted); margin-right:4px;">🌿 Hệ Xanh:</span>
                        <input type="text" class="base-select-dropdown" style="width:130px; display:inline; font-weight:500; font-size:0.8rem;"
                            value="${formatNumberWithDots(feeXanh)}"
                            oninput="handleMoneyInput(this)"
                            onblur="updateSimTuition('dept_thpt_xanh', this.value)"
                            onkeydown="if(event.key==='Enter')this.blur()"
                            placeholder="Học phí/HS...">
                    </div>
                </div>`;
            revenueCellHtml = `<div style="font-weight:600; color:var(--success); font-size:0.85rem;">${formatCurrency(rev)}</div><div style="font-size:0.7rem; color:var(--text-muted); font-style:italic;">HS thực tế từng phòng × học phí/hệ</div>`;
        } else {
            // Tiểu học, THCS (hệ xanh), Nội trú
            const tuitionKey = dept.id === 'dept_noitru' ? 'dept_noitru'
                             : dept.id === 'dept_tieuhoc' ? 'dept_tieuhoc_xanh'
                             : dept.id === 'dept_thcs' ? 'dept_thcs_xanh'
                             : dept.id;
            const fee = tuition[tuitionKey] || 0;
            const calcRev = fee * stud;
            tuitionCellHtml = `
                <div style="display:inline-block;">
                    <input type="text" class="base-select-dropdown" style="width:150px; display:inline; font-weight:500;"
                        value="${formatNumberWithDots(fee)}"
                        oninput="handleMoneyInput(this)"
                        onblur="updateSimTuition('${tuitionKey}', this.value)"
                        onkeydown="if(event.key==='Enter')this.blur()"
                        placeholder="Nhập học phí/HS...">
                </div>`;
            revenueCellHtml = rev > 0
                ? `<div style="font-weight:600; color:var(--success);">${formatCurrency(rev)}</div><div style="font-size:0.7rem; color:var(--text-muted); font-style:italic;">HS thực tế từng phòng × học phí/hệ</div>`
                : `<div style="color:var(--text-muted); font-size:0.8rem; font-style:italic;">Chưa có dữ liệu phòng học</div>`;
        }

        const rowHtml = `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <strong style="color: var(--success); cursor: pointer;" onclick="openDepartmentCostAuditModal('${dept.id}')" title="Nhấp chuột để xem giải trình cơ cấu chi phí chi tiết">
                        ${dept.name} <i class="fa-solid fa-magnifying-glass-chart" style="font-size: 0.7rem; margin-left: 4px; opacity: 0.8;"></i>
                    </strong>
                    <div style="font-size: 0.72rem; color: var(--text-secondary); margin-top: 3px; display: flex; align-items: center; gap: 4px;">
                        <i class="fa-solid fa-money-bill-wave" style="color: var(--success); opacity: 0.7;"></i> 
                        <span title="Chi phí Tự thân = Quỹ lương CBNV + Tiền gánh mặt bằng trực tiếp">Chi phí tự thân: <strong>${formatCurrency(totalDirect)}</strong></span>
                    </div>
                </td>
                <td>
                    <input type="number" class="base-select-dropdown" style="width:100px;" value="${stud}" onchange="updateDeptStudents('${dept.id}', this.value)">
                </td>
                <td>${tuitionCellHtml}</td>
                <td>${revenueCellHtml}</td>
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

        let mainAllocationHtml = renderCustomRatiosHtml(dept, revenueDepts, method);

        const dSalary = currentResult.indirectSalary[dept.id] || 0;
        const dInsurance = currentResult.indirectInsurance[dept.id] || 0;
        const dRent = currentResult.indirectRent[dept.id] || 0;
        const totalDirect = dSalary + dInsurance + dRent;

        const rowHtml = `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <strong style="color: var(--primary); cursor: pointer;" onclick="openDepartmentCostAuditModal('${dept.id}')" title="Nhấp chuột để xem giải trình cơ cấu chi phí chi tiết">
                        ${dept.name} <i class="fa-solid fa-magnifying-glass-chart" style="font-size: 0.7rem; margin-left: 4px; opacity: 0.8;"></i>
                    </strong>
                    <div style="font-size: 0.72rem; color: var(--text-secondary); margin-top: 3px; display: flex; align-items: center; gap: 4px;">
                        <i class="fa-solid fa-money-bill-wave" style="color: var(--primary); opacity: 0.7;"></i> 
                        <span title="Chi phí Tự thân = Quỹ lương CBNV + Tiền gánh mặt bằng trực tiếp">Chi phí tự thân: <strong>${formatCurrency(totalDirect)}</strong></span>
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

        let mainAllocationHtml = renderCustomRatiosHtml(dept, revenueDepts, method);

        const dSalary = currentResult.indirectSalary[dept.id] || 0;
        const dInsurance = currentResult.indirectInsurance[dept.id] || 0;
        const dRent = currentResult.indirectRent[dept.id] || 0;
        const totalDirect = dSalary + dInsurance + dRent;

        const rowHtml = `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <strong style="color: var(--warning); cursor: pointer;" onclick="openDepartmentCostAuditModal('${dept.id}')" title="Nhấp chuột để xem giải trình cơ cấu chi phí chi tiết">
                        ${dept.name} <i class="fa-solid fa-magnifying-glass-chart" style="font-size: 0.7rem; margin-left: 4px; opacity: 0.8;"></i>
                    </strong>
                    <div style="font-size: 0.72rem; color: var(--text-secondary); margin-top: 3px; display: flex; align-items: center; gap: 4px;">
                        <i class="fa-solid fa-money-bill-wave" style="color: var(--warning); opacity: 0.7;"></i> 
                        <span title="Chi phí Tự thân = Quỹ lương CBNV + Tiền gánh mặt bằng trực tiếp">Chi phí tự thân: <strong>${formatCurrency(totalDirect)}</strong></span>
                    </div>
                </td>
                <td>
                    <div class="priority-container" style="display: inline-block;">
                        <input type="text" class="base-select-dropdown" style="width:160px; display:inline; font-weight: bold; border-color: rgba(0, 122, 255, 0.3);" value="${formatNumberWithDots(bill)}" oninput="handleMoneyInput(this)" onblur="updateUtilityCost('${dept.id}', this.value)" onkeydown="if(event.key==='Enter') this.blur()">
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


// Tạo tooltip thông tin nhân sự toàn cục
function getGlobalEmpTooltipHtml(emp) {
    if (!emp.isMultiLevel || !emp.ratios) return `<i class="fa-regular fa-user" style="color: var(--text-muted); margin-right: 8px;"></i>${emp.name}`;
    
    const isAmt = emp.allocationMode === 'amount';
    let activeDeptsCount = 0;
    let tooltipContent = `<strong style="color: #34C759; display: block; margin-bottom: 8px; font-size: 0.82rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 4px;"><i class="fa-solid fa-layer-group"></i> Chi tiết ${emp.name}:</strong>`;
    
    Object.keys(emp.ratios).forEach(did => {
        const rVal = emp.ratios[did];
        if (rVal > 0) {
            activeDeptsCount++;
            const d = appState.departments.find(x => x.id === did);
            const dName = d ? d.name.replace("Khối ", "").replace("Ban ", "") : "Không rõ";
            const note = (emp.ratioNotes && emp.ratioNotes[did]) ? `<div style="font-style: italic; color: #E5E5EA; font-size: 0.72rem; margin-top: 2px; padding-left: 10px; border-left: 2px solid rgba(255,255,255,0.2);"><i class="fa-regular fa-comment-dots"></i> ${emp.ratioNotes[did]}</div>` : '';
            const formattedVal = isAmt ? formatCurrency(rVal) : (rVal + '%');
            tooltipContent += `<div style="margin-bottom: 8px; font-size: 0.8rem;"><div style="display: flex; justify-content: space-between;"><strong style="color: #FFF;">${dName}:</strong> <span style="color: #FFCA28; font-weight: bold;">${formattedVal}</span></div>${note}</div>`;
        }
    });

    if (activeDeptsCount === 0) return `<i class="fa-regular fa-user" style="color: var(--text-muted); margin-right: 8px;"></i>${emp.name}`;

    return `
        <div class="dept-note-tooltip-trigger" style="display: inline-block; position: relative; cursor: pointer;">
            <i class="fa-regular fa-user" style="color: var(--text-muted); margin-right: 6px;"></i>
            <span style="border-bottom: 1px dashed rgba(0,0,0,0.3); padding-bottom: 1px;">${emp.name}</span>
            <span style="margin-left: 6px; font-size: 0.65rem; background: rgba(52,199,89,0.1); border: 1px solid rgba(52,199,89,0.2); padding: 1px 5px; border-radius: 10px; font-weight: 700; color: #059669;" title="Kiêm nhiệm ${activeDeptsCount} phòng ban">${activeDeptsCount} PB</span>
            <div class="custom-note-tooltip" style="min-width: 280px; text-align: left; padding: 12px; z-index: 100010; top: 100%; bottom: auto; left: 0; transform: translateY(8px); margin-left: 10px;">
                ${tooltipContent}
            </div>
        </div>
    `;
}

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
    let deptEmployees = [];
    appState.employees.forEach(emp => {
        if (emp.isMultiLevel && emp.ratios) {
            if (emp.ratios[deptId] > 0) {
                deptEmployees.push(emp);
            }
        } else if (emp.deptId === deptId) {
            deptEmployees.push(emp);
        }
    });

    let employeesListHtml = "";
    if (deptEmployees.length > 0) {
        employeesListHtml = `
            <table style="width: 100%; border-collapse: collapse; margin-top: 5px; font-size: 0.78rem; background: #FFF; border-radius: 10px; box-shadow: var(--shadow-sm); border: 1px solid var(--border-color);">
                <thead>
                    <tr style="background: #f8fafc; border-bottom: 1px solid var(--border-color); text-align: left;">
                        <th style="border-top-left-radius: 10px; padding: 10px 12px; font-weight: 700; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Nhân sự</th>
                        <th style="padding: 10px 12px; font-weight: 700; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; text-align: center; width: 100px;">Loại hình</th>
                        <th style="padding: 10px 12px; font-weight: 700; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Chi tiết công thức</th>
                        <th style="border-top-right-radius: 10px; padding: 10px 12px; font-weight: 700; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; text-align: right; width: 130px;">Lương phân bổ</th>
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
                        <td style="padding: 10px 12px; font-weight: 600; color: var(--text-primary);">${getGlobalEmpTooltipHtml(emp)}</td>
                        <td style="padding: 10px 12px; text-align: center;">
                            <span class="badge" style="font-size: 0.65rem; padding: 2px 6px; background: rgba(16, 185, 129, 0.08); color: #059669; font-weight: 700; border-radius: 6px;">Kiêm nhiệm</span>
                        </td>
                        <td style="padding: 10px 12px; color: var(--text-secondary); font-size: 0.75rem;">Gánh <strong>${Math.round((ratioVal / totalRatio) * 100)}%</strong> trên tổng lương ${formatCurrency(emp.salary)}</td>
                        <td style="padding: 10px 12px; text-align: right; font-weight: 700; color: #059669;">${formatCurrency(allocatedSalary)}</td>
                    </tr>
                `;
            } else {
                totalSalary += emp.salary;
                employeesListHtml += `
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <td style="padding: 10px 12px; font-weight: 600; color: var(--text-primary);">${getGlobalEmpTooltipHtml(emp)}</td>
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
            <table style="width: 100%; border-collapse: collapse; margin-top: 5px; font-size: 0.78rem; background: #FFF; border-radius: 10px; box-shadow: var(--shadow-sm); border: 1px solid var(--border-color);">
                <thead>
                    <tr style="background: #f8fafc; border-bottom: 1px solid var(--border-color); text-align: left;">
                        <th style="border-top-left-radius: 10px; padding: 10px 12px; font-weight: 700; color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Phòng học / Mặt bằng</th>
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
            const roomRent = (room.calculatedRent !== undefined && room.calculatedRent !== null) ? room.calculatedRent : (block.totalRent / roomCount);
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
                    <td style="padding: 10px 12px;">
                        <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
                            <div style="width: 70px; background: #e2e8f0; height: 6px; border-radius: 3px; overflow: hidden; flex-shrink: 0;">
                                <div style="width: ${percent}%; background: var(--primary); height: 100%;"></div>
                            </div>
                            <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-primary); min-width: 44px; text-align: right;">${percent}%</span>
                        </div>
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
    document.getElementById("edit_dept_note_type").value = "department";
    document.getElementById("dept_note_modal_desc").innerHTML = `Nhập giải trình phương án phân bổ cho bộ phận <strong>${dept.name}</strong>:`;
    document.getElementById("dept_note_textarea").value = dept.note || "";
    
    document.getElementById("dept_note_modal").classList.add("open");
    
    setTimeout(() => {
        const ta = document.getElementById("dept_note_textarea");
        ta.focus();
        ta.selectionStart = ta.selectionEnd = ta.value.length;
    }, 120);
}

function editRoomNote(roomId) {
    const room = appState.rooms.find(r => r.id === roomId);
    if (!room) return;

    document.getElementById("edit_dept_note_id").value = roomId;
    document.getElementById("edit_dept_note_type").value = "room";
    document.getElementById("dept_note_modal_desc").innerHTML = `Nhập giải trình cho phòng <strong>${room.name}</strong>:`;
    document.getElementById("dept_note_textarea").value = room.note || "";
    
    document.getElementById("dept_note_modal").classList.add("open");
    
    setTimeout(() => {
        const ta = document.getElementById("dept_note_textarea");
        ta.focus();
        ta.selectionStart = ta.selectionEnd = ta.value.length;
    }, 120);
}

function saveDepartmentNoteFromModal() {
    const noteId = document.getElementById("edit_dept_note_id").value;
    const noteType = document.getElementById("edit_dept_note_type").value;
    const textVal = document.getElementById("dept_note_textarea").value;
    
    if (noteType === "department") {
        const dept = appState.departments.find(d => d.id === noteId);
        if (dept) {
            dept.note = textVal; // Giữ nguyên khoảng trắng và ký tự xuống dòng
            saveState();
            renderDepartments();
            renderDashboard();
        }
    } else if (noteType === "room") {
        const room = appState.rooms.find(r => r.id === noteId);
        if (room) {
            room.note = textVal;
            saveState();
            renderFacilities();
        }
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

function updateTuitionFee(deptId, value) {
    const fee = parseMoneyValue(value);
    const dept = appState.departments.find(d => d.id === deptId);
    if (!dept) return;
    dept.tuitionFee = fee;
    // Tự tính doanh thu = học phí × sỹ số
    const students = dept.students || 0;
    appState.revenues[deptId] = fee * students;
    saveState();
    renderDepartments();
    renderDashboard();
}


function updateDeptStudents(deptId, value) {
    const val = parseInt(value) || 0;
    const dept = appState.departments.find(d => d.id === deptId);
    if (dept) {
        dept.students = val;
        // Nếu đã có học phí → tự tính lại doanh thu
        if (dept.tuitionFee && dept.tuitionFee > 0) {
            appState.revenues[deptId] = dept.tuitionFee * val;
        }
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

let tempAllocationState = null;

function openAllocationModal(deptId) {
    const dept = appState.departments.find(d => d.id === deptId);
    if (!dept) return;

    document.getElementById("allocation_modal_title").innerHTML = `Phân bổ tỷ lệ chi phí: <strong style="color:var(--primary)">${dept.name}</strong>`;

    const revenueDepts = appState.departments.filter(d => d.type === "revenue");
    const currentRatios = appState.drivers.custom_percent?.[deptId] || {};
    
    tempAllocationState = {
        deptId: deptId,
        ratios: {}
    };

    revenueDepts.forEach(rd => {
        tempAllocationState.ratios[rd.id] = currentRatios[rd.id] !== undefined ? currentRatios[rd.id] : 25;
    });

    renderAllocationModalBody();
    document.getElementById("allocation_modal").classList.add("open");
}

function renderAllocationModalBody() {
    const body = document.getElementById("allocation_modal_body");
    const revenueDepts = appState.departments.filter(d => d.type === "revenue");
    
    let totalPct = 0;
    Object.values(tempAllocationState.ratios).forEach(v => totalPct += v);

    const getDeptTheme = (name) => {
        const lower = name.toLowerCase();
        if (lower.includes("tiểu học")) return { color: "#007AFF" }; 
        if (lower.includes("thcs")) return { color: "#00C7BE" };    
        if (lower.includes("thpt")) return { color: "#AF52DE" };    
        return { color: "#FF9500" };                                
    };

    let inputsHtml = `<div style="display: flex; flex-direction: column; gap: 12px; flex: 1;">`;
    revenueDepts.forEach(rd => {
        const val = tempAllocationState.ratios[rd.id];
        const theme = getDeptTheme(rd.name);
        inputsHtml += `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 15px; background: #f8fafc; border: 1px solid rgba(0,0,0,0.08); border-radius: 8px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background-color: ${theme.color};"></span>
                    <strong style="font-size: 0.9rem; color: var(--text-primary);">${rd.name}</strong>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <input type="number" min="0" max="100" style="width: 60px; padding: 6px; text-align: center; border: 1px solid rgba(0,0,0,0.15); border-radius: 6px; font-weight: 700; font-size: 0.9rem;" value="${val}" onchange="updateTempAllocation('${rd.id}', this.value)" oninput="this.value = !!this.value && Math.abs(this.value) >= 0 ? Math.min(100, Math.abs(this.value)) : ''">
                    <span style="font-weight: 700; color: var(--text-secondary);">%</span>
                </div>
            </div>
        `;
    });
    inputsHtml += `</div>`;

    let pieConic = "";
    let currentDeg = 0;
    revenueDepts.forEach(rd => {
        const val = tempAllocationState.ratios[rd.id];
        if (val > 0) {
            const theme = getDeptTheme(rd.name);
            const deg = (val / 100) * 360;
            pieConic += `${theme.color} ${currentDeg}deg ${currentDeg + deg}deg, `;
            currentDeg += deg;
        }
    });
    
    if (totalPct < 100) {
        pieConic += `#EAEAEF ${currentDeg}deg 360deg, `;
    } else if (totalPct > 100) {
        pieConic = `rgba(255, 59, 48, 0.5) 0deg 360deg, `;
    }
    pieConic = pieConic.slice(0, -2); 

    let statusHtml = "";
    if (totalPct === 100) {
        statusHtml = `<div style="text-align: center; font-weight: 700; color: #34C759; margin-top: 15px; font-size: 1.1rem;"><i class="fa-solid fa-circle-check"></i> Đạt 100%</div>`;
    } else {
        statusHtml = `<div style="text-align: center; font-weight: 700; color: #FF3B30; margin-top: 15px; font-size: 1.1rem;"><i class="fa-solid fa-triangle-exclamation"></i> Tổng: ${totalPct}%</div>`;
    }

    body.innerHTML = `
        <div style="display: flex; gap: 30px; align-items: flex-start;">
            ${inputsHtml}
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 200px; flex-shrink: 0; padding-top: 10px;">
                <div style="width: 140px; height: 140px; border-radius: 50%; background: conic-gradient(${pieConic || '#EAEAEF 0deg 360deg'}); box-shadow: 0 4px 12px rgba(0,0,0,0.1); position: relative; transition: all 0.3s ease;">
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 70px; height: 70px; background: #FFF; border-radius: 50%; box-shadow: inset 0 2px 5px rgba(0,0,0,0.05);"></div>
                </div>
                ${statusHtml}
            </div>
        </div>
    `;
}

function updateTempAllocation(rdId, value) {
    if (!tempAllocationState) return;
    tempAllocationState.ratios[rdId] = parseFloat(value) || 0;
    renderAllocationModalBody();
}

function saveAllocationModal() {
    if (!tempAllocationState) return;
    
    let totalPct = 0;
    Object.values(tempAllocationState.ratios).forEach(v => totalPct += v);
    if (totalPct !== 100) {
        alert(`Tổng tỷ lệ phải đúng bằng 100%. Hiện tại đang là ${totalPct}%!`);
        return;
    }

    if (!appState.drivers.custom_percent) appState.drivers.custom_percent = {};
    if (!appState.drivers.custom_percent[tempAllocationState.deptId]) {
        appState.drivers.custom_percent[tempAllocationState.deptId] = {};
    }

    Object.keys(tempAllocationState.ratios).forEach(rdId => {
        appState.drivers.custom_percent[tempAllocationState.deptId][rdId] = tempAllocationState.ratios[rdId];
    });

    saveState();
    runAllocation();
    closeModal('allocation_modal');
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
    customConfirm("CẢNH BÁO: Xóa phòng ban này sẽ giải phóng nhân sự và mặt bằng liên kết. Bạn muốn tiếp tục?", () => {
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
    });
}
function filterEmployeeList(keyword) {
    const rows = document.querySelectorAll("#emp_list_body tr");
    const kw = keyword.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    rows.forEach(row => {
        const nameCell = row.querySelector("td:nth-child(2)");
        if (!nameCell) return;
        const name = nameCell.textContent.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        row.style.display = name.includes(kw) ? "" : "none";
    });
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
            if (lower.includes("thcs")) return { color: "#00C7BE" };
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

            // 1. Tạo Biểu đồ Cột Mini (Sparklines) thay thế thanh ngang
            let chartHtml = `<div style="display: flex; gap: 12px; align-items: flex-end; height: 48px; padding-bottom: 2px; margin-top: 6px;">`;
            let hasAnyValue = false;
            
            nonUtilityDepts.forEach(d => {
                const val = (emp.ratios?.[d.id] !== undefined) ? emp.ratios[d.id] : 0;
                if (val > 0) {
                    hasAnyValue = true;
                    
                    const theme = getDeptTheme(d.name);
                    const heightPct = isAmountMode ? Math.min(100, (val / emp.salary) * 100) : Math.min(100, val);
                    const displayHeightPct = Math.max(8, heightPct); // min 8% for visibility
                    
                    const label = d.name.replace("Khối ", "").replace("Ban ", "");
                    
                    const valStr = isAmountMode ? formatCurrency(val) : (val + '%');
                    const titleStr = `${d.name}: ${valStr}`;
                    
                    chartHtml += `
                        <div style="display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; gap: 3px;" title="${titleStr}">
                            <div style="font-size: 0.65rem; font-weight: 700; color: ${val > 0 ? theme.color : 'transparent'}; line-height: 1;">${valStr}</div>
                            <div style="width: 24px; height: ${val > 0 ? displayHeightPct + '%' : '2px'}; background-color: ${val > 0 ? (theme.bg || theme.color + '33') : '#F2F2F7'}; border: 1px solid ${val > 0 ? theme.color : 'rgba(0,0,0,0.1)'}; border-bottom: none; border-radius: 4px 4px 0 0; transition: height 0.3s ease;"></div>
                            <div style="font-size: 0.55rem; font-weight: 600; color: ${val > 0 ? 'var(--text-secondary)' : 'rgba(0,0,0,0.3)'}; line-height: 1; white-space: nowrap;">${label}</div>
                        </div>
                    `;
                }
            });
            chartHtml += `</div>`;

            if (!hasAnyValue) {
                chartHtml = `<div style="font-size: 0.68rem; color: var(--text-muted); font-style: italic; margin-top: 6px; height: 48px; display: flex; align-items: center;">Chưa phân bổ tỷ lệ</div>`;
            }

            // 3. Nút mở popup modal phân bổ kiêm nhiệm
            const configBtnHtml = `
                <button class="btn" style="padding: 3px 10px; font-size: 0.72rem; margin-top: 10px; background: rgba(0, 122, 255, 0.07); color: var(--info); border: 1px solid rgba(0, 122, 255, 0.15); border-radius: 5px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; transition: all 0.2s;" 
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
                    ${chartHtml}
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
                    <input type="text" class="base-select-dropdown" style="width:100%; text-align:right; display:inline; padding: 4px; box-sizing:border-box;" value="${formatNumberWithDots(emp.salary)}" oninput="handleMoneyInput(this)" onblur="updateEmployeeSalary('${emp.id}', this.value)" onkeydown="if(event.key==='Enter') this.blur()">
                </td>
                <td class="text-right">
                    <input type="text" class="base-select-dropdown" style="width:100%; text-align:right; display:inline; padding: 4px; box-sizing:border-box;" value="${formatNumberWithDots(emp.insurance || 0)}" oninput="handleMoneyInput(this)" onblur="updateEmployeeInsurance('${emp.id}', this.value)" onkeydown="if(event.key==='Enter') this.blur()">
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
                <th style="padding: 10px 8px; text-align: right; min-width: 150px;">Nhân sự gốc (VNĐ)</th>
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
        const empInsurance = emp.insurance || 0;
        const totalBase = emp.salary + empInsurance;
        grandGrossTotal += totalBase;

        let rowHtml = `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.03);">
                <td style="padding: 8px;">${index + 1}</td>
                <td style="padding: 8px;">
                    <strong>${emp.name}</strong>
                    ${emp.isMultiLevel ? ' <span class="badge" style="background-color: rgba(255, 149, 0, 0.08); color: var(--warning); padding: 1px 4px; font-size: 0.6rem;">Kiêm nhiệm</span>' : ''}
                </td>
                <td style="padding: 8px; font-size: 0.8rem; color: var(--text-secondary);">${deptName}</td>
                <td style="padding: 8px; text-align: right; font-weight: 500;">
                    <div style="font-weight: 700; color: var(--text-primary);">${formatCurrency(totalBase)}</div>
                    <div style="font-size: 0.68rem; color: var(--text-secondary);">Lương: ${formatCurrency(emp.salary)}</div>
                    <div style="font-size: 0.68rem; color: var(--text-secondary); font-style: italic;">BH: ${formatCurrency(empInsurance)}</div>
                </td>
        `;

        let empAllocSum = 0;
        depts.forEach(d => {
            let cellText = "-";
            let cellVal = 0;

            if (!emp.isMultiLevel) {
                if (emp.deptId === d.id) {
                    cellVal = totalBase;
                    cellText = `<span style="font-weight: 500; color: var(--success);">${formatCurrency(cellVal)}</span> <small class="text-muted">(100%)</small>`;
                }
            } else {
                const ratios = emp.ratios || {};
                const isAmountMode = emp.allocationMode === "amount";
                if (isAmountMode) {
                    if (ratios[d.id] > 0) {
                        const ratio = emp.salary > 0 ? (ratios[d.id] / emp.salary) : 0;
                        cellVal = totalBase * ratio;
                        const pct = (ratio * 100).toFixed(0);
                        cellText = `<span style="font-weight: 500; color: var(--primary);">${formatCurrency(cellVal)}</span> <small class="text-muted">(${pct}%)</small>`;
                    }
                } else {
                    let totalRatio = 0;
                    Object.values(ratios).forEach(r => totalRatio += r);
                    if (totalRatio > 0 && ratios[d.id] > 0) {
                        const pct = ratios[d.id];
                        cellVal = totalBase * (pct / totalRatio);
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
                <td colspan="3" style="padding: 10px 8px; text-align: left;">➔ TỔNG CỘNG QUỸ NHÂN SỰ (LƯƠNG + BHXH):</td>
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

function updateEmployeeInsurance(empId, value) {
    const val = parseMoneyValue(value);
    const emp = appState.employees.find(e => e.id === empId);
    if (emp) {
        emp.insurance = val;
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
        if (lower.includes('thcs')) return { color: '#00C7BE' };
        if (lower.includes('thpt')) return { color: '#AF52DE' };
        return { color: '#FF9500' };
    };

    let html = `
        <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
            <thead>
                <tr style="border-bottom: 2px solid var(--border-color); color: var(--text-muted); text-align: left; font-size: 0.75rem; text-transform: uppercase;">
                    <th style="padding: 8px 4px; width: 140px; font-weight: 700;">Phòng ban</th>
                    <th style="padding: 8px 4px; font-weight: 700;">Tỷ trọng</th>
                    <th style="padding: 8px 4px; text-align: right; width: ${isAmt ? '150px' : '90px'}; font-weight: 700;">Phân bổ</th>
                    <th style="padding: 8px 4px; text-align: center; width: 40px; font-weight: 700;"><i class="fa-solid fa-comment"></i></th>
                </tr>
            </thead>
            <tbody>
    `;

    nonUtilityDepts.forEach(d => {
        const theme = getDeptTheme(d.name);
        const shortName = d.name.replace('Khối ', '').replace('Ban ', '');
        const val = _empRatioModalDraftRatios[d.id] || 0;
        const inputColor = val > 0 ? theme.color : '#8E8E93';
        const pctWidth = isAmt
            ? (emp.salary > 0 ? Math.min(100, Math.round(val / emp.salary * 100)) : 0)
            : Math.min(100, val);

        const noteVal = _empRatioModalDraftNotes[d.id] || '';

        html += `
            <tr style="border-bottom: 1px dashed var(--border-color);">
                <td style="padding: 10px 4px; font-weight: 700; color: #1D1D1F;">
                    <div style="border-left: 3px solid ${theme.color}; padding-left: 8px; line-height: 1.2;">${shortName}</div>
                </td>
                <td style="padding: 10px 4px;">
                    <div style="height: 6px; border-radius: 3px; background: rgba(0,0,0,0.06); overflow: hidden; width: 100%;">
                        <div id="emp_ratio_bar_${d.id}" style="height: 100%; width: ${pctWidth}%; background: ${theme.color}; border-radius: 3px; transition: width 0.25s;"></div>
                    </div>
                </td>
                <td style="padding: 10px 4px; text-align: right;">
                    <div style="display: flex; align-items: center; justify-content: flex-end; gap: 4px;">
                        <input type="${isAmt ? 'text' : 'number'}" ${isAmt ? '' : 'min="0" max="100"'}
                            id="emp_ratio_input_${d.id}"
                            class="ratio-pct-input"
                            data-dept-id="${d.id}"
                            data-dept-color="${theme.color}"
                            style="width: ${isAmt ? '110px' : '60px'}; padding: 4px 6px; font-size: 0.85rem; font-weight: 700; color: ${inputColor}; background: #F5F5F7; border: 1.5px solid rgba(0,0,0,0.1); border-radius: 4px; text-align: right; outline: none; transition: border-color 0.15s;"
                            value="${isAmt ? formatNumberWithDots(val) : val}"
                            oninput="${isAmt ? 'handleMoneyInput(this);' : ''}updateEmpRatioModalDraft(this)"
                            onfocus="this.style.borderColor='${theme.color}'"
                            onblur="this.style.borderColor='rgba(0,0,0,0.1)'">
                        <span style="font-size: 0.75rem; font-weight: 700; color: #8E8E93;">${isAmt ? 'đ' : '%'}</span>
                    </div>
                </td>
                <td style="padding: 10px 4px; text-align: center;">
                    <button id="note_btn_${d.id}" onclick="const r = document.getElementById('note_row_${d.id}'); r.style.display = r.style.display === 'none' ? 'table-row' : 'none';" style="background: none; border: none; cursor: pointer; color: ${noteVal ? theme.color : '#C7C7CC'}; transition: color 0.2s;" title="Thêm/sửa ghi chú">
                        <i class="fa-solid fa-comment-dots" style="font-size: 1.1rem;"></i>
                    </button>
                </td>
            </tr>
            <tr id="note_row_${d.id}" style="display: ${noteVal ? 'table-row' : 'none'}; background: #fafafa;">
                <td colspan="4" style="padding: 4px 8px 12px 14px; border-bottom: 1px solid var(--border-color);">
                    <div style="display: flex; align-items: center; gap: 8px; background: #fff; padding: 4px 10px; border-radius: 6px; border: 1px dashed rgba(0,0,0,0.12);">
                        <i class="fa-solid fa-arrow-turn-up" style="transform: rotate(90deg); color: #8E8E93; font-size: 0.75rem;"></i>
                        <input type="text"
                            id="emp_ratio_note_${d.id}"
                            data-dept-id="${d.id}"
                            placeholder="Mô tả công việc kiêm nhiệm tại ${shortName}..."
                            style="flex: 1; border: none; background: transparent; font-size: 0.75rem; color: #1D1D1F; outline: none; padding: 4px 0;"
                            value="${noteVal}"
                            oninput="updateEmpRatioModalDraftNote(this); document.getElementById('note_btn_${d.id}').style.color = this.value ? '${theme.color}' : '#C7C7CC';">
                    </div>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table>`;

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
    // Removed confirm() dialogs because they block saving in some WebViews.
    // Incomplete allocations are now allowed to save, and the UI will show a warning badge.

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
        if (lower.includes("thcs")) return { color: "#00C7BE" };
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
            if (lower.includes("thcs")) return { color: "#00C7BE" };
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
    const insurance = parseMoneyValue(document.getElementById("emp_add_insurance").value) || 0;
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
        insurance: insurance,
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
    customConfirm("Xóa nhân viên này?", () => {
        appState.employees = appState.employees.filter(e => e.id.toString() !== empId.toString());
        saveState();
        renderEmployees();
        renderDashboard();
    });
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

        const baseRentForPercent = appState.landlordRent > 0 ? appState.landlordRent : (absoluteTotalRent > 0 ? absoluteTotalRent : 1);
        const rentPercent = (blk.totalRent / baseRentForPercent * 100).toFixed(1);

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
                        <input type="text" class="base-select-dropdown" style="width: 140px; text-align: right; font-weight: 700; padding: 4px 8px; display: inline-block;" value="${formatNumberWithDots(blk.totalRent)}" oninput="handleMoneyInput(this)" onblur="updateRentBlockCost('${blk.id}', this.value)" onkeydown="if(event.key==='Enter') this.blur()">
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
                <input type="text" class="base-select-dropdown" style="width: 140px; text-align: right; font-weight: 800; color: var(--danger); padding: 4px 8px; display: inline-block; border-color: rgba(239, 68, 68, 0.3);" value="${formatNumberWithDots(currentLandlordRent)}" oninput="handleMoneyInput(this)" onblur="updateLandlordRent(this.value)" onkeydown="if(event.key==='Enter') this.blur()">
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
                const calculatedRoomCost = (room.calculatedRent !== undefined && room.calculatedRent !== null) ? room.calculatedRent : (blk ? blk.totalRent / countInBlock : 0);

                // Render splits text as beautiful badges/chips using the helper function
                const splitsText = getRoomSplitsHTML(room);
                
                const hasNote = room.note && room.note.trim() !== "";
                const noteIconClass = hasNote ? "fa-solid fa-comment-dots" : "fa-regular fa-comment-dots";
                const noteIconStyle = hasNote 
                    ? "cursor: pointer; font-size: 0.85rem; color: #FF5E00; transition: all 0.2s; display: inline-block; padding: 6px 8px; background: rgba(255, 94, 0, 0.08); border-radius: 6px;" 
                    : "cursor: pointer; font-size: 0.85rem; color: var(--text-secondary); opacity: 0.4; transition: all 0.2s; display: inline-block; padding: 6px 8px; border-radius: 6px;";
                
                const safeNoteContent = hasNote 
                    ? room.note.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
                    : "";

                const tooltipText = hasNote 
                    ? `<strong style="color: #34C759; display: block; margin-bottom: 6px; font-size: 0.82rem;"><i class="fa-solid fa-square-check"></i> Đã giải trình phương án:</strong><span style="font-style: italic; white-space: pre-wrap; display: block; font-weight: 500; font-size: 0.8rem; color: #E5E5EA;">${safeNoteContent}</span><hr style="border: 0; border-top: 1px solid rgba(255, 255, 255, 0.15); margin: 8px 0 6px 0;"><span style="font-size: 0.75rem; opacity: 0.7; display: block; text-align: center; color: #FF5E00;"><i class="fa-solid fa-pen"></i> Nhấp chuột để chỉnh sửa</span>`
                    : `<span style="opacity: 0.9; display: block; text-align: center; font-size: 0.78rem;"><i class="fa-regular fa-comment-dots"></i> Chưa có giải trình.<br>Nhấp chuột để thêm mới!</span>`;

                const noteIconHtml = `
                    <div class="dept-note-tooltip-trigger">
                        <i class="${noteIconClass}" style="${noteIconStyle}" onclick="editRoomNote('${room.id}')" onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='scale(1)'"></i>
                        <div class="custom-note-tooltip">
                            ${tooltipText}
                        </div>
                    </div>
                `;

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
                        <td class="text-right" style="white-space: nowrap;">
                            <div style="display: inline-flex; align-items: center; gap: 4px; justify-content: flex-end; width: 100%;">
                                <input type="text" class="base-select-dropdown" 
                                  style="width: 100px; text-align: right; font-weight: bold; padding: 2px 6px; font-size: 0.82rem; height: 26px; border: 1px solid ${room.customRent !== undefined && room.customRent !== null ? 'rgba(0,122,255,0.45)' : 'rgba(0,0,0,0.08)'}; background: ${room.customRent !== undefined && room.customRent !== null ? 'rgba(0,122,255,0.03)' : '#FFF'}; border-radius: var(--radius-md);" 
                                  value="${formatNumberWithDots(Math.round(calculatedRoomCost))}" 
                                  oninput="handleMoneyInput(this)" 
                                  onblur="updateRoomCustomRent('${room.id}', this.value)"
                                  onkeydown="if(event.key==='Enter') this.blur()"
                                  title="${room.customRent !== undefined && room.customRent !== null ? 'Bấm để đổi giá trị thuê (Đang tùy chỉnh)' : 'Bấm để tùy chỉnh giá thuê phòng này (Mặc định tự động)'}">
                                <span style="font-size: 0.72rem; color: var(--text-secondary); font-weight: 600;">đ</span>
                            </div>
                        </td>
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
                        <td style="line-height: 1.8;">
                            <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px;">
                                <div style="flex-grow: 1;">${splitsText}</div>
                                ${noteIconHtml}
                            </div>
                        </td>
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
            
            const hasNote = room.note && room.note.trim() !== "";
            const noteIconClass = hasNote ? "fa-solid fa-comment-dots" : "fa-regular fa-comment-dots";
            const noteIconStyle = hasNote 
                ? "cursor: pointer; font-size: 0.85rem; color: #FF5E00; transition: all 0.2s; display: inline-block; padding: 6px 8px; background: rgba(255, 94, 0, 0.08); border-radius: 6px;" 
                : "cursor: pointer; font-size: 0.85rem; color: var(--text-secondary); opacity: 0.4; transition: all 0.2s; display: inline-block; padding: 6px 8px; border-radius: 6px;";
            
            const safeNoteContent = hasNote 
                ? room.note.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
                : "";

            const tooltipText = hasNote 
                ? `<strong style="color: #34C759; display: block; margin-bottom: 6px; font-size: 0.82rem;"><i class="fa-solid fa-square-check"></i> Đã giải trình phương án:</strong><span style="font-style: italic; white-space: pre-wrap; display: block; font-weight: 500; font-size: 0.8rem; color: #E5E5EA;">${safeNoteContent}</span><hr style="border: 0; border-top: 1px solid rgba(255, 255, 255, 0.15); margin: 8px 0 6px 0;"><span style="font-size: 0.75rem; opacity: 0.7; display: block; text-align: center; color: #FF5E00;"><i class="fa-solid fa-pen"></i> Nhấp chuột để chỉnh sửa</span>`
                : `<span style="opacity: 0.9; display: block; text-align: center; font-size: 0.78rem;"><i class="fa-regular fa-comment-dots"></i> Chưa có giải trình.<br>Nhấp chuột để thêm mới!</span>`;

            const noteIconHtml = `
                <div class="dept-note-tooltip-trigger">
                    <i class="${noteIconClass}" style="${noteIconStyle}" onclick="editRoomNote('${room.id}')" onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='scale(1)'"></i>
                    <div class="custom-note-tooltip">
                        ${tooltipText}
                    </div>
                </div>
            `;

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
                    <td style="line-height: 1.8;">
                        <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px;">
                            <div style="flex-grow: 1;">${splitsText}</div>
                            ${noteIconHtml}
                        </div>
                    </td>
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
        runAllocation();
        renderFacilities();
        renderDashboard();
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
    customConfirm("Xóa Dãy nhà này? Toàn bộ các phòng thuộc Dãy nhà này sẽ được gán lại.", () => {
        appState.rentBlocks = appState.rentBlocks.filter(b => b.id !== blockId);
        saveState();
        renderFacilities();
    });
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
    customConfirm("Xóa phòng học này khỏi hệ thống cơ sở vật chất?", () => {
        appState.rooms = appState.rooms.filter(r => r.id !== roomId);
        saveState();
        renderFacilities();
    });
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
    loadMasterIndex();

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
    const savedCloudCode = localStorage.getItem("XTD_CLOUD_PROJECT_CODE") || "TOMDEPTRAI";
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
// Chỉ cho phép tạo tài liệu mới trên Cloud khi người dùng chủ động "Tạo kỳ mới".
// Nếu không có cờ này, kết nối tới mã kỳ không tồn tại sẽ bị chặn thay vì
// tự đẩy dữ liệu máy (có thể rỗng) lên làm bản gốc — tránh ghi đè/tạo rác.
let allowCreateDocId = null;

function connectCloudSync(projectCode) {
    if (!projectCode || projectCode.trim() === "") {
        // Disconnect
        currentProjectCode = "";
        localStorage.removeItem("XTD_CLOUD_PROJECT_CODE");
        const selector = document.getElementById("month_selector");
        if (selector) selector.value = "";
        updateCloudSyncUI("offline");
        return;
    }

    projectCode = projectCode.trim().toUpperCase().replace(/[^A-Z0-9_]/g, "");
    currentProjectCode = projectCode;
    localStorage.setItem("XTD_CLOUD_PROJECT_CODE", projectCode);
    const selector = document.getElementById("month_selector");
    if (selector && selector.value !== projectCode) {
        selector.value = projectCode;
    }

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
            ensureStateCompatibility(appState); // Chạy kiểm tra và bổ sung kịch bản giả lập đầy đủ nếu đám mây bị lệch pha
            saveStateLocalOnly(); 
            
            // Chạy lại toán và làm mới giao diện
            runAllocation();
            
            // Làm mới tab đang mở
            const activeTab = document.querySelector(".nav-item.active")?.getAttribute("data-tab") || "view_dashboard";
            switchTab(activeTab);
            
            isSyncingFromCloud = false;
            updateCloudSyncUI("online");
        } else if (allowCreateDocId === projectCode) {
            // Đang trong luồng "Tạo kỳ mới": đẩy dữ liệu hiện tại lên làm dữ liệu gốc ban đầu
            allowCreateDocId = null;
            console.log("Cloud document is empty. Initializing with local data...");
            pushLocalDataToCloud();
        } else {
            // Mã kỳ không tồn tại trên Cloud: KHÔNG tự đẩy dữ liệu máy lên nữa (chống ghi đè/tạo rác)
            console.warn("Kỳ báo cáo không tồn tại trên Cloud:", projectCode);
            if (window.firestoreUnsubscribe) {
                window.firestoreUnsubscribe();
                window.firestoreUnsubscribe = null;
            }
            currentProjectCode = "";
            localStorage.removeItem("XTD_CLOUD_PROJECT_CODE");
            updateCloudSyncUI("offline");
            renderMonthSelector();
            customConfirm('Kỳ báo cáo "' + projectCode + '" không tồn tại trên Đám mây nên không thể mở. Vui lòng chọn kỳ khác trong danh sách.');
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

// Tải bản sao lưu TOÀN BỘ về máy: mọi kỳ báo cáo + danh mục, gói trong 1 file JSON.
// Không cần mật khẩu vì chỉ tải về máy người đang dùng, không sửa gì trên Cloud.
async function downloadFullBackup() {
    if (!firebaseDb) {
        customConfirm("Cần có kết nối mạng (Cloud) để tải bản sao lưu. Vui lòng kiểm tra kết nối rồi thử lại.");
        return;
    }
    const btn = document.getElementById("backup_all_btn");
    try {
        if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang tải...'; }
        const snap = await firebaseDb.collection("sessions").get();
        const backup = {
            app: "cost-allocation-app (Xanh Tuệ Đức)",
            exportedAt: new Date().toISOString(),
            note: "Bản sao lưu toàn bộ collection sessions trên Firestore. Mỗi khóa trong 'docs' là một kỳ báo cáo (hoặc danh mục MASTER_INDEX_V2).",
            docs: {}
        };
        snap.forEach(d => { backup.docs[d.id] = d.data(); });
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "SaoLuu_PhanBoChiPhi_" + new Date().toISOString().slice(0, 10) + ".json";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(a.href);
        customConfirm("Đã tải bản sao lưu toàn bộ (" + snap.size + " gói dữ liệu) về thư mục Tải về (Downloads) của máy. Hãy cất file này ở nơi an toàn (Google Drive, USB...).");
    } catch (e) {
        console.error("Lỗi sao lưu:", e);
        customConfirm("Không thể tải bản sao lưu: " + e.message);
    } finally {
        if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-download"></i> Sao lưu'; }
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

/* ==========================================================================
   MONTH MANAGEMENT LOGIC (MASTER INDEX & PASSWORD)
   ========================================================================== */

let masterIndexData = { months: [] };

// --- Mã hoá một chiều mật khẩu kỳ báo cáo (SHA-256, muối = docId) ---
// Trên Cloud chỉ lưu passwordHash, không lưu mật khẩu trần. Trả về null nếu
// trình duyệt không hỗ trợ (khi đó giữ cơ chế cũ để không khoá người dùng).
async function hashMonthPassword(docId, plainPw) {
    if (!window.crypto || !crypto.subtle || !window.TextEncoder) return null;
    try {
        const data = new TextEncoder().encode(String(docId).toUpperCase() + ":" + plainPw);
        const buf = await crypto.subtle.digest("SHA-256", data);
        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
    } catch (e) {
        return null;
    }
}

async function verifyMonthPassword(monthObj, inputPw) {
    if (monthObj.passwordHash) {
        const h = await hashMonthPassword(monthObj.docId, inputPw);
        return h !== null && h === monthObj.passwordHash;
    }
    return inputPw === (monthObj.password || "");
}

// Chuyển các mật khẩu trần còn sót trong Master Index sang dạng mã hoá (chạy 1 lần mỗi khi phát hiện)
async function migrateMasterIndexPasswords() {
    if (!firebaseDb || !masterIndexData.months) return;
    const needs = masterIndexData.months.filter(m => m.password && !m.passwordHash);
    if (needs.length === 0) return;
    try {
        const hashes = [];
        for (const m of needs) {
            const h = await hashMonthPassword(m.docId, m.password);
            if (!h) return; // trình duyệt không hỗ trợ mã hoá — giữ nguyên
            hashes.push(h);
        }
        needs.forEach((m, i) => {
            m.passwordHash = hashes[i];
            delete m.password;
        });
        await firebaseDb.collection("sessions").doc("MASTER_INDEX_V2").set(masterIndexData);
        console.log("Đã mã hoá " + needs.length + " mật khẩu kỳ báo cáo trong Master Index.");
    } catch (e) {
        console.error("Không thể mã hoá mật khẩu Master Index:", e);
    }
}

function loadMasterIndex() {
    if (!firebaseDb) {
        if (typeof firebase !== 'undefined') {
            try {
                const firebaseConfig = {
                    apiKey: "AIzaSyBqUnifWKaPeZ03q9cLMCgQNQbQm6mmX5M",
                    authDomain: "xanh-tue-duc-apps.firebaseapp.com",
                    projectId: "xanh-tue-duc-apps",
                    storageBucket: "xanh-tue-duc-apps.firebasestorage.app",
                    messagingSenderId: "955600480894",
                    appId: "1:955600480894:web:e2bc9d0d34f0d6118dcd83"
                };
                firebase.initializeApp(firebaseConfig);
                firebaseDb = firebase.firestore();
            } catch (e) {
                // Ignore if already initialized
                firebaseDb = firebase.firestore();
            }
        }
    }
    
    if (!firebaseDb) {
        const savedCloudCode = localStorage.getItem("XTD_CLOUD_PROJECT_CODE");
        if (savedCloudCode && !masterIndexData.months.find(m => m.docId.toUpperCase() === savedCloudCode.toUpperCase())) {
            masterIndexData.months.push({
                name: "Dữ liệu hiện tại (" + savedCloudCode + ")",
                docId: savedCloudCode,
                password: savedCloudCode
            });
        }
        renderMonthSelector();
        return;
    }

    firebaseDb.collection("sessions").doc("MASTER_INDEX_V2").get()
        .then(doc => {
            if (doc.exists) {
                masterIndexData = doc.data();
                if (!masterIndexData.months) masterIndexData.months = [];
            } else {
                masterIndexData = { months: [] };
            }
            
            // Auto-migrate old project code into the new Master Index
            // (chỉ thêm khi tài liệu đó THẬT SỰ tồn tại trên Cloud, tránh mục ma trong menu)
            const savedCloudCode = localStorage.getItem("XTD_CLOUD_PROJECT_CODE");
            if (savedCloudCode && !masterIndexData.months.find(m => m.docId === savedCloudCode)) {
                firebaseDb.collection("sessions").doc(savedCloudCode).get().then(oldDoc => {
                    if (!oldDoc.exists) return;
                    masterIndexData.months.push({
                        name: "Dữ liệu cũ (" + savedCloudCode + ")",
                        docId: savedCloudCode,
                        password: savedCloudCode // The old code is the password
                    });
                    firebaseDb.collection("sessions").doc("MASTER_INDEX_V2").set(masterIndexData);
                    renderMonthSelector();
                    migrateMasterIndexPasswords();
                });
            }

            renderMonthSelector();
            migrateMasterIndexPasswords();
        })
        .catch(e => {
            console.error("Lỗi khi tải Master Index:", e);
            const savedCloudCode = localStorage.getItem("XTD_CLOUD_PROJECT_CODE");
            if (savedCloudCode && !masterIndexData.months.find(m => m.docId.toUpperCase() === savedCloudCode.toUpperCase())) {
                masterIndexData.months.push({
                    name: "Dữ liệu hiện tại (" + savedCloudCode + ")",
                    docId: savedCloudCode,
                    password: savedCloudCode
                });
            }
            renderMonthSelector();
        });
}

function renderMonthSelector() {
    const selector = document.getElementById("month_selector");
    if (!selector) return;
    
    selector.innerHTML = '';
    
    // Option mặc định
    let optDefault = document.createElement("option");
    optDefault.value = "";
    optDefault.text = "-- Chọn kỳ báo cáo --";
    selector.appendChild(optDefault);

    // Nhóm Kỳ Báo Cáo (ưu tiên hiện đầu tiên)
    if (masterIndexData.months && masterIndexData.months.length > 0) {
        const dataGroup = document.createElement("optgroup");
        dataGroup.label = "Kỳ Báo Cáo";
        
        const sortedMonths = [...masterIndexData.months].reverse();
        sortedMonths.forEach(m => {
            const opt = document.createElement("option");
            opt.value = m.docId;
            opt.text = m.name;
            dataGroup.appendChild(opt);
        });
        
        selector.appendChild(dataGroup);
    }

    // Nhóm Thao tác (ở cuối, phụ)
    const actionGroup = document.createElement("optgroup");
    actionGroup.label = "Thao tác";
    
    let optCreate = document.createElement("option");
    optCreate.value = "__ACTION_CREATE__";
    optCreate.text = "+ Tạo kỳ mới...";
    actionGroup.appendChild(optCreate);
    
    let optRename = document.createElement("option");
    optRename.value = "__ACTION_RENAME__";
    optRename.text = "Đổi tên kỳ hiện tại...";
    actionGroup.appendChild(optRename);
    
    let optChangePw = document.createElement("option");
    optChangePw.value = "__ACTION_CHANGE_PW__";
    optChangePw.text = "Đổi mật khẩu kỳ hiện tại...";
    actionGroup.appendChild(optChangePw);

    let optDelete = document.createElement("option");
    optDelete.value = "__ACTION_DELETE__";
    optDelete.text = "Xóa kỳ hiện tại...";
    actionGroup.appendChild(optDelete);

    selector.appendChild(actionGroup);
    
    if (currentProjectCode) {
        selector.value = currentProjectCode;
    } else {
        selector.value = "";
    }
}

let pendingMonthData = null;

function openMonthPwModal(monthData) {
    pendingMonthData = monthData;
    document.getElementById("month_pw_desc").innerText = `Vui lòng nhập mật khẩu truy cập để mở [${monthData.name}]:`;
    document.getElementById("month_pw_input").value = "";
    document.getElementById("month_pw_error").style.display = "none";
    document.getElementById("month_pw_modal").classList.add("open");
    setTimeout(() => document.getElementById("month_pw_input").focus(), 100);
}

function closeMonthPwModal() {
    pendingMonthData = null;
    document.getElementById("month_pw_modal").classList.remove("open");
    renderMonthSelector(); // Reset lại dropdown
}

async function submitMonthPw() {
    if (!pendingMonthData) return;
    const pwd = document.getElementById("month_pw_input").value.trim();
    if (await verifyMonthPassword(pendingMonthData, pwd)) {
        document.getElementById("month_pw_modal").classList.remove("open");
        connectCloudSync(pendingMonthData.docId);
        pendingMonthData = null;
    } else {
        document.getElementById("month_pw_error").style.display = "block";
        document.getElementById("month_pw_input").focus();
    }
}

function onMonthSelect(selectedDocId) {
    const selector = document.getElementById("month_selector");
    
    if (selectedDocId === "__ACTION_CREATE__") {
        selector.value = currentProjectCode || "";
        createNewMonth();
        return;
    }
    
    if (selectedDocId === "__ACTION_RENAME__") {
        selector.value = currentProjectCode || "";
        renameCurrentMonth();
        return;
    }
    
    if (selectedDocId === "__ACTION_CHANGE_PW__") {
        selector.value = currentProjectCode || "";
        changeCurrentPassword();
        return;
    }

    if (selectedDocId === "__ACTION_DELETE__") {
        selector.value = currentProjectCode || "";
        deleteCurrentMonth();
        return;
    }


    if (!selectedDocId) return;
    const monthData = masterIndexData.months.find(m => m.docId === selectedDocId);
    if (!monthData) return;
    if (selectedDocId === currentProjectCode) return;
    
    if (!monthData.password && !monthData.passwordHash) {
        // Fallback for old data without password
        connectCloudSync(selectedDocId);
        return;
    }
    
    openMonthPwModal(monthData);
}

function renameCurrentMonth() {
    if (!firebaseDb) {
        customConfirm("Tính năng Đổi tên chỉ hoạt động khi có kết nối mạng (Cloud Sync).");
        return;
    }
    const selector = document.getElementById("month_selector");
    if (!selector || !selector.value) {
        customConfirm("Vui lòng chọn một kỳ báo cáo để đổi tên.");
        return;
    }
    const currentDocId = selector.value;
    const monthObj = masterIndexData.months.find(m => m.docId.toUpperCase() === currentDocId.toUpperCase());
    if (!monthObj) {
        customConfirm("Không tìm thấy kỳ báo cáo này trong danh sách để đổi tên.");
        return;
    }

    let defaultName = monthObj.name;
    if (defaultName.startsWith("Dữ liệu hiện tại (")) {
        defaultName = ""; 
    }
    document.getElementById("month_rename_input").value = defaultName;
    document.getElementById("month_rename_modal").classList.add("open");
    setTimeout(() => document.getElementById("month_rename_input").focus(), 100);
}

function submitMonthRename() {
    try {
        const newName = document.getElementById("month_rename_input").value.trim();
        if (newName === "") { customConfirm("Tên không được để trống."); return; }

        if (!currentProjectCode) {
            customConfirm("Lỗi: Chưa chọn kỳ báo cáo nào."); return;
        }

        if (!firebaseDb) {
            customConfirm("Lỗi: Không có kết nối Cloud."); return;
        }

        // Disable nút để tránh bấm 2 lần
        const saveBtn = document.querySelector("#month_rename_modal .btn-primary");
        if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = "Đang lưu..."; }

        // GET mới nhất từ server → sửa → SET lại
        firebaseDb.collection("sessions").doc("MASTER_INDEX_V2").get()
            .then(doc => {
                if (!doc.exists) throw new Error("Không tìm thấy dữ liệu gốc trên Cloud");

                const serverData = doc.data();
                const months = serverData.months || [];
                const idx = months.findIndex(m =>
                    m.docId && m.docId.toUpperCase() === currentProjectCode.toUpperCase()
                );

                if (idx === -1) throw new Error("Không tìm thấy kỳ báo cáo: " + currentProjectCode);

                // Sửa tên trực tiếp trên dữ liệu server
                months[idx].name = newName;

                // SET lại toàn bộ document
                return firebaseDb.collection("sessions").doc("MASTER_INDEX_V2")
                    .set(serverData);
            })
            .then(() => {
                // Cập nhật dữ liệu local
                const localIdx = masterIndexData.months.findIndex(m =>
                    m.docId && m.docId.toUpperCase() === currentProjectCode.toUpperCase()
                );
                if (localIdx !== -1) masterIndexData.months[localIdx].name = newName;

                renderMonthSelector();
                closeModal('month_rename_modal');
                customConfirm("Đã đổi tên kỳ báo cáo thành công!");
            })
            .catch(err => {
                console.error("Lỗi đổi tên:", err);
                customConfirm("Lỗi: " + err.message);
            })
            .finally(() => {
                if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = "Lưu Thay Đổi"; }
            });
    } catch (error) {
        console.error(error);
        customConfirm("Lỗi hệ thống: " + error.message);
    }
}


function changeCurrentPassword() {
    if (!firebaseDb) {
        customConfirm("Tính năng này chỉ hoạt động khi có kết nối Cloud.");
        return;
    }
    if (!currentProjectCode) {
        customConfirm("Vui lòng chọn một kỳ báo cáo trước.");
        return;
    }
    document.getElementById("month_changepw_input").value = "";
    document.getElementById("month_changepw_modal").classList.add("open");
    setTimeout(() => document.getElementById("month_changepw_input").focus(), 100);
}

async function submitChangePassword() {
    try {
        const newPw = document.getElementById("month_changepw_input").value.trim();
        if (newPw === "") { customConfirm("Mật khẩu không được để trống."); return; }

        if (!currentProjectCode || !firebaseDb) {
            customConfirm("Lỗi: Chưa chọn kỳ hoặc không có kết nối Cloud."); return;
        }

        // Mã hoá một chiều trước khi lưu (null nếu trình duyệt không hỗ trợ → lưu kiểu cũ)
        const newHash = await hashMonthPassword(currentProjectCode, newPw);

        const saveBtn = document.querySelector("#month_changepw_modal .btn-primary");
        if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = "Đang lưu..."; }

        // GET → sửa password → SET (cùng pattern đổi tên)
        firebaseDb.collection("sessions").doc("MASTER_INDEX_V2").get()
            .then(doc => {
                if (!doc.exists) throw new Error("Không tìm thấy dữ liệu gốc trên Cloud");

                const serverData = doc.data();
                const months = serverData.months || [];
                const idx = months.findIndex(m =>
                    m.docId && m.docId.toUpperCase() === currentProjectCode.toUpperCase()
                );

                if (idx === -1) throw new Error("Không tìm thấy kỳ: " + currentProjectCode);

                if (newHash) {
                    months[idx].passwordHash = newHash;
                    delete months[idx].password;
                } else {
                    months[idx].password = newPw;
                    delete months[idx].passwordHash;
                }

                return firebaseDb.collection("sessions").doc("MASTER_INDEX_V2")
                    .set(serverData);
            })
            .then(() => {
                const localIdx = masterIndexData.months.findIndex(m =>
                    m.docId && m.docId.toUpperCase() === currentProjectCode.toUpperCase()
                );
                if (localIdx !== -1) {
                    if (newHash) {
                        masterIndexData.months[localIdx].passwordHash = newHash;
                        delete masterIndexData.months[localIdx].password;
                    } else {
                        masterIndexData.months[localIdx].password = newPw;
                        delete masterIndexData.months[localIdx].passwordHash;
                    }
                }

                closeModal('month_changepw_modal');
                customConfirm("Đã đổi mật khẩu thành công!");
            })
            .catch(err => {
                console.error("Lỗi đổi mật khẩu:", err);
                customConfirm("Lỗi: " + err.message);
            })
            .finally(() => {
                if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = "Lưu Mật Khẩu"; }
            });
    } catch (error) {
        console.error(error);
        customConfirm("Lỗi hệ thống: " + error.message);
    }
}

// Doc kỳ đang chờ xóa (dùng chung giữa lúc mở modal và lúc xác nhận)
let pendingDeleteMonth = null;

function deleteCurrentMonth() {
    if (!firebaseDb) {
        customConfirm("Tính năng Xóa chỉ hoạt động khi có kết nối mạng (Cloud Sync).");
        return;
    }
    if (!currentProjectCode) {
        customConfirm("Vui lòng chọn một kỳ báo cáo cần xóa trước.");
        return;
    }
    const monthObj = masterIndexData.months.find(m => m.docId && m.docId.toUpperCase() === currentProjectCode.toUpperCase());
    if (!monthObj) {
        customConfirm("Không tìm thấy kỳ báo cáo này trong danh sách.");
        return;
    }
    pendingDeleteMonth = monthObj;
    document.getElementById("month_delete_name").innerText = monthObj.name || monthObj.docId;
    document.getElementById("month_delete_pw").value = "";
    document.getElementById("month_delete_confirm").value = "";
    document.getElementById("month_delete_error").style.display = "none";
    document.getElementById("month_delete_modal").classList.add("open");
    setTimeout(() => document.getElementById("month_delete_pw").focus(), 100);
}

async function submitMonthDelete() {
    if (!pendingDeleteMonth) return;
    const pw = document.getElementById("month_delete_pw").value.trim();
    const confirmText = document.getElementById("month_delete_confirm").value.trim();
    const errEl = document.getElementById("month_delete_error");
    const errTextEl = document.getElementById("month_delete_error_text");

    // Lớp 1: gõ đúng chữ xác nhận
    if (confirmText.toUpperCase() !== "XOA") {
        errTextEl.innerText = 'Vui lòng gõ đúng chữ "XOA" để xác nhận.';
        errEl.style.display = "block";
        return;
    }
    // Lớp 2: đúng mật khẩu của kỳ (bỏ qua nếu kỳ cũ không đặt mật khẩu)
    const hasPw = !!(pendingDeleteMonth.password || pendingDeleteMonth.passwordHash);
    if (hasPw && !(await verifyMonthPassword(pendingDeleteMonth, pw))) {
        errTextEl.innerText = "Mật khẩu không đúng.";
        errEl.style.display = "block";
        return;
    }

    const delDocId = pendingDeleteMonth.docId;
    const btn = document.querySelector("#month_delete_modal .btn[style*='danger']");
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang xóa...'; }

    try {
        // 1) Xóa tài liệu dữ liệu của kỳ
        await firebaseDb.collection("sessions").doc(delDocId).delete();

        // 2) Gỡ khỏi danh mục MASTER_INDEX_V2 (GET mới nhất → lọc bỏ → SET lại, chống đè lệch)
        const doc = await firebaseDb.collection("sessions").doc("MASTER_INDEX_V2").get();
        if (doc.exists) {
            const serverData = doc.data();
            serverData.months = (serverData.months || []).filter(m => !(m.docId && m.docId.toUpperCase() === delDocId.toUpperCase()));
            await firebaseDb.collection("sessions").doc("MASTER_INDEX_V2").set(serverData);
            masterIndexData = serverData;
        }

        // 3) Nếu đang mở chính kỳ vừa xóa thì ngắt kết nối để không tự tạo lại
        if (currentProjectCode && currentProjectCode.toUpperCase() === delDocId.toUpperCase()) {
            if (window.firestoreUnsubscribe) { window.firestoreUnsubscribe(); window.firestoreUnsubscribe = null; }
            currentProjectCode = "";
            localStorage.removeItem("XTD_CLOUD_PROJECT_CODE");
            updateCloudSyncUI("offline");
        }

        pendingDeleteMonth = null;
        closeModal("month_delete_modal");
        renderMonthSelector();
        customConfirm('Đã xóa vĩnh viễn kỳ báo cáo. Vui lòng chọn một kỳ khác trong danh sách để tiếp tục.');
    } catch (e) {
        console.error("Lỗi xóa kỳ báo cáo:", e);
        errTextEl.innerText = "Lỗi khi xóa: " + e.message;
        errEl.style.display = "block";
    } finally {
        if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-trash"></i> Xóa vĩnh viễn'; }
    }
}

function createNewMonth() {
    if (!firebaseDb) {
        customConfirm("Tính năng Tạo tháng mới chỉ hoạt động khi có kết nối mạng (Cloud Sync). Vui lòng kiểm tra kết nối mạng hoặc tắt trình chặn quảng cáo!");
        return;
    }
    document.getElementById("month_create_name").value = "";
    document.getElementById("month_create_pw").value = "";
    document.getElementById("month_create_error").style.display = "none";
    document.getElementById("month_create_modal").classList.add("open");
    setTimeout(() => document.getElementById("month_create_name").focus(), 100);
}

function closeMonthCreateModal() {
    document.getElementById("month_create_modal").classList.remove("open");
}

async function submitMonthCreate() {
    const newName = document.getElementById("month_create_name").value.trim();
    const newPassword = document.getElementById("month_create_pw").value.trim();

    if (!newName || !newPassword) {
        document.getElementById("month_create_error").style.display = "block";
        return;
    }

    document.getElementById("month_create_error").style.display = "none";

    const randomHash = Math.random().toString(36).substring(2, 8).toUpperCase();
    const cleanName = newName.replace(/[^a-zA-Z0-9]/g, "");
    const newDocId = `XTD_${cleanName}_${randomHash}`;

    const newMonthObj = {
        name: newName,
        docId: newDocId,
        createdAt: new Date().toISOString()
    };
    // Lưu mật khẩu đã mã hoá; nếu trình duyệt không hỗ trợ thì lưu kiểu cũ
    const pwHash = await hashMonthPassword(newDocId, newPassword);
    if (pwHash) {
        newMonthObj.passwordHash = pwHash;
    } else {
        newMonthObj.password = newPassword;
    }

    closeMonthCreateModal();

    firebaseDb.collection("sessions").doc("MASTER_INDEX_V2").set({
        months: firebase.firestore.FieldValue.arrayUnion(newMonthObj)
    }, { merge: true })
    .then(() => {
        masterIndexData.months.push(newMonthObj);
        renderMonthSelector();
        const selector = document.getElementById("month_selector");
        if(selector) selector.value = newDocId;
        allowCreateDocId = newDocId; // cho phép khởi tạo tài liệu mới trên Cloud cho kỳ này
        connectCloudSync(newDocId);
    })
    .catch(e => {
        console.error("Lỗi tạo tháng mới:", e);
        alert("Có lỗi xảy ra khi tạo tháng mới trên Đám mây!");
    });
}

if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", initApp);
} else {
    initApp();
}

// ===================================================================
// DYNAMIC SCENARIO SIMULATION HANDLERS (WHAT-IF PROJECTION ENGINE)
// ===================================================================
function switchScenarioMode(mode) {
    if (!appState.simulation) {
        appState.simulation = {
            active: false,
            fillRate: 80,
            fillRates: {
                "dept_tieuhoc": getActualFillRateForDept("dept_tieuhoc"),
                "dept_thcs": getActualFillRateForDept("dept_thcs"),
                "dept_thpt": getActualFillRateForDept("dept_thpt"),
                "dept_noitru": getActualFillRateForDept("dept_noitru")
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
            // Ensure simulation UI values and sub-labels are synchronized
            updateSimulationUI();
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

function updateSimDeptInfoLabel(did, fillRate, maxCapacity, roomCount) {
    const lblInfo = document.getElementById(`lbl_sim_info_${did}`);
    if (!lblInfo) return;
    
    const deptObj = (appState.departments && Array.isArray(appState.departments)) 
        ? appState.departments.find(d => d.id === did) 
        : null;
    const actualStudents = deptObj ? (deptObj.students || 0) : 0;
    const actualFillRate = maxCapacity > 0 ? Math.round((actualStudents / maxCapacity) * 100) : 0;
    const simulatedStudents = Math.round(maxCapacity * (fillRate / 100));
    
    const simAddedStudents = simulatedStudents - actualStudents;
    const simAddedRate = fillRate - actualFillRate;
    const emptyStudents = Math.max(0, maxCapacity - simulatedStudents);
    const emptyRate = Math.max(0, 100 - fillRate);
    
    let actualBarWidth = actualFillRate;
    let simBarWidth = 0;
    if (fillRate >= actualFillRate) {
        actualBarWidth = actualFillRate;
        simBarWidth = fillRate - actualFillRate;
    } else {
        actualBarWidth = fillRate;
        simBarWidth = 0;
    }
    
    const deptMap = {
        "dept_tieuhoc": { name: "Khối Tiểu học", color: "#007AFF" },
        "dept_thcs": { name: "Khối THCS", color: "#00C7BE" },
        "dept_thpt": { name: "Khối THPT", color: "#AF52DE" },
        "dept_noitru": { name: "Ban Nội trú", color: "#FF9500" }
    };
    const info = deptMap[did] || { name: "Khối học", color: "var(--primary)" };
    
    // Cập nhật động nền Slider Track phân đoạn tương tác [V18]
    const slider = document.getElementById(`slider_sim_fill_rate_${did}`);
    if (slider) {
        slider.style.background = `linear-gradient(to right, #34C759 0%, #34C759 ${actualBarWidth}%, ${info.color} ${actualBarWidth}%, ${info.color} ${actualBarWidth + simBarWidth}%, rgba(0,0,0,0.06) ${actualBarWidth + simBarWidth}%, rgba(0,0,0,0.06) 100%)`;
    }
    
    lblInfo.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px; background: rgba(250, 250, 250, 0.8); border: 1px solid rgba(0,0,0,0.04); padding: 10px 14px; border-radius: 8px; width: 100%;">
            <!-- Hàng 1: Chỉ số đo lường chi tiết -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; font-size: 0.72rem; border-bottom: 1px dashed rgba(0,0,0,0.06); padding-bottom: 8px;">
                <div style="display: flex; flex-direction: column; gap: 2px;">
                    <span style="color: var(--text-secondary); font-size: 0.65rem; font-weight: 550;">THỰC TẾ ĐANG CÓ</span>
                    <span style="color: var(--success); font-weight: 800; font-size: 0.82rem;">${actualStudents} HS <span style="font-weight: 600; font-size: 0.7rem; color: var(--text-secondary);">(${actualFillRate}%)</span></span>
                </div>
                <div style="display: flex; flex-direction: column; gap: 2px; text-align: center; border-left: 1px solid rgba(0,0,0,0.06); border-right: 1px solid rgba(0,0,0,0.06);">
                    <span style="color: var(--text-secondary); font-size: 0.65rem; font-weight: 550;">GIẢ LẬP CẦN THÊM</span>
                    <span style="color: ${fillRate >= actualFillRate ? info.color : 'var(--warning)'}; font-weight: 800; font-size: 0.82rem;">
                        ${fillRate >= actualFillRate ? '+' : ''}${simAddedStudents} HS 
                        <span style="font-weight: 600; font-size: 0.7rem; color: var(--text-secondary);">
                            (${fillRate >= actualFillRate ? '+' : ''}${simAddedRate}%)
                        </span>
                    </span>
                </div>
                <div style="display: flex; flex-direction: column; gap: 2px; text-align: right;">
                    <span style="color: var(--text-secondary); font-size: 0.65rem; font-weight: 550;">CẦN LẤP ĐẦY THÊM</span>
                    <span style="color: #FF9500; font-weight: 800; font-size: 0.82rem;">${emptyStudents} HS <span style="font-weight: 600; font-size: 0.7rem; color: var(--text-secondary);">(${emptyRate}%)</span></span>
                </div>
            </div>
            
            <!-- Hàng 2: Chú thích nhãn phân đoạn -->
            <div style="display: flex; justify-content: space-between; font-size: 0.62rem; color: var(--text-secondary); font-weight: 600; margin-top: 2px; flex-wrap: wrap; gap: 4px;">
                <span style="display: inline-flex; align-items: center; gap: 4px;"><span style="width: 7px; height: 7px; background: #34C759; border-radius: 50%; display: inline-block;"></span> Thực tế (${actualFillRate}%)</span>
                <span style="display: inline-flex; align-items: center; gap: 4px;"><span style="width: 7px; height: 7px; background: ${info.color}; border-radius: 50%; display: inline-block;"></span> Giả lập (${fillRate}%)</span>
                <span style="display: inline-flex; align-items: center; gap: 4px;"><span style="width: 7px; height: 7px; background: rgba(0,0,0,0.15); border-radius: 50%; display: inline-block;"></span> Còn trống (${emptyRate}%)</span>
            </div>
            
            <!-- Hàng 3: Câu thuyết minh nghiệp vụ tự nhiên -->
            <div style="font-size: 0.68rem; color: var(--text-secondary); line-height: 1.4; font-style: italic; background: rgba(0,0,0,0.015); border-left: 2px solid ${fillRate >= actualFillRate ? info.color : '#FF9500'}; padding-left: 6px; margin-top: 2px;">
                ${info.name} hiện có <strong>${actualStudents} HS / ${maxCapacity} HS</strong> sức chứa tối đa (${roomCount.toFixed(1)} phòng). 
                Để lấp đầy 100% cần thêm <strong>${maxCapacity - actualStudents} HS</strong> (tương đương <strong>${100 - actualFillRate}%</strong>). 
                Hiện tại đang giả lập tuyển thêm <strong>${fillRate >= actualFillRate ? '+' : ''}${simAddedStudents} HS</strong> để đạt <strong>${fillRate}%</strong> lấp đầy mục tiêu.
            </div>
        </div>
    `;
}

function updateSimulationUI() {
    if (!appState || !appState.simulation) return;
    
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
        
        if (appState.rooms && Array.isArray(appState.rooms)) {
            appState.rooms.forEach(room => {
                if (room && room.status === "active" && room.type !== "functional" && room.splits && room.splits[did] > 0) {
                    const ratio = room.splits[did] / 100;
                    maxCapacity += (room.capacity || 0) * ratio;
                    roomCount += ratio;
                }
            });
        }
        
        maxCapacity = Math.round(maxCapacity);
        const fillRate = (appState.simulation.fillRates && appState.simulation.fillRates[did] !== undefined) 
            ? appState.simulation.fillRates[did] 
            : 80;
        const simulatedStudents = Math.round(maxCapacity * (fillRate / 100));
        
        const deptObj = (appState.departments && Array.isArray(appState.departments)) 
            ? appState.departments.find(d => d.id === did) 
            : null;
        const actualStudents = deptObj ? (deptObj.students || 0) : 0;
        const actualFillRate = maxCapacity > 0 ? Math.round((actualStudents / maxCapacity) * 100) : 0;
        
        const slider = document.getElementById(`slider_sim_fill_rate_${did}`);
        const lblRate = document.getElementById(`lbl_sim_fill_rate_${did}`);
        const lblInfo = document.getElementById(`lbl_sim_info_${did}`);
        
        // Chỉ cập nhật giá trị nếu người dùng không đang trực tiếp kéo/tương tác với slider đó
        if (slider && document.activeElement !== slider) {
            slider.value = fillRate;
            slider.setAttribute("data-max-capacity", maxCapacity);
            slider.setAttribute("data-room-count", roomCount);
        }
        if (lblRate) lblRate.innerText = fillRate + "%";
        if (lblInfo) {
            updateSimDeptInfoLabel(did, fillRate, maxCapacity, roomCount);
        }
    });

    // Cập nhật giá trị đơn giá học phí giả lập trong UI nếu người dùng không đang nhập liệu vào đó (tránh nhảy con trỏ chuột)
    if (appState.simulation.tuition) {
        const txtTieuhocXanh = document.getElementById("txt_sim_tuition_tieuhoc_xanh");
        const txtThcsXanh = document.getElementById("txt_sim_tuition_thcs_xanh");
        const txtThptThuong = document.getElementById("txt_sim_tuition_thpt_thuong");
        const txtThptXanh = document.getElementById("txt_sim_tuition_thpt_xanh");
        const txtNoitru = document.getElementById("txt_sim_tuition_noitru");

        if (txtTieuhocXanh && document.activeElement !== txtTieuhocXanh) {
            txtTieuhocXanh.value = formatNumberWithDots(appState.simulation.tuition.dept_tieuhoc_xanh);
        }
        if (txtThcsXanh && document.activeElement !== txtThcsXanh) {
            txtThcsXanh.value = formatNumberWithDots(appState.simulation.tuition.dept_thcs_xanh);
        }
        if (txtThptThuong && document.activeElement !== txtThptThuong) {
            txtThptThuong.value = formatNumberWithDots(appState.simulation.tuition.dept_thpt_thuong);
        }
        if (txtThptXanh && document.activeElement !== txtThptXanh) {
            txtThptXanh.value = formatNumberWithDots(appState.simulation.tuition.dept_thpt_xanh);
        }
        if (txtNoitru && document.activeElement !== txtNoitru) {
            txtNoitru.value = formatNumberWithDots(appState.simulation.tuition.dept_noitru);
        }
    }
}

function updateSimDeptFillRateVisual(deptId, val) {
    if (!appState || !appState.simulation || !appState.simulation.fillRates) return;
    const intVal = parseInt(val, 10) || 0;
    appState.simulation.fillRates[deptId] = intVal;

    const lbl = document.getElementById(`lbl_sim_fill_rate_${deptId}`);
    if (lbl) lbl.innerText = intVal + "%";

    const slider = document.getElementById(`slider_sim_fill_rate_${deptId}`);
    const maxCapacity = slider ? parseFloat(slider.getAttribute("data-max-capacity")) || 0 : 0;
    const roomCount = slider ? parseFloat(slider.getAttribute("data-room-count")) || 0 : 0;

    updateSimDeptInfoLabel(deptId, intVal, maxCapacity, roomCount);
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
    
    const lbl = document.getElementById(`lbl_sim_fill_rate_${deptId}`);
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
    renderDepartments();
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
    
    // Tính tổng tiền thuê hiện tại để làm gốc dự phòng nếu chưa điền landlordRent
    const absoluteTotalRent = appState.rentBlocks.reduce((sum, b) => sum + b.totalRent, 0);
    const baseRent = appState.landlordRent > 0 ? appState.landlordRent : (absoluteTotalRent > 0 ? absoluteTotalRent : 0);
    
    blk.totalRent = Math.round(baseRent * (percent / 100));
    
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
        "dept_thcs": { name: "Khối THCS", color: "#00C7BE", icon: "fa-graduation-cap" },
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
        let totalActualStudents = 0;
        let totalRoomFraction = 0;
        let totalSimRevenue = 0;
        
        let rowsHtml = "";
        blockRooms.forEach((room, idx) => {
            const splitRatio = room.splits[deptId] || 0;
            const roomFraction = splitRatio / 100;
            
            const isFunctional = (room.type === "functional");
            
            // Sỹ số thực tế của khối gán cho phòng này
            const shareActualStudents = isFunctional ? 0 : ((room.currentStudents || 0) * roomFraction);
            const roundedActual = Math.round(shareActualStudents);
            totalActualStudents += shareActualStudents;

            // Nếu là phòng chức năng, sức chứa giả lập và sức chứa quy đổi của khối để tính doanh thu = 0
            const shareMaxCapacity = isFunctional ? 0 : (room.capacity * roomFraction);
            
            const simMap = getSimulatedStudentsMapForDept(deptId, fillRate);
            const shareSimStudents = isFunctional ? 0 : (simMap[room.id] || 0);
            
            totalMaxCap += shareMaxCapacity;
            totalSimStudents += shareSimStudents;
            
            // Chỉ cộng dồn quy mô phòng học thường/nội trú vào tổng quy mô lấp đầy doanh thu
            if (!isFunctional) {
                totalRoomFraction += roomFraction;
            }
            
            const roundedSim = Math.round(shareSimStudents);
            const roundedMax = Math.round(shareMaxCapacity);
            const roundedRoomSimRate = shareMaxCapacity > 0 ? Math.round((roundedSim / shareMaxCapacity) * 100) : 0;
            
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
                            <span style="color: var(--text-secondary);">${roundedRoomSimRate}%</span>
                        </div>
                        <div style="width: 100%; height: 6px; background: rgba(0,0,0,0.06); border-radius: 3px; overflow: hidden;">
                            <div style="width: ${roundedRoomSimRate}%; height: 100%; background: ${info.color}; border-radius: 3px; transition: width 0.3s ease;"></div>
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
                    <td style="padding: 12px 10px; text-align: center; font-size: 0.78rem; font-weight: 700; color: var(--success);">
                        ${isFunctional ? '-' : (roundedActual + ' HS')}
                    </td>
                    <td style="padding: 12px 10px; width: 180px;">
                        ${fillProgressHtml}
                    </td>
                </tr>
            `;
        });
        
        const roundedTotalMax = Math.round(totalMaxCap);
        const roundedTotalSim = Math.round(totalSimStudents);
        const roundedTotalActual = Math.round(totalActualStudents);
        
        container.innerHTML = `
            <table style="width: 100%; border-collapse: collapse; text-align: left;">
                <thead>
                    <tr style="border-bottom: 2px solid rgba(0,0,0,0.06); background: rgba(0,0,0,0.01);">
                        <th style="padding: 10px; font-size: 0.75rem; font-weight: 800; color: var(--text-secondary); text-transform: uppercase;">Phòng học</th>
                        <th style="padding: 10px; font-size: 0.75rem; font-weight: 800; color: var(--text-secondary); text-transform: uppercase; text-align: center;">Tỉ lệ của khối</th>
                        <th style="padding: 10px; font-size: 0.75rem; font-weight: 800; color: var(--text-secondary); text-transform: uppercase; text-align: center;">Sức chứa phòng</th>
                        <th style="padding: 10px; font-size: 0.75rem; font-weight: 800; color: var(--text-secondary); text-transform: uppercase; text-align: center;">Sức chứa cho khối</th>
                        <th style="padding: 10px; font-size: 0.75rem; font-weight: 800; color: var(--text-secondary); text-transform: uppercase; text-align: center;">Thực tế gán</th>
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
                        <td style="padding: 14px 10px; text-align: center; font-size: 0.8rem; color: var(--success);">
                            ${roundedTotalActual} HS
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
            const draggedRoom = appState.rooms[fromIndex];
            const targetRoom = appState.rooms[toIndex];
            if (draggedRoom && targetRoom) {
                // Cập nhật blockId của phòng kéo thả khớp với dãy nhà của phòng đích
                draggedRoom.blockId = targetRoom.blockId;
            }
            
            // Thay đổi vị trí của phòng trong mảng dữ liệu
            appState.rooms.splice(fromIndex, 1);
            
            // Tìm lại chỉ mục mới của phòng đích vì mảng đã bị thay đổi sau khi cắt bớt
            const newToIndex = appState.rooms.findIndex(r => r.id === targetRoomId);
            if (newToIndex !== -1) {
                appState.rooms.splice(newToIndex, 0, draggedRoom);
            } else {
                appState.rooms.push(draggedRoom);
            }
            
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
window.updateSimDeptFillRateVisual = updateSimDeptFillRateVisual;
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

function updateRoomCustomRent(roomId, val) {
    const room = appState.rooms.find(r => r.id === roomId);
    if (!room) return;

    const cleanVal = val.trim() === "" ? null : parseMoneyValue(val);
    if (cleanVal === null || cleanVal <= 0) {
        delete room.customRent;
    } else {
        room.customRent = cleanVal;
    }

    saveState();
    const result = runAllocation();
    renderDashboard(result);
    renderFacilities();
}
window.updateRoomCustomRent = updateRoomCustomRent;
window.openProblemsModal = openProblemsModal;
window.goToProblemSolution = goToProblemSolution;



// -------------------------------------------------------------
// MANUAL SYNC LOGIC
// -------------------------------------------------------------
function openManualSyncModal() {
    document.getElementById("manual_sync_error").style.display = "none";
    document.getElementById("manual_sync_input").value = "";
    document.getElementById("manual_sync_modal").classList.add("open");
    setTimeout(() => document.getElementById("manual_sync_input").focus(), 100);
}

function closeManualSyncModal() {
    document.getElementById("manual_sync_modal").classList.remove("open");
}

function submitManualSync() {
    const code = document.getElementById("manual_sync_input").value.trim();
    if (!code) {
        document.getElementById("manual_sync_error").style.display = "block";
        return;
    }
    closeManualSyncModal();

    // Check if code is already in masterIndexData
    // (chỉ thêm vào danh mục khi tài liệu đó thật sự tồn tại trên Cloud)
    if (masterIndexData && !masterIndexData.months.find(m => m.docId.toUpperCase() === code.toUpperCase()) && firebaseDb) {
        firebaseDb.collection("sessions").doc(code.trim().toUpperCase().replace(/[^A-Z0-9_]/g, "")).get().then(d => {
            if (!d.exists) return;
            const newObj = {
                name: "Dữ liệu (" + code + ")",
                docId: code,
                password: code // fallback for legacy code
            };
            masterIndexData.months.push(newObj);
            firebaseDb.collection("sessions").doc("MASTER_INDEX_V2").set({
                months: firebase.firestore.FieldValue.arrayUnion(newObj)
            }, { merge: true }).catch(e => console.error("Lỗi cập nhật Index:", e));
            renderMonthSelector();
            migrateMasterIndexPasswords();
        }).catch(e => console.error("Lỗi kiểm tra mã:", e));
    }

    connectCloudSync(code);
}

// ===================================================================
// PASSWORD PROTECTION LOGIC
// ===================================================================
function handleMonthSelectionChange() {
    const selector = document.getElementById("month_selector");
    const selectedDocId = selector.value;
    
    // Nếu chọn mục rỗng
    if (!selectedDocId) {
        connectCloudSync("");
        return;
    }
    
    // Tìm trong masterIndexData xem có password không
    const monthObj = masterIndexData.months.find(m => m.docId === selectedDocId);
    
    // Nếu không có mật khẩu (các kỳ báo cáo cũ) hoặc mật khẩu trống
    if (!monthObj || (!monthObj.password && !monthObj.passwordHash)) {
        connectCloudSync(selectedDocId);
    } else {
        // Có mật khẩu -> hiển thị form nhập
        pendingMonthSelection = selectedDocId;
        document.getElementById("month_password_input").value = "";
        document.getElementById("month_password_error").style.display = "none";
        document.getElementById("month_password_modal").classList.add("open");
        setTimeout(() => document.getElementById("month_password_input").focus(), 100);
    }
}

function cancelMonthSelection() {
    document.getElementById("month_password_modal").classList.remove("open");
    pendingMonthSelection = null;
    
    // Khôi phục lại selector về giá trị cũ (currentProjectCode)
    const selector = document.getElementById("month_selector");
    if (selector) {
        selector.value = currentProjectCode || "";
    }
}

async function submitMonthPassword() {
    const input = document.getElementById("month_password_input").value.trim();
    if (!pendingMonthSelection) return;

    const monthObj = masterIndexData.months.find(m => m.docId === pendingMonthSelection);
    if (!monthObj) return;

    if (await verifyMonthPassword(monthObj, input)) {
        // Đúng mật khẩu
        document.getElementById("month_password_modal").classList.remove("open");
        connectCloudSync(pendingMonthSelection);
        pendingMonthSelection = null;
    } else {
        // Sai mật khẩu
        document.getElementById("month_password_error").style.display = "block";
    }
}
