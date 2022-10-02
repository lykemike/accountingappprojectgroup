import prisma from "../../../libs/prisma";

export default async (req, res) => {
  try {
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

    res.status(201).json({ message: "Get pajak kategori success", getPajakKeluaran, getPajakMasukan });
  } catch (error) {
    res.status(400).json({ message: "Get pajak kategori failed", error });
    console.log(error);
  }
};
