import React, { useState } from "react";
import axios from "../../libs/axios";
import CardMax from "../../components/CardMax";
import TableViewsLabaRugi from "./components/TableViewsLabaRugi";
import { authPage } from "../../middlewares/authorizationPage";
import moment from "moment";
import { Breadcrumb, Button, Row, Col, Card, Form, DatePicker, message } from "antd";
const { RangePicker } = DatePicker;

const fetcher = (url) => axios.get(url).then((response) => response.data);
const API = "/laporan/get-laba-rugi";

export async function getServerSideProps(context) {
  const { token } = await authPage(context);
  const labaRugiInfo = await fetcher(API);

  return {
    props: {
      labaRugiInfo: labaRugiInfo,
    },
  };
}

export default function LabaRugi({ labaRugiInfo }) {
  const [form] = Form.useForm();
  const [dataSelainBebanPajak, setDataSelainBebanPajak] = useState(labaRugiInfo?.bebanSelainBebanPajak);
  const [labaRugi, setLabaRugi] = useState(labaRugiInfo?.labaRugi);
  const [labaKotor, setLabaKotor] = useState(labaRugiInfo?.grand_total[0]?.laba_kotor ? labaRugiInfo?.grand_total[0]?.laba_kotor : 0);
  const [pendapatanBersihOperasional, setPendapatanBersihOperasional] = useState(
    labaRugiInfo?.grand_total[0]?.pendapatan_bersih_operasional ? labaRugiInfo?.grand_total[0]?.pendapatan_bersih_operasional : 0
  );
  const [pendapatanBersihSebelumPajak, setPendapatanBersihSebelumPajak] = useState(
    labaRugiInfo?.grand_total[0]?.pendapatan_bersih_sebelum_pajak ? labaRugiInfo?.grand_total[0]?.pendapatan_bersih_sebelum_pajak : 0
  );
  const [pendapatanBersihSesudahPajak, setPendapatanBersihSesudahPajak] = useState(
    labaRugiInfo?.grand_total[0]?.pendapatan_bersih_sesudah_pajak ? labaRugiInfo?.grand_total[0]?.pendapatan_bersih_sesudah_pajak : 0
  );

  const startOfMonth = moment().startOf("month").format("YYYY/MM/DD");
  const endOfMonth = moment().endOf("month").format("YYYY/MM/DD");
  const formattedDates = [moment(startOfMonth, "YYYY/MM/DD"), moment(endOfMonth, "YYYY/MM/DD")];

  const onFinish = (values) => {
    axios
      .post("/laporan/filter-laba-rugi", values.range_picker ? values : { range_picker: formattedDates })
      .then(function (response) {
        message.success(response?.data?.message);
        setDataSelainBebanPajak(response?.data?.bebanSelainBebanPajak);
        setLabaRugi(response?.data?.labaRugi);
        setLabaKotor(response?.data?.grand_total[0]?.laba_kotor);
        setPendapatanBersihOperasional(response?.data?.grand_total[0]?.pendapatan_bersih_operasional);
        setPendapatanBersihSebelumPajak(response?.data?.grand_total[0]?.pendapatan_bersih_sebelum_pajak);
        setPendapatanBersihSesudahPajak(response?.data?.grand_total[0]?.pendapatan_bersih_sesudah_pajak);
      })
      .catch(function (error) {
        message.error(error.response.data.message);
      });
  };

  const onFill = () => {
    form.setFieldsValue({
      range_picker: formattedDates,
    });

    axios
      .post("/laporan/filter-laba-rugi", { range_picker: formattedDates })
      .then(function (response) {
        message.success(response?.data?.message);
        setDataSelainBebanPajak(response?.data?.bebanSelainBebanPajak);
        setLabaRugi(response?.data?.labaRugi);
        setLabaKotor(response?.data?.grand_total[0]?.laba_kotor);
        setPendapatanBersihOperasional(response?.data?.grand_total[0]?.pendapatan_bersih_operasional);
        setPendapatanBersihSebelumPajak(response?.data?.grand_total[0]?.pendapatan_bersih_sebelum_pajak);
        setPendapatanBersihSesudahPajak(response?.data?.grand_total[0]?.pendapatan_bersih_sesudah_pajak);
      })
      .catch(function (error) {
        message.error(error.response.data.message);
      });
  };

  return (
    <div name="breadcrumb" className="mb-2">
      <Breadcrumb>
        <Breadcrumb.Item>Laporan</Breadcrumb.Item>
        <Breadcrumb.Item>Laba Rugi</Breadcrumb.Item>
      </Breadcrumb>

      <CardMax>
        <div className="mb-4">
          <Form onFinish={onFinish} form={form}>
            <div className="space-x-2 flex">
              <Form.Item name="range_picker">
                <RangePicker
                  value={formattedDates}
                  defaultValue={formattedDates}
                  defaultPickerValue={formattedDates}
                  format={"YYYY/MM/DD"}
                />
              </Form.Item>
              <Button type="primary" htmlType="submit">
                Filter
              </Button>
              <Button type="dashed" htmlType="button" onClick={onFill}>
                Reset
              </Button>
            </div>
          </Form>
        </div>

        <TableViewsLabaRugi
          bebanSelainBebanPajak={dataSelainBebanPajak}
          labaRugi={labaRugi}
          labaKotor={labaKotor}
          pendapatanBersihOperasional={pendapatanBersihOperasional}
          pendapatanBersihSebelumPajak={pendapatanBersihSebelumPajak}
          pendapatanBersihSesudahPajak={pendapatanBersihSesudahPajak}
        />
      </CardMax>
    </div>
  );
}
