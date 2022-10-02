import React, { useState } from "react";
import axios from "../../libs/axios";
import CardMax from "../../components/CardMax";
import TableViewsTrialBalance from "./components/TableViewsTrialBalance";
import { authPage } from "../../middlewares/authorizationPage";
import moment from "moment";
import { Breadcrumb, Button, Row, Col, Card, Form, DatePicker, message } from "antd";
const { RangePicker } = DatePicker;

const fetcher = (url) => axios.get(url).then((response) => response.data);
const API = "/laporan/get-trial-balance";

export async function getServerSideProps(context) {
  const { token } = await authPage(context);
  const trialBalanceInfo = await fetcher(API);

  return {
    props: {
      trialBalanceInfo: trialBalanceInfo,
    },
  };
}

export default function TrialBalance({ trialBalanceInfo }) {
  const [form] = Form.useForm();
  const [dataTrialBalance, setDataTrialBalance] = useState(trialBalanceInfo);
  const startOfMonth = moment().startOf("month").format("YYYY/MM/DD");
  const endOfMonth = moment().endOf("month").format("YYYY/MM/DD");
  const formattedDates = [moment(startOfMonth, "YYYY/MM/DD"), moment(endOfMonth, "YYYY/MM/DD")];

  const onFinish = (values) => {
    axios
      .post("/laporan/filter-trial-balance", values.range_picker ? values : { range_picker: formattedDates })
      .then(function (response) {
        message.success(response?.data?.message);
        setDataTrialBalance(response?.data);
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
      .post("/laporan/filter-trial-balance", { range_picker: formattedDates })
      .then(function (response) {
        message.success(response?.data?.message);
        setDataTrialBalance(response?.data);
      })
      .catch(function (error) {
        message.error(error.response.data.message);
      });
  };

  return (
    <div name="breadcrumb" className="mb-2">
      <Breadcrumb>
        <Breadcrumb.Item>Laporan</Breadcrumb.Item>
        <Breadcrumb.Item>Trial Balance</Breadcrumb.Item>
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

        <TableViewsTrialBalance dataTrialBalance={dataTrialBalance} />
      </CardMax>
    </div>
  );
}
