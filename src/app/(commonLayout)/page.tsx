
import { Metadata } from "next";
import HomePage from "../components/home/HomePage";


export const metadata: Metadata = {
  title: "Zenova - SaaS Platform",
  description: "Zenova SaaS platform with e-commerce, blog, and dashboard features",
  
}
export default function Home() {
  return (
    <div className="min-h-screen ">
      <HomePage></HomePage>
    </div>
  );
}
