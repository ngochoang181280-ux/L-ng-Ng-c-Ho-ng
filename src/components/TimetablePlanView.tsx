import React, { useState } from 'react';
import { TimetableEntry, WeeklyMeetingPlan, Student, ClassInfo } from '../types';
import { 
  Calendar, 
  Clock, 
  FileText, 
  Edit3, 
  Save, 
  Check, 
  Award, 
  AlertCircle, 
  Printer 
} from 'lucide-react';

interface TimetablePlanViewProps {
  timetable: TimetableEntry[];
  meetingPlans: WeeklyMeetingPlan[];
  students: Student[];
  classInfo: ClassInfo;
  onUpdatePlan: (plan: WeeklyMeetingPlan) => void;
}

export const TimetablePlanView: React.FC<TimetablePlanViewProps> = ({
  timetable,
  meetingPlans,
  students,
  classInfo,
  onUpdatePlan,
}) => {
  const [activePlanIdx, setActivePlanIdx] = useState(0);
  const currentPlan = meetingPlans[activePlanIdx] || meetingPlans[0];

  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState<WeeklyMeetingPlan>(currentPlan);
  const [notification, setNotification] = useState<string | null>(null);

  const days = [2, 3, 4, 5, 6, 7];
  const dayNames: Record<number, string> = {
    2: 'Thứ Hai',
    3: 'Thứ Ba',
    4: 'Thứ Tư',
    5: 'Thứ Năm',
    6: 'Thứ Sáu',
    7: 'Thứ Bảy',
  };

  const handleSavePlan = () => {
    onUpdatePlan(editedPlan);
    setIsEditing(false);
    setNotification('Đã lưu nội dung sinh hoạt lớp tuần!');
    setTimeout(() => setNotification(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-neutral-900">
            Thời khóa biểu & Sổ tay sinh hoạt lớp
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Lịch học chính khóa và biên bản sinh hoạt lớp cuối tuần (Tiết 5 Thứ Bảy)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-neutral-500" />
            <span>In thời khóa biểu</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2.5 rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Thời khóa biểu Tuần */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs">
        <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-700" />
            <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
              Thời khóa biểu chính khóa (Buổi sáng) · Lớp {classInfo.className}
            </h2>
          </div>
          <span className="text-[11px] text-neutral-500">Tiết 1 bắt đầu: 07:15 · Tiết 5 kết thúc: 11:30</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-100/70 text-neutral-600 border-b border-neutral-200">
                <th className="py-2.5 px-3 w-16 text-center font-medium">Tiết</th>
                {days.map((d) => (
                  <th key={d} className="py-2.5 px-3 font-semibold text-neutral-800 text-center">
                    {dayNames[d]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {[1, 2, 3, 4, 5].map((period) => (
                <tr key={period} className="hover:bg-neutral-50/50">
                  <td className="py-3 px-3 text-center font-mono font-bold text-neutral-500 bg-neutral-50/60">
                    Tiết {period}
                  </td>
                  {days.map((day) => {
                    const slot = timetable.find((t) => t.day === day && t.period === period);
                    const isSpecial =
                      slot?.subjectName.includes('Chào cờ') ||
                      slot?.subjectName.includes('Sinh hoạt');

                    return (
                      <td
                        key={day}
                        className={`py-2 px-3 text-center border-l border-neutral-100 ${
                          isSpecial ? 'bg-emerald-50/60' : ''
                        }`}
                      >
                        {slot ? (
                          <div>
                            <div className={`font-semibold text-xs ${
                              isSpecial ? 'text-emerald-900' : 'text-neutral-900'
                            }`}>
                              {slot.subjectName}
                            </div>
                            {slot.teacherName && (
                              <div className="text-[10px] text-neutral-400 truncate max-w-[130px] mx-auto mt-0.5">
                                {slot.teacherName}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-neutral-300">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sổ tay sinh hoạt lớp cuối tuần */}
      {currentPlan && (
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-700" />
                <h2 className="text-sm font-bold text-neutral-900">
                  Biên bản sinh hoạt lớp - Tuần {currentPlan.weekNumber}
                </h2>
                <span className="text-xs text-neutral-500 font-mono">
                  ({currentPlan.startDate} đến {currentPlan.endDate})
                </span>
              </div>
              <p className="text-xs text-neutral-600 mt-1">
                <strong>Chủ điểm tuần:</strong> {currentPlan.theme}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {isEditing ? (
                <button
                  onClick={handleSavePlan}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors shadow-2xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  Lưu biên bản
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-neutral-500" />
                  Sửa nội dung
                </button>
              )}
            </div>
          </div>

          {/* Plan Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Left: Đánh giá tuần */}
            <div className="space-y-2">
              <h3 className="font-bold text-neutral-800 uppercase tracking-wide text-[11px] text-neutral-500">
                1. Đánh giá tình hình tuần qua
              </h3>
              {isEditing ? (
                <textarea
                  rows={5}
                  value={editedPlan.evaluationSummary}
                  onChange={(e) => setEditedPlan({ ...editedPlan, evaluationSummary: e.target.value })}
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              ) : (
                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-700 leading-relaxed">
                  {currentPlan.evaluationSummary}
                </div>
              )}

              {/* Tuyên dương cá nhân */}
              <div className="pt-2">
                <div className="font-semibold text-emerald-800 flex items-center gap-1 mb-1.5">
                  <Award className="w-3.5 h-3.5" />
                  Tuyên dương học sinh xuất sắc trong tuần:
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentPlan.praiseStudents.map((id) => {
                    const st = students.find((s) => s.id === id);
                    return (
                      <span
                        key={id}
                        className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 font-medium"
                      >
                        {st?.fullName || 'Học sinh'} (Tổ {st?.team})
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Kế hoạch tuần tới */}
            <div className="space-y-2">
              <h3 className="font-bold text-neutral-800 uppercase tracking-wide text-[11px] text-neutral-500">
                2. Phương hướng & Kế hoạch tuần tới
              </h3>
              {isEditing ? (
                <textarea
                  rows={5}
                  value={editedPlan.nextWeekPlan}
                  onChange={(e) => setEditedPlan({ ...editedPlan, nextWeekPlan: e.target.value })}
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              ) : (
                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-700 leading-relaxed">
                  {currentPlan.nextWeekPlan}
                </div>
              )}

              {/* Nhắc nhở */}
              <div className="pt-2">
                <div className="font-semibold text-rose-800 flex items-center gap-1 mb-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Học sinh cần khắc phục nề nếp / học tập:
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentPlan.remindStudents.map((id) => {
                    const st = students.find((s) => s.id === id);
                    return (
                      <span
                        key={id}
                        className="px-2.5 py-1 rounded bg-rose-50 text-rose-900 border border-rose-200 font-medium"
                      >
                        {st?.fullName || 'Học sinh'} (Tổ {st?.team})
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
