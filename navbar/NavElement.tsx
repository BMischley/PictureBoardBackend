"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { ReactNode } from "react";
import Link from "next/link";
function NavElement({
  paths,
  children,
  className,
}: {
  paths: string[];
  children: ReactNode;
  className?: string;
}) {
  const currentPath = usePathname();
  const isActive = paths.includes(currentPath as string);

  return (
    <li
      className={`${
        isActive ? "underline underline-offset-8 decoration-seconday-blue" : ""
      } ${className}`}
    >
      {children}
    </li>
  );
}

export default NavElement;
