import React, { useState, useMemo } from 'react';
import { Student, AttendanceRecord, AttendanceStatus, ClassInfo } from '../types';
import { 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Check, 
  Sparkles,
  BarChart3
} from 'lucide-react';

interface AttendanceViewProps {
  students: Student[];
  attendance: AttendanceRecord[];
  classInfo: ClassInfo;
  onUpdateAttendance: (records: AttendanceRecord[]) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  students,
  attendance,
  classInfo,
  onUpdateAttendance,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('2025-03-24');
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly_summary'>('daily');
  const [notification, setNotification] = useState<string | null>(null);

  // Lấy các bản ghi điểm danh của ngày được chọn
  const dayRecords = useMemo(() => {
    return attendance.filter((a) => a.date === selectedDate);
  }, [attendance, selectedDate]);

  // Tạo map studentId -> AttendanceRecord
  const recordMap = useMemo(() => {
    const map = new Map<string, AttendanceRecord>();
    dayRecords.forEach((r) => map.set(r.studentId, r));
    return map;
  }, [dayRecords]);

  // Thống kê ngày được chọn
  const excusedList = dayRecords.filter((r) => r.status === 'excused');
  const unexcusedList = dayRecords.filter((r) => r.status === 'unexcused');
  const lateList = dayRecords.filter((r) => r.status === 'late');
  const presentCount = students.length - excusedList.length - unexcusedList.length;

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  // Đổi trạng thái 1 học sinh
  const handleToggleStatus = (studentId: string, currentStatus: AttendanceStatus) => {
    const cycle: Record<AttendanceStatus, AttendanceStatus> = {
      present: 'excused',
      excused: 'unexcused',
      unexcused: 'late',
      late: 'present',
    };
    const nextStatus = cycle[currentStatus];

    const updated = [...attendance];
    const existingIdx = updated.findIndex(
      (a) => a.date === selectedDate && a.studentId === studentId
    );

    if (existingIdx >= 0) {
      if (nextStatus === 'present') {
        // Xóa bản ghi (mặc định là có mặt)
        updated.splice(existingIdx, 1);
      } else {
        updated[existingIdx] = {
          ...updated[existingIdx],
          status: nextStatus,
        };
      }
    } else if (nextStatus !== 'present') {
      updated.push({
        id: `att-${Date.now()}-${studentId}`,
        date: selectedDate,
        studentId,
        status: nextStatus,
        note: '',
      });
    }

    onUpdateAttendance(updated);
  };

  // Đổi ghi chú lý do vắng
  const handleUpdateNote = (studentId: string, note: string) => {
    const updated = [...attendance];
    const existingIdx = updated.findIndex(
      (a) => a.date === selectedDate && a.studentId === studentId
    );

    if (existingIdx >= 0) {
      updated[existingIdx] = {
        ...updated[existingIdx],
        note,
      };
      onUpdateAttendance(updated);
    } else if (note.trim() !== '') {
      updated.push({
        id: `att-${Date.now()}-${studentId}`,
        date: selectedDate,
        studentId,
        status: 'excused',
        note,
      });
      onUpdateAttendance(updated);
    }
  };

  // Đánh dấu tất cả có mặt
  const handleMarkAllPresent = () => {
    const filtered = attendance.filter((a) => a.date !== selectedDate);
    onUpdateAttendance(filtered);
    showToast(`Đã đánh dấu 100% học sinh lớp ${classInfo.className} có mặt ngày ${selectedDate}`);
  };

  // Chuyển ngày
  const handleStepDay = (step: number) => {
    const curr = new Date(selectedDate);
    curr.setDate(curr.getDate() + step);
    setSelectedDate(curr.toISOString().slice(0, 10));
  };

  // Thống kê chuyên cần cả tháng của từng học sinh
  const monthlyStats = useMemo(() => {
    return students.map((st) => {
      const records = attendance.filter((a) => a.studentId === st.id);
      const excusedCount = records.filter((r) => r.status === 'excused').length;
      const unexcusedCount = records.filter((r) => r.status === 'unexcused').length;
      const lateCount = records.filter((r) => r.status === 'late').length;
      const totalAbsences = excusedCount + unexcusedCount;

      return {
        student: st,
        excusedCount,
        unexcusedCount,
        lateCount,
        totalAbsences,
      };
    }).sort((a, b) => b.totalAbsences - a.totalAbsences);
  }, [students, attendance]);

  return (
    <div className="space-y-4">
      {/* Top Header & Date Navigation */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-bold text-neutral-900">
              Sổ điểm danh & Theo dõi chuyên cần
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Lớp {classInfo.className} · Năm học {classInfo.academicYear}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-neutral-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('daily')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'daily'
                    ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Điểm danh theo ngày
              </button>
              <button
                onClick={() => setActiveTab('monthly_summary')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                  activeTab === 'monthly_summary'
                    ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Tổng hợp tháng
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'daily' && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-neutral-100">
            {/* Date selector with quick buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleStepDay(-1)}
                className="p-1.5 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg"
                title="Ngày trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-1.5">
                <Calendar className="w-4 h-4 text-emerald-700" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="text-xs font-semibold text-neutral-900 bg-transparent focus:outline-none"
                />
              </div>

              <button
                onClick={() => handleStepDay(1)}
                className="p-1.5 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg"
                title="Ngày sau"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setSelectedDate('2025-03-24')}
                className="text-xs px-2.5 py-1.5 text-emerald-700 font-semibold hover:bg-emerald-50 rounded-lg"
              >
                Hôm nay
              </button>
            </div>

            <button
              onClick={handleMarkAllPresent}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Đánh dấu cả lớp có mặt</span>
            </button>
          </div>
        )}
      </div>

      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Daily Roll Call View */}
      {activeTab === 'daily' && (
        <div className="space-y-4">
          {/* Day Summary Pill */}
          <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-neutral-900">
                Sĩ số: {students.length} học sinh
              </span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Có mặt: {presentCount}
              </span>
              <span className="text-amber-700 font-medium">
                Có phép: {excusedList.length}
              </span>
              <span className="text-rose-600 font-semibold">
                Không phép: {unexcusedList.length}
              </span>
              <span className="text-neutral-600">
                Muộn: {lateList.length}
              </span>
            </div>

            <span className="text-neutral-400 hidden sm:inline">
              * Click nút trạng thái để chuyển đổi (Có mặt &rarr; Có phép &rarr; Không phép &rarr; Muộn)
            </span>
          </div>

          {/* Roll Call Table */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-50/80 text-neutral-600 border-b border-neutral-200 font-medium">
                    <th className="py-2.5 px-3 w-12 text-center">STT</th>
                    <th className="py-2.5 px-3 w-24">Mã HS</th>
                    <th className="py-2.5 px-4 font-semibold text-neutral-800">Họ và tên</th>
                    <th className="py-2.5 px-2 text-center w-16">Tổ</th>
                    <th className="py-2.5 px-3 text-center w-36">Trạng thái điểm danh</th>
                    <th className="py-2.5 px-4">Lý do / Ghi chú của giáo viên</th>
                    <th className="py-2.5 px-3 w-36">Liên hệ phụ huynh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {students.map((st) => {
                    const rec = recordMap.get(st.id);
                    const status: AttendanceStatus = rec ? rec.status : 'present';

                    return (
                      <tr
                        key={st.id}
                        className={`transition-colors ${
                          status === 'unexcused'
                            ? 'bg-rose-50/40'
                            : status === 'excused'
                            ? 'bg-amber-50/30'
                            : status === 'late'
                            ? 'bg-neutral-50'
                            : 'hover:bg-neutral-50/70'
                        }`}
                      >
                        <td className="py-2.5 px-3 text-center font-mono tabular-nums text-neutral-600">{st.rollNumber}</td>
                        <td className="py-2.5 px-3 font-mono tabular-nums text-neutral-500">{st.studentCode}</td>
                        <td className="py-2.5 px-4 font-semibold text-neutral-900">{st.fullName}</td>
                        <td className="py-2.5 px-2 text-center text-neutral-500">Tổ {st.team}</td>

                        {/* Status Toggle Button */}
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => handleToggleStatus(st.id, status)}
                            className={`w-full py-1 px-2.5 rounded-lg text-xs font-semibold transition-all inline-flex items-center justify-center gap-1.5 shadow-2xs ${
                              status === 'present'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                                : status === 'excused'
                                ? 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
                                : status === 'unexcused'
                                ? 'bg-rose-100 text-rose-900 border border-rose-300 hover:bg-rose-200'
                                : 'bg-neutral-200 text-neutral-800 border border-neutral-300 hover:bg-neutral-300'
                            }`}
                          >
                            {status === 'present' && <><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Có mặt</>}
                            {status === 'excused' && <><AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Có phép</>}
                            {status === 'unexcused' && <><XCircle className="w-3.5 h-3.5 text-rose-600" /> Không phép</>}
                            {status === 'late' && <><Clock className="w-3.5 h-3.5 text-neutral-600" /> Đi muộn</>}
                          </button>
                        </td>

                        {/* Note Input */}
                        <td className="py-2 px-4">
                          <input
                            type="text"
                            defaultValue={rec?.note || ''}
                            onBlur={(e) => handleUpdateNote(st.id, e.target.value)}
                            placeholder={status !== 'present' ? 'Nhập lý do vắng hoặc muộn...' : ''}
                            className="w-full text-xs px-2.5 py-1 rounded border border-transparent hover:border-neutral-300 focus:border-emerald-600 focus:bg-white focus:outline-none"
                          />
                        </td>

                        <td className="py-2.5 px-3 font-mono text-neutral-500 text-[11px]">
                          {st.fatherPhone || st.motherPhone || '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Summary View */}
      {activeTab === 'monthly_summary' && (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-neutral-200">
            <h2 className="text-sm font-bold text-neutral-900">
              Bảng tổng hợp chuyên cần học kỳ {classInfo.currentTerm}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Học sinh nghỉ quá 3 buổi học cần được giáo viên chủ nhiệm gặp gỡ và gửi giấy báo về cho phụ huynh.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-50/80 text-neutral-600 border-b border-neutral-200 font-medium">
                  <th className="py-2.5 px-3 w-12 text-center">STT</th>
                  <th className="py-2.5 px-4 font-semibold text-neutral-800">Họ và tên</th>
                  <th className="py-2.5 px-2 text-center w-16">Tổ</th>
                  <th className="py-2.5 px-3 text-center">Nghỉ có phép</th>
                  <th className="py-2.5 px-3 text-center">Nghỉ không phép</th>
                  <th className="py-2.5 px-3 text-center">Số lần đi muộn</th>
                  <th className="py-2.5 px-4 text-center font-bold">Tổng số buổi nghỉ</th>
                  <th className="py-2.5 px-4 text-left">Tình trạng chuyên cần</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {monthlyStats.map(({ student, excusedCount, unexcusedCount, lateCount, totalAbsences }) => (
                  <tr key={student.id} className="hover:bg-neutral-50/70">
                    <td className="py-2.5 px-3 text-center font-mono tabular-nums text-neutral-600">{student.rollNumber}</td>
                    <td className="py-2.5 px-4 font-semibold text-neutral-900">{student.fullName}</td>
                    <td className="py-2.5 px-2 text-center text-neutral-500">Tổ {student.team}</td>
                    <td className="py-2.5 px-3 text-center font-mono tabular-nums text-amber-700">{excusedCount}</td>
                    <td className="py-2.5 px-3 text-center font-mono tabular-nums text-rose-600 font-bold">{unexcusedCount}</td>
                    <td className="py-2.5 px-3 text-center font-mono tabular-nums text-neutral-600">{lateCount}</td>
                    <td className="py-2.5 px-4 text-center font-mono tabular-nums font-bold text-sm">
                      <span className={totalAbsences >= 3 ? 'text-rose-600' : 'text-neutral-900'}>
                        {totalAbsences}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      {totalAbsences >= 3 ? (
                        <span className="text-xs font-semibold text-rose-700 inline-flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Cảnh báo vắng nhiều
                        </span>
                      ) : totalAbsences > 0 ? (
                        <span className="text-neutral-600">Bình thường</span>
                      ) : (
                        <span className="text-emerald-700 font-medium">Chuyên cần 100%</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
