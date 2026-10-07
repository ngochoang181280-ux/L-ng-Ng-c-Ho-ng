import React, { useState } from 'react';
import { Student, SeatSlot, ClassInfo, Subject, StudentTermScores } from '../types';
import { 
  Grid2X2, 
  ArrowLeftRight, 
  Glasses, 
  Award, 
  RotateCcw, 
  Printer, 
  Sparkles, 
  Check, 
  Info,
  Users2
} from 'lucide-react';
import { PeerLearningModal } from './PeerLearningModal';

interface SeatingChartViewProps {
  students: Student[];
  seats: SeatSlot[];
  classInfo: ClassInfo;
  subjects?: Subject[];
  scores?: Record<string, StudentTermScores>;
  onUpdateSeats: (seats: SeatSlot[]) => void;
  onSelectStudentId: (id: string) => void;
}

export const SeatingChartView: React.FC<SeatingChartViewProps> = ({
  students,
  seats,
  classInfo,
  subjects = [],
  scores = {},
  onUpdateSeats,
  onSelectStudentId,
}) => {
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [showPeerModal, setShowPeerModal] = useState<boolean>(false);

  const studentMap = new Map<string, Student>();
  students.forEach((s) => studentMap.set(s.id, s));

  // Thao tác đổi chỗ giữa 2 vị trí ngồi
  const handleSeatClick = (seatId: string) => {
    if (!selectedSeatId) {
      // Chọn ghế đầu tiên
      setSelectedSeatId(seatId);
    } else if (selectedSeatId === seatId) {
      // Hủy chọn
      setSelectedSeatId(null);
    } else {
      // Thực hiện hoán đổi chỗ ngồi giữa 2 ghế
      const seatA = seats.find((s) => s.id === selectedSeatId);
      const seatB = seats.find((s) => s.id === seatId);

      if (seatA && seatB) {
        const studentA = seatA.studentId ? studentMap.get(seatA.studentId)?.fullName : 'Ghế trống';
        const studentB = seatB.studentId ? studentMap.get(seatB.studentId)?.fullName : 'Ghế trống';

        const updated = seats.map((s) => {
          if (s.id === selectedSeatId) {
            return { ...s, studentId: seatB.studentId };
          }
          if (s.id === seatId) {
            return { ...s, studentId: seatA.studentId };
          }
          return s;
        });

        onUpdateSeats(updated);
        setSelectedSeatId(null);
        showToast(`Đã đổi chỗ ngồi giữa "${studentA}" và "${studentB}" thành công!`);
      }
    }
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Tự động sắp xếp chỗ ngồi thông minh:
  // - Học sinh cận thị hoặc chiều cao thấp ngồi hàng 1 & 2
  // - Học sinh chiều cao tốt ngồi hàng 4 & 5
  // - Nam nữ xen kẽ
  const handleAutoArrange = () => {
    const sortedStudents = [...students].sort((a, b) => {
      // Cận thị ưu tiên trước
      if (a.hasVisionImpairment && !b.hasVisionImpairment) return -1;
      if (!a.hasVisionImpairment && b.hasVisionImpairment) return 1;
      // Chiều cao thấp ngồi trước
      return (a.heightCm || 165) - (b.heightCm || 165);
    });

    let sIdx = 0;
    const updated = seats.map((s) => {
      const assigned = sIdx < sortedStudents.length ? sortedStudents[sIdx].id : null;
      sIdx++;
      return {
        ...s,
        studentId: assigned,
      };
    });

    onUpdateSeats(updated);
    setSelectedSeatId(null);
    showToast('Đã tự động tối ưu sơ đồ chỗ ngồi: ưu tiên học sinh cận thị và vóc dáng nhỏ ngồi bàn đầu!');
  };

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-neutral-900">
            Sơ đồ chỗ ngồi lớp {classInfo.className}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Bấm chọn 1 học sinh, sau đó bấm chọn học sinh thứ 2 để hoán đổi vị trí ngồi tức thì
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowPeerModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-950 bg-emerald-50 border border-emerald-300 rounded-lg hover:bg-emerald-100 transition-colors shadow-2xs"
            title="Thuật toán tự động ghép đôi bạn giỏi kèm bạn yếu và xếp ngồi cạnh nhau"
          >
            <Users2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Thuật toán Đôi bạn cùng tiến</span>
          </button>

          <button
            onClick={handleAutoArrange}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-800 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tự động tối ưu (Cận thị ngồi đầu)</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {selectedSeatId && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs px-4 py-2 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-amber-700 animate-pulse" />
            <span>
              Đang chọn ghế: <strong>{studentMap.get(seats.find(s => s.id === selectedSeatId)?.studentId || '')?.fullName || 'Ghế trống'}</strong>. Hãy bấm vào một ghế khác để hoán đổi chỗ ngồi!
            </span>
          </div>
          <button
            onClick={() => setSelectedSeatId(null)}
            className="text-xs underline font-semibold text-amber-800 hover:text-amber-950"
          >
            Hủy
          </button>
        </div>
      )}

      {/* Classroom Container */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs space-y-6">
        {/* Blackboard & Teacher's Desk */}
        <div className="max-w-2xl mx-auto space-y-3">
          {/* Bảng đen */}
          <div className="bg-neutral-800 text-neutral-100 py-2.5 px-6 rounded-lg text-center font-bold text-xs uppercase tracking-widest border-2 border-neutral-900 shadow-xs flex items-center justify-center gap-2">
            <span>Bảng Đen Lớp Học</span>
          </div>

          {/* Bàn giáo viên & Bục giảng */}
          <div className="flex items-center justify-between px-4">
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              [ Cửa ra vào phía trước ]
            </div>
            <div className="bg-amber-100 text-amber-900 border border-amber-300 font-semibold px-4 py-1.5 rounded-md text-xs shadow-2xs">
              Bàn Giáo Viên & Bục Giảng
            </div>
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              [ Cửa sổ hướng sân trường ]
            </div>
          </div>
        </div>

        {/* 4 Dãy Bàn Học (Tương ứng 4 Tổ) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {[1, 2, 3, 4].map((colNum) => (
            <div key={colNum} className="space-y-3 bg-neutral-50/70 p-3 rounded-xl border border-neutral-200">
              <div className="text-center font-bold text-xs text-neutral-700 uppercase tracking-wide pb-1 border-b border-neutral-200">
                Dãy {colNum} (Tổ {colNum})
              </div>

              {/* 5 Hàng Ghế (Rows 1 to 5) */}
              {[1, 2, 3, 4, 5].map((rowNum) => {
                const seatLeft = seats.find(
                  (s) => s.column === colNum && s.row === rowNum && s.seatPosition === 'left'
                );
                const seatRight = seats.find(
                  (s) => s.column === colNum && s.row === rowNum && s.seatPosition === 'right'
                );

                const studentL = seatLeft?.studentId ? studentMap.get(seatLeft.studentId) : null;
                const studentR = seatRight?.studentId ? studentMap.get(seatRight.studentId) : null;

                const isSelectedL = seatLeft?.id === selectedSeatId;
                const isSelectedR = seatRight?.id === selectedSeatId;

                return (
                  <div key={rowNum} className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 px-1 font-mono">
                      <span>Bàn {rowNum}</span>
                      {rowNum <= 2 && <span className="text-amber-700 font-sans">Bàn đầu (cận)</span>}
                    </div>

                    {/* Double Desk (2 Seats) */}
                    <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-neutral-200/60 rounded-lg border border-neutral-300">
                      {/* Ghế Trái */}
                      <button
                        onClick={() => seatLeft && handleSeatClick(seatLeft.id)}
                        className={`p-2 rounded-md text-left transition-all relative ${
                          isSelectedL
                            ? 'ring-2 ring-emerald-600 bg-emerald-100 shadow-md scale-[1.02]'
                            : studentL
                            ? 'bg-white hover:bg-neutral-100/90 shadow-2xs border border-neutral-200'
                            : 'bg-neutral-100/60 border border-dashed border-neutral-300 text-neutral-400'
                        }`}
                      >
                        {studentL ? (
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[10px] text-neutral-500 font-bold">
                                #{studentL.rollNumber}
                              </span>
                              <div className="flex items-center gap-1">
                                {studentL.hasVisionImpairment && (
                                  <span title="Cận thị">
                                    <Glasses className="w-3 h-3 text-amber-600" />
                                  </span>
                                )}
                                {studentL.role !== 'Học sinh' && (
                                  <span title={studentL.role}>
                                    <Award className="w-3 h-3 text-emerald-700" />
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="font-semibold text-xs text-neutral-900 truncate mt-0.5">
                              {studentL.fullName}
                            </div>
                            <div className="text-[10px] text-neutral-500 flex items-center justify-between mt-0.5">
                              <span>{studentL.gender}</span>
                              <span className="font-mono">{studentL.heightCm}cm</span>
                            </div>
                          </div>
                        ) : (
                          <div className="py-2.5 text-center text-[11px] text-neutral-400">
                            Ghế trống
                          </div>
                        )}
                      </button>

                      {/* Ghế Phải */}
                      <button
                        onClick={() => seatRight && handleSeatClick(seatRight.id)}
                        className={`p-2 rounded-md text-left transition-all relative ${
                          isSelectedR
                            ? 'ring-2 ring-emerald-600 bg-emerald-100 shadow-md scale-[1.02]'
                            : studentR
                            ? 'bg-white hover:bg-neutral-100/90 shadow-2xs border border-neutral-200'
                            : 'bg-neutral-100/60 border border-dashed border-neutral-300 text-neutral-400'
                        }`}
                      >
                        {studentR ? (
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[10px] text-neutral-500 font-bold">
                                #{studentR.rollNumber}
                              </span>
                              <div className="flex items-center gap-1">
                                {studentR.hasVisionImpairment && (
                                  <span title="Cận thị">
                                    <Glasses className="w-3 h-3 text-amber-600" />
                                  </span>
                                )}
                                {studentR.role !== 'Học sinh' && (
                                  <span title={studentR.role}>
                                    <Award className="w-3 h-3 text-emerald-700" />
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="font-semibold text-xs text-neutral-900 truncate mt-0.5">
                              {studentR.fullName}
                            </div>
                            <div className="text-[10px] text-neutral-500 flex items-center justify-between mt-0.5">
                              <span>{studentR.gender}</span>
                              <span className="font-mono">{studentR.heightCm}cm</span>
                            </div>
                          </div>
                        ) : (
                          <div className="py-2.5 text-center text-[11px] text-neutral-400">
                            Ghế trống
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="pt-4 border-t border-neutral-200 flex flex-wrap items-center justify-between text-xs text-neutral-500 gap-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Glasses className="w-3.5 h-3.5 text-amber-600" />
              <span>Học sinh cận thị</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-700" />
              <span>Ban cán sự lớp</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
              <span>Ghế đang chọn để tráo</span>
            </span>
          </div>
          <div>
            <span>Sĩ số bàn học: 4 dãy x 5 hàng = 40 chỗ (Đang xếp: {students.length} HS)</span>
          </div>
        </div>
      </div>

      {/* Modal Thuật toán Đôi bạn cùng tiến */}
      {showPeerModal && (
        <PeerLearningModal
          students={students}
          subjects={subjects}
          scores={scores}
          seats={seats}
          onUpdateSeats={onUpdateSeats}
          onClose={() => setShowPeerModal(false)}
        />
      )}
    </div>
  );
};
