import { ReactNode } from 'react';

// Reusable Atoms for Rudrax BEM Style Architectures

interface ButtonProps {
  id?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  id,
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  className = '',
  type = 'button'
}: ButtonProps) {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'bg-teal-700 hover:bg-teal-800 text-white font-semibold font-display border border-teal-700 hover:border-teal-800 shadow-sm transition-all duration-300 active:scale-[0.98]';
      case 'secondary':
        return 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-black font-display border border-amber-500 hover:border-amber-600 shadow-sm transition-all duration-300 active:scale-[0.98] shadow-amber-500/10';
      case 'danger':
        return 'bg-rose-600 hover:bg-rose-700 text-white font-semibold font-display border border-rose-600 transition-all duration-300';
      case 'success':
        return 'bg-emerald-600 hover:bg-emerald-700 text-white font-semibold font-display border border-emerald-600 transition-all duration-300';
      case 'outline':
        return 'bg-transparent hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300 font-medium transition-all duration-300';
      case 'text':
        return 'bg-transparent text-teal-700 hover:text-teal-800 p-0 font-semibold border-none shadow-none transition-all';
      default:
        return 'bg-teal-700 text-white font-display';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'px-3 py-1.5 text-xs rounded-md';
      case 'md': return 'px-4 py-2 text-sm rounded-lg';
      case 'lg': return 'px-6 py-3 text-base rounded-xl';
    }
  };

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center transition-all ${getVariantClass()} ${getSizeClass()} disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  children: ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const getStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'warning':
        return 'bg-amber-50 text-amber-800 border border-amber-200';
      case 'danger':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'info':
        return 'bg-teal-50 text-teal-700 border border-teal-200';
      default:
        return 'bg-slate-100 text-slate-800 border border-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${getStyles()} ${className}`}>
      {children}
    </span>
  );
}

interface InputProps {
  id?: string;
  label?: string;
  type?: string;
  placeholder?: string;
  value: string | number;
  onChange: (val: string) => void;
  className?: string;
  error?: string;
  min?: string | number;
}

export function Input({
  id,
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  className = '',
  error = '',
  ...props
}: InputProps) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && <label className="text-xs font-semibold text-slate-700">{label}</label>}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 transition-colors placeholder:text-slate-400 focus:border-teal-500"
        {...props}
      />
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
}

// Simulated QR/Barcode for Admins/Store Managers representing real inventory tagging
interface BarcodeProps {
  code: string;
  sku: string;
}

export function Barcode({ code, sku }: BarcodeProps) {
  // Generate a neat, pseudo-random but deterministic 10x10 QR grid based on the hash of SKU/code
  const hash = sku + code;
  let codeSum = 0;
  for (let i = 0; i < hash.length; i++) {
    codeSum += hash.charCodeAt(i);
  }
  
  const getPixel = (x: number, y: number) => {
    // Top-left finder pattern (3x3 black with white inner)
    if (x < 3 && y < 3) {
      if (x === 1 && y === 1) return false;
      return true;
    }
    // Top-right finder pattern
    if (x > 6 && y < 3) {
      const rx = x - 7;
      if (rx === 1 && y === 1) return false;
      return true;
    }
    // Bottom-left finder pattern
    if (x < 3 && y > 6) {
      const ry = y - 7;
      if (x === 1 && ry === 1) return false;
      return true;
    }
    // Pseudo-random pixel values elsewhere based on high-dispersion hash
    const val = Math.sin(codeSum + (x * 17) + (y * 23)) * 10000;
    return (val - Math.floor(val)) > 0.5;
  };

  const grid = Array.from({ length: 10 }, (_, y) =>
    Array.from({ length: 10 }, (_, x) => getPixel(x, y))
  );

  return (
    <div className="flex flex-col items-center gap-1.5 p-2.5 bg-white border border-slate-200 rounded-xl shadow-xs">
      <div className="grid grid-cols-10 gap-[1px] p-2 bg-slate-50 border border-slate-100 rounded-lg w-16 h-16">
        {grid.map((row, y) =>
          row.map((black, x) => (
            <div
              key={`${x}-${y}`}
              className={`w-1.2 h-1.2 rounded-[1px] ${black ? 'bg-slate-900' : 'bg-transparent'}`}
            />
          ))
        )}
      </div>
      <div className="flex flex-col items-center select-all">
        <span className="font-mono text-[9px] text-slate-500 font-bold uppercase tracking-wider">{sku}</span>
        <span className="font-mono text-[8px] text-rose-600 font-medium">ADMIN QR CODE</span>
      </div>
    </div>
  );
}
