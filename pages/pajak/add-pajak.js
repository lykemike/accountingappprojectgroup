import React from "react";
import Router from "next/router";
import useSWR, { SWRConfig } from "swr";
import axios from "../../libs/axios";
import CardMax from "../../components/CardMax";
import { authPage } from "../../middlewares/authorizationPage";

import { Breadcrumb, Button, Form, Input, InputNumber, message, Row, Col, Select } from "antd";
const { Option } = Select;

const fetcher = (url) => axios.get(url).then((response) => response.data);
const API = "/pajak/get-kategori-pajak";

export async function getServerSideProps(context) {
  const { token } = await authPage(context);
  const pajakKategoriInfo = await fetcher(API);

  return {
    props: {
      fallback: {
        [API]: pajakKategoriInfo,
      },
    },
  };
}

function AddUser() {
  const { data, error } = useSWR(API);

  const onFinish = (values) => {
    axios
      .post("/pajak/create-pajak", values)
      .then(function (response) {
        message.success(response.data.message);
        Router.push("/pajak");
      })
      .catch(function (error) {
        message.error(error.response.data.message);
      });
  };

  return (
    <div>
      <div className="mb-2">
        <Breadcrumb>
          <Breadcrumb.Item>Pajak</Breadcrumb.Item>
          <Breadcrumb.Item>Add Pajak</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <CardMax>
        <Row>
          <Col xs={{ span: 24 }} md={{ span: 6 }} />
          <Col xs={{ span: 24 }} md={{ span: 10 }}>
            <Form
              name="basic"
              labelAlign="left"
              id="add-user-form"
              labelCol={{
                span: 6,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                label="Nama Pajak"
                name="nama_pajak"
                rules={[
                  {
                    required: true,
                    message: "required!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Presentase Aktif"
                name="presentase_aktif"
                rules={[
                  {
                    required: true,
                    message: "required!",
                  },
                ]}
              >
                <InputNumber
                  style={{
                    width: "100%",
                  }}
                  defaultValue={0}
                  min={0}
                  max={100}
                  formatter={(value) => `${value}%`}
                  parser={(value) => value.replace("%", "")}
                />
              </Form.Item>

              <Form.Item
                label="Akun Pajak Keluaran"
                name="pajak_keluaran_id"
                rules={[
                  {
                    required: true,
                    message: "required!",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Select akun pajak keluaran"
                  optionFilterProp="children"
                  filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                  {data?.getPajakKeluaran?.map((i) => (
                    <Option value={i.id}>
                      {i.kode_akun} - {i.nama_akun}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Akun Pajak Masukan"
                name="pajak_masukan_id"
                rules={[
                  {
                    required: true,
                    message: "required!",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Select akun pajak masukan"
                  optionFilterProp="children"
                  filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                  {data?.getPajakMasukan?.map((i) => (
                    <Option value={i.id}>
                      {i.kode_akun} - {i.nama_akun}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <div className="flex justify-end">
                <Button htmlType="submit" type="primary">
                  Submit
                </Button>
              </div>
            </Form>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 8 }} />
        </Row>
      </CardMax>
    </div>
  );
}

export default function App({ fallback }) {
  return (
    <SWRConfig value={{ fallback }}>
      <AddUser />
    </SWRConfig>
  );
}
