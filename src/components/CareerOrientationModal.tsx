import React, { useState } from 'react';
import { Student, Subject, StudentTermScores } from '../types';
import { calculateSemesterAvg, calculateSubjectAvg } from '../utils/gradeCalculations';
import { 
  Compass, 
  TrendingUp, 
  Award, 
  X, 
  CheckCircle2, 
  BookOpen, 
  Sparkles,
  Briefcase
} from 'lucide-react';

interface CareerOrientationModalProps {
  students: Student[];
  subjects: Subject[];
  scores: Record<string, StudentTermScores>;
  onClose: () => void;
}

export const CareerOrientationModal: React.FC<CareerOrientationModalProps> = ({
  students,
  subjects,
  scores,
  onClose,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const activeStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const termScore = scores[activeStudent.id];
  const { subjectAverages } = calculateSemesterAvg(termScore, subjects);

  // Helper lấy điểm 1 môn
  const getSub = (id: string): number => {
    const val = subjectAverages[id];
    return typeof val === 'number' ? val : 7.0;
  };

  const math = getSub('math');
  const phys = getSub('phys');
  const chem = getSub('chem');
  const bio = getSub('bio');
  const lit = getSub('lit');
  const hist = getSub('hist');
  const geo = getSub('geo');
  const eng = getSub('eng');
  const it = getSub('it');

  // Tính điểm 5 khối thi Đại học chính
  const blocks = [
    {
      code: 'A00',
      name: 'Toán - Vật lí - Hóa học',
      score: Math.round((math + phys + chem) * 10) / 10,
      career: 'Kỹ thuật, Công nghệ thông tin, Trí tuệ nhân tạo (AI), Tự động hóa, Xây dựng',
      category: 'KHTN',
    },
    {
      code: 'A01',
      name: 'Toán - Vật lí - Tiếng Anh',
      score: Math.round((math + phys + eng) * 10) / 10,
      career: 'Khoa học máy tính, Logistics, Kinh tế quốc tế, Tài chính công nghệ (FinTech)',
      category: 'KHTN',
    },
    {
      code: 'B00',
      name: 'Toán - Hóa học - Sinh học',
      score: Math.round((math + chem + bio) * 10) / 10,
      career: 'Bác sĩ đa khoa, Dược sĩ, Công nghệ sinh học, Môi trường, Nông nghiệp công nghệ cao',
      category: 'KHTN',
    },
    {
      code: 'D01',
      name: 'Toán - Ngữ văn - Tiếng Anh',
      score: Math.round((math + lit + eng) * 10) / 10,
      career: 'Quản trị kinh doanh, Marketing, Ngoại thương, Ngân hàng, Luật kinh tế, Truyền thông',
      category: 'Tổng hợp',
    },
    {
      code: 'C00',
      name: 'Ngữ văn - Lịch sử - Địa lí',
      score: Math.round((lit + hist + geo) * 10) / 10,
      career: 'Luật học, Báo chí truyền thông, Sư phạm, Quan hệ quốc tế, Du lịch, Quản lý văn hóa',
      category: 'KHXH',
    },
  ].sort((a, b) => b.score - a.score);

  const topBlock = blocks[0];

  // Tính tỷ trọng KHTN vs KHXH
  const avgNat = Math.round(((math + phys + chem + bio + it) / 5) * 10) / 10;
  const avgSoc = Math.round(((lit + hist + geo + eng) / 4) * 10) / 10;
  const dominantSide = avgNat >= avgSoc ? 'Khoa học Tự nhiên & Công nghệ' : 'Khoa học Xã hội & Ngôn ngữ';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden border border-neutral-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-2xs">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900">
                Phân tích Năng lực & Định hướng Khối thi Đại học
              </h2>
              <div className="text-[11px] text-neutral-500">
                Đánh giá thế mạnh học tập và gợi ý tổ hợp môn xét tuyển Đại học chuẩn xác
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Student Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-700 text-white font-bold flex items-center justify-center text-sm shadow-2xs">
                {activeStudent.rollNumber}
              </div>
              <div>
                <div className="font-bold text-neutral-900 text-sm">{activeStudent.fullName}</div>
                <div className="text-[11px] text-neutral-500">
                  {activeStudent.studentCode} · Tổ {activeStudent.team} · Lớp 10A1
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-neutral-500 font-medium">Đổi học sinh:</span>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="p-2 border border-neutral-300 rounded-lg bg-white font-semibold text-neutral-900 focus:outline-none"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.rollNumber}. {st.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Natural vs Social Balance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sky-900">Tổ hợp Khoa học Tự nhiên</span>
                <span className="font-mono font-bold text-lg text-sky-800">{avgNat} đ</span>
              </div>
              <div className="text-[11px] text-neutral-600">
                Toán ({math}) · Vật lí ({phys}) · Hóa học ({chem}) · Sinh học ({bio}) · Tin ({it})
              </div>
            </div>

            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900">Tổ hợp Khoa học Xã hội</span>
                <span className="font-mono font-bold text-lg text-amber-800">{avgSoc} đ</span>
              </div>
              <div className="text-[11px] text-neutral-600">
                Ngữ văn ({lit}) · Lịch sử ({hist}) · Địa lí ({geo}) · Tiếng Anh ({eng})
              </div>
            </div>
          </div>

          {/* Top Recommendation Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-900 to-teal-900 text-white space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-emerald-300 font-semibold text-[11px] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Khuyến nghị định hướng tối ưu nhất</span>
            </div>
            <div className="text-base font-bold">
              Tổ hợp khối {topBlock.code} ({topBlock.name}) - Điểm dự kiến: {topBlock.score} / 30
            </div>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              Dựa trên phổ điểm hiện tại, em <strong>{activeStudent.fullName}</strong> có thiên hướng rõ rệt về <strong>{dominantSide}</strong>. Khối {topBlock.code} mang lại lợi thế cạnh tranh cao nhất cho kỳ thi Tốt nghiệp THPT và xét tuyển Đại học.
            </p>
          </div>

          {/* Detailed 5 Exam Blocks Ranking */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wide text-neutral-700">
              Xếp hạng 5 Khối thi Đại học phổ biến (Thang điểm 30)
            </h3>

            <div className="space-y-2.5">
              {blocks.map((b, idx) => (
                <div
                  key={b.code}
                  className={`p-3.5 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    idx === 0
                      ? 'border-emerald-500 bg-emerald-50/40 shadow-2xs ring-1 ring-emerald-500'
                      : 'border-neutral-200 bg-white'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-sm px-2 py-0.5 rounded bg-neutral-900 text-white">
                        Khối {b.code}
                      </span>
                      <span className="font-semibold text-neutral-900">{b.name}</span>
                      {idx === 0 && (
                        <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold">
                          Thế mạnh nhất
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-neutral-500 flex items-center gap-1.5 pt-0.5">
                      <Briefcase className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span>Nhóm ngành phù hợp: {b.career}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xl font-bold font-mono text-neutral-900 tabular-nums">
                      {b.score} <span className="text-xs text-neutral-500 font-normal">/ 30</span>
                    </div>
                    <div className="text-[10px] text-neutral-400">ĐTB 3 môn: {(b.score / 3).toFixed(1)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-neutral-700 font-medium rounded-lg hover:bg-neutral-100"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
