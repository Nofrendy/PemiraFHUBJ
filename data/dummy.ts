// File ini berisi semua data dummy untuk Frontend.
// Backend Developer nantinya dapat melihat struktur data di sini untuk mempermudah integrasi API.

export const CONFIG = {
  totalDPT: 1500 // Total Daftar Pemilih Tetap (Mahasiswa Aktif)
};

export const DUMMY_CANDIDATES = [
  {
    id: 1,
    name: "Paslon 01",
    noUrut: "01",
    presiden: "Budi Santoso",
    npmPresiden: "20210201011",
    wapres: "Siti Aminah",
    npmWapres: "20210201012",
    visi: "Mewujudkan BEM FH UBHARA yang Sinergis, Inovatif, dan Berintegritas sebagai wadah aspirasi mahasiswa.",
    misi: [
      "Membangun komunikasi aktif dengan seluruh elemen mahasiswa dan birokrasi kampus.",
      "Mengadakan program kerja yang berfokus pada pengembangan soft skill dan hard skill mahasiswa hukum.",
      "Menjadikan BEM sebagai lembaga yang transparan dan akuntabel."
    ],
    image: "https://ui-avatars.com/api/?name=Budi+Siti&background=990000&color=fff&size=512&font-size=0.33",
    votes: 450, // Perolehan suara sementara (untuk Live Count)
    color: "#990000" // Tema warna paslon (Merah Maroon Elegan)
  },
  {
    id: 2,
    name: "Paslon 02",
    noUrut: "02",
    presiden: "Ahmad Fauzan",
    npmPresiden: "20210201021",
    wapres: "Rina Maharani",
    npmWapres: "20210201022",
    visi: "BEM FH UBHARA Progresif, Menyatukan Keberagaman untuk Hukum yang Berkeadilan.",
    misi: [
      "Meningkatkan budaya literasi dan diskusi kritis terkait isu-isu hukum terkini.",
      "Optimalisasi advokasi mahasiswa untuk menjamin kesejahteraan civitas akademika.",
      "Memperluas jaringan kerja sama dengan organisasi mahasiswa hukum tingkat nasional."
    ],
    image: "https://ui-avatars.com/api/?name=Ahmad+Rina&background=334155&color=fff&size=512&font-size=0.33",
    votes: 320, // Perolehan suara sementara (untuk Live Count)
    color: "#334155" // Tema warna paslon (Abu-abu Slate)
  }
];

export const DUMMY_VOTERS = [
  { id: 1,  name: "Andi Saputra",   npm: "20210201001", email: "andi.saputra@mhs.ubj.ac.id",   hp: "081234567801", prodi: "Ilmu Hukum", angkatan: "2021", krsUrl: "https://example.com/krs1.pdf", status: "Sudah Memilih", time: "09:05 WIB" },
  { id: 2,  name: "Budi Santoso",   npm: "20210201002", email: "budi.santoso@mhs.ubj.ac.id",   hp: "081234567802", prodi: "Ilmu Hukum", angkatan: "2021", krsUrl: "https://example.com/krs2.pdf", status: "Belum Memilih", time: "-" },
  { id: 3,  name: "Citra Kirana",   npm: "20210201003", email: "citra.kirana@mhs.ubj.ac.id",   hp: "081234567803", prodi: "Ilmu Hukum", angkatan: "2021", krsUrl: "https://example.com/krs3.pdf", status: "Sudah Memilih", time: "09:15 WIB" },
  { id: 4,  name: "Dewi Lestari",   npm: "20210201004", email: "dewi.lestari@mhs.ubj.ac.id",   hp: "081234567804", prodi: "Ilmu Hukum", angkatan: "2021", krsUrl: "https://example.com/krs4.pdf", status: "Sudah Memilih", time: "09:30 WIB" },
  { id: 5,  name: "Eko Prasetyo",   npm: "20210201005", email: "eko.prasetyo@mhs.ubj.ac.id",   hp: "081234567805", prodi: "Ilmu Hukum", angkatan: "2021", krsUrl: "https://example.com/krs5.pdf", status: "Belum Memilih", time: "-" },
  { id: 6,  name: "Fajar Nugraha",  npm: "20210201006", email: "fajar.nugraha@mhs.ubj.ac.id",  hp: "081234567806", prodi: "Ilmu Hukum", angkatan: "2021", krsUrl: "https://example.com/krs6.pdf", status: "Sudah Memilih", time: "10:05 WIB" },
  { id: 7,  name: "Gita Wirjawan",  npm: "20210201007", email: "gita.wirjawan@mhs.ubj.ac.id",  hp: "081234567807", prodi: "Ilmu Hukum", angkatan: "2021", krsUrl: "https://example.com/krs7.pdf", status: "Belum Memilih", time: "-" },
  { id: 8,  name: "Hendra Wijaya",  npm: "20210201008", email: "hendra.wijaya@mhs.ubj.ac.id",  hp: "081234567808", prodi: "Ilmu Hukum", angkatan: "2021", krsUrl: "https://example.com/krs8.pdf", status: "Sudah Memilih", time: "10:45 WIB" },
  { id: 9,  name: "Intan Permata",  npm: "20210201009", email: "intan.permata@mhs.ubj.ac.id",  hp: "081234567809", prodi: "Ilmu Hukum", angkatan: "2021", krsUrl: "https://example.com/krs9.pdf", status: "Belum Memilih", time: "-" },
  { id: 10, name: "Joko Anwar",     npm: "20210201010", email: "joko.anwar@mhs.ubj.ac.id",     hp: "081234567810", prodi: "Ilmu Hukum", angkatan: "2021", krsUrl: "https://example.com/krs10.pdf", status: "Sudah Memilih", time: "11:20 WIB" },
];

export const DUMMY_LOGS = [
  { id: 1, time: "11:20", message: "NPM 20210201010 Login dan memberikan suara" },
  { id: 2, time: "10:45", message: "NPM 20210201008 Login dan memberikan suara" },
  { id: 3, time: "10:05", message: "NPM 20210201006 Login dan memberikan suara" },
  { id: 4, time: "09:30", message: "NPM 20210201004 Login dan memberikan suara" },
  { id: 5, time: "09:15", message: "NPM 20210201003 Login dan memberikan suara" },
  { id: 6, time: "09:05", message: "NPM 20210201001 Login dan memberikan suara" },
];
