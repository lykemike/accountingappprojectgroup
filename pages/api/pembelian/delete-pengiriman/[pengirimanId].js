import moment from "moment";
import jwtDecode from "jwt-decode";
import prisma from "../../../../libs/prisma";

export default async (req, res) => {
  try {
    const { pengirimanId } = req.query;

    const getPengirimanPembayaran = await prisma.pengirimanBayaran.findFirst({
      where: {
        id: +pengirimanId,
      },
      include: {
        header_pembelian: true,
      },
    });

    const jumlahPengirimanPembayaran = getPengirimanPembayaran.jumlah;
    const sisaTagihanHeaderPembelian = getPengirimanPembayaran.header_pembelian.sisa_tagihan;

    await prisma.headerPembelian.update({
      where: {
        id: getPengirimanPembayaran.header_pembelian.id,
      },
      data: {
        sisa_tagihan: sisaTagihanHeaderPembelian + jumlahPengirimanPembayaran,
      },
    });

    const deleteLaporanTransaksi = prisma.laporanTransaksi.deleteMany({
      where: {
        delete_ref_no: +pengirimanId,
        delete_ref_name: "Pengiriman Pembayaran",
      },
    });

    const deleteJurnal = prisma.jurnalPengirimanBayaran.deleteMany({
      where: {
        PengirimanBayaran_id: +pengirimanId,
      },
    });

    const deletePengiriman = prisma.pengirimanBayaran.delete({
      where: {
        id: +pengirimanId,
      },
    });

    await prisma.$transaction([deleteLaporanTransaksi, deleteJurnal, deletePengiriman]);

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
        page: "/pembelian",
        time: currentDatetime,
        action: "DELETE",
        description: `${currentDatetime} | ${
          decodedAccessToken.first_name
        } has deleted Pengiriman Pembayaran #${pengirimanId} with deductible amount "Rp. ${jumlahPengirimanPembayaran.toLocaleString()}".`,
      },
    });

    res.status(201).json({ message: "Delete pengiriman pembayaran success" });
  } catch (error) {
    res.status(400).json({ message: "Delete pengiriman pembayaran failed", error });
  }
};
