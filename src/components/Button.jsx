import React, { useState, useRef, useCallback } from "react";

/**
 * Reusable Tactile Brutalist Button with Arcade-style Physics
 * 
 * Features:
 * - Solid 4px block drop shadow
 * - Mechanical 4px X/Y translation on :active (covers shadow completely)
 * - 100ms hardware-accelerated color inversion micro-glitch upon click
 * - 0px border radius strictly enforced
 */
export const Button = ({
  children,
  variant = "terminal",
  size = "md",
  prefix,
  onClick,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const timerRef = useRef(null);

  const handleClick = useCallback(
    (e) => {
      if (disabled) return;

      // 100ms mechanical color inversion flash
      setIsGlitching(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsGlitching(false);
      }, 100);

      if (onClick) onClick(e);
    },
    [disabled, onClick]
  );

  const variantStyles = {
    // Terminal Green bg, Pure Black text, Stark White 4px block shadow
    terminal:
      "bg-[#00FF41] text-[#000000] border-[#000000] shadow-[4px_4px_0px_0px_#FFFFFF] font-bold hover:bg-[#FFFFFF] hover:text-[#000000]",
    // Pure Black bg, Stark White text, Terminal Green 4px block shadow
    primary:
      "bg-[#000000] text-[#FFFFFF] border-[#FFFFFF] shadow-[4px_4px_0px_0px_#00FF41] hover:border-[#00FF41]",
    // Stark White bg, Pure Black text, Terminal Green 4px block shadow
    stark:
      "bg-[#FFFFFF] text-[#000000] border-[#000000] shadow-[4px_4px_0px_0px_#00FF41] hover:bg-[#000000] hover:text-[#FFFFFF] hover:border-[#FFFFFF]",
    // Transparent bg, Stark White border, Terminal Green 4px block shadow
    ghost:
      "bg-transparent text-[#FFFFFF] border-[#FFFFFF] shadow-[4px_4px_0px_0px_#00FF41] hover:bg-[#00FF41] hover:text-[#000000] hover:border-[#00FF41]",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
  };

  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      onClick={handleClick}
      className={`
        relative inline-flex items-center justify-center
        font-mono uppercase select-none cursor-pointer
        border-[1px] border-solid
        /* Arcade mechanical depression: translates exactly 4px to cover shadow */
        active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
        focus-visible:outline-2 focus-visible:outline-[#00FF41] focus-visible:outline-offset-2
        transition-none
        disabled:opacity-40 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0
        ${variantStyles[variant] || variantStyles.terminal}
        ${sizeStyles[size] || sizeStyles.md}
        ${isGlitching ? "!invert filter" : ""}
        ${className}
      `}
      style={{ borderRadius: "0px" }}
    >
      {prefix && (
        <span className="text-[#00FF41] mr-2 font-mono select-none">
          {prefix}
        </span>
      )}
      <span className="font-mono tracking-wider">{children}</span>
    </button>
  );
};

export default Button;

