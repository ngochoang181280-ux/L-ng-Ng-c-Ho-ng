import { Question, ExamPaper, LessonPlan, QuestionLevel, ExamHeaderConfig, ExamMatrix } from '../types';

export const initialQuestionBank: Question[] = [
  // =================== TOÁN HỌC ===================
  // Mức 1: Nhận biết
  {
    id: 'q-m-01',
    subjectId: 'math',
    topic: 'Mệnh đề & Tập hợp',
    level: 'Nhận biết',
    content: 'Trong các câu sau, câu nào là một mệnh đề toán học?',
    options: [
      { key: 'A', text: 'Hôm nay trời đẹp quá!' },
      { key: 'B', text: 'Số 15 là số nguyên tố.' },
      { key: 'C', text: 'Bạn có thích học Toán không?' },
      { key: 'D', text: 'Hãy làm bài tập về nhà ngay!' },
    ],
    correctAnswer: 'B',
    explanation: 'Mệnh đề là một khẳng định đúng hoặc khẳng định sai.',
  },
  {
    id: 'q-m-02',
    subjectId: 'math',
    topic: 'Mệnh đề & Tập hợp',
    level: 'Nhận biết',
    content: 'Ký hiệu nào sau đây dùng để chỉ "x thuộc tập hợp số thực"?',
    options: [
      { key: 'A', text: 'x ∈ ℝ' },
      { key: 'B', text: 'x ⊂ ℝ' },
      { key: 'C', text: 'x ∉ ℝ' },
      { key: 'D', text: 'x = ℝ' },
    ],
    correctAnswer: 'A',
    explanation: 'Ký hiệu phần tử thuộc tập hợp là ∈.',
  },
  {
    id: 'q-m-03',
    subjectId: 'math',
    topic: 'Hàm số bậc hai',
    level: 'Nhận biết',
    content: 'Đồ thị của hàm số bậc hai y = ax² + bx + c (a ≠ 0) là một đường cong có tên gọi là gì?',
    options: [
      { key: 'A', text: 'Đường Hypebol' },
      { key: 'B', text: 'Đường Parabol' },
      { key: 'C', text: 'Đường Elip' },
      { key: 'D', text: 'Đường thẳng' },
    ],
    correctAnswer: 'B',
    explanation: 'Đồ thị hàm số bậc hai y = ax² + bx + c là một parabol.',
  },
  {
    id: 'q-m-04',
    subjectId: 'math',
    topic: 'Vectơ',
    level: 'Nhận biết',
    content: 'Hai vectơ được gọi là bằng nhau nếu chúng:',
    options: [
      { key: 'A', text: 'Cùng độ dài' },
      { key: 'B', text: 'Cùng phương và cùng độ dài' },
      { key: 'C', text: 'Cùng hướng và cùng độ dài' },
      { key: 'D', text: 'Có giá song song với nhau' },
    ],
    correctAnswer: 'C',
    explanation: 'Hai vectơ bằng nhau nếu chúng cùng hướng và cùng độ dài.',
  },
  {
    id: 'q-m-05',
    subjectId: 'math',
    topic: 'Hệ bất phương trình',
    level: 'Nhận biết',
    content: 'Cặp số nào sau đây là nghiệm của bất phương trình bậc nhất hai ẩn 2x - y + 1 > 0?',
    options: [
      { key: 'A', text: '(0; 2)' },
      { key: 'B', text: '(1; 1)' },
      { key: 'C', text: '(-1; 1)' },
      { key: 'D', text: '(0; 3)' },
    ],
    correctAnswer: 'B',
    explanation: 'Thay x = 1, y = 1 vào vế trái: 2(1) - 1 + 1 = 2 > 0 (thỏa mãn).',
  },

  // Mức 2: Thông hiểu
  {
    id: 'q-m-06',
    subjectId: 'math',
    topic: 'Mệnh đề & Tập hợp',
    level: 'Thông hiểu',
    content: 'Cho hai tập hợp A = {1; 2; 3; 4} và B = {3; 4; 5; 6}. Giao của hai tập hợp A ∩ B là:',
    options: [
      { key: 'A', text: '{1; 2; 5; 6}' },
      { key: 'B', text: '{3; 4}' },
      { key: 'C', text: '{1; 2; 3; 4; 5; 6}' },
      { key: 'D', text: '∅' },
    ],
    correctAnswer: 'B',
    explanation: 'Giao của A và B gồm các phần tử vừa thuộc A vừa thuộc B, đó là {3; 4}.',
  },
  {
    id: 'q-m-07',
    subjectId: 'math',
    topic: 'Hàm số bậc hai',
    level: 'Thông hiểu',
    content: 'Tọa độ đỉnh I của parabol y = x² - 4x + 3 là:',
    options: [
      { key: 'A', text: 'I(2; -1)' },
      { key: 'B', text: 'I(-2; 15)' },
      { key: 'C', text: 'I(4; 3)' },
      { key: 'D', text: 'I(2; 1)' },
    ],
    correctAnswer: 'A',
    explanation: 'x_I = -b / (2a) = 4 / 2 = 2. y_I = 2² - 4(2) + 3 = -1. Đỉnh I(2; -1).',
  },
  {
    id: 'q-m-08',
    subjectId: 'math',
    topic: 'Lượng giác trong tam giác',
    level: 'Thông hiểu',
    content: 'Cho tam giác ABC có góc A = 60°, cạnh b = 5, cạnh c = 8. Áp dụng định lí cosin, độ dài cạnh a bằng:',
    options: [
      { key: 'A', text: '7' },
      { key: 'B', text: '√89' },
      { key: 'C', text: '√49' },
      { key: 'D', text: '49' },
    ],
    correctAnswer: 'A',
    explanation: 'a² = b² + c² - 2bc.cosA = 25 + 64 - 2(5)(8)(0.5) = 89 - 40 = 49 => a = 7.',
  },
  {
    id: 'q-m-09',
    subjectId: 'math',
    topic: 'Vectơ',
    level: 'Thông hiểu',
    content: 'Cho hình bình hành ABCD có tâm O. Khẳng định nào sau đây là khẳng định ĐÚNG?',
    options: [
      { key: 'A', text: 'vectơ AB + vectơ AD = vectơ AC' },
      { key: 'B', text: 'vectơ AB + vectơ BC = vectơ CA' },
      { key: 'C', text: 'vectơ OA + vectơ OB = vectơ 0' },
      { key: 'D', text: 'vectơ AC = vectơ BD' },
    ],
    correctAnswer: 'A',
    explanation: 'Quy tắc hình bình hành: vectơ AB + vectơ AD = vectơ AC.',
  },

  // Mức 3: Vận dụng
  {
    id: 'q-m-10',
    subjectId: 'math',
    topic: 'Bất phương trình & Dấu tam thức',
    level: 'Vận dụng',
    content: 'Tất cả các giá trị của tham số m để phương trình x² - 2mx + m + 2 = 0 có hai nghiệm phân biệt là:',
    options: [
      { key: 'A', text: 'm < -1 hoặc m > 2' },
      { key: 'B', text: '-1 < m < 2' },
      { key: 'C', text: 'm ≤ -1 hoặc m ≥ 2' },
      { key: 'D', text: 'm > 2' },
    ],
    correctAnswer: 'A',
    explanation: 'Δ\' = m² - (m + 2) = m² - m - 2 > 0 <=> (m + 1)(m - 2) > 0 <=> m < -1 hoặc m > 2.',
  },
  {
    id: 'q-m-11',
    subjectId: 'math',
    topic: 'Tọa độ vectơ trong mặt phẳng',
    level: 'Vận dụng',
    content: 'Trong mặt phẳng Oxy, cho tam giác ABC với A(1; 2), B(-2; 6), C(9; 8). Tọa độ trọng tâm G của tam giác ABC là:',
    options: [
      { key: 'A', text: 'G(2; 5)' },
      { key: 'B', text: 'G(8; 16)' },
      { key: 'C', text: 'G(8/3; 16/3)' },
      { key: 'D', text: 'G(3; 6)' },
    ],
    correctAnswer: 'C',
    explanation: 'x_G = (1 - 2 + 9)/3 = 8/3, y_G = (2 + 6 + 8)/3 = 16/3.',
  },
  {
    id: 'q-m-12',
    subjectId: 'math',
    topic: 'Tối ưu hóa kinh tế bằng BPT',
    level: 'Vận dụng',
    content: 'Một xưởng sản xuất hai loại sản phẩm A và B. Để đạt doanh thu lớn nhất theo miền nghiệm đa giác xác định bởi các đỉnh (0; 0), (0; 4), (3; 2), (4; 0) với hàm mục tiêu F(x, y) = 3x + 2y (triệu đồng), giá trị lớn nhất của F là:',
    options: [
      { key: 'A', text: '12 triệu đồng' },
      { key: 'B', text: '13 triệu đồng' },
      { key: 'C', text: '8 triệu đồng' },
      { key: 'D', text: '14 triệu đồng' },
    ],
    correctAnswer: 'B',
    explanation: 'F(0,0)=0; F(0,4)=8; F(3,2)=3(3)+2(2)=13; F(4,0)=12. Giá trị lớn nhất là 13 tại điểm (3; 2).',
  },

  // Mức 4: Vận dụng cao
  {
    id: 'q-m-13',
    subjectId: 'math',
    topic: 'Bất đẳng thức & Cực trị',
    level: 'Vận dụng cao',
    content: 'Cho hai số thực x, y thỏa mãn x² + y² - 4x - 2y + 4 = 0. Giá trị nhỏ nhất của biểu thức P = 3x + 4y bằng:',
    options: [
      { key: 'A', text: '5' },
      { key: 'B', text: '7' },
      { key: 'C', text: '10' },
      { key: 'D', text: '2' },
    ],
    correctAnswer: 'A',
    explanation: '(x - 2)² + (y - 1)² = 1 (Đường tròn tâm I(2; 1), R = 1). P = 3x + 4y. Ta có |3(2) + 4(1) - P| / √(3² + 4²) ≤ 1 <=> |10 - P| ≤ 5 <=> 5 ≤ P ≤ 15. Giá trị nhỏ nhất là 5.',
  },
  {
    id: 'q-m-14',
    subjectId: 'math',
    topic: 'Hình học tọa độ & Khoảng cách',
    level: 'Vận dụng cao',
    content: 'Trong mặt phẳng tọa độ Oxy, cho đường tròn (C): (x - 1)² + (y - 2)² = 9 và điểm A(4; 6). Gọi M là điểm di động trên (C). Độ dài đoạn thẳng AM đạt giá trị lớn nhất bằng:',
    options: [
      { key: 'A', text: '8' },
      { key: 'B', text: '5' },
      { key: 'C', text: '2' },
      { key: 'D', text: '14' },
    ],
    correctAnswer: 'A',
    explanation: 'Tâm I(1; 2), R = 3. IA = √[(4-1)² + (6-2)²] = 5. AM_max = IA + R = 5 + 3 = 8.',
  },

  // =================== VẬT LÍ ===================
  {
    id: 'q-p-01',
    subjectId: 'phys',
    topic: 'Chuyển động thẳng đều',
    level: 'Nhận biết',
    content: 'Công thức tính quãng đường đi được trong chuyển động thẳng đều là:',
    options: [
      { key: 'A', text: 's = v.t' },
      { key: 'B', text: 's = v / t' },
      { key: 'C', text: 's = v.t²' },
      { key: 'D', text: 's = v0.t + 0.5at²' },
    ],
    correctAnswer: 'A',
    explanation: 'Quãng đường s = v.t trong chuyển động thẳng đều.',
  },
  {
    id: 'q-p-02',
    subjectId: 'phys',
    topic: 'Các định luật Newton',
    level: 'Nhận biết',
    content: 'Định luật I Newton còn được gọi là định luật về:',
    options: [
      { key: 'A', text: 'Gia tốc' },
      { key: 'B', text: 'Quán tính' },
      { key: 'C', text: 'Tương tác' },
      { key: 'D', text: 'Vạn vật hấp dẫn' },
    ],
    correctAnswer: 'B',
    explanation: 'Định luật I Newton là định luật quán tính.',
  },
  {
    id: 'q-p-03',
    subjectId: 'phys',
    topic: 'Lực đàn hồi',
    level: 'Thông hiểu',
    content: 'Một lò xo có độ cứng k = 100 N/m, khi bị kéo dãn 2 cm thì lực đàn hồi của lò xo có độ lớn là:',
    options: [
      { key: 'A', text: '200 N' },
      { key: 'B', text: '2 N' },
      { key: 'C', text: '50 N' },
      { key: 'D', text: '0.02 N' },
    ],
    correctAnswer: 'B',
    explanation: 'F_dh = k.|Δl| = 100 * 0.02 = 2 N.',
  },
  {
    id: 'q-p-04',
    subjectId: 'phys',
    topic: 'Động lượng & Va chạm',
    level: 'Vận dụng',
    content: 'Một viên đạn khối lượng 20g bay với vận tốc 400 m/s cắm vào một bao cát khối lượng 3.98 kg đang đứng yên. Vận tốc của bao cát và đạn ngay sau va chạm mềm là:',
    options: [
      { key: 'A', text: '2 m/s' },
      { key: 'B', text: '4 m/s' },
      { key: 'C', text: '1 m/s' },
      { key: 'D', text: '0.5 m/s' },
    ],
    correctAnswer: 'A',
    explanation: 'm1.v1 = (m1 + m2)V => 0.02 * 400 = (0.02 + 3.98)V => 8 = 4V => V = 2 m/s.',
  },
  {
    id: 'q-p-05',
    subjectId: 'phys',
    topic: 'Cơ năng & Bảo toàn',
    level: 'Vận dụng cao',
    content: 'Một con lắc đơn có chiều dài l = 1m. Kéo vật lệch khỏi phương thẳng đứng góc α0 = 60° rồi buông nhẹ. Lấy g = 10 m/s². Lực căng của dây treo khi vật đi qua vị trí cân bằng gấp bao nhiêu lần trọng lượng của vật?',
    options: [
      { key: 'A', text: '1.5 lần' },
      { key: 'B', text: '2.0 lần' },
      { key: 'C', text: '2.5 lần' },
      { key: 'D', text: '3.0 lần' },
    ],
    correctAnswer: 'B',
    explanation: 'T = mg(3cos0 - 2cos60) = mg(3 - 1) = 2mg => gấp 2 lần trọng lượng.',
  },

  // =================== TIẾNG ANH ===================
  {
    id: 'q-e-01',
    subjectId: 'eng',
    topic: 'Tenses',
    level: 'Nhận biết',
    content: 'She usually ________ to school by bicycle every morning.',
    options: [
      { key: 'A', text: 'goes' },
      { key: 'B', text: 'go' },
      { key: 'C', text: 'is going' },
      { key: 'D', text: 'went' },
    ],
    correctAnswer: 'A',
    explanation: 'Thì hiện tại đơn diễn tả thói quen lặp đi lặp lại với chủ ngữ ngôi thứ 3 số ít "She".',
  },
  {
    id: 'q-e-02',
    subjectId: 'eng',
    topic: 'Passive Voice',
    level: 'Thông hiểu',
    content: 'The bridge ________ by the workers last month.',
    options: [
      { key: 'A', text: 'is built' },
      { key: 'B', text: 'was built' },
      { key: 'C', text: 'has built' },
      { key: 'D', text: 'built' },
    ],
    correctAnswer: 'B',
    explanation: 'Câu bị động ở quá khứ đơn (last month) dạng S + was/were + V3/ed.',
  },
  {
    id: 'q-e-03',
    subjectId: 'eng',
    topic: 'Conditionals',
    level: 'Vận dụng',
    content: 'If you had studied harder, you ________ the entrance examination yesterday.',
    options: [
      { key: 'A', text: 'would pass' },
      { key: 'B', text: 'will pass' },
      { key: 'C', text: 'would have passed' },
      { key: 'D', text: 'had passed' },
    ],
    correctAnswer: 'C',
    explanation: 'Câu điều kiện loại 3 diễn tả điều kiện trái ngược với quá khứ: If + had + V3, S + would have + V3.',
  },
  {
    id: 'q-e-04',
    subjectId: 'eng',
    topic: 'Inversion & Advanced Grammar',
    level: 'Vận dụng cao',
    content: 'Not only ________ the championship, but they also set a new national record.',
    options: [
      { key: 'A', text: 'did they win' },
      { key: 'B', text: 'they won' },
      { key: 'C', text: 'they had won' },
      { key: 'D', text: 'won they' },
    ],
    correctAnswer: 'A',
    explanation: 'Đảo ngữ với "Not only": Not only + trợ động từ + S + V, but S also...',
  },

  // =================== TIN HỌC ===================
  {
    id: 'q-it-01',
    subjectId: 'it',
    topic: 'Lập trình Python',
    level: 'Nhận biết',
    content: 'Hàm nào sau đây trong ngôn ngữ Python dùng để hiển thị dữ liệu ra màn hình?',
    options: [
      { key: 'A', text: 'input()' },
      { key: 'B', text: 'print()' },
      { key: 'C', text: 'output()' },
      { key: 'D', text: 'write()' },
    ],
    correctAnswer: 'B',
    explanation: 'print() là hàm xuất dữ liệu tiêu chuẩn trong Python.',
  },
  {
    id: 'q-it-02',
    subjectId: 'it',
    topic: 'Lập trình Python',
    level: 'Thông hiểu',
    content: 'Cho đoạn mã Python: for i in range(1, 5): print(i, end=" "). Kết quả in ra là:',
    options: [
      { key: 'A', text: '1 2 3 4 5' },
      { key: 'B', text: '1 2 3 4' },
      { key: 'C', text: '0 1 2 3 4' },
      { key: 'D', text: '1 5' },
    ],
    correctAnswer: 'B',
    explanation: 'range(1, 5) sinh các số từ 1 đến 4 (không bao gồm 5).',
  },
  {
    id: 'q-it-03',
    subjectId: 'it',
    topic: 'Thuật toán tìm kiếm',
    level: 'Vận dụng',
    content: 'Thuật toán tìm kiếm nhị phân (Binary Search) yêu cầu danh sách đầu vào phải có đặc điểm gì?',
    options: [
      { key: 'A', text: 'Tất cả các phần tử phải là số nguyên dương' },
      { key: 'B', text: 'Danh sách phải có số lượng phần tử là số chẵn' },
      { key: 'C', text: 'Danh sách đã được sắp xếp theo thứ tự' },
      { key: 'D', text: 'Không được có phần tử trùng lặp' },
    ],
    correctAnswer: 'C',
    explanation: 'Tìm kiếm nhị phân bắt buộc dãy phải được sắp xếp trước.',
  },
  {
    id: 'q-it-04',
    subjectId: 'it',
    topic: 'Độ phức tạp thuật toán',
    level: 'Vận dụng cao',
    content: 'Độ phức tạp thời gian trong trường hợp xấu nhất của thuật toán sắp xếp nhanh (Quick Sort) là:',
    options: [
      { key: 'A', text: 'O(N log N)' },
      { key: 'B', text: 'O(N)' },
      { key: 'C', text: 'O(N²)' },
      { key: 'D', text: 'O(1)' },
    ],
    correctAnswer: 'C',
    explanation: 'Trong trường hợp xấu nhất (chọn pivot tồi trên mảng đã sắp xếp), Quick Sort suy biến thành O(N²).',
  },
];

// Helper sinh ngân hàng câu hỏi tự động theo ma trận và thứ tự cấp độ từ thấp đến cao
export function generateExamPaperByMatrix(
  subjectId: string,
  header: ExamHeaderConfig,
  matrix: ExamMatrix,
  customBank?: Question[]
): ExamPaper {
  const bank = customBank || initialQuestionBank;
  const subjectQuestions = bank.filter((q) => q.subjectId === subjectId || q.subjectId === 'math');

  // Chia theo 4 mức
  const recognitionPool = subjectQuestions.filter((q) => q.level === 'Nhận biết');
  const comprehensionPool = subjectQuestions.filter((q) => q.level === 'Thông hiểu');
  const applicationPool = subjectQuestions.filter((q) => q.level === 'Vận dụng');
  const highApplicationPool = subjectQuestions.filter((q) => q.level === 'Vận dụng cao');

  const selectedRecognition = pickOrCreateQuestions(recognitionPool, matrix.recognitionCount, 'Nhận biết', subjectId);
  const selectedComprehension = pickOrCreateQuestions(comprehensionPool, matrix.comprehensionCount, 'Thông hiểu', subjectId);
  const selectedApplication = pickOrCreateQuestions(applicationPool, matrix.applicationCount, 'Vận dụng', subjectId);
  const selectedHighApp = pickOrCreateQuestions(highApplicationPool, matrix.highApplicationCount, 'Vận dụng cao', subjectId);

  // QUAN TRỌNG: Thứ tự câu hỏi PHẢI ĐƯỢC SẮP XẾP ĐÚNG THỨ TỰ TỪ THẤP ĐẾN CAO
  const finalOrderedQuestions: Question[] = [
    ...selectedRecognition,
    ...selectedComprehension,
    ...selectedApplication,
    ...selectedHighApp,
  ];

  return {
    id: `exam-${Date.now()}`,
    title: `${header.examTitle} - Môn ${header.subjectName}`,
    subjectId,
    header,
    matrix,
    questions: finalOrderedQuestions,
    createdAt: new Date().toISOString(),
  };
}

// Hàm hỗ trợ chọn hoặc nhân bản câu hỏi nếu số lượng yêu cầu lớn hơn ngân hàng mẫu
function pickOrCreateQuestions(pool: Question[], neededCount: number, level: QuestionLevel, subjectId: string): Question[] {
  const result: Question[] = [];
  if (pool.length === 0) {
    // Tạo câu hỏi mặc định
    for (let i = 1; i <= neededCount; i++) {
      result.push({
        id: `gen-${level}-${i}-${Date.now()}`,
        subjectId,
        topic: 'Kiến thức trọng tâm',
        level,
        content: `[Câu hỏi mức độ ${level} số ${i}]: Chọn phương án đúng nhất đối với khái niệm và tính chất liên quan.`,
        options: [
          { key: 'A', text: 'Phương án A đúng theo định lí và công thức quy định' },
          { key: 'B', text: 'Phương án B không thỏa mãn điều kiện bài toán' },
          { key: 'C', text: 'Phương án C vi phạm giả thiết đặt ra' },
          { key: 'D', text: 'Phương án D chỉ đúng trong một trường hợp suy biến' },
        ],
        correctAnswer: 'A',
        explanation: `Hướng dẫn giải chi tiết cho câu hỏi mức độ ${level}.`,
      });
    }
    return result;
  }

  for (let i = 0; i < neededCount; i++) {
    const base = pool[i % pool.length];
    if (i < pool.length) {
      result.push(base);
    } else {
      // Biến thể
      result.push({
        ...base,
        id: `${base.id}-var-${i}`,
        content: `${base.content} (Dạng bài tập tương tự ${i + 1})`,
      });
    }
  }

  return result;
}

// Dữ liệu mẫu thiết kế bài dạy (Giáo án CV 5512)
export const initialLessonPlans: LessonPlan[] = [
  {
    id: 'plan-01',
    subjectId: 'math',
    lessonName: 'BÀI 3: HÀM SỐ BẬC HAI VÀ ĐỒ THỊ',
    unit: 'Chương III: Hàm số và Đồ thị',
    gradeLevel: 10,
    periodCount: 2,
    objectives: {
      knowledge: 'Học sinh nắm vững định nghĩa hàm số bậc hai, tọa độ đỉnh I(-b/2a; -Δ/4a), trục đối xứng x = -b/2a và hình dạng parabol. Lập được bảng biến thiên và vẽ thành thạo parabol.',
      competence: 'Năng lực tư duy và lập luận toán học; Năng lực mô hình hóa toán học thông qua giải quyết các bài toán tối ưu quỹ đạo chuyển động thực tế (ném bóng, cổng parabol).',
      qualities: 'Chăm chỉ, trách nhiệm, tích cực trao đổi thảo luận nhóm.',
    },
    teachingEquipments: 'Máy chiếu, thước kẻ, phần mềm GeoGebra vẽ đồ thị trực quan, phiếu học tập số 1 & 2.',
    activities: [
      {
        id: 'act-1',
        stepName: 'Hoạt động 1: Mở đầu / Khởi động (7 phút)',
        objective: 'Tạo tâm thế hứng thú, kết nối kiến thức thực tế với quỹ đạo parabol của tia nước phun hoặc cổng Parabol Đại học Bách Khoa.',
        content: 'Quan sát hình ảnh cầu treo Cổng Vàng (San Francisco) và quỹ đạo bóng rổ, trả lời câu hỏi: Đường cong này có phương trình như thế nào?',
        product: 'Câu trả lời của các nhóm và dự đoán về hàm số y = ax² + bx + c.',
        implementation: 'GV trình chiếu slide -> Chia 4 tổ thảo luận nhanh trong 3 phút -> Đại diện Tổ 2 phát biểu -> GV dẫn dắt vào bài mới.',
      },
      {
        id: 'act-2',
        stepName: 'Hoạt động 2: Hình thành kiến thức mới (20 phút)',
        objective: 'Xây dựng công thức tọa độ đỉnh, trục đối xứng và bảng biến thiên của hàm số bậc hai khi a > 0 và a < 0.',
        content: 'Làm việc với Phiếu học tập số 1: Biến đổi y = a(x + b/2a)² - Δ/4a. Nhận xét giá trị lớn nhất hoặc nhỏ nhất.',
        product: 'Bảng biến thiên hoàn chỉnh và kết luận về trục đối xứng x = -b/2a.',
        implementation: 'HS làm việc cá nhân 5 phút -> Thảo luận cặp đôi -> GV chuẩn hóa kiến thức lên bảng đen.',
      },
      {
        id: 'act-3',
        stepName: 'Hoạt động 3: Luyện tập (12 phút)',
        objective: 'Học sinh vẽ nhanh parabol y = x² - 4x + 3 và xác định khoảng đồng biến, nghịch biến.',
        content: 'Giải bài tập 1, 2 trang 56 SGK Toán 10.',
        product: 'Bài làm trên bảng của 2 học sinh và vở bài tập của cả lớp.',
        implementation: 'Gọi HS lên bảng trình bày -> Lớp nhận xét, góp ý -> GV chấm điểm đánh giá thường xuyên.',
      },
      {
        id: 'act-4',
        stepName: 'Hoạt động 4: Vận dụng & Mở rộng (6 phút)',
        objective: 'Ứng dụng tìm độ cao cực đại của một vật được ném thẳng đứng từ mặt đất với vận tốc v0 = 20 m/s (h = -5t² + 20t).',
        content: 'Xác định thời điểm vật đạt độ cao lớn nhất và giá trị độ cao đó.',
        product: 'Lời giải: t = 2 giây, h_max = 20 mét.',
        implementation: 'Giao nhiệm vụ về nhà và nộp trên hệ thống trước tiết học tuần sau.',
      },
    ],
    notes: 'Tiết 1 tập trung khảo sát và vẽ đồ thị; Tiết 2 dành cho bài toán ứng dụng thực tế.',
    updatedAt: '2025-03-24',
  },
  {
    id: 'plan-02',
    subjectId: 'phys',
    lessonName: 'BÀI 15: CÁC ĐỊNH LUẬT NEWTON VỀ CHUYỂN ĐỘNG',
    unit: 'Chương II: Động lực học chất điểm',
    gradeLevel: 10,
    periodCount: 3,
    objectives: {
      knowledge: 'Phát biểu và viết được hệ thức của Định luật I, II và III Newton. Hiểu rõ khái niệm quán tính, khối lượng và lực tương tác.',
      competence: 'Năng lực thực nghiệm vật lí: thiết lập thí nghiệm xe trượt trên đệm khí để kiểm chứng gia tốc tỉ lệ thuận với lực tác dụng.',
      qualities: 'Trung thực trong thu thập số liệu thực nghiệm, tinh thần hợp tác.',
    },
    teachingEquipments: 'Bộ thí nghiệm đệm khí, cảm biến quang điện, cổng quang, máy đo thời gian hiện số, quả cân.',
    activities: [
      {
        id: 'act-p1',
        stepName: 'Hoạt động 1: Khởi động (5 phút)',
        objective: 'Tạo mâu thuẫn nhận thức: Tại sao xe đang chạy khi hãm phanh gấp thì người ngồi trên xe lại bị ngả về phía trước?',
        content: 'HS quan sát video tình huống an toàn giao thông khi đeo dây bảo hiểm.',
        product: 'Giải thích ban đầu của học sinh về quán tính.',
        implementation: 'GV nêu câu hỏi mở -> HS phát biểu tự do.',
      },
      {
        id: 'act-p2',
        stepName: 'Hoạt động 2: Hình thành kiến thức - Định luật II Newton (22 phút)',
        objective: 'Khảo sát mối quan hệ giữa gia tốc a, lực F và khối lượng m: F = m.a.',
        content: 'Tiến hành đo gia tốc của xe trượt với các lực kéo khác nhau.',
        product: 'Bảng số liệu đo lường và đồ thị a theo F là đường thẳng qua gốc tọa độ.',
        implementation: 'Học sinh chia theo 4 nhóm tiến hành đo đạc và báo cáo kết quả.',
      },
      {
        id: 'act-p3',
        stepName: 'Hoạt động 3: Luyện tập (12 phút)',
        objective: 'Vận dụng công thức tính lực tác dụng lên ô tô có khối lượng 1 tấn tăng tốc từ 0 lên 20 m/s trong 10 giây.',
        content: 'Bài tập trắc nghiệm nhanh 5 câu trên phiếu học tập.',
        product: 'F = 2000 N.',
        implementation: 'HS làm bài độc lập và chấm chéo đáp án.',
      },
      {
        id: 'act-p4',
        stepName: 'Hoạt động 4: Vận dụng (6 phút)',
        objective: 'Giải thích nguyên tắc hoạt động của súng khi bắn thì bị giật lùi (Định luật III Newton).',
        content: 'Tìm hiểu ứng dụng của lực phản lực trong động cơ phản lực và tên lửa.',
        product: 'Bài viết thu hoạch ngắn 1 trang.',
        implementation: 'Giao bài tập về nhà.',
      },
    ],
    notes: 'Cần kiểm tra kỹ pin cảm biến cổng quang điện trước giờ lên lớp.',
    updatedAt: '2025-03-22',
  },
];
