import { MdCheckCircle } from 'react-icons/md';

export default function SuccessModal({
  isOpen,
  onClose,
  title = 'Pengajuan Berhasil Dikirim!',
  description = 'Pengajuan restock telah diteruskan ke Owner. Anda akan menerima notifikasi saat status pengajuan diperbarui.',
  buttonText = 'Selesai',
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      id="success-modal-overlay"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <MdCheckCircle className="text-6xl text-green-600" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="mb-4 text-2xl font-bold text-slate-800">
            {title}
          </h2>

          {description && (
            <p className="text-sm leading-relaxed text-slate-500">
              {description}
            </p>
          )}
        </div>

        <button
          onClick={onClose}
          id="btn-success-selesai"
          className="w-full rounded-xl bg-slate-900 py-3 font-semibold text-white transition hover:bg-slate-800"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}