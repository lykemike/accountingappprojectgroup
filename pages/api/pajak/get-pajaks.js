import prisma from "../../../libs/prisma";
import jwtDecode from "jwt-decode";
import moment from "moment";

export default async (req, res) => {
  try {
    const getPajak = await prisma.pajak.findMany({
      orderBy: [
        {
          id: "asc",
        },
      ],
      include: {
        pajak_keluaran: {
          select: {
            kode_akun: true,
            nama_akun: true,
          },
        },
        pajak_masukan: {
          select: {
            kode_akun: true,
            nama_akun: true,
          },
        },
      },
    });

    const newPajakArray = [];
    getPajak.map((i) => {
      newPajakArray.push({
        id: i.id,
        nama: i.nama,
        presentase_aktif: i.presentase_aktif,
        pajak_keluaran_id: i.pajak_keluaran_id,
        pajak_masukan_id: i.pajak_masukan_id,
        pajak_keluaran: i.pajak_keluaran.kode_akun + " - " + i.pajak_keluaran.nama_akun,
        pajak_masukan: i.pajak_masukan.kode_akun + " - " + i.pajak_masukan.nama_akun,
      });
    });

    res.status(201).json({ message: "Get pajak success", newPajakArray });
  } catch (error) {
    res.status(400).json({ message: "Get pajak failed", error });
    console.log(error);
  }
};
