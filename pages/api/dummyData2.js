import prisma from "../../libs/prisma";

export default async (req, res) => {
  try {
    const createKategoriKontak = await prisma.kategoriKontak.createMany({
      data: [
        { nama: "Client" },
        { nama: "Supplier" },
        { nama: "Principle" },
        { nama: "Karyawan" },
        { nama: "Lainnya" },
      ],
      skipDuplicates: true,
    });

    const createKategoriAkun = await prisma.kategori.createMany({
      data: [
        { name: "Akun Piutang", saldo_normal_id: 1, saldo_normal_nama: "Debit" },
        { name: "Aktiva Lancar Lainnya", saldo_normal_id: 1, saldo_normal_nama: "Debit" },
        { name: "Kas & Bank", saldo_normal_id: 1, saldo_normal_nama: "Debit" },
        { name: "Persediaan", saldo_normal_id: 1, saldo_normal_nama: "Debit" },
        { name: "Aktiva Tetap", saldo_normal_id: 1, saldo_normal_nama: "Debit" },
        { name: "Aktiva Lainnya", saldo_normal_id: 1, saldo_normal_nama: "Debit" },
        { name: "Depresiasi & Amortasi", saldo_normal_id: 1, saldo_normal_nama: "Debit" },
        { name: "Akun Hutang", saldo_normal_id: 2, saldo_normal_nama: "Kredit" },
        { name: "Kartu Kredit", saldo_normal_id: 2, saldo_normal_nama: "Kredit" },
        { name: "Kewajiban Lancar Lainnya", saldo_normal_id: 2, saldo_normal_nama: "Kredit" },
        { name: "Kewajiban Jangka Panjang", saldo_normal_id: 2, saldo_normal_nama: "Kredit" },
        { name: "Ekuitas", saldo_normal_id: 2, saldo_normal_nama: "Kredit" },
        { name: "Pendapatan", saldo_normal_id: 2, saldo_normal_nama: "Kredit" },
        { name: "Pendapatan Lainnya", saldo_normal_id: 2, saldo_normal_nama: "Kredit" },
        { name: "Harga Pokok Penjualan", saldo_normal_id: 1, saldo_normal_nama: "Debit" },
        { name: "Beban", saldo_normal_id: 1, saldo_normal_nama: "Debit" },
        { name: "Beban Lainnya", saldo_normal_id: 1, saldo_normal_nama: "Debit" },
      ],
    });

    const createTipeAkun = await prisma.tipeAkun.createMany({
      data: [
        { name: "Kas" },
        { name: "Bank" },
        { name: "Ayat Silang" },
        { name: "Piutang Usaha" },
        { name: "Piutang Karyawan & Lain-Lain" },
        { name: "Piutang Direksi" },
        { name: "Pembayaran Muka" },
        { name: "Uang Muka Pajak" },
        { name: "Biaya Dibayar Dimuka Lain-Lain" },
        { name: "Aktiva Tetap" },
        { name: "Akumulasi Penyusutan Aktiva" },
        { name: "Utang Dagang" },
        { name: "Utang Pajak" },
        { name: "Utang Lain-Lain" },
        { name: "Utang Pemegang Saham" },
        { name: "Modal Saham" },
        { name: "Laba Ditahan" },
        { name: "Penjualan" },
        { name: "Beban HPP" },
        { name: "Beban Penjualan" },
        { name: "Beban Administrasi dan Umum" },
        { name: "Pendapatan Lain-Lain" },
        { name: "Beban Lain-Lain" },
      ],
      skipDuplicates: true,
    });

    const createDaftarAkun = await prisma.akun.createMany({
      data: [
        {
          kode_akun: "1-10001",
          tipeId: 1,
          nama_akun: "Kas",
          kategoriId: 3,
        },
        {
          kode_akun: "1-10101",
          tipeId: 4,
          nama_akun: "Piutang PT. ABC",
          kategoriId: 1,
        },
        {
          kode_akun: "1-10102",
          tipeId: 4,
          nama_akun: "Piutang PT. XYZ",
          kategoriId: 1,
        },

        {
          kode_akun: "1-10401",
          tipeId: 7,
          nama_akun: "Uang Muka Pembelian",
          kategoriId: 2,
        },
        {
          kode_akun: "1-10402",
          tipeId: 7,
          nama_akun: "Sewa dibayar dimuka",
          kategoriId: 2,
        },
        {
          kode_akun: "1-10403",
          tipeId: 7,
          nama_akun: "Asuransi dibayar dimuka",
          kategoriId: 2,
        },
        {
          kode_akun: "1-10404",
          tipeId: 7,
          nama_akun: "Uang Muka Pekerjaan Jasa",
          kategoriId: 2,
        },
        {
          kode_akun: "1-10405",
          tipeId: 7,
          nama_akun: "Uang Muka Lainnya",
          kategoriId: 2,
        },

        {
          kode_akun: "1-10501",
          tipeId: 8,
          nama_akun: "UM PPh 22",
          kategoriId: 2,
        },
        {
          kode_akun: "1-10502",
          tipeId: 8,
          nama_akun: "UM PPh 23",
          kategoriId: 2,
        },
        {
          kode_akun: "1-10503",
          tipeId: 8,
          nama_akun: "UM PPh 25",
          kategoriId: 2,
        },
        {
          kode_akun: "1-10504",
          tipeId: 8,
          nama_akun: "PPN Masukan",
          kategoriId: 2,
        },
        {
          kode_akun: "1-10505",
          tipeId: 8,
          nama_akun: "SPM PPN Jika LB",
          kategoriId: 2,
        },

        {
          kode_akun: "1-10507",
          tipeId: 9,
          nama_akun: "Beban dibayar dimuka",
          kategoriId: 2,
        },

        {
          kode_akun: "1-10601",
          tipeId: 10,
          nama_akun: "Tanah",
          kategoriId: 5,
        },

        {
          kode_akun: "1-10602",
          tipeId: 10,
          nama_akun: "Peralatan Kantor",
          kategoriId: 5,
        },
        {
          kode_akun: "1-10603",
          tipeId: 10,
          nama_akun: "Kendaraan",
          kategoriId: 5,
        },
        {
          kode_akun: "1-10604",
          tipeId: 10,
          nama_akun: "Mesin",
          kategoriId: 5,
        },
        {
          kode_akun: "1-10605",
          tipeId: 10,
          nama_akun: "Bangunan",
          kategoriId: 5,
        },

        {
          kode_akun: "1-10751",
          tipeId: 11,
          nama_akun: "Akumulasi Peny Peralatan Kantor",
          kategoriId: 7,
        },
        {
          kode_akun: "1-10752",
          tipeId: 11,
          nama_akun: "Akumulasi Peny Kendaraan",
          kategoriId: 7,
        },

        {
          kode_akun: "2-20101",
          tipeId: 12,
          nama_akun: "Utang Usaha",
          kategoriId: 8,
        },
        {
          kode_akun: "2-20102",
          tipeId: 12,
          nama_akun: "Utang Dividen",
          kategoriId: 8,
        },
        {
          kode_akun: "2-20301",
          tipeId: 13,
          nama_akun: "Utang PPh pasal 4 ayat 2",
          kategoriId: 10,
        },
        {
          kode_akun: "2-20302",
          tipeId: 13,
          nama_akun: "Utang PPh pasal 21",
          kategoriId: 10,
        },
        {
          kode_akun: "2-20303",
          tipeId: 13,
          nama_akun: "Utang PPh pasal 22",
          kategoriId: 10,
        },
        {
          kode_akun: "2-20304",
          tipeId: 13,
          nama_akun: "Utang PPh pasal 23",
          kategoriId: 10,
        },
        {
          kode_akun: "2-20305",
          tipeId: 13,
          nama_akun: "Utang PPh pasal 25/29",
          kategoriId: 10,
        },
        {
          kode_akun: "2-20306",
          tipeId: 13,
          nama_akun: "Utang PPh pasal 26",
          kategoriId: 10,
        },
        {
          kode_akun: "2-20307",
          tipeId: 13,
          nama_akun: "Utang PPN keluaran",
          kategoriId: 10,
        },
        {
          kode_akun: "2-20308",
          tipeId: 13,
          nama_akun: "SPM PPN",
          kategoriId: 10,
        },
        {
          kode_akun: "2-20309",
          tipeId: 13,
          nama_akun: "Utang PPh pasal 29",
          kategoriId: 10,
        },
        {
          kode_akun: "2-20310",
          tipeId: 13,
          nama_akun: "Utang PPN masuk LN",
          kategoriId: 10,
        },
        {
          kode_akun: "2-20401",
          tipeId: 14,
          nama_akun: "Utang Pinjaman",
          kategoriId: 11,
        },
        {
          kode_akun: "2-20402",
          tipeId: 14,
          nama_akun: "Utang Gaji",
          kategoriId: 10,
        },

        {
          kode_akun: "2-20501",
          tipeId: 15,
          nama_akun: "Utang Bpk ABCDEF",
          kategoriId: 10,
        },
        {
          kode_akun: "3-30001",
          tipeId: 16,
          nama_akun: "Modal Bpk WXYZ",
          kategoriId: 12,
        },

        {
          kode_akun: "4-40001",
          tipeId: 18,
          nama_akun: "Pendapatan Jasa",
          kategoriId: 13,
        },
        {
          kode_akun: "4-40002",
          tipeId: 18,
          nama_akun: "Pendapatan Penjualan Software",
          kategoriId: 13,
        },

        {
          kode_akun: "4-40003",
          tipeId: 18,
          nama_akun: "Pendapatan Penjualan Barang",
          kategoriId: 13,
        },
        {
          kode_akun: "4-40004",
          tipeId: 18,
          nama_akun: "Potongan Penjualan",
          kategoriId: 13,
        },
        {
          kode_akun: "4-40005",
          tipeId: 18,
          nama_akun: "Retur Penjualan",
          kategoriId: 13,
        },
        {
          kode_akun: "5-50001",
          tipeId: 19,
          nama_akun: "Pembelian License",
          kategoriId: 15,
        },
        {
          kode_akun: "5-50002",
          tipeId: 19,
          nama_akun: "Pembelian Perangkat Komputer",
          kategoriId: 15,
        },
        {
          kode_akun: "5-50003",
          tipeId: 19,
          nama_akun: "Potongan Pembelian",
          kategoriId: 15,
        },
        {
          kode_akun: "5-50004",
          tipeId: 19,
          nama_akun: "HPP software",
          kategoriId: 15,
        },
        {
          kode_akun: "5-50005",
          tipeId: 19,
          nama_akun: "Pemakaian Jasa",
          kategoriId: 15,
        },

        {
          kode_akun: "6-60001",
          tipeId: 20,
          nama_akun: "Beban Iklan",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60002",
          tipeId: 20,
          nama_akun: "Beban Komisi Penjualan",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60003",
          tipeId: 20,
          nama_akun: "Beban Hadiah",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60004",
          tipeId: 20,
          nama_akun: "Beban Penjualan Lainnya",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60101",
          tipeId: 21,
          nama_akun: "Biaya Pemeliharan Bangunan & Prasarana Jasa",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60102",
          tipeId: 21,
          nama_akun: "Biaya Pemeliharan Bangunan & Prasarana Material",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60103",
          tipeId: 21,
          nama_akun: "Biaya Perbaikan & Perawatan Perabot Jasa",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60104",
          tipeId: 21,
          nama_akun: "Biaya Perbaikan & Perawatan Perabot Material",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60105",
          tipeId: 21,
          nama_akun: "By Pemeliharaan Kend,A.Berat,Mesin-Pihak3 Jasa",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60106",
          tipeId: 21,
          nama_akun: "By Pemeliharaan Kend,A.Berat,Mesin-Pihak3 Material",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60107",
          tipeId: 21,
          nama_akun: "Biaya Oli & Pelumas",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60108",
          tipeId: 21,
          nama_akun: "Pemakaian Sparepart Kend & A.Berat",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60109",
          tipeId: 21,
          nama_akun: "Biaya Gaji",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60110",
          tipeId: 21,
          nama_akun: "Biaya Tunjangan Lainnya",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60112",
          tipeId: 21,
          nama_akun: "Iuran Pensiun",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60113",
          tipeId: 21,
          nama_akun: "Biaya Pengobatan",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60114",
          tipeId: 21,
          nama_akun: "Biaya Jasa Internet",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60115",
          tipeId: 21,
          nama_akun: "Biaya THR, Bonus, Liburan, dan Cuti ",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60116",
          tipeId: 21,
          nama_akun: "Biaya Dana Pensiun Past Service Liab.",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60117",
          tipeId: 21,
          nama_akun: "Biaya Pengobatan di Luar",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60118",
          tipeId: 21,
          nama_akun: "Biaya Keamanan",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60119",
          tipeId: 21,
          nama_akun: "Biaya Jasa Pengelolaan Tenaga Kerja",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60120",
          tipeId: 21,
          nama_akun: "By Penggantian Pengelolaan Tenaga Kerja",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60121",
          tipeId: 21,
          nama_akun: "Biaya Seragam & Perlengkapan Kerja",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60122",
          tipeId: 21,
          nama_akun: "Biaya Pesangon",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60123",
          tipeId: 21,
          nama_akun: "Biaya Tunjangan Perumahan",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60125",
          tipeId: 21,
          nama_akun: "Biaya Listrik",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60126",
          tipeId: 21,
          nama_akun: "Biaya Gas",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60127",
          tipeId: 21,
          nama_akun: "Biaya Asuransi",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60128",
          tipeId: 21,
          nama_akun: "Biaya Asuransi Pengangkutan",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60124",
          tipeId: 21,
          nama_akun: "Biaya Air",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60129",
          tipeId: 21,
          nama_akun: "Biaya Sewa Bangunan",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60130",
          tipeId: 21,
          nama_akun: "Biaya Jasa Pergudangan",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60131",
          tipeId: 21,
          nama_akun: "Biaya Sewa Peralatan",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60132",
          tipeId: 21,
          nama_akun: "Biaya Sewa Lahan",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60133",
          tipeId: 21,
          nama_akun: "Biaya Jasa Kurir / Forwarder",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60134",
          tipeId: 21,
          nama_akun: "Biaya Jasa Pelayaran",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60135",
          tipeId: 21,
          nama_akun: "Biaya Pajak Bumi dan Bangunan",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60136",
          tipeId: 21,
          nama_akun: "Biaya Pajak Kendaraan Bermotor",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60137",
          tipeId: 21,
          nama_akun: "Biaya Perizinan Pemerintah",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60138",
          tipeId: 21,
          nama_akun: "Biaya Izin Tenaga Kerja",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60139",
          tipeId: 21,
          nama_akun: "Biaya Transportasi Lokal",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60140",
          tipeId: 21,
          nama_akun: "Biaya Perjalanan Dalam Negeri",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60141",
          tipeId: 21,
          nama_akun: "Biaya Perjalanan Luar Negeri",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60142",
          tipeId: 21,
          nama_akun: "Biaya Bahan Bakar",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60143",
          tipeId: 21,
          nama_akun: "Biaya Mess",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60144",
          tipeId: 21,
          nama_akun: "Biaya Jamuan / Representasi",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60145",
          tipeId: 21,
          nama_akun: "Biaya Olahraga Dan Permainan",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60146",
          tipeId: 21,
          nama_akun: "Biaya Sumbangan Sosial",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60147",
          tipeId: 21,
          nama_akun: "Biaya Makanan dan Minuman",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60148",
          tipeId: 21,
          nama_akun: "Biaya Perayaan dan Upacara",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60149",
          tipeId: 21,
          nama_akun: "Biaya Perlengkapan Kantor",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60150",
          tipeId: 21,
          nama_akun: "Biaya Perlengkapan Fotocopy",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60151",
          tipeId: 21,
          nama_akun: "Biaya Komunikasi",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60152",
          tipeId: 21,
          nama_akun: "Biaya Organisasi Professional Internasional",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60153",
          tipeId: 21,
          nama_akun: "Biaya Orgaanisasi Professional Nasional",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60154",
          tipeId: 21,
          nama_akun: "Biaya Pelatihan External Pihak ke-3",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60155",
          tipeId: 21,
          nama_akun: "Biaya Kursus Umum",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60156",
          tipeId: 21,
          nama_akun: "Biaya Pelatihan Internal Kantor",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60157",
          tipeId: 21,
          nama_akun: "Biaya Beasiswa",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60158",
          tipeId: 21,
          nama_akun: "Biaya Pencarian Tenaga Kerja",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60159",
          tipeId: 21,
          nama_akun: "Biaya Langgganan Buku, Jurnal, Koran,dan Lainnya",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60160",
          tipeId: 21,
          nama_akun: "Biaya Konferensi Lokal",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60161",
          tipeId: 21,
          nama_akun: "Biaya Konferensi di Luar Negeri",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60162",
          tipeId: 21,
          nama_akun: "Biaya Konferensi Internal",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60163",
          tipeId: 21,
          nama_akun: "Biaya Jasa Profesional",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60164",
          tipeId: 21,
          nama_akun: "Biaya Jasa Notaris / Hukum",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60165",
          tipeId: 21,
          nama_akun: "Biaya Perjalanan/Penggantian untuk Jasa Notaris/Hukum",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60166",
          tipeId: 21,
          nama_akun: "Biaya Jasa Audit",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60167",
          tipeId: 21,
          nama_akun: "Biaya Jasa Konsultan",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60168",
          tipeId: 21,
          nama_akun: "Biaya Perjalanan/ Penggantian untuk Konsultan",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60169",
          tipeId: 21,
          nama_akun: "Biaya Jasa Management",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60170",
          tipeId: 21,
          nama_akun: "Beban Penyusutan Investaris Kantor",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60171",
          tipeId: 21,
          nama_akun: "Beban Penyusutan Kendaraan",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60172",
          tipeId: 21,
          nama_akun: "Beban Penyusutan Mesin",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60173",
          tipeId: 21,
          nama_akun: "Beban Penyusutan Bangunan",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60174",
          tipeId: 21,
          nama_akun: "Beban Amortisasi Penyusutan",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60175",
          tipeId: 21,
          nama_akun: "Biaya Administrasi Bank",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60176",
          tipeId: 21,
          nama_akun: "Biaya Dokumentasi",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60177",
          tipeId: 21,
          nama_akun: "Biaya Umum dan Administrasi",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60178",
          tipeId: 21,
          nama_akun: "Bebabn PPh 4 Ayat 2",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60179",
          tipeId: 21,
          nama_akun: "Beban PPh 21",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60180",
          tipeId: 21,
          nama_akun: "Beban PPh 23",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60181",
          tipeId: 21,
          nama_akun: "Beban PPh 25",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60182",
          tipeId: 21,
          nama_akun: "Beban PPh 26",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60183",
          tipeId: 21,
          nama_akun: "Beban Denda Pajak",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60184",
          tipeId: 21,
          nama_akun: "Biaya Materai",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60185",
          tipeId: 21,
          nama_akun: "Biaya Dividen",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60186",
          tipeId: 21,
          nama_akun: "Biaya Tender",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60187",
          tipeId: 21,
          nama_akun: "Biaya Asosiasi",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60188",
          tipeId: 21,
          nama_akun: "Biaya KTA dan KADIN",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60189",
          tipeId: 21,
          nama_akun: "Biaya Entertain",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60190",
          tipeId: 21,
          nama_akun: "Biaya Parkir",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60191",
          tipeId: 21,
          nama_akun: "Beban PPh Tax Amnesty",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60192",
          tipeId: 21,
          nama_akun: "Beban PPN",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60193",
          tipeId: 21,
          nama_akun: "Beban Penghapusan Piutang Tak Tertagih",
          kategoriId: 16,
        },
        {
          kode_akun: "6-60194",
          tipeId: 21,
          nama_akun: "Biaya Komisi",
          kategoriId: 16,
        },
        {
          kode_akun: "7-70001",
          tipeId: 22,
          nama_akun: "Pendapatan Bunga Bank Jasa Giro",
          kategoriId: 14,
        },
        {
          kode_akun: "7-70002",
          tipeId: 22,
          nama_akun: "Pendapatan Bunga Bank Jasa Deposito",
          kategoriId: 14,
        },
        {
          kode_akun: "7-70003",
          tipeId: 22,
          nama_akun: "Pendapatan Bunga Bank",
          kategoriId: 14,
        },
        {
          kode_akun: "7-70004",
          tipeId: 22,
          nama_akun: "Pendatapan Lain-Lain",
          kategoriId: 14,
        },
        {
          kode_akun: "7-70005",
          tipeId: 22,
          nama_akun: "Pendapatan (Beban) Penghapusan Piutang dan/atau Hutang Dagang",
          kategoriId: 14,
        },
        {
          kode_akun: "8-80001",
          tipeId: 23,
          nama_akun: "Biaya Bunga Bank Atas Pinjaman",
          kategoriId: 17,
        },
        {
          kode_akun: "8-80002",
          tipeId: 23,
          nama_akun: "Biaya Pajak Bunga Bank",
          kategoriId: 17,
        },
        {
          kode_akun: "8-80003",
          tipeId: 23,
          nama_akun: "Beban (Laba) Selisih Kurs",
          kategoriId: 17,
        },
        {
          kode_akun: "8-80101",
          tipeId: 23,
          nama_akun: "Biaya Taksiran Pajak Penghasilan",
          kategoriId: 17,
        },
        {
          kode_akun: "8-80102",
          tipeId: 23,
          nama_akun: "Pendapatan/Biaya Pajak Yang Ditangguhkan",
          kategoriId: 17,
        },
        {
          kode_akun: "8-80103",
          tipeId: 23,
          nama_akun: "Beban Adm. Bank",
          kategoriId: 17,
        },
        {
          kode_akun: "8-80199",
          tipeId: 23,
          nama_akun: "Beban Lainnya",
          kategoriId: 17,
        },

        {
          kode_akun: "8-80999",
          tipeId: 23,
          nama_akun: "Beban (Laba) Selisih Pembulatan",
          kategoriId: 17,
        },
      ],
      skipDuplicates: true,
    });

    const createKategoriProduk = await prisma.kategoriProduk.createMany({
      data: [
        { nama: "Jasa", jumlah: 0 },
        { nama: "Software", jumlah: 0 },
      ],
      skipDuplicates: true,
    });

    const create_syarat_pembayaran = await prisma.syaratPembayaran.createMany({
      data: [
        {
          nama: "100% Diawal",
        },
        {
          nama: "100% Diakhir",
        },
        {
          nama: "Bertahap",
        },
      ],
      skipDuplicates: true,
    });

    const create_gelar = await prisma.gelar.createMany({
      data: [
        {
          nama: "Mr. ",
        },
        {
          nama: "Ms. ",
        },
        {
          nama: "Mrs. ",
        },
        {
          nama: "-",
        },
      ],
      skipDuplicates: true,
    });

    const create_cara_pembayaran = await prisma.caraPembayaran.createMany({
      data: [{ nama: "Kas" }, { nama: "Transfer" }],
      skipDuplicates: true,
    });

    res.status(201).json({ message: "Seed default data success" });
  } catch (error) {
    res.status(400).json({ message: "Seed default data failed", error });
    console.log(error);
  }
};
