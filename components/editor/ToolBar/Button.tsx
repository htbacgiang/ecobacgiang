import React, { FC, MouseEventHandler, ReactNode, useCallback } from "react";
import classnames from "classnames";

interface Props {
  children: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onMouseDown?: MouseEventHandler<HTMLButtonElement>;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onBlur?: () => void;
}

const Button: FC<Props> = ({
  children,
  active,
  disabled,
  onMouseDown,
  onClick,
  onBlur,
}): JSX.Element => {
  const getActiveStyle = useCallback((): string => {
    if (active)
      return "toolbar-button active";
    else return "toolbar-button";
  }, [active]);

  const commonClasses = "toolbar-button";

  return (
    <button
      type="button"
      onMouseDown={onMouseDown}
      onClick={onClick}
      onBlur={onBlur}
      className={classnames(commonClasses, getActiveStyle())}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
