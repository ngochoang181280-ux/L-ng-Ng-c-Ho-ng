import React from 'react';
import { 
  AppState 
} from '../utils/storage';
import { 
  calculateSemesterAvg, 
  evaluateAcademicPerformance, 
  getHonorTitle 
} from '../utils/gradeCalculations';
import { 
  Users, 
  UserCheck, 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  Cake, 
  Calendar, 
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { TabType } from './Sidebar';

interface DashboardViewProps {
  appState: AppState;
  onNavigateTab: (tab: TabType) => void;
  onSelectStudentId: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  appState,
  onNavigateTab,
  onSelectStudentId,
}) => {
  const { students, subjects, scores, attendance, discipline, classInfo } = appState;

  // 1. Sĩ số & Giới tính
  const totalStudents = students.length;
  const maleCount = students.filter(s => s.gender === 'Nam').length;
  const femaleCount = students.filter(s => s.gender === 'Nữ').length;
  const visionImpairedCount = students.filter(s => s.hasVisionImpairment).length;

  // 2. Chuyên cần hôm nay
  const todayStr = '2025-03-24'; // Ngày hiện tại mô phỏng
  const todayAttendance = attendance.filter(a => a.date === todayStr);
  const excusedToday = todayAttendance.filter(a => a.status === 'excused');
  const unexcusedToday = todayAttendance.filter(a => a.status === 'unexcused');
  const lateToday = todayAttendance.filter(a => a.status === 'late');
  const presentCount = totalStudents - excusedToday.length - unexcusedToday.length;
  const attendanceRate = totalStudents > 0 
    ? Math.round((presentCount / totalStudents) * 100) 
    : 100;

  // 3. Phân phối học lực dự kiến
  const academicCounts = {
    'Xuất sắc': 0,
    'Giỏi': 0,
    'Khá': 0,
    'Đạt': 0,
    'Chưa đạt': 0,
  };

  const studentAvgs: { studentId: string; avg: number; rating: string; minSub: { name: string; score: number } | null }[] = [];

  students.forEach(st => {
    const termScore = scores[st.id];
    const { avg, minSubject, subjectAverages } = calculateSemesterAvg(termScore, subjects);
    const rating = evaluateAcademicPerformance(avg, subjectAverages, subjects);
    if (avg !== null) {
      academicCounts[rating]++;
      studentAvgs.push({
        studentId: st.id,
        avg,
        rating,
        minSub: minSubject,
      });
    }
  });

  // 4. Học sinh cần quan tâm (Điểm yếu < 5.0, nghỉ học >= 2 lần, hoặc vi phạm chưa giải quyết)
  const studentsNeedingAttention: {
    student: (typeof students)[0];
    reason: string;
    type: 'grade' | 'attendance' | 'discipline';
  }[] = [];

  students.forEach(s => {
    // Kiểm tra điểm thấp
    const termScore = scores[s.id];
    const { minSubject } = calculateSemesterAvg(termScore, subjects);
    if (minSubject && minSubject.score < 5.0) {
      studentsNeedingAttention.push({
        student: s,
        reason: `Điểm môn ${minSubject.name} đạt ${minSubject.score} (dưới 5.0)`,
        type: 'grade',
      });
    }

    // Kiểm tra vắng
    const studentAbsences = attendance.filter(a => a.studentId === s.id && (a.status === 'excused' || a.status === 'unexcused'));
    if (studentAbsences.length >= 2) {
      studentsNeedingAttention.push({
        student: s,
        reason: `Vắng ${studentAbsences.length} buổi học trong tháng`,
        type: 'attendance',
      });
    }

    // Kiểm tra kỷ luật cần gặp PH
    const disc = discipline.find(d => d.studentId === s.id && d.status === 'Cần liên hệ PH');
    if (disc) {
      studentsNeedingAttention.push({
        student: s,
        reason: `Nề nếp: ${disc.content}`,
        type: 'discipline',
      });
    }
  });

  // Lọc trùng học sinh trong danh sách cần quan tâm
  const uniqueNeedingAttention = Array.from(
    new Map(studentsNeedingAttention.map(item => [item.student.id, item])).values()
  ).slice(0, 5);

  // 5. Sinh nhật trong tháng 3
  const marchBirthdays = students.filter(s => {
    const month = s.dob.split('-')[1];
    return month === '03';
  });

  // 6. Ban cán sự lớp
  const classOfficers = students.filter(s => s.role !== 'Học sinh');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <span>Không gian quản lý lớp học</span>
            <span aria-hidden="true">·</span>
            <span>Học kỳ {classInfo.currentTerm === 'HK1' ? 'I' : 'II'} ({classInfo.academicYear})</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            Xin chào {classInfo.homeroomTeacher}!
          </h1>
          <p className="text-sm text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
            Hôm nay là Thứ Hai, ngày 24/03/2025. Lớp {classInfo.className} có <strong>{presentCount}/{totalStudents}</strong> học sinh có mặt. Bạn có 1 kế hoạch sinh hoạt tuần 28 cần duyệt.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigateTab('exam')}
            className="px-3.5 py-2 text-xs font-semibold bg-white text-emerald-950 rounded-lg hover:bg-emerald-50 transition-colors shadow-xs"
          >
            Tạo đề trắc nghiệm
          </button>
          <button
            onClick={() => onNavigateTab('lesson')}
            className="px-3.5 py-2 text-xs font-semibold bg-emerald-700/90 text-white border border-emerald-500/40 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Giáo án CV 5512
          </button>
          <button
            onClick={() => onNavigateTab('grades')}
            className="px-3.5 py-2 text-xs font-semibold bg-emerald-800/80 text-emerald-100 border border-emerald-600/30 rounded-lg hover:bg-emerald-800 transition-colors"
          >
            Nhập điểm môn
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Sĩ số */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Sĩ số lớp</span>
            <div className="p-2 rounded-lg bg-neutral-100 text-neutral-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-neutral-900 tabular-nums">
              {totalStudents}
            </span>
            <span className="text-xs text-neutral-500">học sinh</span>
          </div>
          <div className="mt-2 text-xs text-neutral-500 flex items-center gap-2">
            <span>Nam: {maleCount}</span>
            <span aria-hidden="true">·</span>
            <span>Nữ: {femaleCount}</span>
            <span aria-hidden="true">·</span>
            <span>Cận thị: {visionImpairedCount}</span>
          </div>
        </div>

        {/* Card 2: Chuyên cần hôm nay */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Chuyên cần hôm nay</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-emerald-700 tabular-nums">
              {attendanceRate}%
            </span>
            <span className="text-xs text-emerald-700/80 font-medium">({presentCount}/{totalStudents} có mặt)</span>
          </div>
          <div className="mt-2 text-xs text-neutral-500 flex items-center gap-2">
            <span className="text-amber-700">{excusedToday.length} có phép</span>
            <span aria-hidden="true">·</span>
            <span className="text-rose-700">{unexcusedToday.length} không phép</span>
            <span aria-hidden="true">·</span>
            <span className="text-neutral-600">{lateToday.length} muộn</span>
          </div>
        </div>

        {/* Card 3: Dự kiến Học lực Tốt/Khá */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Tỷ lệ Tốt / Giỏi</span>
            <div className="p-2 rounded-lg bg-sky-50 text-sky-700">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-neutral-900 tabular-nums">
              {Math.round(((academicCounts['Xuất sắc'] + academicCounts['Giỏi']) / (totalStudents || 1)) * 100)}%
            </span>
            <span className="text-xs text-neutral-500">
              ({academicCounts['Xuất sắc'] + academicCounts['Giỏi']} HS)
            </span>
          </div>
          <div className="mt-2 text-xs text-neutral-500 flex items-center gap-2">
            <span>Khá: {academicCounts['Khá']}</span>
            <span aria-hidden="true">·</span>
            <span>Đạt: {academicCounts['Đạt']}</span>
            <span aria-hidden="true">·</span>
            <span className="text-rose-600 font-medium">Chưa đạt: {academicCounts['Chưa đạt']}</span>
          </div>
        </div>

        {/* Card 4: Thi đua tuần */}
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Thi đua tuần này</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-neutral-900 tabular-nums">
              Hạng 2
            </span>
            <span className="text-xs text-neutral-500">/ 12 lớp khối 10</span>
          </div>
          <div className="mt-2 text-xs text-neutral-500 flex items-center gap-2">
            <span className="font-semibold text-emerald-700">96.5 điểm thi đua</span>
            <span aria-hidden="true">·</span>
            <span>+2 điểm tuần trước</span>
          </div>
        </div>
      </div>

      {/* Middle Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Phân phối học lực & Cảnh báo */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cảnh báo học sinh cần quan tâm */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h2 className="text-sm font-bold text-neutral-900">
                  Học sinh cần quan tâm & đôn đốc ({uniqueNeedingAttention.length})
                </h2>
              </div>
              <button
                onClick={() => onNavigateTab('students')}
                className="text-xs text-emerald-700 font-medium hover:underline inline-flex items-center gap-1"
              >
                Xem toàn bộ
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {uniqueNeedingAttention.length === 0 ? (
              <div className="py-8 text-center text-xs text-neutral-500">
                Lớp duy trì nề nếp và học lực ổn định, chưa có học sinh bị cảnh báo.
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {uniqueNeedingAttention.map(({ student, reason, type }) => (
                  <div
                    key={student.id}
                    onClick={() => onSelectStudentId(student.id)}
                    className="py-3 flex items-center justify-between hover:bg-neutral-50 rounded-lg px-2 -mx-2 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-700 font-semibold text-xs flex items-center justify-center">
                        {student.rollNumber}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-neutral-900 flex items-center gap-2">
                          <span>{student.fullName}</span>
                          <span className="text-[11px] font-normal text-neutral-500">Tổ {student.team}</span>
                        </div>
                        <div className="text-[11px] text-neutral-600 mt-0.5">{reason}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-neutral-500 hidden sm:inline">
                        PH: {student.fatherPhone || student.motherPhone}
                      </span>
                      <button className="text-xs text-emerald-700 font-medium hover:text-emerald-800">
                        Chi tiết
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Phổ điểm học kỳ theo phân loại */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-neutral-900">
                Dự báo kết quả học tập ({classInfo.currentTerm})
              </h2>
              <span className="text-xs text-neutral-500">
                Theo Thông tư 22/2021/TT-BGDĐT
              </span>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Xuất sắc', count: academicCounts['Xuất sắc'], color: 'bg-emerald-600', text: 'text-emerald-800' },
                { label: 'Giỏi', count: academicCounts['Giỏi'], color: 'bg-teal-500', text: 'text-teal-800' },
                { label: 'Khá', count: academicCounts['Khá'], color: 'bg-sky-500', text: 'text-sky-800' },
                { label: 'Đạt', count: academicCounts['Đạt'], color: 'bg-amber-500', text: 'text-amber-800' },
                { label: 'Chưa đạt', count: academicCounts['Chưa đạt'], color: 'bg-rose-500', text: 'text-rose-800' },
              ].map((tier) => {
                const percent = totalStudents > 0 ? Math.round((tier.count / totalStudents) * 100) : 0;
                return (
                  <div key={tier.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-neutral-700">{tier.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-900 tabular-nums">{tier.count} HS</span>
                        <span className="text-neutral-400 tabular-nums">({percent}%)</span>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${tier.color} rounded-full transition-all duration-500`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-xs text-neutral-500">
                Tổng số học sinh đã hoàn thành bài kiểm tra định kỳ: {totalStudents}/{totalStudents}
              </span>
              <button
                onClick={() => onNavigateTab('grades')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Mở sổ điểm chi tiết &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Cán sự lớp & Sinh nhật & Kế hoạch */}
        <div className="space-y-6">
          {/* Ban cán sự lớp */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-2xs">
            <h2 className="text-sm font-bold text-neutral-900 mb-3">
              Ban cán sự lớp 10A1
            </h2>
            <div className="space-y-2.5">
              {classOfficers.slice(0, 6).map((officer) => (
                <div
                  key={officer.id}
                  onClick={() => onSelectStudentId(officer.id)}
                  className="flex items-center justify-between py-1.5 px-2 hover:bg-neutral-50 rounded-lg cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center justify-center">
                      {officer.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-neutral-900">{officer.fullName}</div>
                      <div className="text-[11px] text-neutral-500">{officer.role}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400">
                    {officer.fatherPhone || officer.motherPhone}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sinh nhật học sinh trong tháng */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-2xs">
            <div className="flex items-center gap-2 mb-3">
              <Cake className="w-4 h-4 text-rose-500" />
              <h2 className="text-sm font-bold text-neutral-900">
                Sinh nhật trong Tháng 3 ({marchBirthdays.length})
              </h2>
            </div>
            {marchBirthdays.length === 0 ? (
              <p className="text-xs text-neutral-500">Không có sinh nhật học sinh trong tháng 3.</p>
            ) : (
              <div className="space-y-2">
                {marchBirthdays.map((b) => {
                  const day = b.dob.split('-')[2];
                  return (
                    <div
                      key={b.id}
                      onClick={() => onSelectStudentId(b.id)}
                      className="flex items-center justify-between py-1.5 px-2 hover:bg-neutral-50 rounded-lg cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-semibold font-mono text-[11px]">
                          {day}/03
                        </span>
                        <span className="font-medium text-neutral-800">{b.fullName}</span>
                      </div>
                      <span className="text-[11px] text-neutral-400">Tổ {b.team}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Kế hoạch tuần này */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-2xs">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <h2 className="text-sm font-bold text-neutral-900">
                Trọng tâm tuần 28
              </h2>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              • Chào mừng 26/3, tham gia giải kéo co và bóng đá cấp trường.<br />
              • Kiểm tra định kỳ giữa kỳ 2 các môn Toán, Văn, Anh.<br />
              • Họp ban cán sự lớp thứ 5 đánh giá phong trào học tập.
            </p>
            <button
              onClick={() => onNavigateTab('timetable')}
              className="mt-3 text-xs font-semibold text-emerald-700 hover:underline inline-flex items-center gap-1"
            >
              Xem thời khóa biểu & sổ họp
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
