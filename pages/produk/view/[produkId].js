import React from "react";
import Link from "next/link";
import Image from "next/image";
import useSWR, { SWRConfig } from "swr";
import axios from "../../../libs/axios";
import { authPage } from "../../../middlewares/authorizationPage";
import { Breadcrumb, Button, Row, Col, Table, Divider } from "antd";

const fetcher = (url) => axios.get(url).then((response) => response.data);
const API = "/produk/read-produk/";

export async function getServerSideProps(context) {
  const { token } = await authPage(context);
  const { produkId } = context.params;
  const produkInfo = await fetcher(API + produkId);

  return {
    props: {
      fallback: {
        [API]: produkInfo,
      },
    },
  };
}

function ViewProduk() {
  const { data } = useSWR(API);

  const columns = [
    {
      title: "Penjualan",
      dataIndex: "header_penjualan_id",
      width: 200,
      render: (detail) => (
        <span>
          <Link href={`/penjualan/view/${detail}`}>
            <a>Sales Invoice #{detail}</a>
          </Link>
        </span>
      ),
    },
    {
      title: "Pelanggan",
      width: 300,
      ellipsis: true,
      render: (detail) => <span>{detail.header_penjualan.email}</span>,
    },
    {
      title: "Nomor Kontrak",
      width: 200,
      ellipsis: true,
      render: (detail) => <span>{detail.header_penjualan.nomor_kontrak}</span>,
    },
    {
      title: "Invoice",
      width: 300,
      render: (detail) => <span>{detail.header_penjualan.custom_invoice}</span>,
    },
  ];
  return (
    <div>
      <div className="mb-2">
        <Breadcrumb>
          <Breadcrumb.Item>Produk</Breadcrumb.Item>
          <Breadcrumb.Item>View Produk</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="bg-white rounded-md shadow-sm p-4">
        <Row gutter={[16, 16]}>
          <Col xs={{ span: 24 }} md={{ span: 4 }}>
            {data.newProdukArray[0].file ? (
              <Image
                className="rounded-md"
                src={`/uploads/${data.newProdukArray[0].file}`}
                width="100%"
                height="100%"
                layout="responsive"
                objectFit="cover"
              />
            ) : (
              <Image
                className="rounded-md"
                src={`/uploads/image_placeholder.png`}
                width="100%"
                height="100%"
                layout="responsive"
                objectFit="cover"
              />
            )}
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 18 }}>
            <div className="flex space-x-4">
              <div>
                <span className="font-bold text-2xl font-sans">{data.newProdukArray[0].nama.toUpperCase()}</span>
                <br />
                <span className="italic font-sans">{data.newProdukArray[0].deskripsi}</span>
                <br />
                <div className="space-x-2">
                  <span className="font-sans px-2 font-semibold rounded-sm bg-sky-300 text-sky-800">{data.newProdukArray[0].kategori}</span>
                  <span className="font-sans px-2 font-semibold rounded-sm bg-green-300 text-green-800">{data.newProdukArray[0].akun}</span>
                </div>
                <br />
                <span className="font-bold text-xl font-sans">{data.newProdukArray[0].harga}</span>
              </div>
            </div>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 2 }}>
            <div className="flex justify-end">
              <Link href={`/produk/update/${data.newProdukArray[0].id}`}>
                <Button type="primary">EDIT</Button>
              </Link>
            </div>
          </Col>
        </Row>
      </div>

      <div className="bg-white rounded-md shadow-sm p-4 mt-2">
        <div className="text-2xl font-sans font-semibold">Transaksi Produk</div>
        <Divider />

        <Table
          bordered
          size="small"
          scroll={{ x: 1000 }}
          columns={columns}
          dataSource={data?.detailTransactions ? data?.detailTransactions : []}
          loading={data?.detailTransactions ? false : true}
        />
      </div>
    </div>
  );
}

export default function App({ fallback }) {
  return (
    <SWRConfig value={{ fallback }}>
      <ViewProduk />
    </SWRConfig>
  );
}
