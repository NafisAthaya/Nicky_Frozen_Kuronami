import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PesananTersimpan() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const loadHoldOrders = async () => {

        try {

            const response = await fetch(
            'http://127.0.0.1:8000/api/hold-orders'
            );

            const result = await response.json();

            if (result.success) {
            setOrders(result.data);
            }

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

        };
        useEffect(() => {
            loadHoldOrders(); 
        }, 
    []);

    const handleDelete = async () => {

  try {

    const response = await fetch(
      `http://127.0.0.1:8000/api/hold-orders/${selectedOrder}`,
      {
        method: 'DELETE',
      }
    );

    const result = await response.json();

    if (!result.success) {
      return;
    }

    setShowDeletePopup(false);
    setSelectedOrder(null);

    loadHoldOrders();

  } catch (error) {

    console.error(error);

  }

};

const handleContinue = async (id) => {

  try {

    const response = await fetch(
      `http://127.0.0.1:8000/api/hold-orders/${id}`
    );

    const result = await response.json();

    if (!result.success) return;

    localStorage.setItem(
      'hold_order',
      JSON.stringify(result.data)
    );

    navigate('/kasir');

  } catch (error) {

    console.error(error);

  }

};


return (
    <div className="p-6">

      <h1 className="text-3xl font-bold text-[#082B7A]">
        Pesanan Tersimpan
      </h1>

      <p className="text-gray-500 mt-2">
        Daftar pesanan yang disimpan sementara.
      </p>

      <div className="mt-8">

        {loading ? (

            <div className="bg-white rounded-xl shadow p-10 text-center">

            <p className="text-gray-500">
                Memuat data...
            </p>

            </div>

        ) : (

            <div>
                <>
  {orders.length === 0 ? (

    <div className="bg-white rounded-xl shadow p-10 text-center">

      <p className="text-gray-400">
        Belum ada pesanan tersimpan.
      </p>

    </div>

  ) : (

    <div className="space-y-4">

        {orders.map((order) => (

        <div
            key={order.id}
            className="bg-white rounded-2xl shadow-md border border-gray-200 p-6"
        >

            {/* Header */}
            <div className="flex justify-between items-start">

            <div>

                <h2 className="text-xl font-bold text-[#082B7A]">
                {order.nama_pelanggan || "Guest"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                Draft #{order.no_antrian}
                </p>

            </div>

            <div className="text-right">

                <div className="text-2xl font-bold text-[#082B7A]">
                Rp {Number(order.subtotal).toLocaleString("id-ID")}
                </div>

            </div>

            </div>

            <div className="border-t my-5"></div>

            {/* Produk */}

            <div className="space-y-3">

            {order.items.map((item) => (

                <div
                key={item.id}
                className="flex justify-between"
                >

                <div>

                    <div className="font-medium">

                    {item.produk.nama_produk}

                    </div>

                    <div className="text-sm text-gray-500">

                    x{item.qty}

                    </div>

                </div>

                <div className="font-semibold">

                    Rp {Number(item.subtotal).toLocaleString("id-ID")}

                </div>

                </div>

            ))}

            </div>

                    <div className="border-t my-5"></div>

                    <div className="flex justify-between items-center">

                    <div className="text-sm text-gray-500">

                        {order.items.length} Produk

                    </div>

                    <div className="flex gap-3">

                        <button
                        className="px-5 py-2 rounded-xl border border-red-500 text-red-500 hover:bg-red-50"
                        onClick={() => {
                            setSelectedOrder(order.id);
                            setShowDeletePopup(true);
                        }}
                        >
                        Hapus
                        </button>

                        <button
                        className="px-5 py-2 rounded-xl bg-[#082B7A] text-white opacity-50 cursor-not-allowed"
                        title="Fitur akan tersedia pada update berikutnya"
                        >
                        Lanjutkan
                        </button>
                    </div>

                    </div>

                </div>

                ))}

            </div>

        )}
        </>

        </div>

        )}

        </div>
        {showDeletePopup && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">

                <div className="bg-white rounded-3xl p-8 w-[420px] shadow-2xl">

                <h2 className="text-2xl font-bold text-[#082B7A] mb-3">
                    Hapus Draft
                </h2>

                <p className="text-gray-600 mb-8">
                    Apakah Anda yakin ingin menghapus pesanan yang disimpan?
                </p>

                <div className="flex justify-end gap-3">

                    <button
                    onClick={() => {
                        setShowDeletePopup(false);
                        setSelectedOrder(null);
                    }}
                    className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100"
                    >
                    Batal
                    </button>

                    <button
                    onClick={handleDelete}
                    className="px-6 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600"
                    >
                    Hapus
                    </button>

                </div>

                </div>

            </div>
            )}
    </div>
  );
}