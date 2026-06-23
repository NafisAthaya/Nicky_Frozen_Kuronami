import { MdWarningAmber } from 'react-icons/md';

export default function WarningModal({
  isOpen,
  onClose,
  title = 'Peringatan',
  description = 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
  buttonText = 'Ya, Lanjutkan',
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        
        {/* Icon */}
        <div className="mb-5 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <MdWarningAmber
              size={44}
              className="text-red-600"
            />
          </div>
        </div>

        {/* Content */}
        <div className="mb-6 text-center">
          <h2 className="mb-3 text-2xl font-bold text-slate-800">
            {title}
          </h2>

          {description && (
            <p className="text-sm leading-relaxed text-slate-600">
              {description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            id="btn-warning-cancel"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Batal
          </button>

          <button
            id="btn-warning-confirm"
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-red-700 px-4 py-3 font-medium text-white transition hover:bg-red-800"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}