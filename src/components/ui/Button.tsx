import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "ghost" | "link";

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium " +
  "transition-[color,background-color,border-color,transform] duration-base ease-standard " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent-600 px-5 py-2.5 text-white hover:bg-accent-500 active:bg-accent-700",
  ghost:
    "border border-border-strong px-5 py-2.5 text-text-primary hover:border-accent-400 hover:text-accent-300",
  link: "text-accent-300 underline-offset-4 hover:text-accent-400 hover:underline",
};

interface CommonProps {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
}

interface ButtonAsButton
  extends
    CommonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> {
  href?: undefined;
  external?: undefined;
}

interface ButtonAsLink extends CommonProps {
  href: string;
  external?: boolean;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

/** Shared Button primitive — one component for both <button> and navigational <Link> use. */
export function Button(props: ButtonProps) {
  const { variant = "primary", className, children } = props;
  const classes = cn(baseStyles, variantStyles[variant], className);

  if (props.href) {
    const { href, external } = props;
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  const {
    variant: _variant,
    className: _className,
    children: _children,
    href: _href,
    external: _external,
    ...buttonProps
  } = props;
  void _variant;
  void _className;
  void _children;
  void _href;
  void _external;

  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
