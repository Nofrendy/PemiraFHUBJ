import CandidateGrid from "@/components/CandidateGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Kandidat - Pemira FH UBHARA 2026',
  description: 'Profil, Visi, dan Misi Pasangan Calon BEM FH UBHARA 2026',
};

export default function KandidatPage() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <CandidateGrid />
    </div>
  );
}
