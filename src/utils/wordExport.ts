/**
 * Tiện ích xuất dữ liệu ra file Word (.doc) tương thích 100% với Microsoft Word, WPS Office, LibreOffice và Google Docs.
 * Mã hóa UTF-8 BOM (\uFEFF) giúp tiếng Việt hiển thị sắc nét, không bị lỗi font chữ.
 */
export function exportToWord(filename: string, documentTitle: string, htmlBodyContent: string) {
  const cleanFilename = filename.endsWith('.doc') ? filename : `${filename}.doc`;

  const wordDocumentHTML = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' 
      xmlns:w='urn:schemas-microsoft-com:office:word' 
      xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>${documentTitle}</title>
<!--[if gte mso 9]>
<xml>
  <w:WordDocument>
    <w:View>Print</w:View>
    <w:Zoom>100</w:Zoom>
    <w:DoNotOptimizeForBrowser/>
  </w:WordDocument>
</xml>
<![endif]-->
<style>
  @page Section1 {
    size: 595.3pt 841.9pt; /* A4 standard */
    margin: 2.0cm 2.0cm 2.0cm 2.5cm;
    mso-header-margin: 36.0pt;
    mso-footer-margin: 36.0pt;
    mso-paper-source: 0;
  }
  div.Section1 {
    page: Section1;
  }
  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 13pt;
    line-height: 1.45;
    color: #111827;
  }
  .doc-header-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 16pt;
    border: none;
  }
  .doc-header-table td {
    border: none;
    vertical-align: top;
    padding: 0;
  }
  .main-title {
    font-size: 18pt;
    font-weight: bold;
    color: #065f46;
    text-align: center;
    text-transform: uppercase;
    margin-top: 14pt;
    margin-bottom: 4pt;
  }
  .sub-title {
    font-size: 13pt;
    font-style: italic;
    text-align: center;
    color: #374151;
    margin-bottom: 16pt;
  }
  h1 {
    font-size: 15pt;
    font-weight: bold;
    color: #047857;
    margin-top: 18pt;
    margin-bottom: 6pt;
    border-bottom: 1.5pt solid #047857;
    padding-bottom: 3pt;
    text-transform: uppercase;
  }
  h2 {
    font-size: 13.5pt;
    font-weight: bold;
    color: #1f2937;
    margin-top: 12pt;
    margin-bottom: 4pt;
  }
  h3 {
    font-size: 13pt;
    font-weight: bold;
    color: #374151;
    margin-top: 8pt;
    margin-bottom: 3pt;
  }
  p {
    margin-top: 4pt;
    margin-bottom: 6pt;
    text-align: justify;
    line-height: 1.45;
  }
  ul, ol {
    margin-top: 4pt;
    margin-bottom: 6pt;
    padding-left: 24pt;
  }
  li {
    margin-bottom: 3pt;
    line-height: 1.4;
  }
  table.data-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8pt;
    margin-bottom: 12pt;
  }
  table.data-table th, table.data-table td {
    border: 1pt solid #4b5563;
    padding: 6pt 8pt;
    font-size: 12pt;
  }
  table.data-table th {
    background-color: #ecfdf5;
    font-weight: bold;
    color: #065f46;
    text-align: center;
  }
  .box-note {
    background-color: #f0fdf4;
    border: 1pt solid #86efac;
    padding: 8pt 12pt;
    margin: 8pt 0;
    border-radius: 4pt;
    font-size: 12pt;
  }
  .box-warning {
    background-color: #fffbeb;
    border: 1pt solid #fcd34d;
    padding: 8pt 12pt;
    margin: 8pt 0;
    border-radius: 4pt;
    font-size: 12pt;
  }
  .badge {
    background-color: #d1fae5;
    color: #065f46;
    font-weight: bold;
    padding: 1pt 5pt;
    border-radius: 3pt;
    font-size: 11pt;
  }
  .text-center { text-align: center; }
  .text-right { text-align: right; }
  .bold { font-weight: bold; }
  .italic { font-style: italic; }
  .doc-footer {
    margin-top: 24pt;
    padding-top: 8pt;
    border-top: 0.5pt solid #9ca3af;
    text-align: center;
    font-size: 10pt;
    color: #6b7280;
  }
</style>
</head>
<body>
  <div class="Section1">
    ${htmlBodyContent}
  </div>
</body>
</html>`;

  const blob = new Blob(['\uFEFF' + wordDocumentHTML], {
    type: 'application/msword;charset=utf-8'
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = cleanFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Tạo nội dung HTML hoàn chỉnh cho Tài liệu Hướng dẫn sử dụng Sổ Chủ Nhiệm Điện Tử
 */
export function getUserGuideWordHTML(
  teacherName: string = 'Cô Lê Thị Hoài Bảo',
  schoolName: string = 'TRƯỜNG THPT LÊ QUÝ ĐÔN',
  className: string = '10A1'
): string {
  return `
    <!-- Quốc hiệu & Tiêu ngữ -->
    <table class="doc-header-table">
      <tr>
        <td style="width: 45%; text-align: center;">
          <div style="font-size: 11pt; font-weight: bold; text-transform: uppercase;">SỞ GIÁO DỤC VÀ ĐÀO TẠO</div>
          <div style="font-size: 12pt; font-weight: bold; text-transform: uppercase; color: #065f46;">${schoolName}</div>
          <div style="font-size: 10pt; font-style: italic;">Lớp: ${className} - Năm học 2024 - 2025</div>
        </td>
        <td style="width: 55%; text-align: center;">
          <div style="font-size: 11pt; font-weight: bold;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
          <div style="font-size: 11pt; font-weight: bold; text-decoration: underline;">Độc lập - Tự do - Hạnh phúc</div>
          <div style="font-size: 10pt; font-style: italic; margin-top: 4pt;">Hà Nội, ngày 25 tháng 03 năm 2025</div>
        </td>
      </tr>
    </table>

    <div class="main-title">TÀI LIỆU HƯỚNG DẪN SỬ DỤNG</div>
    <div style="text-align: center; font-size: 14pt; font-weight: bold; color: #047857; text-transform: uppercase;">
      HỆ THỐNG SỔ CHỦ NHIỆM ĐIỆN TỬ & QUẢN LÝ GIÁO DỤC
    </div>
    <div class="sub-title">
      Biên soạn dành riêng cho Giáo viên Chủ nhiệm: <strong>${teacherName}</strong>
    </div>

    <div class="box-note">
      <strong>MỤC TIÊU TÀI LIỆU:</strong> Cung cấp hướng dẫn chi tiết từ cơ bản đến nâng cao về các mô-đun nghiệp vụ chủ nhiệm lớp: quản lý hồ sơ học sinh, sổ điểm điện tử theo Thông tư 22/BGDĐT, điểm danh - kỷ luật, sơ đồ lớp ghép đôi học tập, soạn đề thi tự động theo ma trận, chấm thi bằng camera, thiết kế giáo án CV 5512, xuất báo cáo và gửi thông báo Zalo cho phụ huynh.
    </div>

    <!-- MỤC LỤC TỔNG QUAN -->
    <h1>MỤC LỤC CÁC CHỨC NĂNG CHÍNH</h1>
    <ol>
      <li><strong>Chương I:</strong> Đăng nhập hệ thống & Quản lý tài khoản GVCN</li>
      <li><strong>Chương II:</strong> Quản lý hồ sơ học sinh & Sơ yếu lý lịch trích ngang</li>
      <li><strong>Chương III:</strong> Sổ điểm điện tử & Đánh giá xếp loại theo Thông tư 22/BGDĐT</li>
      <li><strong>Chương IV:</strong> Điểm danh chuyên cần & Quản lý nề nếp kỷ luật thi đua</li>
      <li><strong>Chương V:</strong> Sơ đồ chỗ ngồi thông minh & Thuật toán "Đôi bạn cùng tiến"</li>
      <li><strong>Chương VI:</strong> Hệ thống Soạn đề theo ma trận 4 mức độ & Thi trực tuyến chống gian lận</li>
      <li><strong>Chương VII:</strong> Chấm trắc nghiệm bằng Camera (OMR Scanner) & AI Vision bóc tách đề SGK</li>
      <li><strong>Chương VIII:</strong> Thiết kế Kế hoạch bài dạy (Giáo án CV 5512) & File mẫu Excel/Word</li>
      <li><strong>Chương IX:</strong> Xuất báo cáo, Phiếu liên lạc & Gửi tin nhắn kết quả qua Zalo</li>
      <li><strong>Chương X:</strong> Sao lưu dữ liệu & Tư vấn hướng nghiệp tổ hợp Đại học</li>
    </ol>

    <!-- NỘI DUNG CHI TIẾT -->
    <h1>CHƯƠNG I: ĐĂNG NHẬP HỆ THỐNG & QUẢN LÝ TÀI KHOẢN</h1>
    <p>Hệ thống được thiết kế với hai phân hệ độc lập nhằm bảo đảm an toàn dữ liệu:</p>
    <ul>
      <li><strong>Phân hệ Dành cho Giáo viên Chủ nhiệm:</strong> Đầy đủ quyền quản trị lớp, nhập điểm, nhận xét học bạ, tạo đề thi, xem đáp án và phân tích số liệu.</li>
      <li><strong>Phân hệ Cổng thi học sinh:</strong> Học sinh chỉ được quyền làm bài kiểm tra khi được giáo viên cung cấp liên kết hoặc mã phòng thi (PIN), không thể xem dữ liệu riêng tư của lớp.</li>
    </ul>

    <table class="data-table">
      <tr>
        <th style="width: 30%;">Thông tin</th>
        <th style="width: 70%;">Giá trị cấu hình chuẩn</th>
      </tr>
      <tr>
        <td><strong>Tên đăng nhập (Username)</strong></td>
        <td><span class="badge">Hoaibao</span> (hoặc hoaibao)</td>
      </tr>
      <tr>
        <td><strong>Mật khẩu (Password)</strong></td>
        <td><span class="badge">10011982</span></td>
      </tr>
      <tr>
        <td><strong>Giáo viên phụ trách</strong></td>
        <td><strong>${teacherName}</strong></td>
      </tr>
      <tr>
        <td><strong>Trường trực thuộc</strong></td>
        <td>${schoolName}</td>
      </tr>
    </table>

    <p><em>Lưu ý:</em> Tại màn hình đăng nhập, thầy/cô có thể bấm nút <strong>"Điền nhanh mật khẩu"</strong> để hệ thống tự động điền sẵn thông tin đăng nhập mà không cần gõ phím.</p>

    <h1>CHƯƠNG II: QUẢN LÝ HỒ SƠ HỌC SINH</h1>
    <p>Hồ sơ học sinh lưu trữ toàn diện thông tin cá nhân, liên lạc phụ huynh và ghi chú y tế:</p>
    <ul>
      <li><strong>Thêm mới học sinh:</strong> Bấm nút <em>"+ Thêm học sinh"</em>, điền Họ tên, Ngày sinh, Giới tính, Địa chỉ, Số điện thoại Bố/Mẹ, Nghề nghiệp và Tổ sinh hoạt.</li>
      <li><strong>Cảnh báo thị lực:</strong> Nếu học sinh có vấn đề về mắt (cận thị), tích chọn <em>"Cận thị / Cần ngồi bàn đầu"</em>. Hệ thống sẽ tự động ưu tiên xếp chỗ ngồi gần bảng ở mô-đun Sơ đồ lớp.</li>
      <li><strong>Hồ sơ chi tiết từng em:</strong> Bấm vào dòng của học sinh để mở Sơ yếu lý lịch trích ngang, lịch sử vi phạm, điểm thi và học bạ điện tử.</li>
    </ul>

    <h1>CHƯƠNG III: SỔ ĐIỂM ĐIỆN TỬ & ĐÁNH GIÁ THÔNG TƯ 22</h1>
    <p>Sổ điểm tuân thủ đúng Quy chế đánh giá, xếp loại học sinh THCS và THPT theo <strong>Thông tư 22/2021/TT-BGDĐT</strong>:</p>
    <ul>
      <li><strong>Cấu trúc cột điểm mỗi môn:</strong>
        <ul>
          <li>Đánh giá thường xuyên (ĐGtx): Gồm 4 cột điểm TX1, TX2, TX3, TX4 (Hệ số 1).</li>
          <li>Đánh giá giữa kỳ (ĐGgk): 1 cột điểm Giữa kỳ (Hệ số 2).</li>
          <li>Đánh giá cuối kỳ (ĐGck): 1 cột điểm Cuối kỳ (Hệ số 3).</li>
        </ul>
      </li>
      <li><strong>Công thức tính Điểm trung bình môn (ĐTBmhk):</strong><br>
        <code>ĐTBmhk = (Tổng điểm TX + ĐGgk × 2 + ĐGck × 3) / (Số cột TX + 5)</code>
      </li>
      <li><strong>Xếp loại Học lực:</strong> Tự động xếp loại Tốt, Khá, Đạt, Chưa đạt dựa trên Điểm trung bình các môn và điều kiện khống chế môn Toán / Ngữ văn / Tiếng Anh.</li>
      <li><strong>AI đề xuất nhận xét học bạ:</strong> Nút <em>"AI Nhận xét học bạ"</em> tự động phân tích điểm mạnh, điểm yếu và đề xuất câu nhận xét sư phạm giàu tính động viên cho GVCN duyệt.</li>
    </ul>

    <h1>CHƯƠNG IV: ĐIỂM DANH & QUẢN LÝ KỶ LUẬT THI ĐUA</h1>
    <p>Giúp GVCN nắm bắt sĩ số và nề nếp hàng ngày trong vòng 30 giây:</p>
    <ul>
      <li><strong>Điểm danh 1 chạm:</strong> Mặc định cả lớp đi học đủ. GVCN chỉ cần bấm vào em vắng để chuyển trạng thái: <em>Có phép (P)</em> hoặc <em>Không phép (KP)</em>.</li>
      <li><strong>Ghi nhận nề nếp / Thi đua:</strong> Ghi lại các sự vụ: Khen thưởng (phát biểu tốt, đạt giải cuộc thi) hoặc Vi phạm (đi muộn, không học bài, làm mất trật tự).</li>
      <li><strong>Cảnh báo liên hệ phụ huynh:</strong> Các vi phạm nghiêm trọng sẽ có cờ báo đỏ <em>"Cần liên hệ PH"</em> nổi bật trên thanh công cụ để nhắc nhở GVCN gọi điện cho gia đình.</li>
    </ul>

    <h1>CHƯƠNG V: SƠ ĐỒ CHỖ NGỒI & THUẬT TOÁN "ĐÔI BẠN CÙNG TIẾN"</h1>
    <p>Hệ thống hỗ trợ sơ đồ lớp học 4 tổ, mỗi tổ 2 dãy bàn (Tổng cộng 40 vị trí ngồi):</p>
    <ul>
      <li><strong>Xếp chỗ trực quan:</strong> Kéo thả hoặc click chọn tên học sinh vào từng vị trí bàn trái / bàn phải.</li>
      <li><strong>Ưu tiên học sinh cận thị:</strong> Học sinh có thị lực kém được đánh dấu biểu tượng kính mắt màu xanh và tự động xếp ở các dãy bàn 1 và bàn 2.</li>
      <li><strong>Thuật toán "Đôi bạn cùng tiến":</strong> Phân tích phổ điểm môn Toán / Khoa học tự nhiên: tự động phát hiện các bạn đạt điểm giỏi (>= 8.0) và ghép ngồi cùng bàn với các bạn có điểm dưới 5.0 để kèm cặp, giúp đỡ nhau tiến bộ.</li>
    </ul>

    <h1>CHƯƠNG VI: SOẠN ĐỀ THI MA TRẬN & THI TRỰC TUYẾN CHỐNG GIAN LẬN</h1>
    <p>Tính năng độc quyền giúp tạo đề thi chuyên nghiệp theo chuẩn Bộ GD&ĐT:</p>
    <ul>
      <li><strong>Ma trận 4 mức độ nhận thức:</strong>
        <table class="data-table">
          <tr>
            <th>Mức độ</th>
            <th>Tỉ lệ gợi ý</th>
            <th>Mô tả năng lực</th>
          </tr>
          <tr>
            <td><strong>1. Nhận biết</strong></td>
            <td>40% (8 câu)</td>
            <td>Nhận diện công thức, định nghĩa, định lý cơ bản</td>
          </tr>
          <tr>
            <td><strong>2. Thông hiểu</strong></td>
            <td>30% (6 câu)</td>
            <td>Hiểu bản chất khái niệm, áp dụng trực tiếp</td>
          </tr>
          <tr>
            <td><strong>3. Vận dụng</strong></td>
            <td>20% (4 câu)</td>
            <td>Giải bài tập qua nhiều bước tính toán</td>
          </tr>
          <tr>
            <td><strong>4. Vận dụng cao</strong></td>
            <td>10% (2 câu)</td>
            <td>Bài toán thực tế, tư duy sáng tạo, tối ưu hóa</td>
          </tr>
        </table>
      </li>
      <li><strong>Đặc điểm quan trọng:</strong> Câu hỏi trong đề thi luôn được tự động sắp xếp theo thứ tự độ khó tăng dần từ Câu 1 (Nhận biết) đến các câu cuối (Vận dụng cao) để học sinh làm bài tự tin.</li>
      <li><strong>Xuất đề in trên giấy:</strong> In đề bài thi chính thức kèm Phiếu trả lời trắc nghiệm chuẩn tô chì và Bảng đáp án dành cho giám thị chấm.</li>
      <li><strong>Tạo 4 mã đề hoán vị (101, 102, 103, 104):</strong> Đảo ngẫu nhiên thứ tự câu hỏi và phương án A, B, C, D chỉ bằng 1 nút bấm để chống nhìn bài khi thi tập trung.</li>
      <li><strong>Giám sát thi trực tuyến chống gian lận:</strong>
        <ul>
          <li>Theo dõi số lần học sinh chuyển tab hoặc thu nhỏ màn hình để tra cứu tài liệu.</li>
          <li>Tùy chọn cảnh báo hoặc tự động khóa bài, nộp bài ngay khi vượt quá số lần cho phép (mặc định 3 lần).</li>
        </ul>
      </li>
    </ul>

    <h1>CHƯƠNG VII: CHẤM THI BẰNG CAMERA & AI VISION TỪ SÁCH GIÁO KHOA</h1>
    <ul>
      <li><strong>Chấm bài bằng Camera (OMR Scanner):</strong>
        <p>Học sinh làm bài thi giấy và tô vào Phiếu trả lời trắc nghiệm. Thầy/cô bấm <em>"Quét camera chấm bài"</em> trên đề thi tương ứng:</p>
        <ol>
          <li>Đưa camera điện thoại hoặc webcam máy tính hướng về phía phiếu trả lời.</li>
          <li>Hệ thống tự động phát hiện các ô tô đen, đối chiếu đáp án chuẩn trong 1 giây.</li>
          <li>Điểm số được tính tức thì và có nút <em>"Nhập điểm thẳng vào Sổ điểm lớp"</em>, không cần gõ tay từng em.</li>
        </ol>
      </li>
      <li><strong>Soạn câu hỏi từ Ảnh chụp Sách giáo khoa (Gemini AI):</strong>
        <p>Thầy/cô chỉ cần chụp ảnh trang bài tập trong sách hoặc dán ảnh đề cương: Gemini AI sẽ tự động đọc chữ, trích xuất đề bài, tạo 4 phương án A-B-C-D, giải thích chi tiết và đưa thẳng vào Ngân hàng câu hỏi.</p>
      </li>
      <li><strong>Thêm câu hỏi từ File mẫu Excel (.csv), Word (.txt) hoặc JSON:</strong>
        <p>Bấm nút <em>"Tải file mẫu câu hỏi"</em> để lấy mẫu chuẩn, điền danh sách câu hỏi theo mẫu rồi bấm <em>"Nhập câu hỏi từ File mẫu"</em>. Hệ thống sẽ bóc tách và nạp hàng loạt câu hỏi vào ngân hàng trong chớp mắt.</p>
      </li>
    </ul>

    <h1>CHƯƠNG VIII: THIẾT KẾ GIÁO ÁN CHUẨN CÔNG VĂN 5512/BGDĐT</h1>
    <p>Kế hoạch bài dạy chuẩn quy định của Bộ Giáo dục & Đào tạo gồm 4 hoạt động bắt buộc:</p>
    <ul>
      <li><strong>Hoạt động 1:</strong> Mở đầu / Khởi động (Tạo tâm thế và tình huống có vấn đề).</li>
      <li><strong>Hoạt động 2:</strong> Hình thành kiến thức mới (Xây dựng định nghĩa, công thức cốt lõi).</li>
      <li><strong>Hoạt động 3:</strong> Luyện tập (Áp dụng giải bài tập cơ bản trong SGK).</li>
      <li><strong>Hoạt động 4:</strong> Vận dụng & Mở rộng (Ứng dụng giải quyết bài toán thực tế đời sống).</li>
    </ul>
    <p><em>Tiện ích đi kèm:</em> Nút <strong>"Tải file mẫu CV 5512"</strong> (Excel/Word/JSON), nút <strong>"Nhập giáo án từ File mẫu"</strong>, nút <strong>"Xuất file"</strong> và nút <strong>"In giáo án"</strong> để nộp tổ chuyên môn.</p>

    <h1>CHƯƠNG IX: XUẤT BÁO CÁO & GỬI THÔNG BÁO NHANH QUA ZALO</h1>
    <p>Thay vì viết tay phiếu liên lạc giấy, GVCN có thể gửi kết quả trực tiếp cho phụ huynh:</p>
    <ul>
      <li><strong>In Bảng tổng hợp & Phiếu liên lạc cá nhân:</strong> Định dạng trang in đẹp, chuẩn chữ ký GVCN và Ban Giám Hiệu.</li>
      <li><strong>Nút "Gửi Zalo cho Phụ huynh" / "Sao chép tin nhắn Zalo":</strong><br>
        Tự động tạo nội dung tin nhắn chuẩn mực:
        <div class="box-note" style="font-family: monospace;">
          "Kính gửi phụ huynh em [Nguyễn Văn A], GVCN lớp ${className} (${schoolName}) xin gửi kết quả rèn luyện HK1: ĐTB: 8.4 (Học lực: Giỏi, Rèn luyện: Tốt). Nhận xét của GVCN: [Nội dung AI đề xuất]. Trân trọng!"
        </div>
      </li>
    </ul>

    <h1>CHƯƠNG X: SAO LƯU DỮ LIỆU & TƯ VẤN KHỐI THI ĐẠI HỌC</h1>
    <ul>
      <li><strong>Biểu đồ Radar Tư vấn Khối thi Đại học (Dành cho THPT):</strong> So sánh năng lực giữa khối Khoa học Tự nhiên (Toán - Lý - Hóa - Sinh) và Khối Khoa học Xã hội (Văn - Sử - Địa - Anh), giúp GVCN định hướng chọn tổ hợp môn lớp 10 và đăng ký xét tuyển Đại học lớp 12.</li>
      <li><strong>Sao lưu an toàn (Backup & Restore):</strong> Bấm nút <em>"Sao lưu dữ liệu"</em> trên thanh Header để tải file dự phòng về máy tính. Khi chuyển sang máy tính khác, chỉ cần bấm <em>"Phục hồi dữ liệu"</em> để tiếp tục sử dụng mà không lo mất điểm số của học sinh.</li>
    </ul>

    <div class="doc-footer">
      <strong>${schoolName} · NĂM HỌC 2024 - 2025</strong><br>
      Tài liệu phát hành nội bộ phục vụ công tác chủ nhiệm của <strong>${teacherName}</strong>
    </div>
  `;
}
