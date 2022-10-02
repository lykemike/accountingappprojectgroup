import React from "react";
import Router from "next/router";
import useSWR, { SWRConfig } from "swr";
import axios from "../../libs/axios";
import CardMax from "../../components/CardMax";
import { authPage } from "../../middlewares/authorizationPage";

import { Breadcrumb, Button, Form, Input, InputNumber, message, Row, Upload, Col, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
const { Option } = Select;

const fetcher = (url) => axios.get(url).then((response) => response.data);
const API = "/produk/get-produks";

export async function getServerSideProps(context) {
  const { token } = await authPage(context);
  const produkInfo = await fetcher(API);

  return {
    props: {
      fallback: {
        [API]: produkInfo,
      },
    },
  };
}

function AddProduk() {
  const { data, error } = useSWR(API);

  const onFinish = (values) => {
    let formData = new FormData();
    for (var key in values) {
      formData.append(`${key}`, values[key]);
    }

    if (values?.gambar?.fileList?.length > 0) {
      formData.append("file", values.gambar.fileList[0]?.originFileObj);
    }

    axios
      .post("/produk/create-produk", formData)
      .then(function (response) {
        message.success(response.data.message);
        Router.push("/produk");
      })
      .catch(function (error) {
        message.error(error.response.data.message);
      });
  };

  return (
    <div>
      <div className="mb-2">
        <Breadcrumb>
          <Breadcrumb.Item>Produk</Breadcrumb.Item>
          <Breadcrumb.Item>Add Produk</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <CardMax>
        <Row>
          <Col xs={{ span: 24 }} md={{ span: 6 }} />
          <Col xs={{ span: 24 }} md={{ span: 10 }}>
            <Form
              name="basic"
              labelAlign="left"
              id="add-produk-form"
              labelCol={{
                span: 6,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item label="Gambar" name="gambar">
                <Upload listType="picture" maxCount={1}>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>

              <Form.Item
                label="Nama Produk"
                name="nama_produk"
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
                label="Kategori Produk"
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
                  placeholder="Select a kategori"
                  optionFilterProp="children"
                  filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                  {data?.getKategoriProduk?.map((i) => (
                    <Option value={i.id}>{i.nama}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Deskripsi" name="description">
                <Input.TextArea
                  showCount
                  maxLength={100}
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Harga"
                name="harga"
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
                  formatter={(value) => `Rp. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value.replace(/\Rp.\s?|(,*)/g, "")}
                />
              </Form.Item>

              <Form.Item
                label="Akun Penjualan"
                name="akun_penjualan_id"
                rules={[
                  {
                    required: true,
                    message: "required!",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Select akun penjualan"
                  optionFilterProp="children"
                  filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                  {data?.getAkunPenjualan?.map((i) => (
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
      <AddProduk />
    </SWRConfig>
  );
}
