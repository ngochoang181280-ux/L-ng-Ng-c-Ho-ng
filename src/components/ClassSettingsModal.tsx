import React, { useState } from 'react';
import { ClassInfo } from '../types';
import { Settings, Save, X } from 'lucide-react';

interface ClassSettingsModalProps {
  classInfo: ClassInfo;
  onSave: (updated: ClassInfo) => void;
  onClose: () => void;
}

export const ClassSettingsModal: React.FC<ClassSettingsModalProps> = ({
  classInfo,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<ClassInfo>({ ...classInfo });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-700" />
            <h2 className="text-sm font-bold text-neutral-900">
              Cài đặt Thông tin Lớp Chủ Nhiệm
            </h2>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-neutral-700 mb-1">Tên lớp chủ nhiệm</label>
              <input
                type="text"
                value={formData.className}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                placeholder="Ví dụ: 10A1"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-bold"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-neutral-700 mb-1">Năm học</label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                placeholder="2024 - 2025"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-neutral-700 mb-1">Tên trường học</label>
            <input
              type="text"
              value={formData.schoolName}
              onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-neutral-700 mb-1">Họ tên Giáo viên chủ nhiệm</label>
              <input
                type="text"
                value={formData.homeroomTeacher}
                onChange={(e) => setFormData({ ...formData, homeroomTeacher: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-medium"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-neutral-700 mb-1">Số điện thoại GVCN</label>
              <input
                type="text"
                value={formData.teacherPhone}
                onChange={(e) => setFormData({ ...formData, teacherPhone: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-neutral-700 mb-1">Email GVCN</label>
              <input
                type="email"
                value={formData.teacherEmail}
                onChange={(e) => setFormData({ ...formData, teacherEmail: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium text-neutral-700 mb-1">Phòng học</label>
              <input
                type="text"
                value={formData.classroom}
                onChange={(e) => setFormData({ ...formData, classroom: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-600 hover:text-neutral-900 font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-colors shadow-xs inline-flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              Lưu cài đặt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
