import type { Metadata } from "next";
import Hisaab from "@/components/Hisaab";

export const metadata: Metadata = {
  title: "Your Hisaab",
  description: "Your Karnavati Dairy order. Free delivery above ₹3,000, or directions and a ride to your nearest shop.",
};

export default function HisaabPage() {
  return <Hisaab />;
}
