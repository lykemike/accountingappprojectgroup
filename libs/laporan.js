import prisma from "./prisma";

export const getJurnalPrisma = async (startDate, endDate) => {
  let transform = [];
  const get_selected_data = await prisma.laporanTransaksi.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      akun: {
        select: {
          nama_akun: true,
          kode_akun: true,
        },
      },
    },
  });

  get_selected_data?.map((data, index) => {
    transform.push({
      key: index + 1,
      id: data.id,
      heading: data.sumber_transaksi + " #" + data.no_ref + " - " + data.date,
      nama_akun: data.akun.nama_akun,
      kode_akun: data.akun.kode_akun,
      tanggal: data.date,
      debit: data.debit,
      kredit: data.kredit,
      sumber_transaksi: data.sumber_transaksi,
      no_ref: data.no_ref,
    });
  });

  return transform;
};

export const getBukuBesarPrisma = async (startDate, endDate) => {
  let transform = [];
  const get_selected_data = await prisma.laporanTransaksi.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      akun: {
        select: {
          nama_akun: true,
          kode_akun: true,
          kategori_akun: {
            select: {
              saldo_normal_nama: true,
            },
          },
          DetailSaldoAwal: {
            include: {
              header_saldo_awal: true,
            },
          },
        },
      },
    },
  });

  get_selected_data?.map((data) => {
    transform.push({
      heading: data.akun.nama_akun + ": " + data.akun.kode_akun,
      tanggal: data.date,
      debit: data.debit,
      kredit: data.kredit,
      sumber_transaksi: data.sumber_transaksi,
      no_ref: data.no_ref,
      saldo_awal: data.akun.DetailSaldoAwal[0].debit == 0 ? data.akun.DetailSaldoAwal[0].kredit : data.akun.DetailSaldoAwal[0].debit,
      saldo_awal_date: data.akun.DetailSaldoAwal[0].header_saldo_awal.tgl_konversi,
      saldo_normal: data.akun.kategori_akun.saldo_normal_nama,
    });
  });

  return transform;
};

export const getTrialBalancePrisma = async (startDate, endDate) => {
  let transform = [];

  const get_selected_data = await prisma.laporanTransaksi.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      kategori: true,
      akun: {
        select: {
          nama_akun: true,
          kode_akun: true,
          kategori_akun: {
            select: {
              saldo_normal_nama: true,
            },
          },
          DetailSaldoAwal: {
            include: {
              header_saldo_awal: true,
            },
          },
        },
      },
    },
  });

  get_selected_data?.map((data) => {
    transform.push({
      heading: "(" + data.akun.kode_akun + ") - " + data.akun.nama_akun,
      tanggal: data.date,
      debit: data.debit,
      kredit: data.kredit,
      kategori_id: data.kategori.id,
      saldo_awal_debit: data.akun.DetailSaldoAwal[0].debit > 0 ? data.akun.DetailSaldoAwal[0].debit : 0,
      saldo_awal_kredit: data.akun.DetailSaldoAwal[0].kredit > 0 ? data.akun.DetailSaldoAwal[0].kredit : 0,
      saldo_normal: data.akun.kategori_akun.saldo_normal_nama,
    });
  });

  return transform;
};

export const getNeracaPrisma = async (startDate, endDate) => {
  let transform = [];

  const get_selected_data = await prisma.laporanTransaksi.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      kategori: true,
      akun: {
        select: {
          nama_akun: true,
          kode_akun: true,
          kategori_akun: {
            select: {
              saldo_normal_nama: true,
            },
          },
          DetailSaldoAwal: {
            include: {
              header_saldo_awal: true,
            },
          },
        },
      },
    },
  });

  get_selected_data?.map((data) => {
    transform.push({
      heading: "(" + data.akun.kode_akun + ") - " + data.akun.nama_akun,
      tanggal: data.date,
      debit: data.debit,
      kredit: data.kredit,
      kategori_id: data.kategori.id,
      saldo_awal_debit: data.akun.DetailSaldoAwal[0].debit > 0 ? data.akun.DetailSaldoAwal[0].debit : 0,
      saldo_awal_kredit: data.akun.DetailSaldoAwal[0].kredit > 0 ? data.akun.DetailSaldoAwal[0].kredit : 0,
      saldo_normal: data.akun.kategori_akun.saldo_normal_nama,
    });
  });

  return transform;
};

export const getLabaRugiPrisma = async (startDate, endDate) => {
  let transform = [];

  const get_selected_data = await prisma.laporanTransaksi.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      kategori: true,
      akun: {
        select: {
          nama_akun: true,
          kode_akun: true,
          kategori_akun: true,
          DetailSaldoAwal: {
            include: {
              header_saldo_awal: true,
            },
          },
        },
      },
    },
  });

  get_selected_data?.map((data) => {
    transform.push({
      heading: "(" + data.akun.kode_akun + ") - " + data.akun.nama_akun,
      tanggal: data.date,
      debit: data.debit,
      kredit: data.kredit,
      kategori_id: data.kategori.id,
      saldo_normal: data.akun.kategori_akun.saldo_normal_nama,
      nominal_pajak: data.nominal_pajak,
    });
  });

  return transform;
};

export const getArusKasPrisma = async (startDate, endDate) => {
  let transform = [];

  const get_selected_data = await prisma.laporanTransaksi.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      kategori: true,
      akun: {
        select: {
          nama_akun: true,
          kode_akun: true,
          kategori_akun: true,
          DetailSaldoAwal: {
            include: {
              header_saldo_awal: true,
            },
          },
        },
      },
    },
  });

  get_selected_data?.map((data) => {
    transform.push({
      heading: "(" + data.akun.kode_akun + ") - " + data.akun.nama_akun,
      tanggal: data.date,
      debit: data.debit,
      kredit: data.kredit,
      kategori_id: data.kategori.id,
      saldo_normal: data.akun.kategori_akun.saldo_normal_nama,
      nominal_pajak: data.nominal_pajak,
      saldo_awal: data.akun.DetailSaldoAwal[0].debit > 0 ? data.akun.DetailSaldoAwal[0].debit : 0,
    });
  });

  return transform;
};

export const getSaldoAwal = async () => {
  let saldo_awal = [];
  const get_saldo_awal = await prisma.akun.findMany({
    where: { kategoriId: 3 },
    include: {
      DetailSaldoAwal: true,
    },
  });

  get_saldo_awal?.map((i) => {
    saldo_awal.push({
      akun_id: i.id,
      saldo_awal: i.DetailSaldoAwal.length == [] ? 0 : i.DetailSaldoAwal[0].debit,
    });
  });

  return saldo_awal;
};
