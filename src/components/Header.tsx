import React from 'react';
import { ClassInfo, TermType } from '../types';
import { GraduationCap, Printer, Database, Settings, Calendar, UserCheck, MonitorPlay, LogOut, User, BookOpen } from 'lucide-react';

interface HeaderProps {
  classInfo: ClassInfo;
  onUpdateTerm: (term: TermType) => void;
  onOpenSettings: () => void;
  onOpenBackup: () => void;
  onOpenPrintReport: () => void;
  onOpenStudentPortal?: () => void;
  onOpenUserGuide?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  classInfo,
  onUpdateTerm,
  onOpenSettings,
  onOpenBackup,
  onOpenPrintReport,
  onOpenStudentPortal,
  onOpenUserGuide,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-neutral-200/80 shadow-xs backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Wordmark & Class identifier */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-neutral-900">
                  Sổ Chủ Nhiệm Điện Tử
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                  Lớp {classInfo.className}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span>{classInfo.schoolName}</span>
                <span aria-hidden="true">·</span>
                <span>Năm học {classInfo.academicYear}</span>
                <span aria-hidden="true">·</span>
                <span className="hidden sm:inline font-medium text-neutral-700">{classInfo.homeroomTeacher}</span>
              </div>
            </div>
          </div>

          {/* Zone 2: Semester switcher */}
          <div className="hidden md:flex items-center bg-neutral-100 p-1 rounded-lg border border-neutral-200">
            <button
              onClick={() => onUpdateTerm('HK1')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                classInfo.currentTerm === 'HK1'
                  ? 'bg-white text-emerald-900 font-semibold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Học kỳ 1
            </button>
            <button
              onClick={() => onUpdateTerm('HK2')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                classInfo.currentTerm === 'HK2'
                  ? 'bg-white text-emerald-900 font-semibold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Học kỳ 2
            </button>
          </div>

          {/* Zone 3: Quick Action Buttons */}
          <div className="flex items-center gap-2">
            {onOpenStudentPortal && (
              <button
                onClick={onOpenStudentPortal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-50 border border-emerald-300 rounded-lg hover:bg-emerald-100 transition-colors shadow-2xs"
                title="Mở giao diện Cổng thi trực tuyến dành cho Học sinh"
              >
                <MonitorPlay className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden sm:inline">Cổng thi học sinh</span>
              </button>
            )}

            <button
              onClick={onOpenPrintReport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 hover:text-neutral-900 transition-colors shadow-2xs"
              title="In phiếu liên lạc học sinh hoặc báo cáo lớp"
            >
              <Printer className="w-3.5 h-3.5 text-neutral-500" />
              <span className="hidden sm:inline">In & Xuất báo cáo</span>
            </button>

            <button
              onClick={onOpenBackup}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 hover:text-neutral-900 transition-colors shadow-2xs"
              title="Sao lưu / Phục hồi dữ liệu sổ chủ nhiệm"
            >
              <Database className="w-3.5 h-3.5 text-neutral-500" />
              <span className="hidden lg:inline">Sao lưu dữ liệu</span>
            </button>

            {onOpenUserGuide && (
              <button
                onClick={onOpenUserGuide}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-950 bg-amber-100/80 border border-amber-300 rounded-lg hover:bg-amber-200/70 transition-colors shadow-2xs"
                title="Xem Hướng dẫn sử dụng & Xuất file Word"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-800" />
                <span className="hidden sm:inline">Hướng dẫn & Xuất Word</span>
              </button>
            )}

            <button
              onClick={onOpenSettings}
              className="p-2 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
              title="Cài đặt thông tin lớp chủ nhiệm"
            >
              <Settings className="w-4 h-4" />
            </button>

            {onLogout && (
              <div className="flex items-center gap-1.5 pl-1 border-l border-neutral-200">
                <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-900">
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Cô Hoài Bảo</span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-neutral-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Đăng xuất khỏi Sổ chủ nhiệm"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
