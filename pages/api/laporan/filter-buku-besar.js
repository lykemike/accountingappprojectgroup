import moment from "moment";
import { groupBy, sortBy, sumBy } from "lodash";
import { getBukuBesarPrisma } from "../../../libs/laporan";

export default async (req, res) => {
  try {
    const { range_picker } = req.body;
    const startOfMonth = moment(range_picker[0]).format("YYYY/MM/DD");
    const endOfMonth = moment(range_picker[1]).format("YYYY/MM/DD");

    const buku_besar = await getBukuBesarPrisma(startOfMonth, endOfMonth);
    let tranform = [];
    let result = [];

    buku_besar?.map((data, index) => {
      if (data.saldo_normal == "Debit") {
        tranform.push({
          heading: data.heading,
          tanggal: data.tanggal,
          debit: data.debit,
          kredit: data.kredit,
          sumber_transaksi: data.sumber_transaksi,
          no_ref: data.no_ref,
          saldo_awal: data.saldo_awal,
          saldo_awal_date: data.saldo_awal_date,
          saldo_normal: data.saldo_normal,
          selisih: 0,
        });
      } else if (data.saldo_normal == "Kredit") {
        tranform.push({
          heading: data.heading,
          tanggal: data.tanggal,
          debit: data.debit,
          kredit: data.kredit,
          sumber_transaksi: data.sumber_transaksi,
          no_ref: data.no_ref,
          saldo_awal: data.saldo_awal,
          saldo_awal_date: data.saldo_awal_date,
          saldo_normal: data.saldo_normal,
          selisih: 0,
        });
      }
    });

    let hasil_grouping = groupBy(tranform, "heading");
    let total_debit = sumBy(tranform, "debit");
    let total_kredit = sumBy(tranform, "kredit");

    for (const [key, value] of Object.entries(hasil_grouping)) {
      result.push({
        label: key,
        data: value,
      });
    }

    let end_result = [];

    result.forEach((value, indexLabel) => {
      let obj = {
        label: value.label,
        key: indexLabel,
        saldo_awal: value?.data[0]?.saldo_awal,
        saldo_awal_date: value?.data[0]?.saldo_awal_date,
      };
      let temp = [];
      let saldo_awal = 0;
      value.data.map((j, index) => {
        if (index > 0) {
          if (j.saldo_normal === "Debit") {
            saldo_awal = saldo_awal + j.debit - j.kredit;
          }
          if (j.saldo_normal === "Kredit") {
            saldo_awal = saldo_awal + j.kredit - j.debit;
          }
          temp.push({
            ...j,
            selisih: saldo_awal,
          });
        } else {
          if (j.saldo_normal === "Debit") {
            saldo_awal = value.data[0].debit + value.data[0].saldo_awal - value.data[0].kredit;
          }
          if (j.saldo_normal === "Kredit") {
            saldo_awal = value.data[0].kredit + value.data[0].saldo_awal - value.data[0].debit;
          }
          temp.push({
            ...j,
            selisih: saldo_awal,
          });
        }
      });
      saldo_awal = 0;
      end_result.push({ ...obj, value: temp });
    });

    res
      .status(201)
      .json({ message: "Filter buku besar success", bukuBesar: sortBy(end_result, "label"), debit: total_debit, kredit: total_kredit });
  } catch (error) {
    res.status(400).json({ message: "Filter buku besar failed", error });
  }
};
