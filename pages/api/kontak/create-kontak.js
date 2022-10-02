import prisma from "../../../libs/prisma";
import jwtDecode from "jwt-decode";
import moment from "moment";

export default async (req, res) => {
  try {
    const createKontak = await prisma.kontak.create({
      data: {
        gelar_id: +req.body.info_kontak.gelar_id,
        nama: req.body.info_kontak.nama_kontak,
        nomor_hp: req.body.nomor_hp,
        email: req.body.email,
        jabatan: req.body.jabatan,
        nama_perusahaan: req.body.nama_perusahaan,
        nomor_telepon: req.body.nomor_telepon,
        nomor_fax: req.body.nomor_fax,
        nomor_npwp: req.body.nomor_npwp,
        alamat_perusahaan: req.body.alamat_perusahaan,
        nama_bank: req.body.nama_bank,
        kantor_cabang_bank: req.body.kantor_cabang_bank,
        nomor_rekening: req.body.nomor_rekening,
        atas_nama: req.body.atas_nama,
        akun_piutang_id: +req.body.akun_piutang_id,
        akun_hutang_id: +req.body.akun_hutang_id,
        syarat_pembayaran_id: +req.body.syarat_pembayaran_id,
      },
    });

    const findLatestData = await prisma.kontak.findFirst({
      orderBy: {
        id: "desc",
      },
    });

    let detail = [];
    req.body.kategori_kontak?.map((i) => {
      detail.push({
        kontak_id: findLatestData.id,
        kontak_type_id: +i,
      });
    });

    await prisma.kontakDetail.createMany({
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
        page: "/kontak/add-kontak",
        time: currentDatetime,
        action: "CREATE",
        description: `${currentDatetime} | ${decodedAccessToken.first_name} has created a new kontak "${createKontak.nama_perusahaan}".`,
      },
    });

    res.status(201).json({ message: "Create kontak success" });
  } catch (error) {
    res.status(400).json({ message: "Create kontak failed", error });
    console.log(error);
  }
};
