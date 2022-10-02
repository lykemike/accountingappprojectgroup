import moment from "moment";
import jwtDecode from "jwt-decode";
import prisma from "../../../../libs/prisma";

export default async (req, res) => {
  try {
    const { penerimaanId } = req.query;
    const getPenerimaanPembayaran = await prisma.penerimaanPembayaran.findFirst({
      where: {
        id: +penerimaanId,
      },
      include: {
        header_penjualan: true,
      },
    });

    const headerPenjualanId = getPenerimaanPembayaran.header_penjualan.id;
    const tipePerusahaan = getPenerimaanPembayaran.header_penjualan.tipe_perusahaan;
    const tagihanSebelumPajak = getPenerimaanPembayaran.tagihan_sebelum_pajak;
    const tagihanSetelahPajak = getPenerimaanPembayaran.tagihan_setelah_pajak;
    const sisaTagihan = getPenerimaanPembayaran.header_penjualan.sisa_tagihan;

    if (tipePerusahaan == "false") {
      const revertSisaTagihan = tagihanSebelumPajak + sisaTagihan;

      await prisma.headerPenjualan.update({
        where: {
          id: +headerPenjualanId,
        },
        data: {
          sisa_tagihan: +revertSisaTagihan,
        },
      });

      const updatedHeaderData = await prisma.headerPenjualan.findFirst({
        where: {
          id: +headerPenjualanId,
        },
      });

      if (updatedHeaderData.total == updatedHeaderData.sisa_tagihan) {
        await prisma.headerPenjualan.update({
          where: {
            id: +headerPenjualanId,
          },
          data: {
            status: "Active",
          },
        });
      }
    } else {
      const revertSisaTagihan = tagihanSetelahPajak + sisaTagihan;

      await prisma.headerPenjualan.update({
        where: {
          id: +headerPenjualanId,
        },
        data: {
          sisa_tagihan: +revertSisaTagihan,
        },
      });

      const updatedHeaderData = await prisma.headerPenjualan.findFirst({
        where: {
          id: +headerPenjualanId,
        },
      });

      if (updatedHeaderData.total == updatedHeaderData.sisa_tagihan) {
        await prisma.headerPenjualan.update({
          where: {
            id: +headerPenjualanId,
          },
          data: {
            status: "Active",
          },
        });
      }
    }

    await prisma.laporanTransaksi.deleteMany({
      where: {
        delete_ref_no: +penerimaanId,
        delete_ref_name: "Penerimaan Pembayaran",
      },
    });

    const deleteJurnalPenerimaan = prisma.jurnalPenerimaanPembayaran.deleteMany({
      where: {
        penerimaan_pembayaran_id: +penerimaanId,
      },
    });

    const deletePenerimaan = prisma.penerimaanPembayaran.delete({
      where: {
        id: +penerimaanId,
      },
    });

    await prisma.$transaction([deleteJurnalPenerimaan, deletePenerimaan]);

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
        page: "/penjualan/terima-pembayaran",
        time: currentDatetime,
        action: "DELETE",
        description: `${currentDatetime} | ${decodedAccessToken.first_name} has deleted Penerimaan Pembayaran #${+penerimaanId}.`,
      },
    });

    res.status(201).json({
      message: "Delete penerimaan pembayaran success",
    });
  } catch (error) {
    res.status(400).json({ message: "Delete penerimaan pembayaran failed", error });
    console.log(error);
  }
};
