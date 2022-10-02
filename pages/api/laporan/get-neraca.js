import moment from "moment";
import { groupBy, sortBy, sumBy, union, mapValues } from "lodash";
import { getNeracaPrisma } from "../../../libs/laporan";

export default async (req, res) => {
  try {
    const startOfMonth = moment().startOf("month").format("YYYY/MM/DD");
    const endOfMonth = moment().endOf("month").format("YYYY/MM/DD");

    const getNeraca = await getNeracaPrisma(startOfMonth, endOfMonth);
    let transform = getNeraca;

    let aset_lancar = [];
    let aset_tetap = [];
    let aktiva_lainya = [];
    let liabilitas_pendek = [];
    let liabilitas_panjang = [];
    let modal = [];
    let result = [];

    transform
      ?.filter((data) => data.kategori_id == 1 || data.kategori_id == 2 || data.kategori_id == 3 || data.kategori_id == 4)
      .map((data) => {
        aset_lancar.push({
          ...data,
          label: "Aset Lancar",
        });
      });

    transform
      ?.filter((data) => data.kategori_id == 5 || data.kategori_id == 7)
      .map((data) => {
        aset_tetap.push({
          ...data,
          label: "Aset Tetap",
        });
      });

    transform
      ?.filter((data) => data.kategori_id == 6)
      .map((data) => {
        aktiva_lainya.push({
          ...data,
          label: "Aktiva Lainya",
        });
      });

    transform
      ?.filter((data) => data.kategori_id == 8 || data.kategori_id == 10)
      .map((data) => {
        liabilitas_pendek.push({
          ...data,
          label: "Liabilitas Pendek",
        });
      });

    transform
      ?.filter((data) => data.kategori_id == 11)
      .map((data) => {
        liabilitas_panjang.push({
          ...data,
          label: "Liabilitas Panjang",
        });
      });

    transform
      ?.filter((data) => data.kategori_id == 12)
      .map((data) => {
        modal.push({
          ...data,
          label: "Modal",
        });
      });

    const hasil_union_aset = union(aset_lancar, aset_tetap, aktiva_lainya, liabilitas_pendek, liabilitas_panjang, modal);
    const hasilNestedGrouping = mapValues(
      groupBy(hasil_union_aset, (i) => i.label),
      (hasil_union_aset2) => groupBy(hasil_union_aset2, (j) => j.heading)
    );

    for (const [key, value] of Object.entries(hasilNestedGrouping)) {
      result.push({
        label: key,
        data: value,
      });
    }

    let end_result = [];

    result.map((data, index) => {
      let obj = { label: data.label, key: index + 1 };
      let sumValue = [];

      for (const [key, value] of Object.entries(data.data)) {
        let selisih_pny_debit = sumBy(value, "debit") - sumBy(value, "kredit");
        let selisih_pny_kredit = sumBy(value, "kredit") - sumBy(value, "debit");
        let selisih_akhir_debit = sumBy(value, "debit") - sumBy(value, "kredit") + value[0].saldo_awal_debit;
        let selisih_akhir_kredit = sumBy(value, "kredit") - sumBy(value, "debit") + value[0].saldo_awal_kredit;

        let pny_debit = 0;
        let pny_kredit = 0;
        let akhir_debit = 0;
        let akhir_kredit = 0;

        let total_pny_debit = 0;
        let total_pny_kredit = 0;
        let total_akhir_debit = 0;
        let total_akhir_kredit = 0;

        let grandDebit = 0;
        let grandKredit = 0;

        if (value[0].saldo_normal == "Debit" && selisih_pny_debit > 0) {
          pny_debit = "Rp. " + selisih_pny_debit.toLocaleString({ minimumFractionDigits: 0 });
          pny_kredit = 0;
          grandDebit = selisih_pny_debit;
          total_pny_debit = pny_debit;
          total_pny_kredit = 0;
        } else if (value[0].saldo_normal == "Debit" && selisih_pny_debit < 0) {
          pny_debit = selisih_pny_debit * -1;
          pny_kredit = 0;
          grandDebit = selisih_pny_debit;
          total_pny_debit = "(Rp. " + pny_debit.toLocaleString({ minimumFractionDigits: 0 }) + ")";
          total_pny_kredit = 0;
        } else if (value[0].saldo_normal == "Kredit" && selisih_pny_kredit > 0) {
          pny_debit = 0;
          pny_kredit = "Rp. " + selisih_pny_kredit.toLocaleString({ minimumFractionDigits: 0 });
          grandKredit = selisih_pny_kredit;
          total_pny_debit = 0;
          total_pny_kredit = pny_kredit;
        } else if (value[0].saldo_normal == "Kredit" && selisih_pny_kredit < 0) {
          pny_debit = 0;
          pny_kredit = "(Rp. " + (selisih_pny_kredit * -1).toLocaleString({ minimumFractionDigits: 0 }) + ")";
          grandKredit = selisih_pny_kredit;
          total_pny_debit = 0;
          total_pny_kredit = pny_kredit;
        }

        if (value[0].saldo_normal == "Debit" && selisih_akhir_debit > 0) {
          akhir_debit = "Rp. " + selisih_akhir_debit.toLocaleString({ minimumFractionDigits: 0 });
          akhir_kredit = 0;

          total_akhir_debit = selisih_akhir_debit;
          total_akhir_kredit = 0;
        } else if (value[0].saldo_normal == "Debit" && selisih_akhir_debit < 0) {
          akhir_debit = "(Rp. " + (selisih_akhir_debit * -1).toLocaleString({ minimumFractionDigits: 0 }) + ")";
          akhir_kredit = 0;

          total_akhir_debit = selisih_akhir_debit;
          total_akhir_kredit = 0;
        } else if (value[0].saldo_normal == "Kredit" && selisih_akhir_kredit > 0) {
          akhir_debit = 0;
          akhir_kredit = "Rp. " + selisih_akhir_kredit.toLocaleString({ minimumFractionDigits: 0 });

          total_akhir_debit = 0;
          total_akhir_kredit = selisih_akhir_kredit;
        } else if (value[0].saldo_normal == "Kredit" && selisih_akhir_kredit < 0) {
          akhir_debit = 0;
          akhir_kredit = "(Rp. " + (selisih_akhir_kredit * -1).toLocaleString({ minimumFractionDigits: 0 }) + ")";

          total_akhir_debit = 0;
          total_akhir_kredit = selisih_akhir_kredit;
        }

        sumValue.push({
          heading: key,
          saldo_normal: value[0].saldo_normal,
          saldo_awal_debit: value[0].saldo_awal_debit,
          saldo_awal_kredit: value[0].saldo_awal_kredit,
          pny_debit: pny_debit == 0 ? "Rp. 0" : pny_debit,
          pny_kredit: pny_kredit == 0 ? "Rp. 0" : pny_kredit,
          akhir_debit: akhir_debit == 0 ? "Rp. 0" : akhir_debit,
          akhir_kredit: akhir_kredit == 0 ? "Rp. 0" : akhir_kredit,
          saldo_akhir_tb: akhir_debit == 0 ? total_akhir_kredit : total_akhir_debit,
          total_pny_debit: total_pny_debit,
          total_pny_kredit: total_pny_kredit,
          total_akhir_debit: total_akhir_debit,
          total_akhir_kredit: total_akhir_kredit,
          grand_debit: grandDebit,
          grand_kredit: grandKredit,
        });
      }

      end_result.push({ ...obj, value: sumValue });
      sumValue = [];
      obj = {};
    });

    let new_result = [];

    end_result.map((i) => {
      if (i.label == "Aset Lancar") {
        new_result.push({
          ...i,
          subheader: "Aset",
          grandtotal: sumBy(i.value, "saldo_akhir_tb"),
        });
      } else if (i.label == "Aset Tetap") {
        new_result.push({
          ...i,
          subheader: "Aset",
          grandtotal: sumBy(i.value, "saldo_akhir_tb"),
        });
      } else if (i.label == "Aktiva Lainya") {
        new_result.push({
          ...i,
          subheader: "Aset",
          grandtotal: sumBy(i.value, "saldo_akhir_tb"),
        });
      } else if (i.label == "Liabilitas Pendek") {
        new_result.push({
          ...i,
          subheader: "Liabilitas",
          grandtotal: sumBy(i.value, "saldo_akhir_tb"),
        });
      } else if (i.label == "Liabilitas Panjang") {
        new_result.push({
          ...i,
          subheader: "Liabilitas",
          grandtotal: sumBy(i.value, "saldo_akhir_tb"),
        });
      } else if (i.label == "Modal") {
        new_result.push({
          ...i,
          subheader: "Liabilitas",
          grandtotal: sumBy(i.value, "saldo_akhir_tb"),
        });
      }
    });

    let aset = [];
    let liabilitas = [];

    new_result
      ?.filter((i) => i.subheader == "Aset")
      .map((j) => {
        aset.push({
          ...j,
        });
      });

    new_result
      ?.filter((i) => i.subheader == "Liabilitas")
      .map((j) => {
        liabilitas.push({
          ...j,
        });
      });

    let grandtotalaset =
      sumBy(aset, "grandtotal") < 0
        ? `(Rp. ${sumBy(aset, "grandtotal").toLocaleString()}) `
        : `Rp. ${sumBy(aset, "grandtotal").toLocaleString()}`;
    let grandtotalliabilitas =
      sumBy(liabilitas, "grandtotal") < 0
        ? `(Rp. ${sumBy(liabilitas, "grandtotal").toLocaleString()})`
        : `Rp. ${sumBy(liabilitas, "grandtotal").toLocaleString()}`;
    let new_array = [{ grandtotalaset }, { grandtotalliabilitas }];

    res.status(201).json({ message: "Get neraca success", neraca: new_result, new_array });
  } catch (error) {
    res.status(400).json({ message: "Get neraca failed", error });
  }
};
