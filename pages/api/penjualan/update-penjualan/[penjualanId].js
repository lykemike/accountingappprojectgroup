import multer from "multer";
import { extname } from "path";
import moment from "moment";
import jwtDecode from "jwt-decode";
import prisma from "../../../../libs/prisma";

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
    const { penjualanId } = req.query;
    const dateTime = req.body.tgl_kontrak_mulai;
    const dateOnly = dateTime.split(" ")[0];
    const timeOnly = dateTime.split(" ")[1];
    const day = dateOnly.split("/")[2];
    const month = dateOnly.split("/")[1];
    const year = dateOnly.split("/")[0];

    await prisma.headerPenjualan.update({
      where: {
        id: +penjualanId,
      },
      data: {
        kontak_id: +req.body.kontak_id,
        nama_perusahaan: req.body.nama_perusahaan,
        email: req.body.email,
        alamat_penagihan: req.body.alamat_penagihan,
        syarat_pembayaran_id: +req.body.syarat_pembayaran_id,
        nomor_npwp: req.body.nomor_npwp,
        nomor_kontrak: req.body.nomor_kontrak,
        tgl_kontrak_mulai: dateOnly,
        hari: +day,
        bulan: +month,
        tahun: +year,
        tgl_kontrak_expired: req.body.tgl_kontrak_expired,
        custom_invoice: req.body.custom_invoice,
        tipe_perusahaan: req.body.tipe_perusahaan,
        file_attachment: req.file == undefined ? null : req.file.filename,
        subtotal: +req.body.subtotal,
        pajak_id: +req.body.pajak_id,
        pajak_nama: req.body.pajak_nama,
        pajak_persen: +req.body.pajak_persen,
        pajak_hasil: +req.body.pajak_hasil,
        total: +req.body.total,
        sisa_tagihan: +req.body.sisa_tagihan,
      },
    });

    await prisma.detailPenjualan.deleteMany({
      where: {
        header_penjualan_id: +penjualanId,
      },
    });

    let detail = [];
    JSON.parse(req.body.detail).map((i) => {
      detail.push({
        header_penjualan_id: +penjualanId,
        produk_id: +i.produk_id,
        produk_name: i.produk_name,
        produk_deskripsi: i.produk_deskripsi,
        produk_harga: +i.produk_harga,
      });
    });

    await prisma.detailPenjualan.createMany({
      data: detail,
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
        page: "/penjualan/update-penjualan",
        time: currentDatetime,
        action: "UPDATE",
        description: `${currentDatetime} | ${
          decodedAccessToken.first_name
        } has updated Sales Invoice #${penjualanId} with a total amount of Rp. ${req.body.sisa_tagihan.toLocaleString()}.`,
      },
    });

    res.status(201).json({ message: "Update penjualan success", penjualanId: penjualanId });
  } catch (error) {
    res.status(400).json({ message: "Update penjualan failed", error });
  }
};
