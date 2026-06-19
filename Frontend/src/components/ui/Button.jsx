export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center font-semibold text-sm rounded-xl px-6 py-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700 focus:ring-orange-300 shadow-md hover:shadow-lg',
    secondary:
      'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 focus:ring-gray-300',
    outline:
      'border-2 border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-500 focus:ring-orange-200',
    ghost:
      'text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:ring-gray-200',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
