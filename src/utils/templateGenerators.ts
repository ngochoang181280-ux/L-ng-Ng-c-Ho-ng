import { Question, QuestionLevel, LessonPlan, LessonActivity } from '../types';

/**
 * Trình kích hoạt tải file về máy tính cho giáo viên
 * Tự động thêm UTF-8 BOM (\uFEFF) cho định dạng CSV để Microsoft Excel mở tiếng Việt không bị lỗi font
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain;charset=utf-8') {
  let blobContent = content;
  if (filename.endsWith('.csv') && !content.startsWith('\uFEFF')) {
    blobContent = '\uFEFF' + content;
  }
  const blob = new Blob([blobContent], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ============================================================================
// 1. FILE MẪU & BỘ XỬ LÝ CHO NGÂN HÀNG CÂU HỎI TRẮC NGHIỆM
// ============================================================================

/**
 * Tạo file mẫu Excel (.csv) cho Ngân hàng câu hỏi
 */
export function getQuestionTemplateCSV(): string {
  const headers = [
    'Mã môn (math/lit/eng/phys/chem/bio/hist/geo)',
    'Mức độ (Nhận biết/Thông hiểu/Vận dụng/Vận dụng cao)',
    'Chuyên đề / Bài học',
    'Nội dung câu hỏi',
    'Phương án A',
    'Phương án B',
    'Phương án C',
    'Phương án D',
    'Đáp án đúng (A/B/C/D)',
    'Lời giải chi tiết / Hướng dẫn giải'
  ];

  const rows = [
    [
      'math',
      'Nhận biết',
      'Mệnh đề & Tập hợp',
      'Trong các câu sau, câu nào là một mệnh đề toán học?',
      'Hôm nay trời đẹp quá!',
      'Số 15 là số nguyên tố.',
      'Bạn có thích học môn Toán không?',
      'Hãy làm bài tập về nhà ngay!',
      'B',
      'Mệnh đề toán học là một khẳng định đúng hoặc sai.'
    ],
    [
      'math',
      'Nhận biết',
      'Hàm số bậc hai',
      'Đồ thị hàm số bậc hai y = ax² + bx + c (a ≠ 0) là một đường cong có tên gọi là gì?',
      'Đường Elip',
      'Đường Parabol',
      'Đường Hypebol',
      'Đường tròn',
      'B',
      'Đồ thị hàm số bậc hai luôn là một đường parabol.'
    ],
    [
      'math',
      'Thông hiểu',
      'Mệnh đề & Tập hợp',
      'Cho hai tập hợp A = {1; 2; 3; 4} và B = {3; 4; 5; 6}. Giao của hai tập hợp A ∩ B là:',
      '{1; 2; 5; 6}',
      '{3; 4}',
      '{1; 2; 3; 4; 5; 6}',
      'Tập hợp rỗng',
      'B',
      'Giao của hai tập hợp A và B gồm các phần tử vừa thuộc A vừa thuộc B là 3 và 4.'
    ],
    [
      'math',
      'Vận dụng',
      'Hàm số bậc hai',
      'Tọa độ đỉnh I của parabol y = x² - 4x + 3 là điểm nào sau đây?',
      'I(2; -1)',
      'I(-2; 15)',
      'I(4; 3)',
      'I(1; 0)',
      'A',
      'x_I = -b/(2a) = 4/2 = 2. Thay vào ta được y_I = 2² - 4(2) + 3 = -1. Đỉnh I(2; -1).'
    ],
    [
      'math',
      'Vận dụng cao',
      'Hàm số bậc hai',
      'Một cổng parabol có chiều cao h = 4m và chiều rộng chân cổng w = 4m. Tìm chiều cao cổng tại điểm cách chân cổng 1m.',
      '3m',
      '2.5m',
      '3.5m',
      '2m',
      'A',
      'Chọn hệ trục tọa độ gốc tại chân cổng, phương trình parabol y = -x² + 4x. Tại x = 1m => y = 3m.'
    ]
  ];

  const escapeCSV = (str: string) => {
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvLines = [
    headers.map(escapeCSV).join(','),
    ...rows.map(row => row.map(escapeCSV).join(','))
  ];

  return csvLines.join('\r\n');
}

/**
 * Tạo file mẫu Word / Văn bản thuần (.txt) cho Ngân hàng câu hỏi
 */
export function getQuestionTemplateTXT(): string {
  return `=== MẪU SOẠN CÂU HỎI TRẮC NGHIỆM CHUẨN BỘ GIÁO DỤC & ĐÀO TẠO ===
Hướng dẫn sử dụng:
1. Thầy/Cô có thể điền các câu hỏi theo cú pháp dưới đây trên Word hoặc Notepad.
2. Sau khi soạn xong, copy toàn bộ nội dung và dán vào phần mềm, hoặc tải file .txt lên.
3. Phần mềm sẽ tự động nhận diện mức độ, câu hỏi, 4 phương án, đáp án đúng và lời giải chi tiết.

[Môn: Toán] [Mức độ: Nhận biết] [Chuyên đề: Mệnh đề & Tập hợp]
Câu 1: Trong các câu sau, câu nào là một mệnh đề toán học?
A. Hôm nay trời đẹp quá!
B. Số 15 là số nguyên tố.
C. Bạn có thích học môn Toán không?
D. Hãy làm bài tập về nhà ngay!
Đáp án: B
Lời giải: Mệnh đề toán học là một khẳng định đúng hoặc khẳng định sai.

[Môn: Toán] [Mức độ: Nhận biết] [Chuyên đề: Hàm số bậc hai]
Câu 2: Đồ thị hàm số bậc hai y = ax² + bx + c (a ≠ 0) là một đường cong có tên gọi là:
A. Đường Elip
B. Đường Parabol
C. Đường Hypebol
D. Đường tròn
Đáp án: B
Lời giải: Đồ thị hàm số bậc hai luôn là một đường parabol.

[Môn: Toán] [Mức độ: Thông hiểu] [Chuyên đề: Mệnh đề & Tập hợp]
Câu 3: Cho hai tập hợp A = {1; 2; 3; 4} và B = {3; 4; 5; 6}. Giao của hai tập hợp A ∩ B là:
A. {1; 2; 5; 6}
B. {3; 4}
C. {1; 2; 3; 4; 5; 6}
D. Tập hợp rỗng
Đáp án: B
Lời giải: Giao của hai tập hợp A và B gồm các phần tử chung {3; 4}.

[Môn: Toán] [Mức độ: Vận dụng] [Chuyên đề: Hàm số bậc hai]
Câu 4: Tọa độ đỉnh I của parabol y = x² - 4x + 3 là điểm nào sau đây?
A. I(2; -1)
B. I(-2; 15)
C. I(4; 3)
D. I(1; 0)
Đáp án: A
Lời giải: x_I = -b/(2a) = 4/2 = 2 => y_I = 2² - 4(2) + 3 = -1. Đỉnh I(2; -1).

[Môn: Toán] [Mức độ: Vận dụng cao] [Chuyên đề: Bài toán thực tế Parabol]
Câu 5: Một cổng vòm hình parabol có chiều cao h = 4m và bề rộng chân cổng d = 4m. Một xe tải chở hàng có chiều ngang 2m muốn qua cổng thì chiều cao tối đa của xe không vượt quá:
A. 3.0 m
B. 3.5 m
C. 2.5 m
D. 2.0 m
Đáp án: A
Lời giải: Gắn trục tọa độ đỉnh tại (0; 4), phương trình y = -x² + 4. Với bề ngang 2m tức x = 1m => y = -1 + 4 = 3m.`;
}

/**
 * Tạo file mẫu JSON cho Ngân hàng câu hỏi
 */
export function getQuestionTemplateJSON(): string {
  const sampleQuestions: Question[] = [
    {
      id: `q-demo-1`,
      subjectId: 'math',
      topic: 'Mệnh đề & Tập hợp',
      level: 'Nhận biết',
      content: 'Trong các câu sau, câu nào là một mệnh đề toán học?',
      options: [
        { key: 'A', text: 'Hôm nay trời đẹp quá!' },
        { key: 'B', text: 'Số 15 là số nguyên tố.' },
        { key: 'C', text: 'Bạn có thích học môn Toán không?' },
        { key: 'D', text: 'Hãy làm bài tập về nhà ngay!' },
      ],
      correctAnswer: 'B',
      explanation: 'Mệnh đề toán học là một khẳng định đúng hoặc sai.',
    },
    {
      id: `q-demo-2`,
      subjectId: 'math',
      topic: 'Hàm số bậc hai',
      level: 'Thông hiểu',
      content: 'Trục đối xứng của parabol y = 2x² - 4x + 1 là đường thẳng có phương trình:',
      options: [
        { key: 'A', text: 'x = 1' },
        { key: 'B', text: 'x = -1' },
        { key: 'C', text: 'x = 2' },
        { key: 'D', text: 'y = 1' },
      ],
      correctAnswer: 'A',
      explanation: 'Trục đối xứng của parabol y = ax² + bx + c là x = -b/(2a) = 4/(2*2) = 1.',
    }
  ];
  return JSON.stringify(sampleQuestions, null, 2);
}

// ============================================================================
// 2. FILE MẪU & BỘ XỬ LÝ CHO GIÁO ÁN (KẾ HOẠCH BÀI DẠY CV 5512)
// ============================================================================

/**
 * Tạo file mẫu Excel (.csv) cho Giáo án CV 5512
 */
export function getLessonPlanTemplateCSV(): string {
  const headers = [
    'Tên bài dạy',
    'Mã môn (math/lit/eng/phys/chem/bio...)',
    'Chương / Chủ đề',
    'Khối lớp (10/11/12)',
    'Số tiết',
    'Mục tiêu Kiến thức',
    'Mục tiêu Năng lực',
    'Mục tiêu Phẩm chất',
    'Thiết bị dạy học và học liệu',
    'HĐ1_Tên', 'HĐ1_Mục tiêu', 'HĐ1_Nội dung', 'HĐ1_Sản phẩm', 'HĐ1_Thực hiện',
    'HĐ2_Tên', 'HĐ2_Mục tiêu', 'HĐ2_Nội dung', 'HĐ2_Sản phẩm', 'HĐ2_Thực hiện',
    'HĐ3_Tên', 'HĐ3_Mục tiêu', 'HĐ3_Nội dung', 'HĐ3_Sản phẩm', 'HĐ3_Thực hiện',
    'HĐ4_Tên', 'HĐ4_Mục tiêu', 'HĐ4_Nội dung', 'HĐ4_Sản phẩm', 'HĐ4_Thực hiện',
    'Ghi chú'
  ];

  const rows = [
    [
      'BÀI 4: HỆ BẤT PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN',
      'math',
      'Chương II: Bất phương trình và Hệ bất phương trình bậc nhất hai ẩn',
      '10',
      '2',
      'Nhận biết hệ bất phương trình bậc nhất hai ẩn. Biểu diễn miền nghiệm của hệ bất phương trình trên mặt phẳng tọa độ.',
      'Năng lực tư duy và lập luận toán học, năng lực giải quyết vấn đề toán học qua bài toán quy hoạch tuyến tính thực tiễn.',
      'Chăm chỉ, trung thực, tinh thần hợp tác nhóm trong học tập.',
      'Máy chiếu, SGK, thước kẻ, giấy kẻ ô li, phiếu học tập số 1 và 2.',
      'Hoạt động 1: Khởi động (5 phút)', 'Gợi mở bài toán sản xuất hai loại sản phẩm với nguồn nguyên liệu giới hạn.', 'Đọc tình huống xưởng may áo sơ mi và áo khoác.', 'Hệ các điều kiện ràng buộc đại số ban đầu.', 'GV nêu đề bài -> HS thảo luận nhanh 3 phút.',
      'Hoạt động 2: Hình thành kiến thức (20 phút)', 'Nắm vững quy tắc xác định miền nghiệm của hệ bất phương trình.', 'Biểu diễn từng nửa mặt phẳng và lấy phần giao chung.', 'Miền đa giác nghiệm trên hệ trục Oxy.', 'HS làm việc theo phiếu học tập cá nhân -> Nhóm đối chiếu.',
      'Hoạt động 3: Luyện tập (12 phút)', 'Rèn kỹ năng gạch bỏ miền không thỏa mãn và tìm tọa độ các đỉnh của miền nghiệm.', 'Giải bài tập 1, 2 trang 37 SGK.', 'Học sinh trình bày bài giải lên bảng.', '2 HS lên bảng -> Cả lớp nhận xét -> GV đánh giá.',
      'Hoạt động 4: Vận dụng (8 phút)', 'Ứng dụng tìm giá trị lớn nhất của hàm mục tiêu F(x, y) = ax + by trên miền đa giác.', 'Bài toán tối ưu chi phí nguyên vật liệu.', 'Bảng tính giá trị tại các đỉnh đa giác.', 'Giao nhiệm vụ dự án nhóm nộp vào tiết sau.',
      'Chuẩn bị bảng phụ cho các nhóm học sinh hoạt động.'
    ]
  ];

  const escapeCSV = (str: string) => {
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvLines = [
    headers.map(escapeCSV).join(','),
    ...rows.map(row => row.map(escapeCSV).join(','))
  ];

  return csvLines.join('\r\n');
}

/**
 * Tạo file mẫu Word / Văn bản thuần (.txt) cho Kế hoạch bài dạy chuẩn CV 5512
 */
export function getLessonPlanTemplateTXT(): string {
  return `=== KẾ HOẠCH BÀI DẠY (GIÁO ÁN CHUẨN CÔNG VĂN 5512/BGDĐT) ===
Tên bài dạy: BÀI 4: HỆ BẤT PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN
Môn học: Toán học
Chương / Chủ đề: Chương II: Bất phương trình và Hệ bất phương trình
Khối lớp: 10
Thời lượng: 2 tiết

I. MỤC TIÊU
1. Về kiến thức:
- Nhận biết hệ bất phương trình bậc nhất hai ẩn.
- Biểu diễn được miền nghiệm của hệ bất phương trình bậc nhất hai ẩn trên mặt phẳng tọa độ Oxy.
- Áp dụng giải bài toán tìm giá trị lớn nhất, nhỏ nhất trong kinh tế đời sống (bài toán quy hoạch tuyến tính).

2. Về năng lực:
- Năng lực tư duy và lập luận toán học: phân tích miền nghiệm là giao của các nửa mặt phẳng.
- Năng lực mô hình hóa toán học: chuyển bài toán thực tế sản xuất thành bài toán tối ưu đa giác miền nghiệm.
- Năng lực giao tiếp và hợp tác: làm việc nhóm giải quyết bài tập trên phiếu học tập.

3. Về phẩm chất:
- Chăm chỉ: tích cực tham gia các hoạt động học tập.
- Trách nhiệm: hoàn thành đúng tiến độ sản phẩm học tập được phân công.

II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
- Giáo viên: Máy chiếu, máy tính, phiếu học tập số 1 & 2, thước kẻ, phần mềm GeoGebra.
- Học sinh: SGK, vở ghi, thước kẻ, bút màu gạch miền nghiệm.

III. TIẾN TRÌNH DẠY HỌC
1. Hoạt động 1: Mở đầu / Khởi động (5 phút)
- Mục tiêu: Tạo tình huống có vấn đề từ bài toán tối ưu lợi nhuận của xưởng sản xuất hai loại bánh.
- Nội dung: Học sinh đọc đề bài trong SGK và thiết lập các bất đẳng thức ràng buộc về số giờ làm việc và bột mì.
- Sản phẩm: Hệ bất phương trình chứa các ẩn x, y được viết ra nháp.
- Tổ chức thực hiện: Giáo viên trình chiếu tình huống -> Giao nhiệm vụ cặp đôi trong 3 phút -> Đại diện phát biểu -> GV dẫn dắt vào bài mới.

2. Hoạt động 2: Hình thành kiến thức mới (22 phút)
- Mục tiêu: Xây dựng phương pháp xác định miền nghiệm của hệ bất phương trình trên mặt phẳng tọa độ Oxy.
- Nội dung: Thực hiện theo Phiếu học tập số 1: Vẽ các đường thẳng d1, d2 và gạch bỏ các nửa mặt phẳng không thích hợp.
- Sản phẩm: Miền nghiệm là miền đa giác (tam giác hoặc tứ giác) trên mặt phẳng tọa độ.
- Tổ chức thực hiện: Học sinh làm việc cá nhân trong 7 phút -> Thảo luận nhóm 4 em -> Đại diện nhóm 1 dán sản phẩm lên bảng -> GV nhận xét và chuẩn hóa quy tắc 3 bước.

3. Hoạt động 3: Luyện tập (12 phút)
- Mục tiêu: Củng cố kỹ năng biểu diễn miền nghiệm và xác định tọa độ các đỉnh của miền đa giác.
- Nội dung: Giải bài tập 1, 2 trang 37 trong SGK Toán 10.
- Sản phẩm: Bài làm hoàn chỉnh trong vở học sinh và trên bảng phụ.
- Tổ chức thực hiện: Gọi 2 học sinh lên bảng trình bày -> Học sinh dưới lớp theo dõi, chấm chéo -> Giáo viên nhận xét, sửa lỗi sai phổ biến về nét đứt/nét liền của đường biên.

4. Hoạt động 4: Vận dụng & Mở rộng (6 phút)
- Mục tiêu: Vận dụng kiến thức miền nghiệm giải bài toán tối ưu kinh tế thực tế.
- Nội dung: Hướng dẫn tìm giá trị lớn nhất của hàm mục tiêu F = ax + by tại một trong các đỉnh của miền đa giác.
- Sản phẩm: Bài tập dự án nộp vào tiết sau trên hệ thống.
- Tổ chức thực hiện: Giáo viên giao nhiệm vụ học tập về nhà và hướng dẫn học sinh tra cứu thêm thông tin.

IV. HỒ SƠ DẠY HỌC & GHI CHÚ
- Tiết 1 hoàn thành HĐ1, HĐ2; Tiết 2 thực hiện HĐ3, HĐ4.`;
}

/**
 * Tạo file mẫu JSON cho Giáo án CV 5512
 */
export function getLessonPlanTemplateJSON(): string {
  const samplePlans: LessonPlan[] = [
    {
      id: `plan-sample-01`,
      subjectId: 'math',
      lessonName: 'BÀI 4: HỆ BẤT PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN',
      unit: 'Chương II: Bất phương trình và Hệ bất phương trình',
      gradeLevel: 10,
      periodCount: 2,
      objectives: {
        knowledge: 'Nhận biết hệ bất phương trình bậc nhất hai ẩn. Biểu diễn được miền nghiệm của hệ trên mặt phẳng tọa độ Oxy.',
        competence: 'Năng lực mô hình hóa toán học thông qua giải quyết bài toán quy hoạch tuyến tính trong thực tiễn.',
        qualities: 'Chăm chỉ, trung thực, tinh thần hợp tác nhóm tích cực.',
      },
      teachingEquipments: 'Máy chiếu, SGK Toán 10, phần mềm GeoGebra, thước kẻ, phiếu học tập số 1 & 2.',
      activities: [
        {
          id: 'act-sample-1',
          stepName: 'Hoạt động 1: Khởi động (5 phút)',
          objective: 'Tạo hứng thú từ bài toán tối ưu nguyên vật liệu sản xuất.',
          content: 'Đọc tình huống xưởng sản xuất và thiết lập hệ ràng buộc.',
          product: 'Hệ bất phương trình ràng buộc ban đầu.',
          implementation: 'GV nêu tình huống -> HS thảo luận cặp đôi 3 phút -> GV kết luận dẫn vào bài.',
        },
        {
          id: 'act-sample-2',
          stepName: 'Hoạt động 2: Hình thành kiến thức (20 phút)',
          objective: 'Xây dựng phương pháp xác định miền nghiệm trên mặt phẳng Oxy.',
          content: 'Làm việc với Phiếu học tập số 1: Vẽ các đường thẳng d1, d2 và gạch miền.',
          product: 'Miền nghiệm đa giác phẳng hoàn chỉnh.',
          implementation: 'HS làm việc cá nhân -> Trao đổi nhóm -> GV chốt quy tắc 3 bước.',
        },
        {
          id: 'act-sample-3',
          stepName: 'Hoạt động 3: Luyện tập (12 phút)',
          objective: 'Củng cố kỹ năng vẽ và tìm tọa độ các đỉnh miền nghiệm.',
          content: 'Giải bài tập 1, 2 SGK.',
          product: 'Lời giải bài tập của học sinh.',
          implementation: 'HS lên bảng giải -> Cả lớp góp ý -> GV chấm điểm đánh giá.',
        },
        {
          id: 'act-sample-4',
          stepName: 'Hoạt động 4: Vận dụng (8 phút)',
          objective: 'Ứng dụng tìm giá trị lớn nhất của hàm mục tiêu kinh tế F = ax + by.',
          content: 'Bài toán lập kế hoạch sản xuất tối ưu lợi nhuận.',
          product: 'Báo cáo giải pháp của nhóm nộp tiết sau.',
          implementation: 'Giao nhiệm vụ về nhà.',
        }
      ],
      notes: 'Tiết 1: Hoạt động 1 và 2; Tiết 2: Hoạt động 3 và 4.',
      updatedAt: new Date().toISOString().slice(0, 10),
    }
  ];

  return JSON.stringify(samplePlans, null, 2);
}

// ============================================================================
// 3. THUẬT TOÁN BÓC TÁCH THÔNG MINH (SMART PARSERS)
// ============================================================================

/**
 * Xử lý tách dòng CSV có hỗ trợ dấu phẩy trong ngoặc kép
 */
function parseCSVRow(text: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur.trim());
  return result;
}

/**
 * Bóc tách câu hỏi từ tệp CSV / JSON / TXT / Dán văn bản
 */
export function parseQuestionsFromInput(
  rawInput: string,
  defaultSubjectId: string = 'math'
): { questions: Question[]; warnings: string[] } {
  const warnings: string[] = [];
  const questions: Question[] = [];
  const text = rawInput.trim();

  if (!text) {
    return { questions, warnings: ['Nội dung trống, vui lòng nhập hoặc chọn file!'] };
  }

  // 1. Thử phân tích JSON trước
  if (text.startsWith('[') || text.startsWith('{')) {
    try {
      const parsed = JSON.parse(text);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      arr.forEach((item, index) => {
        if (item.content && item.options && item.options.length >= 2) {
          questions.push({
            id: item.id || `q-import-${Date.now()}-${index}`,
            subjectId: item.subjectId || defaultSubjectId,
            topic: item.topic || 'Chủ đề chung',
            level: (['Nhận biết', 'Thông hiểu', 'Vận dụng', 'Vận dụng cao'].includes(item.level)
              ? item.level
              : 'Nhận biết') as QuestionLevel,
            content: String(item.content).trim(),
            options: item.options.map((opt: any, optIdx: number) => ({
              key: opt.key || ['A', 'B', 'C', 'D'][optIdx] || 'A',
              text: String(opt.text || opt).trim(),
            })),
            correctAnswer: (['A', 'B', 'C', 'D'].includes(item.correctAnswer)
              ? item.correctAnswer
              : 'A') as 'A' | 'B' | 'C' | 'D',
            explanation: item.explanation ? String(item.explanation).trim() : '',
          });
        }
      });

      if (questions.length > 0) {
        return { questions, warnings };
      }
    } catch {
      // Không phải JSON, tiếp tục thử CSV và Plain Text
    }
  }

  // 2. Thử phân tích CSV nếu có các cột đặc trưng
  const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length >= 2 && (lines[0].includes(',') || lines[0].includes('\t'))) {
    const delimiter = lines[0].includes('\t') ? '\t' : ',';
    const firstRowCols = delimiter === '\t' ? lines[0].split('\t') : parseCSVRow(lines[0]);
    const lowerFirst = firstRowCols.map(c => c.toLowerCase());

    const isCSVHeader = lowerFirst.some(c => 
      c.includes('môn') || c.includes('mức độ') || c.includes('nội dung') || c.includes('phương án') || c.includes('đáp án')
    );

    if (isCSVHeader) {
      for (let i = 1; i < lines.length; i++) {
        const row = delimiter === '\t' ? lines[i].split('\t') : parseCSVRow(lines[i]);
        if (row.length < 5) continue;

        // Giả định định dạng chuẩn template:
        // [0: Mon, 1: MucDo, 2: ChuyenDe, 3: NoiDung, 4: A, 5: B, 6: C, 7: D, 8: DapAn, 9: LoiGiai]
        const subjectId = row[0]?.toLowerCase().includes('toán') || row[0]?.toLowerCase() === 'math' 
          ? 'math' 
          : (row[0]?.trim() || defaultSubjectId);
        
        let level: QuestionLevel = 'Nhận biết';
        const levelStr = (row[1] || '').toLowerCase();
        if (levelStr.includes('vận dụng cao') || levelStr.includes('cao')) level = 'Vận dụng cao';
        else if (levelStr.includes('vận dụng')) level = 'Vận dụng';
        else if (levelStr.includes('thông hiểu')) level = 'Thông hiểu';
        else level = 'Nhận biết';

        const topic = row[2] || 'Chủ đề chung';
        const content = row[3] || '';
        const optA = row[4] || '';
        const optB = row[5] || '';
        const optC = row[6] || '';
        const optD = row[7] || '';
        const correctStr = (row[8] || 'A').trim().toUpperCase().slice(0, 1);
        const correctAnswer = (['A', 'B', 'C', 'D'].includes(correctStr) ? correctStr : 'A') as 'A' | 'B' | 'C' | 'D';
        const explanation = row[9] || '';

        if (content && (optA || optB)) {
          questions.push({
            id: `q-csv-${Date.now()}-${i}`,
            subjectId,
            topic,
            level,
            content,
            options: [
              { key: 'A', text: optA },
              { key: 'B', text: optB },
              { key: 'C', text: optC },
              { key: 'D', text: optD },
            ],
            correctAnswer,
            explanation,
          });
        }
      }

      if (questions.length > 0) {
        return { questions, warnings };
      }
    }
  }

  // 3. Phân tích Văn bản thuần (Word / Text) với cú pháp nhận diện:
  // "Câu 1:...", "[Mức độ:...]", "A. ...", "B. ...", "C. ...", "D. ...", "Đáp án: ..."
  const questionBlocks = text.split(/(?:^|\n)(?=(?:\[.*?\]|\bCâu\s+\d+[:.]))/gi);

  questionBlocks.forEach((block, bIdx) => {
    const trimmed = block.trim();
    if (!trimmed) return;

    // Trích xuất Môn và Mức độ từ các thẻ [Môn: ...] [Mức độ: ...]
    let subjectId = defaultSubjectId;
    let level: QuestionLevel = 'Nhận biết';
    let topic = 'Chủ đề chung';

    const subjectMatch = trimmed.match(/\[Môn\s*:\s*([^\]]+)\]/i);
    if (subjectMatch) {
      const s = subjectMatch[1].toLowerCase();
      if (s.includes('toán')) subjectId = 'math';
      else if (s.includes('văn')) subjectId = 'lit';
      else if (s.includes('anh')) subjectId = 'eng';
      else if (s.includes('lí') || s.includes('vật lý') || s.includes('vật lí')) subjectId = 'phys';
      else if (s.includes('hóa')) subjectId = 'chem';
      else if (s.includes('sinh')) subjectId = 'bio';
      else if (s.includes('sử')) subjectId = 'hist';
      else if (s.includes('địa')) subjectId = 'geo';
      else subjectId = subjectMatch[1].trim();
    }

    const levelMatch = trimmed.match(/\[Mức độ\s*:\s*([^\]]+)\]/i);
    if (levelMatch) {
      const l = levelMatch[1].toLowerCase();
      if (l.includes('vận dụng cao') || l.includes('cao')) level = 'Vận dụng cao';
      else if (l.includes('vận dụng')) level = 'Vận dụng';
      else if (l.includes('thông hiểu')) level = 'Thông hiểu';
      else level = 'Nhận biết';
    }

    const topicMatch = trimmed.match(/\[Chuyên đề\s*:\s*([^\]]+)\]/i);
    if (topicMatch) {
      topic = topicMatch[1].trim();
    }

    // Bóc tách nội dung câu hỏi
    let content = '';
    const contentMatch = trimmed.match(/(?:Câu\s+\d+[:.]\s*|^\s*)([\s\S]+?)(?=(?:^[A-D]\.|\n[A-D]\.))/m);
    if (contentMatch) {
      // Loại bỏ các thẻ tag [Môn:...] khỏi content nếu có
      content = contentMatch[1].replace(/\[.*?\]/g, '').trim();
    }

    // Bóc tách các phương án A, B, C, D
    const optAMatch = trimmed.match(/(?:^|\n)\s*A[\.\)]\s*([\s\S]+?)(?=(?:\n\s*[B-D][\.\)]|\n\s*(?:Đáp án|Lời giải)|$))/i);
    const optBMatch = trimmed.match(/(?:^|\n)\s*B[\.\)]\s*([\s\S]+?)(?=(?:\n\s*[C-D][\.\)]|\n\s*(?:Đáp án|Lời giải)|$))/i);
    const optCMatch = trimmed.match(/(?:^|\n)\s*C[\.\)]\s*([\s\S]+?)(?=(?:\n\s*D[\.\)]|\n\s*(?:Đáp án|Lời giải)|$))/i);
    const optDMatch = trimmed.match(/(?:^|\n)\s*D[\.\)]\s*([\s\S]+?)(?=(?:\n\s*(?:Đáp án|Lời giải)|$))/i);

    const optA = optAMatch ? optAMatch[1].trim() : '';
    const optB = optBMatch ? optBMatch[1].trim() : '';
    const optC = optCMatch ? optCMatch[1].trim() : '';
    const optD = optDMatch ? optDMatch[1].trim() : '';

    // Bóc tách đáp án đúng
    let correctAnswer: 'A' | 'B' | 'C' | 'D' = 'A';
    const ansMatch = trimmed.match(/(?:Đáp án|Chọn|Key)\s*[:=]?\s*([A-D])/i);
    if (ansMatch) {
      correctAnswer = ansMatch[1].toUpperCase() as 'A' | 'B' | 'C' | 'D';
    }

    // Bóc tách lời giải
    let explanation = '';
    const expMatch = trimmed.match(/(?:Lời giải|Hướng dẫn|Giải thích)\s*[:=]?\s*([\s\S]+)$/i);
    if (expMatch) {
      explanation = expMatch[1].trim();
    }

    if (content && (optA || optB)) {
      questions.push({
        id: `q-txt-${Date.now()}-${bIdx}`,
        subjectId,
        topic,
        level,
        content,
        options: [
          { key: 'A', text: optA || 'Phương án A' },
          { key: 'B', text: optB || 'Phương án B' },
          { key: 'C', text: optC || 'Phương án C' },
          { key: 'D', text: optD || 'Phương án D' },
        ],
        correctAnswer,
        explanation,
      });
    }
  });

  if (questions.length === 0) {
    warnings.push('Không nhận diện được câu hỏi nào theo chuẩn. Vui lòng kiểm tra lại định dạng hoặc tải file mẫu để xem cú pháp chuẩn.');
  }

  return { questions, warnings };
}

/**
 * Bóc tách Kế hoạch bài dạy (Giáo án CV 5512) từ tệp hoặc văn bản
 */
export function parseLessonPlansFromInput(
  rawInput: string,
  defaultSubjectId: string = 'math'
): { plans: LessonPlan[]; warnings: string[] } {
  const warnings: string[] = [];
  const plans: LessonPlan[] = [];
  const text = rawInput.trim();

  if (!text) {
    return { plans, warnings: ['Nội dung trống, vui lòng nhập hoặc chọn file!'] };
  }

  // 1. Thử JSON
  if (text.startsWith('[') || text.startsWith('{')) {
    try {
      const parsed = JSON.parse(text);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      arr.forEach((item, index) => {
        if (item.lessonName) {
          plans.push({
            id: item.id || `plan-import-${Date.now()}-${index}`,
            subjectId: item.subjectId || defaultSubjectId,
            lessonName: String(item.lessonName).trim(),
            unit: String(item.unit || 'Chương I').trim(),
            gradeLevel: Number(item.gradeLevel) || 10,
            periodCount: Number(item.periodCount) || 2,
            objectives: {
              knowledge: String(item.objectives?.knowledge || '').trim(),
              competence: String(item.objectives?.competence || '').trim(),
              qualities: String(item.objectives?.qualities || '').trim(),
            },
            teachingEquipments: String(item.teachingEquipments || '').trim(),
            activities: Array.isArray(item.activities) && item.activities.length > 0
              ? item.activities.map((act: any, aIdx: number) => ({
                  id: act.id || `act-${aIdx + 1}`,
                  stepName: String(act.stepName || `Hoạt động ${aIdx + 1}`).trim(),
                  objective: String(act.objective || '').trim(),
                  content: String(act.content || '').trim(),
                  product: String(act.product || '').trim(),
                  implementation: String(act.implementation || '').trim(),
                }))
              : [
                  {
                    id: 'act-1',
                    stepName: 'Hoạt động 1: Khởi động (5-7 phút)',
                    objective: 'Tạo tâm thế và hứng thú bài học.',
                    content: 'Nêu câu hỏi tình huống có vấn đề.',
                    product: 'Câu trả lời của học sinh.',
                    implementation: 'GV giao nhiệm vụ -> HS trao đổi -> GV chuẩn hóa.',
                  }
                ],
            notes: item.notes ? String(item.notes).trim() : '',
            updatedAt: new Date().toISOString().slice(0, 10),
          });
        }
      });

      if (plans.length > 0) {
        return { plans, warnings };
      }
    } catch {
      // Không phải JSON
    }
  }

  // 2. Thử CSV
  const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length >= 2 && (lines[0].includes(',') || lines[0].includes('\t'))) {
    const delimiter = lines[0].includes('\t') ? '\t' : ',';
    const firstRowCols = delimiter === '\t' ? lines[0].split('\t') : parseCSVRow(lines[0]);
    const lowerFirst = firstRowCols.map(c => c.toLowerCase());

    const isCSVHeader = lowerFirst.some(c => 
      c.includes('tên bài dạy') || c.includes('bài dạy') || c.includes('mục tiêu') || c.includes('hđ1')
    );

    if (isCSVHeader) {
      for (let i = 1; i < lines.length; i++) {
        const row = delimiter === '\t' ? lines[i].split('\t') : parseCSVRow(lines[i]);
        if (row.length < 5) continue;

        const lessonName = row[0] || 'Kế hoạch bài dạy mới';
        const subjectId = row[1]?.toLowerCase().includes('toán') || row[1]?.toLowerCase() === 'math'
          ? 'math'
          : (row[1]?.trim() || defaultSubjectId);
        const unit = row[2] || 'Chủ đề / Chương bài';
        const gradeLevel = Number(row[3]) || 10;
        const periodCount = Number(row[4]) || 2;
        const knowledge = row[5] || '';
        const competence = row[6] || '';
        const qualities = row[7] || '';
        const teachingEquipments = row[8] || 'Máy chiếu, SGK, phiếu học tập';

        // Đọc 4 hoạt động nếu có cột HĐ1..HĐ4
        const activities: LessonActivity[] = [
          {
            id: `act-1-${Date.now()}`,
            stepName: row[9] || 'Hoạt động 1: Mở đầu / Khởi động (5-7 phút)',
            objective: row[10] || 'Tạo hứng thú và tình huống xuất phát.',
            content: row[11] || 'Xem hình ảnh / video tình huống.',
            product: row[12] || 'Dự đoán của học sinh.',
            implementation: row[13] || 'GV chuyển giao nhiệm vụ -> HS thảo luận -> Báo cáo.',
          },
          {
            id: `act-2-${Date.now()}`,
            stepName: row[14] || 'Hoạt động 2: Hình thành kiến thức mới (20 phút)',
            objective: row[15] || 'Xây dựng kiến thức trọng tâm bài học.',
            content: row[16] || 'Nghiên cứu tài liệu SGK và hoàn thành phiếu học tập.',
            product: row[17] || 'Kiến thức cốt lõi ghi vở.',
            implementation: row[18] || 'Làm việc cá nhân -> Trao đổi nhóm -> GV chốt kiến thức.',
          },
          {
            id: `act-3-${Date.now()}`,
            stepName: row[19] || 'Hoạt động 3: Luyện tập (12 phút)',
            objective: row[20] || 'Vận dụng trực tiếp giải bài tập cơ bản.',
            content: row[21] || 'Giải bài tập trong SGK.',
            product: row[22] || 'Lời giải bài tập của học sinh.',
            implementation: row[23] || 'HS lên bảng trình bày -> Nhận xét -> GV đánh giá.',
          },
          {
            id: `act-4-${Date.now()}`,
            stepName: row[24] || 'Hoạt động 4: Vận dụng & Mở rộng (6 phút)',
            objective: row[25] || 'Ứng dụng kiến thức vào thực tiễn đời sống.',
            content: row[26] || 'Nhiệm vụ thực hành / dự án.',
            product: row[27] || 'Báo cáo sản phẩm nộp tiết sau.',
            implementation: row[28] || 'Giao bài tập về nhà.',
          }
        ];

        const notes = row[29] || '';

        plans.push({
          id: `plan-csv-${Date.now()}-${i}`,
          subjectId,
          lessonName,
          unit,
          gradeLevel,
          periodCount,
          objectives: { knowledge, competence, qualities },
          teachingEquipments,
          activities,
          notes,
          updatedAt: new Date().toISOString().slice(0, 10),
        });
      }

      if (plans.length > 0) {
        return { plans, warnings };
      }
    }
  }

  // 3. Phân tích Văn bản chuẩn Công văn 5512
  const nameMatch = text.match(/(?:Tên bài dạy|BÀI DẠY|KẾ HOẠCH BÀI DẠY)[:\s]+([^\n]+)/i);
  const subjectMatch = text.match(/Môn(?:\s*học)?[:\s]+([^\n]+)/i);
  const gradeMatch = text.match(/(?:Khối|Lớp)[:\s]+(\d+)/i);
  const periodMatch = text.match(/(?:Thời lượng|Số tiết)[:\s]+(\d+)/i);
  const unitMatch = text.match(/(?:Chương|Chủ đề)[:\s]+([^\n]+)/i);

  let subjectId = defaultSubjectId;
  if (subjectMatch) {
    const s = subjectMatch[1].toLowerCase();
    if (s.includes('toán')) subjectId = 'math';
    else if (s.includes('văn')) subjectId = 'lit';
    else if (s.includes('anh')) subjectId = 'eng';
    else if (s.includes('lí') || s.includes('vật lý') || s.includes('vật lí')) subjectId = 'phys';
    else if (s.includes('hóa')) subjectId = 'chem';
    else if (s.includes('sinh')) subjectId = 'bio';
    else if (s.includes('sử')) subjectId = 'hist';
    else if (s.includes('địa')) subjectId = 'geo';
    else subjectId = subjectMatch[1].trim();
  }

  const knowledgeMatch = text.match(/(?:1\.\s*Về\s*kiến\s*thức|Kiến thức)[:\s]+([\s\S]+?)(?=(?:2\.\s*Về\s*năng\s*lực|Năng lực|II\.|$))/i);
  const competenceMatch = text.match(/(?:2\.\s*Về\s*năng\s*lực|Năng lực)[:\s]+([\s\S]+?)(?=(?:3\.\s*Về\s*phẩm\s*chất|Phẩm chất|II\.|$))/i);
  const qualitiesMatch = text.match(/(?:3\.\s*Về\s*phẩm\s*chất|Phẩm chất)[:\s]+([\s\S]+?)(?=(?:II\.|\n[A-Z]{2,}\.|$))/i);
  const equipmentMatch = text.match(/(?:II\.\s*THIẾT\s*BỊ|Thiết bị dạy học)[:\s]+([\s\S]+?)(?=(?:III\.\s*TIẾN\s*TRÌNH|Tiến trình dạy học|$))/i);

  // Bóc tách 4 Hoạt động
  const activities: LessonActivity[] = [];
  const actMatches = text.split(/(?:^|\n)(?=(?:(?:\d+\.\s*)?Hoạt động\s*\d+[:.]))/gi);

  actMatches.forEach((chunk, idx) => {
    const trimmed = chunk.trim();
    if (/Hoạt động\s*\d+/i.test(trimmed)) {
      const stepNameMatch = trimmed.match(/((?:\d+\.\s*)?Hoạt động\s*\d+[^:\n]*[:.]?[^\n]*)/i);
      const objM = trimmed.match(/(?:-\s*Mục tiêu|Mục tiêu)[:\s]+([\s\S]+?)(?=(?:-\s*Nội dung|Nội dung|$))/i);
      const cntM = trimmed.match(/(?:-\s*Nội dung|Nội dung)[:\s]+([\s\S]+?)(?=(?:-\s*Sản phẩm|Sản phẩm|$))/i);
      const prdM = trimmed.match(/(?:-\s*Sản phẩm|Sản phẩm)[:\s]+([\s\S]+?)(?=(?:-\s*Tổ chức thực hiện|Tổ chức thực hiện|$))/i);
      const impM = trimmed.match(/(?:-\s*Tổ chức thực hiện|Tổ chức thực hiện)[:\s]+([\s\S]+)$/i);

      activities.push({
        id: `act-parsed-${idx + 1}`,
        stepName: stepNameMatch ? stepNameMatch[1].trim() : `Hoạt động ${idx + 1}`,
        objective: objM ? objM[1].trim() : '',
        content: cntM ? cntM[1].trim() : '',
        product: prdM ? prdM[1].trim() : '',
        implementation: impM ? impM[1].trim() : '',
      });
    }
  });

  const parsedPlan: LessonPlan = {
    id: `plan-text-${Date.now()}`,
    subjectId,
    lessonName: nameMatch ? nameMatch[1].trim() : 'Kế hoạch bài dạy chuẩn CV 5512',
    unit: unitMatch ? unitMatch[1].trim() : 'Chương I',
    gradeLevel: gradeMatch ? Number(gradeMatch[1]) : 10,
    periodCount: periodMatch ? Number(periodMatch[1]) : 2,
    objectives: {
      knowledge: knowledgeMatch ? knowledgeMatch[1].trim() : '',
      competence: competenceMatch ? competenceMatch[1].trim() : '',
      qualities: qualitiesMatch ? qualitiesMatch[1].trim() : '',
    },
    teachingEquipments: equipmentMatch ? equipmentMatch[1].trim() : 'Máy chiếu, SGK, phiếu học tập.',
    activities: activities.length > 0 ? activities : [
      {
        id: 'act-1',
        stepName: 'Hoạt động 1: Khởi động (5 phút)',
        objective: 'Tạo hứng thú đầu giờ.',
        content: 'Quan sát tình huống thực tế.',
        product: 'Ý kiến thảo luận của học sinh.',
        implementation: 'GV giao việc -> HS thảo luận -> Báo cáo.',
      },
      {
        id: 'act-2',
        stepName: 'Hoạt động 2: Hình thành kiến thức mới (20 phút)',
        objective: 'Tiếp thu kiến thức cốt lõi.',
        content: 'Hoàn thành phiếu học tập số 1.',
        product: 'Ghi chép vở bài học.',
        implementation: 'Làm việc độc lập -> Nhóm -> GV chốt.',
      },
      {
        id: 'act-3',
        stepName: 'Hoạt động 3: Luyện tập (12 phút)',
        objective: 'Luyện kỹ năng giải bài.',
        content: 'Bài tập SGK.',
        product: 'Bài làm trên bảng.',
        implementation: 'HS làm bài -> Nhận xét.',
      },
      {
        id: 'act-4',
        stepName: 'Hoạt động 4: Vận dụng (8 phút)',
        objective: 'Ứng dụng thực tiễn.',
        content: 'Bài toán mở rộng.',
        product: 'Bài thu hoạch.',
        implementation: 'Giao về nhà.',
      }
    ],
    updatedAt: new Date().toISOString().slice(0, 10),
  };

  plans.push(parsedPlan);
  return { plans, warnings };
}

/**
 * Trả về danh sách câu hỏi thử nghiệm nhanh cho giáo viên trải nghiệm với 1 cú click
 */
export function getDemoQuestions(subjectId: string = 'math'): Question[] {
  return [
    {
      id: `q-demo-${Date.now()}-1`,
      subjectId,
      topic: 'Hàm số bậc hai',
      level: 'Nhận biết',
      content: 'Trục đối xứng của đồ thị hàm số y = ax² + bx + c (a ≠ 0) là đường thẳng có phương trình nào?',
      options: [
        { key: 'A', text: 'x = -b / (2a)' },
        { key: 'B', text: 'x = b / (2a)' },
        { key: 'C', text: 'y = -b / (2a)' },
        { key: 'D', text: 'x = -Δ / (4a)' },
      ],
      correctAnswer: 'A',
      explanation: 'Trục đối xứng của parabol y = ax² + bx + c luôn là đường thẳng x = -b / (2a).',
    },
    {
      id: `q-demo-${Date.now()}-2`,
      subjectId,
      topic: 'Hàm số bậc hai',
      level: 'Thông hiểu',
      content: 'Tọa độ đỉnh I của parabol y = x² - 2x + 4 là:',
      options: [
        { key: 'A', text: 'I(1; 3)' },
        { key: 'B', text: 'I(-1; 7)' },
        { key: 'C', text: 'I(2; 4)' },
        { key: 'D', text: 'I(0; 4)' },
      ],
      correctAnswer: 'A',
      explanation: 'x_I = -(-2)/(2*1) = 1; y_I = 1² - 2(1) + 4 = 3 => I(1; 3).',
    },
    {
      id: `q-demo-${Date.now()}-3`,
      subjectId,
      topic: 'Bất phương trình',
      level: 'Vận dụng',
      content: 'Tập nghiệm của bất phương trình bậc hai x² - 5x + 6 ≤ 0 là:',
      options: [
        { key: 'A', text: '[2; 3]' },
        { key: 'B', text: '(-∞; 2] ∪ [3; +∞)' },
        { key: 'C', text: '(2; 3)' },
        { key: 'D', text: '[-3; -2]' },
      ],
      correctAnswer: 'A',
      explanation: 'Tam thức có 2 nghiệm x = 2 và x = 3, hệ số a = 1 > 0 nên f(x) ≤ 0 khi x ∈ [2; 3] (trong trái ngoài cùng).',
    },
    {
      id: `q-demo-${Date.now()}-4`,
      subjectId,
      topic: 'Ứng dụng thực tế Parabol',
      level: 'Vận dụng cao',
      content: 'Một quả bóng được đá lên từ mặt đất có quỹ đạo là parabol h(t) = -5t² + 20t (m). Quả bóng đạt độ cao lớn nhất tại thời điểm nào và độ cao đó bằng bao nhiêu?',
      options: [
        { key: 'A', text: 't = 2s, h_max = 20m' },
        { key: 'B', text: 't = 4s, h_max = 25m' },
        { key: 'C', text: 't = 1s, h_max = 15m' },
        { key: 'D', text: 't = 2s, h_max = 40m' },
      ],
      correctAnswer: 'A',
      explanation: 'Đỉnh parabol đạt tại t = -20 / (2 * (-5)) = 2 giây. Độ cao cực đại h(2) = -5(4) + 20(2) = 20 mét.',
    }
  ];
}
