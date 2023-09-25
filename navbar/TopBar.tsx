"use client";

import NavElement from "./NavElement";
import Link from "next/link";

function ProfileMenu() {
  return (
      <div className="flex gap-5 !bg-white">
        <div className="flex h-64 bg-white">
          <NavElement paths={["/"]} className="py-4 px-6">
            <Link href="/">Home</Link>
          </NavElement>
          <li className="py-4 px-2">
            <div className="h-8 w-0 border border-[#838992]"></div>
          </li>
          <NavElement paths={["/"]} className="py-4 px-6">
            <Link href="/">About</Link>
          </NavElement>
          <li className="py-4 px-2">
            <div className="h-8 w-0 border border-[#838992]"></div>
          </li>
          <NavElement paths={["/"]} className="py-4 px-6">
            <Link href="/">Generate</Link>
          </NavElement>
        </div>
      </div>
  );
}

export default ProfileMenu;
