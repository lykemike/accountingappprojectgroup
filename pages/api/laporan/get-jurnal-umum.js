import moment from "moment";
import { groupBy, sortBy, sumBy } from "lodash";
import { getJurnalPrisma } from "../../../libs/laporan";

export default async (req, res) => {
  try {
    const startOfMonth = moment().startOf("month").format("YYYY/MM/DD");
    const endOfMonth = moment().endOf("month").format("YYYY/MM/DD");

    const getJurnal = await getJurnalPrisma(startOfMonth, endOfMonth);
    let transform = getJurnal;
    let result = [];
    let hasil_grouping = groupBy(transform, "heading");
    let total_debit = sumBy(transform, "debit");
    let total_kredit = sumBy(transform, "kredit");

    for (const [key, value] of Object.entries(hasil_grouping)) {
      result.push({
        key: key,
        label: key,
        data: value,
      });
    }

    res
      .status(201)
      .json({ message: "Get jurnal umum success", jurnalUmum: sortBy(result, "label"), debit: total_debit, kredit: total_kredit });
  } catch (error) {
    res.status(400).json({ message: "Get jurnal umum failed", error });
  }
};
