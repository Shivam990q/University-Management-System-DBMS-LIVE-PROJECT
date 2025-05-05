import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Outlet } from "react-router-dom";
import { BackendDependencyNotice } from "@/components/BackendDependencyNotice";

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden border-border">
        <Header />
        <main className="flex-1 overflow-auto bg-[#f9fafb] p-6">
          <BackendDependencyNotice />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
