import prisma from "../../../../libs/prisma";
import jwtDecode from "jwt-decode";
import moment from "moment";

export default async (req, res) => {
  try {
    const { kontakId } = req.query;
    const updateKontak = await prisma.kontak.update({
      where: {
        id: +kontakId,
      },
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

    await prisma.kontakDetail.deleteMany({
      where: {
        kontak_id: +kontakId,
      },
    });

    let detail = [];
    req.body.kategori_kontak?.map((i) => {
      detail.push({
        kontak_id: +kontakId,
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
        page: "/kontak/update-kontak",
        time: currentDatetime,
        action: "UPDATE",
        description: `${currentDatetime} | ${decodedAccessToken.first_name} has updated a kontak "${updateKontak.nama_perusahaan}".`,
      },
    });

    res.status(201).json({ message: "Update kontak success" });
  } catch (error) {
    res.status(400).json({ message: "Update kontak failed", error });
    console.log(error);
  }
};
