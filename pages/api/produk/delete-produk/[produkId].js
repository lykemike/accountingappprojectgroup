import prisma from "../../../../libs/prisma";
import jwtDecode from "jwt-decode";
import moment from "moment";

export default async (req, res) => {
  try {
    const { produkId } = req.query;

    const findProduk = await prisma.produk.findFirst({
      where: {
        id: +produkId,
      },
      include: {
        DetailPenjualan: true,
      },
    });

    if (findProduk.DetailPenjualan.length > 0) {
      return res.status(400).json({ message: `${findProduk.nama} still has ongoing transactions` });
    } else {
      await prisma.kategoriProduk.update({
        where: {
          id: findProduk.kategori_id,
        },
        data: {
          jumlah: {
            decrement: 1,
          },
        },
      });

      await prisma.produk.delete({
        where: {
          id: +produkId,
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
          page: "/produk",
          time: currentDatetime,
          action: "DELETE",
          description: `${currentDatetime} | ${decodedAccessToken.first_name} has deleted produk "${findProduk.nama}".`,
        },
      });
      return res.status(201).json({ message: `Delete ${findProduk.nama} produk success` });
    }

    res.status(201).json({ message: "Delete produk success" });
  } catch (error) {
    res.status(400).json({ message: "Delete produk failed", error });
    console.log(error);
  }
};
