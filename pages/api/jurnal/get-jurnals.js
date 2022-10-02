import prisma from "../../../libs/prisma";

export default async (req, res) => {
  try {
    const getJurnals = await prisma.headerJurnal.findMany({
      orderBy: {
        id: "desc",
      },
    });

    const newJurnalsArray = [];
    getJurnals.map((i) => {
      newJurnalsArray.push({
        id: i.id,
        tgl_transaksi: i.tgl_transaksi,
        total_debit: `Rp. ${i.total_debit.toLocaleString()}`,
        total_kredit: `Rp. ${i.total_kredit.toLocaleString()}`,
        ref: `Journal Entry #${i.id}`,
      });
    });

    res.status(201).json({
      message: "Get jurnals data success",
      newJurnalsArray,
    });
  } catch (error) {
    res.status(400).json({ message: "Get jurnals data failed", error });
    console.log(error);
  }
};
