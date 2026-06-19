import { useState } from 'react';

const initialEmployees = [
  {
    id: 'EMP-01',
    name: 'Minji',
    email: 'minji@nickyfrozen.com',
    phone: '+62 812-3456-7890',
    role: 'Kasir',
    branch: 'Cabang Utama',
    status: 'Aktif',
    avatar: 'https://ui-avatars.com/api/?name=Minji&background=e0f2fe&color=0369a1&bold=true&size=40',
  },
  {
    id: 'EMP-02',
    name: 'Hanni',
    email: 'hanni@nickyfrozen.com',
    phone: '+62 823-4567-8901',
    role: 'Kasir',
    branch: 'Cabang Depok',
    status: 'Aktif',
    avatar: 'https://ui-avatars.com/api/?name=Hanni&background=fef3c7&color=b45309&bold=true&size=40',
  },
  {
    id: 'EMP-03',
    name: 'Danielle',
    email: 'danielle@nickyfrozen.com',
    phone: '+62 834-5678-9012',
    role: 'Supervisor',
    branch: 'Cabang Kelapa Gading',
    status: 'Aktif',
    avatar: 'https://ui-avatars.com/api/?name=Danielle&background=dcfce7&color=15803d&bold=true&size=40',
  },
  {
    id: 'EMP-04',
    name: 'Hyein',
    email: 'hyein@nickyfrozen.com',
    phone: '+62 845-6789-0123',
    role: 'Gudang',
    branch: 'Cabang Bekasi',
    status: 'Terblokir',
    avatar: 'https://ui-avatars.com/api/?name=Hyein&background=fee2e2&color=b91c1c&bold=true&size=40',
  },
];

export default function Profil() {
  const [activeTab, setActiveTab] = useState('profil-saya'); // 'profil-saya', 'keamanan', 'kelola-karyawan'

  // Tab 1: Profil Saya states
  const [firstName, setFirstName] = useState('Nicky');
  const [lastName, setLastName] = useState('Owner');
  const [email, setEmail] = useState('nickyowner@gmail.com');
  const [phone, setPhone] = useState('+62 821-2345-6789');
  const [profileSuccessModal, setProfileSuccessModal] = useState(false);

  // Tab 2: Keamanan states
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccessModal, setPasswordSuccessModal] = useState(false);
  const [sessions, setSessions] = useState([
    { id: 1, device: 'Windows PC - Chrome', location: 'Jakarta, Indonesia', time: 'Hari ini, 14:32', active: true },
    { id: 2, device: 'MacBook Pro - Safari', location: 'Bandung, Indonesia', time: 'Kemarin, 09:15', active: false }
  ]);
  const [sessionsClearedModal, setSessionsClearedModal] = useState(false);

  // Tab 3: Kelola Karyawan states
  const [employees, setEmployees] = useState(initialEmployees);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('Semua Jabatan');
  const [selectedBranch, setSelectedBranch] = useState('Semua Cabang');
  
  // Employee Modals
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [showAddEmpSuccess, setShowAddEmpSuccess] = useState(false);
  const [showResetPwModal, setShowResetPwModal] = useState(false);
  const [showResetPwSuccess, setShowResetPwSuccess] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  
  // Selection states
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [generatedPw, setGeneratedPw] = useState('');

  // Form states for new employee
  const [empName, setEmpName] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empPhone, setEmpPhone] = useState('');
  const [empRole, setEmpRole] = useState('Kasir');
  const [empBranch, setEmpBranch] = useState('Cabang Utama');

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'Semua Jabatan' || emp.role === selectedRole;
    const matchesBranch = selectedBranch === 'Semua Cabang' || emp.branch === selectedBranch;
    return matchesSearch && matchesRole && matchesBranch;
  });

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!empName.trim() || !empEmail.trim()) return;

    const newEmp = {
      id: `EMP-0${employees.length + 1}`,
      name: empName,
      email: empEmail,
      phone: empPhone || '+62 800-000-000',
      role: empRole,
      branch: empBranch,
      status: 'Aktif',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(empName)}&background=e0f2fe&color=0369a1&bold=true&size=40`,
    };

    setEmployees([...employees, newEmp]);
    setShowAddEmpModal(false);
    setShowAddEmpSuccess(true);

    // Clear forms
    setEmpName('');
    setEmpEmail('');
    setEmpPhone('');
  };

  const triggerResetPassword = (emp) => {
    setSelectedEmp(emp);
    setShowResetPwModal(true);
  };

  const handleResetPassword = () => {
    // Generate a random-like password for figma flow simulation
    const randomPass = 'nicky' + Math.floor(100 + Math.random() * 900);
    setGeneratedPw(randomPass);
    setShowResetPwModal(false);
    setShowResetPwSuccess(true);
  };

  const triggerBlockToggle = (emp) => {
    setSelectedEmp(emp);
    setShowBlockConfirm(true);
  };

  const handleBlockToggle = () => {
    if (!selectedEmp) return;
    setEmployees(
      employees.map((e) =>
        e.id === selectedEmp.id
          ? { ...e, status: e.status === 'Aktif' ? 'Terblokir' : 'Aktif' }
          : e
      )
    );
    setShowBlockConfirm(false);
  };

  const handleClearSessions = () => {
    setSessions(sessions.filter(s => s.active));
    setSessionsClearedModal(true);
  };

  return (
    <div className="animate-fadeIn max-w-6xl">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Profil</h1>
        <p className="text-sm text-gray-500">Kelola detail profil, keamanan akun, dan akses staf POS Anda.</p>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-100 mb-8 gap-6">
        <button
          onClick={() => setActiveTab('profil-saya')}
          className={`pb-4 text-sm font-bold transition-all relative ${
            activeTab === 'profil-saya' ? 'text-[#0052cc]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Profil Saya
          {activeTab === 'profil-saya' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0052cc] rounded-full" />}
        </button>
        <button
          onClick={() => setActiveTab('keamanan')}
          className={`pb-4 text-sm font-bold transition-all relative ${
            activeTab === 'keamanan' ? 'text-[#0052cc]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Keamanan Akun
          {activeTab === 'keamanan' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0052cc] rounded-full" />}
        </button>
        <button
          onClick={() => setActiveTab('kelola-karyawan')}
          className={`pb-4 text-sm font-bold transition-all relative ${
            activeTab === 'kelola-karyawan' ? 'text-[#0052cc]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Kelola Karyawan
          {activeTab === 'kelola-karyawan' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0052cc] rounded-full" />}
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'profil-saya' && (
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Avatar Column */}
          <div className="lg:col-span-4 flex flex-col items-center border-b lg:border-b-0 lg:border-r border-slate-100 pb-8 lg:pb-0 lg:pr-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-50 shadow-inner flex items-center justify-center bg-blue-600 text-white font-black text-3xl">
                <img
                  src="https://ui-avatars.com/api/?name=Nicky+Owner&background=2563eb&color=fff&bold=true&size=128"
                  alt="Avatar Owner"
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full shadow-lg transition-transform hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            <h3 className="font-bold text-slate-800 text-lg mt-4">{firstName} {lastName}</h3>
            <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-600 rounded-full mt-1.5 uppercase tracking-wide">Owner</span>
          </div>

          {/* Form Fields Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Nama Depan</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Nama Belakang</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Alamat Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Nomor Telepon</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
            </div>

            {/* Aksi */}
            <div className="flex justify-end gap-3 pt-6 border-t border-slate-50">
              <button
                onClick={() => {
                  setFirstName('Nicky');
                  setLastName('Owner');
                  setEmail('nickyowner@gmail.com');
                  setPhone('+62 821-2345-6789');
                }}
                className="px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-bold rounded-xl transition-all"
              >
                Batal
              </button>
              <button
                onClick={() => setProfileSuccessModal(true)}
                className="px-6 py-3 bg-[#0052cc] hover:bg-[#0047b3] text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-blue-100"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'keamanan' && (
        <div className="space-y-6">
          {/* Ganti Kata Sandi & Kekuatan */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form password */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
              <h3 className="text-base font-bold text-slate-800 mb-2">Ganti Kata Sandi</h3>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Kata Sandi Saat Ini</label>
                <input
                  type="password"
                  value={currPassword}
                  onChange={(e) => setCurrPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Kata Sandi Baru</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Konfirmasi Kata Sandi Baru</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    if (newPassword && newPassword === confirmPassword) {
                      setPasswordSuccessModal(true);
                      setCurrPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }
                  }}
                  className="px-6 py-3 bg-[#0052cc] hover:bg-[#0047b3] text-white text-sm font-bold rounded-xl transition-all shadow-md"
                >
                  Perbarui Kata Sandi
                </button>
              </div>
            </div>

            {/* Kekuatan Password card panel */}
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm flex flex-col justify-center items-center text-center">
              <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-500 mb-4 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">Kekuatan Kata Sandi</h4>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">Gunakan kombinasi simbol, angka, huruf besar dan kecil agar aman.</p>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold border border-green-200">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Sangat Kuat
              </div>
            </div>
          </div>

          {/* Sesi Aktivitas */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-800">Daftar Masuk / Aktivitas Sesi</h3>
                <p className="text-xs text-slate-400 mt-0.5">Sesi aktif login yang saat ini terhubung ke akun Owner Anda.</p>
              </div>
              <button
                onClick={handleClearSessions}
                className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl transition-all"
              >
                Keluar dari Semua Sesi Lain
              </button>
            </div>

            <div className="space-y-4 divide-y divide-slate-50">
              {sessions.map((sess) => (
                <div key={sess.id} className="flex items-center justify-between pt-4 first:pt-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{sess.device}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{sess.location} • {sess.time}</p>
                    </div>
                  </div>
                  {sess.active ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 border border-green-200 rounded-full text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Sesi Aktif
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-400 border border-slate-200 rounded-full text-[10px] font-bold">
                      Selesai
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'kelola-karyawan' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 flex items-center gap-4 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Karyawan</p>
                <p className="text-2xl font-black text-slate-800">12 Orang</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 p-6 flex items-center gap-4 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sedang Shift</p>
                <p className="text-2xl font-black text-green-600">4 Orang</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 p-6 flex items-center gap-4 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Terblokir</p>
                <p className="text-2xl font-black text-red-600">1 Orang</p>
              </div>
            </div>
          </div>

          {/* Filter, Search & Add Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-1 flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Cari Karyawan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all bg-white"
                />
              </div>

              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white focus:outline-none"
              >
                <option value="Semua Jabatan">Semua Jabatan</option>
                <option value="Kasir">Kasir</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Gudang">Gudang</option>
              </select>

              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white focus:outline-none"
              >
                <option value="Semua Cabang">Semua Cabang</option>
                <option value="Cabang Utama">Cabang Utama</option>
                <option value="Cabang Depok">Cabang Depok</option>
                <option value="Cabang Kelapa Gading">Cabang Kelapa Gading</option>
                <option value="Cabang Bekasi">Cabang Bekasi</option>
              </select>
            </div>

            <button
              onClick={() => setShowAddEmpModal(true)}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-[#0052cc] text-white text-sm font-bold rounded-2xl hover:bg-[#0047b3] transition-all shadow-md shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Tambah Karyawan Baru
            </button>
          </div>

          {/* Employees Table */}
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[10px] font-black tracking-wider">
                  <th className="px-6 py-4">Nama</th>
                  <th className="px-6 py-4">Jabatan</th>
                  <th className="px-6 py-4">Cabang</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={emp.avatar} alt={emp.name} className="w-10 h-10 rounded-full border border-slate-100 object-cover" />
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{emp.name}</p>
                          <span className="text-[10px] font-semibold text-slate-400">{emp.email} • {emp.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-600">{emp.role}</td>
                    <td className="px-6 py-4 text-slate-500">{emp.branch}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                        emp.status === 'Aktif'
                          ? 'bg-green-50 text-green-600 border-green-200'
                          : 'bg-red-50 text-red-500 border-red-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${emp.status === 'Aktif' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => triggerResetPassword(emp)}
                          title="Reset Kata Sandi"
                          className="w-8 h-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m-2 4a5 5 0 0110 0v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a5 5 0 0110 0M10 17v-3a2 2 0 114 0v3m-4 0h4" />
                          </svg>
                        </button>
                        <button
                          onClick={() => triggerBlockToggle(emp)}
                          title={emp.status === 'Aktif' ? 'Blokir Akses' : 'Buka Akses'}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                            emp.status === 'Aktif'
                              ? 'text-slate-400 hover:text-red-500 hover:bg-red-50'
                              : 'text-slate-400 hover:text-green-600 hover:bg-green-50'
                          }`}
                        >
                          {emp.status === 'Aktif' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Profil Saya Sukses */}
      {profileSuccessModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl p-8 text-center border border-slate-100 flex flex-col items-center animate-scaleIn">
            <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-500 mb-4 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Perubahan Berhasil Disimpan</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6 max-w-xs">Detail profil Anda telah berhasil diperbarui.</p>
            <button
              onClick={() => setProfileSuccessModal(false)}
              className="w-full bg-[#0052cc] hover:bg-[#0047b3] text-white text-xs font-black py-3.5 rounded-2xl shadow-lg transition-colors"
            >
              Selesai
            </button>
          </div>
        </div>
      )}

      {/* Modal: Password Sukses */}
      {passwordSuccessModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl p-8 text-center border border-slate-100 flex flex-col items-center animate-scaleIn">
            <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-500 mb-4 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Kata Sandi Diperbarui</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6 max-w-xs">Kata sandi akun Owner Anda berhasil diperbarui. Silakan gunakan sandi baru untuk masuk selanjutnya.</p>
            <button
              onClick={() => setPasswordSuccessModal(false)}
              className="w-full bg-[#0052cc] hover:bg-[#0047b3] text-white text-xs font-black py-3.5 rounded-2xl shadow-lg transition-colors"
            >
              Selesai
            </button>
          </div>
        </div>
      )}

      {/* Modal: Sesi Dikeluarkan Sukses */}
      {sessionsClearedModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl p-8 text-center border border-slate-100 flex flex-col items-center animate-scaleIn">
            <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-500 mb-4 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Sesi Lain Dikeluarkan</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6 max-w-xs">Semua sesi masuk perangkat lain telah dikeluarkan dengan sukses demi keamanan akun.</p>
            <button
              onClick={() => setSessionsClearedModal(false)}
              className="w-full bg-[#0052cc] hover:bg-[#0047b3] text-white text-xs font-black py-3.5 rounded-2xl shadow-lg transition-colors"
            >
              Selesai
            </button>
          </div>
        </div>
      )}

      {/* Modal: Tambah Karyawan Baru */}
      {showAddEmpModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleAddEmployee}
            className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 flex flex-col animate-scaleIn"
          >
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Tambah Karyawan Baru</h3>
              <button
                type="button"
                onClick={() => setShowAddEmpModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-8 py-6 space-y-4 overflow-y-auto max-h-[70vh]">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap Staf"
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Email *</label>
                <input
                  type="email"
                  required
                  placeholder="staf@nickyfrozen.com"
                  value={empEmail}
                  onChange={(e) => setEmpEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Nomor Telepon</label>
                <input
                  type="text"
                  placeholder="+62 8xx-xxxx-xxxx"
                  value={empPhone}
                  onChange={(e) => setEmpPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Jabatan *</label>
                  <select
                    value={empRole}
                    onChange={(e) => setEmpRole(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 bg-white focus:outline-none"
                  >
                    <option value="Kasir">Kasir</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Gudang">Gudang</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Cabang Bertugas *</label>
                  <select
                    value={empBranch}
                    onChange={(e) => setEmpBranch(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 bg-white focus:outline-none"
                  >
                    <option value="Cabang Utama">Cabang Utama</option>
                    <option value="Cabang Kelapa Gading">Cabang Kelapa Gading</option>
                    <option value="Cabang Depok">Cabang Depok</option>
                    <option value="Cabang Bekasi">Cabang Bekasi</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddEmpModal(false)}
                className="px-5 py-2.5 border border-slate-200 hover:bg-white text-slate-600 text-xs font-bold rounded-xl transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0052cc] hover:bg-[#0047b3] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-100"
              >
                Simpan Karyawan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Tambah Karyawan Sukses */}
      {showAddEmpSuccess && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl p-8 text-center border border-slate-100 flex flex-col items-center animate-scaleIn">
            <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-500 mb-4 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Karyawan Berhasil Ditambahkan!</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6 max-w-xs">Data karyawan baru telah berhasil disimpan ke dalam sistem.</p>
            <button
              onClick={() => setShowAddEmpSuccess(false)}
              className="w-full bg-[#0052cc] hover:bg-[#0047b3] text-white text-xs font-black py-3.5 rounded-2xl shadow-lg transition-colors"
            >
              Selesai
            </button>
          </div>
        </div>
      )}

      {/* Modal: Reset Kata Sandi Confirm */}
      {showResetPwModal && selectedEmp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl p-8 border border-slate-100 flex flex-col animate-scaleIn">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Reset Kata Sandi</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-5">
              Apakah Anda yakin ingin mereset kata sandi staf <strong>{selectedEmp.name}</strong>? Kata sandi baru akan dibuat secara otomatis oleh sistem.
            </p>
            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setShowResetPwModal(false)}
                className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl transition-all"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleResetPassword}
                className="px-5 py-2.5 bg-[#0052cc] hover:bg-[#0047b3] text-white text-xs font-bold rounded-xl transition-all shadow-md"
              >
                Ya, Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Kata Sandi Berhasil Dibuat Ulang */}
      {showResetPwSuccess && selectedEmp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl p-8 text-center border border-slate-100 flex flex-col items-center animate-scaleIn">
            <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-500 mb-4 shadow-inner animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Kata Sandi Berhasil Dibuat Ulang</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4 max-w-xs">
              Kata sandi baru untuk staf <strong>{selectedEmp.name}</strong> telah dibuat. Mohon salin dan berikan kepada yang bersangkutan:
            </p>
            <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-6 font-mono font-bold text-lg text-slate-800 select-all cursor-pointer hover:bg-slate-100 transition-colors">
              {generatedPw}
            </div>
            <button
              onClick={() => {
                setShowResetPwSuccess(false);
                setSelectedEmp(null);
              }}
              className="w-full bg-[#0052cc] hover:bg-[#0047b3] text-white text-xs font-black py-3.5 rounded-2xl shadow-lg transition-colors"
            >
              Selesai
            </button>
          </div>
        </div>
      )}

      {/* Modal: Blokir Confirm */}
      {showBlockConfirm && selectedEmp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl p-8 border border-slate-100 flex flex-col animate-scaleIn">
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              {selectedEmp.status === 'Aktif' ? 'Blokir Akses Staf?' : 'Buka Akses Staf?'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-5">
              Apakah Anda yakin ingin {selectedEmp.status === 'Aktif' ? 'memblokir' : 'membuka kembali'} akses staf <strong>{selectedEmp.name}</strong> pada sistem POS Nicky Frozen?
            </p>
            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowBlockConfirm(false);
                  setSelectedEmp(null);
                }}
                className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl transition-all"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleBlockToggle}
                className={`px-5 py-2.5 text-white text-xs font-bold rounded-xl transition-all shadow-md ${
                  selectedEmp.status === 'Aktif' ? 'bg-red-500 hover:bg-red-600' : 'bg-[#0052cc] hover:bg-[#0047b3]'
                }`}
              >
                {selectedEmp.status === 'Aktif' ? 'Ya, Blokir' : 'Ya, Buka Akses'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
