import { useNavigate } from 'react-router-dom';
import {
  MdArrowBack,
  MdCalendarToday,
  MdInfoOutline,
} from 'react-icons/md';

import { useApp } from '../../context/AppContext';

export default function RiwayatBarangMasuk() {
  const navigate = useNavigate();
  const { stockEntries } = useApp();

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID').format(number);
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);

    return date.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-6">

      {/* Back Button */}
      <button
        onClick={() => navigate('/barang-masuk')}
        className="
          flex items-center gap-2
          text-gray-600
          hover:text-[#082B7A]
          transition
          mb-6
        "
      >
        <MdArrowBack size={20} />
        <span className="font-medium">
          Kembali ke Barang Masuk
        </span>
      </button>

      {/* Header */}
      <div className="mb-6">

        <h1 className="text-3xl font-bold text-[#082B7A] mb-2">
          Riwayat Barang Masuk
        </h1>

        <p className="text-gray-500">
          Semua catatan histori penambahan stok produk.
        </p>

      </div>

      {/* Table */}
      <div className="
        bg-white
        border border-gray-200
        rounded-3xl
        overflow-x-auto
        shadow-sm
      ">

        <table className="w-full min-w-[900px]">

          <thead>

            <tr className="bg-gray-50 border-b">

              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                Tanggal Entry
              </th>

              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                Nama Produk
              </th>

              <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">
                Jumlah Masuk
              </th>

              <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">
                Harga Beli
              </th>

              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                Supplier
              </th>

              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                Catatan
              </th>

            </tr>

          </thead>

          <tbody>

            {stockEntries.length === 0 ? (

              <tr>

                <td colSpan={6}>

                  <div className="
                    flex flex-col
                    items-center
                    justify-center
                    py-16
                    text-gray-400
                  ">

                    <MdInfoOutline
                      size={56}
                      className="mb-3"
                    />

                    <p>
                      Belum ada riwayat penambahan stok.
                    </p>

                  </div>

                </td>

              </tr>

            ) : (

              stockEntries.map((entry) => (

                <tr
                  key={entry.id}
                  className="
                    border-b border-gray-100
                    hover:bg-gray-50
                    transition
                  "
                >

                  {/* Tanggal */}
                  <td className="px-5 py-4 whitespace-nowrap">

                    <div className="
                      flex items-center gap-2
                      text-gray-600
                    ">

                      <MdCalendarToday
                        className="text-gray-400"
                      />

                      {formatDateTime(entry.createdAt)}

                    </div>

                  </td>

                  {/* Produk */}
                  <td className="
                    px-5 py-4
                    font-semibold
                    text-gray-800
                  ">
                    {entry.productName}
                  </td>

                  {/* Qty */}
                  <td className="px-5 py-4 text-right">

                    <span className="
                      inline-block
                      px-3 py-1
                      rounded-lg
                      text-xs font-bold
                      bg-orange-100
                      text-orange-600
                    ">
                      +{entry.qty} Unit
                    </span>

                  </td>

                  {/* Harga */}
                  <td className="
                    px-5 py-4
                    text-right
                    font-mono
                    text-gray-600
                  ">
                    Rp {formatRupiah(entry.buyPrice)}
                  </td>

                  {/* Supplier */}
                  <td className="px-5 py-4 text-gray-700">
                    {entry.supplier || '-'}
                  </td>

                  {/* Catatan */}
                  <td className="
                    px-5 py-4
                    text-gray-500
                    italic
                    max-w-[250px]
                    truncate
                  ">
                    {entry.notes || '-'}
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* Footer */}
      <footer className="
        text-center
        text-sm
        text-gray-400
        mt-8
      ">
        © 2026 Nicky Frozen. All rights reserved.
      </footer>

    </div>
  );
}