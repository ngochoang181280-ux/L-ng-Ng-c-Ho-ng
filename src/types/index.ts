export type TermType = 'HK1' | 'HK2';

export type GenderType = 'Nam' | 'Nữ';

export type ConductType = 'Tốt' | 'Khá' | 'Đạt' | 'Chưa đạt';

export type AcademicRatingType = 'Xuất sắc' | 'Giỏi' | 'Khá' | 'Đạt' | 'Chưa đạt';

export type AttendanceStatus = 'present' | 'excused' | 'unexcused' | 'late';

export type StudentRole = 
  | 'Lớp trưởng'
  | 'Lớp phó học tập'
  | 'Lớp phó phong trào'
  | 'Lớp phó lao động'
  | 'Bí thư chi đoàn'
  | 'Thủ quỹ'
  | 'Tổ trưởng'
  | 'Tổ phó'
  | 'Học sinh';

export interface Student {
  id: string;
  rollNumber: number; // STT
  studentCode: string; // VD: 10A1-01
  fullName: string;
  gender: GenderType;
  dob: string; // YYYY-MM-DD
  ethnic: string;
  address: string;
  team: 1 | 2 | 3 | 4; // Tổ 1..4
  role: StudentRole;
  fatherName: string;
  fatherPhone: string;
  fatherJob: string;
  motherName: string;
  motherPhone: string;
  motherJob: string;
  isBoarder?: boolean; // Bán trú
  hasVisionImpairment?: boolean; // Cận thị
  heightCm?: number;
  policyBeneficiary?: string; // Diện chính sách: Con TB, Hộ nghèo, v.v.
  specialNotes?: string;
  conduct: ConductType;
  avatarUrl?: string;
}

export interface Subject {
  id: string;
  name: string;
  shortName: string;
  category: 'core' | 'natural' | 'social' | 'special';
  teacherName?: string;
}

export interface SubjectScores {
  tx1?: number | null; // ĐGtx 1
  tx2?: number | null; // ĐGtx 2
  tx3?: number | null; // ĐGtx 3
  tx4?: number | null; // ĐGtx 4
  gk?: number | null;  // ĐGgk (hệ số 2)
  ck?: number | null;  // ĐGck (hệ số 3)
}

export interface StudentTermScores {
  studentId: string;
  term: TermType;
  scores: Record<string, SubjectScores>; // subjectId -> SubjectScores
  teacherComment?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  status: AttendanceStatus;
  note?: string;
}

export interface DisciplineEntry {
  id: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  type: 'khen_thuong' | 'nhac_nho' | 'vi_pham';
  category: 'Chuyên cần' | 'Học tập' | 'Nề nếp' | 'Vệ sinh' | 'Phong trào' | 'Khác';
  content: string;
  pointChange: number; // +5, -2, etc.
  reporter: string; // GVCN, Sao đỏ, Cán sự lớp
  status: 'Đã giải quyết' | 'Cần liên hệ PH' | 'Đang theo dõi';
}

export interface SeatSlot {
  id: string;
  row: number; // 1 to 5
  table: number; // Bàn 1..8
  column: number; // 1..4 (Tổ 1..4)
  seatPosition: 'left' | 'right';
  studentId?: string | null;
}

export interface ClassInfo {
  className: string;
  gradeLevel: number;
  schoolName: string;
  academicYear: string;
  currentTerm: TermType;
  homeroomTeacher: string;
  teacherPhone: string;
  teacherEmail: string;
  classroom: string;
  monitorName: string;
}

export interface TimetableEntry {
  day: number; // 2..7 (Thứ 2..7)
  period: number; // 1..5
  subjectName: string;
  teacherName?: string;
  room?: string;
}

export interface WeeklyMeetingPlan {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  theme: string;
  evaluationSummary: string;
  nextWeekPlan: string;
  praiseStudents: string[];
  remindStudents: string[];
}

// ==========================================
// THI TRẮC NGHIỆM & SOẠN ĐỀ THEO MA TRẬN
// ==========================================

export type QuestionLevel = 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';

export interface QuestionOption {
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface Question {
  id: string;
  subjectId: string;
  topic: string; // Chủ đề / Chương bài
  level: QuestionLevel;
  content: string;
  options: QuestionOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
}

export interface ExamHeaderConfig {
  departmentName: string; // Tên Sở / Phòng GD&ĐT
  schoolName: string; // Tên trường học
  examTitle: string; // Kỳ kiểm tra: VD: KIỂM TRA GIỮA HỌC KỲ I
  academicYear: string; // Năm học
  subjectName: string; // Môn thi
  grade: string; // Khối lớp
  durationMinutes: number; // Thời gian làm bài (phút)
  examCode: string; // Mã đề thi (101, 102...)
  paperNote: string; // Ghi chú (VD: Không sử dụng tài liệu)
  enableScreenMonitoring?: boolean; // Tùy chỉnh bật/tắt giám sát màn hình
  maxAllowedExits?: number; // Số lần thoát màn hình tối đa cho phép
  actionOnExceed?: 'warn' | 'auto_submit'; // Xử lý khi vượt quá: Cảnh báo hay Tự động nộp bài
}

export interface ExamMatrix {
  recognitionCount: number; // Nhận biết
  comprehensionCount: number; // Thông hiểu
  applicationCount: number; // Vận dụng
  highApplicationCount: number; // Vận dụng cao
}

export interface ExamPaper {
  id: string;
  title: string;
  subjectId: string;
  header: ExamHeaderConfig;
  matrix: ExamMatrix;
  questions: Question[]; // Luôn được sắp xếp từ thấp đến cao (Nhận biết -> Thông hiểu -> Vận dụng -> Vận dụng cao)
  createdAt: string;
}

export interface OnlineExamSession {
  examId: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  startTime: string;
  durationMinutes: number;
  remainingSeconds: number;
  tabSwitchCount: number; // Giám sát số lần thoát màn hình / chuyển tab
  maxAllowedExits?: number;
  actionOnExceed?: 'warn' | 'auto_submit';
  violationReason?: string;
  answers: Record<string, 'A' | 'B' | 'C' | 'D'>; // questionId -> answer
  isSubmitted: boolean;
  submittedAt?: string;
  score?: number;
  totalQuestions?: number;
  correctCount?: number;
}

// ==========================================
// THIẾT KẾ BÀI HỌC (GIÁO ÁN CV 5512)
// ==========================================

export interface LessonActivity {
  id: string;
  stepName: string; // Khởi động, Hình thành kiến thức, Luyện tập, Vận dụng
  objective: string; // Mục tiêu hoạt động
  content: string; // Nội dung
  product: string; // Sản phẩm học tập
  implementation: string; // Cách thức tổ chức thực hiện
}

export interface LessonPlan {
  id: string;
  subjectId: string;
  lessonName: string; // Tên bài dạy
  unit: string; // Chương / Chủ đề
  gradeLevel: number; // Lớp 10, 11, 12
  periodCount: number; // Số tiết
  objectives: {
    knowledge: string;
    competence: string;
    qualities: string;
  };
  teachingEquipments: string; // Thiết bị dạy học và học liệu
  activities: LessonActivity[]; // Tiến trình dạy học
  notes?: string;
  updatedAt: string;
}
