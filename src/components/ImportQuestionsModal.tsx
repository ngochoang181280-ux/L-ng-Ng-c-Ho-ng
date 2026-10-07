import React, { useState, useRef } from 'react';
import { Question, Subject, QuestionLevel } from '../types';
import { 
  X, 
  Upload, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  FileCode, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Plus, 
  Sparkles, 
  Trash2, 
  Check, 
  Eye
} from 'lucide-react';
import { 
  downloadFile, 
  getQuestionTemplateCSV, 
  getQuestionTemplateTXT, 
  getQuestionTemplateJSON, 
  parseQuestionsFromInput,
  getDemoQuestions
} from '../utils/templateGenerators';

interface ImportQuestionsModalProps {
  subjects: Subject[];
  onClose: () => void;
  onAddQuestions: (questions: Question[]) => void;
}

export const ImportQuestionsModal: React.FC<ImportQuestionsModalProps> = ({
  subjects,
  onClose,
  onAddQuestions,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('math');
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'templates'>('upload');
  const [pastedText, setPastedText] = useState<string>('');
  const [parsedQuestions, setParsedQuestions] = useState<Question[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Xử lý khi người dùng chọn file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      processText(content);
    };
    reader.readAsText(file, 'utf-8');
  };

  // Xử lý kéo thả file
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      processText(content);
    };
    reader.readAsText(file, 'utf-8');
  };

  // Phân tích văn bản
  const processText = (text: string) => {
    const result = parseQuestionsFromInput(text, selectedSubjectId);
    setParsedQuestions(result.questions);
    setWarnings(result.warnings);
  };

  // Tải dữ liệu mẫu nhanh để test
  const handleLoadDemo = () => {
    const demo = getDemoQuestions(selectedSubjectId);
    setParsedQuestions(demo);
    setWarnings([]);
    setFileName('Bo_cau_hoi_mau_thu_nghiem.txt');
  };

  // Thống kê các mức độ
  const stats = {
    nhanBiet: parsedQuestions.filter(q => q.level === 'Nhận biết').length,
    thongHieu: parsedQuestions.filter(q => q.level === 'Thông hiểu').length,
    vanDung: parsedQuestions.filter(q => q.level === 'Vận dụng').length,
    vanDungCao: parsedQuestions.filter(q => q.level === 'Vận dụng cao').length,
  };

  // Xóa bớt một câu khỏi danh sách chuẩn bị thêm
  const handleRemoveQuestion = (idx: number) => {
    setParsedQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  // Xác nhận nhập vào ngân hàng
  const handleConfirmImport = () => {
    if (parsedQuestions.length === 0) return;
    onAddQuestions(parsedQuestions);
    setIsSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-300" />
              <h2 className="text-base sm:text-lg font-bold">
                Thêm câu hỏi vào Ngân hàng từ File mẫu & Dán nhanh
              </h2>
            </div>
            <p className="text-xs text-emerald-100/90 mt-1">
              Hỗ trợ tải tệp mẫu chuẩn Excel (CSV), Word (TXT) hoặc JSON; tự động bóc tách 4 mức độ nhận thức
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Tabs */}
        <div className="flex items-center border-b border-neutral-200 bg-neutral-50 px-4 pt-2 gap-2 text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'upload'
                ? 'border-emerald-700 text-emerald-800 font-bold'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Tải lên tệp (Excel / TXT / JSON)</span>
          </button>

          <button
            onClick={() => setActiveTab('paste')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'paste'
                ? 'border-emerald-700 text-emerald-800 font-bold'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Dán nội dung câu hỏi</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'templates'
                ? 'border-emerald-700 text-emerald-800 font-bold'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải file mẫu chuẩn (3 định dạng)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          
          {/* Top Options: Chọn môn học & Nút nạp dữ liệu mẫu thử nghiệm */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-700">Môn học mặc định:</span>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="bg-white border border-neutral-300 rounded-lg px-2.5 py-1 font-semibold text-neutral-800 shadow-2xs"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLoadDemo}
                className="px-3 py-1 bg-white border border-emerald-600 text-emerald-800 rounded-lg font-semibold hover:bg-emerald-100 transition-colors inline-flex items-center gap-1.5 shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Nạp 4 câu hỏi mẫu để thử nghiệm ngay</span>
              </button>
            </div>
          </div>

          {/* TAB 1: UPLOAD FILE */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/20 hover:bg-emerald-50/40 rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt,.json,.tsv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="font-bold text-neutral-800 text-sm">
                  {fileName ? `Đã chọn: ${fileName}` : 'Bấm để chọn tệp hoặc kéo thả file vào đây'}
                </p>
                <p className="text-neutral-500 text-xs mt-1">
                  Hỗ trợ định dạng: <strong>.CSV</strong> (Excel UTF-8), <strong>.TXT</strong> (Văn bản thuần), <strong>.JSON</strong>
                </p>
              </div>

              {/* Hướng dẫn nhanh */}
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-neutral-600 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p><strong>Mẹo giáo viên:</strong> Chưa có file mẫu? Hãy bấm sang tab <strong>"Tải file mẫu chuẩn"</strong> ở trên để tải file Excel mẫu về máy, điền câu hỏi rồi tải lên lại đây.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PASTE TEXT */}
          {activeTab === 'paste' && (
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Dán nội dung câu hỏi từ tài liệu Word / Notepad vào đây:
                </label>
                <textarea
                  rows={6}
                  value={pastedText}
                  onChange={(e) => {
                    setPastedText(e.target.value);
                    processText(e.target.value);
                  }}
                  placeholder="Ví dụ cú pháp chuẩn:&#10;[Mức độ: Nhận biết] [Chuyên đề: Mệnh đề & Tập hợp]&#10;Câu 1: Trong các câu sau, câu nào là một mệnh đề toán học?&#10;A. Hôm nay trời đẹp quá!&#10;B. Số 15 là số nguyên tố.&#10;C. Bạn có thích học Toán không?&#10;D. Hãy làm bài tập ngay!&#10;Đáp án: B&#10;Lời giải: Mệnh đề là khẳng định đúng hoặc sai."
                  className="w-full p-3 font-mono border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden text-xs leading-relaxed"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => processText(pastedText)}
                  className="px-3.5 py-1.5 bg-emerald-700 text-white rounded-lg font-semibold hover:bg-emerald-800 transition-colors shadow-2xs"
                >
                  Phân tích nội dung câu hỏi
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: DOWNLOAD TEMPLATES */}
          {activeTab === 'templates' && (
            <div className="space-y-4">
              <p className="text-neutral-600">
                Thầy/Cô vui lòng tải 1 trong 3 định dạng file mẫu dưới đây để điền câu hỏi theo mẫu chuẩn, sau đó quay lại tab <strong>"Tải lên tệp"</strong> để nhập vào hệ thống:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Mẫu Excel (.csv) */}
                <div className="border border-emerald-200 bg-emerald-50/40 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-2xs">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-800 font-bold mb-1">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      <span>1. Mẫu Excel (.CSV)</span>
                    </div>
                    <p className="text-neutral-500 text-[11px] leading-relaxed">
                      Mở trực tiếp bằng Microsoft Excel, Google Sheets. Hỗ trợ tiếng Việt UTF-8 không lỗi font. Đầy đủ các cột chuẩn.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => downloadFile(getQuestionTemplateCSV(), 'Mau_Ngan_Hang_Cau_Hoi.csv', 'text/csv;charset=utf-8;')}
                    className="w-full py-2 px-3 bg-emerald-700 text-white rounded-lg font-semibold hover:bg-emerald-800 transition-colors text-center inline-flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải mẫu Excel (.csv)</span>
                  </button>
                </div>

                {/* 2. Mẫu Word / Text (.txt) */}
                <div className="border border-sky-200 bg-sky-50/40 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-2xs">
                  <div>
                    <div className="flex items-center gap-2 text-sky-800 font-bold mb-1">
                      <FileText className="w-4 h-4 text-sky-600" />
                      <span>2. Mẫu Word / Text (.TXT)</span>
                    </div>
                    <p className="text-neutral-500 text-[11px] leading-relaxed">
                      Định dạng văn bản thuần quen thuộc với giáo viên. Dễ dàng sao chép từ đề thi Word có sẵn sang cú pháp phần mềm.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => downloadFile(getQuestionTemplateTXT(), 'Mau_Ngan_Hang_Cau_Hoi.txt', 'text/plain;charset=utf-8')}
                    className="w-full py-2 px-3 bg-sky-700 text-white rounded-lg font-semibold hover:bg-sky-800 transition-colors text-center inline-flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải mẫu Word (.txt)</span>
                  </button>
                </div>

                {/* 3. Mẫu JSON (.json) */}
                <div className="border border-purple-200 bg-purple-50/40 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-2xs">
                  <div>
                    <div className="flex items-center gap-2 text-purple-800 font-bold mb-1">
                      <FileCode className="w-4 h-4 text-purple-600" />
                      <span>3. Mẫu Dữ liệu (.JSON)</span>
                    </div>
                    <p className="text-neutral-500 text-[11px] leading-relaxed">
                      Định dạng cấu trúc dữ liệu JSON dùng để sao lưu và chia sẻ kho câu hỏi giữa các giáo viên trong tổ bộ môn.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => downloadFile(getQuestionTemplateJSON(), 'Mau_Ngan_Hang_Cau_Hoi.json', 'application/json;charset=utf-8')}
                    className="w-full py-2 px-3 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800 transition-colors text-center inline-flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải mẫu JSON (.json)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Cảnh báo nếu có */}
          {warnings.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                {warnings.map((w, i) => (
                  <p key={i}>{w}</p>
                ))}
              </div>
            </div>
          )}

          {/* DANH SÁCH CÂU HỎI ĐÃ BÓC TÁCH (PREVIEW & REVIEW) */}
          {parsedQuestions.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-neutral-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-neutral-900 text-sm">
                    Đã nhận diện thành công: {parsedQuestions.length} câu hỏi
                  </span>
                </div>

                {/* Phân bố mức độ */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 bg-neutral-100 text-neutral-800 rounded font-semibold text-[11px]">
                    Nhận biết: {stats.nhanBiet}
                  </span>
                  <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded font-semibold text-[11px]">
                    Thông hiểu: {stats.thongHieu}
                  </span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-semibold text-[11px]">
                    Vận dụng: {stats.vanDung}
                  </span>
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-semibold text-[11px]">
                    Vận dụng cao: {stats.vanDungCao}
                  </span>
                </div>
              </div>

              {/* Bảng xem trước danh sách câu hỏi */}
              <div className="border border-neutral-200 rounded-xl overflow-hidden max-h-60 overflow-y-auto divide-y divide-neutral-200 bg-white">
                {parsedQuestions.map((q, idx) => (
                  <div key={idx} className="p-3 hover:bg-neutral-50 transition-colors flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-800">Câu {idx + 1}</span>
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
                        <span className="font-bold text-emerald-700 font-mono ml-auto">
                          Đáp án đúng: {q.correctAnswer}
                        </span>
                      </div>

                      <p className="font-medium text-neutral-800">{q.content}</p>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-neutral-600 text-[11px] pt-1">
                        {q.options.map(opt => (
                          <div key={opt.key} className={opt.key === q.correctAnswer ? 'font-bold text-emerald-800' : ''}>
                            <span className="font-mono">{opt.key}.</span> {opt.text}
                          </div>
                        ))}
                      </div>

                      {q.explanation && (
                        <p className="text-[11px] text-neutral-500 italic pt-0.5">
                          Lời giải: {q.explanation}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(idx)}
                      className="p-1 text-neutral-400 hover:text-rose-600 rounded transition-colors"
                      title="Bỏ câu này ra khỏi danh sách nhập"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isSuccess && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-700" />
              <span>Đã lưu thành công {parsedQuestions.length} câu hỏi vào Ngân hàng câu hỏi!</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-neutral-300 rounded-lg text-neutral-700 font-semibold hover:bg-neutral-100 transition-colors shadow-2xs text-xs"
          >
            Đóng lại
          </button>

          <button
            type="button"
            disabled={parsedQuestions.length === 0}
            onClick={handleConfirmImport}
            className={`px-5 py-2 rounded-lg font-bold text-xs inline-flex items-center gap-2 transition-all shadow-2xs ${
              parsedQuestions.length > 0
                ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Thêm tất cả {parsedQuestions.length} câu vào Ngân hàng đề thi</span>
          </button>
        </div>

      </div>
    </div>
  );
};
