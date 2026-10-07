import React, { useRef, useState } from 'react';
import { AppState, exportBackupJSON, getFreshDefaultState } from '../utils/storage';
import { Database, Download, Upload, RotateCcw, X, Check, AlertTriangle } from 'lucide-react';

interface DataBackupModalProps {
  appState: AppState;
  onRestoreState: (state: AppState) => void;
  onClose: () => void;
}

export const DataBackupModal: React.FC<DataBackupModalProps> = ({
  appState,
  onRestoreState,
  onClose,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const handleExport = () => {
    exportBackupJSON(appState);
    setNotification('Đã xuất file sao lưu JSON thành công!');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.students && parsed.classInfo) {
          onRestoreState(parsed);
          setNotification('Đã nạp thành công dữ liệu từ file sao lưu!');
          setTimeout(() => {
            onClose();
          }, 1500);
        } else {
          alert('Tệp tin không đúng định dạng sao lưu Sổ Chủ Nhiệm!');
        }
      } catch (err) {
        alert('Lỗi đọc tệp JSON. Vui lòng kiểm tra lại file!');
      }
    };
    reader.readAsText(file);
  };

  const handleResetToDefault = () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục về bộ dữ liệu mẫu ban đầu của lớp 10A1?')) {
      const fresh = getFreshDefaultState();
      onRestoreState(fresh);
      setNotification('Đã khôi phục dữ liệu mẫu ban đầu!');
      setTimeout(() => {
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-700" />
            <h2 className="text-sm font-bold text-neutral-900">
              Quản lý Dữ liệu Sổ Chủ Nhiệm
            </h2>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          {notification && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{notification}</span>
            </div>
          )}

          <p className="text-neutral-600 leading-relaxed">
            Dữ liệu sổ chủ nhiệm (danh sách học sinh, điểm số, điểm danh, nề nếp thi đua, sơ đồ chỗ ngồi) được lưu trữ an toàn trong trình duyệt của bạn. Bạn có thể tải file sao lưu về máy để lưu trữ hoặc chuyển qua máy tính khác.
          </p>

          <div className="space-y-3 pt-2">
            {/* Tải về sao lưu */}
            <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/60 flex items-center justify-between">
              <div>
                <div className="font-semibold text-neutral-900">1. Xuất file sao lưu (Backup JSON)</div>
                <div className="text-[11px] text-neutral-500">Tải toàn bộ dữ liệu lớp học về máy tính</div>
              </div>
              <button
                onClick={handleExport}
                className="px-3.5 py-1.5 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-colors shadow-2xs inline-flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải về</span>
              </button>
            </div>

            {/* Phục hồi sao lưu */}
            <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/60 flex items-center justify-between">
              <div>
                <div className="font-semibold text-neutral-900">2. Phục hồi từ file đã lưu</div>
                <div className="text-[11px] text-neutral-500">Nạp lại dữ liệu từ tệp tin JSON đã sao lưu</div>
              </div>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".json"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 bg-white border border-neutral-300 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-50 transition-colors shadow-2xs inline-flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Chọn file</span>
                </button>
              </div>
            </div>

            {/* Khôi phục mặc định */}
            <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/30 flex items-center justify-between">
              <div>
                <div className="font-semibold text-rose-900">3. Khôi phục dữ liệu mẫu ban đầu</div>
                <div className="text-[11px] text-rose-700">Khôi phục đầy đủ 36 học sinh lớp 10A1 mẫu</div>
              </div>
              <button
                onClick={handleResetToDefault}
                className="px-3.5 py-1.5 bg-white border border-rose-300 text-rose-700 font-semibold rounded-lg hover:bg-rose-50 transition-colors shadow-2xs inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Khôi phục</span>
              </button>
            </div>
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
