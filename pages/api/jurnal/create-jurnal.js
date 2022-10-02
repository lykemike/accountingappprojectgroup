import moment from "moment";
import jwtDecode from "jwt-decode";
import prisma from "../../../libs/prisma";

export default async (req, res) => {
  try {
    const dateTime = moment().format("YYYY/MM/DD") + " " + moment().format("HH:mm");
    const dateOnly = dateTime.split(" ")[0];
    const timeOnly = dateTime.split(" ")[1];
    const day = dateOnly.split("/")[2];
    const month = dateOnly.split("/")[1];
    const year = dateOnly.split("/")[0];

    const data = req.body;

    const createHeaderJurnal = await prisma.headerJurnal.create({
      data: {
        akun_id: +req.body.akun_kasbank,
        // hari: +day,
        // bulan: +month,
        // tahun: +year,
        total_debit: +req.body.total_debit,
        total_kredit: +req.body.total_kredit,
      },
    });
    const findLatest = await prisma.headerJurnal.findFirst({
      orderBy: {
        id: "desc",
      },
    });

    const latestHeaderJurnalId = findLatest.id;

    let detailJurnalArray = [];
    req.body.detail_jurnal.map((i) => {
      detailJurnalArray.push({
        header_jurnal_id: findLatest.id,
        akun_id: +i.akun_id,
        kategori_id: +i.kategori_id,
        tgl_transaksi: i.tgl_transaksi,
        darikepada: i.darikepada,
        deskripsi: i.deskripsi,
        debit: +i.debit,
        kredit: +i.kredit,
        nominal: +i.nominal,
        tipe_saldo: i.tipe_saldo,
        debit_disable: i.debit_disable,
        kredit_disable: i.kredit_disable,
        sisa_saldo: i.sisa_saldo,
      });
    });

    await prisma.detailJurnal.createMany({
      data: detailJurnalArray,
    });

    const find_sisa_saldo_akhir = await prisma.detailJurnal.findFirst({
      orderBy: {
        id: "desc",
      },
    });

    await prisma.detailSaldoAwal.update({
      where: {
        akun_id: +req.body.akun_kasbank,
      },
      data: {
        sisa_saldo: find_sisa_saldo_akhir.sisa_saldo,
      },
    });

    let laporanTransaksiArray = [];
    req.body.detail_jurnal.map((i) => {
      laporanTransaksiArray.push({
        akun_id: +i.akun_id,
        kategori_id: +i.kategori_id,
        timestamp: timeOnly,
        date: dateOnly,
        hari: +day,
        bulan: +month,
        tahun: +year,
        debit: +i.debit,
        kredit: +i.kredit,
        sumber_transaksi: "Journal Entry",
        no_ref: findLatest.id,
        delete_ref_no: findLatest.id,
        delete_ref_name: "Journal Entry",
      });
    });

    const createLaporanTransaksi = await prisma.laporanTransaksi.createMany({
      data: laporanTransaksiArray,
    });

    const currentDatetime = moment().toISOString().substring(0, 10) + " " + moment().format("HH:mm");
    const { cookies } = req;
    const accessToken = cookies.token;
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
        page: "/jurnal/add-jurnal",
        time: currentDatetime,
        action: "CREATE",
        description: `${currentDatetime} | ${
          decodedAccessToken.first_name
        } has created a jurnal on "${dateOnly}" with total transaction of "Rp. ${createHeaderJurnal.total_debit.toLocaleString()}". Laporan transaksi has been created with reference number Journal Entry #${
          findLatest.id
        }.`,
      },
    });

    res.status(201).json({ message: "Create jurnal success", latestHeaderJurnalId });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Create jurnal failed, tanggal transaksi, nama akun, debit and kredit cannot be empty", error });
  }
};
