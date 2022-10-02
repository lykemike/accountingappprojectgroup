import moment from "moment";
import jwtDecode from "jwt-decode";
import prisma from "../../../libs/prisma";

export default async (req, res) => {
  try {
    const { values, penerimaanId } = req.body;
    const dateTime = moment(values.confirmation_date).format("YYYY/MM/DD HH:mm");
    const dateOnly = dateTime.split(" ")[0];
    const timeOnly = dateTime.split(" ")[1];
    const day = dateOnly.split("/")[2];
    const month = dateOnly.split("/")[1];
    const year = dateOnly.split("/")[0];

    const getPenerimaanPembayaran = await prisma.penerimaanPembayaran.findFirst({
      where: {
        id: +penerimaanId,
      },
      include: {
        header_penjualan: {
          include: {
            kontak: {
              include: {
                piutang: true,
              },
            },
          },
        },
        akun: true,
        JurnalPenerimaanPembayaran: {
          include: {
            akun: true,
          },
        },
      },
    });

    await prisma.penerimaanPembayaran.update({
      where: {
        id: +penerimaanId,
      },
      data: {
        date_confirmation: dateOnly,
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

    let jurnal = [];
    getPenerimaanPembayaran.JurnalPenerimaanPembayaran.map((i, index) => {
      if (index == 1) {
        jurnal.push({
          akun_id: i.akun_id,
          kategori_id: i.akun.kategoriId,
          timestamp: timeOnly,
          date: dateOnly,
          hari: +day,
          bulan: +month,
          tahun: +year,
          debit: i.tipe_saldo == "Debit" ? i.nominal : 0,
          kredit: i.tipe_saldo == "Kredit" ? i.nominal : 0,
          nominal_pajak: i.nominal,
          sumber_transaksi: "Penjualan",
          no_ref: i.header_penjualan_id,
          delete_ref_no: i.penerimaan_pembayaran_id,
          delete_ref_name: "Penerimaan Pembayaran",
        });
      } else {
        jurnal.push({
          akun_id: i.akun_id,
          kategori_id: i.akun.kategoriId,
          timestamp: timeOnly,
          date: dateOnly,
          hari: +day,
          bulan: +month,
          tahun: +year,
          debit: i.tipe_saldo == "Debit" ? i.nominal : 0,
          kredit: i.tipe_saldo == "Kredit" ? i.nominal : 0,
          sumber_transaksi: "Penjualan",
          no_ref: i.header_penjualan_id,
          delete_ref_no: i.penerimaan_pembayaran_id,
          delete_ref_name: "Penerimaan Pembayaran",
        });
      }
    });

    await prisma.laporanTransaksi.createMany({
      data: jurnal,
    });

    const tipe_perusahaan = getPenerimaanPembayaran.header_penjualan.tipe_perusahaan;
    const akunKasId = getPenerimaanPembayaran.akun_id;
    const akunPiutangId = getPenerimaanPembayaran.header_penjualan.kontak.piutang.id;
    const nominalNegeri = getPenerimaanPembayaran.tagihan_sebelum_pajak - getPenerimaanPembayaran.pajak_total;
    const nominalSwasta = getPenerimaanPembayaran.tagihan_setelah_pajak - getPenerimaanPembayaran.pajak_total;

    if (tipe_perusahaan == "false") {
      await prisma.penerimaanPembayaran.update({
        where: {
          id: +penerimaanId,
        },
        data: {
          status: "Done",
        },
      });

      await prisma.jurnalPenerimaanPembayaran.createMany({
        data: [
          {
            header_penjualan_id: getPenerimaanPembayaran.header_penjualan.id,
            penerimaan_pembayaran_id: +penerimaanId,
            akun_id: akunKasId,
            nominal: nominalNegeri,
            tipe_saldo: "Debit",
          },
          {
            header_penjualan_id: getPenerimaanPembayaran.header_penjualan.id,
            penerimaan_pembayaran_id: +penerimaanId,
            akun_id: akunPiutangId,
            nominal: nominalNegeri,
            tipe_saldo: "Kredit",
          },
        ],
      });

      await prisma.laporanTransaksi.createMany({
        data: [
          {
            akun_id: akunKasId,
            kategori_id: getPenerimaanPembayaran.akun.kategoriId,
            timestamp: timeOnly,
            date: dateOnly,
            hari: +day,
            bulan: +month,
            tahun: +year,
            debit: nominalNegeri,
            kredit: 0,
            sumber_transaksi: "Penjualan",
            no_ref: getPenerimaanPembayaran.header_penjualan.id,
            delete_ref_no: +penerimaanId,
            delete_ref_name: "Penerimaan Pembayaran",
          },
          {
            akun_id: akunPiutangId,
            kategori_id: getPenerimaanPembayaran.header_penjualan.kontak.piutang.kategoriId,
            timestamp: timeOnly,
            date: dateOnly,
            hari: +day,
            bulan: +month,
            tahun: +year,
            debit: 0,
            kredit: nominalNegeri,
            sumber_transaksi: "Penjualan",
            no_ref: getPenerimaanPembayaran.header_penjualan.id,
            delete_ref_no: +penerimaanId,
            delete_ref_name: "Penerimaan Pembayaran",
          },
        ],
      });

      const getUpdatedSaldo = await prisma.detailSaldoAwal.findFirst({
        where: {
          akun_id: getPenerimaanPembayaran.akun_id,
        },
      });

      await prisma.detailSaldoAwal.update({
        where: {
          akun_id: getPenerimaanPembayaran.akun_id,
        },
        data: {
          sisa_saldo: getUpdatedSaldo.sisa_saldo + nominalNegeri,
        },
      });

      await prisma.auditLog.create({
        data: {
          user: decodedAccessToken.first_name,
          role: findRole.role_name,
          page: "/penjualan/confirm-penerimaan-pembayaran",
          time: currentDatetime,
          action: "CREATE",
          description: `${currentDatetime} | ${
            decodedAccessToken.first_name
          } has confirmed Invoice Penerimaan #${penerimaanId} with receiveable amount "Rp. ${nominalNegeri.toLocaleString()}".`,
        },
      });
    } else {
      await prisma.penerimaanPembayaran.update({
        where: {
          id: +penerimaanId,
        },
        data: {
          status: "Done",
        },
      });

      await prisma.jurnalPenerimaanPembayaran.createMany({
        data: [
          {
            header_penjualan_id: getPenerimaanPembayaran.header_penjualan.id,
            penerimaan_pembayaran_id: +penerimaanId,
            akun_id: akunKasId,
            nominal: nominalSwasta,
            tipe_saldo: "Debit",
          },
          {
            header_penjualan_id: getPenerimaanPembayaran.header_penjualan.id,
            penerimaan_pembayaran_id: +penerimaanId,
            akun_id: akunPiutangId,
            nominal: nominalSwasta,
            tipe_saldo: "Kredit",
          },
        ],
      });

      await prisma.laporanTransaksi.createMany({
        data: [
          {
            akun_id: akunKasId,
            kategori_id: getPenerimaanPembayaran.akun.kategoriId,
            timestamp: timeOnly,
            date: dateOnly,
            hari: +day,
            bulan: +month,
            tahun: +year,
            debit: nominalSwasta,
            kredit: 0,
            sumber_transaksi: "Penjualan",
            no_ref: getPenerimaanPembayaran.header_penjualan.id,
            delete_ref_no: +penerimaanId,
            delete_ref_name: "Penerimaan Pembayaran",
          },
          {
            akun_id: akunPiutangId,
            kategori_id: getPenerimaanPembayaran.header_penjualan.kontak.piutang.kategoriId,
            timestamp: timeOnly,
            date: dateOnly,
            hari: +day,
            bulan: +month,
            tahun: +year,
            debit: 0,
            kredit: nominalSwasta,
            sumber_transaksi: "Penjualan",
            no_ref: getPenerimaanPembayaran.header_penjualan.id,
            delete_ref_no: +penerimaanId,
            delete_ref_name: "Penerimaan Pembayaran",
          },
        ],
      });

      const getUpdatedSaldo = await prisma.detailSaldoAwal.findFirst({
        where: {
          akun_id: getPenerimaanPembayaran.akun_id,
        },
      });

      await prisma.detailSaldoAwal.update({
        where: {
          akun_id: getPenerimaanPembayaran.akun_id,
        },
        data: {
          sisa_saldo: getUpdatedSaldo.sisa_saldo + nominalSwasta,
        },
      });

      await prisma.auditLog.create({
        data: {
          user: decodedAccessToken.first_name,
          role: findRole.role_name,
          page: "/penjualan/confirm-penerimaan-pembayaran",
          time: currentDatetime,
          action: "CREATE",
          description: `${currentDatetime} | ${
            decodedAccessToken.first_name
          } has confirmed Invoice Penerimaan #${penerimaanId} with a receiveable total amount of Rp. ${nominalSwasta.toLocaleString()}.`,
        },
      });
    }

    const checkSisaTagihan = await prisma.headerPenjualan.findFirst({
      where: {
        id: getPenerimaanPembayaran.header_penjualan.id,
      },
    });

    if (checkSisaTagihan.sisa_tagihan == 0) {
      await prisma.headerPenjualan.update({
        where: {
          id: getPenerimaanPembayaran.header_penjualan.id,
        },
        data: {
          status: "Complete",
        },
      });
    } else {
      await prisma.headerPenjualan.update({
        where: {
          id: getPenerimaanPembayaran.header_penjualan.id,
        },
        data: {
          status: "Partial",
        },
      });
    }

    res.status(201).json({ message: "Confirm penerimaan pembayaran success" });
  } catch (error) {
    res.status(400).json({ message: "Confirm penerimaan pembayaran failed", error });
  }
};
