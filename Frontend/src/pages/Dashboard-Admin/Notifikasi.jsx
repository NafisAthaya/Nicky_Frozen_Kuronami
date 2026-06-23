import { useNavigate } from 'react-router-dom';
import {
  MdCheckCircleOutline,
  MdCampaign,
  MdWarningAmber,
  MdErrorOutline,
  MdInventory,
  MdDoneAll,
  MdArrowBack,
} from 'react-icons/md';

import { useNotifications } from '../../context/NotificationContext';

const typeConfig = {
  approval: {
    icon: MdCheckCircleOutline,
    bg: 'bg-green-100',
    text: 'text-green-600',
  },
  promo: {
    icon: MdCampaign,
    bg: 'bg-blue-100',
    text: 'text-blue-600',
  },
  warning: {
    icon: MdWarningAmber,
    bg: 'bg-yellow-100',
    text: 'text-yellow-600',
  },
  system: {
    icon: MdErrorOutline,
    bg: 'bg-red-100',
    text: 'text-red-600',
  },
  stock: {
    icon: MdInventory,
    bg: 'bg-indigo-100',
    text: 'text-indigo-600',
  },
};

function renderMessage(message) {
  const parts = message.split(/(Rp\s[\d.]+)/g);

  return parts.map((part, i) => {
    if (part.match(/^Rp\s[\d.]+$/)) {
      return (
        <span key={i} className="font-semibold text-red-600">
          {part}
        </span>
      );
    }

    const quoteParts = part.split(/('[^']+')/g);

    return quoteParts.map((qp, j) => {
      if (qp.match(/^'[^']+'$/)) {
        return (
          <span
            key={`${i}-${j}`}
            className="font-semibold text-blue-600"
          >
            {qp}
          </span>
        );
      }

      const codeParts = qp.split(/(#[A-Z]+-\d+)/g);

      return codeParts.map((cp, k) => {
        if (cp.match(/^#[A-Z]+-\d+$/)) {
          return (
            <span
              key={`${i}-${j}-${k}`}
              className="font-semibold text-blue-600"
            >
              {cp}
            </span>
          );
        }

        return cp;
      });
    });
  });
}

export default function Notifikasi() {
  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const recentNotifs = notifications.filter(
    (n) => n.section === 'recent'
  );

  const olderNotifs = notifications.filter(
    (n) => n.section === 'older'
  );

  const handleCardClick = (id, isRead) => {
    if (!isRead) {
      markAsRead(id);
    }
  };

  const renderNotifCard = (notif) => {
    const config =
      typeConfig[notif.type] || typeConfig.approval;

    const Icon = config.icon;

    return (
      <div
        key={notif.id}
        onClick={() =>
          handleCardClick(notif.id, notif.isRead)
        }
        className={`
          flex items-start gap-5 p-5 rounded-2xl border cursor-pointer transition-all hover:shadow-md

          ${
            notif.type === 'system'
              ? 'bg-red-50 border-red-100'
              : 'bg-white border-gray-200'
          }

          ${
            notif.isRead
              ? 'opacity-70'
              : 'border-l-4 border-l-[#082B7A]'
          }
        `}
      >
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${config.bg} ${config.text}`}
        >
          <Icon size={22} />
        </div>

        <div className="flex-1">
          <h3
            className={`font-bold mb-1 ${
              notif.type === 'system'
                ? 'text-red-600'
                : 'text-gray-800'
            }`}
          >
            {notif.title}
          </h3>

          <p className="text-sm text-gray-600 leading-relaxed">
            {renderMessage(notif.message)}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          {notif.time && (
            <span className="text-xs text-gray-400">
              {notif.time}
            </span>
          )}

          {notif.isPenting && (
            <span className="text-xs font-bold text-red-600">
              Penting
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Back */}
      <button
        onClick={() => navigate('/admin')}
        className="flex items-center gap-2 text-gray-500 hover:text-[#082B7A] mb-5 transition"
      >
        <MdArrowBack />
        Kembali ke Dashboard
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#082B7A]">
            Pusat Notifikasi
          </h1>

          <p className="text-gray-500 mt-1">
            Pesan dari Admin dan Sistem
          </p>
        </div>

        <button
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          className={`
            flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-white transition

            ${
              unreadCount === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-[#082B7A] hover:bg-[#0B3B91]'
            }
          `}
        >
          <MdDoneAll />
          Tandai semua dibaca
        </button>
      </div>

      {/* Recent */}
      <div className="space-y-4">
        {recentNotifs.length === 0 ? (
          <div className="bg-white border rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🔔</div>

            <h3 className="text-lg font-semibold text-gray-600">
              Belum ada notifikasi
            </h3>

            <p className="text-sm text-gray-400 mt-2">
              Semua notifikasi akan muncul di sini.
            </p>
          </div>
        ) : (
          recentNotifs.map(renderNotifCard)
        )}
      </div>

      {/* Divider */}
      {olderNotifs.length > 0 && (
        <>
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-200" />

            <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
              Lebih Lama
            </span>

            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="space-y-4">
            {olderNotifs.map(renderNotifCard)}
          </div>
        </>
      )}

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 mt-10">
        © 2026 Nicky Frozen. All rights reserved.
      </div>
    </div>
  );
}