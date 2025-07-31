import { HTMLAttributes } from "react";

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      disabled={disabled}
      className={`rounded-full bg-[#F9F9F9] px-4 py-2 text-black transition-all duration-200 ease-in-out hover:scale-105 hover:bg-[#E0E0E0] active:scale-95 disabled:cursor-not-allowed disabled:bg-[#D1D1D1] disabled:text-[#6B7280] ${className} `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
