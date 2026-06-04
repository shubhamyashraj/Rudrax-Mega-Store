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
  return (
    <div className="flex flex-col items-center gap-1.5 p-2.5 bg-white border border-slate-200 rounded-lg shadow-sm">
      <div className="flex items-center gap-0.5 h-10 px-2 bg-slate-50 border border-slate-100 rounded">
        {/* Generate safe mock barcode bars */}
        {sku.split('').map((char, index) => {
          const width = (char.charCodeAt(0) % 3) + 1; // 1 to 3 width
          const space = (char.charCodeAt(0) % 2) + 1; // 1 to 2 spacing
          return (
            <div
              key={index}
              style={{ width: `${width}px`, marginRight: `${space}px` }}
              className="h-8 bg-slate-900 last:mr-0"
            />
          );
        })}
      </div>
      <div className="flex flex-col items-center">
        <span className="font-mono text-[9px] text-slate-500 font-semibold uppercase">{sku}</span>
        <span className="font-mono text-[8px] text-teal-600">UPC: {code}</span>
      </div>
    </div>
  );
}
