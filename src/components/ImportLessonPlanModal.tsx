import React, { useState, useRef } from 'react';
import { LessonPlan, Subject } from '../types';
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
  Sparkles, 
  BookOpen, 
  Check, 
  Layers
} from 'lucide-react';
import { 
  downloadFile, 
  getLessonPlanTemplateCSV, 
  getLessonPlanTemplateTXT, 
  getLessonPlanTemplateJSON, 
  parseLessonPlansFromInput
} from '../utils/templateGenerators';

interface ImportLessonPlanModalProps {
  subjects: Subject[];
  onClose: () => void;
  onImportPlans: (plans: LessonPlan[]) => void;
}

export const ImportLessonPlanModal: React.FC<ImportLessonPlanModalProps> = ({
  subjects,
  onClose,
  onImportPlans,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('math');
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'templates'>('upload');
  const [pastedText, setPastedText] = useState<string>('');
  const [parsedPlans, setParsedPlans] = useState<LessonPlan[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Xử lý upload file
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

  // Kéo thả file
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

  // Phân tích nội dung
  const processText = (text: string) => {
    const result = parseLessonPlansFromInput(text, selectedSubjectId);
    setParsedPlans(result.plans);
    setWarnings(result.warnings);
  };

  // Nạp giáo án mẫu thử nghiệm
  const handleLoadDemo = () => {
    const demoTxt = getLessonPlanTemplateTXT();
    setPastedText(demoTxt);
    processText(demoTxt);
    setFileName('Giao_an_mau_CV5512_Toan10.txt');
  };

  // Xác nhận nhập vào danh mục giáo án
  const handleConfirmImport = () => {
    if (parsedPlans.length === 0) return;
    onImportPlans(parsedPlans);
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
              <BookOpen className="w-5 h-5 text-emerald-300" />
              <h2 className="text-base sm:text-lg font-bold">
                Thêm Kế hoạch bài dạy (Giáo án CV 5512) từ File mẫu
              </h2>
            </div>
            <p className="text-xs text-emerald-100/90 mt-1">
              Nhập nhanh giáo án từ file mẫu Excel (CSV), văn bản Word (TXT) hoặc JSON theo đúng chuẩn 4 hoạt động CV 5512/BGDĐT
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
            <span>Dán nội dung giáo án</span>
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
            <span>Tải file mẫu chuẩn CV 5512 (3 định dạng)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          
          {/* Top Options: Môn học mặc định & Nút nạp demo */}
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
                <span>Nạp giáo án mẫu chuẩn CV 5512 để xem thử</span>
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
                  {fileName ? `Đã chọn: ${fileName}` : 'Bấm để chọn tệp giáo án hoặc kéo thả file vào đây'}
                </p>
                <p className="text-neutral-500 text-xs mt-1">
                  Hỗ trợ định dạng: <strong>.CSV</strong> (Excel UTF-8), <strong>.TXT</strong> (Văn bản CV 5512), <strong>.JSON</strong>
                </p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-neutral-600 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p><strong>Mẹo giáo viên:</strong> Bạn có thể xuất các giáo án đã soạn từ máy tính thành file .txt hoặc .csv theo mẫu, sau đó kéo thả vào đây để quản lý tập trung và in ấn nhanh chóng.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PASTE TEXT */}
          {activeTab === 'paste' && (
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Dán nội dung giáo án (Word / Notepad) chuẩn CV 5512 vào đây:
                </label>
                <textarea
                  rows={8}
                  value={pastedText}
                  onChange={(e) => {
                    setPastedText(e.target.value);
                    processText(e.target.value);
                  }}
                  placeholder="Ví dụ mẫu chuẩn:&#10;Tên bài dạy: BÀI 4: HỆ BẤT PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN&#10;Môn học: Toán học&#10;Khối lớp: 10&#10;Thời lượng: 2 tiết&#10;&#10;I. MỤC TIÊU&#10;1. Về kiến thức: ...&#10;2. Về năng lực: ...&#10;3. Về phẩm chất: ...&#10;&#10;II. THIẾT BỊ DẠY HỌC&#10;Máy chiếu, SGK, thước kẻ, phiếu học tập số 1 & 2.&#10;&#10;III. TIẾN TRÌNH DẠY HỌC&#10;1. Hoạt động 1: Khởi động (5 phút)&#10;- Mục tiêu: ...&#10;- Nội dung: ...&#10;- Sản phẩm: ...&#10;- Tổ chức thực hiện: ...&#10;&#10;2. Hoạt động 2: Hình thành kiến thức mới (20 phút)..."
                  className="w-full p-3 font-mono border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden text-xs leading-relaxed"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => processText(pastedText)}
                  className="px-3.5 py-1.5 bg-emerald-700 text-white rounded-lg font-semibold hover:bg-emerald-800 transition-colors shadow-2xs"
                >
                  Phân tích cấu trúc giáo án CV 5512
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: DOWNLOAD TEMPLATES */}
          {activeTab === 'templates' && (
            <div className="space-y-4">
              <p className="text-neutral-600">
                Thầy/Cô hãy tải các file mẫu chuẩn CV 5512 của Bộ GD&ĐT dưới đây về máy để tham khảo và làm theo mẫu:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Mẫu Excel */}
                <div className="border border-emerald-200 bg-emerald-50/40 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-2xs">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-800 font-bold mb-1">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      <span>1. Mẫu Excel (.CSV)</span>
                    </div>
                    <p className="text-neutral-500 text-[11px] leading-relaxed">
                      Mở bằng Microsoft Excel hoặc Google Sheets. Hỗ trợ tiếng Việt UTF-8 không lỗi font. Bảng gồm đủ các cột mục tiêu và 4 hoạt động.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => downloadFile(getLessonPlanTemplateCSV(), 'Mau_Giao_An_CV5512.csv', 'text/csv;charset=utf-8;')}
                    className="w-full py-2 px-3 bg-emerald-700 text-white rounded-lg font-semibold hover:bg-emerald-800 transition-colors text-center inline-flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải mẫu Excel (.csv)</span>
                  </button>
                </div>

                {/* 2. Mẫu Word / TXT */}
                <div className="border border-sky-200 bg-sky-50/40 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-2xs">
                  <div>
                    <div className="flex items-center gap-2 text-sky-800 font-bold mb-1">
                      <FileText className="w-4 h-4 text-sky-600" />
                      <span>2. Mẫu Word / Text (.TXT)</span>
                    </div>
                    <p className="text-neutral-500 text-[11px] leading-relaxed">
                      Mẫu văn bản đầy đủ theo đề mục quy định của Công văn 5512/BGDĐT: I. Mục tiêu, II. Thiết bị dạy học, III. Tiến trình dạy học (HĐ1-4).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => downloadFile(getLessonPlanTemplateTXT(), 'Mau_Giao_An_CV5512.txt', 'text/plain;charset=utf-8')}
                    className="w-full py-2 px-3 bg-sky-700 text-white rounded-lg font-semibold hover:bg-sky-800 transition-colors text-center inline-flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải mẫu Word (.txt)</span>
                  </button>
                </div>

                {/* 3. Mẫu JSON */}
                <div className="border border-purple-200 bg-purple-50/40 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-2xs">
                  <div>
                    <div className="flex items-center gap-2 text-purple-800 font-bold mb-1">
                      <FileCode className="w-4 h-4 text-purple-600" />
                      <span>3. Mẫu Dữ liệu (.JSON)</span>
                    </div>
                    <p className="text-neutral-500 text-[11px] leading-relaxed">
                      Định dạng chuẩn để xuất nhập và lưu trữ giáo án giữa các máy tính hoặc chia sẻ với giáo viên cùng tổ chuyên môn.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => downloadFile(getLessonPlanTemplateJSON(), 'Mau_Giao_An_CV5512.json', 'application/json;charset=utf-8')}
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

          {/* PREVIEW GIÁO ÁN ĐÃ BÓC TÁCH */}
          {parsedPlans.length > 0 && (
            <div className="space-y-4 pt-2 border-t border-neutral-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-neutral-900 text-sm">
                  Đã nhận diện thành công: {parsedPlans.length} kế hoạch bài dạy
                </span>
              </div>

              {parsedPlans.map((plan, pIdx) => (
                <div key={pIdx} className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2 border-b border-neutral-200 pb-2">
                    <div>
                      <h3 className="font-bold text-emerald-900 text-sm">
                        {plan.lessonName}
                      </h3>
                      <div className="flex items-center gap-2 text-neutral-500 text-[11px] mt-0.5">
                        <span>Chương: <strong>{plan.unit}</strong></span>
                        <span>•</span>
                        <span>Khối: <strong>{plan.gradeLevel}</strong></span>
                        <span>•</span>
                        <span>Thời lượng: <strong>{plan.periodCount} tiết</strong></span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">
                      Chuẩn CV 5512
                    </span>
                  </div>

                  {/* Mục tiêu */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px]">
                    <div className="bg-white p-2.5 rounded-lg border border-neutral-200">
                      <span className="font-bold text-neutral-800 block mb-0.5">1. Về kiến thức:</span>
                      <p className="text-neutral-600 line-clamp-3">{plan.objectives.knowledge || 'Chưa điền'}</p>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-neutral-200">
                      <span className="font-bold text-neutral-800 block mb-0.5">2. Về năng lực:</span>
                      <p className="text-neutral-600 line-clamp-3">{plan.objectives.competence || 'Chưa điền'}</p>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-neutral-200">
                      <span className="font-bold text-neutral-800 block mb-0.5">3. Về phẩm chất:</span>
                      <p className="text-neutral-600 line-clamp-3">{plan.objectives.qualities || 'Chưa điền'}</p>
                    </div>
                  </div>

                  {/* 4 Hoạt động */}
                  <div className="space-y-1.5">
                    <span className="font-bold text-neutral-800 text-[11px] flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-700" />
                      Tiến trình dạy học ({plan.activities.length} hoạt động):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      {plan.activities.map((act, aIdx) => (
                        <div key={aIdx} className="bg-white p-2 rounded-lg border border-neutral-200">
                          <span className="font-semibold text-emerald-800 block">{act.stepName}</span>
                          <p className="text-neutral-500 line-clamp-2 mt-0.5">
                            <strong>Mục tiêu:</strong> {act.objective || 'Đạt yêu cầu chuẩn'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isSuccess && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-700" />
              <span>Đã lưu thành công {parsedPlans.length} kế hoạch bài dạy vào hệ thống!</span>
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
            disabled={parsedPlans.length === 0}
            onClick={handleConfirmImport}
            className={`px-5 py-2 rounded-lg font-bold text-xs inline-flex items-center gap-2 transition-all shadow-2xs ${
              parsedPlans.length > 0
                ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Xác nhận thêm {parsedPlans.length} giáo án vào danh mục</span>
          </button>
        </div>

      </div>
    </div>
  );
};
