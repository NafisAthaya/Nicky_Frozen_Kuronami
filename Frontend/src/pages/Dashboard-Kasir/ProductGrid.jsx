import ProductCard from './ProductCard';
import { HiOutlineInbox } from 'react-icons/hi';

export default function ProductGrid({
  products,
  cartItems,
  onAddToCart,
}) {
  const cartItemIds = cartItems.map((item) => item.id);

  if (products.length === 0) {
    return (
      <div className="grid grid-cols-4 gap-4 flex-1 overflow-y-auto pb-4 pr-1">
        <div className="col-span-4 flex flex-col items-center justify-center py-16 text-gray-400">
          <HiOutlineInbox className="text-6xl mb-3 opacity-50" />
          <p className="text-sm font-medium">
            Tidak ada produk ditemukan
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      id="product-grid"
      className="
        grid
        grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        2xl:grid-cols-5
        gap-4
        flex-1
        overflow-y-auto
        pb-4
        pr-1
      "
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isSelected={cartItemIds.includes(product.id)}
          onSelect={onAddToCart}
        />
      ))}
    </div>
  );
}