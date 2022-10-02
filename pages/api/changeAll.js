import prisma from "../../libs/prisma";

export default async (req, res) => {
  try {
    const hey = await prisma.headerPembelian.create({
      data: {
        kontak_id: 8,
        email: "sanggriawan@yahoo.co.id",
        alamat_perusahaan: "Jl Sidikan 18, Jawa Tengah",
        akun_hutang_supplier_id: 88,
        tgl_transaksi: "2022/06/17",
        hari: 17,
        bulan: 6,
        tahun: 2022,
        tgl_jatuh_tempo: "2022/08/30",
        syarat_pembayaran_id: 3,
        no_ref_penagihan: "sde asdasdasdsad",
        memo: "SDADSADSAD",
        file_attachment: "588111004-mvyf38n0hweyd18pzm6ff7hr6cjklswe.png",
        subtotal: 2410000,
        akun_diskon_pembelian_id: 125,
        total_diskon: 153500,
        pajak_id: 2,
        total_pajak: 241000,
        pajak_persen: 10,
        status: "Active",
        sisa_tagihan: 2497500,
      },
    });
    console.log(hey);

    res.status(201).json({ message: "Create pembelian success" });
  } catch (error) {
    res.status(400).json({ message: "Create pembelian failed", error });
  }
};
