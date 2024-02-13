"use client";

import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react";
import { createContext, useContext, useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import Link from "next/link";

interface SidebarContextType {
  expanded: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(true);
  const user: any = useCurrentUser();

  return (
    <>
      <aside className="h-screen">
        <nav className="h-full flex flex-col bg-white border-r shadow-sm">
          <div className="p-4 pb-2 flex justify-between items-center">
            <img
              src={"/assets/icons/savemelin3.svg"}
              alt="Logo"
              className={`overflow-hidden transition-all ${
                expanded ? "w-32" : "w-0"
              }`}
            />
            <div onClick={() => setExpanded((curr) => !curr)}>
              <button className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100">
                {expanded ? <ChevronFirst /> : <ChevronLast />}
              </button>
            </div>
          </div>

          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3">{children}</ul>
          </SidebarContext.Provider>

          <div className="border-t flex p-3">
            {/* Use alt text for accessibility */}
            {/* <img src={profile} alt="Profile" className="w-10 h-10 rounded-md" /> */}
            <div
              className={`flex justify-between items-center overflow-hidden transition-all ${
                expanded ? "w-52 ml-3" : "w-0"
              } `}
            >
              <div className="leading-4">
                <h4 className="font-semibold">{user.name}</h4>
                <span className="text-xs text-gray-600">{user.email}</span>
              </div>
              <MoreVertical size={20} />
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}

// Define the type for SidebarItem props
interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  alert?: boolean;
  link: string;
}

export function SidebarItem({
  icon,
  text,
  active,
  alert,
  link,
}: SidebarItemProps) {
  const { expanded }: any = useContext(SidebarContext);

  return (
    <Link href={link}>
      <li
        className={`relative flex mt-3 items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
          active
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-50 text-gray-600"
        }`}
      >
        {icon}
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "w-52 ml-3" : "w-0"
          }`}
        >
          {text}
        </span>
        {alert && (
          <div
            className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
              expanded ? "" : "top-2"
            }`}
          />
        )}

        {!expanded && (
          <div
            className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
          >
            {text}
          </div>
        )}
      </li>
    </Link>
  );
}
