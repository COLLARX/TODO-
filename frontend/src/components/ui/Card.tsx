import { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "section" | "article";
  children: ReactNode;
};

export function Card({ as = "section", className = "", children, ...props }: CardProps) {
  const Comp = as;
  return (
    <Comp className={["card", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </Comp>
  );
}
