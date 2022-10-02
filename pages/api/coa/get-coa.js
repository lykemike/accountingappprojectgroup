import prisma from "../../../libs/prisma";

export default async (req, res) => {
  try {
    const getCoa = await prisma.akun.findMany({
      orderBy: {
        kode_akun: "asc",
      },
      include: {
        kategori_akun: true,
        DetailSaldoAwal: true,
      },
    });

    let newCoaArray = [];
    getCoa.map((i) => {
      newCoaArray.push({
        id: i.id,
        kode_akun: i.kode_akun,
        tipe_id: i.tipeId,
        nama_akun: i.nama_akun,
        kategori_id: i.kategoriId,
        kategori_akun: i.kategori_akun.name,
        detail_saldo_debit:
          i.DetailSaldoAwal.length == 0 ? " 0, 00" : i.DetailSaldoAwal[0].debit.toLocaleString({ minimumFractionDigits: 0 }),
        detail_saldo_kredit:
          i.DetailSaldoAwal.length == 0 ? " 0, 00" : i.DetailSaldoAwal[0].kredit.toLocaleString({ minimumFractionDigits: 0 }),
        detail_saldo_sisa:
          i.DetailSaldoAwal.length == 0 ? " 0, 00" : i.DetailSaldoAwal[0].sisa_saldo.toLocaleString({ minimumFractionDigits: 0 }),
      });
    });

    res.status(201).json({ message: "Get all chart of account success", newCoaArray });
  } catch (error) {
    res.status(400).json({ message: "Get all chart of account failed", error });
    console.log(error);
  }
};
