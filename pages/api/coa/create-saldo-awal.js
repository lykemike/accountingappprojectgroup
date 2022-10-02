import prisma from "../../../libs/prisma";
import jwtDecode from "jwt-decode";
import moment from "moment";

export default async (req, res) => {
  try {
    const { values, importedDataNewArray } = req.body;

    await prisma.headerSaldoAwal.create({
      data: {
        tgl_konversi: values.tanggal_konversi,
      },
    });

    const findLatestData = await prisma.headerSaldoAwal.findFirst({
      orderBy: {
        id: "desc",
      },
    });

    let detail = [];
    importedDataNewArray &&
      importedDataNewArray?.map((i) => {
        if (i.debit_nominal != 0 && i.kredit_nominal == 0) {
          detail.push({
            header_saldo_awal_id: findLatestData.id,
            akun_id: parseInt(i.id),
            debit: parseInt(i.debit_nominal),
            kredit: parseInt(i.kredit_nominal),
            sisa_saldo: parseInt(i.sisa_saldo_debit),
          });
        } else if (i.debit_nominal == 0 && i.kredit_nominal == 0) {
          detail.push({
            header_saldo_awal_id: findLatestData.id,
            akun_id: parseInt(i.id),
            debit: 0,
            kredit: 0,
            sisa_saldo: 0,
          });
        } else if (i.kredit_nominal != 0 && i.debit_nominal == 0) {
          detail.push({
            header_saldo_awal_id: findLatestData.id,
            akun_id: parseInt(i.id),
            debit: parseInt(i.debit_nominal),
            kredit: parseInt(i.kredit_nominal),
            sisa_saldo: parseInt(i.sisa_saldo_kredit),
          });
        } else if (i.kredit_nominal == 0 && i.debit_nominal == 0) {
          detail.push({
            header_saldo_awal_id: findLatestData.id,
            akun_id: parseInt(i.id),
            debit: 0,
            kredit: 0,
            sisa_saldo: 0,
          });
        }
      });

    await prisma.detailSaldoAwal.createMany({
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
        page: "/daftar-akun/create-saldo-awal",
        time: currentDatetime,
        action: "CREATE",
        description: `${currentDatetime} | ${decodedAccessToken.first_name} has created a new conversion date in saldo awal starting from ${values.tanggal_konversi}.`,
      },
    });

    res.status(201).json({ message: "Create saldo awal success" });
  } catch (error) {
    res.status(400).json({ message: "Create saldo awal failed", error });
    console.log(error);
  }
};
