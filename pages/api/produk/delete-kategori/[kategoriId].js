import prisma from "../../../../libs/prisma";
import jwtDecode from "jwt-decode";
import moment from "moment";

export default async (req, res) => {
  try {
    const { kategoriId } = req.query;

    const findLinkedProduks = await prisma.produk.findMany({
      where: {
        kategori_id: +kategoriId,
      },
    });

    const findCurrentKategori = await prisma.kategoriProduk.findFirst({
      where: {
        id: +kategoriId,
      },
    });

    if (findLinkedProduks.length > 0) {
      return res
        .status(400)
        .json({ message: `${findCurrentKategori.nama} kategori still has ${findCurrentKategori.jumlah} linked produks` });
    } else if (findLinkedProduks.length == 0) {
      await prisma.kategoriProduk.delete({
        where: {
          id: +kategoriId,
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
          page: "/produk/kategori",
          time: currentDatetime,
          action: "DELETE",
          description: `${currentDatetime} | ${decodedAccessToken.first_name} has deleted kategori "${findCurrentKategori.nama}".`,
        },
      });

      return res.status(201).json({ message: `${findCurrentKategori.nama} kategori sucessfully deleted` });
    }

    res.status(201).json({ message: "Delete kategori success" });
  } catch (error) {
    res.status(400).json({ message: "Delete kategori failed", error });
    console.log(error);
  }
};
