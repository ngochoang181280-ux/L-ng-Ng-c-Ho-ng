import React, { useState } from 'react';
import { GraduationCap, Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

interface TeacherLoginViewProps {
  onLoginSuccess: () => void;
  onOpenStudentPortal: () => void;
  teacherName?: string;
  schoolName?: string;
  className?: string;
}

export const TeacherLoginView: React.FC<TeacherLoginViewProps> = ({
  onLoginSuccess,
  onOpenStudentPortal,
  teacherName = 'Cô Lê Thị Hoài Bảo',
  schoolName = 'TRƯỜNG THPT LÊ QUÝ ĐÔN',
  className = '10A1',
}) => {
  const [username, setUsername] = useState('Hoaibao');
  const [password, setPassword] = useState('10011982');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    // Kiểm tra tên đăng nhập và mật khẩu theo yêu cầu:
    // Tên đăng nhập: Hoaibao (không phân biệt hoa thường để tiện nhập)
    // Mật khẩu: 10011982
    if (trimmedUser.toLowerCase() === 'hoaibao' && trimmedPass === '10011982') {
      if (rememberMe) {
        localStorage.setItem('teacher_auth_token', 'Hoaibao_authenticated');
      } else {
        sessionStorage.setItem('teacher_auth_token', 'Hoaibao_authenticated');
      }
      setErrorMsg(null);
      onLoginSuccess();
    } else {
      setErrorMsg('Tên đăng nhập hoặc mật khẩu không chính xác! Vui lòng kiểm tra lại.');
    }
  };

  const handleFillDemo = () => {
    setUsername('Hoaibao');
    setPassword('10011982');
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-neutral-900 to-teal-950 flex flex-col justify-between p-4 sm:p-6 text-neutral-100">
      {/* Top Bar */}
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-sm text-white tracking-wide">{schoolName}</div>
            <div className="text-xs text-emerald-300">Sổ Chủ Nhiệm Điện Tử & Quản Lý Giáo Dục</div>
          </div>
        </div>

        <button
          onClick={onOpenStudentPortal}
          className="text-xs font-semibold text-emerald-300 hover:text-white bg-white/10 hover:bg-white/20 px-3.5 py-2 rounded-xl transition-colors inline-flex items-center gap-1.5 border border-white/10 shadow-xs"
        >
          <span>Cổng thi học sinh</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto py-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl text-neutral-900 space-y-6 animate-in zoom-in-95">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-black text-neutral-900">
              Đăng Nhập Giáo Viên Chủ Nhiệm
            </h1>
            <p className="text-xs font-semibold text-emerald-800">
              GVCN: {teacherName}
            </p>
            <p className="text-[11px] text-neutral-500">
              {schoolName} · Lớp {className} · Năm học 2024 - 2025
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Tên đăng nhập */}
            <div>
              <label className="block font-semibold text-neutral-700 mb-1.5">
                Tên đăng nhập (Tài khoản GVCN):
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Hoaibao"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white"
                />
              </div>
            </div>

            {/* Mật khẩu */}
            <div>
              <label className="block font-semibold text-neutral-700 mb-1.5">
                Mật khẩu đăng nhập:
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me & Quick fill */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-600 text-xs">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>Ghi nhớ đăng nhập</span>
              </label>

              <button
                type="button"
                onClick={handleFillDemo}
                className="text-emerald-700 hover:text-emerald-800 font-semibold text-xs inline-flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Điền nhanh mật khẩu</span>
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 mt-4"
            >
              <span>Đăng nhập vào Sổ chủ nhiệm</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Student Portal Switch link */}
          <div className="pt-4 border-t border-neutral-100 text-center text-xs">
            <span className="text-neutral-500">Bạn là Học sinh tham gia kiểm tra? </span>
            <button
              onClick={onOpenStudentPortal}
              className="font-bold text-emerald-700 hover:text-emerald-800 underline ml-1"
            >
              Chuyển sang Cổng làm bài thi
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-neutral-400 py-3">
        Sổ Chủ Nhiệm Điện Tử · Tài khoản: <strong>Hoaibao</strong> · Tiêu chuẩn Bộ Giáo dục & Đào tạo Việt Nam
      </div>
    </div>
  );
};
