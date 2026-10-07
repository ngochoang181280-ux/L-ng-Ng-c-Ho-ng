import React, { useState, useEffect, useRef } from 'react';
import { ExamPaper, Student, OnlineExamSession } from '../types';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft, 
  Send, 
  RotateCcw, 
  ShieldAlert, 
  Award, 
  Check, 
  X,
  FileCheck2,
  Save
} from 'lucide-react';

interface OnlineExamViewProps {
  exam: ExamPaper;
  students: Student[];
  onBack: () => void;
  onSaveExamResult: (session: OnlineExamSession) => void;
  onApplyScoreToGradebook: (studentId: string, subjectId: string, score: number) => void;
}

export const OnlineExamView: React.FC<OnlineExamViewProps> = ({
  exam,
  students,
  onBack,
  onSaveExamResult,
  onApplyScoreToGradebook,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [remainingSeconds, setRemainingSeconds] = useState(exam.header.durationMinutes * 60);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showViolationAlert, setShowViolationAlert] = useState(false);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [appliedToGradebook, setAppliedToGradebook] = useState(false);

  // Tùy chỉnh giám sát màn hình
  const [monitoringEnabled, setMonitoringEnabled] = useState<boolean>(
    exam.header.enableScreenMonitoring !== false
  );
  const [maxAllowedExits, setMaxAllowedExits] = useState<number>(
    exam.header.maxAllowedExits ?? 3
  );
  const [actionOnExceed, setActionOnExceed] = useState<'warn' | 'auto_submit'>(
    exam.header.actionOnExceed ?? 'warn'
  );
  const [violationLocked, setViolationLocked] = useState(false);

  const activeStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const { header, questions } = exam;

  // Giám sát màn hình: Theo dõi chuyển tab và thoát cửa sổ
  useEffect(() => {
    if (!isExamStarted || isSubmitted || !monitoringEnabled) return;

    const handleExitDetected = () => {
      setTabSwitchCount((prev) => {
        const next = prev + 1;
        if (actionOnExceed === 'auto_submit' && next >= maxAllowedExits) {
          setViolationLocked(true);
          setShowViolationAlert(true);
          // Tự động thu bài do vi phạm vượt quá số lần cho phép
          setTimeout(() => {
            handleSubmitExam(next, true);
          }, 300);
        } else {
          setShowViolationAlert(true);
        }
        return next;
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleExitDetected();
      }
    };

    const handleWindowBlur = () => {
      handleExitDetected();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [isExamStarted, isSubmitted, monitoringEnabled, actionOnExceed, maxAllowedExits]);

  // Đồng hồ đếm ngược
  useEffect(() => {
    if (!isExamStarted || isSubmitted) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExamStarted, isSubmitted]);

  // Format thời gian mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSelectAnswer = (questionId: string, choice: 'A' | 'B' | 'C' | 'D') => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: choice,
    }));
  };

  const handleSubmitExam = (overrideSwitchCount?: number, violationExceeded?: boolean) => {
    if (isSubmitted) return;

    // Chấm điểm
    let correctCount = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const finalScore = questions.length > 0 
      ? Math.round((correctCount / questions.length) * 10 * 10) / 10 
      : 0;

    const count = overrideSwitchCount !== undefined ? overrideSwitchCount : tabSwitchCount;
    const isExceeded = violationExceeded || (monitoringEnabled && actionOnExceed === 'auto_submit' && count >= maxAllowedExits);

    const session: OnlineExamSession = {
      examId: exam.id,
      studentId: activeStudent.id,
      studentName: activeStudent.fullName,
      studentCode: activeStudent.studentCode,
      startTime: new Date().toISOString(),
      durationMinutes: exam.header.durationMinutes,
      remainingSeconds,
      tabSwitchCount: count,
      maxAllowedExits,
      actionOnExceed,
      violationReason: isExceeded
        ? `Đình chỉ thi do thoát màn hình quá số lần quy định (${count}/${maxAllowedExits} lần)`
        : undefined,
      answers,
      isSubmitted: true,
      submittedAt: new Date().toLocaleTimeString('vi-VN'),
      score: finalScore,
      totalQuestions: questions.length,
      correctCount,
    };

    setIsSubmitted(true);
    onSaveExamResult(session);
  };

  // Tính kết quả
  let correctCount = 0;
  if (isSubmitted) {
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) correctCount++;
    });
  }
  const calculatedScore = questions.length > 0 
    ? Math.round((correctCount / questions.length) * 10 * 10) / 10 
    : 0;

  const currentQ = questions[currentQuestionIdx];

  const handleApplyGrade = () => {
    onApplyScoreToGradebook(activeStudent.id, exam.subjectId, calculatedScore);
    setAppliedToGradebook(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-neutral-900">
              Phòng thi trực tuyến: {header.examTitle}
            </h1>
            <div className="text-xs text-neutral-500 flex items-center gap-2 mt-0.5">
              <span>Môn: {header.subjectName}</span>
              <span aria-hidden="true">·</span>
              <span>Thời gian: {header.durationMinutes} phút</span>
              <span aria-hidden="true">·</span>
              <span>{questions.length} câu hỏi</span>
            </div>
          </div>
        </div>

        {/* Status Pills */}
        {isExamStarted && !isSubmitted && (
          <div className="flex items-center gap-3">
            {/* Giám sát vi phạm */}
            {monitoringEnabled ? (
              <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${
                tabSwitchCount >= maxAllowedExits 
                  ? 'bg-rose-50 text-rose-800 border-rose-300' 
                  : tabSwitchCount > 0
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300'
              }`}>
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>
                  Thoát màn hình: <strong>{tabSwitchCount}</strong> / {maxAllowedExits} lần
                </span>
              </div>
            ) : (
              <div className="px-2.5 py-1 rounded-lg border border-neutral-200 text-neutral-500 text-xs">
                Giám sát: Đã tắt
              </div>
            )}

            {/* Countdown timer */}
            <div className="px-3.5 py-1.5 bg-neutral-900 text-white rounded-lg font-mono font-bold text-sm tabular-nums flex items-center gap-2 shadow-2xs">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>{formatTime(remainingSeconds)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Screen Blur Violation Modal */}
      {showViolationAlert && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center shadow-2xl border-2 border-rose-500 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-rose-950">
              {violationLocked 
                ? 'ĐÃ ĐÌNH CHỈ THI & TỰ ĐỘNG THU BÀI!' 
                : 'CẢNH BÁO VI PHẠM QUY CHẾ THI!'}
            </h2>
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              Hệ thống phát hiện bạn vừa <strong>rời khỏi cửa sổ bài thi / chuyển tab khác</strong>.
              <br />
              Tổng số lần vi phạm: <span className="font-bold font-mono text-rose-600 text-base">{tabSwitchCount}</span> / {maxAllowedExits} lần cho phép.
            </p>
            {violationLocked ? (
              <p className="text-xs text-rose-700 font-semibold mt-2 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                Thí sinh đã vượt quá số lần thoát màn hình tối đa ({maxAllowedExits} lần). Hệ thống đã khóa bài làm và tự động nộp bài!
              </p>
            ) : (
              <p className="text-[11px] text-neutral-500 mt-2 italic">
                {actionOnExceed === 'auto_submit' 
                  ? `* Chú ý: Nếu tiếp tục vi phạm quá ${maxAllowedExits} lần, hệ thống sẽ tự động khóa và thu bài ngay lập tức!`
                  : '* Mọi hành vi thoát màn hình sẽ được gửi trực tiếp vào báo cáo của Giáo viên chủ nhiệm.'}
              </p>
            )}
            <button
              onClick={() => {
                setShowViolationAlert(false);
                if (violationLocked) {
                  // Already submitted, close dialog to show result
                }
              }}
              className="mt-6 w-full py-2.5 bg-rose-600 text-white font-semibold rounded-xl text-xs hover:bg-rose-700 transition-colors shadow-xs"
            >
              {violationLocked ? 'Xem kết quả bài thi' : 'Tôi đã hiểu & Quay lại làm bài ngay'}
            </button>
          </div>
        </div>
      )}

      {/* PRE-EXAM SCREEN: Select Student, Supervision Config, and Instructions */}
      {!isExamStarted && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 max-w-2xl mx-auto shadow-2xs space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900">
              Chuẩn bị làm bài thi: {header.examTitle}
            </h2>
            <p className="text-xs text-neutral-500">
              Bài thi có chức năng giám sát màn hình chống gian lận và tính giờ tự động.
            </p>
          </div>

          <div className="space-y-4 text-xs border border-neutral-200 p-4 rounded-xl bg-neutral-50/60">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1.5">
                Chọn học sinh thực hiện bài thi:
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full p-2.5 border border-neutral-300 rounded-lg bg-white font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.rollNumber}. {st.fullName} ({st.studentCode}) - Tổ {st.team}
                  </option>
                ))}
              </select>
            </div>

            {/* TÙY CHỈNH GIÁM SÁT MÀN HÌNH (YÊU CẦU NGƯỜI DÙNG) */}
            <div className="space-y-3 pt-3 border-t border-neutral-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold text-neutral-900 text-xs">
                    Tùy chỉnh giám sát màn hình & số lần thoát:
                  </span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-emerald-900">
                  <input
                    type="checkbox"
                    checked={monitoringEnabled}
                    onChange={(e) => setMonitoringEnabled(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>Bật giám sát</span>
                </label>
              </div>

              {monitoringEnabled ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-lg border border-neutral-200">
                  <div>
                    <label className="block font-medium text-neutral-700 mb-1">
                      Số lần thoát màn hình tối đa:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={maxAllowedExits}
                        onChange={(e) => setMaxAllowedExits(Math.max(1, Number(e.target.value)))}
                        className="w-20 p-2 border border-neutral-300 rounded-lg font-mono font-bold text-center"
                      />
                      <span className="text-neutral-500 text-[11px]">lần cho phép</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-neutral-700 mb-1">
                      Xử lý khi vượt quá số lần:
                    </label>
                    <select
                      value={actionOnExceed}
                      onChange={(e) => setActionOnExceed(e.target.value as 'warn' | 'auto_submit')}
                      className="w-full p-2 border border-neutral-300 rounded-lg text-xs"
                    >
                      <option value="warn">Chỉ cảnh báo & ghi biên bản</option>
                      <option value="auto_submit">Tự động đình chỉ & thu bài ngay</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-neutral-500 italic bg-neutral-100 p-2 rounded">
                  Chế độ giám sát màn hình đang tắt. Học sinh có thể chuyển cửa sổ mà không bị cảnh báo.
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2 border-t border-neutral-200">
              <div className="font-semibold text-neutral-800">Quy định phòng thi:</div>
              <ul className="list-disc list-inside space-y-1 text-neutral-600">
                <li>Thời gian làm bài: <strong>{header.durationMinutes} phút</strong>. Hết giờ hệ thống sẽ tự động thu bài.</li>
                <li>Không được chuyển tab, không mở ứng dụng khác trong lúc làm bài.</li>
                <li>
                  {monitoringEnabled ? (
                    <span>
                      Hệ thống <strong>giám sát màn hình</strong> đang bật (cho phép tối đa <strong>{maxAllowedExits} lần thoát</strong>, {actionOnExceed === 'auto_submit' ? 'vượt quá sẽ tự động thu bài' : 'ghi nhận biên bản'}).
                    </span>
                  ) : (
                    <span>Hệ thống làm bài tự do (không bật giám sát thoát màn hình).</span>
                  )}
                </li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => setIsExamStarted(true)}
            className="w-full py-3 bg-emerald-700 text-white font-semibold rounded-xl text-sm hover:bg-emerald-800 transition-colors shadow-xs"
          >
            Bắt đầu làm bài thi ngay
          </button>
        </div>
      )}

      {/* IN-EXAM SCREEN: Question & Navigation */}
      {isExamStarted && !isSubmitted && currentQ && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Area (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs space-y-6">
              {/* Question Header */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-neutral-900 text-sm">
                    Câu {currentQuestionIdx + 1} / {questions.length}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-medium">
                    Mức: {currentQ.level}
                  </span>
                  <span className="text-neutral-500">({currentQ.topic})</span>
                </div>
              </div>

              {/* Question Content */}
              <div className="text-sm font-medium text-neutral-900 leading-relaxed">
                {currentQ.content}
              </div>

              {/* Options */}
              <div className="space-y-3 pt-2">
                {currentQ.options.map((opt) => {
                  const isSelected = answers[currentQ.id] === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleSelectAnswer(currentQ.id, opt.key)}
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3 text-xs sm:text-sm ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/80 shadow-2xs text-emerald-950 font-semibold ring-1 ring-emerald-600'
                          : 'border-neutral-200 hover:bg-neutral-50/80 text-neutral-800'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold font-mono shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {opt.key}
                      </div>
                      <span className="pt-0.5 leading-relaxed">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Prev / Next controls */}
              <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
                <button
                  disabled={currentQuestionIdx === 0}
                  onClick={() => setCurrentQuestionIdx((p) => p - 1)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  &larr; Câu trước
                </button>

                <div className="text-xs text-neutral-500">
                  Đã trả lời {Object.keys(answers).length} / {questions.length} câu
                </div>

                <button
                  disabled={currentQuestionIdx === questions.length - 1}
                  onClick={() => setCurrentQuestionIdx((p) => p + 1)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Câu tiếp &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* Right Question Palette (1 col) */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wide text-neutral-700">
                Danh sách câu hỏi
              </h3>

              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, idx) => {
                  const isCurrent = idx === currentQuestionIdx;
                  const isAnswered = Boolean(answers[q.id]);
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIdx(idx)}
                      className={`h-9 rounded-lg font-mono font-bold text-xs transition-all ${
                        isCurrent
                          ? 'ring-2 ring-emerald-600 scale-105 bg-emerald-600 text-white'
                          : isAnswered
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 text-[11px] text-neutral-500 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300 inline-block" />
                  <span>Đã làm ({Object.keys(answers).length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-neutral-100 inline-block" />
                  <span>Chưa làm ({questions.length - Object.keys(answers).length})</span>
                </div>
              </div>

              {/* Nút nộp bài */}
              <div className="pt-3 border-t border-neutral-200">
                <button
                  onClick={() => {
                    if (window.confirm('Bạn có chắc chắn muốn nộp bài thi ngay bây giờ?')) {
                      handleSubmitExam();
                    }
                  }}
                  className="w-full py-2.5 bg-emerald-700 text-white font-semibold rounded-xl text-xs hover:bg-emerald-800 transition-colors shadow-2xs flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Nộp bài thi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POST-EXAM RESULTS SCREEN */}
      {isSubmitted && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Result Card */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-2xs">
                <Award className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-neutral-900">
                KẾT QUẢ BÀI THI: {header.examTitle}
              </h2>
              <div className="text-xs text-neutral-500">
                Thí sinh: <strong>{activeStudent.fullName}</strong> ({activeStudent.studentCode}) · Lớp 10A1
              </div>
            </div>

            {/* Violation warning banner if any */}
            {monitoringEnabled && tabSwitchCount >= maxAllowedExits && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                  <div className="font-bold text-sm">Vi phạm quy chế giám sát phòng thi:</div>
                  <div>
                    Thí sinh đã thoát màn hình <strong>{tabSwitchCount} lần</strong> (vượt quá giới hạn cho phép {maxAllowedExits} lần).
                    {actionOnExceed === 'auto_submit' 
                      ? ' Bài thi đã bị hệ thống tự động đình chỉ và nộp sớm.' 
                      : ' Biên bản vi phạm đã được lập và lưu vào sổ theo dõi nề nếp.'}
                  </div>
                </div>
              </div>
            )}

            {/* Scores & Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 text-center">
                <span className="text-neutral-500">Điểm số đạt được</span>
                <div className="text-3xl font-bold font-mono text-emerald-700 mt-1 tabular-nums">
                  {calculatedScore} / 10
                </div>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 text-center">
                <span className="text-neutral-500">Số câu trả lời đúng</span>
                <div className="text-2xl font-bold font-mono text-neutral-900 mt-1 tabular-nums">
                  {correctCount} / {questions.length}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 text-center">
                <span className="text-neutral-500">Tỷ lệ chính xác</span>
                <div className="text-2xl font-bold font-mono text-neutral-900 mt-1 tabular-nums">
                  {questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0}%
                </div>
              </div>

              <div className={`p-4 rounded-xl border text-center ${
                tabSwitchCount > 0 ? 'border-rose-300 bg-rose-50/50' : 'border-neutral-200 bg-neutral-50'
              }`}>
                <span className="text-neutral-500">Thoát màn hình</span>
                <div className={`text-2xl font-bold font-mono mt-1 tabular-nums ${
                  tabSwitchCount > 0 ? 'text-rose-600' : 'text-emerald-700'
                }`}>
                  {tabSwitchCount} lần
                </div>
              </div>
            </div>

            {/* Quick action to save score to class gradebook */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>
                  Lưu điểm số <strong>{calculatedScore}</strong> của học sinh <strong>{activeStudent.fullName}</strong> trực tiếp vào Sổ điểm môn {header.subjectName}?
                </span>
              </div>
              <button
                onClick={handleApplyGrade}
                disabled={appliedToGradebook}
                className="px-4 py-2 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 disabled:opacity-60 transition-colors shrink-0 shadow-2xs inline-flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{appliedToGradebook ? 'Đã lưu vào sổ điểm!' : 'Lưu vào sổ điểm'}</span>
              </button>
            </div>

            {/* Detailed Answers Review */}
            <div className="space-y-4 pt-4 border-t border-neutral-200">
              <h3 className="font-bold text-xs uppercase tracking-wide text-neutral-800">
                Chi tiết bài làm & Đáp án từng câu
              </h3>

              <div className="space-y-4 text-xs">
                {questions.map((q, idx) => {
                  const studentChoice = answers[q.id];
                  const isCorrect = studentChoice === q.correctAnswer;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border space-y-2 ${
                        isCorrect
                          ? 'border-emerald-200 bg-emerald-50/30'
                          : 'border-rose-200 bg-rose-50/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold text-neutral-900">
                          Câu {idx + 1}: {q.content}
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isCorrect ? 'Đúng' : 'Sai'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-neutral-700 pt-1">
                        {q.options.map((opt) => (
                          <div
                            key={opt.key}
                            className={`p-2 rounded-lg border text-[11px] ${
                              opt.key === q.correctAnswer
                                ? 'border-emerald-500 bg-emerald-100 font-bold text-emerald-950'
                                : opt.key === studentChoice && !isCorrect
                                ? 'border-rose-400 bg-rose-100 text-rose-950'
                                : 'border-neutral-200 bg-white'
                            }`}
                          >
                            <span className="font-bold font-mono mr-1">{opt.key}.</span>
                            <span>{opt.text}</span>
                          </div>
                        ))}
                      </div>

                      {q.explanation && (
                        <div className="text-[11px] text-neutral-600 bg-white/70 p-2 rounded border border-neutral-200 mt-2">
                          <strong>Hướng dẫn giải:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
