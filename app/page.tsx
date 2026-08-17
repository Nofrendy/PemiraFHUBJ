import { Button } from "@/components/ui/Button";
import CountdownTimer from "@/components/CountdownTimer";
import Timeline from "@/components/Timeline";
import FAQAccordion from "@/components/FAQAccordion";
import FeaturedCandidates from "@/components/FeaturedCandidates";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 overflow-hidden bg-white">
        {/* Dot pattern background */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-dot-pattern opacity-80" />
        {/* Gradient orb hints */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-merah-formal/5 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -right-32 w-[400px] h-[400px] rounded-full bg-slate-300/10 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center justify-center mb-8 px-5 py-2 rounded-full bg-white border border-red-100 shadow-sm">
            <span className="text-xs sm:text-sm font-bold text-merah-formal tracking-widest uppercase">
              PEMIRA FH UBJ 2026
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-[5.5rem] font-bold text-slate-900 mb-8 leading-[1.1] font-serif tracking-tight drop-shadow-sm">
            <span className="text-merah-formal">Transparan</span> dalam Proses, <br className="hidden lg:block" /> <span className="text-merah-formal">Terpercaya</span> dalam Hasil.
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-4xl mx-auto mb-14 leading-relaxed font-medium">
            Satu Pilihan, Satu Komitmen, Satu Tujuan untuk Mewujudkan Demokrasi Mahasiswa yang Berintegritas dalam Membangun Fakultas Hukum yang Unggul, Inklusif, dan Berdaya Saing.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Link href="/kandidat">
              <Button variant="primary" className="w-full sm:w-auto px-10 py-4 text-lg font-bold shadow-[0_4px_20px_-4px_rgba(139,0,0,0.5)] hover:shadow-[0_8px_30px_-4px_rgba(139,0,0,0.6)] hover:-translate-y-1 transition-all duration-300">
                Kenali Kandidat
              </Button>
            </Link>
            <Link href="#timeline">
              <Button variant="outline" className="w-full sm:w-auto px-10 py-4 text-lg font-bold bg-white hover:bg-gray-50 shadow-sm transition-all duration-300">
                Jadwal Pemilihan
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Candidates Section */}
      <FeaturedCandidates />

      {/* Countdown Section */}
      <section className="py-28 bg-white border-y border-gray-100 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 font-serif mb-5 tracking-tight">Menuju Hari Pencoblosan</h2>
            <p className="text-gray-500 text-lg md:text-xl font-medium">Persiapkan diri Anda untuk memberikan suara terbaik.</p>
          </div>
          <CountdownTimer targetDate="2026-09-01T08:00:00" />
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="py-28 bg-slate-50 relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-dot-pattern opacity-60" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-20 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 font-serif mb-5 tracking-tight">Timeline Pemira</h2>
            <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed">Rangkaian acara dan jadwal penting Pemilihan Raya BEM FH UBJ 2026.</p>
          </div>
          <Timeline />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-28 bg-white relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid-pattern" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 font-serif mb-5 tracking-tight">Pertanyaan yang Sering Diajukan</h2>
            <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed">Temukan jawaban atas kebingungan Anda seputar sistem E-Voting Pemira.</p>
          </div>
          <FAQAccordion />
        </div>
      </section>
    </div>
  );
}
