import prisma from "../../../../libs/prisma";
import jwtDecode from "jwt-decode";
import moment from "moment";

export default async (req, res) => {
  try {
    const { jurnalId } = req.query;
    const dateTime = moment().format("YYYY/MM/DD") + " " + moment().format("HH:mm");
    const dateOnly = dateTime.split(" ")[0];
    const timeOnly = dateTime.split(" ")[1];
    const day = dateOnly.split("/")[2];
    const month = dateOnly.split("/")[1];
    const year = dateOnly.split("/")[0];

    const updateHeaderJurnal = await prisma.headerJurnal.update({
      where: {
        id: +jurnalId,
      },
      data: {
        akun_id: +req.body.akun_kasbank,
        total_debit: +req.body.total_debit,
        total_kredit: +req.body.total_kredit,
      },
    });

    const find_headerjurnal = await prisma.headerJurnal.findFirst({
      where: {
        id: +jurnalId,
      },
    });

    const find_detailjurnal = await prisma.detailJurnal.findFirst({
      where: {
        header_jurnal_id: +jurnalId,
        akun_id: +find_headerjurnal.akun_id,
      },
    });

    const detailsaldoawal = await prisma.detailSaldoAwal.findFirst({
      where: {
        akun_id: find_headerjurnal.akun_id,
      },
    });

    if (find_detailjurnal.tipe_saldo == "Debit") {
      await prisma.detailSaldoAwal.update({
        where: {
          akun_id: find_headerjurnal.akun_id,
        },
        data: {
          sisa_saldo: +detailsaldoawal.sisa_saldo - +find_detailjurnal.debit,
        },
      });
    } else {
      await prisma.detailSaldoAwal.update({
        where: {
          akun_id: find_headerjurnal.akun_id,
        },
        data: {
          sisa_saldo: +detailsaldoawal.sisa_saldo + +find_detailjurnal.debit,
        },
      });
    }

    await prisma.detailJurnal.deleteMany({
      where: {
        header_jurnal_id: +jurnalId,
      },
    });

    let detailJurnalArray = [];
    req.body.detail_jurnal.map((i) => {
      detailJurnalArray.push({
        header_jurnal_id: +jurnalId,
        akun_id: +i.akun_id,
        kategori_id: +i.kategori_id,
        deskripsi: i.deskripsi,
        debit: +i.debit,
        kredit: +i.kredit,
        nominal: +i.nominal,
        tipe_saldo: i.tipe_saldo,
        debit_disable: i.debit_disable,
        kredit_disable: i.kredit_disable,
      });
    });

    await prisma.laporanTransaksi.deleteMany({
      where: {
        no_ref: +jurnalId,
        sumber_transaksi: "Journal Entry",
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
        no_ref: +jurnalId,
        delete_ref_no: +jurnalId,
        delete_ref_name: "Journal Entry",
      });
    });

    const createLaporanTransaksi = await prisma.laporanTransaksi.createMany({
      data: laporanTransaksiArray,
    });

    await prisma.detailJurnal.createMany({
      data: detailJurnalArray,
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
        page: "/jurnal/update-jurnal",
        time: currentDatetime,
        action: "UPDATE",
        description: `${currentDatetime} | ${
          decodedAccessToken.first_name
        } has updated a jurnal on "${dateOnly}" with total transaction of "Rp. ${updateHeaderJurnal.total_debit.toLocaleString()}". Laporan transaksi has also been updated with reference number Journal Entry #${jurnalId}.`,
      },
    });

    res.status(201).json({ message: "Update jurnal success", jurnalId });
  } catch (error) {
    res.status(400).json({ message: "Update jurnal failed", error });
    console.log(error);
  }
};
