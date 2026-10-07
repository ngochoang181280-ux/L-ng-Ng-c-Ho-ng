import React, { useState } from 'react';
import { ExamPaper } from '../types';
import { Printer, ArrowLeft, CheckCircle, FileText, HelpCircle, KeyRound, CheckSquare, Layers } from 'lucide-react';

interface PaperExamPrintViewProps {
  exam: ExamPaper;
  onBack: () => void;
}

export const PaperExamPrintView: React.FC<PaperExamPrintViewProps> = ({
  exam,
  onBack,
}) => {
  // Chế độ in:
  // 'exam_and_key': In đề thi + Bảng đáp án đối chiếu nhanh ở trang sau
  // 'exam_only': Chỉ in đề thi (phát cho học sinh)
  // 'key_only': Chỉ in Bảng đáp án đối chiếu (dành riêng cho giáo viên chấm thi)
  const [printOption, setPrintOption] = useState<'exam_and_key' | 'exam_only' | 'key_only'>('exam_and_key');
  const [showDetailedExplanation, setShowDetailedExplanation] = useState(true);

  const handlePrint = () => {
    window.print();
  };

  const { header, questions } = exam;

  // Tính điểm mỗi câu trên thang điểm 10
  const scorePerQuestion = questions.length > 0 ? (10 / questions.length).toFixed(2) : '0';

  return (
    <div className="space-y-6">
      {/* Top Controls Bar (Hidden during print) */}
      <div className="no-print bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              title="Quay lại danh sách đề thi"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold text-neutral-900">
                Xuất bản & In đề thi trên giấy: {header.examTitle}
              </h1>
              <div className="text-xs text-neutral-500 flex items-center gap-2 mt-0.5">
                <span>Môn: {header.subjectName}</span>
                <span aria-hidden="true">·</span>
                <span>Mã đề: {header.examCode}</span>
                <span aria-hidden="true">·</span>
                <span>{questions.length} câu hỏi</span>
                <span aria-hidden="true">·</span>
                <span>Thời gian: {header.durationMinutes} phút</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In trang này (Print / Lưu PDF)</span>
            </button>
          </div>
        </div>

        {/* Tùy chỉnh chế độ in kèm đáp án */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-neutral-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-700">Tùy chọn in ấn:</span>
            <div className="flex items-center bg-neutral-100 p-1 rounded-lg">
              <button
                onClick={() => setPrintOption('exam_and_key')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  printOption === 'exam_and_key'
                    ? 'bg-white text-emerald-950 font-bold shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                In đề + Bảng đáp án đối chiếu
              </button>
              <button
                onClick={() => setPrintOption('exam_only')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  printOption === 'exam_only'
                    ? 'bg-white text-emerald-950 font-bold shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Chỉ in đề thi (cho HS)
              </button>
              <button
                onClick={() => setPrintOption('key_only')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  printOption === 'key_only'
                    ? 'bg-white text-emerald-950 font-bold shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Chỉ in Đáp án chấm thi (cho GV)
              </button>
            </div>
          </div>

          {(printOption === 'exam_and_key' || printOption === 'key_only') && (
            <label className="flex items-center gap-2 cursor-pointer text-neutral-700 font-medium">
              <input
                type="checkbox"
                checked={showDetailedExplanation}
                onChange={(e) => setShowDetailedExplanation(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <span>In kèm lời giải chi tiết từng câu</span>
            </label>
          )}
        </div>
      </div>

      {/* PAPER EXAM SHEET (A4 Standard Format) */}
      <div className="space-y-8">
        {/* PHẦN 1: ĐỀ THI TRÊN GIẤY (Chỉ hiển thị khi in exam_and_key hoặc exam_only) */}
        {(printOption === 'exam_and_key' || printOption === 'exam_only') && (
          <div className="bg-white rounded-2xl border border-neutral-300 p-8 sm:p-12 shadow-sm max-w-4xl mx-auto space-y-6 text-neutral-900 print:p-0 print:border-none print:shadow-none">
            {/* Exam Header */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b-2 border-neutral-900 text-xs">
              {/* Cột trái */}
              <div className="text-center space-y-0.5">
                <div className="font-semibold uppercase tracking-wider">{header.departmentName}</div>
                <div className="font-bold uppercase tracking-wider text-sm">{header.schoolName}</div>
                <div className="pt-2 font-mono font-bold text-neutral-900 text-xs">
                  MÃ ĐỀ THI: {header.examCode}
                </div>
              </div>

              {/* Cột phải */}
              <div className="text-center space-y-0.5 border-l border-neutral-300 pl-4">
                <div className="font-bold uppercase text-sm tracking-wide">{header.examTitle}</div>
                <div className="font-medium">{header.academicYear}</div>
                <div className="font-bold uppercase text-emerald-950 mt-1">
                  MÔN: {header.subjectName} ({header.grade})
                </div>
                <div className="text-[11px] italic text-neutral-600">
                  Thời gian làm bài: {header.durationMinutes} phút (không kể thời gian phát đề)
                </div>
              </div>
            </div>

            {/* Khung thông tin thí sinh */}
            <div className="border border-neutral-800 p-3 rounded text-xs space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
                <div>
                  <span>Họ và tên thí sinh: </span>
                  <span className="font-semibold">...........................................................................................</span>
                </div>
                <div>
                  <span>Số báo danh: </span>
                  <span className="font-semibold font-mono">...................................</span>
                </div>
                <div>
                  <span>Lớp: </span>
                  <span className="font-semibold">...........................................................................................................</span>
                </div>
                <div>
                  <span>Phòng thi số: </span>
                  <span className="font-semibold">...................................</span>
                </div>
              </div>
              <div className="text-[11px] italic text-neutral-500 pt-1 border-t border-neutral-200">
                * {header.paperNote}
              </div>
            </div>

            {/* Khung Phiếu Trả Lời Trắc Nghiệm để học sinh làm bài trên giấy */}
            <div className="border border-neutral-400 p-3 rounded-lg bg-neutral-50/40 text-xs space-y-2">
              <div className="font-bold uppercase text-center text-neutral-800 text-[11px] tracking-wider">
                PHIẾU TRẢ LỜI TRẮC NGHIỆM (Thí sinh khoanh tròn hoặc điền chữ cái A, B, C, D vào ô tương ứng)
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 text-center font-mono">
                {questions.map((_, idx) => (
                  <div key={idx} className="border border-neutral-300 rounded p-1 bg-white">
                    <div className="text-[10px] font-bold text-neutral-600">Câu {idx + 1}</div>
                    <div className="h-6 flex items-center justify-center font-bold text-neutral-900 border-t border-neutral-200 mt-0.5">
                      {/* Ô trống cho học sinh điền */}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Questions Body */}
            <div className="space-y-6 pt-2">
              <div className="text-center font-bold text-xs uppercase tracking-widest text-neutral-700">
                NỘI DUNG ĐỀ THI
              </div>

              <div className="space-y-5 text-xs sm:text-sm">
                {questions.map((q, idx) => {
                  return (
                    <div key={q.id} className="space-y-2 break-inside-avoid">
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-neutral-900 shrink-0">
                          Câu {idx + 1}:
                        </span>
                        <div className="flex-1 leading-relaxed">
                          <span>{q.content}</span>
                          <span className="no-print ml-2 text-[10px] font-medium px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-500">
                            [{q.level}]
                          </span>
                        </div>
                      </div>

                      {/* 4 Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 pl-6">
                        {q.options.map((opt) => (
                          <div key={opt.key} className="flex items-start gap-2">
                            <span className="font-bold font-mono text-neutral-800">
                              {opt.key}.
                            </span>
                            <span className="text-neutral-900">{opt.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer of Exam Paper */}
            <div className="pt-8 text-center text-xs text-neutral-600 border-t border-neutral-200">
              <div className="font-semibold uppercase tracking-widest">
                ----------------- HẾT -----------------
              </div>
              <div className="text-[11px] italic mt-1">
                (Cán bộ coi thi không giải thích gì thêm)
              </div>
            </div>
          </div>
        )}

        {/* PHẦN 2: BẢNG ĐÁP ÁN ĐỐI CHIẾU CHẤM BÀI NHANH CHO GIÁO VIÊN */}
        {(printOption === 'exam_and_key' || printOption === 'key_only') && (
          <div className="bg-white rounded-2xl border border-neutral-300 p-8 sm:p-12 shadow-sm max-w-4xl mx-auto space-y-6 text-neutral-900 print:p-0 print:border-none print:shadow-none page-break">
            {/* Header Đáp án */}
            <div className="border-b-2 border-neutral-900 pb-4 text-center space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                {header.schoolName} · NĂM HỌC {header.academicYear}
              </div>
              <h2 className="text-lg font-bold uppercase tracking-tight text-emerald-950">
                BẢNG ĐÁP ÁN ĐỐI CHIẾU CHẤM THI NHANH (DÀNH CHO GIÁO VIÊN)
              </h2>
              <div className="text-xs text-neutral-600 flex items-center justify-center gap-3">
                <span>Kỳ thi: <strong>{header.examTitle}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Môn: <strong>{header.subjectName}</strong></span>
                <span aria-hidden="true">·</span>
                <span className="font-mono font-bold text-emerald-800">MÃ ĐỀ: {header.examCode}</span>
                <span aria-hidden="true">·</span>
                <span>Biểu điểm: <strong>{scorePerQuestion} điểm / câu</strong></span>
              </div>
            </div>

            {/* DẢI ĐÁP ÁN ĐỐI CHIẾU SIÊU NHANH (QUICK ANSWER KEY STRIP) */}
            <div className="border-2 border-neutral-800 rounded-xl p-4 bg-neutral-50/70 space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-neutral-300 pb-2">
                <span className="font-bold uppercase tracking-wide text-neutral-900">
                  DẢI ĐÁP ÁN ĐỐI CHIẾU NHANH (Đặt song song với bài thi để chấm)
                </span>
                <span className="font-mono text-neutral-500 font-semibold">
                  Tổng số: {questions.length} câu
                </span>
              </div>

              {/* Grid 10 cột x N hàng */}
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 text-center font-mono">
                {questions.map((q, idx) => (
                  <div key={q.id} className="border-2 border-neutral-800 rounded-lg p-1.5 bg-white shadow-2xs">
                    <div className="text-[11px] font-semibold text-neutral-500">
                      Câu {idx + 1}
                    </div>
                    <div className="text-xl font-black text-emerald-700 border-t border-neutral-200 mt-1 pt-0.5">
                      {q.correctAnswer}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-neutral-500 italic pt-1 text-center">
                * Thang điểm chuẩn: Mỗi câu trả lời đúng được {scorePerQuestion} điểm. Tổng điểm tối đa: 10.0 điểm.
              </div>
            </div>

            {/* BẢNG MA TRẬN & HƯỚNG DẪN GIẢI CHI TIẾT TỪNG CÂU */}
            {showDetailedExplanation && (
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold uppercase tracking-wide text-neutral-800">
                  BẢNG MA TRẬN PHÂN LOẠI & HƯỚNG DẪN GIẢI CHI TIẾT
                </div>

                <div className="overflow-x-auto border border-neutral-300 rounded-lg">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-neutral-100 text-neutral-700 font-semibold border-b border-neutral-300">
                        <th className="py-2.5 px-3 w-16 text-center">Câu</th>
                        <th className="py-2.5 px-3 w-28">Mức độ nhận thức</th>
                        <th className="py-2.5 px-3 w-24 text-center font-bold">Đáp án đúng</th>
                        <th className="py-2.5 px-3 w-24 text-right">Thang điểm</th>
                        <th className="py-2.5 px-4">Hướng dẫn giải / Căn cứ lý thuyết</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {questions.map((q, idx) => (
                        <tr key={q.id} className="hover:bg-neutral-50/50">
                          <td className="py-2 px-3 text-center font-mono font-bold text-neutral-800">
                            {idx + 1}
                          </td>
                          <td className="py-2 px-3">
                            <span className="font-medium text-neutral-700">{q.level}</span>
                          </td>
                          <td className="py-2 px-3 text-center font-mono font-black text-emerald-700 text-sm">
                            {q.correctAnswer}
                          </td>
                          <td className="py-2 px-3 text-right font-mono tabular-nums font-semibold text-neutral-800">
                            {scorePerQuestion} đ
                          </td>
                          <td className="py-2 px-4 text-neutral-700 leading-relaxed">
                            {q.explanation || 'Áp dụng định nghĩa và công thức cơ bản trong chương trình học.'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
