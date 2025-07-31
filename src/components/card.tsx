import { HTMLAttributes } from "react";

const Card: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={`rounded-2xl bg-white px-4 py-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
