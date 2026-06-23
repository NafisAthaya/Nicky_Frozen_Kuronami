import { createContext, useContext, useState, useCallback } from 'react';

// Initial mock notifications data
const initialNotifications = [
  {
    id: 1,
    type: 'approval',
    title: 'Persetujuan Diberikan',
    message: 'Admin telah menyetujui pembatalan pesanan #TRX-0920. Silakan lanjutkan transaksi.',
    time: 'Baru saja',
    isRead: false,
    isPenting: false,
    section: 'recent',
  },
  {
    id: 2,
    type: 'promo',
    title: 'Pembaruan Promo Cepat',
    message: "Promo Kilat 'Beli 2 Gratis 1 Nugget' sudah aktif. Harap tawarkan ke pelanggan.",
    time: '10 mnt lalu',
    isRead: false,
    isPenting: false,
    section: 'recent',
  },
  {
    id: 3,
    type: 'warning',
    title: 'Peringatan Selisih Kas',
    message: 'Laporan setoran Shift Pagi memiliki selisih minus Rp 15.000. Mohon periksa kembali laci uang Anda.',
    time: '1 jam lalu',
    isRead: false,
    isPenting: false,
    section: 'recent',
  },
  {
    id: 4,
    type: 'system',
    title: 'Pemberitahuan Sistem',
    message: 'Sistem akan mengalami pembaruan (maintenance) dalam 10 menit.',
    time: '',
    isRead: false,
    isPenting: true,
    section: 'recent',
  },
  {
    id: 5,
    type: 'stock',
    title: 'Stok Masuk',
    message: 'Pengiriman Sosis Sapi (50 pack) telah diterima di gudang depan.',
    time: 'Kemarin',
    isRead: false,
    isPenting: false,
    section: 'older',
  },
];

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(initialNotifications);

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Mark a single notification as read
  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
