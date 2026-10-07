import React, { useState } from 'react';
import { Student, Subject, StudentTermScores, AttendanceRecord, DisciplineEntry, ClassInfo } from '../types';
import { 
  calculateSemesterAvg, 
  evaluateAcademicPerformance, 
  getHonorTitle, 
  calculateSubjectAvg,
  formatScore 
} from '../utils/gradeCalculations';
import { 
  X, 
  Phone, 
  User, 
  MapPin, 
  Calendar, 
  Award, 
  Clock, 
  FileText, 
  Glasses, 
  Edit3, 
  Check, 
  AlertCircle,
  Sparkles,
  Loader2,
  RefreshCw,
  Copy,
  CheckCircle2,
  MessageCircle
} from 'lucide-react';

interface StudentDetailModalProps {
  student: Student | null;
  classInfo: ClassInfo;
  subjects: Subject[];
  termScore?: StudentTermScores;
  attendanceRecords: AttendanceRecord[];
  disciplineEntries: DisciplineEntry[];
  onClose: () => void;
  onUpdateComment?: (studentId: string, comment: string) => void;
  onEditStudent?: (student: Student) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  classInfo,
  subjects,
  termScore,
  attendanceRecords,
  disciplineEntries,
  onClose,
  onUpdateComment,
  onEditStudent,
}) => {
  if (!student) return null;

  const [commentText, setCommentText] = useState(termScore?.teacherComment || '');
  const [isSavedComment, setIsSavedComment] = useState(false);
  const [copiedZalo, setCopiedZalo] = useState(false);

  // Gemini AI state
  const [aiTone, setAiTone] = useState<'Toàn diện & Cân bằng' | 'Khen ngợi & Khích lệ' | 'Đôn đốc khắc phục' | 'Gửi Phụ huynh'>('Toàn diện & Cân bằng');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Tính toán kết quả học tập
  const { avg, subjectAverages } = calculateSemesterAvg(termScore, subjects);
  const rating = evaluateAcademicPerformance(avg, subjectAverages, subjects);
  const honor = getHonorTitle(rating, student.conduct);

  // Thống kê chuyên cần của học sinh này
  const studentAtt = attendanceRecords.filter(a => a.studentId === student.id);
  const excused = studentAtt.filter(a => a.status === 'excused');
  const unexcused = studentAtt.filter(a => a.status === 'unexcused');
  const late = studentAtt.filter(a => a.status === 'late');

  // Khen thưởng / Vi phạm
  const studentDisc = disciplineEntries.filter(d => d.studentId === student.id);

  const handleSaveComment = () => {
    if (onUpdateComment) {
      onUpdateComment(student.id, commentText);
      setIsSavedComment(true);
      setTimeout(() => setIsSavedComment(false), 2000);
    }
  };

  const handleSendZalo = () => {
    const rawComment = commentText.trim() || aiSuggestion || 'Em có ý thức học tập tốt, chấp hành nghiêm túc nề nếp kỷ luật.';
    const message = `Kính gửi phụ huynh em ${student.fullName} (Lớp ${classInfo.className}),
Giáo viên chủ nhiệm xin gửi kết quả rèn luyện Học kỳ ${classInfo.currentTerm === 'HK1' ? 'I' : 'II'}:
- Điểm trung bình: ${avg !== null ? avg.toFixed(1) : 'Đang cập nhật'} (Học lực: ${rating})
- Kết quả rèn luyện (Hạnh kiểm): ${student.conduct}
${honor ? `- Danh hiệu: ${honor}` : ''}
- Tình hình chuyên cần: Nghỉ có phép ${excused.length} buổi, không phép ${unexcused.length} buổi, đi muộn ${late.length} lần.
- Nhận xét của GVCN: "${rawComment}"

Trân trọng kính báo để gia đình cùng phối hợp động viên em!`;

    navigator.clipboard.writeText(message);
    setCopiedZalo(true);
    setTimeout(() => setCopiedZalo(false), 3000);

    const rawPhone = (student.motherPhone || student.fatherPhone)?.replace(/\D/g, '');
    if (rawPhone) {
      window.open(`https://zalo.me/${rawPhone}`, '_blank');
    }
  };

  // Tạo nhận xét thông minh dựa trên dữ liệu bằng Gemini AI (với fallback sư phạm chuẩn)
  const handleGenerateAiComment = async () => {
    setIsAiLoading(true);
    setAiError(null);

    // Tóm tắt các môn thế mạnh và môn yếu
    const strongSubjects: string[] = [];
    const weakSubjects: string[] = [];
    subjects.forEach((sub) => {
      const sAvg = subjectAverages[sub.id];
      if (sAvg !== null && sAvg !== undefined) {
        if (sAvg >= 8.5) strongSubjects.push(`${sub.name} (${sAvg})`);
        else if (sAvg < 6.0) weakSubjects.push(`${sub.name} (${sAvg})`);
      }
    });

    const subjectsSummary = `Môn thế mạnh: ${strongSubjects.join(', ') || 'Học đều các môn'}. Môn cần bồi dưỡng thêm: ${weakSubjects.join(', ') || 'Không có môn yếu'}.`;
    const absencesCount = `${excused.length} buổi có phép, ${unexcused.length} buổi không phép, ${late.length} lần đi muộn.`;
    const disciplineNotes = studentDisc.map(d => d.content).join('; ');

    try {
      const response = await fetch('/api/ai/generate-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: student.fullName,
          rollNumber: student.rollNumber,
          gender: student.gender,
          avgScore: avg !== null ? avg.toFixed(1) : 'Chưa có',
          academicRating: rating,
          conduct: student.conduct,
          subjectsSummary,
          absencesCount,
          disciplineNotes,
          specialNotes: student.specialNotes || '',
          tone: aiTone,
        }),
      });

      if (!response.ok) {
        throw new Error('API server returned error');
      }

      const data = await response.json();
      if (data.comment) {
        setAiSuggestion(data.comment);
        return;
      }
      throw new Error('No comment returned');
    } catch (err) {
      // Fallback sư phạm thông minh nếu chưa có internet hoặc server API lỗi
      const fallbackComment = generateFallbackPedagogicalComment(
        student,
        avg,
        rating,
        strongSubjects,
        weakSubjects,
        excused.length + unexcused.length,
        studentDisc,
        aiTone
      );
      setAiSuggestion(fallbackComment);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Helper hàm sinh nhận xét sư phạm chuẩn mực
  function generateFallbackPedagogicalComment(
    st: Student,
    scoreAvg: number | null,
    academic: string,
    strong: string[],
    weak: string[],
    totalAbsences: number,
    disc: DisciplineEntry[],
    tone: string
  ): string {
    const name = st.fullName;
    const conductWord = st.conduct === 'Tốt' ? 'chăm ngoan, lễ phép, chấp hành nghiêm túc kỷ luật' : 'có ý thức rèn luyện tốt, cần chú ý tác phong';
    
    let academicComment = '';
    if (academic === 'Xuất sắc' || academic === 'Giỏi') {
      academicComment = `Em có năng lực tiếp thu bài rất nhanh, tư duy độc lập và có tinh thần tự giác cao trong học tập, đặc biệt nổi trội ở các môn ${strong.slice(0, 2).join(', ') || 'tự nhiên'}.`;
    } else if (academic === 'Khá') {
      academicComment = `Em có sự cố gắng học tập đều các môn, nắm vững kiến thức cơ bản. Cần dành thêm thời gian ôn luyện để bứt phá ở môn ${weak[0] || 'Toán học'}.`;
    } else {
      academicComment = `Em cần tập trung chú ý lắng nghe thầy cô giảng bài, chủ động hỏi bài các bạn trong tổ và dành thời gian ôn tập nhiều hơn môn ${weak[0] || 'khoa học'}.`;
    }

    let attendanceComment = '';
    if (totalAbsences > 2) {
      attendanceComment = ` Cần lưu ý đảm bảo chuyên cần hơn để không bị gián đoạn mạch kiến thức trên lớp.`;
    }

    let advice = '';
    if (tone === 'Gửi Phụ huynh') {
      advice = ` Kính mong gia đình tiếp tục phối hợp chặt chẽ cùng GVCN đôn đốc, tạo điều kiện thuận lợi nhất để em phát huy tối đa thế mạnh của mình.`;
    } else if (tone === 'Khen ngợi & Khích lệ') {
      advice = ` Thầy cô tin tưởng rằng với ý thức và quyết tâm hiện tại, em sẽ tiếp tục gặt hái thêm nhiều thành tích xuất sắc hơn nữa trong kỳ thi sắp tới.`;
    } else {
      advice = ` Khuyên em tiếp tục phát huy tinh thần gương mẫu của mình để đạt danh hiệu cao trong đợt thi đua cuối năm.`;
    }

    return `Em ${name} là một học sinh ${conductWord}. ${academicComment}${attendanceComment}${advice}`;
  }

  const handleApplyAiSuggestion = () => {
    if (aiSuggestion) {
      setCommentText(aiSuggestion);
      setIsSavedComment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden border border-neutral-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-bold text-lg flex items-center justify-center shadow-xs">
              {student.rollNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-neutral-900">{student.fullName}</h2>
                <span className="text-xs font-mono text-neutral-500">({student.studentCode})</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {student.role}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                <span>Tổ {student.team}</span>
                <span aria-hidden="true">·</span>
                <span>{student.gender}</span>
                <span aria-hidden="true">·</span>
                <span>Sinh ngày: {student.dob.split('-').reverse().join('/')}</span>
                {student.hasVisionImpairment && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-700 font-medium inline-flex items-center gap-1">
                      <Glasses className="w-3.5 h-3.5" />
                      Cận thị
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onEditStudent && (
              <button
                onClick={() => onEditStudent(student)}
                className="px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors inline-flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Sửa hồ sơ
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          {/* Section 1: Thống kê nhanh kết quả học tập & hạnh kiểm */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
              <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wide">Điểm TB ({classInfo.currentTerm})</span>
              <div className="text-xl font-bold text-neutral-900 mt-1 tabular-nums">
                {avg !== null ? avg.toFixed(1) : '-'}
              </div>
              <span className="text-[11px] text-neutral-500">Mức: {rating}</span>
            </div>

            <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
              <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wide">Rèn luyện</span>
              <div className="text-xl font-bold text-emerald-700 mt-1">
                {student.conduct}
              </div>
              <span className="text-[11px] text-neutral-500">Chấp hành tốt</span>
            </div>

            <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
              <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wide">Danh hiệu dự kiến</span>
              <div className="text-sm font-bold text-sky-800 mt-1 line-clamp-1">
                {honor}
              </div>
              <span className="text-[11px] text-neutral-500">Theo Thông tư 22</span>
            </div>

            <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
              <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wide">Chuyên cần</span>
              <div className="text-xl font-bold text-neutral-900 mt-1 tabular-nums">
                {excused.length + unexcused.length} <span className="text-xs font-normal text-neutral-500">buổi nghỉ</span>
              </div>
              <span className="text-[11px] text-neutral-500">
                ({excused.length} có phép · {unexcused.length} không phép)
              </span>
            </div>
          </div>

          {/* Section 2: Thông tin gia đình & liên hệ */}
          <div className="border border-neutral-200 rounded-xl p-4 bg-white space-y-3">
            <h3 className="font-bold text-neutral-900 text-xs uppercase tracking-wide text-neutral-500">
              Thông tin liên hệ & Gia đình
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Bố:</span>
                  <span className="font-semibold text-neutral-900">{student.fatherName || 'Chưa cập nhật'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Nghề nghiệp:</span>
                  <span className="text-neutral-700">{student.fatherJob || '-'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">SĐT Bố:</span>
                  <a 
                    href={`tel:${student.fatherPhone}`} 
                    className="font-mono text-emerald-700 font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    {student.fatherPhone || '-'}
                  </a>
                </div>
              </div>

              <div className="space-y-1.5 md:border-l md:border-neutral-200 md:pl-4">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Mẹ:</span>
                  <span className="font-semibold text-neutral-900">{student.motherName || 'Chưa cập nhật'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Nghề nghiệp:</span>
                  <span className="text-neutral-700">{student.motherJob || '-'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">SĐT Mẹ:</span>
                  <a 
                    href={`tel:${student.motherPhone}`} 
                    className="font-mono text-emerald-700 font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    {student.motherPhone || '-'}
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100 flex items-start gap-2 text-xs text-neutral-600">
              <MapPin className="w-3.5 h-3.5 text-neutral-400 mt-0.5 shrink-0" />
              <span>Địa chỉ thường trú: <strong>{student.address}</strong></span>
            </div>

            {student.specialNotes && (
              <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900">
                <strong>Ghi chú giáo viên:</strong> {student.specialNotes}
              </div>
            )}
          </div>

          {/* Section 3: Bảng điểm chi tiết các môn học */}
          <div className="border border-neutral-200 rounded-xl overflow-hidden">
            <div className="bg-neutral-50 px-4 py-2.5 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="font-bold text-neutral-900 text-xs">
                Bảng điểm chi tiết học kỳ {classInfo.currentTerm}
              </h3>
              <span className="text-[11px] text-neutral-500">
                ĐGtx (x1) · ĐGgk (x2) · ĐGck (x3)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-100/70 text-neutral-600 border-b border-neutral-200">
                    <th className="py-2 px-3 font-semibold">Môn học</th>
                    <th className="py-2 px-2 text-center font-medium">TX 1</th>
                    <th className="py-2 px-2 text-center font-medium">TX 2</th>
                    <th className="py-2 px-2 text-center font-medium">TX 3</th>
                    <th className="py-2 px-2 text-center font-medium">TX 4</th>
                    <th className="py-2 px-2 text-center font-medium">Giữa kỳ</th>
                    <th className="py-2 px-2 text-center font-medium">Cuối kỳ</th>
                    <th className="py-2 px-3 text-right font-bold text-neutral-900">ĐTB Môn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {subjects.map((sub) => {
                    const sc = termScore?.scores[sub.id];
                    const subAvg = calculateSubjectAvg(sc);
                    return (
                      <tr key={sub.id} className="hover:bg-neutral-50/60">
                        <td className="py-2 px-3 font-medium text-neutral-800">
                          {sub.name}
                          {sub.category === 'core' && (
                            <span className="ml-1 text-[10px] text-emerald-700 font-semibold">(Môn chính)</span>
                          )}
                        </td>
                        <td className="py-2 px-2 text-center font-mono tabular-nums text-neutral-700">{formatScore(sc?.tx1)}</td>
                        <td className="py-2 px-2 text-center font-mono tabular-nums text-neutral-700">{formatScore(sc?.tx2)}</td>
                        <td className="py-2 px-2 text-center font-mono tabular-nums text-neutral-700">{formatScore(sc?.tx3)}</td>
                        <td className="py-2 px-2 text-center font-mono tabular-nums text-neutral-700">{formatScore(sc?.tx4)}</td>
                        <td className="py-2 px-2 text-center font-mono tabular-nums font-semibold text-neutral-800">{formatScore(sc?.gk)}</td>
                        <td className="py-2 px-2 text-center font-mono tabular-nums font-semibold text-neutral-800">{formatScore(sc?.ck)}</td>
                        <td className={`py-2 px-3 text-right font-mono tabular-nums font-bold ${
                          subAvg !== null && subAvg < 5.0 ? 'text-rose-600' : 'text-neutral-900'
                        }`}>
                          {formatScore(subAvg)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Lịch sử nề nếp & Khen thưởng */}
          {studentDisc.length > 0 && (
            <div className="border border-neutral-200 rounded-xl p-4 bg-white space-y-2">
              <h3 className="font-bold text-neutral-900 text-xs uppercase tracking-wide text-neutral-500">
                Ghi chép nề nếp & Khen thưởng
              </h3>
              <div className="space-y-2">
                {studentDisc.map((d) => (
                  <div 
                    key={d.id} 
                    className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                      d.type === 'khen_thuong' 
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' 
                        : 'bg-rose-50/60 border-rose-200 text-rose-900'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{d.content}</div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">
                        Ngày {d.date} · Người ghi: {d.reporter}
                      </div>
                    </div>
                    <span className="font-mono font-bold text-sm">
                      {d.pointChange > 0 ? `+${d.pointChange}` : d.pointChange}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TÍCH HỢP GEMINI AI: TỰ ĐỘNG TẠO GỢI Ý NHẬN XÉT HỌC SINH */}
          <div className="border border-emerald-200 rounded-2xl p-4 bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-white space-y-3 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-neutral-900 flex items-center gap-2">
                    <span>Trợ lý Gemini AI gợi ý nhận xét học sinh</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                      Tự động phân tích điểm & nề nếp
                    </span>
                  </h3>
                </div>
              </div>

              {/* Lựa chọn phong cách nhận xét */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-neutral-200 text-[11px]">
                {(['Toàn diện & Cân bằng', 'Khen ngợi & Khích lệ', 'Đôn đốc khắc phục', 'Gửi Phụ huynh'] as const).map((tone) => (
                  <button
                    key={tone}
                    type="button"
                    onClick={() => setAiTone(tone)}
                    className={`px-2 py-1 rounded transition-colors ${
                      aiTone === tone ? 'bg-emerald-700 text-white font-semibold' : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-neutral-600 leading-relaxed">
              Gemini AI sẽ tự động phân tích phổ điểm các môn, hạnh kiểm ({student.conduct}), chuyên cần ({excused.length + unexcused.length} buổi vắng) và ghi chép nề nếp của em <strong>{student.fullName}</strong> để đề xuất lời nhận xét sư phạm chuẩn xác nhất.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={isAiLoading}
                onClick={handleGenerateAiComment}
                className="px-4 py-2 bg-emerald-700 text-white font-semibold rounded-xl text-xs hover:bg-emerald-800 disabled:opacity-60 transition-colors shadow-2xs inline-flex items-center gap-2"
              >
                {isAiLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Gemini AI đang phân tích dữ liệu...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Tạo gợi ý nhận xét bằng Gemini AI</span>
                  </>
                )}
              </button>

              {aiSuggestion && (
                <button
                  type="button"
                  onClick={handleGenerateAiComment}
                  className="p-2 text-neutral-600 hover:text-emerald-700 hover:bg-neutral-100 rounded-lg transition-colors"
                  title="Tạo lại gợi ý khác"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* AI Suggestion Box */}
            {aiSuggestion && (
              <div className="p-3.5 rounded-xl border border-emerald-300 bg-white space-y-2.5 shadow-2xs animate-in fade-in">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Gợi ý nhận xét của Gemini AI:
                  </span>
                  <button
                    type="button"
                    onClick={handleApplyAiSuggestion}
                    className="px-3 py-1 bg-emerald-100 text-emerald-900 hover:bg-emerald-200 font-semibold rounded-lg text-xs transition-colors inline-flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Áp dụng vào ô nhận xét chính
                  </button>
                </div>
                <div className="text-xs text-neutral-800 leading-relaxed italic bg-emerald-50/40 p-2.5 rounded-lg border border-emerald-100">
                  "{aiSuggestion}"
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Nhận xét của Giáo viên chủ nhiệm */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-900">
                Nhận xét & Lời khuyên chính thức của Giáo viên chủ nhiệm (lưu vào sổ & in phiếu báo điểm)
              </label>
              {isSavedComment && (
                <span className="text-xs text-emerald-600 font-semibold inline-flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Đã lưu nhận xét
                </span>
              )}
            </div>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={3}
              placeholder="Nhập nhận xét hoặc bấm 'Tạo gợi ý nhận xét bằng Gemini AI' ở trên để áp dụng tự động..."
              className="w-full text-xs p-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 leading-relaxed"
            />
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={handleSendZalo}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all shadow-2xs inline-flex items-center gap-1.5 ${
                  copiedZalo
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-800 border border-blue-300 hover:bg-blue-100'
                }`}
                title={`Gửi kết quả học tập qua Zalo cho PHHS em ${student.fullName}`}
              >
                {copiedZalo ? <Check className="w-3.5 h-3.5" /> : <MessageCircle className="w-3.5 h-3.5 text-blue-600" />}
                <span>{copiedZalo ? 'Đã copy & Đang mở Zalo!' : 'Gửi Zalo cho Phụ huynh'}</span>
              </button>

              <button
                onClick={handleSaveComment}
                className="px-5 py-2 text-xs font-semibold bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors shadow-2xs"
              >
                Lưu nhận xét học sinh
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
