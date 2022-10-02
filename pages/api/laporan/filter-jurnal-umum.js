import moment from "moment";
import { groupBy, sortBy, sumBy } from "lodash";
import { getJurnalPrisma } from "../../../libs/laporan";

export default async (req, res) => {
  try {
    const { range_picker } = req.body;
    const startOfMonth = moment(range_picker[0]).format("YYYY/MM/DD");
    const endOfMonth = moment(range_picker[1]).format("YYYY/MM/DD");

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
      .json({ message: "Filter jurnal umum success", jurnalUmum: sortBy(result, "label"), debit: total_debit, kredit: total_kredit });
  } catch (error) {
    res.status(400).json({ message: "Filter jurnal umum failed", error });
  }
};
