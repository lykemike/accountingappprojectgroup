import moment from "moment";
import jwtDecode from "jwt-decode";
import prisma from "../../../../libs/prisma";

export default async (req, res) => {
  try {
    const { pembelianId } = req.query;

    const checkLinkedTransactions = await prisma.headerPembelian.findFirst({
      where: {
        id: +pembelianId,
      },
      include: {
        PengirimanBayaran: true,
      },
    });

    if (checkLinkedTransactions.PengirimanBayaran.length > 0) {
      return res.status(400).json({ message: `Purchase Invoice #${pembelianId} has ongoing transactions` });
    } else {
      const deleteLaporanTransaksi = prisma.laporanTransaksi.deleteMany({
        where: {
          delete_ref_no: +pembelianId,
          delete_ref_name: "Purchase Invoice",
        },
      });

      const deleteJurnalPembelian = prisma.jurnalPembelian.deleteMany({
        where: {
          header_pembelian_id: +pembelianId,
        },
      });

      const deleteDetailPembelian = prisma.detailPembelian.deleteMany({
        where: {
          header_pembelian_id: +pembelianId,
        },
      });

      const deleteHeaderPembelian = prisma.headerPembelian.deleteMany({
        where: {
          id: +pembelianId,
        },
      });

      await prisma.$transaction([deleteLaporanTransaksi, deleteJurnalPembelian, deleteDetailPembelian, deleteHeaderPembelian]);

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
          page: "/penjualan",
          time: currentDatetime,
          action: "DELETE",
          description: `${currentDatetime} | ${decodedAccessToken.first_name} has deleted Purchase Invoice #${pembelianId}.`,
        },
      });
    }

    res.status(201).json({ message: "Delete pembelian success" });
  } catch (error) {
    res.status(400).json({ message: "Delete pembelian failed", error });
  }
};
