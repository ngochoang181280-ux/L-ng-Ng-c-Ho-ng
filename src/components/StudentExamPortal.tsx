import React, { useState, useEffect } from 'react';
import { ExamPaper, Student, OnlineExamSession } from '../types';
import { OnlineExamView } from './OnlineExamView';
import { 
  GraduationCap, 
  KeyRound, 
  UserCheck, 
  Clock, 
  ShieldAlert, 
  BookOpen, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

interface StudentExamPortalProps {
  exams: ExamPaper[];
  students: Student[];
  initialExamId?: string | null;
  initialPin?: string | null;
  onSaveExamResult: (session: OnlineExamSession) => void;
  onApplyScoreToGradebook: (studentId: string, subjectId: string, score: number) => void;
  onExitToTeacherMode: () => void;
}

export const StudentExamPortal: React.FC<StudentExamPortalProps> = ({
  exams,
  students,
  initialExamId,
  initialPin,
  onSaveExamResult,
  onApplyScoreToGradebook,
  onExitToTeacherMode,
}) => {
  // Tìm đề thi ban đầu theo URL query hoặc đề đầu tiên
  const [selectedExamId, setSelectedExamId] = useState<string>(
    initialExamId && exams.some((e) => e.id === initialExamId)
      ? initialExamId
      : exams[0]?.id || ''
  );

  const [studentCodeInput, setStudentCodeInput] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [pinInput, setPinInput] = useState<string>(initialPin || '');
  const [isAgreedTerms, setIsAgreedTerms] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isExamStarted, setIsExamStarted] = useState<boolean>(false);

  const currentExam = exams.find((e) => e.id === selectedExamId) || exams[0];

  // Tự động tìm học sinh khi nhập mã
  useEffect(() => {
    if (studentCodeInput.trim()) {
      const trimmed = studentCodeInput.trim().toUpperCase();
      const matched = students.find(
        (s) => s.studentCode.toUpperCase() === trimmed || s.rollNumber.toString() === trimmed
      );
      if (matched) {
        setSelectedStudentId(matched.id);
        setErrorMsg(null);
      }
    }
  }, [studentCodeInput, students]);

  const handleStartExam = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentExam) {
      setErrorMsg('Chưa chọn bài thi hợp lệ.');
      return;
    }

    if (!selectedStudentId) {
      setErrorMsg('Vui lòng chọn hoặc nhập đúng Mã học sinh / Số báo danh của bạn.');
      return;
    }

    // Nếu giáo viên có yêu cầu PIN trong URL
    if (initialPin && pinInput.trim() !== initialPin.trim()) {
      setErrorMsg('Mã PIN phòng thi không chính xác! Vui lòng hỏi lại giáo viên.');
      return;
    }

    if (!isAgreedTerms) {
      setErrorMsg('Bạn cần đồng ý với quy chế thi trước khi bắt đầu.');
      return;
    }

    setErrorMsg(null);
    setIsExamStarted(true);
  };

  // Nếu đang trong chế độ làm bài thi
  if (isExamStarted && currentExam) {
    const student = students.find((s) => s.id === selectedStudentId) || students[0];
    return (
      <div className="min-h-screen bg-neutral-100 p-4 sm:p-6">
        <div className="max-w-5xl mx-auto">
          <OnlineExamView
            exam={currentExam}
            students={[student]} // Khóa vào đúng học sinh này
            onBack={() => setIsExamStarted(false)}
            onSaveExamResult={onSaveExamResult}
            onApplyScoreToGradebook={onApplyScoreToGradebook}
          />
        </div>
      </div>
    );
  }

  const activeStudent = students.find((s) => s.id === selectedStudentId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-neutral-900 to-emerald-950 flex flex-col justify-between p-4 sm:p-6 text-neutral-100">
      {/* Top Navbar */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-sm text-white tracking-wide">
              {currentExam ? currentExam.header.schoolName : 'TRƯỜNG THPT CHU VĂN AN'}
            </div>
            <div className="text-xs text-emerald-300">
              Cổng thi trắc nghiệm trực tuyến dành cho Học sinh
            </div>
          </div>
        </div>

        <button
          onClick={onExitToTeacherMode}
          className="text-xs text-neutral-400 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Về Sổ chủ nhiệm (GV)</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="max-w-lg w-full mx-auto my-auto py-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl text-neutral-900 space-y-6 animate-in zoom-in-95">
          {/* Header Info */}
          <div className="text-center space-y-1.5 border-b border-neutral-100 pb-5">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900">
              Phòng thi chính thức
            </span>
            <h1 className="text-lg font-black text-neutral-900 pt-2">
              {currentExam ? currentExam.header.examTitle : 'BÀI THI TRẮC NGHIỆM'}
            </h1>
            {currentExam && (
              <div className="text-xs text-neutral-500 flex items-center justify-center gap-2">
                <span>Môn: <strong>{currentExam.header.subjectName}</strong></span>
                <span>·</span>
                <span>Thời gian: <strong>{currentExam.header.durationMinutes} phút</strong></span>
                <span>·</span>
                <span>{currentExam.questions.length} câu</span>
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleStartExam} className="space-y-4 text-xs">
            {/* Chọn đề thi nếu có nhiều đề */}
            {exams.length > 1 && (
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Chọn đề thi:
                </label>
                <select
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  className="w-full p-2.5 border border-neutral-300 rounded-xl bg-neutral-50 font-medium"
                >
                  {exams.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.header.examTitle} (Mã đề {ex.header.examCode} - {ex.header.subjectName})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Chọn học sinh / Nhập mã học sinh */}
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Học sinh làm bài:
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => {
                  setSelectedStudentId(e.target.value);
                  setErrorMsg(null);
                }}
                className="w-full p-2.5 border border-neutral-300 rounded-xl bg-white font-semibold text-neutral-900 focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="">-- Chọn tên hoặc STT của bạn trong lớp --</option>
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    STT {st.rollNumber}. {st.fullName} ({st.studentCode}) - Tổ {st.team}
                  </option>
                ))}
              </select>
            </div>

            {/* Hoặc gõ mã học sinh nhanh */}
            <div>
              <label className="block text-neutral-500 text-[11px] mb-1">
                Hoặc nhập nhanh Mã học sinh / Số báo danh:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ví dụ: HS1001 hoặc 1"
                  value={studentCodeInput}
                  onChange={(e) => setStudentCodeInput(e.target.value)}
                  className="w-full p-2.5 border border-neutral-300 rounded-xl font-mono text-xs uppercase"
                />
              </div>
              {activeStudent && (
                <div className="mt-1.5 text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Xác nhận: {activeStudent.fullName} (Lớp 10A1)</span>
                </div>
              )}
            </div>

            {/* Mã PIN phòng thi (nếu có yêu cầu) */}
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Mã PIN phòng thi (nếu giáo viên cung cấp):
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Nhập mã PIN do giáo viên cấp (hoặc để trống)"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-neutral-300 rounded-xl font-mono"
                />
              </div>
            </div>

            {/* Quy định phòng thi & Cam kết */}
            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 text-[11px] text-neutral-600">
              <div className="font-bold text-neutral-800 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                Quy định phòng thi trực tuyến:
              </div>
              <ul className="list-disc list-inside space-y-1">
                <li>Thời gian làm bài: <strong>{currentExam?.header.durationMinutes} phút</strong>.</li>
                <li>Hệ thống <strong>giám sát màn hình</strong> sẽ ghi lại số lần chuyển tab hoặc thoát ứng dụng.</li>
                <li>Hết giờ hệ thống sẽ tự động thu bài và chấm điểm.</li>
              </ul>

              <label className="flex items-center gap-2 pt-2 cursor-pointer font-medium text-neutral-800">
                <input
                  type="checkbox"
                  checked={isAgreedTerms}
                  onChange={(e) => setIsAgreedTerms(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>Em cam kết làm bài trung thực và tuân thủ quy chế thi.</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 mt-2"
            >
              <span>Vào phòng thi & Bắt đầu làm bài</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-neutral-400 py-2">
        Hệ thống Khảo thí & Sổ chủ nhiệm điện tử chuẩn Bộ Giáo dục & Đào tạo Việt Nam
      </div>
    </div>
  );
};
