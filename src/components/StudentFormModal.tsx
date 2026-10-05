import React, { useState } from 'react';
import { Student, GenderType, ConductType, StudentRole } from '../types';
import { X, Save, UserPlus } from 'lucide-react';

interface StudentFormModalProps {
  student?: Student | null; // null nếu là thêm mới
  nextRollNumber: number;
  onSave: (student: Student) => void;
  onClose: () => void;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  student,
  nextRollNumber,
  onSave,
  onClose,
}) => {
  const isEditing = Boolean(student);

  const [formData, setFormData] = useState<Student>({
    id: student?.id || `s${Date.now()}`,
    rollNumber: student?.rollNumber || nextRollNumber,
    studentCode: student?.studentCode || `10A1-${String(nextRollNumber).padStart(2, '0')}`,
    fullName: student?.fullName || '',
    gender: student?.gender || 'Nam',
    dob: student?.dob || '2009-01-01',
    ethnic: student?.ethnic || 'Kinh',
    address: student?.address || '',
    team: student?.team || 1,
    role: student?.role || 'Học sinh',
    fatherName: student?.fatherName || '',
    fatherPhone: student?.fatherPhone || '',
    fatherJob: student?.fatherJob || '',
    motherName: student?.motherName || '',
    motherPhone: student?.motherPhone || '',
    motherJob: student?.motherJob || '',
    hasVisionImpairment: student?.hasVisionImpairment || false,
    heightCm: student?.heightCm || 165,
    specialNotes: student?.specialNotes || '',
    conduct: student?.conduct || 'Tốt',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      alert('Vui lòng nhập họ và tên học sinh!');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-neutral-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-bold text-neutral-900">
              {isEditing ? `Sửa hồ sơ: ${student?.fullName}` : 'Thêm học sinh mới vào lớp'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Thông tin cơ bản */}
          <div className="space-y-3">
            <h3 className="font-bold text-neutral-800 uppercase tracking-wider text-[11px] text-neutral-500">
              Thông tin học sinh
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">STT</label>
                <input
                  type="number"
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Mã học sinh</label>
                <input
                  type="text"
                  value={formData.studentCode}
                  onChange={(e) => setFormData({ ...formData, studentCode: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Giới tính</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as GenderType })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Họ và tên *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Ngày sinh</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Tổ sinh hoạt</label>
                <select
                  value={formData.team}
                  onChange={(e) => setFormData({ ...formData, team: Number(e.target.value) as 1 | 2 | 3 | 4 })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                >
                  <option value={1}>Tổ 1</option>
                  <option value={2}>Tổ 2</option>
                  <option value={3}>Tổ 3</option>
                  <option value={4}>Tổ 4</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Chức vụ trong lớp</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as StudentRole })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                >
                  <option value="Học sinh">Học sinh</option>
                  <option value="Lớp trưởng">Lớp trưởng</option>
                  <option value="Lớp phó học tập">Lớp phó học tập</option>
                  <option value="Lớp phó phong trào">Lớp phó phong trào</option>
                  <option value="Lớp phó lao động">Lớp phó lao động</option>
                  <option value="Bí thư chi đoàn">Bí thư chi đoàn</option>
                  <option value="Thủ quỹ">Thủ quỹ</option>
                  <option value="Tổ trưởng">Tổ trưởng</option>
                  <option value="Tổ phó">Tổ phó</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Rèn luyện / Hạnh kiểm</label>
                <select
                  value={formData.conduct}
                  onChange={(e) => setFormData({ ...formData, conduct: e.target.value as ConductType })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                >
                  <option value="Tốt">Tốt</option>
                  <option value="Khá">Khá</option>
                  <option value="Đạt">Đạt</option>
                  <option value="Chưa đạt">Chưa đạt</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Dân tộc</label>
                <input
                  type="text"
                  value={formData.ethnic}
                  onChange={(e) => setFormData({ ...formData, ethnic: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                />
              </div>

              <div className="flex items-center gap-4 pt-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasVisionImpairment}
                    onChange={(e) => setFormData({ ...formData, hasVisionImpairment: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span className="text-neutral-800">Học sinh bị cận thị (ưu tiên ngồi đầu)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-neutral-700 font-medium mb-1">Địa chỉ thường trú</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Số nhà, đường phố, quận/huyện..."
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
              />
            </div>
          </div>

          {/* Thông tin phụ huynh */}
          <div className="space-y-3 pt-3 border-t border-neutral-200">
            <h3 className="font-bold text-neutral-800 uppercase tracking-wider text-[11px] text-neutral-500">
              Thông tin liên hệ Cha / Mẹ
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Họ tên Bố</label>
                <input
                  type="text"
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-neutral-700 font-medium mb-1">SĐT Bố</label>
                <input
                  type="text"
                  value={formData.fatherPhone}
                  onChange={(e) => setFormData({ ...formData, fatherPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Nghề nghiệp Bố</label>
                <input
                  type="text"
                  value={formData.fatherJob}
                  onChange={(e) => setFormData({ ...formData, fatherJob: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Họ tên Mẹ</label>
                <input
                  type="text"
                  value={formData.motherName}
                  onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-neutral-700 font-medium mb-1">SĐT Mẹ</label>
                <input
                  type="text"
                  value={formData.motherPhone}
                  onChange={(e) => setFormData({ ...formData, motherPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Nghề nghiệp Mẹ</label>
                <input
                  type="text"
                  value={formData.motherJob}
                  onChange={(e) => setFormData({ ...formData, motherJob: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Ghi chú đặc biệt */}
          <div className="pt-2">
            <label className="block text-neutral-700 font-medium mb-1">Ghi chú đặc biệt của GVCN</label>
            <textarea
              rows={2}
              value={formData.specialNotes}
              onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
              placeholder="Ví dụ: Năng khiếu mỹ thuật, hoàn cảnh khó khăn, cần kèm môn Toán..."
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-600 hover:text-neutral-900 font-medium rounded-lg"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-colors shadow-xs inline-flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              Lưu học sinh
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
