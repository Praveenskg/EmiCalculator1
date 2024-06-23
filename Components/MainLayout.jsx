
"use client";
import Loader from "@/Components/Loader";
import { useEffect, useState } from "react";
import Navigation from "./Navigation"

const MainLayout = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="relative flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
export default MainLayout