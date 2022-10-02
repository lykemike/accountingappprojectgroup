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
    const { produkId } = req.query;
    const findProduct = await prisma.produk.findFirst({
      where: {
        id: +produkId,
      },
    });

    const updateProduk = await prisma.produk.update({
      where: {
        id: +produkId,
      },
      data: {
        file_attachment: req?.file?.filename ? req?.file?.filename : req.body.gambar,
        nama: req.body.nama_produk,
        kategori_id: +req.body.kategori_id,
        deskripsi: req.body.description,
        harga: +req.body.harga,
        akun_id: +req.body.akun_penjualan_id,
      },
    });

    if (findProduct.kategori_id != +req.body.kategori_id) {
      await prisma.kategoriProduk.update({
        where: {
          id: findProduct.kategori_id,
        },
        data: {
          jumlah: {
            decrement: 1,
          },
        },
      });

      await prisma.kategoriProduk.update({
        where: {
          id: +req.body.kategori_id,
        },
        data: {
          jumlah: {
            increment: 1,
          },
        },
      });
    }

    const incrementedKategori = await prisma.kategoriProduk.findFirst({
      where: {
        id: +req.body.kategori_id,
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

    await prisma.auditLog.create({
      data: {
        user: decodedAccessToken.first_name,
        role: findRole.role_name,
        page: "/produk/update-produk",
        time: currentDatetime,
        action: "UPDATE",
        description: `${currentDatetime} | ${decodedAccessToken.first_name} has updated a produk "${updateProduk.nama}". Kategori ${incrementedKategori.nama} now has ${incrementedKategori.jumlah} produks linked.`,
      },
    });

    res.status(201).json({ message: "Update produk success" });
  } catch (error) {
    res.status(400).json({ message: "Update produk failed", error });
  }
};
