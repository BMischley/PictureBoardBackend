"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { ReactNode } from "react";
import { useAuthStore } from "@/stores/AuthStore";

function NavElement({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const loading = useAuthStore((state) => state.loading);

  return (
    <>
      {loading ? (
        <div className="h-screen w-fit mx-auto">
          <div className="w-fit mx-auto mt-64">
            <span className="loading loading-dots loading-lg mx-auto  bg-primary-teal "></span>
          </div>
          <p className="text-center">Loading...</p>
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
}

export default NavElement;
