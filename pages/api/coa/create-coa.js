import prisma from "../../../libs/prisma";
import _ from "lodash";
import jwtDecode from "jwt-decode";
import moment from "moment";

export default async (req, res) => {
  try {
    const find_akun = await prisma.akun.findMany({
      where: {
        kategoriId: parseInt(req.body.kategori_id),
      },
      orderBy: {
        kode_akun: "asc",
      },
      select: {
        kode_akun: true,
      },
    });

    const split = find_akun.map((i) => i.kode_akun.slice(-5));
    const list_akun = split.map((i) => parseInt(i));

    const [min_akun_piutang, max_akun_piutang, kode_1] = [10101, 10199, "1-"];
    const [min_aktiva_lancar, max_aktiva_lancar, kode_2] = [10301, 10599, "1-"];
    const [min_kas_bank, max_kas_bank, kode_3] = [10001, 10099, "1-"];
    const [min_persediaan, max_persediaan, kode_4] = [10201, 10299, "1-"];
    const [min_aktiva_tetap, max_aktiva_tetap, kode_5] = [10601, 10699, "1-"];
    const [min_aktiva_lainnya, max_aktiva_lainnya, kode_6] = [10701, 10749, "1-"];
    const [min_depresiasi_amortasi, max_depresiasi_amortasi, kode_7] = [10750, 10759, "1-"];
    const [min_akun_hutang, max_akun_hutang, kode_8] = [20101, 20299, "2-"];
    const [min_kewajiban_lancar, max_kewajiban_lancar, kode_10] = [20301, 20699, "2-"];
    const [min_kewajiban_panjang, max_kewajiban_panjang, kode_11] = [20701, 20799, "2-"];
    const [min_ekuitas, max_ekuitas, kode_12] = [30001, 30999, "3-"];
    const [min_pendapatan, max_pendapatan, kode_13] = [40001, 40999, "4-"];
    const [min_pendapatan_lainnya, max_pendapatan_lainnya, kode_14] = [70001, 70999, "7-"];
    const [min_harga_pokok, max_harga_pokok, kode_15] = [50001, 50999, "5-"];
    const [min_beban, max_beban, kode_16] = [60001, 60999, "6-"];
    const [min_beban_lainnya, max_beban_lainnya, kode_17] = [80001, 80999, "8-"];

    let range = [];
    const function_range = (min, max) => {
      for (var i = min; i <= max; i++) {
        range.push(i);
      }
    };

    const currentDatetime = moment().toISOString().substring(0, 10) + " " + moment().format("HH:mm");
    const { cookies } = req;
    const accessToken = cookies.access_token;
    const decodedAccessToken = jwtDecode(accessToken);

    const findRole = await prisma.role.findFirst({
      where: {
        id: +decodedAccessToken.role,
      },
    });

    if (req.body.kategori_id == 1) {
      // Akun piutang 1-10101 - 1-10199
      function_range(min_akun_piutang, max_akun_piutang);
      let unused_numbers = _.xor(list_akun, range);

      const array_length = unused_numbers.length;
      const kode_akun = kode_1.toString() + unused_numbers[0].toString();

      if (array_length > 0) {
        const create_akun = await prisma.akun.create({
          data: {
            kode_akun: kode_akun,
            tipeId: 1,
            nama_akun: req.body.nama_akun,
            kategoriId: 1,
          },
        });

        await prisma.auditLog.create({
          data: {
            user: decodedAccessToken.first_name,
            role: findRole.role_name,
            page: "/daftar-akun/add-coa",
            time: currentDatetime,
            action: "POST",
            description: `${currentDatetime} | ${decodedAccessToken.first_name} has created a new chart of account "${create_akun.kode_akun} - ${create_akun.nama_akun}".`,
          },
        });

        return res.status(200).json({ message: `Create ${create_akun.nama_akun} success` });
      } else {
        return res.status(400).json({ message: "Create daftar akun failed" });
      }
    } else if (req.body.kategori_id == 2) {
      // Aktiva lancar lainnya 1-10301 - 1-10199
      function_range(min_aktiva_lancar, max_aktiva_lancar);
      let unused_numbers = _.xor(list_akun, range);

      const array_length = unused_numbers.length;
      const kode_akun = kode_2.toString() + unused_numbers[0].toString();

      if (array_length > 0) {
        const create_akun = await prisma.akun.create({
          data: {
            kode_akun: kode_akun,
            tipeId: 1,
            nama_akun: req.body.nama_akun,
            kategoriId: 2,
          },
        });

        await prisma.auditLog.create({
          data: {
            user: decodedAccessToken.first_name,
            role: findRole.role_name,
            page: "/daftar-akun/add-coa",
            time: currentDatetime,
            action: "POST",
            description: `${currentDatetime} | ${decodedAccessToken.first_name} has created a new chart of account "${create_akun.kode_akun} - ${create_akun.nama_akun}".`,
          },
        });

        return res.status(200).json({ message: `Create ${create_akun.nama_akun} success` });
      } else {
        return res.status(400).json({ message: "Create daftar akun failed" });
      }
    } else if (req.body.kategori_id == 3) {
      // Kas & bank 1-10001 = 1-10099
      function_range(min_kas_bank, max_kas_bank);
      let unused_numbers = _.xor(list_akun, range);

      const array_length = unused_numbers.length;
      const kode_akun = kode_3.toString() + unused_numbers[0].toString();

      if (array_length > 0) {
        const create_akun = await prisma.akun.create({
          data: {
            kode_akun: kode_akun,
            tipeId: 1,
            nama_akun: req.body.nama_akun,
            kategoriId: 3,
          },
        });

        await prisma.auditLog.create({
          data: {
            user: decodedAccessToken.first_name,
            role: findRole.role_name,
            page: "/daftar-akun/add-coa",
            time: currentDatetime,
            action: "POST",
            description: `${currentDatetime} | ${decodedAccessToken.first_name} has created a new chart of account "${create_akun.kode_akun} - ${create_akun.nama_akun}".`,
          },
        });
        return res.status(200).json({ message: `Create ${create_akun.nama_akun} success` });
      } else {
        return res.status(400).json({ message: "Create daftar akun failed" });
      }
    } else if (req.body.kategori_id == 4) {
      // Persediaan 1-10201 - 1-10299
      function_range(min_persediaan, max_persediaan);
      let unused_numbers = _.xor(list_akun, range);

      const array_length = unused_numbers.length;
      const kode_akun = kode_4.toString() + unused_numbers[0].toString();

      if (array_length > 0) {
        const create_akun = await prisma.akun.create({
          data: {
            kode_akun: kode_akun,
            tipeId: 1,
            nama_akun: req.body.nama_akun,
            kategoriId: 4,
          },
        });

        await prisma.auditLog.create({
          data: {
            user: decodedAccessToken.first_name,
            role: findRole.role_name,
            page: "/daftar-akun/add-coa",
            time: currentDatetime,
            action: "POST",
            description: `${currentDatetime} | ${decodedAccessToken.first_name} has created a new chart of account "${create_akun.kode_akun} - ${create_akun.nama_akun}".`,
          },
        });
        return res.status(200).json({ message: `Create ${create_akun.nama_akun} success` });
      } else {
        return res.status(400).json({ message: "Create daftar akun failed" });
      }
    } else if (req.body.kategori_id == 5) {
      // Aktiva tetap 1-10601 - 1-10699
      function_range(min_aktiva_tetap, max_aktiva_tetap);
      let unused_numbers = _.xor(list_akun, range);

      const array_length = unused_numbers.length;
      const kode_akun = kode_5.toString() + unused_numbers[0].toString();

      if (array_length > 0) {
        const create_akun = await prisma.akun.create({
          data: {
            kode_akun: kode_akun,
            tipeId: 1,
            nama_akun: req.body.nama_akun,
            kategoriId: 5,
          },
        });

        await prisma.auditLog.create({
          data: {
            user: decodedAccessToken.first_name,
            role: findRole.role_name,
            page: "/daftar-akun/add-coa",
            time: currentDatetime,
            action: "POST",
            description: `${currentDatetime} | ${decodedAccessToken.first_name} has created a new chart of account "${create_akun.kode_akun} - ${create_akun.nama_akun}".`,
          },
        });
        return res.status(200).json({ message: `Create ${create_akun.nama_akun} success` });
      } else {
        return res.status(400).json({ message: "Create daftar akun failed" });
      }
    } else if (req.body.kategori_id == 6) {
      // Aktiva lainnya 1-10701 - 1-10749
      function_range(min_aktiva_lainnya, max_aktiva_lainnya);
      let unused_numbers = _.xor(list_akun, range);

      const array_length = unused_numbers.length;
      const kode_akun = kode_6.toString() + unused_numbers[0].toString();

      if (array_length > 0) {
        const create_akun = await prisma.akun.create({
          data: {
            kode_akun: kode_akun,
            tipeId: 1,
            nama_akun: req.body.nama_akun,
            kategoriId: 6,
          },
        });

        await prisma.auditLog.create({
          data: {
            user: decodedAccessToken.first_name,
            role: findRole.role_name,
            page: "/daftar-akun/add-coa",
            time: currentDatetime,
            action: "POST",
            description: `${currentDatetime} | ${decodedAccessToken.first_name} has created a new chart of account "${create_akun.kode_akun} - ${create_akun.nama_akun}".`,
          },
        });
        return res.status(200).json({ message: `Create ${create_akun.nama_akun} success` });
      } else {
        return res.status(400).json({ message: "Create daftar akun failed" });
      }
    } else if (req.body.kategori_id == 7) {
      // Depresiasi & amortasi 1-10750 - 1-10759
      function_range(min_depresiasi_amortasi, max_depresiasi_amortasi);
      let unused_numbers = _.xor(list_akun, range);

      const array_length = unused_numbers.length;
      const kode_akun = kode_7.toString() + unused_numbers[0].toString();

      if (array_length > 0) {
        const create_akun = await prisma.akun.create({
          data: {
            kode_akun: kode_akun,
            tipeId: 1,
            nama_akun: req.body.nama_akun,
            kategoriId: 7,
          },
        });

        await prisma.auditLog.create({
          data: {
            user: decodedAccessToken.first_name,
            role: findRole.role_name,
            page: "/daftar-akun/add-coa",
            time: currentDatetime,
            action: "POST",
            description: `${currentDatetime} | ${decodedAccessToken.first_name} has created a new chart of account "${create_akun.kode_akun} - ${create_akun.nama_akun}".`,
          },
        });
        return res.status(200).json({ message: `Create ${create_akun.nama_akun} success` });
      } else {
        return res.status(400).json({ message: "Create daftar akun failed" });
      }
    } else if (req.body.kategori_id == 8) {
      // Akun hutang 2-20101 - 2-20299
      function_range(min_akun_hutang, max_akun_hutang);
      let unused_numbers = _.xor(list_akun, range);

      const array_length = unused_numbers.length;
      const kode_akun = kode_8.toString() + unused_numbers[0].toString();

      if (array_length > 0) {
        const create_akun = await prisma.akun.create({
          data: {
            kode_akun: kode_akun,
            tipeId: 1,
            nama_akun: req.body.nama_akun,
            kategoriId: 8,
          },
        });

        await prisma.auditLog.create({
          data: {
            user: decodedAccessToken.first_name,
            role: findRole.role_name,
            page: "/daftar-akun/add-coa",
            time: currentDatetime,
            action: "POST",
            description: `${currentDatetime} | ${decodedAccessToken.first_name} has created a new chart of account "${create_akun.kode_akun} - ${create_akun.nama_akun}".`,
          },
        });
        return res.status(200).json({ message: `Create ${create_akun.nama_akun} success` });
      } else {
        return res.status(400).json({ message: "Create daftar akun failed" });
      }
    } else if (req.body.kategori_id == 10) {
      // Kewajiban lancar lainnya 2-20301 - 2-20699
      function_range(min_kewajiban_lancar, max_kewajiban_lancar);
      let unused_numbers = _.xor(list_akun, range);

      const array_length = unused_numbers.length;
      const kode_akun = kode_10.toString() + unused_numbers[0].toString();

      if (array_length > 0) {
        const create_akun = await prisma.akun.create({
          data: {
            kode_akun: kode_akun,
            tipeId: 1,
            nama_akun: req.body.nama_akun,
            kategoriId: 10,
          },
        });

        await prisma.auditLog.create({
          data: {
            user: decodedAccessToken.first_name,
            role: findRole.role_name,
            page: "/daftar-akun/add-coa",
            time: currentDatetime,
            action: "POST",
            description: `${currentDatetime} | ${decodedAccessToken.first_name} has created a new chart of account "${create_akun.kode_akun} - ${create_akun.nama_akun}".`,
          },
        });
        return res.status(200).json({ message: `Create ${create_akun.nama_akun} success` });
      } else {
        return res.status(400).json({ message: "Create daftar akun failed" });
      }
    } else if (req.body.kategori_id == 11) {
      // Kewajiban jangka panjang 2-20701 - 2-20799
      function_range(min_kewajiban_panjang, max_kewajiban_panjang);
      let unused_numbers = _.xor(list_akun, range);

      const array_length = unused_numbers.length;
      const kode_akun = kode_11.toString() + unused_numbers[0].toString();

      if (array_length > 0) {
        const create_akun = await prisma.akun.create({
          data: {
            kode_akun: kode_akun,
            tipeId: 1,
            nama_akun: req.body.nama_akun,
            kategoriId: 11,
          },
        });

        await prisma.auditLog.create({
          data: {
            user: decodedAccessToken.first_name,
            role: findRole.role_name,
            page: "/daftar-akun/add-coa",
            time: currentDatetime,
            action: "POST",
            description: `${currentDatetime} | ${decodedAccessToken.first_name} has created a new chart of account "${create_akun.kode_akun} - ${create_akun.nama_akun}".`,
          },
        });
        return res.status(200).json({ message: `Create ${create_akun.nama_akun} success` });
      } else {
        return res.status(400).json({ message: "Create daftar akun failed" });
      }
    } else if (req.body.kategori_id == 12) {
      // Ekuitas 3-30001 - 3-30999
      function_range(min_ekuitas, max_ekuitas);
      let unused_numbers = _.xor(list_akun, range);

      const array_length = unused_numbers.length;
      const kode_akun = kode_12.toString() + unused_numbers[0].toString();

      if (array_length > 0) {
        const create_akun = await prisma.akun.create({
          data: {
            kode_akun: kode_akun,
            tipeId: 1,
            nama_akun: req.body.nama_akun,
            kategoriId: 12,
          },
        });

        await prisma.auditLog.create({
          data: {
            user: decodedAccessToken.first_name,
            role: findRole.role_name,
            page: "/daftar-akun/add-coa",
            time: currentDatetime,
            action: "POST",
            description: `${currentDatetime} | ${decodedAccessToken.first_name} has created a new chart of account "${create_akun.kode_akun} - ${create_akun.nama_akun}".`,
          },
        });
        return res.status(200).json({ message: `Create ${create_akun.nama_akun} success` });
      } else {
        return res.status(400).json({ message: "Create daftar akun failed" });
      }
    } else if (req.body.kategori_id == 13) {
      // Pendapatan 4-40001 - 4-40999
      function_range(min_pendapatan, max_pendapatan);
      let unused_numbers = _.xor(list_akun, range);

      const array_length = unused_numbers.length;
      const kode_akun = kode_13.toString() + unused_numbers[0].toString();

      if (array_length > 0) {
        const create_akun = await prisma.akun.create({
          data: {
            kode_akun: kode_akun,
            tipeId: 1,
            nama_akun: req.body.nama_akun,
            kategoriId: 13,
          },
        });

        await prisma.auditLog.create({
          data: {
            user: decodedAccessToken.first_name,
            role: findRole.role_name,
            page: "/daftar-akun/add-coa",
            time: currentDatetime,
            action: "POST",
            description: `${currentDatetime} | ${decodedAccessToken.first_name} has created a new chart of account "${create_akun.kode_akun} - ${create_akun.nama_akun}".`,
          },
        });
        return res.status(200).json({ message: `Create ${create_akun.nama_akun} success` });
      } else {
        return res.status(400).json({ message: "Create daftar akun failed" });
      }
    } else if (req.body.kategori_id == 14) {
      // Pendapatan lainnya 7-70001 - 7-70999
      function_range(min_pendapatan_lainnya, max_pendapatan_lainnya);
      let unused_numbers = _.xor(list_akun, range);

      const array_length = unused_numbers.length;
      const kode_akun = kode_14.toString() + unused_numbers[0].toString();

      if (array_length > 0) {
        const create_akun = await prisma.akun.create({
          data: {
            kode_akun: kode_akun,
            tipeId: 1,
            nama_akun: req.body.nama_akun,
            kategoriId: 14,
          },
        });

        await prisma.auditLog.create({
          data: {
            user: decodedAccessToken.first_name,
            role: findRole.role_name,
            page: "/daftar-akun/add-coa",
            time: currentDatetime,
            action: "POST",
            description: `${currentDatetime} | ${decodedAccessToken.first_name} has created a new chart of account "${create_akun.kode_akun} - ${create_akun.nama_akun}".`,
          },
        });
        return res.status(200).json({ message: `Create ${create_akun.nama_akun} success` });
      } else {
        return res.status(400).json({ message: "Create daftar akun failed" });
      }
    } else if (req.body.kategori_id == 15) {
      // Harga pokok penjualan 5-50001 - 50999
      function_range(min_harga_pokok, max_harga_pokok);
      let unused_numbers = _.xor(list_akun, range);

      const array_length = unused_numbers.length;
      const kode_akun = kode_15.toString() + unused_numbers[0].toString();

      if (array_length > 0) {
        const create_akun = await prisma.akun.create({
          data: {
            kode_akun: kode_akun,
            tipeId: 1,
            nama_akun: req.body.nama_akun,
            kategoriId: 15,
          },
        });

        await prisma.auditLog.create({
          data: {
            user: decodedAccessToken.first_name,
            role: findRole.role_name,
            page: "/daftar-akun/add-coa",
            time: currentDatetime,
            action: "POST",
            description: `${currentDatetime} | ${decodedAccessToken.first_name} has created a new chart of account "${create_akun.kode_akun} - ${create_akun.nama_akun}".`,
          },
        });
        return res.status(200).json({ message: `Create ${create_akun.nama_akun} success` });
      } else {
        return res.status(400).json({ message: "Create daftar akun failed" });
      }
    } else if (req.body.kategori_id == 16) {
      // Beban 6-60001 - 6-60999
      function_range(min_beban, max_beban);
      let unused_numbers = _.xor(list_akun, range);

      const array_length = unused_numbers.length;
      const kode_akun = kode_16.toString() + unused_numbers[0].toString();

      if (array_length > 0) {
        const create_akun = await prisma.akun.create({
          data: {
            kode_akun: kode_akun,
            tipeId: 1,
            nama_akun: req.body.nama_akun,
            kategoriId: 16,
          },
        });

        await prisma.auditLog.create({
          data: {
            user: decodedAccessToken.first_name,
            role: findRole.role_name,
            page: "/daftar-akun/add-coa",
            time: currentDatetime,
            action: "POST",
            description: `${currentDatetime} | ${decodedAccessToken.first_name} has created a new chart of account "${create_akun.kode_akun} - ${create_akun.nama_akun}".`,
          },
        });
        return res.status(200).json({ message: `Create ${create_akun.nama_akun} success` });
      } else {
        return res.status(400).json({ message: "Create daftar akun failed" });
      }
    } else if (req.body.kategori_id == 17) {
      // Beban lainnya 8-80001 - 80999
      function_range(min_beban_lainnya, max_beban_lainnya);
      let unused_numbers = _.xor(list_akun, range);

      const array_length = unused_numbers.length;
      const kode_akun = kode_17.toString() + unused_numbers[0].toString();

      if (array_length > 0) {
        const create_akun = await prisma.akun.create({
          data: {
            kode_akun: kode_akun,
            tipeId: 1,
            nama_akun: req.body.nama_akun,
            kategoriId: 17,
          },
        });

        await prisma.auditLog.create({
          data: {
            user: decodedAccessToken.first_name,
            role: findRole.role_name,
            page: "/daftar-akun/add-coa",
            time: currentDatetime,
            action: "CREATE",
            description: `${currentDatetime} | ${decodedAccessToken.first_name} has created a new chart of account "${create_akun.kode_akun} - ${create_akun.nama_akun}".`,
          },
        });
        return res.status(200).json({ message: `Create ${create_akun.nama_akun} success` });
      } else {
        return res.status(400).json({ message: "Create daftar akun failed" });
      }
    }

    res.status(200).json({ message: "Create daftar akun success" });
  } catch (error) {
    res.status(400).json({ message: "Create daftar akun failed", error });
    console.log(error);
  }
};
