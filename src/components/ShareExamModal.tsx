import React, { useState } from 'react';
import { ExamPaper } from '../types';
import { 
  X, 
  Copy, 
  Check, 
  QrCode, 
  ExternalLink, 
  ShieldCheck, 
  Share2, 
  KeyRound, 
  Users, 
  Monitor, 
  Smartphone 
} from 'lucide-react';

interface ShareExamModalProps {
  exam: ExamPaper;
  classRoomPin?: string;
  onClose: () => void;
  onOpenOnlineExam: (exam: ExamPaper) => void;
}

export const ShareExamModal: React.FC<ShareExamModalProps> = ({
  exam,
  classRoomPin = '2025',
  onClose,
  onOpenOnlineExam,
}) => {
  const [pin, setPin] = useState(classRoomPin);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedGuide, setCopiedGuide] = useState(false);

  // Xây dựng link phòng thi thực tế của ứng dụng
  const baseUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  const examShareUrl = `${baseUrl}?mode=exam&examId=${exam.id}${pin ? `&pin=${pin}` : ''}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(examShareUrl)}&margin=10`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(examShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyGuide = () => {
    const guideText = `📢 THÔNG BÁO LÀM BÀI KIỂM TRA TRỰC TUYẾN
📝 Bài thi: ${exam.header.examTitle} - Môn: ${exam.header.subjectName}
⏱️ Thời gian: ${exam.header.durationMinutes} phút (${exam.questions.length} câu trắc nghiệm)
🔑 Mã đề: ${exam.header.examCode}
🔐 Mã PIN phòng thi: ${pin}

👉 Học sinh bấm vào link sau để vào phòng thi:
${examShareUrl}

📌 Lưu ý phòng thi:
- Học sinh nhập đúng Mã học sinh / Số báo danh để hệ thống ghi điểm.
- Bài thi có tính năng giám sát màn hình chống gian lận. Vui lòng không chuyển tab hoặc thoát ứng dụng trong lúc làm bài!`;

    navigator.clipboard.writeText(guideText);
    setCopiedGuide(true);
    setTimeout(() => setCopiedGuide(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-neutral-200 space-y-6 animate-in zoom-in-95 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-2xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                Chia sẻ link phòng thi cho Học sinh
              </h2>
              <p className="text-xs text-neutral-500">
                Học sinh quét mã QR hoặc bấm link để vào làm bài trực tuyến
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thông tin bài thi & Mã PIN */}
        <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="font-bold text-neutral-900 text-sm">{exam.header.examTitle}</div>
              <div className="text-neutral-500 mt-0.5">
                Môn: <strong>{exam.header.subjectName}</strong> · Mã đề: <strong>{exam.header.examCode}</strong> · {exam.header.durationMinutes} phút · {exam.questions.length} câu
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-700">Mã PIN phòng:</span>
              <div className="flex items-center gap-1 bg-white border border-neutral-300 rounded-lg px-2.5 py-1">
                <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                <input
                  type="text"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Để trống nếu không đặt"
                  className="font-mono font-bold text-neutral-900 w-20 text-center focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* QR Code & Link làm bài */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Cột QR Code (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-white rounded-xl border-2 border-dashed border-emerald-300 text-center space-y-3">
            <div className="p-2 bg-white rounded-lg shadow-xs border border-neutral-200">
              <img
                src={qrCodeUrl}
                alt="Mã QR phòng thi"
                className="w-44 h-44 object-contain"
              />
            </div>
            <div className="text-[11px] text-neutral-600 font-medium">
              <Smartphone className="w-3.5 h-3.5 inline mr-1 text-emerald-700" />
              Chiếu lên bảng cho học sinh quét điện thoại/iPad
            </div>
          </div>

          {/* Cột Hướng dẫn & Nút copy link (7 cols) */}
          <div className="md:col-span-7 space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1.5">
                Đường link phòng thi trực tuyến:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={examShareUrl}
                  className="flex-1 p-2.5 bg-neutral-100 border border-neutral-300 rounded-lg text-neutral-700 font-mono text-[11px] truncate select-all"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-3.5 py-2.5 font-semibold rounded-lg text-xs transition-colors shrink-0 inline-flex items-center gap-1.5 ${
                    copiedLink
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs'
                  }`}
                >
                  {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Đã sao chép!' : 'Sao chép link'}</span>
                </button>
              </div>
            </div>

            {/* Quy trình đăng nhập của học sinh */}
            <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 space-y-2">
              <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Học sinh đăng nhập và làm bài như thế nào?
              </div>
              <ol className="list-decimal list-inside space-y-1 text-neutral-700 text-[11px] leading-relaxed">
                <li>Học sinh bấm vào <strong>đường link</strong> hoặc <strong>quét mã QR</strong>.</li>
                <li>Nhập <strong>Mã học sinh / Số báo danh</strong> (hoặc chọn tên mình trong danh sách lớp).</li>
                <li>Nhập <strong>Mã PIN phòng thi</strong>: <span className="font-mono font-bold text-emerald-800 bg-white px-1.5 py-0.5 rounded border border-emerald-300">{pin || 'Không cần'}</span>.</li>
                <li>Bấm <strong>Bắt đầu làm bài</strong>. Khi nộp, điểm và biên bản giám sát sẽ tự động gửi về sổ điểm của thầy cô!</li>
              </ol>
            </div>

            {/* Nút gửi qua Zalo / Nhóm lớp */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleCopyGuide}
                className="flex-1 py-2 px-3 border border-neutral-300 text-neutral-800 font-semibold rounded-lg hover:bg-neutral-100 transition-colors text-xs inline-flex items-center justify-center gap-1.5"
              >
                {copiedGuide ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedGuide ? 'Đã copy thông báo!' : 'Sao chép thông báo gửi nhóm lớp / Zalo'}</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenOnlineExam(exam);
                }}
                className="py-2 px-3.5 bg-neutral-900 text-white font-semibold rounded-lg hover:bg-black transition-colors text-xs inline-flex items-center gap-1.5"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Xem giao diện thi</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
