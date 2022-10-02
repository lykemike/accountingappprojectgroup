import moment from "moment";
import jwtDecode from "jwt-decode";
import prisma from "../../../../libs/prisma";

export default async (req, res) => {
  try {
    const { penerimaanId } = req.query;

    const dateTime = req.body.date;
    const dateOnly = dateTime.split(" ")[0];
    const timeOnly = dateTime.split(" ")[1];
    const day = dateOnly.split("/")[2];
    const month = dateOnly.split("/")[1];
    const year = dateOnly.split("/")[0];

    const frontend_data = {
      header_penjualan_id: +req.body.header_penjualan_id,
      akun_id: +req.body.setor_ke_id,
      date: dateOnly,
      timestamp: req.body.timestamp,
      hari: +day,
      bulan: +month,
      tahun: +year,
      deskripsi: req.body.deskripsi,
      pajak_id: +req.body.pajak_id,
      pajak_nama: req.body.pajak_nama,
      pajak_persen: +req.body.pajak_persen,
      presentase_penagihan: +req.body.presentase_penagihan,
      tagihan_sebelum_pajak: +req.body.tagihan_sebelum_pajak,
      pajak_total: +req.body.pajak_total,
      pajak_keluaran_total: +req.body.pajak_keluaran_total,
      tagihan_setelah_pajak: +req.body.tagihan_setelah_pajak,
      say: req.body.say,
    };

    const getHeaderPenjualan = await prisma.headerPenjualan.findFirst({
      where: {
        id: +req.body.header_penjualan_id,
      },
      include: {
        kontak: true,
        DetailPenjualan: {
          include: {
            produk: true,
          },
        },
        pajak: {
          include: {
            pajak_keluaran: true,
          },
        },
      },
    });

    const pajakKeluaranPersen = getHeaderPenjualan.pajak_persen;
    const tipe_perusahaan = getHeaderPenjualan.tipe_perusahaan;

    const getCurrentPenerimaanPembayaran = await prisma.penerimaanPembayaran.findFirst({
      where: {
        id: +req.body.id,
      },
      include: {
        header_penjualan: true,
      },
    });

    const getPajak = await prisma.pajak.findFirst({
      where: {
        id: +req.body.pajak_id,
      },
      include: {
        pajak_masukan: true,
      },
    });

    let currentSisaTagihan = +getCurrentPenerimaanPembayaran.header_penjualan.sisa_tagihan;
    let currentTagihanSebelumPajak = +getCurrentPenerimaanPembayaran.tagihan_sebelum_pajak;
    let currentTagihanSetelahPajak = +getCurrentPenerimaanPembayaran.tagihan_setelah_pajak;

    if (tipe_perusahaan == "false") {
      let lastSisaTagihan = currentSisaTagihan + currentTagihanSebelumPajak;

      await prisma.headerPenjualan.update({
        where: {
          id: +getHeaderPenjualan.id,
        },
        data: {
          sisa_tagihan: +lastSisaTagihan,
        },
      });

      await prisma.penerimaanPembayaran.update({
        where: {
          id: +getCurrentPenerimaanPembayaran.id,
        },
        data: frontend_data,
      });

      await prisma.jurnalPenerimaanPembayaran.deleteMany({
        where: {
          penerimaan_pembayaran_id: getCurrentPenerimaanPembayaran.id,
        },
      });

      const getUpdatedHeaderPenjualan = await prisma.headerPenjualan.findFirst({
        where: {
          id: getHeaderPenjualan.id,
        },
      });

      const getUpdatedPenerimaanPembayaran = await prisma.penerimaanPembayaran.findFirst({
        where: {
          id: getCurrentPenerimaanPembayaran.id,
        },
      });

      let updatedSisaTagihan = +getUpdatedHeaderPenjualan.sisa_tagihan;
      let newSisaTagihanSebelumPajak = +getUpdatedPenerimaanPembayaran.tagihan_sebelum_pajak;
      let newSisaTagihan = updatedSisaTagihan - newSisaTagihanSebelumPajak;

      await prisma.headerPenjualan.update({
        where: {
          id: +getHeaderPenjualan.id,
        },
        data: {
          sisa_tagihan: +newSisaTagihan,
        },
      });

      let akunPiutang = getHeaderPenjualan.kontak.akun_piutang_id;
      let akunPajakMasukan = getPajak.pajak_masukan_id;
      let akunPendapatanBersih = getHeaderPenjualan.DetailPenjualan[0].produk.akun_id;
      let nominalAkunPiutang = +req.body.tagihan_sebelum_pajak - +req.body.pajak_total;
      let nominalAkunPajakMasukan = +req.body.pajak_total;
      let nominalAkunPendapatanBersih = +req.body.tagihan_sebelum_pajak;

      await prisma.jurnalPenerimaanPembayaran.createMany({
        data: [
          {
            header_penjualan_id: +getHeaderPenjualan.id,
            penerimaan_pembayaran_id: +getCurrentPenerimaanPembayaran.id,
            akun_id: +akunPiutang,
            nominal: +nominalAkunPiutang,
            tipe_saldo: "Debit",
          },
          {
            header_penjualan_id: +getHeaderPenjualan.id,
            penerimaan_pembayaran_id: +getCurrentPenerimaanPembayaran.id,
            akun_id: +akunPajakMasukan,
            nominal: +nominalAkunPajakMasukan,
            tipe_saldo: "Debit",
          },
          {
            header_penjualan_id: +getHeaderPenjualan.id,
            penerimaan_pembayaran_id: +getCurrentPenerimaanPembayaran.id,
            akun_id: +akunPendapatanBersih,
            nominal: +nominalAkunPendapatanBersih,
            tipe_saldo: "Kredit",
          },
        ],
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
          page: "/penjualan/update-penerimaan-pembayaran",
          time: currentDatetime,
          action: "UPDATE",
          description: `${currentDatetime} | ${decodedAccessToken.first_name} has updated Penerimaan Pembayaran #${
            getCurrentPenerimaanPembayaran.id
          } with a receiveable total amount of Rp. ${req.body.tagihan_sebelum_pajak.toLocaleString()}.`,
        },
      });
    } else {
      let lastSisaTagihan = currentSisaTagihan + currentTagihanSetelahPajak;

      await prisma.headerPenjualan.update({
        where: {
          id: +getHeaderPenjualan.id,
        },
        data: {
          sisa_tagihan: +lastSisaTagihan,
        },
      });

      await prisma.penerimaanPembayaran.update({
        where: {
          id: +getCurrentPenerimaanPembayaran.id,
        },
        data: frontend_data,
      });

      await prisma.jurnalPenerimaanPembayaran.deleteMany({
        where: {
          penerimaan_pembayaran_id: +getCurrentPenerimaanPembayaran.id,
        },
      });

      const getUpdatedHeaderPenjualan = await prisma.headerPenjualan.findFirst({
        where: {
          id: +getHeaderPenjualan.id,
        },
      });

      const getUpdatedPenerimaanPembayaran = await prisma.penerimaanPembayaran.findFirst({
        where: {
          id: +getCurrentPenerimaanPembayaran.id,
        },
      });

      let updatedSisaTagihan = +getUpdatedHeaderPenjualan.sisa_tagihan;
      let newSisaTagihanSetelahPajak = +getUpdatedPenerimaanPembayaran.tagihan_setelah_pajak;
      let newSisaTagihan = updatedSisaTagihan - newSisaTagihanSetelahPajak;

      await prisma.headerPenjualan.update({
        where: {
          id: +getHeaderPenjualan.id,
        },
        data: {
          sisa_tagihan: +newSisaTagihan,
        },
      });

      let akunPiutang = getHeaderPenjualan.kontak.akun_piutang_id;
      let akunPajakMasukan = getPajak.pajak_masukan_id;
      let akunPajakKeluaran = getHeaderPenjualan.pajak.pajak_keluaran_id;
      let akunPendapatanBersih = getHeaderPenjualan.DetailPenjualan[0].produk.akun_id;

      let nominalAkunPiutang =
        (pajakKeluaranPersen / 100) * +req.body.tagihan_sebelum_pajak +
        +req.body.tagihan_sebelum_pajak -
        +req.body.pajak_total;
      let nominalAkunPajakMasukan = req.body.pajak_total;
      let nominalAkunPajakKeluaran = req.body.tagihan_sebelum_pajak * (pajakKeluaranPersen / 100);
      let nominalAkunPendapatanBersih = req.body.tagihan_sebelum_pajak;

      await prisma.jurnalPenerimaanPembayaran.createMany({
        data: [
          {
            header_penjualan_id: getHeaderPenjualan.id,
            penerimaan_pembayaran_id: getCurrentPenerimaanPembayaran.id,
            akun_id: +akunPiutang,
            nominal: +nominalAkunPiutang,
            tipe_saldo: "Debit",
          },
          {
            header_penjualan_id: getHeaderPenjualan.id,
            penerimaan_pembayaran_id: getCurrentPenerimaanPembayaran.id,
            akun_id: +akunPajakMasukan,
            nominal: +nominalAkunPajakMasukan,
            tipe_saldo: "Debit",
          },
          {
            header_penjualan_id: getHeaderPenjualan.id,
            penerimaan_pembayaran_id: getCurrentPenerimaanPembayaran.id,
            akun_id: +akunPajakKeluaran,
            nominal: +nominalAkunPajakKeluaran,
            tipe_saldo: "Kredit",
          },
          {
            header_penjualan_id: getHeaderPenjualan.id,
            penerimaan_pembayaran_id: getCurrentPenerimaanPembayaran.id,
            akun_id: +akunPendapatanBersih,
            nominal: +nominalAkunPendapatanBersih,
            tipe_saldo: "Kredit",
          },
        ],
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
          page: "/penjualan/update-penerimaan-pembayaran",
          time: currentDatetime,
          action: "UPDATE",
          description: `${currentDatetime} | ${decodedAccessToken.first_name} has updated Penerimaan Pembayaran #${
            getCurrentPenerimaanPembayaran.id
          } with receiveable amount "Rp. ${req.body.tagihan_setelah_pajak.toLocaleString()}".`,
        },
      });
    }

    res.status(201).json({ message: "Update penerimaan pembayaran success", penerimaanId });
  } catch (error) {
    res.status(400).json({ message: "Update penerimaan pembayaran failed", error });
  }
};
