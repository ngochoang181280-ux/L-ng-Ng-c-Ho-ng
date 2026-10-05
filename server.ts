import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API: Tự động tạo gợi ý nhận xét học sinh bằng Gemini AI
app.post('/api/ai/generate-comment', async (req: Request, res: Response) => {
  try {
    const { 
      studentName, 
      rollNumber, 
      gender, 
      avgScore, 
      academicRating, 
      conduct, 
      subjectsSummary, 
      absencesCount, 
      disciplineNotes,
      specialNotes,
      tone 
    } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'Chưa tìm thấy GEMINI_API_KEY trên server.',
        fallbackNeeded: true 
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `Bạn là một Giáo viên Chủ nhiệm (GVCN) trung học phổ thông giàu kinh nghiệm, tận tâm, thấu hiểu tâm lý học sinh và am hiểu sâu sắc Chương trình Giáo dục phổ thông mới của Bộ Giáo dục và Đào tạo Việt Nam.

Dưới đây là dữ liệu thực tế về học sinh:
- Họ và tên: ${studentName} (${gender}) - STT: ${rollNumber}
- Điểm trung bình học kỳ: ${avgScore || 'Chưa đủ điểm'} (Xếp loại học lực: ${academicRating})
- Kết quả rèn luyện (Hạnh kiểm): ${conduct}
- Đánh giá phổ điểm các môn: ${subjectsSummary}
- Tình hình chuyên cần: ${absencesCount}
- Nhật ký nề nếp thi đua: ${disciplineNotes || 'Chấp hành nghiêm túc nội quy trường lớp.'}
- Ghi chú riêng của giáo viên: ${specialNotes || 'Không có.'}
- Phong cách nhận xét mong muốn: ${tone || 'Toàn diện và khích lệ'}

Yêu cầu nhận xét:
1. Đánh giá khách quan, cụ thể về ưu điểm nổi bật (môn thế mạnh, thái độ học tập, nề nếp kỷ luật).
2. Chỉ ra khéo léo những mặt cần khắc phục (môn học còn điểm thấp hoặc tình trạng chuyên cần/phát biểu bài).
3. Đưa ra lời khuyên cụ thể, mang tính động viên, truyền cảm hứng để học sinh tiếp tục cố gắng trong giai đoạn tới.
4. Ngôn từ sư phạm chuẩn mực, ấm áp, ngắn gọn súc tích (khoảng 3 - 5 câu), phù hợp để lưu vào Sổ chủ nhiệm, Học bạ hoặc gửi cho Phụ huynh học sinh.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.json({ comment: response.text });
  } catch (error: any) {
    console.error('Lỗi khi gọi Gemini API:', error);
    return res.status(500).json({ 
      error: error.message || 'Lỗi xử lý Gemini AI',
      fallbackNeeded: true 
    });
  }
});

// API: Tự động soạn câu hỏi trắc nghiệm theo bài học bằng Gemini AI
app.post('/api/ai/generate-questions', async (req: Request, res: Response) => {
  try {
    const { subjectName, topic, level, count } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Chưa cấu hình GEMINI_API_KEY' });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: { 'User-Agent': 'aistudio-build' },
      },
    });

    const prompt = `Bạn là một chuyên gia khảo thí và biên soạn đề thi THPT của Bộ Giáo dục và Đào tạo Việt Nam.
Hãy biên soạn đúng ${count || 3} câu hỏi trắc nghiệm khách quan 4 lựa chọn (A, B, C, D) cho:
- Môn học: ${subjectName}
- Chủ đề/Bài học: ${topic}
- Mức độ nhận thức: ${level} (1 trong 4 mức: Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao)

Yêu cầu:
1. Câu hỏi rõ ràng, không đánh đố vô lý, bám sát Chương trình GDPT 2018.
2. Có đúng 1 phương án đúng và 3 phương án nhiễu có tính thuyết phục cao.
3. Kèm theo giải thích ngắn gọn, chuẩn xác.
4. Trả về đúng định dạng JSON danh sách các câu hỏi.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '[]';
    return res.json({ questions: JSON.parse(text) });
  } catch (err: any) {
    console.error('Lỗi sinh câu hỏi Gemini:', err);
    return res.status(500).json({ error: err.message || 'Lỗi sinh câu hỏi' });
  }
});

// API: Trích xuất và soạn câu hỏi trắc nghiệm từ ảnh chụp trang Sách giáo khoa bằng Gemini Vision
app.post('/api/ai/extract-questions-from-image', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType, subjectName, topic } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Chưa cấu hình GEMINI_API_KEY' });
    }

    if (!imageBase64) {
      return res.status(400).json({ error: 'Thiếu dữ liệu ảnh' });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: { 'User-Agent': 'aistudio-build' },
      },
    });

    const cleanBase64 = imageBase64.includes('base64,') 
      ? imageBase64.split('base64,')[1] 
      : imageBase64;

    const promptText = `Bạn là một chuyên gia khảo thí và biên soạn đề thi giáo dục phổ thông Việt Nam.
Hãy quan sát và đọc kỹ toàn bộ nội dung trong bức ảnh chụp trang sách giáo khoa / tài liệu học tập này.
Nhiệm vụ:
1. Nhận diện các câu hỏi hoặc bài tập có trong trang sách (hoặc chuyển thể nội dung kiến thức trong trang sách) thành các câu hỏi trắc nghiệm khách quan 4 lựa chọn (A, B, C, D).
2. Phân loại chuẩn xác 4 mức độ nhận thức cho từng câu:
   - "Nhận biết"
   - "Thông hiểu"
   - "Vận dụng"
   - "Vận dụng cao"
3. Xác định đúng đáp án chính xác (A, B, C hoặc D) và giải thích ngắn gọn, dễ hiểu.
4. Trả về đúng định dạng JSON danh sách các câu hỏi theo mẫu:
[
  {
    "content": "Nội dung câu hỏi...",
    "level": "Nhận biết",
    "topic": "${topic || 'Theo bài học trong sách'}",
    "options": [
      { "key": "A", "text": "Phương án A" },
      { "key": "B", "text": "Phương án B" },
      { "key": "C", "text": "Phương án C" },
      { "key": "D", "text": "Phương án D" }
    ],
    "correctAnswer": "A",
    "explanation": "Giải thích vì sao A đúng..."
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: mimeType || 'image/jpeg',
                data: cleanBase64,
              },
            },
            {
              text: promptText,
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const outputText = response.text || '[]';
    return res.json({ questions: JSON.parse(outputText) });
  } catch (err: any) {
    console.error('Lỗi khi trích xuất câu hỏi từ ảnh bằng Gemini:', err);
    return res.status(500).json({ error: err.message || 'Lỗi trích xuất ảnh' });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server sổ chủ nhiệm đang chạy tại http://0.0.0.0:${port}`);
  });
}

startServer();
