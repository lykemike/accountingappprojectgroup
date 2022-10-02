import moment from "moment";
import jwtDecode from "jwt-decode";
import prisma from "../../../../libs/prisma";

export default async (req, res) => {
  try {
    const { penjualanId } = req.query;

    const checkLinkedTransactions = await prisma.headerPenjualan.findFirst({
      where: {
        id: +penjualanId,
      },
      include: {
        PenerimaanPembayaran: true,
      },
    });

    if (checkLinkedTransactions.PenerimaanPembayaran.length > 0) {
      return res.status(400).json({ message: `Sales Invoice #${penjualanId} has ongoing transactions` });
    } else {
      const deleteJurnalPenerimaan = prisma.jurnalPenerimaanPembayaran.deleteMany({
        where: {
          header_penjualan_id: +penjualanId,
        },
      });

      const deletePenerimaan = prisma.penerimaanPembayaran.deleteMany({
        where: {
          header_penjualan_id: +penjualanId,
        },
      });

      const deleteDetail = prisma.detailPenjualan.deleteMany({
        where: {
          header_penjualan_id: +penjualanId,
        },
      });

      const deleteHeader = prisma.headerPenjualan.deleteMany({
        where: {
          id: +penjualanId,
        },
      });

      await prisma.$transaction([deleteJurnalPenerimaan, deletePenerimaan, deleteDetail, deleteHeader]);

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
          page: "/penjualan/delete-penjualan",
          time: currentDatetime,
          action: "DELETE",
          description: `${currentDatetime} | ${decodedAccessToken.first_name} has deleted Sales Invoice #${penjualanId}.`,
        },
      });
    }

    res.status(201).json({ message: "Delete penjualan success" });
  } catch (error) {
    res.status(400).json({ message: "Delete penjualan failed", error });
  }
};
