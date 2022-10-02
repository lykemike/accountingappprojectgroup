import prisma from "../../../../libs/prisma";

export default async (req, res) => {
  try {
    const { kategoriId } = req.query;
    const currentKategori = await prisma.kategoriProduk.findFirst({
      where: {
        id: +kategoriId,
      },
    });

    const fields = [
      {
        name: ["nama_kategori"],
        value: currentKategori.nama,
      },
    ];

    res.status(201).json({
      message: "Find kategori success",
      fields,
    });
  } catch (error) {
    res.status(400).json({ message: "Find kategori failed", error });
    console.log(error);
  }
};
