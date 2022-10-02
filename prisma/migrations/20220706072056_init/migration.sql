-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "role_name" TEXT NOT NULL,
    "role_desc" TEXT,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "logged_in" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Menu" (
    "id" SERIAL NOT NULL,
    "menu_name" TEXT NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePrivellege" (
    "id" SERIAL NOT NULL,
    "role_id" INTEGER NOT NULL,
    "menu_id" INTEGER NOT NULL,
    "value" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RolePrivellege_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "user" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kategori" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "saldo_normal_id" INTEGER NOT NULL,
    "saldo_normal_nama" TEXT NOT NULL,

    CONSTRAINT "Kategori_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipeAkun" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TipeAkun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Akun" (
    "id" SERIAL NOT NULL,
    "kode_akun" TEXT NOT NULL,
    "tipeId" INTEGER NOT NULL,
    "nama_akun" TEXT NOT NULL,
    "kategoriId" INTEGER NOT NULL,

    CONSTRAINT "Akun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeaderSaldoAwal" (
    "id" SERIAL NOT NULL,
    "tgl_konversi" TEXT NOT NULL,

    CONSTRAINT "HeaderSaldoAwal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailSaldoAwal" (
    "id" SERIAL NOT NULL,
    "header_saldo_awal_id" INTEGER NOT NULL,
    "akun_id" INTEGER NOT NULL,
    "debit" INTEGER NOT NULL,
    "kredit" INTEGER NOT NULL,
    "sisa_saldo" INTEGER NOT NULL,

    CONSTRAINT "DetailSaldoAwal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KategoriKontak" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "KategoriKontak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KategoriProduk" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "jumlah" INTEGER NOT NULL,

    CONSTRAINT "KategoriProduk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gelar" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "Gelar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kontak" (
    "id" SERIAL NOT NULL,
    "gelar_id" INTEGER,
    "nama" TEXT,
    "nomor_hp" TEXT,
    "email" TEXT NOT NULL,
    "jabatan" TEXT,
    "nama_perusahaan" TEXT NOT NULL,
    "nomor_telepon" TEXT NOT NULL,
    "nomor_fax" TEXT,
    "nomor_npwp" TEXT,
    "alamat_perusahaan" TEXT NOT NULL,
    "nama_bank" TEXT NOT NULL,
    "kantor_cabang_bank" TEXT NOT NULL,
    "nomor_rekening" TEXT,
    "atas_nama" TEXT,
    "akun_piutang_id" INTEGER NOT NULL,
    "akun_hutang_id" INTEGER NOT NULL,
    "syarat_pembayaran_id" INTEGER NOT NULL,

    CONSTRAINT "Kontak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KontakDetail" (
    "id" SERIAL NOT NULL,
    "kontak_id" INTEGER NOT NULL,
    "kontak_type_id" INTEGER NOT NULL,

    CONSTRAINT "KontakDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produk" (
    "id" SERIAL NOT NULL,
    "file_attachment" TEXT,
    "nama" TEXT NOT NULL,
    "kategori_id" INTEGER NOT NULL,
    "deskripsi" TEXT,
    "harga" INTEGER NOT NULL,
    "akun_id" INTEGER NOT NULL,

    CONSTRAINT "Produk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pajak" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "presentase_aktif" INTEGER NOT NULL,
    "pajak_keluaran_id" INTEGER NOT NULL,
    "pajak_masukan_id" INTEGER NOT NULL,

    CONSTRAINT "Pajak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyaratPembayaran" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "SyaratPembayaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeaderPenjualan" (
    "id" SERIAL NOT NULL,
    "kontak_id" INTEGER NOT NULL,
    "nama_perusahaan" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "alamat_penagihan" TEXT NOT NULL,
    "syarat_pembayaran_id" INTEGER NOT NULL,
    "nomor_npwp" TEXT NOT NULL,
    "nomor_kontrak" TEXT NOT NULL,
    "tgl_kontrak_mulai" TEXT NOT NULL,
    "hari" INTEGER NOT NULL,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "tgl_kontrak_expired" TEXT NOT NULL,
    "custom_invoice" TEXT NOT NULL,
    "tipe_perusahaan" TEXT NOT NULL,
    "pesan" TEXT,
    "subtotal" INTEGER NOT NULL,
    "pajak_id" INTEGER NOT NULL,
    "pajak_nama" TEXT NOT NULL,
    "pajak_persen" INTEGER NOT NULL,
    "pajak_hasil" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "sisa_tagihan" INTEGER NOT NULL,
    "file_attachment" TEXT,
    "status" TEXT NOT NULL DEFAULT E'Active',

    CONSTRAINT "HeaderPenjualan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailPenjualan" (
    "id" SERIAL NOT NULL,
    "header_penjualan_id" INTEGER NOT NULL,
    "produk_id" INTEGER NOT NULL,
    "produk_name" TEXT NOT NULL,
    "produk_deskripsi" TEXT NOT NULL,
    "produk_harga" INTEGER NOT NULL,

    CONSTRAINT "DetailPenjualan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PenerimaanPembayaran" (
    "id" SERIAL NOT NULL,
    "header_penjualan_id" INTEGER NOT NULL,
    "akun_id" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,
    "hari" INTEGER NOT NULL,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "date_confirmation" TEXT DEFAULT E'-',
    "pajak_id" INTEGER NOT NULL,
    "pajak_nama" TEXT NOT NULL,
    "pajak_persen" INTEGER NOT NULL,
    "presentase_penagihan" INTEGER NOT NULL,
    "tagihan_sebelum_pajak" INTEGER NOT NULL,
    "pajak_total" INTEGER NOT NULL,
    "pajak_keluaran_total" INTEGER NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "tagihan_setelah_pajak" INTEGER NOT NULL,
    "say" TEXT NOT NULL,
    "bank_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT E'Process',

    CONSTRAINT "PenerimaanPembayaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JurnalPenerimaanPembayaran" (
    "id" SERIAL NOT NULL,
    "header_penjualan_id" INTEGER NOT NULL,
    "penerimaan_pembayaran_id" INTEGER NOT NULL,
    "akun_id" INTEGER NOT NULL,
    "nominal" INTEGER NOT NULL,
    "tipe_saldo" TEXT NOT NULL,

    CONSTRAINT "JurnalPenerimaanPembayaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeaderPembelian" (
    "id" SERIAL NOT NULL,
    "kontak_id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "alamat_perusahaan" TEXT NOT NULL,
    "akun_hutang_supplier_id" INTEGER NOT NULL,
    "tgl_transaksi" TEXT NOT NULL,
    "hari" INTEGER NOT NULL,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "tgl_jatuh_tempo" TEXT NOT NULL,
    "syarat_pembayaran_id" INTEGER NOT NULL,
    "no_ref_penagihan" TEXT NOT NULL,
    "memo" TEXT,
    "file_attachment" TEXT,
    "subtotal" INTEGER NOT NULL,
    "akun_diskon_pembelian_id" INTEGER NOT NULL,
    "total_diskon" INTEGER NOT NULL,
    "pajak_id" INTEGER NOT NULL,
    "total_pajak" INTEGER NOT NULL,
    "pajak_persen" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "sisa_tagihan" INTEGER NOT NULL,

    CONSTRAINT "HeaderPembelian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailPembelian" (
    "id" SERIAL NOT NULL,
    "header_pembelian_id" INTEGER NOT NULL,
    "akun_pembelian_id" INTEGER NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "kuantitas" INTEGER NOT NULL,
    "harga_satuan" INTEGER NOT NULL,
    "diskon" INTEGER NOT NULL,
    "diskon_per_baris" INTEGER NOT NULL,
    "jumlah" INTEGER NOT NULL,

    CONSTRAINT "DetailPembelian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JurnalPembelian" (
    "id" SERIAL NOT NULL,
    "header_pembelian_id" INTEGER NOT NULL,
    "akun_id" INTEGER NOT NULL,
    "tipe_saldo" TEXT NOT NULL,
    "nominal" INTEGER NOT NULL,

    CONSTRAINT "JurnalPembelian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PengirimanBayaran" (
    "id" SERIAL NOT NULL,
    "header_pembelian_id" INTEGER NOT NULL,
    "akun_id" INTEGER NOT NULL,
    "cara_pembayaran_id" INTEGER NOT NULL,
    "tgl_pembayaran" TEXT NOT NULL,
    "hari" INTEGER NOT NULL,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "deskripsi" TEXT,
    "jumlah" INTEGER NOT NULL,

    CONSTRAINT "PengirimanBayaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JurnalPengirimanBayaran" (
    "id" SERIAL NOT NULL,
    "header_pembelian_id" INTEGER NOT NULL,
    "PengirimanBayaran_id" INTEGER NOT NULL,
    "akun_id" INTEGER NOT NULL,
    "nominal" INTEGER NOT NULL,
    "tipe_saldo" TEXT NOT NULL,

    CONSTRAINT "JurnalPengirimanBayaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeaderBiaya" (
    "id" SERIAL NOT NULL,
    "akun_id" INTEGER NOT NULL,
    "kategori_id" INTEGER NOT NULL,
    "tgl_transaksi" TEXT NOT NULL,
    "cara_pembayaran_id" INTEGER NOT NULL,
    "harga_termasuk_pajak" TEXT NOT NULL,
    "hari" INTEGER NOT NULL,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "pajak_masukan_total" INTEGER,
    "memo" TEXT,
    "subtotal" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,

    CONSTRAINT "HeaderBiaya_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailBiaya" (
    "id" SERIAL NOT NULL,
    "header_biaya_id" INTEGER NOT NULL,
    "akun_id" INTEGER NOT NULL,
    "kategori_id" INTEGER NOT NULL,
    "deskripsi" TEXT,
    "pajak_id" INTEGER,
    "pajak_persen" INTEGER NOT NULL,
    "pajak_masukan_akun_id" INTEGER,
    "pajak_masukan_kategori_id" INTEGER,
    "pajak_masukan_per_baris" INTEGER,
    "jumlah" INTEGER NOT NULL,

    CONSTRAINT "DetailBiaya_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JurnalBiaya" (
    "id" SERIAL NOT NULL,
    "header_biaya_id" INTEGER NOT NULL,
    "akun_id" INTEGER,
    "nominal" INTEGER,
    "tipe_saldo" TEXT NOT NULL,

    CONSTRAINT "JurnalBiaya_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SettingDefault" (
    "id" SERIAL NOT NULL,
    "akun_id" INTEGER NOT NULL,
    "tipe" TEXT NOT NULL,
    "nama_setting" TEXT NOT NULL,

    CONSTRAINT "SettingDefault_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransferUang" (
    "id" SERIAL NOT NULL,
    "akun_transfer_id" INTEGER NOT NULL,
    "akun_setor_id" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "memo" TEXT,
    "tgl_transaksi" TEXT NOT NULL,
    "hari" INTEGER NOT NULL,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,

    CONSTRAINT "TransferUang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JurnalTransferUang" (
    "id" SERIAL NOT NULL,
    "transfer_uang_id" INTEGER NOT NULL,
    "akun_id" INTEGER NOT NULL,
    "nominal" INTEGER NOT NULL,
    "tipe_saldo" TEXT NOT NULL,

    CONSTRAINT "JurnalTransferUang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeaderTerimaUang" (
    "id" SERIAL NOT NULL,
    "kontak_id" INTEGER NOT NULL,
    "akun_setor_id" INTEGER NOT NULL,
    "tgl_transaksi" TEXT NOT NULL,
    "hari" INTEGER NOT NULL,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,

    CONSTRAINT "HeaderTerimaUang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailTerimaUang" (
    "id" SERIAL NOT NULL,
    "header_terima_uang_id" INTEGER NOT NULL,
    "akun_id" INTEGER NOT NULL,
    "kategori_id" INTEGER NOT NULL,
    "deskripsi" TEXT,
    "jumlah" INTEGER NOT NULL,

    CONSTRAINT "DetailTerimaUang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JurnalTerimaUang" (
    "id" SERIAL NOT NULL,
    "header_terima_uang_id" INTEGER NOT NULL,
    "akun_id" INTEGER NOT NULL,
    "nominal" INTEGER NOT NULL,
    "tipe_saldo" TEXT NOT NULL,

    CONSTRAINT "JurnalTerimaUang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeaderKirimUang" (
    "id" SERIAL NOT NULL,
    "akun_bayar_id" INTEGER NOT NULL,
    "kontak_id" INTEGER NOT NULL,
    "tgl_transaksi" TEXT NOT NULL,
    "hari" INTEGER NOT NULL,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,

    CONSTRAINT "HeaderKirimUang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailKirimUang" (
    "id" SERIAL NOT NULL,
    "header_kirim_uang_id" INTEGER NOT NULL,
    "akun_id" INTEGER NOT NULL,
    "kategori_id" INTEGER NOT NULL,
    "deskripsi" TEXT,
    "jumlah" INTEGER NOT NULL,

    CONSTRAINT "DetailKirimUang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JurnalKirimUang" (
    "id" SERIAL NOT NULL,
    "header_kirim_uang_id" INTEGER NOT NULL,
    "akun_id" INTEGER NOT NULL,
    "nominal" INTEGER NOT NULL,
    "tipe_saldo" TEXT NOT NULL,

    CONSTRAINT "JurnalKirimUang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeaderJurnal" (
    "id" SERIAL NOT NULL,
    "tgl_transaksi" TEXT NOT NULL,
    "hari" INTEGER NOT NULL,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "total_debit" INTEGER NOT NULL,
    "total_kredit" INTEGER NOT NULL,

    CONSTRAINT "HeaderJurnal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailJurnal" (
    "id" SERIAL NOT NULL,
    "header_jurnal_id" INTEGER NOT NULL,
    "akun_id" INTEGER NOT NULL,
    "kategori_id" INTEGER NOT NULL,
    "nominal" INTEGER NOT NULL,
    "tipe_saldo" TEXT NOT NULL,
    "debit" INTEGER NOT NULL,
    "kredit" INTEGER NOT NULL,
    "debit_disable" BOOLEAN NOT NULL,
    "kredit_disable" BOOLEAN NOT NULL,
    "deskripsi" TEXT,

    CONSTRAINT "DetailJurnal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SettingPerusahaan" (
    "id" SERIAL NOT NULL,
    "logo" TEXT,
    "tampilkan_logo" BOOLEAN,
    "nama_perushaan" TEXT,
    "alamat" TEXT,
    "alamat_pengiriman" TEXT,
    "telepon" TEXT,
    "fax" TEXT,
    "npwp" TEXT,
    "website" TEXT,
    "email" TEXT,

    CONSTRAINT "SettingPerusahaan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeaderReimburse" (
    "id" SERIAL NOT NULL,
    "nama_pegawai" TEXT NOT NULL,
    "yang_mengetahui" TEXT NOT NULL,
    "yang_menyetujui" TEXT NOT NULL,
    "periode_reimbursement" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "HeaderReimburse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailReimburse" (
    "id" SERIAL NOT NULL,
    "header_reimburse_id" INTEGER NOT NULL,
    "tanggal" TEXT NOT NULL,
    "tempat" TEXT,
    "biaya" TEXT,
    "keterangan" TEXT,
    "jumlah" INTEGER NOT NULL,

    CONSTRAINT "DetailReimburse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailBank" (
    "id" SERIAL NOT NULL,
    "akun_id" INTEGER NOT NULL,
    "nama_bank" TEXT NOT NULL,
    "cabang_bank" TEXT NOT NULL,
    "nomor_rekening" TEXT NOT NULL,
    "atas_nama" TEXT NOT NULL,

    CONSTRAINT "DetailBank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaraPembayaran" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "CaraPembayaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LaporanTransaksi" (
    "id" SERIAL NOT NULL,
    "akun_id" INTEGER NOT NULL,
    "kategori_id" INTEGER NOT NULL,
    "timestamp" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "hari" INTEGER NOT NULL,
    "bulan" INTEGER NOT NULL,
    "tahun" INTEGER NOT NULL,
    "debit" INTEGER NOT NULL,
    "kredit" INTEGER NOT NULL,
    "sumber_transaksi" TEXT NOT NULL,
    "no_ref" INTEGER NOT NULL,
    "delete_ref_name" TEXT NOT NULL,
    "delete_ref_no" INTEGER NOT NULL,
    "nominal_pajak" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "LaporanTransaksi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Akun_kode_akun_key" ON "Akun"("kode_akun");

-- CreateIndex
CREATE UNIQUE INDEX "DetailSaldoAwal_akun_id_key" ON "DetailSaldoAwal"("akun_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePrivellege" ADD CONSTRAINT "RolePrivellege_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePrivellege" ADD CONSTRAINT "RolePrivellege_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Akun" ADD CONSTRAINT "Akun_kategoriId_fkey" FOREIGN KEY ("kategoriId") REFERENCES "Kategori"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Akun" ADD CONSTRAINT "Akun_tipeId_fkey" FOREIGN KEY ("tipeId") REFERENCES "TipeAkun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailSaldoAwal" ADD CONSTRAINT "DetailSaldoAwal_akun_id_fkey" FOREIGN KEY ("akun_id") REFERENCES "Akun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailSaldoAwal" ADD CONSTRAINT "DetailSaldoAwal_header_saldo_awal_id_fkey" FOREIGN KEY ("header_saldo_awal_id") REFERENCES "HeaderSaldoAwal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kontak" ADD CONSTRAINT "Kontak_akun_piutang_id_fkey" FOREIGN KEY ("akun_piutang_id") REFERENCES "Akun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kontak" ADD CONSTRAINT "Kontak_akun_hutang_id_fkey" FOREIGN KEY ("akun_hutang_id") REFERENCES "Akun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kontak" ADD CONSTRAINT "Kontak_gelar_id_fkey" FOREIGN KEY ("gelar_id") REFERENCES "Gelar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kontak" ADD CONSTRAINT "Kontak_syarat_pembayaran_id_fkey" FOREIGN KEY ("syarat_pembayaran_id") REFERENCES "SyaratPembayaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KontakDetail" ADD CONSTRAINT "KontakDetail_kontak_type_id_fkey" FOREIGN KEY ("kontak_type_id") REFERENCES "KategoriKontak"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KontakDetail" ADD CONSTRAINT "KontakDetail_kontak_id_fkey" FOREIGN KEY ("kontak_id") REFERENCES "Kontak"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produk" ADD CONSTRAINT "Produk_akun_id_fkey" FOREIGN KEY ("akun_id") REFERENCES "Akun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produk" ADD CONSTRAINT "Produk_kategori_id_fkey" FOREIGN KEY ("kategori_id") REFERENCES "KategoriProduk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pajak" ADD CONSTRAINT "Pajak_pajak_keluaran_id_fkey" FOREIGN KEY ("pajak_keluaran_id") REFERENCES "Akun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pajak" ADD CONSTRAINT "Pajak_pajak_masukan_id_fkey" FOREIGN KEY ("pajak_masukan_id") REFERENCES "Akun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeaderPenjualan" ADD CONSTRAINT "HeaderPenjualan_kontak_id_fkey" FOREIGN KEY ("kontak_id") REFERENCES "Kontak"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeaderPenjualan" ADD CONSTRAINT "HeaderPenjualan_pajak_id_fkey" FOREIGN KEY ("pajak_id") REFERENCES "Pajak"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeaderPenjualan" ADD CONSTRAINT "HeaderPenjualan_syarat_pembayaran_id_fkey" FOREIGN KEY ("syarat_pembayaran_id") REFERENCES "SyaratPembayaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailPenjualan" ADD CONSTRAINT "DetailPenjualan_produk_id_fkey" FOREIGN KEY ("produk_id") REFERENCES "Produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailPenjualan" ADD CONSTRAINT "DetailPenjualan_header_penjualan_id_fkey" FOREIGN KEY ("header_penjualan_id") REFERENCES "HeaderPenjualan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenerimaanPembayaran" ADD CONSTRAINT "PenerimaanPembayaran_akun_id_fkey" FOREIGN KEY ("akun_id") REFERENCES "Akun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenerimaanPembayaran" ADD CONSTRAINT "PenerimaanPembayaran_pajak_id_fkey" FOREIGN KEY ("pajak_id") REFERENCES "Pajak"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenerimaanPembayaran" ADD CONSTRAINT "PenerimaanPembayaran_header_penjualan_id_fkey" FOREIGN KEY ("header_penjualan_id") REFERENCES "HeaderPenjualan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenerimaanPembayaran" ADD CONSTRAINT "PenerimaanPembayaran_bank_id_fkey" FOREIGN KEY ("bank_id") REFERENCES "DetailBank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JurnalPenerimaanPembayaran" ADD CONSTRAINT "JurnalPenerimaanPembayaran_akun_id_fkey" FOREIGN KEY ("akun_id") REFERENCES "Akun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JurnalPenerimaanPembayaran" ADD CONSTRAINT "JurnalPenerimaanPembayaran_header_penjualan_id_fkey" FOREIGN KEY ("header_penjualan_id") REFERENCES "HeaderPenjualan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JurnalPenerimaanPembayaran" ADD CONSTRAINT "JurnalPenerimaanPembayaran_penerimaan_pembayaran_id_fkey" FOREIGN KEY ("penerimaan_pembayaran_id") REFERENCES "PenerimaanPembayaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeaderPembelian" ADD CONSTRAINT "HeaderPembelian_akun_hutang_supplier_id_fkey" FOREIGN KEY ("akun_hutang_supplier_id") REFERENCES "Akun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeaderPembelian" ADD CONSTRAINT "HeaderPembelian_akun_diskon_pembelian_id_fkey" FOREIGN KEY ("akun_diskon_pembelian_id") REFERENCES "Akun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeaderPembelian" ADD CONSTRAINT "HeaderPembelian_kontak_id_fkey" FOREIGN KEY ("kontak_id") REFERENCES "Kontak"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeaderPembelian" ADD CONSTRAINT "HeaderPembelian_pajak_id_fkey" FOREIGN KEY ("pajak_id") REFERENCES "Pajak"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeaderPembelian" ADD CONSTRAINT "HeaderPembelian_syarat_pembayaran_id_fkey" FOREIGN KEY ("syarat_pembayaran_id") REFERENCES "SyaratPembayaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailPembelian" ADD CONSTRAINT "DetailPembelian_akun_pembelian_id_fkey" FOREIGN KEY ("akun_pembelian_id") REFERENCES "Akun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailPembelian" ADD CONSTRAINT "DetailPembelian_header_pembelian_id_fkey" FOREIGN KEY ("header_pembelian_id") REFERENCES "HeaderPembelian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JurnalPembelian" ADD CONSTRAINT "JurnalPembelian_akun_id_fkey" FOREIGN KEY ("akun_id") REFERENCES "Akun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JurnalPembelian" ADD CONSTRAINT "JurnalPembelian_header_pembelian_id_fkey" FOREIGN KEY ("header_pembelian_id") REFERENCES "HeaderPembelian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PengirimanBayaran" ADD CONSTRAINT "PengirimanBayaran_akun_id_fkey" FOREIGN KEY ("akun_id") REFERENCES "Akun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PengirimanBayaran" ADD CONSTRAINT "PengirimanBayaran_header_pembelian_id_fkey" FOREIGN KEY ("header_pembelian_id") REFERENCES "HeaderPembelian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PengirimanBayaran" ADD CONSTRAINT "PengirimanBayaran_cara_pembayaran_id_fkey" FOREIGN KEY ("cara_pembayaran_id") REFERENCES "CaraPembayaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JurnalPengirimanBayaran" ADD CONSTRAINT "JurnalPengirimanBayaran_akun_id_fkey" FOREIGN KEY ("akun_id") REFERENCES "Akun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JurnalPengirimanBayaran" ADD CONSTRAINT "JurnalPengirimanBayaran_header_pembelian_id_fkey" FOREIGN KEY ("header_pembelian_id") REFERENCES "HeaderPembelian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JurnalPengirimanBayaran" ADD CONSTRAINT "JurnalPengirimanBayaran_PengirimanBayaran_id_fkey" FOREIGN KEY ("PengirimanBayaran_id") REFERENCES "PengirimanBayaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeaderBiaya" ADD CONSTRAINT "HeaderBiaya_akun_id_fkey" FOREIGN KEY ("akun_id") REFERENCES "Akun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeaderBiaya" ADD CONSTRAINT "HeaderBiaya_cara_pembayaran_id_fkey" FOREIGN KEY ("cara_pembayaran_id") REFERENCES "CaraPembayaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailBiaya" ADD CONSTRAINT "DetailBiaya_kategori_id_fkey" FOREIGN KEY ("kategori_id") REFERENCES "Kategori"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailBiaya" ADD CONSTRAINT "DetailBiaya_akun_id_fkey" FOREIGN KEY ("akun_id") REFERENCES "Akun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailBiaya" ADD CONSTRAINT "DetailBiaya_pajak_id_fkey" FOREIGN KEY ("pajak_id") REFERENCES "Pajak"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailBiaya" ADD CONSTRAINT "DetailBiaya_header_biaya_id_fkey" FOREIGN KEY ("header_biaya_id") REFERENCES "HeaderBiaya"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JurnalBiaya" ADD CONSTRAINT "JurnalBiaya_akun_id_fkey" FOREIGN KEY ("akun_id") REFERENCES "Akun"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JurnalBiaya" ADD CONSTRAINT "JurnalBiaya_header_biaya_id_fkey" FOREIGN KEY ("header_biaya_id") REFERENCES "HeaderBiaya"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SettingDefault" ADD CONSTRAINT "SettingDefault_akun_id_fkey" FOREIGN KEY ("akun_id") REFERENCES "Akun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferUang" ADD CONSTRAINT "TransferUang_akun_transfer_id_fkey" FOREIGN KEY ("akun_transfer_id") REFERENCES "Akun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferUang" ADD CONSTRAINT "TransferUang_akun_setor_id_fkey" FOREIGN KEY ("akun_setor_id") REFERENCES "Akun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JurnalTransferUang" ADD CONSTRAINT "JurnalTransferUang_akun_id_fkey" FOREIGN KEY ("akun_id") REFERENCES "Akun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JurnalTransferUang" ADD CONSTRAINT "JurnalTransferUang_transfer_uang_id_fkey" FOREIGN KEY ("transfer_uang_id") REFERENCES "TransferUang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeaderTerimaUang" ADD CONSTRAINT "HeaderTerimaUang_akun_setor_id_fkey" FOREIGN KEY ("akun_setor_id") REFERENCES "Akun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeaderTerimaUang" ADD CONSTRAINT "HeaderTerimaUang_kontak_id_fkey" FOREIGN KEY ("kontak_id") REFERENCES "Kontak"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailTerimaUang" ADD CONSTRAINT "DetailTerimaUang_akun_id_fkey" FOREIGN KEY ("akun_id") REFERENCES "Akun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailTerimaUang" ADD CONSTRAINT "DetailTerimaUang_header_terima_uang_id_fkey" FOREIGN KEY ("header_terima_uang_id") REFERENCES "HeaderTerimaUang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JurnalTerimaUang" ADD CONSTRAINT "JurnalTerimaUang_akun_id_fkey" FOREIGN KEY ("akun_id") REFERENCES "Akun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JurnalTerimaUang" ADD CONSTRAINT "JurnalTerimaUang_header_terima_uang_id_fkey" FOREIGN KEY ("header_terima_uang_id") REFERENCES "HeaderTerimaUang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeaderKirimUang" ADD CONSTRAINT "HeaderKirimUang_akun_bayar_id_fkey" FOREIGN KEY ("akun_bayar_id") REFERENCES "Akun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeaderKirimUang" ADD CONSTRAINT "HeaderKirimUang_kontak_id_fkey" FOREIGN KEY ("kontak_id") REFERENCES "Kontak"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailKirimUang" ADD CONSTRAINT "DetailKirimUang_akun_id_fkey" FOREIGN KEY ("akun_id") REFERENCES "Akun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailKirimUang" ADD CONSTRAINT "DetailKirimUang_header_kirim_uang_id_fkey" FOREIGN KEY ("header_kirim_uang_id") REFERENCES "HeaderKirimUang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JurnalKirimUang" ADD CONSTRAINT "JurnalKirimUang_akun_id_fkey" FOREIGN KEY ("akun_id") REFERENCES "Akun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JurnalKirimUang" ADD CONSTRAINT "JurnalKirimUang_header_kirim_uang_id_fkey" FOREIGN KEY ("header_kirim_uang_id") REFERENCES "HeaderKirimUang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailJurnal" ADD CONSTRAINT "DetailJurnal_akun_id_fkey" FOREIGN KEY ("akun_id") REFERENCES "Akun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailJurnal" ADD CONSTRAINT "DetailJurnal_header_jurnal_id_fkey" FOREIGN KEY ("header_jurnal_id") REFERENCES "HeaderJurnal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailReimburse" ADD CONSTRAINT "DetailReimburse_header_reimburse_id_fkey" FOREIGN KEY ("header_reimburse_id") REFERENCES "HeaderReimburse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailBank" ADD CONSTRAINT "DetailBank_akun_id_fkey" FOREIGN KEY ("akun_id") REFERENCES "Akun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanTransaksi" ADD CONSTRAINT "LaporanTransaksi_kategori_id_fkey" FOREIGN KEY ("kategori_id") REFERENCES "Kategori"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanTransaksi" ADD CONSTRAINT "LaporanTransaksi_akun_id_fkey" FOREIGN KEY ("akun_id") REFERENCES "Akun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
