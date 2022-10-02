import prisma from "../../../../libs/prisma";

export default async (req, res) => {
  try {
    const { pajakId } = req.query;

    const currentPajak = await prisma.pajak.findFirst({
      where: {
        id: +pajakId,
      },
      include: {
        pajak_keluaran: {
          select: {
            kode_akun: true,
            nama_akun: true,
          },
        },
        pajak_masukan: {
          select: {
            kode_akun: true,
            nama_akun: true,
          },
        },
      },
    });

    const getPajakKeluaran = await prisma.akun.findMany({
      orderBy: {
        kode_akun: "asc",
      },
      where: {
        kategoriId: {
          in: [10, 11, 13, 14, 16, 17],
        },
      },
    });

    const getPajakMasukan = await prisma.akun.findMany({
      orderBy: {
        kode_akun: "asc",
      },
      where: {
        kategoriId: {
          in: [2, 13, 14, 16, 17],
        },
      },
    });

    const fields = [
      {
        name: ["nama_pajak"],
        value: currentPajak.nama,
      },
      {
        name: ["presentase_aktif"],
        value: currentPajak.presentase_aktif,
      },
      {
        name: ["pajak_keluaran_id"],
        value: currentPajak.pajak_keluaran_id,
      },
      {
        name: ["pajak_masukan_id"],
        value: currentPajak.pajak_masukan_id,
      },
    ];

    res.status(201).json({ message: "Get current pajak success", getPajakKeluaran, getPajakMasukan, pajakId, fields });
  } catch (error) {
    res.status(400).json({ message: "Get current pajak failed", error });
    console.log(error);
  }
};
