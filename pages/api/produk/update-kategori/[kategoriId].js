import moment from "moment";
import jwtDecode from "jwt-decode";
import prisma from "../../../../libs/prisma";

export default async (req, res) => {
  try {
    const { kategoriId } = req.query;
    const updateKategori = await prisma.kategoriProduk.update({
      where: {
        id: +kategoriId,
      },
      data: {
        nama: req.body.nama_kategori,
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
        page: "/produk/kategori/",
        time: currentDatetime,
        action: "UPDATE",
        description: `${currentDatetime} | ${decodedAccessToken.first_name} has updated a kategori "${updateKategori.nama}".`,
      },
    });

    res.status(201).json({
      message: "Update kategori success",
    });
  } catch (error) {
    res.status(400).json({ message: "Update kategori failed", error });
  }
};
