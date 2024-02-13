"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import Dropdown from "./Dropdown";
import LoginButton from "./auth/LoginButton";
import { useSession } from "next-auth/react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ThemeSwitcher } from "./ThemeSwitcher";
import UserDropdown from "./UserDropdown";
import Searchbar from "./Searchbar";
import { usePathname } from "next/navigation";

const navIcons = [
  { src: "/assets/icons/search.svg", alt: "Search" },
  { src: "/assets/icons/black-heart.svg", alt: "Heart" },
  { src: "/assets/icons/user.svg", alt: "User" },
];

const Navbar = () => {
  const pathname = usePathname();

  const user = useCurrentUser();

  return (
    <header className="w-full fixed top-0 z-50">
      <nav className="bg-gray-300 dark:bg-black">
        <div className="container ml-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-1 mt-2">
            {pathname == "/business" ||
            pathname == "/business/settings" ? null : (
              <Image
                src="/assets/icons/savemelin3.svg"
                width={120}
                height={100}
                alt="Logo"
              />
            )}
          </Link>
          {pathname == "/" ||
          pathname == "/sign-in" ||
          pathname == "/sign-up" ||
          pathname == "/business" ||
          pathname == "/business/settings" ||
          pathname == "/reset" ||
          pathname == "/new-verification" ? null : (
            <div className="w-[55%] m-auto ml-7">
              <Searchbar />
            </div>
          )}
          <div>
            {!user ? (
              <>
                <div className="flex items-center p-2 mr-3 mt-2">
                  <LoginButton>
                    <a
                      // href='/sign-up'
                      className="bg-primary text-white hover:text-gray-300 hover:bg-gray-700 rounded-md py-2 px-4 transition duration-300 ease-in-out"
                      suppressHydrationWarning={true}
                    >
                      Comenzar
                    </a>
                  </LoginButton>
                  <ThemeSwitcher />
                </div>
              </>
            ) : (
              <div className="mr-8 ml-3  lg:mx-auto flex justify-end mt-5 items-center ">
                <UserDropdown />
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
