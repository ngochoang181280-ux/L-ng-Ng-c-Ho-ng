import { AcademicRatingType, ConductType, SubjectScores, StudentTermScores, Subject, Student } from '../types';

/**
 * Tính điểm trung bình môn học theo quy định Bộ GD&ĐT:
 * ĐTB = (Tổng ĐGtx + ĐGgk * 2 + ĐGck * 3) / (Số bài ĐGtx + 5)
 */
export function calculateSubjectAvg(scores?: SubjectScores): number | null {
  if (!scores) return null;
  
  const txScores: number[] = [];
  if (typeof scores.tx1 === 'number') txScores.push(scores.tx1);
  if (typeof scores.tx2 === 'number') txScores.push(scores.tx2);
  if (typeof scores.tx3 === 'number') txScores.push(scores.tx3);
  if (typeof scores.tx4 === 'number') txScores.push(scores.tx4);

  const hasGk = typeof scores.gk === 'number';
  const hasCk = typeof scores.ck === 'number';

  if (txScores.length === 0 && !hasGk && !hasCk) {
    return null;
  }

  const txSum = txScores.reduce((acc, curr) => acc + curr, 0);
  const gkVal = hasGk ? (scores.gk as number) * 2 : 0;
  const ckVal = hasCk ? (scores.ck as number) * 3 : 0;

  const totalCoeff = txScores.length + (hasGk ? 2 : 0) + (hasCk ? 3 : 0);
  if (totalCoeff === 0) return null;

  const avg = (txSum + gkVal + ckVal) / totalCoeff;
  return Math.round(avg * 10) / 10;
}

/**
 * Tính điểm trung bình các môn học (ĐTB học kỳ)
 */
export function calculateSemesterAvg(
  termScores?: StudentTermScores,
  subjects: Subject[] = []
): { avg: number | null; minSubject: { name: string; score: number } | null; subjectAverages: Record<string, number | null> } {
  if (!termScores || !termScores.scores) {
    return { avg: null, minSubject: null, subjectAverages: {} };
  }

  const subjectAverages: Record<string, number | null> = {};
  let totalSum = 0;
  let count = 0;
  let minScore = 10;
  let minSubjectName = '';

  for (const subject of subjects) {
    const sc = termScores.scores[subject.id];
    const subAvg = calculateSubjectAvg(sc);
    subjectAverages[subject.id] = subAvg;

    if (subAvg !== null) {
      totalSum += subAvg;
      count += 1;
      if (subAvg < minScore) {
        minScore = subAvg;
        minSubjectName = subject.name;
      }
    }
  }

  if (count === 0) {
    return { avg: null, minSubject: null, subjectAverages };
  }

  const roundedAvg = Math.round((totalSum / count) * 10) / 10;
  return {
    avg: roundedAvg,
    minSubject: count > 0 && minSubjectName ? { name: minSubjectName, score: minScore } : null,
    subjectAverages,
  };
}

/**
 * Đánh giá học lực theo Thông tư 22/2021/TT-BGDĐT
 */
export function evaluateAcademicPerformance(
  semAvg: number | null,
  subjectAverages: Record<string, number | null>,
  subjects: Subject[]
): AcademicRatingType {
  if (semAvg === null) return 'Chưa đạt';

  // Lấy danh sách điểm số có giá trị
  const validScores: number[] = [];
  for (const s of subjects) {
    const sc = subjectAverages[s.id];
    if (typeof sc === 'number') {
      validScores.push(sc);
    }
  }

  if (validScores.length === 0) return 'Chưa đạt';

  const min = Math.min(...validScores);
  const coreSubjects = subjects.filter(s => s.category === 'core').map(s => s.id);
  const coreAverages = coreSubjects
    .map(id => subjectAverages[id])
    .filter((v): v is number => typeof v === 'number');

  const hasHighCore = coreAverages.some(v => v >= 8.0);
  const countGte8 = validScores.filter(v => v >= 8.0).length;
  const countGte65 = validScores.filter(v => v >= 6.5).length;

  // Xuất sắc: ĐTB >= 9.0 và tất cả các môn >= 6.5
  if (semAvg >= 9.0 && min >= 6.5 && countGte8 >= 6) {
    return 'Xuất sắc';
  }

  // Tốt / Giỏi: ĐTB >= 8.0, không có môn nào < 6.5, ít nhất 6 môn >= 8.0 hoặc có môn chính >= 8.0
  if (semAvg >= 8.0 && min >= 6.5 && (countGte8 >= 6 || hasHighCore)) {
    return 'Giỏi';
  }

  // Khá: ĐTB >= 6.5, không có môn nào < 5.0, ít nhất 6 môn >= 6.5
  if (semAvg >= 6.5 && min >= 5.0) {
    return 'Khá';
  }

  // Đạt (Trung bình): ĐTB >= 5.0 và không có môn nào < 3.5
  if (semAvg >= 5.0 && min >= 3.5) {
    return 'Đạt';
  }

  return 'Chưa đạt';
}

/**
 * Danh hiệu thi đua (Học sinh Xuất sắc, Học sinh Giỏi, Học sinh Tiên tiến)
 */
export function getHonorTitle(academic: AcademicRatingType, conduct: ConductType): string {
  if (academic === 'Xuất sắc' && conduct === 'Tốt') {
    return 'Học sinh Xuất sắc';
  }
  if ((academic === 'Giỏi' || academic === 'Xuất sắc') && conduct === 'Tốt') {
    return 'Học sinh Giỏi';
  }
  if ((academic === 'Khá' || academic === 'Giỏi' || academic === 'Xuất sắc') && (conduct === 'Tốt' || conduct === 'Khá')) {
    return 'Học sinh Tiên tiến';
  }
  return 'Hoàn thành chương trình';
}

/**
 * Helper định dạng điểm số dạng 8.5 thay vì 8.50 hoặc trống
 */
export function formatScore(num?: number | null): string {
  if (num === null || num === undefined || isNaN(num)) return '-';
  return num.toFixed(1);
}
