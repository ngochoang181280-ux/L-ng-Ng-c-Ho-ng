import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  Printer, 
  BookOpen, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Camera, 
  Award, 
  Share2, 
  HelpCircle,
  Search,
  ExternalLink
} from 'lucide-react';
import { exportToWord, getUserGuideWordHTML } from '../utils/wordExport';

interface UserGuideModalProps {
  onClose: () => void;
  teacherName?: string;
  schoolName?: string;
  className?: string;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({
  onClose,
  teacherName = 'Cô Lê Thị Hoài Bảo',
  schoolName = 'TRƯỜNG THPT LÊ QUÝ ĐÔN',
  className = '10A1',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [activeChapter, setActiveChapter] = useState<number | 'all'>('all');

  const handleExportWord = () => {
    setIsExporting(true);
    const html = getUserGuideWordHTML(teacherName, schoolName, className);
    exportToWord(
      `Huong_Dan_Su_Dung_So_Chu_Nhiem_${teacherName.replace(/[^a-zA-Z0-9_\u00C0-\u1EF9]/g, '_')}.doc`,
      `Tài liệu Hướng dẫn sử dụng Sổ chủ nhiệm - ${teacherName}`,
      html
    );
    setTimeout(() => {
      setIsExporting(false);
    }, 800);
  };

  const chapters = [
    {
      id: 1,
      title: 'Chương I: Đăng nhập hệ thống & Tài khoản GVCN',
      desc: 'Thông tin tài khoản: Hoaibao, Mật khẩu: 10011982; phân quyền độc lập giữa Giáo viên và Học sinh.',
      badge: 'Đăng nhập',
    },
    {
      id: 2,
      title: 'Chương II: Quản lý hồ sơ học sinh & Sơ yếu trích ngang',
      desc: 'Thêm, sửa, tìm kiếm, lọc theo tổ, ưu tiên chỗ ngồi cho học sinh cận thị.',
      badge: 'Hồ sơ',
    },
    {
      id: 3,
      title: 'Chương III: Sổ điểm điện tử & Đánh giá TT 22/BGDĐT',
      desc: 'Cấu trúc điểm TX1..TX4, GK, CK; tự động tính ĐTB môn, ĐTB kỳ; AI đề xuất nhận xét học bạ.',
      badge: 'Sổ điểm',
    },
    {
      id: 4,
      title: 'Chương IV: Điểm danh & Quản lý kỷ luật thi đua',
      desc: 'Điểm danh chuyên cần 1 chạm, ghi nhận khen thưởng/vi phạm, cảnh báo liên hệ phụ huynh.',
      badge: 'Nề nếp',
    },
    {
      id: 5,
      title: 'Chương V: Sơ đồ chỗ ngồi & Ghép đôi "Đôi bạn cùng tiến"',
      desc: 'Xếp chỗ theo bàn, ưu tiên học sinh cận thị bàn đầu; thuật toán tự động ghép bạn giỏi kèm bạn yếu.',
      badge: 'Sơ đồ',
    },
    {
      id: 6,
      title: 'Chương VI: Soạn đề theo ma trận 4 mức độ & Thi trực tuyến',
      desc: 'Tự động tạo đề từ ma trận, sắp xếp độ khó tăng dần; tạo 4 mã đề hoán vị; giám sát chống gian lận.',
      badge: 'Đề thi',
    },
    {
      id: 7,
      title: 'Chương VII: Chấm thi bằng Camera (OMR) & Soạn đề từ SGK',
      desc: 'Quét phiếu trắc nghiệm bằng camera điện thoại trong 1 giây; Gemini AI bóc tách bài tập từ ảnh chụp sách.',
      badge: 'Công nghệ AI',
    },
    {
      id: 8,
      title: 'Chương VIII: Kế hoạch bài dạy (Giáo án CV 5512) & File mẫu',
      desc: 'Soạn giáo án chuẩn 4 hoạt động; tải file mẫu Excel/Word; nhập giáo án từ file mẫu và xuất file.',
      badge: 'Giáo án',
    },
    {
      id: 9,
      title: 'Chương IX: Xuất báo cáo, Phiếu liên lạc & Gửi nhanh qua Zalo',
      desc: 'In bảng điểm, sổ chủ nhiệm; gửi kết quả rèn luyện cho phụ huynh qua Zalo bằng 1 cú chạm.',
      badge: 'Liên lạc PH',
    },
    {
      id: 10,
      title: 'Chương X: Sao lưu dữ liệu & Tư vấn khối thi Đại học',
      desc: 'Biểu đồ radar so sánh KHTN vs KHXH định hướng nghề nghiệp; sao lưu phục hồi dữ liệu an toàn.',
      badge: 'Hướng nghiệp',
    },
  ];

  const filteredChapters = chapters.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-emerald-200">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="text-base sm:text-lg font-bold">
                Tài Liệu Hướng Dẫn Sử Dụng & Xuất File Word
              </h2>
            </div>
            <p className="text-xs text-emerald-100/90 mt-1">
              Dành riêng cho Giáo viên Chủ nhiệm: <strong>{teacherName}</strong> · {schoolName} (Lớp {className})
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Nút Xuất file Word lớn & nổi bật */}
            <button
              onClick={handleExportWord}
              disabled={isExporting}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-lg text-xs transition-all shadow-md inline-flex items-center gap-1.5"
              title="Tải toàn bộ tài liệu hướng dẫn về máy tính dưới định dạng file Word (.doc)"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Đang xuất Word...' : 'Xuất File Word (.doc)'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Bar: Tìm kiếm & Lọc mục lục */}
        <div className="p-3 bg-neutral-50 border-b border-neutral-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs shrink-0">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm nội dung hướng dẫn (ví dụ: đăng nhập, điểm danh, Zalo, OMR...)"
              className="w-full pl-9 pr-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportWord}
              className="px-3 py-1.5 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-colors inline-flex items-center gap-1.5 shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Tải bản Word in ấn</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-white border border-neutral-300 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-100 transition-colors inline-flex items-center gap-1.5 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-neutral-500" />
              <span>In trang này</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs text-neutral-800 leading-relaxed">
          
          {/* Banner Thông tin tài khoản GVCN */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <span>Thông tin xác thực Giáo viên Chủ nhiệm</span>
              </div>
              <p className="text-neutral-600 text-xs">
                Giáo viên: <strong>{teacherName}</strong> · Đơn vị: <strong>{schoolName}</strong> · Lớp chủ nhiệm: <strong>{className}</strong>
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 font-mono text-xs">
                <span className="px-2.5 py-1 bg-white border border-emerald-300 rounded-md text-emerald-800 font-bold">
                  Tài khoản: <strong>Hoaibao</strong>
                </span>
                <span className="px-2.5 py-1 bg-white border border-emerald-300 rounded-md text-emerald-800 font-bold">
                  Mật khẩu: <strong>10011982</strong>
                </span>
              </div>
            </div>

            <button
              onClick={handleExportWord}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs inline-flex items-center gap-2 shrink-0 transition-transform active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Tải cẩm nang Word (.doc)</span>
            </button>
          </div>

          {/* Danh mục các chương hướng dẫn */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide border-b border-neutral-200 pb-2">
              Các chương hướng dẫn sử dụng chi tiết (10 Chương)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredChapters.map((ch) => (
                <div
                  key={ch.id}
                  className="bg-white border border-neutral-200 hover:border-emerald-500 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-emerald-900 text-xs line-clamp-1">
                      {ch.title}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-semibold text-[10px] shrink-0">
                      {ch.badge}
                    </span>
                  </div>
                  <p className="text-neutral-600 text-[11px] leading-relaxed">
                    {ch.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Chi tiết nội dung tóm lược nghiệp vụ chính */}
          <div className="space-y-5 pt-3 border-t border-neutral-200">
            {/* 1. Điểm danh & Kỷ luật */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-2">
              <h4 className="font-bold text-neutral-900 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>1. Quy trình Điểm danh & Theo dõi kỷ luật hàng ngày</span>
              </h4>
              <p className="text-neutral-600">
                Vào tab <strong>"Điểm danh & Nề nếp"</strong>: Mặc định tất cả học sinh đi học đủ (Xanh lá). Giáo viên chỉ cần click vào học sinh vắng để chuyển thành <em>Có phép (P)</em> hoặc <em>Không phép (KP)</em>. Nếu học sinh vi phạm nghiêm trọng cần phụ huynh phối hợp, hãy tích vào <em>"Cần liên hệ PH"</em> để hệ thống hiển thị chuông cảnh báo đỏ trên thanh tiêu đề.
              </p>
            </div>

            {/* 2. Soạn đề ma trận & Chống gian lận */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-2">
              <h4 className="font-bold text-neutral-900 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>2. Tạo đề thi ma trận 4 mức độ & Giám sát thi trực tuyến</span>
              </h4>
              <p className="text-neutral-600">
                Vào tab <strong>"Soạn đề & Thi trắc nghiệm"</strong>: Cấu hình số lượng câu cho 4 mức độ (Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao). Hệ thống tự động sắp xếp câu hỏi tăng dần độ khó. Thầy/cô có thể bấm <strong>"Chia sẻ link & Mã QR"</strong> gửi cho học sinh làm bài thi trực tuyến. Hệ thống tự động đếm số lần học sinh rời khỏi màn hình hoặc mở tab khác để nhắc nhở và tự động nộp bài nếu vi phạm.
              </p>
            </div>

            {/* 3. Chấm thi bằng Camera OMR Scanner */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-2">
              <h4 className="font-bold text-neutral-900 text-xs flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-700" />
                <span>3. Chấm trắc nghiệm tự động bằng Camera điện thoại / Webcam (OMR)</span>
              </h4>
              <p className="text-neutral-600">
                Sau khi in đề giấy cho học sinh làm bài và tô vào Phiếu trả lời trắc nghiệm, bấm nút <strong>"Quét camera chấm bài"</strong> trên đề thi. Đưa camera hướng vào phiếu trả lời: hệ thống nhận diện các ô tô đen trong 1 giây, tính điểm và cho phép bấm <strong>"Áp dụng điểm vào Sổ điểm lớp"</strong> tự động mà không cần nhập tay từng em.
              </p>
            </div>

            {/* 4. Gửi Zalo cho phụ huynh */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-2">
              <h4 className="font-bold text-neutral-900 text-xs flex items-center gap-2">
                <Share2 className="w-4 h-4 text-emerald-700" />
                <span>4. Gửi báo cáo rèn luyện nhanh qua Zalo cho Phụ huynh</span>
              </h4>
              <p className="text-neutral-600">
                Tại Sơ yếu lý lịch từng học sinh hoặc bảng điểm, bấm <strong>"Gửi Zalo cho Phụ huynh"</strong> hoặc <strong>"Sao chép tin nhắn Zalo"</strong>. Nội dung được chuẩn hóa tự động kèm điểm trung bình, xếp loại học lực, rèn luyện và lời nhận xét sư phạm của cô giáo để gửi ngay trong nhóm chat hoặc tin nhắn riêng.
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-neutral-50 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-neutral-500">
            Hệ thống hỗ trợ xuất file Word chuẩn Microsoft Word (.doc) với đầy đủ bảng biểu và kiểu dáng.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-neutral-300 rounded-lg text-neutral-700 font-semibold hover:bg-neutral-100 transition-colors shadow-2xs text-xs"
            >
              Đóng lại
            </button>

            <button
              onClick={handleExportWord}
              disabled={isExporting}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs transition-all shadow-2xs inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Đang tạo file Word...' : 'Tải File Word Hướng Dẫn (.doc)'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
