import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Award, 
  CalendarCheck, 
  Scale, 
  Grid2X2, 
  CalendarDays, 
  FileText,
  FileCheck2,
  BookOpenCheck
} from 'lucide-react';

export type TabType = 
  | 'dashboard' 
  | 'students' 
  | 'grades' 
  | 'attendance' 
  | 'discipline' 
  | 'seating' 
  | 'timetable' 
  | 'exam' 
  | 'lesson' 
  | 'reports';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  studentCount: number;
  todayAbsentCount: number;
  disciplineAlertCount: number;
  examCount: number;
  lessonCount: number;
  onOpenUserGuide?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  studentCount,
  todayAbsentCount,
  disciplineAlertCount,
  examCount,
  lessonCount,
  onOpenUserGuide,
}) => {
  const navItems = [
    {
      id: 'dashboard' as TabType,
      label: 'Tổng quan lớp',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'students' as TabType,
      label: 'Hồ sơ học sinh',
      icon: Users,
      badge: `${studentCount}`,
    },
    {
      id: 'grades' as TabType,
      label: 'Sổ điểm chi tiết',
      icon: Award,
      badge: null,
    },
    {
      id: 'exam' as TabType,
      label: 'Tạo đề & Thi trắc nghiệm',
      icon: FileCheck2,
      badge: `${examCount} đề`,
      badgeColor: 'bg-emerald-100 text-emerald-800 font-semibold',
    },
    {
      id: 'lesson' as TabType,
      label: 'Thiết kế bài dạy (CV 5512)',
      icon: BookOpenCheck,
      badge: `${lessonCount}`,
    },
    {
      id: 'attendance' as TabType,
      label: 'Điểm danh chuyên cần',
      icon: CalendarCheck,
      badge: todayAbsentCount > 0 ? `${todayAbsentCount} vắng` : null,
      badgeColor: todayAbsentCount > 0 ? 'text-amber-700 bg-amber-50' : '',
    },
    {
      id: 'discipline' as TabType,
      label: 'Nề nếp & Thi đua',
      icon: Scale,
      badge: disciplineAlertCount > 0 ? `${disciplineAlertCount}` : null,
      badgeColor: 'text-rose-700 bg-rose-50',
    },
    {
      id: 'seating' as TabType,
      label: 'Sơ đồ lớp học',
      icon: Grid2X2,
      badge: null,
    },
    {
      id: 'timetable' as TabType,
      label: 'Thời khóa biểu & Họp',
      icon: CalendarDays,
      badge: null,
    },
    {
      id: 'reports' as TabType,
      label: 'Phiếu liên lạc & Báo cáo',
      icon: FileText,
      badge: null,
    },
  ];

  return (
    <aside className="no-print w-full lg:w-64 bg-white lg:border-r border-neutral-200/80 shrink-0">
      <div className="p-3 lg:p-4 space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
          Chức năng sổ chủ nhiệm
        </div>

        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-emerald-700' : 'text-neutral-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[11px] px-1.5 py-0.5 rounded font-mono tabular-nums ${
                      item.badgeColor || 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="hidden lg:block px-4 py-3.5 mt-5 mx-3 rounded-xl bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/50 border border-emerald-200/80 text-xs">
        <div className="font-bold text-emerald-950 mb-1 flex items-center justify-between">
          <span>Tài liệu GVCN</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200 text-amber-950 font-bold">Word</span>
        </div>
        <p className="text-[11px] text-emerald-900/80 leading-relaxed mb-2.5">
          Cẩm nang hướng dẫn sử dụng chi tiết 10 chương & tải file Word (.doc) cho cô Lê Thị Hoài Bảo.
        </p>
        {onOpenUserGuide && (
          <button
            type="button"
            onClick={onOpenUserGuide}
            className="w-full py-1.5 px-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold text-xs transition-colors shadow-2xs flex items-center justify-center gap-1.5"
          >
            <BookOpenCheck className="w-3.5 h-3.5" />
            <span>Mở Hướng dẫn & Xuất Word</span>
          </button>
        )}
      </div>
    </aside>
  );
};
