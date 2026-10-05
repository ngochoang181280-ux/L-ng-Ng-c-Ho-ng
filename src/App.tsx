import React, { useState, useEffect } from 'react';
import { 
  AppState, 
  loadInitialState, 
  saveStateToStorage 
} from './utils/storage';
import { 
  Student, 
  TermType, 
  SubjectScores, 
  AttendanceRecord, 
  DisciplineEntry, 
  SeatSlot, 
  WeeklyMeetingPlan, 
  ClassInfo,
  ExamPaper,
  Question,
  OnlineExamSession,
  LessonPlan 
} from './types';
import { Header } from './components/Header';
import { Sidebar, TabType } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { StudentsView } from './components/StudentsView';
import { StudentDetailModal } from './components/StudentDetailModal';
import { StudentFormModal } from './components/StudentFormModal';
import { GradebookView } from './components/GradebookView';
import { AttendanceView } from './components/AttendanceView';
import { DisciplineView } from './components/DisciplineView';
import { SeatingChartView } from './components/SeatingChartView';
import { TimetablePlanView } from './components/TimetablePlanView';
import { ReportPrintView } from './components/ReportPrintView';
import { DataBackupModal } from './components/DataBackupModal';
import { ClassSettingsModal } from './components/ClassSettingsModal';
import { ExamManagerView } from './components/ExamManagerView';
import { LessonPlannerView } from './components/LessonPlannerView';
import { StudentExamPortal } from './components/StudentExamPortal';
import { TeacherLoginView } from './components/TeacherLoginView';

export default function App() {
  const [appState, setAppState] = useState<AppState>(() => loadInitialState());
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');

  // Check URL parameters for direct student exam link (e.g. ?mode=exam&examId=...&pin=...)
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialExamParam = urlParams?.get('examId') || urlParams?.get('exam');
  const isDirectExamMode = urlParams?.get('mode') === 'exam' || Boolean(initialExamParam);
  const initialPinParam = urlParams?.get('pin');

  const [isStudentPortalOpen, setIsStudentPortalOpen] = useState<boolean>(isDirectExamMode);

  // Xác thực đăng nhập giáo viên (Tài khoản: Hoaibao, Mật khẩu: 10011982)
  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return Boolean(
      localStorage.getItem('teacher_auth_token') || 
      sessionStorage.getItem('teacher_auth_token')
    );
  });

  // Modals state
  const [detailedStudent, setDetailedStudent] = useState<Student | null>(null);
  const [formStudent, setFormStudent] = useState<Student | null>(null);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Auto-save on state change
  useEffect(() => {
    saveStateToStorage(appState);
  }, [appState]);

  // Semester change
  const handleUpdateTerm = (term: TermType) => {
    setAppState((prev) => ({
      ...prev,
      classInfo: {
        ...prev.classInfo,
        currentTerm: term,
      },
    }));
  };

  // Student CRUD
  const handleSelectStudentById = (id: string) => {
    const found = appState.students.find((s) => s.id === id);
    if (found) {
      setDetailedStudent(found);
    }
  };

  const handleSaveStudent = (savedStudent: Student) => {
    setAppState((prev) => {
      const exists = prev.students.some((s) => s.id === savedStudent.id);
      let updatedStudents: Student[];
      if (exists) {
        updatedStudents = prev.students.map((s) => (s.id === savedStudent.id ? savedStudent : s));
      } else {
        updatedStudents = [...prev.students, savedStudent];
      }

      updatedStudents.sort((a, b) => a.rollNumber - b.rollNumber);

      return {
        ...prev,
        students: updatedStudents,
      };
    });

    setFormStudent(null);
    setIsAddingStudent(false);
    if (detailedStudent && detailedStudent.id === savedStudent.id) {
      setDetailedStudent(savedStudent);
    }
  };

  const handleDeleteStudent = (studentId: string) => {
    setAppState((prev) => ({
      ...prev,
      students: prev.students.filter((s) => s.id !== studentId),
      seats: prev.seats.map((seat) => (seat.studentId === studentId ? { ...seat, studentId: null } : seat)),
    }));
    if (detailedStudent?.id === studentId) {
      setDetailedStudent(null);
    }
  };

  // Update teacher comment
  const handleUpdateTeacherComment = (studentId: string, comment: string) => {
    setAppState((prev) => {
      const currentScore = prev.scores[studentId] || {
        studentId,
        term: prev.classInfo.currentTerm,
        scores: {},
      };
      return {
        ...prev,
        scores: {
          ...prev.scores,
          [studentId]: {
            ...currentScore,
            teacherComment: comment,
          },
        },
      };
    });
  };

  // Update subject scores
  const handleUpdateScore = (
    studentId: string,
    subjectId: string,
    field: keyof SubjectScores,
    value: number | null
  ) => {
    setAppState((prev) => {
      const studentTermScores = prev.scores[studentId] || {
        studentId,
        term: prev.classInfo.currentTerm,
        scores: {},
      };
      const currentSubjectScores = studentTermScores.scores[subjectId] || {};

      return {
        ...prev,
        scores: {
          ...prev.scores,
          [studentId]: {
            ...studentTermScores,
            scores: {
              ...studentTermScores.scores,
              [subjectId]: {
                ...currentSubjectScores,
                [field]: value,
              },
            },
          },
        },
      };
    });
  };

  // Apply online exam score to student's gradebook directly
  const handleApplyScoreToGradebook = (studentId: string, subjectId: string, score: number) => {
    setAppState((prev) => {
      const studentTermScores = prev.scores[studentId] || {
        studentId,
        term: prev.classInfo.currentTerm,
        scores: {},
      };
      const currentSubjectScores = studentTermScores.scores[subjectId] || {};

      // Điền vào cột còn trống hoặc ghi đè vào GK
      const targetField: keyof SubjectScores = currentSubjectScores.gk === undefined || currentSubjectScores.gk === null 
        ? 'gk' 
        : currentSubjectScores.tx1 === undefined || currentSubjectScores.tx1 === null 
        ? 'tx1' 
        : 'tx2';

      return {
        ...prev,
        scores: {
          ...prev.scores,
          [studentId]: {
            ...studentTermScores,
            scores: {
              ...studentTermScores.scores,
              [subjectId]: {
                ...currentSubjectScores,
                [targetField]: score,
              },
            },
          },
        },
      };
    });
  };

  // Attendance
  const handleUpdateAttendance = (newRecords: AttendanceRecord[]) => {
    setAppState((prev) => ({
      ...prev,
      attendance: newRecords,
    }));
  };

  // Discipline handlers
  const handleAddDiscipline = (entry: DisciplineEntry) => {
    setAppState((prev) => ({
      ...prev,
      discipline: [entry, ...prev.discipline],
    }));
  };

  const handleUpdateDisciplineStatus = (id: string, status: DisciplineEntry['status']) => {
    setAppState((prev) => ({
      ...prev,
      discipline: prev.discipline.map((d) => (d.id === id ? { ...d, status } : d)),
    }));
  };

  const handleDeleteDiscipline = (id: string) => {
    setAppState((prev) => ({
      ...prev,
      discipline: prev.discipline.filter((d) => d.id !== id),
    }));
  };

  // Seating handlers
  const handleUpdateSeats = (updatedSeats: SeatSlot[]) => {
    setAppState((prev) => ({
      ...prev,
      seats: updatedSeats,
    }));
  };

  // Meeting plan handlers
  const handleUpdatePlan = (updatedPlan: WeeklyMeetingPlan) => {
    setAppState((prev) => ({
      ...prev,
      meetingPlans: prev.meetingPlans.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)),
    }));
  };

  // Exam handlers
  const handleSaveExam = (exam: ExamPaper) => {
    setAppState((prev) => ({
      ...prev,
      savedExams: [exam, ...prev.savedExams.filter((e) => e.id !== exam.id)],
    }));
  };

  const handleDeleteExam = (id: string) => {
    setAppState((prev) => ({
      ...prev,
      savedExams: prev.savedExams.filter((e) => e.id !== id),
    }));
  };

  const handleAddQuestionToBank = (question: Question) => {
    setAppState((prev) => ({
      ...prev,
      questionBank: [question, ...prev.questionBank],
    }));
  };

  const handleAddQuestionsToBank = (questions: Question[]) => {
    setAppState((prev) => ({
      ...prev,
      questionBank: [...questions, ...prev.questionBank],
    }));
  };

  const handleSaveExamResult = (session: OnlineExamSession) => {
    setAppState((prev) => ({
      ...prev,
      examResults: [session, ...prev.examResults],
    }));
  };

  // Lesson plan handlers
  const handleSaveLessonPlan = (plan: LessonPlan) => {
    setAppState((prev) => {
      const exists = prev.lessonPlans.some((p) => p.id === plan.id);
      return {
        ...prev,
        lessonPlans: exists
          ? prev.lessonPlans.map((p) => (p.id === plan.id ? plan : p))
          : [plan, ...prev.lessonPlans],
      };
    });
  };

  const handleDeleteLessonPlan = (id: string) => {
    setAppState((prev) => ({
      ...prev,
      lessonPlans: prev.lessonPlans.filter((p) => p.id !== id),
    }));
  };

  // Settings & Restore
  const handleUpdateClassInfo = (newClassInfo: ClassInfo) => {
    setAppState((prev) => ({
      ...prev,
      classInfo: newClassInfo,
    }));
  };

  const handleRestoreState = (newState: AppState) => {
    setAppState(newState);
  };

  // Sidebar badge computations
  const todayStr = '2025-03-24';
  const todayAbsentCount = appState.attendance.filter(
    (a) => a.date === todayStr && (a.status === 'excused' || a.status === 'unexcused')
  ).length;

  const disciplineAlertCount = appState.discipline.filter(
    (d) => d.status === 'Cần liên hệ PH'
  ).length;

  // Nếu đang mở Cổng làm bài thi dành cho học sinh (hoặc truy cập qua link thi chia sẻ)
  if (isStudentPortalOpen) {
    return (
      <StudentExamPortal
        exams={appState.savedExams}
        students={appState.students}
        initialExamId={initialExamParam}
        initialPin={initialPinParam}
        onSaveExamResult={handleSaveExamResult}
        onApplyScoreToGradebook={handleApplyScoreToGradebook}
        onExitToTeacherMode={() => {
          setIsStudentPortalOpen(false);
          if (typeof window !== 'undefined' && window.history.replaceState) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }}
      />
    );
  }

  // Nếu giáo viên chưa đăng nhập, hiển thị Màn hình Đăng nhập (Hoaibao / 10011982)
  if (!isTeacherAuthenticated) {
    return (
      <TeacherLoginView
        schoolName={appState.classInfo.schoolName}
        className={appState.classInfo.className}
        onLoginSuccess={() => setIsTeacherAuthenticated(true)}
        onOpenStudentPortal={() => setIsStudentPortalOpen(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100/70 text-neutral-900 flex flex-col">
      {/* Top Header */}
      <Header
        classInfo={appState.classInfo}
        onUpdateTerm={handleUpdateTerm}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenBackup={() => setShowBackupModal(true)}
        onOpenPrintReport={() => setCurrentTab('reports')}
        onOpenStudentPortal={() => setIsStudentPortalOpen(true)}
        onLogout={() => {
          localStorage.removeItem('teacher_auth_token');
          sessionStorage.removeItem('teacher_auth_token');
          setIsTeacherAuthenticated(false);
        }}
      />

      {/* Main Workspace */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 flex flex-col lg:flex-row gap-6">
        {/* Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          studentCount={appState.students.length}
          todayAbsentCount={todayAbsentCount}
          disciplineAlertCount={disciplineAlertCount}
          examCount={appState.savedExams.length}
          lessonCount={appState.lessonPlans.length}
        />

        {/* Content Viewport */}
        <main className="flex-1 min-w-0">
          {currentTab === 'dashboard' && (
            <DashboardView
              appState={appState}
              onNavigateTab={setCurrentTab}
              onSelectStudentId={handleSelectStudentById}
            />
          )}

          {currentTab === 'students' && (
            <StudentsView
              students={appState.students}
              classInfo={appState.classInfo}
              onSelectStudent={(s) => setDetailedStudent(s)}
              onEditStudent={(s) => setFormStudent(s)}
              onAddStudent={() => setIsAddingStudent(true)}
              onDeleteStudent={handleDeleteStudent}
            />
          )}

          {currentTab === 'grades' && (
            <GradebookView
              students={appState.students}
              subjects={appState.subjects}
              scores={appState.scores}
              classInfo={appState.classInfo}
              onUpdateScore={handleUpdateScore}
            />
          )}

          {currentTab === 'exam' && (
            <ExamManagerView
              exams={appState.savedExams}
              questionBank={appState.questionBank}
              subjects={appState.subjects}
              students={appState.students}
              onSaveExam={handleSaveExam}
              onDeleteExam={handleDeleteExam}
              onAddQuestionToBank={handleAddQuestionToBank}
              onAddQuestionsToBank={handleAddQuestionsToBank}
              onSaveExamResult={handleSaveExamResult}
              onApplyScoreToGradebook={handleApplyScoreToGradebook}
            />
          )}

          {currentTab === 'lesson' && (
            <LessonPlannerView
              lessonPlans={appState.lessonPlans}
              subjects={appState.subjects}
              onSaveLessonPlan={handleSaveLessonPlan}
              onDeleteLessonPlan={handleDeleteLessonPlan}
            />
          )}

          {currentTab === 'attendance' && (
            <AttendanceView
              students={appState.students}
              attendance={appState.attendance}
              classInfo={appState.classInfo}
              onUpdateAttendance={handleUpdateAttendance}
            />
          )}

          {currentTab === 'discipline' && (
            <DisciplineView
              students={appState.students}
              discipline={appState.discipline}
              classInfo={appState.classInfo}
              onAddDiscipline={handleAddDiscipline}
              onUpdateDisciplineStatus={handleUpdateDisciplineStatus}
              onDeleteDiscipline={handleDeleteDiscipline}
            />
          )}

          {currentTab === 'seating' && (
            <SeatingChartView
              students={appState.students}
              seats={appState.seats}
              classInfo={appState.classInfo}
              subjects={appState.subjects}
              scores={appState.scores}
              onUpdateSeats={handleUpdateSeats}
              onSelectStudentId={handleSelectStudentById}
            />
          )}

          {currentTab === 'timetable' && (
            <TimetablePlanView
              timetable={appState.timetable}
              meetingPlans={appState.meetingPlans}
              students={appState.students}
              classInfo={appState.classInfo}
              onUpdatePlan={handleUpdatePlan}
            />
          )}

          {currentTab === 'reports' && (
            <ReportPrintView
              students={appState.students}
              subjects={appState.subjects}
              scores={appState.scores}
              attendance={appState.attendance}
              classInfo={appState.classInfo}
            />
          )}
        </main>
      </div>

      {/* Modal 1: Student Detail Modal */}
      {detailedStudent && (
        <StudentDetailModal
          student={detailedStudent}
          classInfo={appState.classInfo}
          subjects={appState.subjects}
          termScore={appState.scores[detailedStudent.id]}
          attendanceRecords={appState.attendance}
          disciplineEntries={appState.discipline}
          onClose={() => setDetailedStudent(null)}
          onUpdateComment={handleUpdateTeacherComment}
          onEditStudent={(st) => {
            setDetailedStudent(null);
            setFormStudent(st);
          }}
        />
      )}

      {/* Modal 2: Student Add / Edit Form Modal */}
      {(formStudent || isAddingStudent) && (
        <StudentFormModal
          student={formStudent}
          nextRollNumber={appState.students.length + 1}
          onSave={handleSaveStudent}
          onClose={() => {
            setFormStudent(null);
            setIsAddingStudent(false);
          }}
        />
      )}

      {/* Modal 3: Data Backup & Restore Modal */}
      {showBackupModal && (
        <DataBackupModal
          appState={appState}
          onRestoreState={handleRestoreState}
          onClose={() => setShowBackupModal(false)}
        />
      )}

      {/* Modal 4: Class Settings Modal */}
      {showSettingsModal && (
        <ClassSettingsModal
          classInfo={appState.classInfo}
          onSave={handleUpdateClassInfo}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  );
}
