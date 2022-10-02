import prisma from "../../../libs/prisma";
import jwtDecode from "jwt-decode";
import moment from "moment";

export default async (req, res) => {
  try {
    const createPajak = await prisma.pajak.create({
      data: {
        nama: req.body.nama_pajak,
        presentase_aktif: +req.body.presentase_aktif,
        pajak_keluaran_id: +req.body.pajak_keluaran_id,
        pajak_masukan_id: +req.body.pajak_masukan_id,
      },
    });

    const currentDatetime = moment().toISOString().substring(0, 10) + " " + moment().format("HH:mm");
    const { cookies } = req;
    const accessToken = cookies.access_token;
    const decodedAccessToken = jwtDecode(accessToken);

    const findRole = await prisma.role.findFirst({
      where: {
        id: +decodedAccessToken.role,
      },
    });

    await prisma.auditLog.create({
      data: {
        user: decodedAccessToken.first_name,
        role: findRole.role_name,
        page: "/pajak/add-pajak",
        time: currentDatetime,
        action: "CREATE",
        description: `${currentDatetime} | ${decodedAccessToken.first_name} has created a new pajak "${createPajak.nama}".`,
      },
    });

    res.status(201).json({ message: "Create pajak success" });
  } catch (error) {
    res.status(400).json({ message: "Create pajak failed", error });
  }
};
