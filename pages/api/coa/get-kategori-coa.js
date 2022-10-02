import prisma from "../../../libs/prisma";

export default async (req, res) => {
  try {
    const getKategoriCoa = await prisma.kategori.findMany({
      where: {
        NOT: {
          name: {
            equals: "Kartu Kredit",
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    res.status(201).json({ message: "Get kategori chart of account success", getKategoriCoa });
  } catch (error) {
    res.status(400).json({ message: "Get kategori chart of account failed", error });
    console.log(error);
  }
};
