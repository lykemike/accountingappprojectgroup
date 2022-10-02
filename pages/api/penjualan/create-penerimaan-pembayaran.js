import moment from "moment";
import jwtDecode from "jwt-decode";
import prisma from "../../../libs/prisma";

export default async (req, res) => {
  try {
    const dateTime = req.body.date;
    const dateOnly = dateTime.split(" ")[0];
    const timeOnly = dateTime.split(" ")[1];
    const day = dateOnly.split("/")[2];
    const month = dateOnly.split("/")[1];
    const year = dateOnly.split("/")[0];

    const createPenerimaanPembayaran = await prisma.penerimaanPembayaran.create({
      data: {
        header_penjualan_id: +req.body.id,
        akun_id: +req.body.setor_ke_id,
        date: dateOnly,
        timestamp: timeOnly,
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
      },
    });

    const findLastData = await prisma.penerimaanPembayaran.findFirst({
      orderBy: {
        id: "desc",
      },
    });

    const getHeaderPenjualan = await prisma.headerPenjualan.findFirst({
      where: {
        id: +req.body.id,
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
    const tipePerusahaan = getHeaderPenjualan.tipe_perusahaan;

    const get_pajak = await prisma.pajak.findFirst({
      where: {
        id: +req.body.pajak_id,
      },
      include: {
        pajak_masukan: true,
      },
    });

    if (tipePerusahaan == "false") {
      let nominalSebelumPajak = req.body.tagihan_sebelum_pajak;
      let sisaTagihanBaru = getHeaderPenjualan.sisa_tagihan - nominalSebelumPajak;

      /*
       * update "sisa tagihan" header penjualan
       */
      await prisma.headerPenjualan.update({
        where: {
          id: +req.body.id,
        },
        data: {
          sisa_tagihan: +sisaTagihanBaru,
          status: "Partial",
        },
      });

      /*
       * update "status" penerimaan pembayaran
       */
      await prisma.penerimaanPembayaran.updateMany({
        where: {
          id: findLastData.id,
        },
        data: {
          status: "Process",
        },
      });

      /*
       * akun id
       * nominal berdasarkan akun
       */
      let akunPiutang = getHeaderPenjualan.kontak.akun_piutang_id;
      let akunPajakMasukan = get_pajak.pajak_masukan_id;
      let akunPendapatanBersih = getHeaderPenjualan.DetailPenjualan[0].produk.akun_id;
      let nominalAkunPiutang = +req.body.tagihan_sebelum_pajak - +req.body.pajak_total;
      let nominalAkunPajakMasukan = +req.body.pajak_total;
      let nominalAkunPendapatanBersih = +req.body.tagihan_sebelum_pajak;

      await prisma.jurnalPenerimaanPembayaran.createMany({
        data: [
          {
            header_penjualan_id: +req.body.id,
            penerimaan_pembayaran_id: findLastData.id,
            akun_id: +akunPiutang,
            nominal: +nominalAkunPiutang,
            tipe_saldo: "Debit",
          },
          {
            header_penjualan_id: +req.body.id,
            penerimaan_pembayaran_id: findLastData.id,
            akun_id: +akunPajakMasukan,
            nominal: +nominalAkunPajakMasukan,
            tipe_saldo: "Debit",
          },
          {
            header_penjualan_id: +req.body.id,
            penerimaan_pembayaran_id: findLastData.id,
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
          page: "/penjualan/add-penerimaan-pembayaran",
          time: currentDatetime,
          action: "CREATE",
          description: `${currentDatetime} | ${
            decodedAccessToken.first_name
          } has created a new Penerimaan Pembayaran #${
            findLastData.id
          } with a receiveable total amount of Rp. ${req.body.tagihan_sebelum_pajak.toLocaleString()}.`,
        },
      });
    } else {
      let nominalSebelumPajak =
        +req.body.tagihan_sebelum_pajak + +req.body.tagihan_sebelum_pajak * (pajakKeluaranPersen / 100);
      let sisaTagihanBaru = getHeaderPenjualan.sisa_tagihan - +nominalSebelumPajak;

      /*
       * update "sisa tagihan" header penjualan
       */
      await prisma.headerPenjualan.update({
        where: {
          id: +req.body.id,
        },
        data: {
          sisa_tagihan: +sisaTagihanBaru,
          status: "Partial",
        },
      });

      await prisma.penerimaanPembayaran.update({
        where: {
          id: findLastData.id,
        },
        data: {
          tagihan_setelah_pajak: +nominalSebelumPajak,
          status: "Process",
        },
      });

      let akunPiutang = getHeaderPenjualan.kontak.akun_piutang_id;
      let akunPajakMasukan = get_pajak.pajak_masukan_id;
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
            header_penjualan_id: +req.body.id,
            penerimaan_pembayaran_id: findLastData.id,
            akun_id: +akunPiutang,
            nominal: +nominalAkunPiutang,
            tipe_saldo: "Debit",
          },
          {
            header_penjualan_id: +req.body.id,
            penerimaan_pembayaran_id: findLastData.id,
            akun_id: +akunPajakMasukan,
            nominal: +nominalAkunPajakMasukan,
            tipe_saldo: "Debit",
          },
          {
            header_penjualan_id: +req.body.id,
            penerimaan_pembayaran_id: findLastData.id,
            akun_id: +akunPajakKeluaran,
            nominal: +nominalAkunPajakKeluaran,
            tipe_saldo: "Kredit",
          },
          {
            header_penjualan_id: +req.body.id,
            penerimaan_pembayaran_id: findLastData.id,
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
          page: "/penjualan/add-penerimaan-pembayaran",
          time: currentDatetime,
          action: "CREATE",
          description: `${currentDatetime} | ${
            decodedAccessToken.first_name
          } has created a new Penerimaan Pembayaran #${
            findLastData.id
          } with a receiveable total amount of Rp. ${req.body.tagihan_setelah_pajak.toLocaleString()}.`,
        },
      });
    }

    res.status(201).json({ message: "Create penerimaan pembayaran success", penerimaanId: findLastData.id });
  } catch (error) {
    res.status(400).json({ message: "Create penerimaan pembayaran failed", error });
  }
};
