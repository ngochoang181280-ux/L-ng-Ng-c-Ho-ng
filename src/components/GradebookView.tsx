import React, { useState } from 'react';
import { Student, Subject, StudentTermScores, ClassInfo, SubjectScores } from '../types';
import { 
  calculateSubjectAvg, 
  calculateSemesterAvg, 
  evaluateAcademicPerformance, 
  getHonorTitle, 
  formatScore 
} from '../utils/gradeCalculations';
import { 
  Award, 
  Download, 
  BookOpen, 
  Table, 
  Save, 
  Check, 
  TrendingUp, 
  AlertCircle,
  HelpCircle,
  Compass
} from 'lucide-react';
import { CareerOrientationModal } from './CareerOrientationModal';

interface GradebookViewProps {
  students: Student[];
  subjects: Subject[];
  scores: Record<string, StudentTermScores>;
  classInfo: ClassInfo;
  onUpdateScore: (studentId: string, subjectId: string, field: keyof SubjectScores, value: number | null) => void;
}

export const GradebookView: React.FC<GradebookViewProps> = ({
  students,
  subjects,
  scores,
  classInfo,
  onUpdateScore,
}) => {
  const [viewMode, setViewMode] = useState<'by_subject' | 'summary_matrix'>('by_subject');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'math');
  const [notification, setNotification] = useState<string | null>(null);
  const [showCareerModal, setShowCareerModal] = useState<boolean>(false);

  const activeSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  const handleScoreChange = (
    studentId: string,
    field: keyof SubjectScores,
    rawVal: string
  ) => {
    if (rawVal.trim() === '') {
      onUpdateScore(studentId, activeSubject.id, field, null);
      return;
    }
    const parsed = parseFloat(rawVal.replace(',', '.'));
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 10) {
      onUpdateScore(studentId, activeSubject.id, field, Math.round(parsed * 10) / 10);
      showNotification('Đã cập nhật điểm và tự động tính lại ĐTB!');
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  // Tính thống kê môn hiện tại
  const currentSubjectAverages: number[] = [];
  students.forEach(st => {
    const sc = scores[st.id]?.scores?.[activeSubject.id];
    const avg = calculateSubjectAvg(sc);
    if (avg !== null) currentSubjectAverages.push(avg);
  });

  const subjectGoodCount = currentSubjectAverages.filter(v => v >= 8.0).length;
  const subjectFairCount = currentSubjectAverages.filter(v => v >= 6.5 && v < 8.0).length;
  const subjectPassCount = currentSubjectAverages.filter(v => v >= 5.0 && v < 6.5).length;
  const subjectFailCount = currentSubjectAverages.filter(v => v < 5.0).length;

  const exportGradebookCSV = () => {
    if (viewMode === 'by_subject') {
      const headers = ['STT', 'Mã HS', 'Họ và tên', 'Tổ', 'TX1', 'TX2', 'TX3', 'TX4', 'Giữa kỳ (GK)', 'Cuối kỳ (CK)', 'ĐTB Môn'];
      const rows = students.map(s => {
        const sc = scores[s.id]?.scores?.[activeSubject.id];
        const avg = calculateSubjectAvg(sc);
        return [
          s.rollNumber,
          s.studentCode,
          `"${s.fullName}"`,
          `Tổ ${s.team}`,
          sc?.tx1 ?? '',
          sc?.tx2 ?? '',
          sc?.tx3 ?? '',
          sc?.tx4 ?? '',
          sc?.gk ?? '',
          sc?.ck ?? '',
          avg ?? '',
        ];
      });
      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Bang_diem_mon_${activeSubject.name}_${classInfo.className}.csv`;
      link.click();
    } else {
      const subHeaders = subjects.map(s => `"${s.shortName}"`);
      const headers = ['STT', 'Mã HS', 'Họ và tên', ...subHeaders, 'ĐTB Học kỳ', 'Xếp loại Học lực', 'Danh hiệu'];
      const rows = students.map(s => {
        const termScore = scores[s.id];
        const { avg, subjectAverages } = calculateSemesterAvg(termScore, subjects);
        const rating = evaluateAcademicPerformance(avg, subjectAverages, subjects);
        const honor = getHonorTitle(rating, s.conduct);
        const subScores = subjects.map(sub => formatScore(subjectAverages[sub.id]));
        return [
          s.rollNumber,
          s.studentCode,
          `"${s.fullName}"`,
          ...subScores,
          avg !== null ? avg.toFixed(1) : '',
          rating,
          `"${honor}"`,
        ];
      });
      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Bang_diem_tong_hop_${classInfo.className}.csv`;
      link.click();
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <span>Sổ điểm điện tử học kỳ {classInfo.currentTerm}</span>
              <span className="text-xs font-normal text-neutral-500">
                (Lớp {classInfo.className} · Thông tư 22/2021/TT-BGDĐT)
              </span>
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Hệ số tính điểm chuẩn: ĐGtx (hệ số 1) · ĐGgk (hệ số 2) · ĐGck (hệ số 3).
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-neutral-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('by_subject')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                  viewMode === 'by_subject'
                    ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Theo môn học
              </button>
              <button
                onClick={() => setViewMode('summary_matrix')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                  viewMode === 'summary_matrix'
                    ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                Tổng hợp cả lớp
              </button>
            </div>

            <button
              onClick={() => setShowCareerModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-950 bg-emerald-50 border border-emerald-300 rounded-lg hover:bg-emerald-100 transition-colors shadow-2xs"
              title="Phân tích năng lực & Tư vấn chọn tổ hợp khối thi Đại học (A00, A01, B00, C00, D01...)"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Tư vấn khối thi ĐH & Hướng nghiệp</span>
            </button>

            <button
              onClick={exportGradebookCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-neutral-500" />
              <span>Xuất Excel</span>
            </button>
          </div>
        </div>

        {/* Môn học tabs if viewMode is by_subject */}
        {viewMode === 'by_subject' && (
          <div className="flex items-center gap-1 overflow-x-auto pt-2 border-t border-neutral-100 pb-1">
            {subjects.map((sub) => {
              const isSelected = sub.id === activeSubject.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubjectId(sub.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-emerald-700 text-white font-semibold shadow-2xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  {sub.name}
                  {sub.category === 'core' && <span className="ml-1 opacity-70">*</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Mode 1: Sổ điểm theo môn */}
      {viewMode === 'by_subject' && (
        <div className="space-y-4">
          {/* Quick Subject Stats Banner */}
          <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-neutral-500">Giáo viên giảng dạy:</span>
              <div className="font-semibold text-neutral-900 mt-0.5">{activeSubject.teacherName || 'Chưa phân công'}</div>
            </div>
            <div>
              <span className="text-neutral-500">Điểm TB toàn lớp:</span>
              <div className="font-bold text-neutral-900 font-mono text-sm mt-0.5 tabular-nums">
                {currentSubjectAverages.length > 0
                  ? (currentSubjectAverages.reduce((a, b) => a + b, 0) / currentSubjectAverages.length).toFixed(1)
                  : '-'}
              </div>
            </div>
            <div>
              <span className="text-neutral-500">Phân bố điểm Giỏi (≥ 8.0):</span>
              <div className="font-semibold text-emerald-700 font-mono text-sm mt-0.5 tabular-nums">
                {subjectGoodCount} / {students.length} HS ({Math.round((subjectGoodCount / (students.length || 1)) * 100)}%)
              </div>
            </div>
            <div>
              <span className="text-neutral-500">Cần phụ đạo (&lt; 5.0):</span>
              <div className="font-semibold text-rose-600 font-mono text-sm mt-0.5 tabular-nums">
                {subjectFailCount} HS
              </div>
            </div>
          </div>

          {/* Interactive Grade Table */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-50/90 text-neutral-600 border-b border-neutral-200 font-medium">
                    <th className="py-2.5 px-3 w-12 text-center">STT</th>
                    <th className="py-2.5 px-3 w-24">Mã HS</th>
                    <th className="py-2.5 px-4 font-semibold text-neutral-800">Họ và tên</th>
                    <th className="py-2.5 px-2 text-center w-16">Tổ</th>
                    <th className="py-2.5 px-2 text-center w-20 bg-neutral-100/50">ĐGtx 1</th>
                    <th className="py-2.5 px-2 text-center w-20 bg-neutral-100/50">ĐGtx 2</th>
                    <th className="py-2.5 px-2 text-center w-20 bg-neutral-100/50">ĐGtx 3</th>
                    <th className="py-2.5 px-2 text-center w-20 bg-neutral-100/50">ĐGtx 4</th>
                    <th className="py-2.5 px-2 text-center w-24 bg-sky-50/40 text-sky-900 font-semibold">Giữa kỳ (x2)</th>
                    <th className="py-2.5 px-2 text-center w-24 bg-indigo-50/40 text-indigo-900 font-semibold">Cuối kỳ (x3)</th>
                    <th className="py-2.5 px-4 text-right w-24 bg-emerald-50/50 text-emerald-950 font-bold">ĐTB Môn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {students.map((st) => {
                    const sc = scores[st.id]?.scores?.[activeSubject.id] || {};
                    const subAvg = calculateSubjectAvg(sc);
                    return (
                      <tr key={st.id} className="hover:bg-neutral-50/70">
                        <td className="py-2 px-3 text-center font-mono tabular-nums text-neutral-600">{st.rollNumber}</td>
                        <td className="py-2 px-3 font-mono tabular-nums text-neutral-500">{st.studentCode}</td>
                        <td className="py-2 px-4 font-semibold text-neutral-900">{st.fullName}</td>
                        <td className="py-2 px-2 text-center text-neutral-500">Tổ {st.team}</td>

                        {/* Input TX1 */}
                        <td className="py-1 px-1 text-center bg-neutral-50/30">
                          <input
                            type="text"
                            defaultValue={sc.tx1 !== null && sc.tx1 !== undefined ? sc.tx1 : ''}
                            onBlur={(e) => handleScoreChange(st.id, 'tx1', e.target.value)}
                            className="w-14 text-center font-mono py-1 rounded border border-transparent hover:border-neutral-300 focus:border-emerald-600 focus:bg-white focus:outline-none tabular-nums"
                            placeholder="-"
                          />
                        </td>

                        {/* Input TX2 */}
                        <td className="py-1 px-1 text-center bg-neutral-50/30">
                          <input
                            type="text"
                            defaultValue={sc.tx2 !== null && sc.tx2 !== undefined ? sc.tx2 : ''}
                            onBlur={(e) => handleScoreChange(st.id, 'tx2', e.target.value)}
                            className="w-14 text-center font-mono py-1 rounded border border-transparent hover:border-neutral-300 focus:border-emerald-600 focus:bg-white focus:outline-none tabular-nums"
                            placeholder="-"
                          />
                        </td>

                        {/* Input TX3 */}
                        <td className="py-1 px-1 text-center bg-neutral-50/30">
                          <input
                            type="text"
                            defaultValue={sc.tx3 !== null && sc.tx3 !== undefined ? sc.tx3 : ''}
                            onBlur={(e) => handleScoreChange(st.id, 'tx3', e.target.value)}
                            className="w-14 text-center font-mono py-1 rounded border border-transparent hover:border-neutral-300 focus:border-emerald-600 focus:bg-white focus:outline-none tabular-nums"
                            placeholder="-"
                          />
                        </td>

                        {/* Input TX4 */}
                        <td className="py-1 px-1 text-center bg-neutral-50/30">
                          <input
                            type="text"
                            defaultValue={sc.tx4 !== null && sc.tx4 !== undefined ? sc.tx4 : ''}
                            onBlur={(e) => handleScoreChange(st.id, 'tx4', e.target.value)}
                            className="w-14 text-center font-mono py-1 rounded border border-transparent hover:border-neutral-300 focus:border-emerald-600 focus:bg-white focus:outline-none tabular-nums"
                            placeholder="-"
                          />
                        </td>

                        {/* Input GK */}
                        <td className="py-1 px-1 text-center bg-sky-50/20">
                          <input
                            type="text"
                            defaultValue={sc.gk !== null && sc.gk !== undefined ? sc.gk : ''}
                            onBlur={(e) => handleScoreChange(st.id, 'gk', e.target.value)}
                            className="w-16 text-center font-mono font-semibold py-1 rounded border border-transparent hover:border-sky-300 focus:border-sky-600 focus:bg-white focus:outline-none text-sky-900 tabular-nums"
                            placeholder="-"
                          />
                        </td>

                        {/* Input CK */}
                        <td className="py-1 px-1 text-center bg-indigo-50/20">
                          <input
                            type="text"
                            defaultValue={sc.ck !== null && sc.ck !== undefined ? sc.ck : ''}
                            onBlur={(e) => handleScoreChange(st.id, 'ck', e.target.value)}
                            className="w-16 text-center font-mono font-semibold py-1 rounded border border-transparent hover:border-indigo-300 focus:border-indigo-600 focus:bg-white focus:outline-none text-indigo-900 tabular-nums"
                            placeholder="-"
                          />
                        </td>

                        {/* ĐTB Môn */}
                        <td className="py-2 px-4 text-right bg-emerald-50/30">
                          <span
                            className={`font-mono font-bold tabular-nums text-sm ${
                              subAvg !== null && subAvg < 5.0
                                ? 'text-rose-600'
                                : subAvg !== null && subAvg >= 8.0
                                ? 'text-emerald-700'
                                : 'text-neutral-900'
                            }`}
                          >
                            {formatScore(subAvg)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="bg-neutral-50 px-4 py-3 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
              <span>* Hướng dẫn: Nhập điểm trực tiếp vào từng ô, hệ thống tự động lưu và cập nhật ĐTB ngay lập tức.</span>
              <span className="font-medium text-emerald-800">Đã cập nhật đủ {students.length} học sinh</span>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Sổ điểm tổng hợp cả lớp */}
      {viewMode === 'summary_matrix' && (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-50/90 text-neutral-600 border-b border-neutral-200 font-medium">
                  <th className="py-2.5 px-2 w-10 text-center sticky left-0 bg-neutral-50 z-10">STT</th>
                  <th className="py-2.5 px-3 min-w-[140px] font-semibold text-neutral-800 sticky left-10 bg-neutral-50 z-10">
                    Họ và tên
                  </th>
                  {subjects.map((sub) => (
                    <th key={sub.id} className="py-2.5 px-2 text-center min-w-[50px]">
                      {sub.shortName}
                    </th>
                  ))}
                  <th className="py-2.5 px-3 text-right bg-emerald-50 font-bold text-emerald-950 min-w-[70px]">
                    ĐTB HK
                  </th>
                  <th className="py-2.5 px-3 text-center min-w-[90px]">Học lực</th>
                  <th className="py-2.5 px-3 text-center min-w-[90px]">Rèn luyện</th>
                  <th className="py-2.5 px-3 text-left min-w-[130px]">Danh hiệu thi đua</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {students.map((st) => {
                  const termScore = scores[st.id];
                  const { avg, subjectAverages } = calculateSemesterAvg(termScore, subjects);
                  const rating = evaluateAcademicPerformance(avg, subjectAverages, subjects);
                  const honor = getHonorTitle(rating, st.conduct);

                  return (
                    <tr key={st.id} className="hover:bg-neutral-50/80">
                      <td className="py-2 px-2 text-center font-mono tabular-nums text-neutral-600 sticky left-0 bg-white">
                        {st.rollNumber}
                      </td>
                      <td className="py-2 px-3 font-semibold text-neutral-900 sticky left-10 bg-white">
                        {st.fullName}
                      </td>

                      {subjects.map((sub) => {
                        const subAvg = subjectAverages[sub.id];
                        return (
                          <td
                            key={sub.id}
                            className={`py-2 px-2 text-center font-mono tabular-nums ${
                              subAvg !== null && subAvg < 5.0
                                ? 'text-rose-600 font-bold bg-rose-50/40'
                                : 'text-neutral-700'
                            }`}
                          >
                            {formatScore(subAvg)}
                          </td>
                        );
                      })}

                      <td className="py-2 px-3 text-right font-mono font-bold tabular-nums bg-emerald-50/50 text-emerald-900 text-sm">
                        {avg !== null ? avg.toFixed(1) : '-'}
                      </td>

                      <td className="py-2 px-3 text-center">
                        <span
                          className={`font-semibold ${
                            rating === 'Xuất sắc'
                              ? 'text-emerald-700'
                              : rating === 'Giỏi'
                              ? 'text-teal-700'
                              : rating === 'Khá'
                              ? 'text-sky-700'
                              : rating === 'Đạt'
                              ? 'text-amber-700'
                              : 'text-rose-600'
                          }`}
                        >
                          {rating}
                        </span>
                      </td>

                      <td className="py-2 px-3 text-center font-semibold text-emerald-800">
                        {st.conduct}
                      </td>

                      <td className="py-2 px-3 font-medium text-neutral-700">
                        <span className="text-[11px] font-semibold text-neutral-900">
                          {honor}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Tư vấn chọn tổ hợp khối thi Đại học & Nghề nghiệp */}
      {showCareerModal && (
        <CareerOrientationModal
          students={students}
          subjects={subjects}
          scores={scores}
          onClose={() => setShowCareerModal(false)}
        />
      )}
    </div>
  );
};
