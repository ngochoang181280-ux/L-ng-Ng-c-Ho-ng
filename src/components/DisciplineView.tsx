import React, { useState } from 'react';
import { Student, DisciplineEntry, ClassInfo } from '../types';
import { 
  Scale, 
  Award, 
  AlertTriangle, 
  Plus, 
  Filter, 
  Trash2, 
  CheckCircle, 
  X, 
  PhoneCall, 
  Save 
} from 'lucide-react';

interface DisciplineViewProps {
  students: Student[];
  discipline: DisciplineEntry[];
  classInfo: ClassInfo;
  onAddDiscipline: (entry: DisciplineEntry) => void;
  onUpdateDisciplineStatus: (id: string, status: DisciplineEntry['status']) => void;
  onDeleteDiscipline: (id: string) => void;
}

export const DisciplineView: React.FC<DisciplineViewProps> = ({
  students,
  discipline,
  classInfo,
  onAddDiscipline,
  onUpdateDisciplineStatus,
  onDeleteDiscipline,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'khen_thuong' | 'vi_pham' | 'nhac_nho'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form thêm ghi nhận
  const [newEntry, setNewEntry] = useState<Partial<DisciplineEntry>>({
    date: '2025-03-24',
    studentId: students[0]?.id || '',
    type: 'khen_thuong',
    category: 'Học tập',
    content: '',
    pointChange: 5,
    reporter: 'GVCN',
    status: 'Đã giải quyết',
  });

  // Tính điểm thi đua 4 tổ
  const teamScores = [1, 2, 3, 4].map((teamNum) => {
    const teamStudents = students.filter((s) => s.team === teamNum);
    const studentIds = new Set(teamStudents.map((s) => s.id));
    const entries = discipline.filter((d) => studentIds.has(d.studentId));

    const totalDelta = entries.reduce((acc, curr) => acc + curr.pointChange, 0);
    const finalScore = 100 + totalDelta;

    return {
      team: teamNum,
      studentCount: teamStudents.length,
      praiseCount: entries.filter((e) => e.type === 'khen_thuong').length,
      violationCount: entries.filter((e) => e.type !== 'khen_thuong').length,
      score: finalScore,
    };
  }).sort((a, b) => b.score - a.score);

  const filteredDiscipline = discipline.filter((d) => {
    if (filterType === 'all') return true;
    return d.type === filterType;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.content?.trim()) {
      alert('Vui lòng nhập nội dung ghi nhận nề nếp!');
      return;
    }

    const created: DisciplineEntry = {
      id: `disc-${Date.now()}`,
      date: newEntry.date || '2025-03-24',
      studentId: newEntry.studentId || students[0]?.id,
      type: newEntry.type as any,
      category: newEntry.category as any,
      content: newEntry.content,
      pointChange: Number(newEntry.pointChange) || 0,
      reporter: newEntry.reporter || 'GVCN',
      status: newEntry.status as any,
    };

    onAddDiscipline(created);
    setShowAddModal(false);
    setNewEntry({
      date: '2025-03-24',
      studentId: students[0]?.id || '',
      type: 'khen_thuong',
      category: 'Học tập',
      content: '',
      pointChange: 5,
      reporter: 'GVCN',
      status: 'Đã giải quyết',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-neutral-900">
            Sổ nề nếp & Thi đua khen thưởng
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Theo dõi kỷ luật, khen thưởng gương người tốt việc tốt và xếp loại thi đua giữa các tổ
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ghi nhận nề nếp / Khen thưởng</span>
        </button>
      </div>

      {/* 4 Teams Competition Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {teamScores.map((t, idx) => (
          <div
            key={t.team}
            className={`p-4 rounded-xl border relative overflow-hidden shadow-2xs ${
              idx === 0
                ? 'bg-emerald-50/50 border-emerald-300'
                : 'bg-white border-neutral-200'
            }`}
          >
            {idx === 0 && (
              <div className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white uppercase tracking-wider">
                Dẫn đầu
              </div>
            )}
            <div className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
              Tổ {t.team}
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-neutral-900 tabular-nums">
                {t.score}
              </span>
              <span className="text-xs text-neutral-500">điểm thi đua</span>
            </div>
            <div className="mt-2 text-xs text-neutral-600 flex items-center gap-2">
              <span className="text-emerald-700 font-medium">+{t.praiseCount} khen</span>
              <span aria-hidden="true">·</span>
              <span className="text-rose-600 font-medium">-{t.violationCount} nhắc nhở</span>
            </div>
          </div>
        ))}
      </div>

      {/* Log Table with Filters */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs space-y-3 p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterType === 'all' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Tất cả ({discipline.length})
            </button>
            <button
              onClick={() => setFilterType('khen_thuong')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterType === 'khen_thuong' ? 'bg-white text-emerald-800 shadow-2xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Khen thưởng
            </button>
            <button
              onClick={() => setFilterType('nhac_nho')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterType === 'nhac_nho' ? 'bg-white text-amber-800 shadow-2xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Nhắc nhở
            </button>
            <button
              onClick={() => setFilterType('vi_pham')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterType === 'vi_pham' ? 'bg-white text-rose-800 shadow-2xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Vi phạm
            </button>
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 -mb-4">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50/80 text-neutral-600 border-y border-neutral-200 font-medium">
                <th className="py-2.5 px-4 w-28">Ngày</th>
                <th className="py-2.5 px-4 font-semibold text-neutral-800">Học sinh</th>
                <th className="py-2.5 px-3">Phân loại</th>
                <th className="py-2.5 px-4">Nội dung sự việc</th>
                <th className="py-2.5 px-3 text-center">Điểm cộng/trừ</th>
                <th className="py-2.5 px-3">Người báo cáo</th>
                <th className="py-2.5 px-3">Trạng thái</th>
                <th className="py-2.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredDiscipline.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-500">
                    Không có bản ghi nào theo bộ lọc này.
                  </td>
                </tr>
              ) : (
                filteredDiscipline.map((d) => {
                  const student = students.find((s) => s.id === d.studentId);
                  return (
                    <tr key={d.id} className="hover:bg-neutral-50/70">
                      <td className="py-2.5 px-4 font-mono tabular-nums text-neutral-600">
                        {d.date.split('-').reverse().join('/')}
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-neutral-900">
                        <div>
                          {student?.fullName || 'Học sinh'}
                          <span className="text-[11px] font-normal text-neutral-400 ml-1.5">
                            (Tổ {student?.team})
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`text-[11px] font-semibold ${
                          d.type === 'khen_thuong'
                            ? 'text-emerald-700'
                            : d.type === 'vi_pham'
                            ? 'text-rose-600'
                            : 'text-amber-700'
                        }`}>
                          {d.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-neutral-800">
                        {d.content}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono tabular-nums font-bold text-sm">
                        <span className={d.pointChange > 0 ? 'text-emerald-700' : 'text-rose-600'}>
                          {d.pointChange > 0 ? `+${d.pointChange}` : d.pointChange}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-neutral-600">
                        {d.reporter}
                      </td>
                      <td className="py-2.5 px-3">
                        <select
                          value={d.status}
                          onChange={(e) => onUpdateDisciplineStatus(d.id, e.target.value as any)}
                          className={`text-[11px] font-medium px-2 py-1 rounded border focus:outline-none ${
                            d.status === 'Cần liên hệ PH'
                              ? 'bg-rose-50 border-rose-300 text-rose-800'
                              : d.status === 'Đang theo dõi'
                              ? 'bg-amber-50 border-amber-300 text-amber-800'
                              : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          }`}
                        >
                          <option value="Đã giải quyết">Đã giải quyết</option>
                          <option value="Đang theo dõi">Đang theo dõi</option>
                          <option value="Cần liên hệ PH">Cần liên hệ PH</option>
                        </select>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <button
                          onClick={() => onDeleteDiscipline(d.id)}
                          className="p-1 text-neutral-400 hover:text-rose-600 rounded transition-colors"
                          title="Xóa bản ghi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div 
            className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-neutral-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
              <h2 className="text-sm font-bold text-neutral-900">
                Thêm ghi nhận nề nếp / Khen thưởng
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Ngày ghi nhận</label>
                  <input
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Hình thức</label>
                  <select
                    value={newEntry.type}
                    onChange={(e) => {
                      const t = e.target.value as any;
                      setNewEntry({
                        ...newEntry,
                        type: t,
                        pointChange: t === 'khen_thuong' ? 5 : t === 'vi_pham' ? -5 : -2,
                      });
                    }}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-medium"
                  >
                    <option value="khen_thuong">Khen thưởng (+)</option>
                    <option value="nhac_nho">Nhắc nhở (-)</option>
                    <option value="vi_pham">Vi phạm (-)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Chọn học sinh</label>
                <select
                  value={newEntry.studentId}
                  onChange={(e) => setNewEntry({ ...newEntry, studentId: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-medium"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.rollNumber}. {st.fullName} (Tổ {st.team})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Lĩnh vực</label>
                  <select
                    value={newEntry.category}
                    onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                  >
                    <option value="Học tập">Học tập</option>
                    <option value="Chuyên cần">Chuyên cần</option>
                    <option value="Nề nếp">Nề nếp</option>
                    <option value="Vệ sinh">Vệ sinh</option>
                    <option value="Phong trào">Phong trào</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Điểm thi đua (cộng/trừ)</label>
                  <input
                    type="number"
                    value={newEntry.pointChange}
                    onChange={(e) => setNewEntry({ ...newEntry, pointChange: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">Nội dung chi tiết sự việc</label>
                <textarea
                  rows={3}
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                  placeholder="Ví dụ: Đạt điểm 10 kiểm tra miệng môn Toán / Đi học muộn 15 phút..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Người báo cáo</label>
                  <input
                    type="text"
                    value={newEntry.reporter}
                    onChange={(e) => setNewEntry({ ...newEntry, reporter: e.target.value })}
                    placeholder="GVCN, Sao đỏ..."
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">Tình trạng</label>
                  <select
                    value={newEntry.status}
                    onChange={(e) => setNewEntry({ ...newEntry, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                  >
                    <option value="Đã giải quyết">Đã giải quyết</option>
                    <option value="Đang theo dõi">Đang theo dõi</option>
                    <option value="Cần liên hệ PH">Cần liên hệ PH</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-neutral-600 hover:text-neutral-900 font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-colors shadow-xs"
                >
                  Lưu ghi nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
