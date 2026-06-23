import ownerProfile from '../../assets/OwnerProfile.png';

export default function TopBar() {
  return (
    <header className="h-[72px] bg-white border-b border-gray-200 px-6 flex items-center justify-between">

      {/* Search */}
      <div className="flex-1 max-w-[460px]">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <input
            type="text"
            placeholder="Cari nama produk atau SKU..."
           className="
            w-full
            bg-[#F5F7FB]
            rounded-2xl
            pl-12
            pr-4
            h-12
            text-sm
            outline-none
            "
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">

        {/* Wifi */}
        <button className="text-green-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0"
            />
          </svg>
        </button>

        {/* Refresh */}
        <button className="text-blue-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>

        <div className="w-px h-8 bg-gray-300" />

        {/* User */}
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-800">
            Minji
          </p>
          <p className="text-xs text-gray-500">
            Kasir • Shift Pagi: 08:00 - 15:00
          </p>
        </div>

        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src={ownerProfile}
            alt="Kasir"
            className="w-full h-full object-cover"
          />
        </div>

      </div>
    </header>
  );
}