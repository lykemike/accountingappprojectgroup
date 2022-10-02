import prisma from "../../../../libs/prisma";
import jwtDecode from "jwt-decode";
import moment from "moment";

export default async (req, res) => {
  try {
    const { kontakId } = req.query;
    const findKontak = await prisma.kontak.findFirst({
      where: {
        id: +kontakId,
      },
      include: {
        HeaderPenjualan: true,
        HeaderPembelian: true,
        HeaderTerimaUang: true,
        HeaderKirimUang: true,
      },
    });

    const totalTransactions =
      findKontak.HeaderPenjualan.length +
      findKontak.HeaderPembelian.length +
      findKontak.HeaderTerimaUang.length +
      findKontak.HeaderKirimUang.length;

    if (totalTransactions > 0) {
      return res.status(400).json({ message: `${findKontak.nama_perusahaan} still has ongoing transactions` });
    } else {
      await prisma.kontakDetail.deleteMany({
        where: {
          kontak_id: +kontakId,
        },
      });

      await prisma.kontak.delete({
        where: {
          id: +kontakId,
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
          page: "/kontak",
          time: currentDatetime,
          action: "DELETE",
          description: `${currentDatetime} | ${decodedAccessToken.first_name} has deleted kontak "${findKontak.nama_perusahaan}".`,
        },
      });

      return res.status(201).json({ message: `Delete kontak success` });
    }

    res.status(201).json({
      message: "Delete kontak success",
    });
  } catch (error) {
    res.status(400).json({ message: "Delete kontak failed", error });
    console.log(error);
  }
};
