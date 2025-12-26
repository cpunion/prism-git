import './index.css';

interface InputProps {
  type?: 'text' | 'search' | 'password';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export function Input({
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  icon,
  className = '',
}: InputProps) {
  return (
    <div className={`input-wrapper ${className}`}>
      {icon && <span className="input__icon">{icon}</span>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`input ${icon ? 'input--with-icon' : ''}`}
      />
    </div>
  );
}
