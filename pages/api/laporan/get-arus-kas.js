import moment from "moment";
import { groupBy, sumBy, union } from "lodash";
import { getArusKasPrisma, getSaldoAwal } from "../../../libs/laporan";

export default async (req, res) => {
  try {
    const startOfMonth = moment().startOf("month").format("YYYY/MM/DD");
    const endOfMonth = moment().endOf("month").format("YYYY/MM/DD");

    const aruskas = await getArusKasPrisma(startOfMonth, endOfMonth);
    const saldo = await getSaldoAwal();

    let transform = aruskas;
    let transform2 = saldo;

    let penerimaan_pelanggan = [];
    let aset_lancar = [];
    let pembayaran = [];
    let kartukreditliabilitaspendek = [];
    let pendapatanlainya = [];
    let operasional = [];
    let penjualanaset = [];
    let aktivitas = [];
    let pembayaranpinjaman = [];
    let modal = [];

    let result = [];
    let result2 = [];
    let hasilgrup1 = groupBy(transform, "sumber");

    for (const [key, value] of Object.entries(hasilgrup1)) {
      let temp = [];

      let isInclude = value
        .map((i) => {
          return +i.kategori_id;
        })
        .includes(3);

      result.push({
        label: key,
        data: isInclude ? value : [],
      });
      temp = [];
    }

    result?.map((i) => {
      i.data
        ?.filter((data) => data.kategori_id == 1 || data.kategori_id == 13)
        .map((j) => {
          penerimaan_pelanggan.push({
            ...j,
            label: "Penerimaaan Dari Pelanggan",
          });
        });
    });

    result?.map((i) => {
      i.data
        ?.filter((data) => data.kategori_id == 2)
        .map((j) => {
          aset_lancar.push({
            ...j,
            label: "Aset Lancar Lainya",
          });
        });
    });
    result?.map((i) => {
      i.data
        ?.filter((data) => data.kategori_id == 8 || data.kategori_id == 15)
        .map((j) => {
          pembayaran.push({
            ...j,
            label: "Pembayaran ke Pemasok",
          });
        });
    });

    result?.map((i) => {
      i.data
        ?.filter((data) => data.kategori_id == 10)
        .map((j) => {
          kartukreditliabilitaspendek.push({
            ...j,
            label: "Kartu Kredit dan Liabilitas Jangka Pendek Lainnya",
          });
        });
    });

    result?.map((i) => {
      i.data
        ?.filter((data) => data.kategori_id == 14)
        .map((j) => {
          pendapatanlainya.push({
            ...j,
            label: "Pendapatan Lainnya",
          });
        });
    });

    result?.map((i) => {
      i.data
        ?.filter((data) => data.kategori_id == 16 || data.kategori_id == 17)
        .map((j) => {
          operasional.push({
            ...j,
            label: "Pengeluaran operasional",
          });
        });
    });

    result?.map((i) => {
      i.data
        ?.filter((data) => data.kategori_id == 5)
        .map((j) => {
          penjualanaset.push({
            ...j,
            label: "Perolehan/Penjualan Aset",
          });
        });
    });
    result?.map((i) => {
      i.data
        ?.filter((data) => data.kategori_id == 6)
        .map((j) => {
          aktivitas.push({
            ...j,
            label: "Aktivitas Investasi Lainnya",
          });
        });
    });
    result?.map((i) => {
      i.data
        ?.filter((data) => data.kategori_id == 11)
        .map((j) => {
          pembayaranpinjaman.push({
            ...j,
            label: "Pembayaran/Penerimaan pinjaman",
          });
        });
    });

    result?.map((i) => {
      i.data
        ?.filter((data) => data.kategori_id == 12)
        .map((j) => {
          modal.push({
            ...j,
            label: "Ekuitas/Modal",
          });
        });
    });

    const hasilUnion = union(
      aset_lancar,
      penerimaan_pelanggan,
      pembayaran,
      kartukreditliabilitaspendek,
      pendapatanlainya,
      operasional,
      penjualanaset,
      pembayaranpinjaman,
      aktivitas,
      modal
    );
    let newResult = [];

    let hasilgroupinglabel = groupBy(hasilUnion, "label");

    for (const [key, value] of Object.entries(hasilgroupinglabel)) {
      result2.push({
        label: key,
        data: value,
      });
    }

    result2.map((j) => {
      let pny = 0;
      pny = sumBy(j.data, "debit") - sumBy(j.data, "kredit");

      if (j.label == "Penerimaaan Dari Pelanggan" && pny > 0) {
        newResult.push({
          type: "aktivitas_opr",
          penerimaan_dari_pelanggan: "Rp. " + pny.toLocaleString({ minimumFractionDigits: 0 }),
          newNominal: pny,
        });
      } else if (j.label == "Penerimaaan Dari Pelanggan" && pny < 0) {
        newResult.push({
          type: "aktivitas_opr",
          penerimaan_dari_pelanggan: "(Rp. " + (pny * -1).toLocaleString({ minimumFractionDigits: 0 }) + ")",
          newNominal: pny,
        });
      } else if (j.label == "Aset Lancar Lainya" && pny > 0) {
        newResult.push({
          type: "aktivitas_opr",
          aset: "Rp. " + pny.toLocaleString({ minimumFractionDigits: 0 }),
          newNominal: pny,
        });
      } else if (j.label == "Aset Lancar Lainya" && pny < 0) {
        newResult.push({
          type: "aktivitas_opr",
          aset: "(Rp. " + (pny * -1).toLocaleString({ minimumFractionDigits: 0 }) + ")",
          newNominal: pny,
        });
      } else if (j.label == "Pembayaran ke Pemasok" && pny > 0) {
        newResult.push({
          type: "aktivitas_opr",
          pembayaran: "Rp. " + pny.toLocaleString({ minimumFractionDigits: 0 }),
          newNominal: pny,
        });
      } else if (j.label == "Pembayaran ke Pemasok" && pny < 0) {
        newResult.push({
          type: "aktivitas_opr",
          pembayaran: "(Rp. " + (pny * -1).toLocaleString({ minimumFractionDigits: 0 }) + ")",
          newNominal: pny,
        });
      } else if (j.label == "Kartu Kredit dan Liabilitas Jangka Pendek Lainnya" && pny > 0) {
        newResult.push({
          type: "aktivitas_opr",
          kartukredit: "Rp. " + pny.toLocaleString({ minimumFractionDigits: 0 }),
          newNominal: pny,
        });
      } else if (j.label == "Kartu Kredit dan Liabilitas Jangka Pendek Lainnya" && pny < 0) {
        newResult.push({
          type: "aktivitas_opr",
          kartukredit: "(Rp. " + (pny * -1).toLocaleString({ minimumFractionDigits: 0 }) + ")",
          newNominal: pny,
        });
      } else if (j.label == "Pendapatan Lainnya" && pny > 0) {
        newResult.push({
          type: "aktivitas_opr",
          pendapatanlain: "Rp. " + pny.toLocaleString({ minimumFractionDigits: 0 }),
          newNominal: pny,
        });
      } else if (j.label == "Pendapatan Lainnya" && pny < 0) {
        newResult.push({
          type: "aktivitas_opr",
          pendapatanlain: "(Rp. " + (pny * -1).toLocaleString({ minimumFractionDigits: 0 }) + ")",
          newNominal: pny,
        });
      } else if (j.label == "Pengeluaran operasional" && pny > 0) {
        newResult.push({
          type: "aktivitas_opr",
          pengeluaran: "Rp. " + pny.toLocaleString({ minimumFractionDigits: 0 }),
          newNominal: pny,
        });
      } else if (j.label == "Pengeluaran operasional" && pny < 0) {
        newResult.push({
          type: "aktivitas_opr",
          pengeluaran: "(Rp. " + (pny * -1).toLocaleString({ minimumFractionDigits: 0 }) + ")",
          newNominal: pny,
        });
      } else if (j.label == "Perolehan/Penjualan Aset" && pny > 0) {
        newResult.push({
          type: "aktivitas_inv",
          penjualanaset: "Rp. " + pny.toLocaleString({ minimumFractionDigits: 0 }),
          newNominal: pny,
        });
      } else if (j.label == "Perolehan/Penjualan Aset" && pny < 0) {
        newResult.push({
          type: "aktivitas_inv",
          penjualanaset: "(Rp. " + (pny * -1).toLocaleString({ minimumFractionDigits: 0 }) + ")",
          newNominal: pny,
        });
      } else if (j.label == "Aktivitas Investasi Lainnya" && pny > 0) {
        newResult.push({
          type: "aktivitas_inv",
          aktivitas: "Rp. " + pny.toLocaleString({ minimumFractionDigits: 0 }),
          newNominal: pny,
        });
      } else if (j.label == "Aktivitas Investasi Lainnya" && pny < 0) {
        newResult.push({
          type: "aktivitas_inv",
          aktivitas: "(Rp. " + (pny * -1).toLocaleString({ minimumFractionDigits: 0 }) + ")",
          newNominal: pny,
        });
      } else if (j.label == "Pembayaran/Penerimaan pinjaman" && pny > 0) {
        newResult.push({
          type: "aktivitas_dana",
          penerimaanpinjaman: "Rp. " + pny.toLocaleString({ minimumFractionDigits: 0 }),
          newNominal: pny,
        });
      } else if (j.label == "Pembayaran/Penerimaan pinjaman" && pny < 0) {
        newResult.push({
          type: "aktivitas_dana",
          penerimaanpinjaman: "(Rp. " + (pny * -1).toLocaleString({ minimumFractionDigits: 0 }) + ")",
          newNominal: pny,
        });
      } else if (j.label == "Ekuitas/Modal" && pny > 0) {
        newResult.push({
          type: "aktivitas_dana",
          modal: "Rp. " + pny.toLocaleString({ minimumFractionDigits: 0 }),
          newNominal: pny,
        });
      } else if (j.label == "Ekuitas/Modal" && pny < 0) {
        newResult.push({
          type: "aktivitas_dana",
          modal: "(Rp. " + (pny * -1).toLocaleString({ minimumFractionDigits: 0 }) + ")",
          newNominal: pny,
        });
      }
    });

    let total_aktivitas = [];

    newResult
      ?.filter((i) => i.type == "aktivitas_opr")
      .map((j) => {
        total_aktivitas.push({
          grand_total_opr: j.newNominal,
        });
      });

    newResult
      ?.filter((i) => i.type == "aktivitas_inv")
      .map((j) => {
        total_aktivitas.push({
          grand_total_inv: j.newNominal,
        });
      });

    newResult
      ?.filter((i) => i.type == "aktivitas_dana")
      .map((j) => {
        total_aktivitas.push({
          grand_total_dana: j.newNominal,
        });
      });

    let nom_opr = sumBy(total_aktivitas, "grand_total_opr") == undefined ? 0 : sumBy(total_aktivitas, "grand_total_opr");
    let fin_opr = 0;
    let nom_inv = sumBy(total_aktivitas, "grand_total_inv") == undefined ? 0 : sumBy(total_aktivitas, "grand_total_inv");
    let fin_inv = 0;
    let nom_dana = sumBy(total_aktivitas, "grand_total_dana") == undefined ? 0 : sumBy(total_aktivitas, "grand_total_dana");
    let fin_dana = 0;

    if (nom_opr < 0) {
      fin_opr =
        "(Rp. " +
        (nom_opr * -1).toLocaleString({
          minimumFractionDigits: 0,
        }) +
        ")";
    } else {
      fin_opr =
        "Rp. " +
        nom_opr.toLocaleString({
          minimumFractionDigits: 0,
        });
    }
    if (nom_inv < 0) {
      fin_inv =
        "(Rp. " +
        (nom_inv * -1).toLocaleString({
          minimumFractionDigits: 0,
        }) +
        ")";
    } else {
      fin_inv =
        "Rp. " +
        nom_inv.toLocaleString({
          minimumFractionDigits: 0,
        });
    }
    if (nom_dana < 0) {
      fin_dana =
        "(Rp. " +
        (nom_dana * -1).toLocaleString({
          minimumFractionDigits: 0,
        }) +
        ")";
    } else {
      fin_dana =
        "Rp. " +
        nom_dana.toLocaleString({
          minimumFractionDigits: 0,
        });
    }

    let nom_total_aktivitas1 = nom_opr + nom_inv + nom_dana;
    let total_aktivitas1 = 0;
    let nom_total_saldo_awal = sumBy(transform2, "saldo_awal");
    let total_saldo_awal = 0;
    let nom_kas_akhir = nom_total_aktivitas1 - nom_total_saldo_awal;
    let kas_akhir = 0;

    if (nom_total_aktivitas1 < 0) {
      total_aktivitas1 =
        "Rp. (" +
        (nom_total_aktivitas1 * -1).toLocaleString({
          minimumFractionDigits: 0,
        }) +
        ")";
    } else {
      total_aktivitas1 =
        "Rp. " +
        nom_total_aktivitas1.toLocaleString({
          minimumFractionDigits: 0,
        });
    }

    if (nom_total_saldo_awal < 0) {
      total_saldo_awal =
        "Rp. (" +
        (nom_total_saldo_awal * -1).toLocaleString({
          minimumFractionDigits: 0,
        }) +
        ")";
    } else {
      total_saldo_awal =
        "Rp. " +
        nom_total_saldo_awal.toLocaleString({
          minimumFractionDigits: 0,
        });
    }

    if (nom_kas_akhir < 0) {
      kas_akhir =
        "Rp. (" +
        (nom_kas_akhir * -1).toLocaleString({
          minimumFractionDigits: 0,
        }) +
        ")";
    } else {
      kas_akhir =
        "Rp. " +
        nom_kas_akhir.toLocaleString({
          minimumFractionDigits: 0,
        });
    }

    let grand_total = [];

    grand_total.push({
      aktivias_opr: fin_opr,
      aktivias_inv: fin_inv,
      aktivias_dana: fin_dana,
      total: total_aktivitas1,
      saldo_awal: total_saldo_awal,
      saldo_akhir: kas_akhir,
    });

    res.status(201).json({
      message: "Get arus kas success",
      total_saldo_awal,
      nom_kas_akhir,
      grand_total,
      total_aktivitas1,
      arusKas: newResult,
    });
  } catch (error) {
    res.status(400).json({ message: "Get arus kas failed", error });
  }
};
