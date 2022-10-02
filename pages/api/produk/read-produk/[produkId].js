import prisma from "../../../../libs/prisma";

export default async (req, res) => {
  try {
    const { produkId } = req.query;

    const currentProduk = await prisma.produk.findFirst({
      where: {
        id: +produkId,
      },
      include: {
        DetailPenjualan: {
          include: {
            header_penjualan: true,
          },
        },
        kategori: {
          select: {
            nama: true,
          },
        },
        akun: {
          select: {
            kode_akun: true,
            nama_akun: true,
          },
        },
      },
    });

    const detailTransactions = currentProduk.DetailPenjualan;

    const newProdukArray = [];
    newProdukArray.push({
      id: currentProduk.id,
      file: currentProduk.file_attachment,
      nama: currentProduk.nama,
      deskripsi: currentProduk.deskripsi,
      harga: "Rp. " + currentProduk.harga.toLocaleString(),
      kategori: currentProduk.kategori.nama,
      akun: currentProduk.akun.kode_akun + " - " + currentProduk.akun.nama_akun,
    });

    const fields = [
      {
        name: ["gambar"],
        value: currentProduk.file_attachment,
      },
      {
        name: ["nama_produk"],
        value: currentProduk.nama,
      },
      {
        name: ["kategori_id"],
        value: currentProduk.kategori_id,
      },
      {
        name: ["description"],
        value: currentProduk.deskripsi,
      },
      {
        name: ["harga"],
        value: currentProduk.harga,
      },
      {
        name: ["akun_penjualan_id"],
        value: currentProduk.akun_id,
      },
    ];

    const getKategoriProduk = await prisma.kategoriProduk.findMany();
    const getAkunPenjualan = await prisma.akun.findMany({
      where: {
        kategoriId: {
          in: [13],
        },
      },
    });

    res.status(201).json({
      message: "Find produk success",
      newProdukArray,
      fields,
      getKategoriProduk,
      getAkunPenjualan,
      detailTransactions,
    });
  } catch (error) {
    res.status(400).json({ message: "Find produk failed", error });
    console.log(error);
  }
};
