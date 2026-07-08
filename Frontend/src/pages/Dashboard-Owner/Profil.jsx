import { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../api/axios';
import useAuthStore from '../../store/authStore';
import { HiEye, HiEyeOff, HiOutlineCamera } from 'react-icons/hi';
import WarningModal from '../../components/admin/WarningModal';
import ownerProfile from '../../assets/OwnerProfile.png';

export default function Profil() {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profil');
  const [isLoading, setIsLoading] = useState(true);

  // State Photo
  const [photo, setPhoto] = useState(
    user?.foto
      ? `http://127.0.0.1:8000/storage/${user.foto}`
      : ownerProfile
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // --- STATE TAB 1: PROFIL SAYA ---
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // --- STATE TAB 2: KEAMANAN ---
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const checkPasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return { label: '-', bgColor: 'bg-gray-50', textColor: 'text-gray-500', borderColor: 'border-gray-200', dotColor: 'bg-gray-400' };
    
    if (pass.length >= 8) score += 1;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[^a-zA-Z\d]/.test(pass)) score += 1;

    if (score <= 1) return { label: 'Lemah', bgColor: 'bg-red-50', textColor: 'text-red-600', borderColor: 'border-red-200', dotColor: 'bg-red-500' };
    if (score === 2) return { label: 'Sedang', bgColor: 'bg-yellow-50', textColor: 'text-yellow-600', borderColor: 'border-yellow-200', dotColor: 'bg-yellow-500' };
    if (score === 3) return { label: 'Kuat', bgColor: 'bg-blue-50', textColor: 'text-blue-600', borderColor: 'border-blue-200', dotColor: 'bg-blue-500' };
    return { label: 'Sangat Kuat', bgColor: 'bg-green-50', textColor: 'text-green-600', borderColor: 'border-green-200', dotColor: 'bg-green-500' };
  };

  const passStrength = checkPasswordStrength(passwordForm.new);

  // --- STATE TAB 3: KARYAWAN ---
  const [karyawanList, setKaryawanList] = useState([]);
  const [cabangList, setCabangList] = useState([]);
  const [searchKaryawan, setSearchKaryawan] = useState('');
  const [roleFilter, setRoleFilter] = useState('Semua Jabatan');
  const [cabangFilter, setCabangFilter] = useState('Semua Cabang');
  
  // State Modal Karyawan
  const [showAddKaryawan, setShowAddKaryawan] = useState(false);
  const [showEditKaryawan, setShowEditKaryawan] = useState(false);
  
  const [newKaryawan, setNewKaryawan] = useState({
    name: '', email: '', phone: '', role: 'kasir', cabang_id: '', password: ''
  });
  
  const [editKaryawanData, setEditKaryawanData] = useState(null);
  const [isUpdatingKaryawan, setIsUpdatingKaryawan] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [karyawanToDelete, setKaryawanToDelete] = useState(null);

  // --- STATE TOAST NOTIFICATION ---
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch Data Awal
  useEffect(() => {
    if (user) {
      const nameParts = user.name ? user.name.split(' ') : ['User', ''];
      setProfileForm({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }

    const fetchAllData = async () => {
      try {
        const resCabang = await axiosInstance.get('/owner/cabang');
        setCabangList(resCabang.data.data || []);

        const resKaryawan = await axiosInstance.get('/owner/karyawan');
        setKaryawanList(resKaryawan.data.data || []);
      } catch (error) {
        console.error("Gagal menarik data profil/karyawan:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (activeTab === 'karyawan') {
      fetchAllData();
    } else {
      setIsLoading(false);
    }

    const handleGlobalSync = () => { if (activeTab === 'karyawan') fetchAllData(); };
    window.addEventListener('global-sync', handleGlobalSync);
    return () => window.removeEventListener('global-sync', handleGlobalSync);
  }, [user, activeTab]);

  // --- HANDLERS PROFIL & KEAMANAN ---
  const handleChoosePhoto = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", { type: "image/webp" });
            setSelectedFile(webpFile);
            setPhoto(URL.createObjectURL(webpFile));
          }
        }, 'image/webp', 0.8);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    let success = false;
    let updatedFoto = user?.foto;
    const updatedName = `${profileForm.firstName} ${profileForm.lastName}`.trim();

    try {
      await axiosInstance.put('/profile/update', {
        name: updatedName,
        email: profileForm.email,
        phone: profileForm.phone
      });
      success = true;
    } catch (error) {
      showToast('Gagal memperbarui profil.', 'error');
      setIsSavingProfile(false);
      return;
    }

    if (selectedFile) {
      const formData = new FormData();
      formData.append("photo", selectedFile);
      formData.append("user_id", user?.id);

      try {
        const response = await axiosInstance.post("/profile/photo", formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        updatedFoto = response.data.path;
      } catch (err) {
        showToast(err.response?.data?.message || 'Gagal mengunggah foto. Silakan coba lagi.', 'error');
        setIsSavingProfile(false);
        return;
      }
    }

    if (success) {
      if(user) {
        updateUser({ ...user, name: updatedName, email: profileForm.email, phone: profileForm.phone, foto: updatedFoto });
      }
      showToast('Profil berhasil diperbarui!', 'success');
    }
    setIsSavingProfile(false);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      return showToast('Konfirmasi kata sandi tidak cocok!', 'error');
    }
    setIsSavingPassword(true);
    try {
      await axiosInstance.put('/profile/password', passwordForm);
      showToast('Kata sandi berhasil diperbarui!', 'success');
      setPasswordForm({ current: '', new: '', confirm: '' });
    } catch (error) {
      showToast('Gagal memperbarui kata sandi. Pastikan sandi lama benar.', 'error');
    } finally {
      setIsSavingPassword(false);
    }
  };

  // --- HANDLERS KARYAWAN ---
  const handleAddKaryawan = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/owner/karyawan', newKaryawan);
      setKaryawanList([res.data.data, ...karyawanList]);
      setShowAddKaryawan(false);
      setNewKaryawan({ name: '', email: '', phone: '', role: 'kasir', cabang_id: '', password: '' });
      showToast('Karyawan berhasil ditambahkan!', 'success');
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Gagal menambahkan karyawan.';
      showToast(`Oops! ${errMsg}`, 'error');
    }
  };

  const handleOpenEdit = (karyawan) => {
    setEditKaryawanData({
      id: karyawan.id,
      name: karyawan.name,
      email: karyawan.email,
      phone: karyawan.phone || '',
      role: karyawan.role,
      cabang_id: karyawan.cabang_id || '',
      password: '' 
    });
    setShowEditKaryawan(true);
  };

  const handleUpdateKaryawanSubmit = async (e) => {
    e.preventDefault();
    setIsUpdatingKaryawan(true);
    try {
      const res = await axiosInstance.put(`/owner/karyawan/${editKaryawanData.id}`, editKaryawanData);
      setKaryawanList(karyawanList.map(k => k.id === editKaryawanData.id ? res.data.data : k));
      setShowEditKaryawan(false);
      showToast('Data karyawan berhasil diperbarui!', 'success');
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Gagal memperbarui karyawan.';
      showToast(`Oops! ${errMsg}`, 'error');
    } finally {
      setIsUpdatingKaryawan(false);
    }
  };

  // PERBAIKAN: Fungsi Toggle Status Karyawan & Sinkronisasi Data Angka "Terblokir"
  const toggleStatusKaryawan = async (id, currentStatus) => {
    // Paksa pastikan nilainya terbaca boolean murni (true/false) bukan string/angka
    const isCurrentlyActive = currentStatus === true || currentStatus === 1;

    // Optimistic UI Update (Reaksi Cepat di Layar)
    setKaryawanList(prev => prev.map(k => 
      k.id === id ? { ...k, is_active: !isCurrentlyActive } : k
    ));

    try {
      const response = await axiosInstance.put(`/owner/karyawan/${id}/toggle`);
      // Update state dengan hasil nyata yang dikembalikan oleh database MySQL
      setKaryawanList(prev => prev.map(k => 
        k.id === id ? response.data.data : k
      ));
      showToast('Status karyawan berhasil diubah.', 'success');
    } catch (error) {
      showToast("Gagal mengubah status karyawan.", 'error');
      // Jika error, kembalikan ke status semula
      setKaryawanList(prev => prev.map(k => 
        k.id === id ? { ...k, is_active: isCurrentlyActive } : k
      ));
    }
  };

  // FUNGSI BARU: Hapus Karyawan
  const triggerDeleteKaryawan = (id) => {
    setKaryawanToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteKaryawan = async () => {
    if (!karyawanToDelete) return;
    const id = karyawanToDelete;
    setIsDeleteModalOpen(false);
    setKaryawanToDelete(null);

    const previousList = [...karyawanList];
    setKaryawanList(karyawanList.filter(k => k.id !== id)); // Hapus dari UI

    try {
      await axiosInstance.delete(`/owner/karyawan/${id}`);
      showToast('Karyawan berhasil dihapus.', 'success');
    } catch (error) {
      showToast('Gagal menghapus karyawan.', 'error');
      setKaryawanList(previousList); // Kembalikan ke UI jika gagal
    }
  };

  // --- FILTER & PERHITUNGAN KARYAWAN ---
  const filteredKaryawan = karyawanList.filter(k => {
    const matchSearch = k.name.toLowerCase().includes(searchKaryawan.toLowerCase()) || 
                        k.email.toLowerCase().includes(searchKaryawan.toLowerCase());
    const matchRole = roleFilter === 'Semua Jabatan' || k.role.toLowerCase() === roleFilter.toLowerCase();
    const matchCabang = cabangFilter === 'Semua Cabang' || k.cabang?.nama_cabang === cabangFilter;
    return matchSearch && matchRole && matchCabang;
  });

  const totalKaryawan = karyawanList.length;
  // Memastikan bahwa data "1" dari MySQL dibaca sebagai aktif (true)
  const activeKaryawan = karyawanList.filter(k => k.is_active === true || k.is_active === 1).length;
  const blockedKaryawan = totalKaryawan - activeKaryawan;

  const userInitials = user && user.name ? user.name.substring(0, 2).toUpperCase() : 'US';

  if (isLoading) return <div className="p-8 text-center text-slate-500 animate-pulse font-medium">Memuat pengaturan...</div>;

  return (
    <div className="animate-fadeIn w-full pb-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Profil</h1>
        <p className="text-sm text-slate-500 mt-1">Kelola detail profil, keamanan akun, dan akses staf POS Anda.</p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-6 border-b border-slate-200 mb-8">
        {[
          { id: 'profil', label: 'Profil Saya' },
          { id: 'keamanan', label: 'Keamanan Akun' },
          { id: 'karyawan', label: 'Kelola Karyawan' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* --- TAB CONTENT: PROFIL SAYA --- */}
      {activeTab === 'profil' && (
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm flex flex-col md:flex-row gap-12 items-start">
          <div className="flex flex-col items-center gap-4 shrink-0 md:w-1/4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg ring-2 ring-blue-100 bg-blue-600 flex items-center justify-center">
                {photo && photo !== ownerProfile ? (
                  <img src={photo} alt="Profil" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-4xl font-black">{userInitials}</span>
                )}
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleChoosePhoto}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all shadow-md hover:shadow-lg mt-2"
            >
              <HiOutlineCamera className="text-lg" />
              Ubah Foto
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handlePhotoChange}
            />

            <div className="text-center mt-2">
              <h2 className="text-xl font-bold text-slate-800">{user?.name || 'Loading...'}</h2>
              <span className="inline-block mt-1 bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                {user?.role || 'OWNER'}
              </span>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="flex-1 w-full space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Nama Depan</label>
                <input type="text" value={profileForm.firstName} onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Nama Belakang</label>
                <input type="text" value={profileForm.lastName} onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Alamat Email</label>
              <input type="email" value={profileForm.email} onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Nomor Telepon</label>
              <input type="text" value={profileForm.phone} onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none" />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button type="submit" disabled={isSavingProfile} className="px-6 py-3 bg-[#0052cc] text-white text-sm font-bold rounded-xl hover:bg-[#0047b3] transition-colors shadow-md shadow-blue-100 disabled:opacity-50">
                {isSavingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- TAB CONTENT: KEAMANAN AKUN --- */}
      {activeTab === 'keamanan' && (
        <div className="flex flex-col md:flex-row gap-6">
          <form onSubmit={handleUpdatePassword} className="flex-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Ganti Kata Sandi</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Kata Sandi Saat Ini</label>
              <div className="relative">
                <input type={showCurrentPass ? "text" : "password"} value={passwordForm.current} onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none pr-12" />
                <button type="button" onClick={() => setShowCurrentPass(!showCurrentPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showCurrentPass ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Kata Sandi Baru</label>
              <div className="relative">
                <input type={showNewPass ? "text" : "password"} value={passwordForm.new} onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none pr-12" />
                <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showNewPass ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Konfirmasi Kata Sandi Baru</label>
              <div className="relative">
                <input type={showConfirmPass ? "text" : "password"} value={passwordForm.confirm} onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none pr-12" />
                <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirmPass ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                </button>
              </div>
            </div>
            <div className="pt-2">
              <button type="submit" disabled={isSavingPassword || !passwordForm.new} className="px-6 py-3 bg-[#0052cc] text-white text-sm font-bold rounded-xl hover:bg-[#0047b3] transition-colors shadow-md disabled:opacity-50">
                Perbarui Kata Sandi
              </button>
            </div>
          </form>

          <div className="md:w-1/3 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm flex flex-col items-center justify-center text-center">
            <div className={`w-16 h-16 rounded-full ${passStrength.bgColor} border ${passStrength.borderColor} flex items-center justify-center ${passStrength.textColor} mb-4 shadow-inner transition-colors duration-300`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h4 className="text-base font-bold text-slate-800 mb-2">Kekuatan Kata Sandi</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">Gunakan kombinasi simbol, angka, huruf besar dan kecil agar aman.</p>
            <span className={`inline-flex items-center gap-1.5 ${passStrength.bgColor} ${passStrength.textColor} border ${passStrength.borderColor} px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-300`}>
              <span className={`w-2 h-2 rounded-full ${passStrength.dotColor}`} />
              {passStrength.label}
            </span>
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: KARYAWAN --- */}
      {activeTab === 'karyawan' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 flex items-center gap-5 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Karyawan</p><p className="text-2xl font-black text-slate-800">{totalKaryawan} Orang</p></div>
            </div>
            <div className="bg-white rounded-3xl border border-slate-100 p-6 flex items-center gap-5 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Karyawan Aktif</p><p className="text-2xl font-black text-green-600">{activeKaryawan} Orang</p></div>
            </div>
            <div className="bg-white rounded-3xl border border-slate-100 p-6 flex items-center gap-5 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Terblokir</p><p className="text-2xl font-black text-red-600">{blockedKaryawan} Orang</p></div>
            </div>
          </div>

          {/* Filters & Actions */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="relative flex-1 w-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Cari Karyawan..." value={searchKaryawan} onChange={(e) => setSearchKaryawan(e.target.value)} className="w-full pl-11 pr-4 py-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none" />
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-4 py-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none bg-white">
                <option value="Semua Jabatan">Semua Jabatan</option>
                <option value="Admin">Admin</option>
                <option value="Kasir">Kasir</option>
              </select>
              <select value={cabangFilter} onChange={(e) => setCabangFilter(e.target.value)} className="px-4 py-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none bg-white">
                <option value="Semua Cabang">Semua Cabang</option>
                {cabangList.map(c => <option key={c.id} value={c.nama_cabang}>{c.nama_cabang}</option>)}
              </select>
              <button onClick={() => setShowAddKaryawan(true)} className="flex items-center gap-2 px-5 py-3 bg-[#0052cc] text-white text-sm font-bold rounded-xl hover:bg-[#0047b3] transition-colors whitespace-nowrap shadow-md">
                + Tambah Karyawan
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-6 py-4">Nama</th>
                  <th className="px-6 py-4">Jabatan</th>
                  <th className="px-6 py-4">Cabang</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredKaryawan.length > 0 ? filteredKaryawan.map(k => (
                  <tr key={k.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-4">
                      {k.foto ? (
                        <img 
                          src={`http://127.0.0.1:8000/storage/${k.foto}`} 
                          alt={k.name} 
                          className="w-10 h-10 rounded-full object-cover shrink-0 border-2 border-white shadow-sm"
                        />
                      ) : (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${k.role === 'admin' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                          {k.name.substring(0,2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-slate-800">{k.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{k.email} &bull; {k.phone || '-'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700 capitalize">{k.role}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{k.cabang?.nama_cabang || '-'}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${k.is_active ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${k.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                        {k.is_active ? 'Aktif' : 'Terblokir'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* TOMBOL EDIT */}
                        <button 
                          onClick={() => handleOpenEdit(k)} 
                          title="Edit Data"
                          className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-all shadow-sm border border-blue-100"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>

                        {/* TOMBOL HAPUS */}
                        <button 
                          onClick={() => triggerDeleteKaryawan(k.id)} 
                          title="Hapus Karyawan"
                          className="w-8 h-8 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all shadow-sm border border-red-100"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                        
                        {/* TOMBOL KUNCI/BLOKIR */}
                        <button 
                          onClick={() => toggleStatusKaryawan(k.id, k.is_active)} 
                          title={k.is_active ? "Blokir Akses" : "Buka Akses"}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shadow-sm border ${
                            k.is_active 
                              ? 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-500 hover:text-white' 
                              : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-500 hover:text-white'
                          }`}
                        >
                          {k.is_active ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400 text-sm">Tidak ada data karyawan ditemukan.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- MODAL TAMBAH KARYAWAN --- */}
      {showAddKaryawan && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleAddKaryawan} className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden animate-scaleIn">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Tambah Karyawan Baru</h3>
              <button type="button" onClick={() => setShowAddKaryawan(false)} className="text-slate-400 hover:text-slate-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="px-8 py-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
                <input type="text" required value={newKaryawan.name} onChange={e=>setNewKaryawan({...newKaryawan, name: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input type="email" required value={newKaryawan.email} onChange={e=>setNewKaryawan({...newKaryawan, email: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">No. HP (Angka)</label>
                  <input type="number" required value={newKaryawan.phone} onChange={e=>setNewKaryawan({...newKaryawan, phone: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jabatan</label>
                  <select value={newKaryawan.role} onChange={e=>setNewKaryawan({...newKaryawan, role: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-100 outline-none">
                    <option value="kasir">Kasir</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cabang Penempatan</label>
                  <select required value={newKaryawan.cabang_id} onChange={e=>setNewKaryawan({...newKaryawan, cabang_id: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-100 outline-none">
                    <option value="">Pilih Cabang</option>
                    {cabangList.map(c => <option key={c.id} value={c.id}>{c.nama_cabang}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kata Sandi Awal</label>
                <input type="text" required value={newKaryawan.password} onChange={e=>setNewKaryawan({...newKaryawan, password: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none" placeholder="Minimal 6 karakter" />
              </div>
            </div>
            <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button type="button" onClick={() => setShowAddKaryawan(false)} className="px-5 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-white transition-all">Batal</button>
              <button type="submit" className="px-5 py-2.5 bg-[#0052cc] text-white text-xs font-bold rounded-xl hover:bg-[#0047b3] shadow-md transition-all">Simpan Karyawan</button>
            </div>
          </form>
        </div>
      )}

      {/* --- MODAL EDIT KARYAWAN --- */}
      {showEditKaryawan && editKaryawanData && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleUpdateKaryawanSubmit} className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden animate-scaleIn">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-blue-50/50">
              <h3 className="text-lg font-bold text-[#0B3B91]">Edit Data Karyawan</h3>
              <button type="button" onClick={() => setShowEditKaryawan(false)} className="text-slate-400 hover:text-slate-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="px-8 py-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
                <input type="text" required value={editKaryawanData.name} onChange={e=>setEditKaryawanData({...editKaryawanData, name: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input type="email" required value={editKaryawanData.email} onChange={e=>setEditKaryawanData({...editKaryawanData, email: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">No. HP (Angka)</label>
                  <input type="number" required value={editKaryawanData.phone} onChange={e=>setEditKaryawanData({...editKaryawanData, phone: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jabatan</label>
                  <select value={editKaryawanData.role} onChange={e=>setEditKaryawanData({...editKaryawanData, role: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-100 outline-none">
                    <option value="kasir">Kasir</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cabang Penempatan</label>
                  <select required value={editKaryawanData.cabang_id} onChange={e=>setEditKaryawanData({...editKaryawanData, cabang_id: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-100 outline-none">
                    {cabangList.map(c => <option key={c.id} value={c.id}>{c.nama_cabang}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kata Sandi (Opsional)</label>
                <input type="text" value={editKaryawanData.password} onChange={e=>setEditKaryawanData({...editKaryawanData, password: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none placeholder-slate-300" placeholder="Kosongkan jika tidak ingin diubah" />
              </div>
            </div>
            <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button type="button" onClick={() => setShowEditKaryawan(false)} className="px-5 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-white transition-all">Batal</button>
              <button type="submit" disabled={isUpdatingKaryawan} className="px-5 py-2.5 bg-[#0B3B91] text-white text-xs font-bold rounded-xl hover:bg-blue-900 shadow-md transition-all disabled:opacity-50">
                {isUpdatingKaryawan ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Warning Modal Delete */}
      <WarningModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Hapus Karyawan"
        description="Peringatan: Anda yakin ingin menghapus akun karyawan ini secara permanen?"
        buttonText="Ya, Hapus"
        onConfirm={confirmDeleteKaryawan}
      />

      {/* --- TOAST NOTIFICATION --- */}
      {toastMessage && (
        <div className={`fixed top-6 right-6 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl z-[100] flex items-center gap-2 border animate-bounce ${
          toastType === 'success' ? 'bg-green-500 border-green-400' : 'bg-red-500 border-red-400'
        }`}>
          {toastType === 'success' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )}
          {toastMessage}
        </div>
      )}

    </div>
  );
}