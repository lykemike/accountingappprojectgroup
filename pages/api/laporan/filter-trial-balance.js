import moment from "moment";
import { groupBy, sumBy, union, mapValues } from "lodash";
import { getTrialBalancePrisma } from "../../../libs/laporan";

export default async (req, res) => {
  try {
    const { range_picker } = req.body;
    const startOfMonth = moment(range_picker[0]).format("YYYY/MM/DD");
    const endOfMonth = moment(range_picker[1]).format("YYYY/MM/DD");

    const getTrialBalance = await getTrialBalancePrisma(startOfMonth, endOfMonth);

    let transform = getTrialBalance;
    let aset = [];
    let kewajiban = [];
    let ekuitas = [];
    let result = [];

    transform
      ?.filter(
        (data) =>
          data.kategori_id == 1 ||
          data.kategori_id == 2 ||
          data.kategori_id == 3 ||
          data.kategori_id == 4 ||
          data.kategori_id == 5 ||
          data.kategori_id == 6 ||
          data.kategori_id == 7 ||
          data.kategori_id == 15
      )
      .map((data) => {
        aset.push({
          ...data,
          label: "Aset",
        });
      });

    transform
      ?.filter((data) => data.kategori_id == 8 || data.kategori_id == 10 || data.kategori_id == 11)
      .map((data) => {
        kewajiban.push({
          ...data,
          label: "Kewajiban",
        });
      });

    transform
      ?.filter(
        (data) =>
          data.kategori_id == 12 || data.kategori_id == 13 || data.kategori_id == 14 || data.kategori_id == 16 || data.kategori_id == 17
      )
      .map((data) => {
        ekuitas.push({
          ...data,
          label: "Ekuitas",
        });
      });

    let hasilUnion = union(aset, kewajiban, ekuitas);

    const hasilNestedGrouping = mapValues(
      groupBy(hasilUnion, (i) => i.label),
      (hasilUnion2) => groupBy(hasilUnion2, (j) => j.heading)
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

        if (value[0].saldo_normal == "Debit" && selisih_pny_debit > 0) {
          pny_debit = "Rp. " + selisih_pny_debit.toLocaleString({ minimumFractionDigits: 0 });
          pny_kredit = 0;

          total_pny_debit = selisih_pny_debit;
          total_pny_kredit = 0;
        } else if (value[0].saldo_normal == "Debit" && selisih_pny_debit < 0) {
          pny_debit = "(Rp. " + (selisih_pny_debit * -1).toLocaleString({ minimumFractionDigits: 0 }) + ")";
          pny_kredit = 0;

          total_pny_debit = selisih_pny_debit;
          total_pny_kredit = 0;
        } else if (value[0].saldo_normal == "Kredit" && selisih_pny_kredit > 0) {
          pny_debit = 0;
          pny_kredit = "Rp. " + selisih_pny_kredit.toLocaleString({ minimumFractionDigits: 0 });

          total_pny_debit = 0;
          total_pny_kredit = selisih_pny_kredit;
        } else if (value[0].saldo_normal == "Kredit" && selisih_pny_kredit < 0) {
          pny_debit = 0;
          pny_kredit = "(Rp. " + (selisih_pny_kredit * -1).toLocaleString({ minimumFractionDigits: 0 }) + ")";

          total_pny_debit = 0;
          total_pny_kredit = selisih_pny_kredit;
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

          total_pny_debit: total_pny_debit,
          total_pny_kredit: total_pny_kredit,
          total_akhir_debit: total_akhir_debit,
          total_akhir_kredit: total_akhir_kredit,
        });
      }

      end_result.push({ ...obj, value: sumValue });
      sumValue = [];
      obj = {};
    });

    let new_result = [];
    end_result.map((i) => {
      if (i.label == "Aset") {
        new_result?.push({
          ...i,
          total_saldo_awal_debit: sumBy(i.value, "saldo_awal_debit"),
          total_saldo_awal_kredit: sumBy(i.value, "saldo_awal_kredit"),
          total_pny_debit: sumBy(i.value, "total_pny_debit"),
          total_pny_kredit: sumBy(i.value, "total_pny_kredit"),
          total_akhir_debit: sumBy(i.value, "total_akhir_debit"),
          total_akhir_kredit: sumBy(i.value, "total_akhir_kredit"),
        });
      } else if (i.label == "Kewajiban") {
        new_result?.push({
          ...i,
          total_saldo_awal_debit: sumBy(i.value, "saldo_awal_debit"),
          total_saldo_awal_kredit: sumBy(i.value, "saldo_awal_kredit"),
          total_pny_debit: sumBy(i.value, "total_pny_debit"),
          total_pny_kredit: sumBy(i.value, "total_pny_kredit"),
          total_akhir_debit: sumBy(i.value, "total_akhir_debit"),
          total_akhir_kredit: sumBy(i.value, "total_akhir_kredit"),
        });
      } else if (i.label == "Ekuitas") {
        new_result?.push({
          ...i,
          total_saldo_awal_debit: sumBy(i.value, "saldo_awal_debit"),
          total_saldo_awal_kredit: sumBy(i.value, "saldo_awal_kredit"),
          total_pny_debit: sumBy(i.value, "total_pny_debit"),
          total_pny_kredit: sumBy(i.value, "total_pny_kredit"),
          total_akhir_debit: sumBy(i.value, "total_akhir_debit"),
          total_akhir_kredit: sumBy(i.value, "total_akhir_kredit"),
        });
      }
    });

    let grand_total = [
      {
        grand_total_sa_debit: sumBy(new_result, "total_saldo_awal_debit"),
        grand_total_sa_kredit: sumBy(new_result, "total_saldo_awal_kredit"),
        grand_total_pny_debit: sumBy(new_result, "total_pny_debit"),
        grand_total_pny_kredit: sumBy(new_result, "total_pny_kredit"),
        grand_total_akhir_debit: sumBy(new_result, "total_akhir_debit"),
        grand_total_akhir_kredit: sumBy(new_result, "total_akhir_kredit"),
      },
    ];

    res.status(201).json({ message: "Filter trial balance success", trialBalance: new_result, grand_total });
  } catch (error) {
    res.status(400).json({ message: "Filter trial balance failed", error });
  }
};
