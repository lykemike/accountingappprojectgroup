import prisma from "../../../../libs/prisma";

export default async (req, res) => {
  try {
    const { penerimaanId } = req.query;

    const headerPenjualanId = await prisma.penerimaanPembayaran.findFirst({
      where: {
        id: +penerimaanId,
      },
      select: {
        header_penjualan_id: true,
      },
    });

    const getHeaderPenjualan = await prisma.headerPenjualan.findFirst({
      where: {
        id: headerPenjualanId.header_penjualan_id,
      },
      include: {
        kontak: true,
        DetailPenjualan: true,
        pajak: true,
        syarat_pembayaran: true,
      },
    });

    const getAkunSetor = await prisma.akun.findMany({
      where: {
        kategoriId: 3,
      },
    });

    const getPajak = await prisma.pajak.findMany({
      include: {
        pajak_masukan: true,
      },
    });

    const getPenerimaanPembayaran = await prisma.penerimaanPembayaran.findFirst({
      where: {
        id: +penerimaanId,
      },
      include: {
        pajak: true,
        akun: true,
        JurnalPenerimaanPembayaran: {
          include: {
            akun: true,
          },
        },
        header_penjualan: {
          include: {
            kontak: true,
            DetailPenjualan: true,
            pajak: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Find current penerimaan success",
      getHeaderPenjualan,
      getPenerimaanPembayaran,
      getAkunSetor,

      getPajak,
    });
  } catch (error) {
    res.status(400).json({ message: "Find current penerimaan failed", error });
    console.log(error);
  }
};
