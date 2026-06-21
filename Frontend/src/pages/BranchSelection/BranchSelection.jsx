import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgBranch from '../../assets/branch-bg.png';
import branchA from '../../assets/cabang-a.png';
import branchB from '../../assets/cabang-b.png';
import { Store, ArrowRight, MapPin } from 'lucide-react';

const branches = [
  {
    id: 1,
    name: 'Cabang A - Pasar Minggu',
    address: 'Jl. Raya Pasar Minggu No. 45, Pejaten Timur, Jakarta Selatan.',
    image: branchA,
    status: 'Buka',
  },
  {
    id: 2,
    name: 'Cabang B - BSD City',
    address: 'Ruko CBD BSD Lot 2, Jl. Pahlawan Seribu, Lengkong Gudang, Tangerang Selatan.',
    image: branchB,
    status: 'Buka',
  },
];

export default function BranchSelection() {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const navigate = useNavigate();

  const handleSelect = (branch) => {
    setSelectedBranch(branch.id);

    localStorage.setItem(
      'selectedBranch',
      JSON.stringify(branch)
    );

    setTimeout(() => {
      navigate('/login');
    }, 300);
  };

  return (
    
  <div
    className="min-h-screen relative overflow-hidden flex items-center justify-center p-8"
    style={{
      backgroundImage: `url(${bgBranch})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    <div className="absolute -top-[350px] -left-[250px] w-[1000px] h-[1000px] rounded-full bg-[#dfe7ff] blur-[80px]" />

    <div className="absolute -bottom-[350px] -right-[250px] w-[1000px] h-[1000px] rounded-full bg-cyan-200 blur-[80px]" />

{/* Main Container */}
<div className="relative z-10 w-full max-w-4xl mx-auto">

  {/* Header */}
  <div className="text-center mb-12">

    <div className="flex justify-center mb-6">
        <div className="bg-white rounded-2xl p-4 shadow">
        <Store size={32} className="text-blue-900" />
      </div>
    </div>

    <h1 className="text-4xl font-bold text-blue-900">
      Selamat Datang!
    </h1>

    <p className="text-gray-600 mt-4">
      Silakan pilih cabang hari ini untuk memulai sesi operasional Anda.
    </p>

  </div>

  {/* Branch Cards */}
  <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">

    {branches.map((branch) => (
      <button
        key={branch.id}
        onClick={() => handleSelect(branch)}
        className="group bg-white rounded-[28px] overflow-hidden shadow hover:shadow-xl transition-all duration-300 text-left"
      >
        <div className="relative">

          <img
            src={branch.image}
            alt={branch.name}
            className="w-full h-52 object-cover"
          />

          <div className="absolute top-4 right-4 bg-white px-4 py-1 rounded-full text-sm font-semibold text-blue-900">
            ● Buka
          </div>

        </div>

        <div className="p-6">

          <h3 className="text-2xl font-bold text-blue-900 mb-4">
            {branch.name}
          </h3>
          <div className="flex gap-2 items-start">
         <MapPin size={16} className="text-gray-400 mt-1 shrink-0" />
          <p className="text-gray-600 text-sm">
            {branch.address}
          </p>
        </div>

          <div className="flex items-center justify-between mt-8">

            <span className="font-semibold text-blue-900">
              Pilih Cabang
            </span>

            <div className="w-10 h-10 rounded-full bg-[#e6e8ff] flex items-center justify-center">
            <ArrowRight size={18} className="text-blue-900" />
          </div>

          </div>

        </div>

      </button>
    ))}

  </div>

  {/* Footer */}
  <div className="text-center text-xs text-gray-300 mt-16">
    © 2026 Nicky Frozen. All rights reserved.
  </div>

</div>

  </div>
);
}
