import React from "react";
import Link from "next/link";
import Router from "next/router";
import useSWR, { SWRConfig } from "swr";
import axios from "../../libs/axios";
import CardMax from "../../components/CardMax";
import { authPage } from "../../middlewares/authorizationPage";

import { Breadcrumb, Button, Form, Input, message, Row, Col, Select } from "antd";
const { Option } = Select;

const fetcher = (url) => axios.get(url).then((response) => response.data);
const API = "/coa/get-kategori-coa";

export async function getServerSideProps(context) {
  const { token } = await authPage(context);
  const kategoriInfo = await fetcher(API);

  return {
    props: {
      fallback: {
        [API]: kategoriInfo,
      },
    },
  };
}

function AddCoa() {
  const { data, error } = useSWR(API);

  const onFinish = (values) => {
    axios
      .post("/coa/create-coa", values)
      .then(function (response) {
        message.success(response.data.message);
        Router.push("/daftar-akun");
      })
      .catch(function (error) {
        message.error(error.response.data.message);
      });
  };

  return (
    <div>
      <div className="mb-2">
        <Breadcrumb>
          <Breadcrumb.Item>Daftar Akun</Breadcrumb.Item>
          <Breadcrumb.Item>Add Daftar Akun</Breadcrumb.Item>
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
                label="Nama Akun"
                name="nama_akun"
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
                label="Kategori Akun"
                name="kategori_id"
                rules={[
                  {
                    required: true,
                    message: "required!",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Select a category"
                  optionFilterProp="children"
                  filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                  {data?.getKategoriCoa?.map((i) => (
                    <Option value={i.id}>{i.name}</Option>
                  ))}
                </Select>
              </Form.Item>

              <div className="flex justify-end space-x-2">
                <Link href="./">
                  <Button>Cancel</Button>
                </Link>
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
      <AddCoa />
    </SWRConfig>
  );
}
