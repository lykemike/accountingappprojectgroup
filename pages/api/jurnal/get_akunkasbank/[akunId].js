import prisma from "../../../../libs/prisma";

export default async (req, res) => {
  try {
    let akunid = req.query.akunId;

    const getAkuns = await prisma.detailSaldoAwal.findFirst({
      where: {
        akun_id: parseInt(akunid),
      },
    });

    let newDataArray = [];
    newDataArray.push({
      ...getAkuns,
      id: akunid,
    });

    res.status(201).json({
      message: "Get data success",
      getAkuns,
      newDataArray,
    });
  } catch (error) {
    res.status(400).json({ message: "Get akuns data failed", error });
    console.log(error);
  }
};
