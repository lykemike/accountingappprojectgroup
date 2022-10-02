import moment from "moment";
import jwtDecode from "jwt-decode";
import prisma from "../../../../libs/prisma";

export default async (req, res) => {
  try {
    const { pengirimanId } = req.query;
    const dateTime = req.body.tgl_transaksi;
    const dateOnly = dateTime.split(" ")[0];
    const timeOnly = dateTime.split(" ")[1];
    const day = dateOnly.split("/")[2];
    const month = dateOnly.split("/")[1];
    const year = dateOnly.split("/")[0];

    await prisma.pengirimanBayaran.update({
      where: {
        id: +req.body.id,
      },
      data: {
        header_pembelian_id: +req.body.header_pembelian_id,
        akun_id: +req.body.akun_id,
        cara_pembayaran_id: +req.body.cara_pembayaran_id,
        tgl_pembayaran: req.body.tgl_transaksi,
        deskripsi: req.body.deskripsi,
        hari: +day,
        bulan: +month,
        tahun: +year,
        jumlah: +req.body.jumlah,
      },
    });

    const findSaldoAwal = await prisma.detailSaldoAwal.findFirst({
      where: {
        akun_id: +req.body.old_akun_id,
      },
    });

    await prisma.detailSaldoAwal.update({
      where: {
        akun_id: +req.body.old_akun_id,
      },
      data: {
        sisa_saldo: findSaldoAwal.sisa_saldo + req.body.old_jumlah,
      },
    });

    const findNewSaldoAwal = await prisma.detailSaldoAwal.findFirst({
      where: {
        akun_id: +req.body.akun_id,
      },
    });

    await prisma.detailSaldoAwal.update({
      where: {
        akun_id: +req.body.akun_id,
      },
      data: {
        sisa_saldo: findNewSaldoAwal.sisa_saldo - req.body.jumlah,
      },
    });

    const findHeaderPembelian = await prisma.headerPembelian.findFirst({
      where: {
        id: +req.body.header_pembelian_id,
      },
    });

    await prisma.jurnalPengirimanBayaran.deleteMany({
      where: {
        PengirimanBayaran_id: +pengirimanId,
      },
    });

    await prisma.laporanTransaksi.deleteMany({
      where: {
        delete_ref_no: +pengirimanId,
        delete_ref_name: "Pengiriman Pembayaran",
      },
    });

    await prisma.headerPembelian.update({
      where: {
        id: +req.body.header_pembelian_id,
      },
      data: {
        sisa_tagihan: findHeaderPembelian.sisa_tagihan + req.body.old_jumlah,
      },
    });

    const findHeaderPembelianUpdated = await prisma.headerPembelian.findFirst({
      where: {
        id: +req.body.header_pembelian_id,
      },
    });

    const sisa = +findHeaderPembelianUpdated?.sisa_tagihan - +req.body.jumlah;

    if (sisa == 0) {
      await prisma.headerPembelian.update({
        where: {
          id: +req.body.header_pembelian_id,
        },
        data: {
          sisa_tagihan: +sisa,
          status: "Complete",
        },
      });
    } else {
      await prisma.headerPembelian.update({
        where: {
          id: +req.body.header_pembelian_id,
        },
        data: {
          sisa_tagihan: +sisa,
          status: "Partial",
        },
      });
    }

    const findAkunBayarKontak = await prisma.kontak.findFirst({
      where: {
        id: +req.body.kontak_id,
      },
    });

    await prisma.jurnalPengirimanBayaran.createMany({
      data: [
        {
          header_pembelian_id: +req.body.header_pembelian_id,
          akun_id: findAkunBayarKontak.akun_hutang_id,
          nominal: +req.body.jumlah,
          PengirimanBayaran_id: +pengirimanId,
          tipe_saldo: "Debit",
        },
        {
          header_pembelian_id: +req.body.header_pembelian_id,
          akun_id: +req.body.akun_id,
          nominal: +req.body.jumlah,
          PengirimanBayaran_id: +pengirimanId,
          tipe_saldo: "Kredit",
        },
      ],
    });

    const findJurnalPengirimanBayaran = await prisma.jurnalPengirimanBayaran.findMany({
      where: {
        PengirimanBayaran_id: +pengirimanId,
      },
      include: {
        akun: true,
      },
    });

    let laporanTransaksi = [];
    findJurnalPengirimanBayaran.map((i) => {
      laporanTransaksi.push({
        akun_id: i.akun_id,
        kategori_id: i.akun.kategoriId,
        timestamp: timeOnly,
        date: dateOnly,
        hari: +day,
        bulan: +month,
        tahun: +year,
        debit: i.tipe_saldo == "Debit" ? i.nominal : 0,
        kredit: i.tipe_saldo == "Kredit" ? i.nominal : 0,
        sumber_transaksi: "Purchase Invoice",
        no_ref: +req.body.header_pembelian_id,
        delete_ref_no: i.PengirimanBayaran_id,
        delete_ref_name: "Pengiriman Pembayaran",
      });
    });

    await prisma.laporanTransaksi.createMany({
      data: laporanTransaksi,
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
        description: `${currentDatetime} | ${
          decodedAccessToken.first_name
        } has updated Pengiriman Pembayaran #${pengirimanId} with deductible amount "Rp. ${req.body.jumlah.toLocaleString()}".`,
      },
    });

    res.status(201).json({ message: "Update pengiriman pembayaran success", pengirimanId });
  } catch (error) {
    res.status(400).json({ message: "Update pengiriman pembayaran failed", error });
  }
};
