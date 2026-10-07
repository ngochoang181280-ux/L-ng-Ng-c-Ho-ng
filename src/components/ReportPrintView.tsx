import React, { useState } from 'react';
import { Student, Subject, StudentTermScores, AttendanceRecord, ClassInfo } from '../types';
import { 
  calculateSemesterAvg, 
  evaluateAcademicPerformance, 
  getHonorTitle, 
  calculateSubjectAvg,
  formatScore 
} from '../utils/gradeCalculations';
import { 
  Printer, 
  FileText, 
  Users, 
  Download, 
  ChevronRight, 
  Award, 
  CheckCircle2, 
  Calendar,
  MessageCircle,
  Copy,
  Check,
  Share2
} from 'lucide-react';

interface ReportPrintViewProps {
  students: Student[];
  subjects: Subject[];
  scores: Record<string, StudentTermScores>;
  attendance: AttendanceRecord[];
  classInfo: ClassInfo;
}

export const ReportPrintView: React.FC<ReportPrintViewProps> = ({
  students,
  subjects,
  scores,
  attendance,
  classInfo,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [reportType, setReportType] = useState<'individual' | 'class_summary'>('individual');
  const [copiedZalo, setCopiedZalo] = useState(false);

  const activeStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const termScore = activeStudent ? scores[activeStudent.id] : undefined;
  const { avg, subjectAverages } = calculateSemesterAvg(termScore, subjects);
  const rating = evaluateAcademicPerformance(avg, subjectAverages, subjects);
  const honor = activeStudent ? getHonorTitle(rating, activeStudent.conduct) : '';

  // Chuyên cần của học sinh được chọn
  const studentAtt = activeStudent ? attendance.filter((a) => a.studentId === activeStudent.id) : [];
  const excused = studentAtt.filter((a) => a.status === 'excused');
  const unexcused = studentAtt.filter((a) => a.status === 'unexcused');
  const late = studentAtt.filter((a) => a.status === 'late');

  const handlePrint = () => {
    window.print();
  };

  const handleSendZalo = () => {
    if (!activeStudent) return;
    const sTermScore = scores[activeStudent.id];
    const { avg: stAvg, subjectAverages: stSubAvg } = calculateSemesterAvg(sTermScore, subjects);
    const stRating = evaluateAcademicPerformance(stAvg, stSubAvg, subjects);
    const stHonor = getHonorTitle(stRating, activeStudent.conduct);

    const stAttList = attendance.filter((a) => a.studentId === activeStudent.id);
    const exCount = stAttList.filter((a) => a.status === 'excused').length;
    const unCount = stAttList.filter((a) => a.status === 'unexcused').length;
    const lateCount = stAttList.filter((a) => a.status === 'late').length;

    const teacherComment = sTermScore?.teacherComment || 'Em có ý thức học tập tốt, chấp hành nghiêm túc nề nếp kỷ luật.';

    const message = `Kính gửi phụ huynh em ${activeStudent.fullName} (Lớp ${classInfo.className}),
Giáo viên chủ nhiệm xin gửi kết quả học tập & rèn luyện Học kỳ ${classInfo.currentTerm === 'HK1' ? 'I' : 'II'} (Năm học ${classInfo.academicYear}):
- Điểm trung bình học kỳ: ${formatScore(stAvg)} (Xếp loại: ${stRating})
- Kết quả rèn luyện (Hạnh kiểm): ${activeStudent.conduct}
${stHonor ? `- Danh hiệu: ${stHonor}` : ''}
- Tình hình chuyên cần: Nghỉ có phép ${exCount} buổi, không phép ${unCount} buổi, đi muộn ${lateCount} lần.
- Nhận xét của GVCN: "${teacherComment}"

Trân trọng kính báo để gia đình cùng phối hợp theo dõi và động viên em!`;

    navigator.clipboard.writeText(message);
    setCopiedZalo(true);
    setTimeout(() => setCopiedZalo(false), 3000);

    // Mở Zalo nếu có số điện thoại phụ huynh (mẹ hoặc bố)
    const rawPhone = (activeStudent.motherPhone || activeStudent.fatherPhone)?.replace(/\D/g, '');
    if (rawPhone) {
      window.open(`https://zalo.me/${rawPhone}`, '_blank');
    }
  };

  // Thống kê toàn lớp cho báo cáo tổng kết
  const classAverages = students.map((s) => {
    const sc = scores[s.id];
    const { avg: stAvg, subjectAverages: stSubAvg } = calculateSemesterAvg(sc, subjects);
    const stRating = evaluateAcademicPerformance(stAvg, stSubAvg, subjects);
    return {
      student: s,
      avg: stAvg,
      rating: stRating,
      conduct: s.conduct,
      honor: getHonorTitle(stRating, s.conduct),
    };
  });

  const ratingCounts = {
    'Xuất sắc': classAverages.filter((c) => c.rating === 'Xuất sắc').length,
    'Giỏi': classAverages.filter((c) => c.rating === 'Giỏi').length,
    'Khá': classAverages.filter((c) => c.rating === 'Khá').length,
    'Đạt': classAverages.filter((c) => c.rating === 'Đạt').length,
    'Chưa đạt': classAverages.filter((c) => c.rating === 'Chưa đạt').length,
  };

  const conductCounts = {
    'Tốt': students.filter((s) => s.conduct === 'Tốt').length,
    'Khá': students.filter((s) => s.conduct === 'Khá').length,
    'Đạt': students.filter((s) => s.conduct === 'Đạt').length,
    'Chưa đạt': students.filter((s) => s.conduct === 'Chưa đạt').length,
  };

  return (
    <div className="space-y-6">
      {/* Top Controls (Hidden during print) */}
      <div className="no-print bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-bold text-neutral-900">
              Xuất báo cáo & In Phiếu liên lạc điện tử
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Chuẩn hóa mẫu phiếu liên lạc gửi phụ huynh và báo cáo sơ kết nộp Ban Giám Hiệu
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In trang này (Print / PDF)</span>
            </button>
          </div>
        </div>

        {/* Report Mode Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-neutral-100">
          <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg">
            <button
              onClick={() => setReportType('individual')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                reportType === 'individual'
                  ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Phiếu liên lạc từng học sinh
            </button>
            <button
              onClick={() => setReportType('class_summary')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                reportType === 'class_summary'
                  ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Báo cáo tổng kết lớp (gửi BGH)
            </button>
          </div>

          {reportType === 'individual' && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500">Chọn học sinh:</span>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="text-xs font-semibold px-3 py-1.5 border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.rollNumber}. {st.fullName} ({st.studentCode})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSendZalo}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shadow-2xs inline-flex items-center gap-1.5 ${
                  copiedZalo
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-800 border border-blue-300 hover:bg-blue-100'
                }`}
                title={`Gửi kết quả học tập qua Zalo cho PHHS em ${activeStudent.fullName}`}
              >
                {copiedZalo ? <Check className="w-3.5 h-3.5" /> : <MessageCircle className="w-3.5 h-3.5 text-blue-600" />}
                <span>{copiedZalo ? 'Đã copy & Đang mở Zalo!' : 'Gửi Zalo cho Phụ huynh'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* REPORT CONTENT 1: PHIẾU LIÊN LẠC HỌC SINH */}
      {reportType === 'individual' && activeStudent && (
        <div className="bg-white rounded-2xl border border-neutral-300 p-8 shadow-sm max-w-4xl mx-auto space-y-6 text-neutral-900">
          {/* Header Quốc hiệu */}
          <div className="text-center space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </div>
            <div className="text-xs font-medium italic underline decoration-neutral-400 underline-offset-4">
              Độc lập - Tự do - Hạnh phúc
            </div>
            <div className="pt-2 text-xs font-bold text-neutral-600 uppercase">
              {classInfo.schoolName}
            </div>
          </div>

          {/* Title */}
          <div className="text-center pt-2 pb-1 border-b border-neutral-200">
            <h2 className="text-xl font-bold tracking-tight uppercase text-emerald-950">
              PHIẾU BÁO ĐIỂM & KẾT QUẢ RÈN LUYỆN
            </h2>
            <p className="text-xs text-neutral-600 mt-1 font-medium">
              HỌC KỲ {classInfo.currentTerm === 'HK1' ? 'I' : 'II'} · NĂM HỌC {classInfo.academicYear}
            </p>
          </div>

          {/* Student Info Box */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs border border-neutral-200 p-4 rounded-xl bg-neutral-50/50">
            <div>
              <span className="text-neutral-500">Họ và tên học sinh:</span>{' '}
              <strong className="text-sm text-neutral-900">{activeStudent.fullName}</strong>
            </div>
            <div>
              <span className="text-neutral-500">Mã định danh học sinh:</span>{' '}
              <strong className="font-mono">{activeStudent.studentCode}</strong>
            </div>
            <div>
              <span className="text-neutral-500">Lớp:</span>{' '}
              <strong>{classInfo.className}</strong> (STT: {activeStudent.rollNumber} - Tổ {activeStudent.team})
            </div>
            <div>
              <span className="text-neutral-500">Ngày sinh:</span>{' '}
              <strong className="font-mono">{activeStudent.dob.split('-').reverse().join('/')}</strong> (Giới tính: {activeStudent.gender})
            </div>
            <div>
              <span className="text-neutral-500">Giáo viên chủ nhiệm:</span>{' '}
              <strong>{classInfo.homeroomTeacher}</strong>
            </div>
            <div>
              <span className="text-neutral-500">Số điện thoại GVCN:</span>{' '}
              <strong className="font-mono">{classInfo.teacherPhone}</strong>
            </div>
          </div>

          {/* Detailed Grades Table */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wide text-neutral-700">
              I. KẾT QUẢ ĐÁNH GIÁ CÁC MÔN HỌC
            </div>
            <div className="border border-neutral-300 rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-100 text-neutral-700 border-b border-neutral-300 font-semibold">
                    <th className="py-2 px-3 w-10 text-center">STT</th>
                    <th className="py-2 px-3">Môn học</th>
                    <th className="py-2 px-2 text-center">ĐGtx 1</th>
                    <th className="py-2 px-2 text-center">ĐGtx 2</th>
                    <th className="py-2 px-2 text-center">ĐGtx 3</th>
                    <th className="py-2 px-2 text-center">ĐGtx 4</th>
                    <th className="py-2 px-2 text-center font-bold">Giữa kỳ</th>
                    <th className="py-2 px-2 text-center font-bold">Cuối kỳ</th>
                    <th className="py-2 px-3 text-right font-bold text-neutral-900">ĐTB Môn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {subjects.map((sub, idx) => {
                    const sc = termScore?.scores?.[sub.id];
                    const subAvg = calculateSubjectAvg(sc);
                    return (
                      <tr key={sub.id} className="hover:bg-neutral-50/50">
                        <td className="py-1.5 px-3 text-center font-mono text-neutral-500">{idx + 1}</td>
                        <td className="py-1.5 px-3 font-medium text-neutral-900">{sub.name}</td>
                        <td className="py-1.5 px-2 text-center font-mono tabular-nums">{formatScore(sc?.tx1)}</td>
                        <td className="py-1.5 px-2 text-center font-mono tabular-nums">{formatScore(sc?.tx2)}</td>
                        <td className="py-1.5 px-2 text-center font-mono tabular-nums">{formatScore(sc?.tx3)}</td>
                        <td className="py-1.5 px-2 text-center font-mono tabular-nums">{formatScore(sc?.tx4)}</td>
                        <td className="py-1.5 px-2 text-center font-mono tabular-nums font-semibold">{formatScore(sc?.gk)}</td>
                        <td className="py-1.5 px-2 text-center font-mono tabular-nums font-semibold">{formatScore(sc?.ck)}</td>
                        <td className="py-1.5 px-3 text-right font-mono tabular-nums font-bold text-neutral-900">
                          {formatScore(subAvg)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section II: Tổng kết & Rèn luyện */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wide text-neutral-700">
              II. TỔNG KẾT ĐÁNH GIÁ CHUNG
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 border border-neutral-300 rounded-lg">
                <span className="text-neutral-500">Điểm trung bình HK:</span>
                <div className="text-lg font-bold font-mono text-neutral-900 mt-1 tabular-nums">
                  {avg !== null ? avg.toFixed(1) : '-'}
                </div>
              </div>
              <div className="p-3 border border-neutral-300 rounded-lg">
                <span className="text-neutral-500">Kết quả học tập:</span>
                <div className="text-lg font-bold text-emerald-800 mt-1">
                  {rating}
                </div>
              </div>
              <div className="p-3 border border-neutral-300 rounded-lg">
                <span className="text-neutral-500">Kết quả rèn luyện:</span>
                <div className="text-lg font-bold text-neutral-900 mt-1">
                  {activeStudent.conduct}
                </div>
              </div>
              <div className="p-3 border border-neutral-300 rounded-lg">
                <span className="text-neutral-500">Danh hiệu thi đua:</span>
                <div className="text-sm font-bold text-neutral-900 mt-1 line-clamp-1">
                  {honor}
                </div>
              </div>
            </div>

            <div className="p-3 border border-neutral-200 rounded-lg bg-neutral-50 text-xs">
              <span>Chuyên cần: </span>
              <strong>{excused.length + unexcused.length}</strong> buổi nghỉ ({excused.length} có phép, {unexcused.length} không phép) · <strong>{late.length}</strong> lần đi muộn.
            </div>
          </div>

          {/* Section III: Nhận xét của GVCN */}
          <div className="space-y-1.5">
            <div className="text-xs font-bold uppercase tracking-wide text-neutral-700">
              III. NHẬN XÉT CỦA GIÁO VIÊN CHỦ NHIỆM
            </div>
            <div className="p-3.5 border border-neutral-300 rounded-lg text-xs leading-relaxed italic bg-white">
              {termScore?.teacherComment || 'Em luôn có ý thức kỷ luật tốt, chăm chỉ học tập và tham gia đầy đủ các phong trào thi đua của lớp.'}
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-xs text-center">
            <div>
              <div className="font-semibold uppercase text-neutral-800">Ý KIẾN & CHỮ KÝ PHỤ HUYNH</div>
              <div className="text-[11px] text-neutral-500 italic mt-0.5">(Ký và ghi rõ họ tên)</div>
              <div className="h-20" />
              <div className="font-semibold">{activeStudent.fatherName || activeStudent.motherName || '...........................................'}</div>
            </div>

            <div>
              <div className="font-semibold uppercase text-neutral-800">GIÁO VIÊN CHỦ NHIỆM</div>
              <div className="text-[11px] text-neutral-500 italic mt-0.5">(Ký và ghi rõ họ tên)</div>
              <div className="h-20" />
              <div className="font-bold text-neutral-900">{classInfo.homeroomTeacher}</div>
            </div>
          </div>
        </div>
      )}

      {/* REPORT CONTENT 2: BÁO CÁO TỔNG KẾT TÌNH HÌNH LỚP */}
      {reportType === 'class_summary' && (
        <div className="bg-white rounded-2xl border border-neutral-300 p-8 shadow-sm max-w-4xl mx-auto space-y-6 text-neutral-900">
          <div className="text-center space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </div>
            <div className="text-xs font-medium italic underline decoration-neutral-400 underline-offset-4">
              Độc lập - Tự do - Hạnh phúc
            </div>
            <div className="pt-2 text-xs font-bold text-neutral-600 uppercase">
              {classInfo.schoolName}
            </div>
          </div>

          <div className="text-center pt-2 pb-1 border-b border-neutral-200">
            <h2 className="text-xl font-bold tracking-tight uppercase text-emerald-950">
              BÁO CÁO CÔNG TÁC CHỦ NHIỆM & TỔNG KẾT HỌC KỲ {classInfo.currentTerm === 'HK1' ? 'I' : 'II'}
            </h2>
            <p className="text-xs text-neutral-600 mt-1 font-medium">
              Lớp: {classInfo.className} · Năm học: {classInfo.academicYear} · GVCN: {classInfo.homeroomTeacher}
            </p>
          </div>

          {/* I. Tình hình sĩ số */}
          <div className="space-y-2 text-xs">
            <h3 className="font-bold uppercase tracking-wide text-neutral-800">
              I. TÌNH HÌNH SĨ SỐ & ĐẶC ĐIỂM LỚP
            </h3>
            <p className="leading-relaxed text-neutral-700">
              - Tổng số học sinh: <strong>{students.length}</strong> (Nam: {students.filter(s => s.gender === 'Nam').length}, Nữ: {students.filter(s => s.gender === 'Nữ').length}).<br />
              - Học sinh diện chính sách, hoàn cảnh cần hỗ trợ: {students.filter(s => s.policyBeneficiary).length} học sinh.<br />
              - Học sinh có khiếm khuyết thị giác (cận thị): {students.filter(s => s.hasVisionImpairment).length} học sinh (đã được bố trí bàn đầu).
            </p>
          </div>

          {/* II. Thống kê học lực */}
          <div className="space-y-2 text-xs">
            <h3 className="font-bold uppercase tracking-wide text-neutral-800">
              II. THỐNG KÊ KẾT QUẢ HỌC TẬP (Theo Thông tư 22)
            </h3>
            <div className="border border-neutral-300 rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-100 text-neutral-700 border-b border-neutral-300">
                    <th className="py-2 px-3">Xếp loại học lực</th>
                    <th className="py-2 px-3 text-center">Số lượng (HS)</th>
                    <th className="py-2 px-3 text-center">Tỷ lệ (%)</th>
                    <th className="py-2 px-3">Ghi chú</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {Object.entries(ratingCounts).map(([tier, count]) => {
                    const pct = Math.round((count / (students.length || 1)) * 100);
                    return (
                      <tr key={tier}>
                        <td className="py-2 px-3 font-semibold">{tier}</td>
                        <td className="py-2 px-3 text-center font-mono tabular-nums font-bold">{count}</td>
                        <td className="py-2 px-3 text-center font-mono tabular-nums">{pct}%</td>
                        <td className="py-2 px-3 text-neutral-500">
                          {tier === 'Xuất sắc' || tier === 'Giỏi' ? 'Đạt chỉ tiêu thi đua đề ra' : ''}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* III. Thống kê rèn luyện */}
          <div className="space-y-2 text-xs">
            <h3 className="font-bold uppercase tracking-wide text-neutral-800">
              III. THỐNG KÊ KẾT QUẢ RÈN LUYỆN (HẠNH KIỂM)
            </h3>
            <div className="border border-neutral-300 rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-100 text-neutral-700 border-b border-neutral-300">
                    <th className="py-2 px-3">Mức rèn luyện</th>
                    <th className="py-2 px-3 text-center">Số lượng (HS)</th>
                    <th className="py-2 px-3 text-center">Tỷ lệ (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {Object.entries(conductCounts).map(([tier, count]) => {
                    const pct = Math.round((count / (students.length || 1)) * 100);
                    return (
                      <tr key={tier}>
                        <td className="py-2 px-3 font-semibold">{tier}</td>
                        <td className="py-2 px-3 text-center font-mono tabular-nums font-bold">{count}</td>
                        <td className="py-2 px-3 text-center font-mono tabular-nums">{pct}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-xs text-center">
            <div>
              <div className="font-semibold uppercase text-neutral-800">BAN GIÁM HIỆU PHÊ DUYỆT</div>
              <div className="text-[11px] text-neutral-500 italic mt-0.5">(Ký và đóng dấu)</div>
              <div className="h-20" />
            </div>

            <div>
              <div className="font-semibold uppercase text-neutral-800">GIÁO VIÊN CHỦ NHIỆM</div>
              <div className="text-[11px] text-neutral-500 italic mt-0.5">(Ký và ghi rõ họ tên)</div>
              <div className="h-20" />
              <div className="font-bold text-neutral-900">{classInfo.homeroomTeacher}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
