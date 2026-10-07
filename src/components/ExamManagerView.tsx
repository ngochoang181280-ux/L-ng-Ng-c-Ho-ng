import React, { useState } from 'react';
import { 
  ExamPaper, 
  Question, 
  ExamHeaderConfig, 
  ExamMatrix, 
  Subject, 
  Student, 
  OnlineExamSession,
  QuestionLevel 
} from '../types';
import { generateExamPaperByMatrix } from '../data/examData';
import { 
  FileText, 
  Printer, 
  MonitorPlay, 
  Plus, 
  Sparkles, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  Filter, 
  HelpCircle,
  ShieldAlert,
  Search,
  BookOpen,
  Share2,
  QrCode,
  Camera,
  Upload,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { PaperExamPrintView } from './PaperExamPrintView';
import { OnlineExamView } from './OnlineExamView';
import { ShareExamModal } from './ShareExamModal';
import { OmrScannerModal } from './OmrScannerModal';
import { AiVisionQuestionModal } from './AiVisionQuestionModal';
import { ImportQuestionsModal } from './ImportQuestionsModal';
import { 
  downloadFile, 
  getQuestionTemplateCSV, 
  getQuestionTemplateTXT, 
  getQuestionTemplateJSON 
} from '../utils/templateGenerators';

interface ExamManagerViewProps {
  exams: ExamPaper[];
  questionBank: Question[];
  subjects: Subject[];
  students: Student[];
  onSaveExam: (exam: ExamPaper) => void;
  onDeleteExam: (id: string) => void;
  onAddQuestionToBank: (question: Question) => void;
  onAddQuestionsToBank?: (questions: Question[]) => void;
  onSaveExamResult: (session: OnlineExamSession) => void;
  onApplyScoreToGradebook: (studentId: string, subjectId: string, score: number) => void;
}

export const ExamManagerView: React.FC<ExamManagerViewProps> = ({
  exams,
  questionBank,
  subjects,
  students,
  onSaveExam,
  onDeleteExam,
  onAddQuestionToBank,
  onAddQuestionsToBank,
  onSaveExamResult,
  onApplyScoreToGradebook,
}) => {
  const [activeSubView, setActiveSubView] = useState<'list' | 'print' | 'online' | 'bank'>('list');
  const [selectedExam, setSelectedExam] = useState<ExamPaper | null>(exams[0] || null);
  const [sharingExam, setSharingExam] = useState<ExamPaper | null>(null);
  const [omrExam, setOmrExam] = useState<ExamPaper | null>(null);
  const [showAiVisionModal, setShowAiVisionModal] = useState<boolean>(false);
  const [showImportQuestionsModal, setShowImportQuestionsModal] = useState<boolean>(false);
  const [showQuestionTemplateMenu, setShowQuestionTemplateMenu] = useState<boolean>(false);

  // Form cấu hình đề thi tùy chỉnh
  const [headerConfig, setHeaderConfig] = useState<ExamHeaderConfig>({
    departmentName: 'SỞ GIÁO DỤC VÀ ĐÀO TẠO',
    schoolName: 'TRƯỜNG THPT LÊ QUÝ ĐÔN',
    examTitle: 'KIỂM TRA ĐỊNH KỲ GIỮA HỌC KỲ I',
    academicYear: 'Năm học 2024 - 2025',
    subjectName: 'TOÁN HỌC',
    grade: 'Lớp 10',
    durationMinutes: 45,
    examCode: '101',
    paperNote: 'Đề thi gồm các câu trắc nghiệm khách quan. Thí sinh không được sử dụng tài liệu.',
    enableScreenMonitoring: true,
    maxAllowedExits: 3,
    actionOnExceed: 'warn',
  });

  const [matrixConfig, setMatrixConfig] = useState<ExamMatrix>({
    recognitionCount: 8,
    comprehensionCount: 6,
    applicationCount: 4,
    highApplicationCount: 2,
  });

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('math');
  const [notification, setNotification] = useState<string | null>(null);

  // Form thêm câu hỏi mới
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    subjectId: 'math',
    topic: 'Đại số & Giải tích',
    level: 'Nhận biết',
    content: '',
    options: [
      { key: 'A', text: '' },
      { key: 'B', text: '' },
      { key: 'C', text: '' },
      { key: 'D', text: '' },
    ],
    correctAnswer: 'A',
    explanation: '',
  });

  const totalQuestions = 
    Number(matrixConfig.recognitionCount) +
    Number(matrixConfig.comprehensionCount) +
    Number(matrixConfig.applicationCount) +
    Number(matrixConfig.highApplicationCount);

  // Tạo đề thi tự động theo ma trận
  const handleGenerateExam = () => {
    if (totalQuestions <= 0) {
      alert('Vui lòng chọn số lượng câu hỏi lớn hơn 0!');
      return;
    }

    const currentSub = subjects.find((s) => s.id === selectedSubjectId);
    const updatedHeader: ExamHeaderConfig = {
      ...headerConfig,
      subjectName: currentSub ? currentSub.name.toUpperCase() : headerConfig.subjectName,
    };

    const generated = generateExamPaperByMatrix(
      selectedSubjectId,
      updatedHeader,
      matrixConfig,
      questionBank
    );

    onSaveExam(generated);
    setSelectedExam(generated);
    setNotification(`Đã tạo thành công đề thi tự động gồm ${generated.questions.length} câu (sắp xếp đúng thứ tự từ Nhận biết -> Thông hiểu -> Vận dụng -> Vận dụng cao)!`);
    setTimeout(() => setNotification(null), 3500);
  };

  // Tạo bộ 4 mã đề hoán vị (101, 102, 103, 104) chống nhìn bài
  const handleGenerate4Variants = (baseExam: ExamPaper) => {
    const codes = ['102', '103', '104'];
    const newExams: ExamPaper[] = [];

    codes.forEach((code, codeIdx) => {
      // Nhóm câu hỏi theo 4 mức độ để hoán vị trong từng mức
      const rec = baseExam.questions.filter((q) => q.level === 'Nhận biết');
      const comp = baseExam.questions.filter((q) => q.level === 'Thông hiểu');
      const app = baseExam.questions.filter((q) => q.level === 'Vận dụng');
      const high = baseExam.questions.filter((q) => q.level === 'Vận dụng cao');

      // Hàm đảo mảng có seed
      const shuffle = <T,>(arr: T[]): T[] => {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
          const j = (i * 7 + codeIdx * 3) % (i + 1);
          [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
      };

      const shuffledQuestions = [
        ...shuffle(rec),
        ...shuffle(comp),
        ...shuffle(app),
        ...shuffle(high),
      ];

      const variant: ExamPaper = {
        ...baseExam,
        id: `exam-${Date.now()}-${code}`,
        title: `${baseExam.header.examTitle} (Mã đề ${code})`,
        header: {
          ...baseExam.header,
          examCode: code,
        },
        questions: shuffledQuestions,
        createdAt: new Date().toISOString(),
      };

      onSaveExam(variant);
      newExams.push(variant);
    });

    setNotification(`Đã tạo thành công bộ 4 mã đề hoán vị (101, 102, 103, 104) cho môn ${baseExam.header.subjectName}!`);
    setTimeout(() => setNotification(null), 3500);
  };

  // Submit câu hỏi mới vào ngân hàng
  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.content?.trim()) {
      alert('Vui lòng nhập nội dung câu hỏi!');
      return;
    }

    const q: Question = {
      id: `q-custom-${Date.now()}`,
      subjectId: newQuestion.subjectId || 'math',
      topic: newQuestion.topic || 'Kiến thức trọng tâm',
      level: newQuestion.level as QuestionLevel,
      content: newQuestion.content,
      options: newQuestion.options || [],
      correctAnswer: newQuestion.correctAnswer || 'A',
      explanation: newQuestion.explanation || '',
    };

    onAddQuestionToBank(q);
    setNotification('Đã thêm câu hỏi mới vào ngân hàng đề!');
    setTimeout(() => setNotification(null), 2500);
    setNewQuestion({
      subjectId: 'math',
      topic: 'Kiến thức trọng tâm',
      level: 'Nhận biết',
      content: '',
      options: [
        { key: 'A', text: '' },
        { key: 'B', text: '' },
        { key: 'C', text: '' },
        { key: 'D', text: '' },
      ],
      correctAnswer: 'A',
      explanation: '',
    });
  };

  // If subview is paper print
  if (activeSubView === 'print' && selectedExam) {
    return (
      <PaperExamPrintView
        exam={selectedExam}
        onBack={() => setActiveSubView('list')}
      />
    );
  }

  // If subview is online exam
  if (activeSubView === 'online' && selectedExam) {
    return (
      <OnlineExamView
        exam={selectedExam}
        students={students}
        onBack={() => setActiveSubView('list')}
        onSaveExamResult={onSaveExamResult}
        onApplyScoreToGradebook={onApplyScoreToGradebook}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-bold text-neutral-900">
              Hệ thống Soạn đề & Thi trắc nghiệm
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Tạo đề tự động theo ma trận 4 mức độ (sắp xếp từ thấp đến cao), xuất đề in giấy và thi trực tuyến có giám sát màn hình
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-neutral-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveSubView('list')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeSubView === 'list'
                    ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Tạo đề & Danh sách
              </button>
              <button
                onClick={() => setActiveSubView('bank')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeSubView === 'bank'
                    ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Ngân hàng câu hỏi ({questionBank.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2.5 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* VIEW: TẠO ĐỀ & DANH SÁCH ĐỀ THI */}
      {activeSubView === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Cột trái: Cấu hình tạo đề tự động theo ma trận (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-2xs space-y-4 text-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-200">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <h2 className="text-sm font-bold text-neutral-900">
                  Cấu hình tạo đề tự động
                </h2>
              </div>

              {/* Môn học & Khối lớp */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Môn thi</label>
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    className="w-full p-2 border border-neutral-300 rounded-lg font-semibold"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Khối lớp</label>
                  <input
                    type="text"
                    value={headerConfig.grade}
                    onChange={(e) => setHeaderConfig({ ...headerConfig, grade: e.target.value })}
                    className="w-full p-2 border border-neutral-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Tùy chỉnh Tiêu đề đề thi */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <div className="font-semibold text-neutral-800 text-[11px] uppercase tracking-wide text-neutral-500">
                  Tùy chỉnh thông tin tiêu đề đề thi
                </div>

                <div>
                  <label className="block text-neutral-600 mb-1">Tên trường học</label>
                  <input
                    type="text"
                    value={headerConfig.schoolName}
                    onChange={(e) => setHeaderConfig({ ...headerConfig, schoolName: e.target.value })}
                    className="w-full p-2 border border-neutral-300 rounded-lg font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-neutral-600 mb-1">Kỳ kiểm tra</label>
                    <input
                      type="text"
                      value={headerConfig.examTitle}
                      onChange={(e) => setHeaderConfig({ ...headerConfig, examTitle: e.target.value })}
                      placeholder="KIỂM TRA GIỮA KỲ..."
                      className="w-full p-2 border border-neutral-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-600 mb-1">Năm học</label>
                    <input
                      type="text"
                      value={headerConfig.academicYear}
                      onChange={(e) => setHeaderConfig({ ...headerConfig, academicYear: e.target.value })}
                      className="w-full p-2 border border-neutral-300 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-neutral-600 mb-1">Thời gian làm bài (phút)</label>
                    <input
                      type="number"
                      value={headerConfig.durationMinutes}
                      onChange={(e) => setHeaderConfig({ ...headerConfig, durationMinutes: Number(e.target.value) })}
                      className="w-full p-2 border border-neutral-300 rounded-lg font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-600 mb-1">Mã đề thi</label>
                    <input
                      type="text"
                      value={headerConfig.examCode}
                      onChange={(e) => setHeaderConfig({ ...headerConfig, examCode: e.target.value })}
                      className="w-full p-2 border border-neutral-300 rounded-lg font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Tùy chỉnh Giám sát màn hình khi thi trực tuyến */}
                <div className="pt-2 border-t border-neutral-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-800 text-[11px] uppercase tracking-wide text-neutral-500">
                      Giám sát màn hình khi thi online
                    </span>
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-emerald-800">
                      <input
                        type="checkbox"
                        checked={headerConfig.enableScreenMonitoring !== false}
                        onChange={(e) => setHeaderConfig({ ...headerConfig, enableScreenMonitoring: e.target.checked })}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                      />
                      <span>Bật giám sát</span>
                    </label>
                  </div>

                  {headerConfig.enableScreenMonitoring !== false && (
                    <div className="grid grid-cols-2 gap-2 bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
                      <div>
                        <label className="block text-neutral-600 text-[11px] mb-1">Số lần thoát tối đa</label>
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={headerConfig.maxAllowedExits ?? 3}
                          onChange={(e) => setHeaderConfig({ ...headerConfig, maxAllowedExits: Math.max(1, Number(e.target.value)) })}
                          className="w-full p-1.5 border border-neutral-300 rounded bg-white font-mono font-bold text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-600 text-[11px] mb-1">Khi vượt quá số lần</label>
                        <select
                          value={headerConfig.actionOnExceed || 'warn'}
                          onChange={(e) => setHeaderConfig({ ...headerConfig, actionOnExceed: e.target.value as 'warn' | 'auto_submit' })}
                          className="w-full p-1.5 border border-neutral-300 rounded bg-white text-[11px] font-medium"
                        >
                          <option value="warn">Cảnh báo & ghi biên bản</option>
                          <option value="auto_submit">Tự động nộp & khóa bài</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tùy chỉnh Ma trận 4 mức độ */}
              <div className="space-y-3 pt-3 border-t border-neutral-100">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-800 text-[11px] uppercase tracking-wide text-neutral-500">
                    Ma trận số câu hỏi 4 mức độ
                  </span>
                  <span className="font-bold text-emerald-800">
                    Tổng: {totalQuestions} câu
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200">
                    <label className="block text-neutral-600 text-[11px] mb-1">1. Nhận biết</label>
                    <input
                      type="number"
                      min={0}
                      value={matrixConfig.recognitionCount}
                      onChange={(e) => setMatrixConfig({ ...matrixConfig, recognitionCount: Number(e.target.value) })}
                      className="w-full p-1.5 border border-neutral-300 rounded bg-white font-mono font-bold text-center"
                    />
                  </div>

                  <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200">
                    <label className="block text-neutral-600 text-[11px] mb-1">2. Thông hiểu</label>
                    <input
                      type="number"
                      min={0}
                      value={matrixConfig.comprehensionCount}
                      onChange={(e) => setMatrixConfig({ ...matrixConfig, comprehensionCount: Number(e.target.value) })}
                      className="w-full p-1.5 border border-neutral-300 rounded bg-white font-mono font-bold text-center"
                    />
                  </div>

                  <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200">
                    <label className="block text-neutral-600 text-[11px] mb-1">3. Vận dụng</label>
                    <input
                      type="number"
                      min={0}
                      value={matrixConfig.applicationCount}
                      onChange={(e) => setMatrixConfig({ ...matrixConfig, applicationCount: Number(e.target.value) })}
                      className="w-full p-1.5 border border-neutral-300 rounded bg-white font-mono font-bold text-center"
                    />
                  </div>

                  <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200">
                    <label className="block text-neutral-600 text-[11px] mb-1">4. Vận dụng cao</label>
                    <input
                      type="number"
                      min={0}
                      value={matrixConfig.highApplicationCount}
                      onChange={(e) => setMatrixConfig({ ...matrixConfig, highApplicationCount: Number(e.target.value) })}
                      className="w-full p-1.5 border border-neutral-300 rounded bg-white font-mono font-bold text-center"
                    />
                  </div>
                </div>

                <div className="text-[11px] text-neutral-500 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200/60 leading-relaxed">
                  ✓ <strong>Nguyên tắc sắp xếp:</strong> Đề thi được sắp xếp nghiêm ngặt theo thứ tự mức độ từ thấp đến cao (Câu 1 đến {matrixConfig.recognitionCount} là Nhận biết, tiếp theo là Thông hiểu, Vận dụng và cuối cùng là Vận dụng cao).
                </div>
              </div>

              <button
                onClick={handleGenerateExam}
                className="w-full py-2.5 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-colors shadow-xs flex items-center justify-center gap-1.5 text-xs"
              >
                <Sparkles className="w-4 h-4" />
                <span>Tạo đề tự động ngay</span>
              </button>
            </div>
          </div>

          {/* Cột phải: Danh sách đề thi đã tạo (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                <h2 className="text-sm font-bold text-neutral-900">
                  Danh sách đề thi đã tạo ({exams.length})
                </h2>
                <span className="text-xs text-neutral-500">
                  Chọn đề thi để In trên giấy hoặc Bật phòng thi online
                </span>
              </div>

              {exams.length === 0 ? (
                <div className="py-12 text-center text-xs text-neutral-500">
                  Chưa có đề thi nào. Hãy nhấn "Tạo đề tự động ngay" ở cột bên trái!
                </div>
              ) : (
                <div className="space-y-3">
                  {exams.map((ex) => (
                    <div
                      key={ex.id}
                      className="p-4 rounded-xl border border-neutral-200 hover:border-emerald-300 transition-all bg-white hover:bg-neutral-50/40 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-neutral-900 text-sm">{ex.header.examTitle}</h3>
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-mono font-semibold text-xs border border-emerald-200">
                              Mã: {ex.header.examCode}
                            </span>
                          </div>
                          <div className="text-xs text-neutral-500 mt-1 flex items-center gap-2">
                            <span>Môn {ex.header.subjectName}</span>
                            <span aria-hidden="true">·</span>
                            <span>{ex.questions.length} câu trắc nghiệm</span>
                            <span aria-hidden="true">·</span>
                            <span>{ex.header.durationMinutes} phút</span>
                            <span aria-hidden="true">·</span>
                            <span>{ex.header.schoolName}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => onDeleteExam(ex.id)}
                          className="p-1 text-neutral-400 hover:text-rose-600 rounded transition-colors"
                          title="Xóa đề thi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Ma trận phân bố */}
                      <div className="flex items-center gap-3 text-[11px] text-neutral-600 bg-neutral-50 p-2 rounded-lg font-mono">
                        <span>Nhận biết: {ex.matrix.recognitionCount}</span>
                        <span aria-hidden="true">·</span>
                        <span>Thông hiểu: {ex.matrix.comprehensionCount}</span>
                        <span aria-hidden="true">·</span>
                        <span>Vận dụng: {ex.matrix.applicationCount}</span>
                        <span aria-hidden="true">·</span>
                        <span>Vận dụng cao: {ex.matrix.highApplicationCount}</span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          onClick={() => {
                            setSelectedExam(ex);
                            setActiveSubView('print');
                          }}
                          className="px-3.5 py-1.5 bg-white border border-neutral-300 text-neutral-800 font-semibold rounded-lg hover:bg-neutral-100 transition-colors text-xs inline-flex items-center gap-1.5 shadow-2xs"
                        >
                          <Printer className="w-3.5 h-3.5 text-neutral-600" />
                          <span>Xuất đề in trên giấy</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedExam(ex);
                            setActiveSubView('online');
                          }}
                          className="px-3.5 py-1.5 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-colors text-xs inline-flex items-center gap-1.5 shadow-2xs"
                        >
                          <MonitorPlay className="w-3.5 h-3.5" />
                          <span>Mở thi online (Có giám sát)</span>
                        </button>

                        <button
                          onClick={() => setSharingExam(ex)}
                          className="px-3.5 py-1.5 bg-amber-50 border border-amber-300 text-amber-900 font-semibold rounded-lg hover:bg-amber-100 transition-colors text-xs inline-flex items-center gap-1.5 shadow-2xs"
                          title="Lấy link trực tiếp và mã QR cho học sinh quét vào thi"
                        >
                          <Share2 className="w-3.5 h-3.5 text-amber-700" />
                          <span>Chia sẻ link & Mã QR cho HS</span>
                        </button>

                        <button
                          onClick={() => setOmrExam(ex)}
                          className="px-3.5 py-1.5 bg-rose-50 border border-rose-300 text-rose-900 font-semibold rounded-lg hover:bg-rose-100 transition-colors text-xs inline-flex items-center gap-1.5 shadow-2xs"
                          title="Chấm phiếu trả lời trắc nghiệm giấy tự động bằng Camera điện thoại hoặc Webcam"
                        >
                          <Camera className="w-3.5 h-3.5 text-rose-700" />
                          <span>Chấm bài bằng Camera (OMR)</span>
                        </button>

                        <button
                          onClick={() => handleGenerate4Variants(ex)}
                          className="px-3.5 py-1.5 bg-sky-50 border border-sky-300 text-sky-800 font-semibold rounded-lg hover:bg-sky-100 transition-colors text-xs inline-flex items-center gap-1.5 shadow-2xs"
                          title="Tạo các mã đề hoán vị 102, 103, 104 từ đề này"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                          <span>Tạo 4 mã đề hoán vị</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: NGÂN HÀNG CÂU HỎI TRẮC NGHIỆM */}
      {activeSubView === 'bank' && (
        <div className="space-y-6">
          {/* Thêm câu hỏi mới */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-2xs space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-neutral-200">
              <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-700" />
                <span>Thêm câu hỏi mới vào ngân hàng đề</span>
              </h2>

              <div className="flex flex-wrap items-center gap-2">
                {/* Menu Tải file mẫu câu hỏi */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowQuestionTemplateMenu(!showQuestionTemplateMenu)}
                    className="px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg font-bold text-xs hover:bg-emerald-100 transition-colors shadow-2xs inline-flex items-center gap-1.5"
                    title="Tải file mẫu Excel, Word hoặc JSON câu hỏi trắc nghiệm để làm theo mẫu"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải file mẫu câu hỏi</span>
                  </button>

                  {showQuestionTemplateMenu && (
                    <div 
                      className="absolute right-0 mt-1 w-60 bg-white border border-neutral-200 rounded-xl shadow-xl z-30 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150"
                      onClick={() => setShowQuestionTemplateMenu(false)}
                    >
                      <div className="text-[10px] font-bold text-neutral-500 uppercase px-2 py-1">
                        Chọn định dạng tải về:
                      </div>
                      <button
                        type="button"
                        onClick={() => downloadFile(getQuestionTemplateCSV(), 'Mau_Ngan_Hang_Cau_Hoi.csv', 'text/csv;charset=utf-8;')}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 text-xs text-neutral-800 flex items-center gap-2 font-medium"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <div>
                          <span className="font-bold block">1. File Excel (.csv)</span>
                          <span className="text-[10px] text-neutral-500">Mở bằng Excel tiếng Việt UTF-8</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => downloadFile(getQuestionTemplateTXT(), 'Mau_Ngan_Hang_Cau_Hoi.txt', 'text/plain;charset=utf-8')}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-sky-50 text-xs text-neutral-800 flex items-center gap-2 font-medium"
                      >
                        <FileText className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <div>
                          <span className="font-bold block">2. File Word / Text (.txt)</span>
                          <span className="text-[10px] text-neutral-500">Cú pháp A, B, C, D chuẩn</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => downloadFile(getQuestionTemplateJSON(), 'Mau_Ngan_Hang_Cau_Hoi.json', 'application/json;charset=utf-8')}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-purple-50 text-xs text-neutral-800 flex items-center gap-2 font-medium"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <div>
                          <span className="font-bold block">3. File Cấu trúc (.json)</span>
                          <span className="text-[10px] text-neutral-500">Dữ liệu trao đổi ngân hàng</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                {/* Nút Nhập câu hỏi từ file mẫu */}
                <button
                  type="button"
                  onClick={() => setShowImportQuestionsModal(true)}
                  className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg text-xs transition-all shadow-2xs inline-flex items-center gap-1.5"
                  title="Nhập hàng loạt câu hỏi từ file Excel, file TXT hoặc dán nội dung"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Nhập câu hỏi từ File mẫu</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAiVisionModal(true)}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-bold rounded-lg text-xs transition-all shadow-xs inline-flex items-center gap-2"
                  title="Chụp ảnh trang sách giáo khoa hoặc tải ảnh bài tập để Gemini AI tự động trích xuất câu hỏi"
                >
                  <Camera className="w-4 h-4 text-emerald-200" />
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Soạn từ Ảnh SGK (AI)</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateQuestion} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Môn học</label>
                  <select
                    value={newQuestion.subjectId}
                    onChange={(e) => setNewQuestion({ ...newQuestion, subjectId: e.target.value })}
                    className="w-full p-2 border border-neutral-300 rounded-lg"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Mức độ nhận thức</label>
                  <select
                    value={newQuestion.level}
                    onChange={(e) => setNewQuestion({ ...newQuestion, level: e.target.value as QuestionLevel })}
                    className="w-full p-2 border border-neutral-300 rounded-lg font-semibold"
                  >
                    <option value="Nhận biết">1. Nhận biết</option>
                    <option value="Thông hiểu">2. Thông hiểu</option>
                    <option value="Vận dụng">3. Vận dụng</option>
                    <option value="Vận dụng cao">4. Vận dụng cao</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Chuyên đề / Bài học</label>
                  <input
                    type="text"
                    value={newQuestion.topic}
                    onChange={(e) => setNewQuestion({ ...newQuestion, topic: e.target.value })}
                    placeholder="VD: Hàm số, Vectơ, Động học..."
                    className="w-full p-2 border border-neutral-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Nội dung câu hỏi *</label>
                <textarea
                  rows={2}
                  value={newQuestion.content}
                  onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                  placeholder="Nhập nội dung câu hỏi..."
                  className="w-full p-2.5 border border-neutral-300 rounded-lg"
                  required
                />
              </div>

              {/* 4 Phương án */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['A', 'B', 'C', 'D'].map((key) => {
                  const optIdx = key === 'A' ? 0 : key === 'B' ? 1 : key === 'C' ? 2 : 3;
                  return (
                    <div key={key} className="flex items-center gap-2">
                      <span className="font-bold font-mono w-6 text-center">{key}.</span>
                      <input
                        type="text"
                        value={newQuestion.options?.[optIdx]?.text || ''}
                        onChange={(e) => {
                          const updated = [...(newQuestion.options || [])];
                          updated[optIdx] = { key: key as any, text: e.target.value };
                          setNewQuestion({ ...newQuestion, options: updated });
                        }}
                        placeholder={`Phương án ${key}...`}
                        className="flex-1 p-2 border border-neutral-300 rounded-lg"
                        required
                      />
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Đáp án đúng</label>
                  <select
                    value={newQuestion.correctAnswer}
                    onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value as any })}
                    className="w-full p-2 border border-neutral-300 rounded-lg font-mono font-bold"
                  >
                    <option value="A">Phương án A</option>
                    <option value="B">Phương án B</option>
                    <option value="C">Phương án C</option>
                    <option value="D">Phương án D</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Hướng dẫn giải / Lời giải chi tiết</label>
                  <input
                    type="text"
                    value={newQuestion.explanation}
                    onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                    placeholder="Giải thích ngắn gọn căn cứ đáp án..."
                    className="w-full p-2 border border-neutral-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-colors shadow-2xs text-xs"
                >
                  Lưu vào ngân hàng câu hỏi
                </button>
              </div>
            </form>
          </div>

          {/* Danh sách câu hỏi trong ngân hàng */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-neutral-900 pb-2 border-b border-neutral-200">
              Các câu hỏi hiện có trong hệ thống ({questionBank.length} câu)
            </h2>

            <div className="space-y-3">
              {questionBank.map((q, idx) => (
                <div key={q.id} className="p-3.5 rounded-xl border border-neutral-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-900">Câu {idx + 1}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        q.level === 'Nhận biết'
                          ? 'bg-neutral-100 text-neutral-800'
                          : q.level === 'Thông hiểu'
                          ? 'bg-sky-50 text-sky-800'
                          : q.level === 'Vận dụng'
                          ? 'bg-amber-50 text-amber-800'
                          : 'bg-rose-50 text-rose-800'
                      }`}>
                        {q.level}
                      </span>
                      <span className="text-neutral-500 font-medium">({q.topic})</span>
                    </div>

                    <span className="font-mono text-emerald-700 font-bold text-xs">
                      Đáp án đúng: {q.correctAnswer}
                    </span>
                  </div>

                  <p className="font-medium text-neutral-800">{q.content}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-neutral-600 pl-4">
                    {q.options.map((opt) => (
                      <div key={opt.key} className={opt.key === q.correctAnswer ? 'font-bold text-emerald-800' : ''}>
                        <span className="font-mono mr-1">{opt.key}.</span> {opt.text}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Chia sẻ link & Mã QR cho học sinh */}
      {sharingExam && (
        <ShareExamModal
          exam={sharingExam}
          classRoomPin="2025"
          onClose={() => setSharingExam(null)}
          onOpenOnlineExam={(ex) => {
            setSelectedExam(ex);
            setActiveSubView('online');
          }}
        />
      )}

      {/* Modal Chấm bài bằng Camera (OMR Scanner) */}
      {omrExam && (
        <OmrScannerModal
          exam={omrExam}
          students={students}
          onClose={() => setOmrExam(null)}
          onApplyScoreToGradebook={onApplyScoreToGradebook}
        />
      )}

      {/* Modal Soạn câu hỏi từ Ảnh chụp Sách giáo khoa bằng Gemini AI */}
      {showAiVisionModal && (
        <AiVisionQuestionModal
          subjects={subjects}
          onClose={() => setShowAiVisionModal(false)}
          onAddQuestions={(newQuestions) => {
            newQuestions.forEach((q) => onAddQuestionToBank(q));
          }}
        />
      )}

      {/* Modal Nhập câu hỏi từ File mẫu (Excel, Word, JSON) */}
      {showImportQuestionsModal && (
        <ImportQuestionsModal
          subjects={subjects}
          onClose={() => setShowImportQuestionsModal(false)}
          onAddQuestions={(newQuestions) => {
            if (onAddQuestionsToBank) {
              onAddQuestionsToBank(newQuestions);
            } else {
              newQuestions.forEach((q) => onAddQuestionToBank(q));
            }
            setNotification(`Đã thêm thành công ${newQuestions.length} câu hỏi vào Ngân hàng câu hỏi!`);
            setTimeout(() => setNotification(null), 3500);
          }}
        />
      )}
    </div>
  );
};
