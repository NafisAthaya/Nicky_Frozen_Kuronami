export default function CategoryTabs({
  categories = [],
  activeCategory,
  onCategoryChange,
}) {
  return (
    <div
      id="category-tabs"
      className="flex items-center gap-2 mb-4 overflow-x-auto pb-1"
    >
      {categories.map((cat) => (
        <button
          key={cat.id}
          id={`tab-${cat.id}`}
          onClick={() => onCategoryChange(cat.id)}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap shrink-0 border transition-all
            ${
              activeCategory === cat.id
                ? 'bg-gray-900 text-white border-gray-900 font-semibold'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
            }
          `}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}