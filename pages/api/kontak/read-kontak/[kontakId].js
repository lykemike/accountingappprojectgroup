import prisma from "../../../../libs/prisma";

export default async (req, res) => {
  try {
    const { kontakId } = req.query;
    const viewKontak = await prisma.kontak.findFirst({
      where: {
        id: +kontakId,
      },
      include: {
        KontakDetail: {
          select: {
            kontak_type_id: true,
          },
        },
      },
    });

    let curretKontakKategori = viewKontak?.KontakDetail?.map((i) => "" + i.kontak_type_id);

    const getKategoriKontak = await prisma.kategoriKontak.findMany();

    const kategoriOptions = [];
    getKategoriKontak?.map((i) => {
      kategoriOptions.push({
        label: i.nama,
        value: "" + i.id,
      });
    });

    const getAkunPiutang = await prisma.akun.findMany({
      where: {
        kategoriId: 1,
      },
    });

    const getAkunHutang = await prisma.akun.findMany({
      where: {
        kategoriId: 8,
      },
    });

    const getGelar = await prisma.gelar.findMany();
    const getSyaratPembayaran = await prisma.syaratPembayaran.findMany();

    const fields = [
      {
        name: ["kategori_kontak"],
        value: curretKontakKategori,
      },
      {
        name: ["info_kontak", "gelar_id"],
        value: viewKontak.gelar_id,
      },
      {
        name: ["info_kontak", "nama_kontak"],
        value: viewKontak.nama,
      },
      {
        name: ["nomor_hp"],
        value: viewKontak.nomor_hp,
      },
      {
        name: ["email"],
        value: viewKontak.email,
      },
      {
        name: ["jabatan"],
        value: viewKontak.jabatan,
      },
      {
        name: ["nama_perusahaan"],
        value: viewKontak.nama_perusahaan,
      },
      {
        name: ["nomor_telepon"],
        value: viewKontak.nomor_telepon,
      },
      {
        name: ["nomor_telepon"],
        value: viewKontak.nomor_telepon,
      },
      {
        name: ["nomor_fax"],
        value: viewKontak.nomor_fax,
      },
      {
        name: ["nomor_npwp"],
        value: viewKontak.nomor_npwp,
      },
      {
        name: ["alamat_perusahaan"],
        value: viewKontak.alamat_perusahaan,
      },
      {
        name: ["nama_bank"],
        value: viewKontak.nama_bank,
      },
      {
        name: ["kantor_cabang_bank"],
        value: viewKontak.kantor_cabang_bank,
      },
      {
        name: ["nomor_rekening"],
        value: viewKontak.nomor_rekening,
      },
      {
        name: ["atas_nama"],
        value: viewKontak.atas_nama,
      },
      {
        name: ["akun_piutang_id"],
        value: viewKontak.akun_piutang_id,
      },
      {
        name: ["akun_hutang_id"],
        value: viewKontak.akun_hutang_id,
      },
      {
        name: ["syarat_pembayaran_id"],
        value: viewKontak.syarat_pembayaran_id,
      },
    ];

    res.status(201).json({
      message: "Find kontak success",
      viewKontak,
      curretKontakKategori,
      kategoriOptions,
      getGelar,
      fields,
      getAkunPiutang,
      getAkunHutang,
      getGelar,
      getSyaratPembayaran,
    });
  } catch (error) {
    res.status(400).json({ message: "Find kontak failed", error });
    console.log(error);
  }
};
