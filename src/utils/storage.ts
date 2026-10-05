import { 
  ClassInfo, 
  Student, 
  Subject, 
  StudentTermScores, 
  AttendanceRecord, 
  DisciplineEntry, 
  SeatSlot, 
  TimetableEntry, 
  WeeklyMeetingPlan,
  Question,
  ExamPaper,
  LessonPlan,
  OnlineExamSession
} from '../types';
import { 
  initialClassInfo, 
  subjectsList, 
  initialStudents, 
  generateMockScores, 
  initialAttendanceRecords, 
  initialDisciplineEntries, 
  generateInitialSeats, 
  initialTimetable, 
  initialMeetingPlans 
} from '../data/mockData';
import { initialQuestionBank, initialLessonPlans, generateExamPaperByMatrix } from '../data/examData';

const STORAGE_KEYS = {
  CLASS_INFO: 'sochuniem_class_info_v1',
  STUDENTS: 'sochuniem_students_v1',
  SUBJECTS: 'sochuniem_subjects_v1',
  SCORES: 'sochuniem_scores_v1',
  ATTENDANCE: 'sochuniem_attendance_v1',
  DISCIPLINE: 'sochuniem_discipline_v1',
  SEATS: 'sochuniem_seats_v1',
  TIMETABLE: 'sochuniem_timetable_v1',
  MEETINGS: 'sochuniem_meetings_v1',
  QUESTIONS: 'sochuniem_questions_v1',
  EXAMS: 'sochuniem_exams_v1',
  LESSONS: 'sochuniem_lessons_v1',
  EXAM_RESULTS: 'sochuniem_exam_results_v1',
};

export interface AppState {
  classInfo: ClassInfo;
  students: Student[];
  subjects: Subject[];
  scores: Record<string, StudentTermScores>;
  attendance: AttendanceRecord[];
  discipline: DisciplineEntry[];
  seats: SeatSlot[];
  timetable: TimetableEntry[];
  meetingPlans: WeeklyMeetingPlan[];
  questionBank: Question[];
  savedExams: ExamPaper[];
  lessonPlans: LessonPlan[];
  examResults: OnlineExamSession[];
}

export function loadInitialState(): AppState {
  try {
    const savedClassInfo = localStorage.getItem(STORAGE_KEYS.CLASS_INFO);
    const savedStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    const savedSubjects = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    const savedScores = localStorage.getItem(STORAGE_KEYS.SCORES);
    const savedAttendance = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    const savedDiscipline = localStorage.getItem(STORAGE_KEYS.DISCIPLINE);
    const savedSeats = localStorage.getItem(STORAGE_KEYS.SEATS);
    const savedTimetable = localStorage.getItem(STORAGE_KEYS.TIMETABLE);
    const savedMeetings = localStorage.getItem(STORAGE_KEYS.MEETINGS);
    const savedQuestions = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    const savedExams = localStorage.getItem(STORAGE_KEYS.EXAMS);
    const savedLessons = localStorage.getItem(STORAGE_KEYS.LESSONS);
    const savedResults = localStorage.getItem(STORAGE_KEYS.EXAM_RESULTS);

    const students = savedStudents ? JSON.parse(savedStudents) : initialStudents;
    const subjects = savedSubjects ? JSON.parse(savedSubjects) : subjectsList;
    const questions = savedQuestions ? JSON.parse(savedQuestions) : initialQuestionBank;
    
    // Default initial exam
    const defaultExam = generateExamPaperByMatrix(
      'math',
      {
        departmentName: 'SỞ GIÁO DỤC VÀ ĐÀO TẠO',
        schoolName: 'TRƯỜNG THPT LÊ QUÝ ĐÔN',
        examTitle: 'KIỂM TRA GIỮA HỌC KỲ I',
        academicYear: 'Năm học 2024 - 2025',
        subjectName: 'TOÁN HỌC',
        grade: 'Lớp 10',
        durationMinutes: 45,
        examCode: '101',
        paperNote: 'Đề thi gồm 20 câu trắc nghiệm. Thí sinh không được sử dụng tài liệu.',
      },
      {
        recognitionCount: 8,
        comprehensionCount: 6,
        applicationCount: 4,
        highApplicationCount: 2,
      },
      questions
    );

    let classInfo: ClassInfo = savedClassInfo ? JSON.parse(savedClassInfo) : initialClassInfo;
    if (!classInfo.homeroomTeacher || classInfo.homeroomTeacher.includes('Mai Hoa')) {
      classInfo.homeroomTeacher = 'Cô Lê Thị Hoài Bảo';
      classInfo.teacherEmail = 'hoaibao.le@thpt.edu.vn';
    }
    if (!classInfo.schoolName || classInfo.schoolName.includes('Chu Văn An')) {
      classInfo.schoolName = 'Trường THPT Lê Quý Đôn';
    }

    return {
      classInfo,
      students,
      subjects,
      scores: savedScores ? JSON.parse(savedScores) : generateMockScores(students, subjects),
      attendance: savedAttendance ? JSON.parse(savedAttendance) : initialAttendanceRecords,
      discipline: savedDiscipline ? JSON.parse(savedDiscipline) : initialDisciplineEntries,
      seats: savedSeats ? JSON.parse(savedSeats) : generateInitialSeats(students),
      timetable: savedTimetable ? JSON.parse(savedTimetable) : initialTimetable,
      meetingPlans: savedMeetings ? JSON.parse(savedMeetings) : initialMeetingPlans,
      questionBank: questions,
      savedExams: savedExams ? JSON.parse(savedExams) : [defaultExam],
      lessonPlans: savedLessons ? JSON.parse(savedLessons) : initialLessonPlans,
      examResults: savedResults ? JSON.parse(savedResults) : [],
    };
  } catch (err) {
    console.error('Lỗi khi đọc localStorage:', err);
    return getFreshDefaultState();
  }
}

export function getFreshDefaultState(): AppState {
  const students = initialStudents;
  const subjects = subjectsList;
  const questions = initialQuestionBank;
  const defaultExam = generateExamPaperByMatrix(
    'math',
    {
      departmentName: 'SỞ GIÁO DỤC VÀ ĐÀO TẠO',
      schoolName: 'TRƯỜNG THPT LÊ QUÝ ĐÔN',
      examTitle: 'KIỂM TRA GIỮA HỌC KỲ I',
      academicYear: 'Năm học 2024 - 2025',
      subjectName: 'TOÁN HỌC',
      grade: 'Lớp 10',
      durationMinutes: 45,
      examCode: '101',
      paperNote: 'Đề thi gồm 20 câu trắc nghiệm. Thí sinh không được sử dụng tài liệu.',
    },
    {
      recognitionCount: 8,
      comprehensionCount: 6,
      applicationCount: 4,
      highApplicationCount: 2,
    },
    questions
  );

  return {
    classInfo: initialClassInfo,
    students,
    subjects,
    scores: generateMockScores(students, subjects),
    attendance: initialAttendanceRecords,
    discipline: initialDisciplineEntries,
    seats: generateInitialSeats(students),
    timetable: initialTimetable,
    meetingPlans: initialMeetingPlans,
    questionBank: questions,
    savedExams: [defaultExam],
    lessonPlans: initialLessonPlans,
    examResults: [],
  };
}

export function saveStateToStorage(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEYS.CLASS_INFO, JSON.stringify(state.classInfo));
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(state.students));
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(state.subjects));
    localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(state.scores));
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(state.attendance));
    localStorage.setItem(STORAGE_KEYS.DISCIPLINE, JSON.stringify(state.discipline));
    localStorage.setItem(STORAGE_KEYS.SEATS, JSON.stringify(state.seats));
    localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(state.timetable));
    localStorage.setItem(STORAGE_KEYS.MEETINGS, JSON.stringify(state.meetingPlans));
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(state.questionBank));
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(state.savedExams));
    localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(state.lessonPlans));
    localStorage.setItem(STORAGE_KEYS.EXAM_RESULTS, JSON.stringify(state.examResults));
  } catch (err) {
    console.error('Lỗi khi lưu vào localStorage:', err);
  }
}

export function exportBackupJSON(state: AppState) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  const fileName = `So_Chu_Nhiem_${state.classInfo.className}_${new Date().toISOString().slice(0, 10)}.json`;
  downloadAnchor.setAttribute('download', fileName);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportStudentsToCSV(students: Student[], classInfo: ClassInfo) {
  const headers = ['STT', 'Mã HS', 'Họ và tên', 'Giới tính', 'Ngày sinh', 'Tổ', 'Chức vụ', 'Hạnh kiểm', 'Họ tên Bố', 'SĐT Bố', 'Họ tên Mẹ', 'SĐT Mẹ', 'Địa chỉ', 'Ghi chú'];
  const rows = students.map((s) => [
    s.rollNumber,
    s.studentCode,
    `"${s.fullName}"`,
    s.gender,
    s.dob,
    `Tổ ${s.team}`,
    `"${s.role}"`,
    s.conduct,
    `"${s.fatherName}"`,
    `"${s.fatherPhone}"`,
    `"${s.motherName}"`,
    `"${s.motherPhone}"`,
    `"${s.address}"`,
    `"${s.specialNotes || ''}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Danh_sach_lop_${classInfo.className}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
