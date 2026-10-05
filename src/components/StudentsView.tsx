import React, { useState, useMemo } from 'react';
import { Student, ClassInfo } from '../types';
import { exportStudentsToCSV } from '../utils/storage';
import { 
  Search, 
  UserPlus, 
  Download, 
  Filter, 
  Eye, 
  Edit2, 
  Trash2, 
  Phone, 
  Glasses, 
  CheckCircle, 
  ShieldCheck 
} from 'lucide-react';

interface StudentsViewProps {
  students: Student[];
  classInfo: ClassInfo;
  onSelectStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onAddStudent: () => void;
  onDeleteStudent: (studentId: string) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  classInfo,
  onSelectStudent,
  onEditStudent,
  onAddStudent,
  onDeleteStudent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<number | 'all'>('all');
  const [selectedGender, setSelectedGender] = useState<'all' | 'Nam' | 'Nữ'>('all');

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.studentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.fatherPhone && s.fatherPhone.includes(searchQuery)) ||
        (s.motherPhone && s.motherPhone.includes(searchQuery)) ||
        String(s.rollNumber) === searchQuery.trim();

      const matchTeam = selectedTeam === 'all' || s.team === selectedTeam;
      const matchGender = selectedGender === 'all' || s.gender === selectedGender;

      return matchSearch && matchTeam && matchGender;
    });
  }, [students, searchQuery, selectedTeam, selectedGender]);

  const handleDeleteConfirm = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa học sinh "${name}" khỏi danh sách lớp không?`)) {
      onDeleteStudent(id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top action & Filter bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-bold text-neutral-900">
              Danh sách & Hồ sơ học sinh
            </h1>
            <div className="text-xs text-neutral-500 mt-0.5">
              Tổng số {students.length} học sinh · Lớp {classInfo.className} ({classInfo.academicYear})
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportStudentsToCSV(students, classInfo)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
              title="Xuất file danh sách học sinh chuẩn Excel"
            >
              <Download className="w-3.5 h-3.5 text-neutral-500" />
              <span>Xuất CSV / Excel</span>
            </button>

            <button
              onClick={onAddStudent}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors shadow-2xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Thêm học sinh</span>
            </button>
          </div>
        </div>

        {/* Search & Segmented filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-neutral-100">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo họ tên, mã học sinh, số điện thoại phụ huynh..."
              className="w-full pl-9 pr-4 py-1.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          {/* Team filter segmented buttons */}
          <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg shrink-0">
            <button
              onClick={() => setSelectedTeam('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                selectedTeam === 'all' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Tất cả tổ
            </button>
            {[1, 2, 3, 4].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTeam(t)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  selectedTeam === t ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Tổ {t}
              </button>
            ))}
          </div>

          {/* Gender filter */}
          <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg shrink-0">
            <button
              onClick={() => setSelectedGender('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                selectedGender === 'all' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setSelectedGender('Nam')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                selectedGender === 'Nam' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Nam
            </button>
            <button
              onClick={() => setSelectedGender('Nữ')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                selectedGender === 'Nữ' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Nữ
            </button>
          </div>
        </div>
      </div>

      {/* Main Student Table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50/80 text-neutral-600 border-b border-neutral-200 font-medium">
                <th className="py-3 px-3 w-12 text-center">STT</th>
                <th className="py-3 px-3 w-24">Mã định danh</th>
                <th className="py-3 px-4 font-semibold text-neutral-800">Họ và tên</th>
                <th className="py-3 px-2 text-center w-16">Giới tính</th>
                <th className="py-3 px-3">Ngày sinh</th>
                <th className="py-3 px-2 text-center">Tổ</th>
                <th className="py-3 px-3">Chức vụ</th>
                <th className="py-3 px-3">Liên hệ Phụ huynh</th>
                <th className="py-3 px-3">Hạnh kiểm</th>
                <th className="py-3 px-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-neutral-500">
                    Không tìm thấy học sinh nào phù hợp với điều kiện tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => onSelectStudent(s)}
                    className="hover:bg-neutral-50/80 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-3 text-center font-mono tabular-nums font-semibold text-neutral-700">
                      {s.rollNumber}
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums text-neutral-500">
                      {s.studentCode}
                    </td>
                    <td className="py-3 px-4 font-semibold text-neutral-900">
                      <div className="flex items-center gap-2">
                        <span>{s.fullName}</span>
                        {s.hasVisionImpairment && (
                          <span title="Học sinh cận thị">
                            <Glasses className="w-3.5 h-3.5 text-amber-600 inline" />
                          </span>
                        )}
                        {s.policyBeneficiary && (
                          <span className="text-[10px] text-amber-700 font-normal">
                            ({s.policyBeneficiary})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center text-neutral-700">
                      {s.gender}
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums text-neutral-600">
                      {s.dob.split('-').reverse().join('/')}
                    </td>
                    <td className="py-3 px-2 text-center font-medium text-neutral-700">
                      Tổ {s.team}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[11px] font-medium ${
                        s.role !== 'Học sinh' ? 'text-emerald-800 font-semibold' : 'text-neutral-600'
                      }`}>
                        {s.role}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-[11px] text-neutral-700 font-mono">
                        {s.fatherPhone ? (
                          <span title={`Bố: ${s.fatherName}`}>Bố: {s.fatherPhone}</span>
                        ) : s.motherPhone ? (
                          <span title={`Mẹ: ${s.motherName}`}>Mẹ: {s.motherPhone}</span>
                        ) : (
                          <span className="text-neutral-400">Chưa cập nhật</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[11px] font-semibold ${
                        s.conduct === 'Tốt' ? 'text-emerald-700' : 'text-amber-700'
                      }`}>
                        {s.conduct}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onSelectStudent(s)}
                          className="p-1.5 text-neutral-500 hover:text-emerald-700 hover:bg-neutral-100 rounded-md transition-colors"
                          title="Xem hồ sơ chi tiết"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditStudent(s)}
                          className="p-1.5 text-neutral-500 hover:text-sky-700 hover:bg-neutral-100 rounded-md transition-colors"
                          title="Sửa thông tin học sinh"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteConfirm(s.id, s.fullName)}
                          className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-neutral-100 rounded-md transition-colors"
                          title="Xóa học sinh"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-neutral-50 px-4 py-3 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
          <span>Hiển thị {filteredStudents.length} / {students.length} học sinh</span>
          <span>Bấm trực tiếp vào hàng học sinh để xem hồ sơ và bảng điểm chi tiết</span>
        </div>
      </div>
    </div>
  );
};
