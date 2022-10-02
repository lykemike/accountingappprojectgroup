import prisma from "../../libs/prisma";
import bcrypt from "bcrypt";

export default async (req, res) => {
  try {
    await prisma.role.create({
      data: {
        role_name: "Accountant",
        role_desc: "a person responsible for managing finance",
      },
    });

    const salt = bcrypt.genSaltSync(10);
    const password_dummy = "akuntansi123";
    const passwordHash = bcrypt.hashSync(password_dummy, salt);

    await prisma.user.create({
      data: {
        first_name: "Accoutant Michael",
        email: "accountmichael@gmail.com",
        password: passwordHash,
        role_id: 1,
      },
    });

    // await prisma.menu.createMany({
    //   data: [
    //     {
    //       menu_name: "Dashboard",
    //     },
    //     {
    //       menu_name: "Jurnal",
    //     },
    //     {
    //       menu_name: "User",
    //     },
    //     {
    //       menu_name: "Role",
    //     },
    //     {
    //       menu_name: "Daftar Akun",
    //     },
    //     {
    //       menu_name: "Kontak",
    //     },
    //     {
    //       menu_name: "Laporan",
    //     },
    //     {
    //       menu_name: "Pajak",
    //     },
    //     {
    //       menu_name: "Produk",
    //     },
    //     {
    //       menu_name: "Penjualan",
    //     },
    //     {
    //       menu_name: "Pembelian",
    //     },
    //   ],
    // });

    res.status(201).json({ message: "Seed default data success" });
  } catch (error) {
    res.status(400).json({ message: "Seed default data failed", error });
    console.log(error);
  }
};
