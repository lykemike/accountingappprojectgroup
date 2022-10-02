import prisma from "../../../../libs/prisma";
import jwtDecode from "jwt-decode";
import moment from "moment";

export default async (req, res) => {
  try {
    const { jurnalId } = req.query;

    await prisma.laporanTransaksi.deleteMany({
      where: {
        no_ref: +jurnalId,
        delete_ref_name: "Journal Entry",
      },
    });

    await prisma.detailJurnal.deleteMany({
      where: {
        header_jurnal_id: +jurnalId,
      },
    });

    await prisma.headerJurnal.delete({
      where: {
        id: +jurnalId,
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
        page: "/jurnal",
        time: currentDatetime,
        action: "DELETE",
        description: `${currentDatetime} | ${decodedAccessToken.first_name} has deleted "Journal Entry #${jurnalId}".`,
      },
    });

    res.status(201).json({ message: "Delete jurnal success" });
  } catch (error) {
    res.status(400).json({ message: "Delete jurnal failed", error });
    console.log(error);
  }
};
