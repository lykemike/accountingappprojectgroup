import prisma from "../../../../libs/prisma";
import jwtDecode from "jwt-decode";
import moment from "moment";

export default async (req, res) => {
  try {
    const { pajakId } = req.query;
    const findPajak = await prisma.pajak.findFirst({
      where: {
        id: +pajakId,
      },
      include: {
        HeaderPenjualan: true,
        PenerimaanPembayaran: true,
        HeaderPembelian: true,
        BiayaPajak: true,
      },
    });

    const totalTransactions =
      findPajak.HeaderPenjualan.length +
      findPajak.PenerimaanPembayaran.length +
      findPajak.HeaderPembelian.length +
      findPajak.BiayaPajak.length;

    if (totalTransactions > 0) {
      return res.status(400).json({ message: `${findPajak.nama} still has ongoing transactions` });
    } else {
      await prisma.pajak.delete({
        where: {
          id: +pajakId,
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
          page: "/pajak",
          time: currentDatetime,
          action: "DELETE",
          description: `${currentDatetime} | ${decodedAccessToken.first_name} has deleted pajak "${findPajak.nama}".`,
        },
      });

      return res.status(201).json({ message: `Delete pajak success` });
    }

    res.status(201).json({ message: "Delete pajak success" });
  } catch (error) {
    res.status(400).json({ message: "Delete pajak failed", error });
    console.log(error);
  }
};
