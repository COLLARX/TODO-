import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "accent" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  block?: boolean;
  children: ReactNode;
};

export function Button({ variant = "primary", block = false, className = "", children, ...props }: ButtonProps) {
  const classes = ["btn", `btn-${variant}`, block ? "btn-block" : "", className].filter(Boolean).join(" ");
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
