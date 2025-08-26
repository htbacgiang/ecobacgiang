import { FC, MouseEventHandler } from "react";
import { BiLoader } from "react-icons/bi";

interface Props {
  title: string;
  busy?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

const ActionButton: FC<Props> = ({
  disabled,
  busy = false,
  title,
  onClick,
  className = "",
}): JSX.Element => {
  const baseClasses = "text-highlight-dark bg-action px-6 py-2 font-semibold hover:scale-[0.97] duration-100 rounded w-full flex items-center justify-center space-x-2 transition";
  const combinedClasses = className || baseClasses;
  
  return (
    <button
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
    >
      <span>{title}</span>
      {busy && <BiLoader className="animate-spin" size={20} />}
    </button>
  );
};

export default ActionButton;
