import * as React from "react";

type ButtonVariant =
  | "hero"
  | "heroDashed"
  | "navDark"
  | "navOutline"
  | "primary"
  | "secondary";
type ButtonSize = "default" | "sm" | "lg" | "icon";

const variantClasses: Record<ButtonVariant, string> = {
  hero: "bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-base font-medium rounded-none",
  heroDashed:
    "button is-secondary relative bg-transparent px-0 py-0 text-base font-normal rounded-none hover:bg-transparent btn-hero-dashed",
  navDark:
    "bg-foreground text-background h-10 px-5 text-sm font-medium rounded-md hover:bg-foreground/90",
  navOutline:
    "bg-transparent text-foreground border border-border h-10 px-5 text-sm font-medium rounded-md hover:bg-muted/50",
  primary:
    "bg-primary text-primary-foreground h-10 px-5 text-sm font-medium rounded-md hover:bg-primary/90",
  secondary:
    "bg-transparent text-foreground border border-border h-10 px-5 text-sm font-medium rounded-md hover:bg-muted/50",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  className = "",
  variant = "hero",
  size = "default",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
        sizeClasses[size],
        variantClasses[variant],
        className,
      ].join(" ")}
      {...props}
    />
  );
}
