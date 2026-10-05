import React, { useState } from 'react';
import { Student, Subject, StudentTermScores, SeatSlot } from '../types';
import { calculateSemesterAvg } from '../utils/gradeCalculations';
import { 
  Users2, 
  ArrowRight, 
  Award, 
  Sparkles, 
  Grid2X2, 
  Check, 
  X, 
  CheckCircle2, 
  TrendingUp 
} from 'lucide-react';

interface PeerPair {
  id: string;
  helper: Student;
  learner: Student;
  focusSubject: string;
  targetGoal: string;
}

interface PeerLearningModalProps {
  students: Student[];
  subjects: Subject[];
  scores: Record<string, StudentTermScores>;
  seats: SeatSlot[];
  onUpdateSeats: (seats: SeatSlot[]) => void;
  onClose: () => void;
}

export const PeerLearningModal: React.FC<PeerLearningModalProps> = ({
  students,
  subjects,
  scores,
  seats,
  onUpdateSeats,
  onClose,
}) => {
  const [notification, setNotification] = useState<string | null>(null);

  // Thuật toán tự động tìm và ghép cặp "Đôi bạn cùng tiến"
  const generatePairs = (): PeerPair[] => {
    // Phân loại học sinh theo ĐTB
    const studentWithAvg = students.map((s) => {
      const sc = scores[s.id];
      const { avg, subjectAverages } = calculateSemesterAvg(sc, subjects);
      return {
        student: s,
        avg: avg || 7.0,
        subjectAverages,
      };
    });

    const helpers = studentWithAvg.filter((s) => s.avg >= 8.2).sort((a, b) => b.avg - a.avg);
    const learners = studentWithAvg.filter((s) => s.avg < 7.0).sort((a, b) => a.avg - b.avg);

    const pairs: PeerPair[] = [];
    const minLen = Math.min(helpers.length, learners.length, 6);

    for (let i = 0; i < minLen; i++) {
      const h = helpers[i];
      const l = learners[i];
      // Tìm môn mà l thấp nhất nhưng h cao nhất
      let lowestSubName = 'Toán học';
      let lowestScore = 10;
      subjects.forEach((sub) => {
        const sc = l.subjectAverages[sub.id];
        if (sc !== null && sc !== undefined && sc < lowestScore) {
          lowestScore = sc;
          lowestSubName = sub.name;
        }
      });

      pairs.push({
        id: `pair-${i}`,
        helper: h.student,
        learner: l.student,
        focusSubject: lowestSubName,
        targetGoal: `Nâng điểm môn ${lowestSubName} từ ${lowestScore} lên ≥ 7.0`,
      });
    }

    return pairs;
  };

  const [pairs] = useState<PeerPair[]>(() => generatePairs());

  // Tự động xếp các cặp "Đôi bạn cùng tiến" ngồi cạnh nhau trên sơ đồ lớp
  const handleArrangeSeatsForPairs = () => {
    const updated = [...seats];
    let deskCount = 1;

    pairs.forEach((pair) => {
      // Tìm bàn thứ deskCount (bàn gồm seat left và seat right)
      const seatLeft = updated.find((s) => s.table === deskCount && s.seatPosition === 'left');
      const seatRight = updated.find((s) => s.table === deskCount && s.seatPosition === 'right');

      if (seatLeft && seatRight) {
        seatLeft.studentId = pair.helper.id;
        seatRight.studentId = pair.learner.id;
      }
      deskCount++;
    });

    onUpdateSeats(updated);
    setNotification('Đã xếp các cặp Đôi bạn cùng tiến ngồi chung bàn trên Sơ đồ lớp học!');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-neutral-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users2 className="w-5 h-5 text-emerald-700" />
            <div>
              <h2 className="text-sm font-bold text-neutral-900">
                Mô hình "Đôi bạn cùng tiến" (Peer Learning)
              </h2>
              <div className="text-[11px] text-neutral-500">
                Tự động ghép học sinh Giỏi kèm học sinh Cần hỗ trợ và xếp ngồi cùng bàn
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {notification && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{notification}</span>
            </div>
          )}

          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-neutral-700 flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-emerald-950">Ghép đôi dựa trên phổ điểm thực tế</div>
              <div className="text-[11px] text-neutral-600 mt-0.5">
                Đã lập danh sách {pairs.length} cặp học sinh hỗ trợ lẫn nhau trong học kỳ này.
              </div>
            </div>

            <button
              onClick={handleArrangeSeatsForPairs}
              className="px-3.5 py-2 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-colors shadow-2xs inline-flex items-center gap-1.5 shrink-0"
            >
              <Grid2X2 className="w-3.5 h-3.5" />
              <span>Xếp chung bàn trên sơ đồ</span>
            </button>
          </div>

          <div className="space-y-3">
            {pairs.map((pair, idx) => (
              <div
                key={pair.id}
                className="p-3.5 rounded-xl border border-neutral-200 bg-white hover:border-emerald-300 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                    Cặp đôi #{idx + 1}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-800">
                    Trọng tâm: Môn {pair.focusSubject}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                      {pair.helper.rollNumber}
                    </div>
                    <div>
                      <div className="font-bold text-neutral-900">{pair.helper.fullName}</div>
                      <div className="text-[10px] text-emerald-800 font-medium">Bạn hướng dẫn (Mentor)</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-100 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                      {pair.learner.rollNumber}
                    </div>
                    <div>
                      <div className="font-bold text-neutral-900">{pair.learner.fullName}</div>
                      <div className="text-[10px] text-amber-800 font-medium">Bạn được hỗ trợ (Mentee)</div>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-neutral-500 italic pt-1 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Mục tiêu phấn đấu: {pair.targetGoal}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-neutral-700 font-medium rounded-lg hover:bg-neutral-100"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
