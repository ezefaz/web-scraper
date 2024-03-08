"use client";
import Sidebar, { SidebarItem } from "@/components/business/Sidebar";
import { FaHome, FaProductHunt } from "react-icons/fa";
import { MdPayment, MdSettings, MdStart } from "react-icons/md";
import { PiArrowsInLineVertical, PiLifebuoy } from "react-icons/pi";
import { TbLayoutDashboard } from "react-icons/tb";
import { usePathname } from "next/navigation";
import { IoBusiness } from "react-icons/io5";
import { BsPerson } from "react-icons/bs";
import PublishProductModal from "@/components/business/modal/PublishProductModal";

interface BusinessPageProps {
  children: React.ReactNode;
}

const BusinessLayout = ({ children }: BusinessPageProps) => {
  const pathname = usePathname();
  return (
    <>
      <div className="flex">
        <Sidebar>
          <SidebarItem icon={<FaHome size={20} />} text="Home" link="/" />
          <SidebarItem
            icon={<TbLayoutDashboard size={20} />}
            text="Dashboard"
            active={pathname === "/business" ? true : false}
            link="/business"
          />
          <SidebarItem
            icon={<FaProductHunt size={20} />}
            text="Productos"
            active={pathname === "/business/products" ? true : false}
            link="/business/products"
          />
          <SidebarItem
            icon={<IoBusiness size={20} />}
            text="Competencia"
            active={pathname === "/business/competition" ? true : false}
            link="/business/competition"
          />
          <SidebarItem
            icon={<BsPerson size={20} />}
            text="Compradores"
            active={pathname === "/business/clients" ? true : false}
            link="/business/clients"
          />
          <SidebarItem
            icon={<MdPayment size={20} />}
            text="Facturación"
            active={pathname === "/business/billing" ? true : false}
            link="/business/billing"
          />
          <hr className="my-3" />
          <SidebarItem
            icon={<MdStart size={20} />}
            text="Onboarding"
            link="/business/onboarding"
            active={pathname === "/business/onbording" ? true : false}
          />
          <SidebarItem
            icon={<MdSettings size={20} />}
            text="Configuración"
            active={pathname === "/business/settings" ? true : false}
            link="/business/settings"
          />
          <SidebarItem
            icon={<PiLifebuoy size={20} />}
            text="Ayuda"
            link="/business"
            active={pathname === "/business/help" ? true : false}
          />
          <div className="hidden">
            <PublishProductModal />
          </div>
        </Sidebar>
        {children}
      </div>
    </>
  );
};

export default BusinessLayout;
