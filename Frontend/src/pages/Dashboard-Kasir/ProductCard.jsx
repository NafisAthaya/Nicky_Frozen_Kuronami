import { HiCheck, HiOutlinePhotograph } from 'react-icons/hi';

function formatRupiah(num) {
  if (num === 0) return 'Rp -';
  return 'Rp ' + num.toLocaleString('id-ID');
}

function getStockBadge(stock, available) {
  if (!available || stock === 0) return null;
  if (stock <= 10) {
    return { className: 'low-stock', label: `${stock} Stok` };
  }
  if (stock > 50) {
    return { className: 'in-stock', label: `${stock} Stok` };
  }
  return { className: 'available', label: `${stock} Stok` };
}

function getInitials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('');
}

export default function ProductCard({ product, isSelected, onSelect }) {
  const stockBadge = getStockBadge(product.stock, product.available);
  const isOutOfStock = !product.available || product.stock === 0;

  const handleClick = () => {
    if (!isOutOfStock) {
      onSelect(product);
    }
  };

 return (
  <div
    id={`product-${product.id}`}
    onClick={handleClick}
    className={`
      bg-white rounded-3xl overflow-hidden cursor-pointer relative
      transition-all duration-200 shadow border
      ${
        isSelected
          ? 'border-[#1E40AF]ring-4ring-blue-100 shadow-lg'
          : 'border-transparent hover:border-gray-200 hover:shadow-lg hover:-translate-y-1'
      }
      ${
        isOutOfStock
          ? 'opacity-70 cursor-not-allowed'
          : ''
      }
    `}
  >
    {/* Image */}
    <div className="w-full h-[160px] bg-gray-100 relative overflow-hidden flex items-center justify-center">

      {stockBadge && (
        <div
          className={`
            absolute top-2 left-2 z-10
            px-2.5 py-1 rounded-full text-[11px] font-semibold
            flex items-center gap-1 backdrop-blur
            ${
              stockBadge.className === 'low-stock'
                ? 'bg-amber-100 text-amber-700'
                : stockBadge.className === 'in-stock'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-green-100 text-green-700'
            }
          `}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
          {stockBadge.label}
        </div>
      )}

      {isSelected && (
        <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#1E40AF] text-white flex items-center justify-center shadow-md z-20">
          <HiCheck className="text-[11px]" />
        </div>
      )}

      {isOutOfStock && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10">
          <span className="bg-black/60 text-white px-4 py-1 rounded-full text-sm font-bold">
            Habis
          </span>
        </div>
      )}

      {product.image ? (
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200 flex items-center justify-center">
          <span className="text-4xl font-black text-slate-500">
            {getInitials(product.name)}
          </span>
        </div>
      )}
    </div>

    {/* Info */}
    <div className="p-4">
      <div
        title={product.name}
        className="text-[15px] font-bold text-gray-900 truncate mb-1"
      >
        {product.name}
      </div>

      {product.sku && (
        <div className="text-[11px] text-gray-400 mb-1">
          {product.sku}
        </div>
      )}

      <div className="text-[#082B7A] text-2xl font-extrabold mt-2">
        {formatRupiah(product.price)}
      </div>
    </div>
  </div>
);
}
