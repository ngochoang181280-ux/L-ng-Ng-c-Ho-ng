import React, { useState } from 'react';
import { LessonPlan, Subject, LessonActivity } from '../types';
import { 
  BookOpen, 
  Plus, 
  Printer, 
  Edit3, 
  Save, 
  Trash2, 
  CheckCircle2, 
  FileText, 
  Sparkles,
  ArrowLeft,
  Download,
  Upload,
  FileSpreadsheet
} from 'lucide-react';
import { ImportLessonPlanModal } from './ImportLessonPlanModal';
import { 
  downloadFile, 
  getLessonPlanTemplateCSV, 
  getLessonPlanTemplateTXT, 
  getLessonPlanTemplateJSON 
} from '../utils/templateGenerators';

interface LessonPlannerViewProps {
  lessonPlans: LessonPlan[];
  subjects: Subject[];
  onSaveLessonPlan: (plan: LessonPlan) => void;
  onDeleteLessonPlan: (id: string) => void;
}

export const LessonPlannerView: React.FC<LessonPlannerViewProps> = ({
  lessonPlans,
  subjects,
  onSaveLessonPlan,
  onDeleteLessonPlan,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(lessonPlans[0]?.id || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [showTemplateMenu, setShowTemplateMenu] = useState<boolean>(false);

  const selectedPlan = lessonPlans.find((p) => p.id === selectedPlanId) || lessonPlans[0];

  const [formData, setFormData] = useState<LessonPlan>(
    selectedPlan || {
      id: `lesson-${Date.now()}`,
      subjectId: 'math',
      lessonName: '',
      unit: '',
      gradeLevel: 10,
      periodCount: 2,
      objectives: {
        knowledge: '',
        competence: '',
        qualities: '',
      },
      teachingEquipments: '',
      activities: [
        {
          id: 'act-1',
          stepName: 'Hoạt động 1: Mở đầu / Khởi động (5-7 phút)',
          objective: '',
          content: '',
          product: '',
          implementation: '',
        },
        {
          id: 'act-2',
          stepName: 'Hoạt động 2: Hình thành kiến thức mới (20 phút)',
          objective: '',
          content: '',
          product: '',
          implementation: '',
        },
        {
          id: 'act-3',
          stepName: 'Hoạt động 3: Luyện tập (12 phút)',
          objective: '',
          content: '',
          product: '',
          implementation: '',
        },
        {
          id: 'act-4',
          stepName: 'Hoạt động 4: Vận dụng & Mở rộng (6 phút)',
          objective: '',
          content: '',
          product: '',
          implementation: '',
        },
      ],
      updatedAt: new Date().toISOString().slice(0, 10),
    }
  );

  const handleSelectPlan = (plan: LessonPlan) => {
    setSelectedPlanId(plan.id);
    setFormData(plan);
    setIsEditing(false);
    setIsCreatingNew(false);
  };

  const handleStartCreate = () => {
    const fresh: LessonPlan = {
      id: `lesson-${Date.now()}`,
      subjectId: 'math',
      lessonName: 'BÀI MỚI: ...',
      unit: 'Chương I: ...',
      gradeLevel: 10,
      periodCount: 2,
      objectives: {
        knowledge: 'Học sinh nắm vững các khái niệm và công thức...',
        competence: 'Năng lực tư duy logic, tự học và giải quyết vấn đề...',
        qualities: 'Chăm chỉ, trung thực, tinh thần hợp tác nhóm...',
      },
      teachingEquipments: 'Máy chiếu, SGK, phiếu học tập số 1 & 2...',
      activities: [
        {
          id: 'act-1',
          stepName: 'Hoạt động 1: Khởi động (7 phút)',
          objective: 'Tạo hứng thú và tình huống có vấn đề liên quan đến thực tiễn.',
          content: 'Xem video hoặc hình ảnh tình huống.',
          product: 'Câu trả lời dự đoán của học sinh.',
          implementation: 'GV giao nhiệm vụ -> HS thảo luận -> GV dẫn dắt vào bài mới.',
        },
        {
          id: 'act-2',
          stepName: 'Hoạt động 2: Hình thành kiến thức mới (20 phút)',
          objective: 'Xây dựng định nghĩa, định lí và tính chất cơ bản.',
          content: 'Học sinh nghiên cứu SGK và hoàn thành phiếu học tập.',
          product: 'Kiến thức cốt lõi ghi vở.',
          implementation: 'HS làm việc cá nhân -> Thảo luận nhóm -> GV chốt kiến thức.',
        },
        {
          id: 'act-3',
          stepName: 'Hoạt động 3: Luyện tập (12 phút)',
          objective: 'Rèn luyện kỹ năng áp dụng công thức vào bài tập cụ thể.',
          content: 'Giải các bài tập mức độ nhận biết và thông hiểu.',
          product: 'Lời giải bài tập của học sinh.',
          implementation: 'HS lên bảng giải -> Cả lớp nhận xét -> GV đánh giá.',
        },
        {
          id: 'act-4',
          stepName: 'Hoạt động 4: Vận dụng (6 phút)',
          objective: 'Ứng dụng kiến thức bài học giải bài toán thực tế.',
          content: 'Nhiệm vụ thực hành hoặc dự án học tập.',
          product: 'Báo cáo sản phẩm nộp vào tiết sau.',
          implementation: 'Giao bài tập về nhà.',
        },
      ],
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    setFormData(fresh);
    setIsCreatingNew(true);
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.lessonName.trim()) {
      alert('Vui lòng nhập tên bài dạy!');
      return;
    }

    onSaveLessonPlan(formData);
    setSelectedPlanId(formData.id);
    setIsEditing(false);
    setIsCreatingNew(false);
    setNotification('Đã lưu thành công kế hoạch bài dạy (Giáo án CV 5512)!');
    setTimeout(() => setNotification(null), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="no-print bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-neutral-900">
            Thiết kế bài dạy & Kế hoạch bài học (Giáo án CV 5512)
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Soạn thảo, quản lý và in kế hoạch bài dạy chuẩn quy định của Bộ Giáo dục & Đào tạo
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Menu tải file mẫu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowTemplateMenu(!showTemplateMenu)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-lg hover:bg-emerald-100 transition-colors shadow-2xs"
              title="Tải file mẫu Excel, Word hoặc JSON chuẩn Công văn 5512 để làm theo mẫu"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải file mẫu CV 5512</span>
            </button>

            {showTemplateMenu && (
              <div 
                className="absolute right-0 mt-1 w-64 bg-white border border-neutral-200 rounded-xl shadow-xl z-30 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setShowTemplateMenu(false)}
              >
                <div className="text-[11px] font-bold text-neutral-500 uppercase px-2 py-1">
                  Chọn định dạng file mẫu:
                </div>
                <button
                  type="button"
                  onClick={() => downloadFile(getLessonPlanTemplateCSV(), 'Mau_Giao_An_CV5512.csv', 'text/csv;charset=utf-8;')}
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
                  onClick={() => downloadFile(getLessonPlanTemplateTXT(), 'Mau_Giao_An_CV5512.txt', 'text/plain;charset=utf-8')}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-sky-50 text-xs text-neutral-800 flex items-center gap-2 font-medium"
                >
                  <FileText className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <div>
                    <span className="font-bold block">2. File Word / Text (.txt)</span>
                    <span className="text-[10px] text-neutral-500">Mẫu văn bản 4 hoạt động 5512</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => downloadFile(getLessonPlanTemplateJSON(), 'Mau_Giao_An_CV5512.json', 'application/json;charset=utf-8')}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-purple-50 text-xs text-neutral-800 flex items-center gap-2 font-medium"
                >
                  <BookOpen className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <div>
                    <span className="font-bold block">3. File Cấu trúc (.json)</span>
                    <span className="text-[10px] text-neutral-500">Dữ liệu sao lưu & trao đổi</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Nút Nhập giáo án từ file mẫu */}
          <button
            type="button"
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition-colors shadow-2xs"
            title="Nhập giáo án từ file Excel, Word hoặc dán nội dung"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Nhập giáo án từ File mẫu</span>
          </button>

          <button
            onClick={handleStartCreate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Soạn giáo án mới</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-neutral-500" />
            <span>In giáo án (Print / PDF)</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="no-print bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2.5 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Grid: Left List (3 cols) + Right Detail/Editor (9 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Danh sách bài dạy (Hidden during print) */}
        <div className="no-print lg:col-span-4 space-y-3">
          <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-neutral-200">
              <span className="font-bold text-neutral-900 uppercase">Danh mục bài dạy ({lessonPlans.length})</span>
            </div>

            <div className="space-y-2">
              {lessonPlans.map((plan) => {
                const isSelected = plan.id === selectedPlanId && !isCreatingNew;
                return (
                  <div
                    key={plan.id}
                    onClick={() => handleSelectPlan(plan)}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-2xs'
                        : 'border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="font-bold text-xs text-neutral-900 line-clamp-1">
                      {plan.lessonName}
                    </div>
                    <div className="text-[11px] text-neutral-500 mt-1 flex items-center justify-between">
                      <span>{plan.unit}</span>
                      <span className="font-semibold text-emerald-800">{plan.periodCount} tiết</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Nội dung kế hoạch bài dạy */}
        <div className="lg:col-span-8 space-y-4">
          {/* Action Toolbar on Top of Right Pane (Hidden during print) */}
          <div className="no-print flex items-center justify-between bg-white p-3 rounded-xl border border-neutral-200 shadow-2xs text-xs">
            <span className="text-neutral-500 font-medium">
              Đang xem: <strong>{formData.lessonName || 'Chưa đặt tên'}</strong>
            </span>

            <div className="flex items-center gap-2">
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="px-3.5 py-1.5 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-colors shadow-2xs inline-flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu kế hoạch</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3.5 py-1.5 bg-white border border-neutral-300 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-50 transition-colors shadow-2xs inline-flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Chỉnh sửa giáo án</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  const txt = `=== KẾ HOẠCH BÀI DẠY (GIÁO ÁN CHUẨN CÔNG VĂN 5512/BGDĐT) ===\nTên bài dạy: ${formData.lessonName}\nMôn học: ${subjects.find(s => s.id === formData.subjectId)?.name || 'Toán học'}\nChương / Chủ đề: ${formData.unit}\nKhối lớp: ${formData.gradeLevel}\nThời lượng: ${formData.periodCount} tiết\n\nI. MỤC TIÊU\n1. Về kiến thức: ${formData.objectives.knowledge}\n2. Về năng lực: ${formData.objectives.competence}\n3. Về phẩm chất: ${formData.objectives.qualities}\n\nII. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU\n${formData.teachingEquipments}\n\nIII. TIẾN TRÌNH DẠY HỌC\n${formData.activities.map((a, i) => `\n${i + 1}. ${a.stepName}\n- Mục tiêu: ${a.objective}\n- Nội dung: ${a.content}\n- Sản phẩm: ${a.product}\n- Tổ chức thực hiện: ${a.implementation}`).join('\n')}\n\nIV. HỒ SƠ DẠY HỌC & GHI CHÚ\n${formData.notes || ''}`;
                  downloadFile(txt, `${formData.lessonName.replace(/[^a-zA-Z0-9_\u00C0-\u1EF9]/g, '_')}_CV5512.txt`, 'text/plain;charset=utf-8');
                }}
                className="px-2.5 py-1.5 bg-neutral-50 border border-neutral-300 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-100 transition-colors shadow-2xs inline-flex items-center gap-1.5"
                title="Tải giáo án đang xem về máy tính định dạng .txt"
              >
                <Download className="w-3.5 h-3.5 text-neutral-500" />
                <span>Xuất file</span>
              </button>

              {lessonPlans.length > 1 && !isCreatingNew && (
                <button
                  onClick={() => {
                    if (window.confirm('Bạn có chắc chắn muốn xóa bài dạy này?')) {
                      onDeleteLessonPlan(formData.id);
                      setSelectedPlanId(lessonPlans.filter((p) => p.id !== formData.id)[0]?.id || '');
                    }
                  }}
                  className="p-1.5 text-neutral-400 hover:text-rose-600 rounded"
                  title="Xóa giáo án"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* DOCUMENT BODY (Chuẩn Công văn 5512/BGDĐT-GDTrH) */}
          <div className="bg-white rounded-2xl border border-neutral-300 p-8 shadow-sm space-y-6 text-neutral-900 print:p-0 print:border-none print:shadow-none">
            {/* Tiêu đề giáo án */}
            <div className="text-center space-y-1.5 pb-4 border-b border-neutral-300">
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
                KẾ HOẠCH BÀI DẠY (THEO CÔNG VĂN 5512/BGDĐT-GDTrH)
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.lessonName}
                  onChange={(e) => setFormData({ ...formData, lessonName: e.target.value })}
                  placeholder="Nhập tên bài học..."
                  className="w-full text-center text-lg font-bold text-emerald-950 p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              ) : (
                <h2 className="text-xl font-bold uppercase tracking-tight text-emerald-950">
                  {formData.lessonName}
                </h2>
              )}

              <div className="text-xs text-neutral-600 flex items-center justify-center gap-3">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      placeholder="Chương / Chủ đề..."
                      className="p-1 text-xs border border-neutral-300 rounded"
                    />
                    <input
                      type="number"
                      value={formData.periodCount}
                      onChange={(e) => setFormData({ ...formData, periodCount: Number(e.target.value) })}
                      className="w-16 p-1 text-xs border border-neutral-300 rounded text-center"
                    />
                    <span>tiết</span>
                  </div>
                ) : (
                  <>
                    <span>{formData.unit}</span>
                    <span aria-hidden="true">·</span>
                    <span>Thời lượng: {formData.periodCount} tiết</span>
                    <span aria-hidden="true">·</span>
                    <span>Lớp {formData.gradeLevel}</span>
                  </>
                )}
              </div>
            </div>

            {/* I. MỤC TIÊU */}
            <div className="space-y-3 text-xs sm:text-sm">
              <h3 className="font-bold uppercase tracking-wide text-neutral-800 text-xs">
                I. MỤC TIÊU BÀI HỌC
              </h3>

              <div className="space-y-2 pl-4">
                <div>
                  <strong className="text-neutral-900">1. Về kiến thức: </strong>
                  {isEditing ? (
                    <textarea
                      rows={2}
                      value={formData.objectives.knowledge}
                      onChange={(e) => setFormData({
                        ...formData,
                        objectives: { ...formData.objectives, knowledge: e.target.value },
                      })}
                      className="w-full mt-1 p-2 border border-neutral-300 rounded-lg text-xs"
                    />
                  ) : (
                    <span className="text-neutral-700">{formData.objectives.knowledge}</span>
                  )}
                </div>

                <div>
                  <strong className="text-neutral-900">2. Về năng lực: </strong>
                  {isEditing ? (
                    <textarea
                      rows={2}
                      value={formData.objectives.competence}
                      onChange={(e) => setFormData({
                        ...formData,
                        objectives: { ...formData.objectives, competence: e.target.value },
                      })}
                      className="w-full mt-1 p-2 border border-neutral-300 rounded-lg text-xs"
                    />
                  ) : (
                    <span className="text-neutral-700">{formData.objectives.competence}</span>
                  )}
                </div>

                <div>
                  <strong className="text-neutral-900">3. Về phẩm chất: </strong>
                  {isEditing ? (
                    <textarea
                      rows={2}
                      value={formData.objectives.qualities}
                      onChange={(e) => setFormData({
                        ...formData,
                        objectives: { ...formData.objectives, qualities: e.target.value },
                      })}
                      className="w-full mt-1 p-2 border border-neutral-300 rounded-lg text-xs"
                    />
                  ) : (
                    <span className="text-neutral-700">{formData.objectives.qualities}</span>
                  )}
                </div>
              </div>
            </div>

            {/* II. THIẾT BỊ DẠY HỌC & HỌC LIỆU */}
            <div className="space-y-2 text-xs sm:text-sm">
              <h3 className="font-bold uppercase tracking-wide text-neutral-800 text-xs">
                II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
              </h3>
              <div className="pl-4">
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={formData.teachingEquipments}
                    onChange={(e) => setFormData({ ...formData, teachingEquipments: e.target.value })}
                    className="w-full p-2 border border-neutral-300 rounded-lg text-xs"
                  />
                ) : (
                  <p className="text-neutral-700 leading-relaxed">{formData.teachingEquipments}</p>
                )}
              </div>
            </div>

            {/* III. TIẾN TRÌNH DẠY HỌC */}
            <div className="space-y-4 text-xs sm:text-sm">
              <h3 className="font-bold uppercase tracking-wide text-neutral-800 text-xs">
                III. TIẾN TRÌNH DẠY HỌC (CÁC HOẠT ĐỘNG DẠY HỌC)
              </h3>

              <div className="space-y-4 pl-2">
                {formData.activities.map((act, idx) => (
                  <div key={act.id} className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/40 space-y-3">
                    <div className="font-bold text-emerald-900 text-xs uppercase tracking-wide">
                      {act.stepName}
                    </div>

                    <div className="space-y-2 text-xs pl-2">
                      <div>
                        <strong>a) Mục tiêu: </strong>
                        {isEditing ? (
                          <input
                            type="text"
                            value={act.objective}
                            onChange={(e) => {
                              const updated = [...formData.activities];
                              updated[idx].objective = e.target.value;
                              setFormData({ ...formData, activities: updated });
                            }}
                            className="w-full p-1.5 border border-neutral-300 rounded text-xs mt-1"
                          />
                        ) : (
                          <span className="text-neutral-700">{act.objective}</span>
                        )}
                      </div>

                      <div>
                        <strong>b) Nội dung: </strong>
                        {isEditing ? (
                          <input
                            type="text"
                            value={act.content}
                            onChange={(e) => {
                              const updated = [...formData.activities];
                              updated[idx].content = e.target.value;
                              setFormData({ ...formData, activities: updated });
                            }}
                            className="w-full p-1.5 border border-neutral-300 rounded text-xs mt-1"
                          />
                        ) : (
                          <span className="text-neutral-700">{act.content}</span>
                        )}
                      </div>

                      <div>
                        <strong>c) Sản phẩm: </strong>
                        {isEditing ? (
                          <input
                            type="text"
                            value={act.product}
                            onChange={(e) => {
                              const updated = [...formData.activities];
                              updated[idx].product = e.target.value;
                              setFormData({ ...formData, activities: updated });
                            }}
                            className="w-full p-1.5 border border-neutral-300 rounded text-xs mt-1"
                          />
                        ) : (
                          <span className="text-neutral-700">{act.product}</span>
                        )}
                      </div>

                      <div>
                        <strong>d) Tổ chức thực hiện: </strong>
                        {isEditing ? (
                          <textarea
                            rows={2}
                            value={act.implementation}
                            onChange={(e) => {
                              const updated = [...formData.activities];
                              updated[idx].implementation = e.target.value;
                              setFormData({ ...formData, activities: updated });
                            }}
                            className="w-full p-1.5 border border-neutral-300 rounded text-xs mt-1"
                          />
                        ) : (
                          <p className="text-neutral-700 mt-0.5 leading-relaxed">{act.implementation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* IV. GHI CHÚ / RÚT KINH NGHIỆM */}
            <div className="pt-4 border-t border-neutral-200 text-xs">
              <h3 className="font-bold uppercase tracking-wide text-neutral-800 text-xs mb-1">
                IV. HỒ SƠ DẠY HỌC & RÚT KINH NGHIỆM TIẾT DẠY
              </h3>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ghi chú về phân phối thời gian, phương pháp giảng dạy..."
                  className="w-full p-2 border border-neutral-300 rounded-lg text-xs"
                />
              ) : (
                <p className="text-neutral-600 italic">
                  {formData.notes || 'Học sinh tiếp thu bài tốt, các nhóm hoàn thành đầy đủ nhiệm vụ học tập.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Nhập Giáo án từ File mẫu */}
      {showImportModal && (
        <ImportLessonPlanModal
          subjects={subjects}
          onClose={() => setShowImportModal(false)}
          onImportPlans={(newPlans) => {
            newPlans.forEach((p) => onSaveLessonPlan(p));
            if (newPlans[0]) {
              setSelectedPlanId(newPlans[0].id);
              setFormData(newPlans[0]);
              setIsEditing(false);
              setIsCreatingNew(false);
            }
            setNotification(`Đã nhập thành công ${newPlans.length} kế hoạch bài dạy chuẩn CV 5512 vào danh mục!`);
            setTimeout(() => setNotification(null), 3500);
          }}
        />
      )}
    </div>
  );
};
