import multer from "multer";
import { extname } from "path";
import moment from "moment";
import jwtDecode from "jwt-decode";
import prisma from "../../../libs/prisma";

export const config = {
  api: {
    bodyParser: false,
  },
};

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split(".")[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.random().toString(36).substring(2, 10))
    .join("");
  callback(null, `${name}-${randomName}${fileExtName}`);
};

// Returns a Multer instance that provides several methods for generating
// middleware that process files uploaded in multipart/form-data format.
const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads",
    filename: editFileName,
  }),
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async (req, res) => {
  await runMiddleware(req, res, upload.single("file"));

  try {
    const dateTime = req.body.tgl_transaksi;
    const dateOnly = dateTime.split(" ")[0];
    const timeOnly = dateTime.split(" ")[1];
    const day = dateOnly.split("/")[2];
    const month = dateOnly.split("/")[1];
    const year = dateOnly.split("/")[0];

    await prisma.headerPembelian.create({
      data: {
        kontak_id: +req.body.kontak_id,
        email: req.body.email,
        alamat_perusahaan: req.body.alamat_perusahaan,
        akun_hutang_supplier_id: +req.body.akun_hutang_id,
        tgl_transaksi: dateOnly,
        hari: +day,
        bulan: +month,
        tahun: +year,
        tgl_jatuh_tempo: req.body.tgl_jatuh_tempo,
        syarat_pembayaran_id: +req.body.syarat_pembayaran_id,
        no_ref_penagihan: req.body.no_ref_penagihan,
        memo: req.body.pesan,
        file_attachment: req.file == undefined ? null : req.file.filename,
        subtotal: +req.body.subtotal,
        akun_diskon_pembelian_id: +req.body.akun_diskon_id ? +req.body.akun_diskon_id : null,
        total_diskon: +req.body.total_diskon,
        pajak_id: +req.body.pajak_id ? +req.body.pajak_id : null,
        total_pajak: +req.body.total_pajak,
        pajak_persen: +req.body.pajak_persen,
        status: "Active",
        sisa_tagihan: +req.body.sisa_tagihan,
      },
    });

    const findLastHeader = await prisma.headerPembelian.findFirst({
      orderBy: {
        id: "desc",
      },
    });

    let detail = [];
    JSON.parse(req.body.detail).map((i) => {
      detail.push({
        header_pembelian_id: findLastHeader.id,
        akun_pembelian_id: +i.akun_pembelian_id,
        deskripsi: i.deskripsi,
        kuantitas: +i.kuantitas,
        harga_satuan: +i.harga_satuan,
        diskon: +i.diskon,
        diskon_per_baris: +i.diskon_per_baris,
        jumlah: +i.jumlah,
      });
    });

    await prisma.detailPembelian.createMany({
      data: detail,
    });

    let jurnalDebit = [];
    detail.map((i) => {
      jurnalDebit.push({
        header_pembelian_id: findLastHeader.id,
        akun_id: i.akun_pembelian_id,
        nominal: i.jumlah,
        tipe_saldo: "Debit",
      });
    });

    await prisma.jurnalPembelian.createMany({
      data: jurnalDebit,
    });

    await prisma.jurnalPembelian.createMany({
      data: [
        {
          header_pembelian_id: findLastHeader.id,
          akun_id: +req.body.pajak_masukan_id,
          nominal: +req.body.total_pajak,
          tipe_saldo: "Debit",
        },
        {
          header_pembelian_id: findLastHeader.id,
          akun_id: +req.body.akun_diskon_id,
          nominal: +req.body.total_diskon,
          tipe_saldo: "Kredit",
        },
        {
          header_pembelian_id: findLastHeader.id,
          akun_id: +req.body.akun_hutang_id,
          nominal: +req.body.sisa_tagihan,
          tipe_saldo: "Kredit",
        },
      ],
    });

    const findJurnalPembelian = await prisma.jurnalPembelian.findMany({
      where: {
        header_pembelian_id: +findLastHeader.id,
      },
      include: {
        akun: true,
      },
    });

    let laporanTransaksiArray = [];
    findJurnalPembelian.map((i) => {
      if (i.akun_id == +req.body.pajak_id) {
        laporanTransaksiArray.push({
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
          nominal_pajak: i.nominal,
          no_ref: +findLastHeader.id,
          delete_ref_no: +findLastHeader.id,
          delete_ref_name: "Purchase Invoice",
        });
      } else {
        laporanTransaksiArray.push({
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
          no_ref: +findLastHeader.id,
          delete_ref_no: +findLastHeader.id,
          delete_ref_name: "Purchase Invoice",
        });
      }
    });

    await prisma.laporanTransaksi.createMany({
      data: laporanTransaksiArray,
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
        page: "/pembelian/add-pembelian",
        time: currentDatetime,
        action: "CREATE",
        description: `${currentDatetime} | ${decodedAccessToken.first_name} has created a new Purchase Invoice #${
          findLastHeader.id
        } with a total amount of Rp. ${req.body.sisa_tagihan.toLocaleString()}.`,
      },
    });

    res.status(201).json({ message: "Create pembelian success", pembelianId: findLastHeader.id });
  } catch (error) {
    res.status(400).json({ message: "Create pembelian failed, please check all fields", error });
  }
};
