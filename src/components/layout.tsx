import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#ffe4e6] to-[#dbeafe]">
      <Header />
      <main className="flex-grow">
        <div className="md:container mx-auto px-4 py-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
