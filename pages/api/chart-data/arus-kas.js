import prisma from "../../../libs/prisma";

export default async (req, res) => {
  try {
    const getKasBank = await prisma.akun.findMany({
      where: {
        kategoriId: 3,
      },
      include: {
        DetailSaldoAwal: true,
      },
    });

    let newKasBankArray = [];
    getKasBank.map((i) => {
      newKasBankArray.push({
        id: i.id,
        label: i.kode_akun + " - " + i.nama_akun,
        saldo_awal: i.DetailSaldoAwal.length > 0 ? i.DetailSaldoAwal[0].debit : 0,
        saldo_skrg: i.DetailSaldoAwal.length > 0 ? i.DetailSaldoAwal[0].sisa_saldo : 0,
        presentase_sisa: i.DetailSaldoAwal == 0 ? 0 : (i.DetailSaldoAwal[0].sisa_saldo / i.DetailSaldoAwal[0].debit) * 100,
      });
    });

    let totalSaldoAwal = newKasBankArray?.reduce((a, b) => (a = a + b.saldo_awal), 0);
    let totalSaldoSkrg = newKasBankArray?.reduce((a, b) => (a = a + b.saldo_skrg), 0);

    res.status(201).json({ message: "Get saldo kas bank success", totalSaldoAwal, totalSaldoSkrg });
  } catch (error) {
    res.status(400).json({ message: "Get saldo kas bank failed", error });
    console.log(error);
  }
};
