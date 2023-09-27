"use client";

import NavElement from "./NavElement";
import Link from "next/link";

function ProfileMenu() {
  return (
    <div className="flex justify-between w-full !bg-white px-4 text-lg">
      <div className="flex gap-20">
        <NavElement paths={["/"]} className="py-4 my-auto px-6 text-black">
          <Link href="/">Home</Link>
        </NavElement>

        <NavElement paths={["/about"]} className="py-4 my-auto px-6 text-black">
          <Link href="/about">About</Link>
        </NavElement>

        <NavElement paths={["/resources"]} className="py-4 my-auto px-6 text-black">
          <Link href="/resources">Resources</Link>
        </NavElement>
      </div>
      <div className="flex">
        <NavElement paths={["/login"]} className="py-4 px-2">
          <Link href="/">
            <button className="bg-primary-blue btn w-32 btn-md !border-primary-teal border-1 text-lg bg-white text-primary-teal rounded-full px-4 py-2">
              Log In
            </button>
          </Link>
        </NavElement>
        <NavElement paths={["/signup"]} className="py-4 px-2">
          <Link href="/">
            <button className="bg-primary-blue btn w-32 btn-md bg-primary-teal border-0 text-lg text-white rounded-full px-4 py-2">
              Sign Up
            </button>
          </Link>
        </NavElement>
      </div>
    </div>
  );
}

export default ProfileMenu;
