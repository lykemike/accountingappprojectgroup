import React from "react";
import Link from "next/link";
import TableViews from "./components/TableViews";
import CardMax from "../../components/CardMax";
import useSWR, { SWRConfig } from "swr";
import { authPage } from "../../middlewares/authorizationPage";
import { Breadcrumb, Button, Row, Col, Input, Divider } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import axios from "../../libs/axios";
const { Search } = Input;
const onSearch = (value) => console.log(value);

const fetcher = (url) => axios.get(url).then((response) => response.data);
const API = "/pembelian/pembelian-statistik";

export async function getServerSideProps(context) {
  const { token } = await authPage(context);

  const pembelianInfo = await fetcher(API);

  return {
    props: {
      fallback: {
        [API]: pembelianInfo,
      },
    },
  };
}

function Pembelian() {
  const { data, error } = useSWR(API);

  return (
    <div>
      <div name="breadcrumb" className="mb-4">
        <Breadcrumb>
          <Breadcrumb.Item>Pembelian</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <CardMax>
        <div>
          <Row gutter={16}>
            <Col span={6}>
              <div class="bg-white rounded-sm overflow-hidden shadow-md hover:shadow-lg transform transition duration-500 hover:scale-105 font-mono">
                <div class="px-4 py-2 bg-sky-400 flex items-center justify-between">
                  <h1 class="text-base font-gray-700 font-bold">TOTAL PEMBELIAN YANG BELUM DIBAYAR</h1>
                </div>
                <div class="px-4 py-2 flex space-x-2 mt-2">
                  <h3 class="text-lg text-gray-600 font-semibold mb-2">
                    Rp. {data?.tagihanBelumDiBayarNew ? data?.tagihanBelumDiBayarNew : "0, 00"}
                  </h3>
                </div>
              </div>
            </Col>

            <Col span={6}>
              <div class="bg-white rounded-sm overflow-hidden shadow-md hover:shadow-lg transform transition duration-500 hover:scale-105 font-mono">
                <div class="px-4 py-2 bg-indigo-400 flex items-center justify-between">
                  <h1 class="text-base font-gray-700 font-bold">TOTAL YANG BELUM DIBAYAR BULAN INI</h1>
                </div>
                <div class="px-4 py-2 flex space-x-2 mt-2">
                  <h3 class="text-lg text-gray-600 font-semibold mb-2">
                    Rp. {data?.tagihanBulanIniNew ? data?.tagihanBulanIniNew : "0, 00"}
                  </h3>
                </div>
              </div>
            </Col>

            <Col span={6}>
              <div class="bg-white rounded-sm overflow-hidden shadow-md hover:shadow-lg transform transition duration-500 hover:scale-105 font-mono">
                <div class="px-4 py-2 bg-red-400 flex items-center justify-between">
                  <h1 class="text-base font-gray-700 font-bold">TOTAL TAGIHAN YANG JATUH TEMPO</h1>
                </div>
                <div class="px-4 py-2 flex space-x-2 mt-2">
                  <h3 class="text-lg text-gray-600 font-semibold mb-2">
                    Rp. {data?.tagihanJatuhTempoNew ? data?.tagihanJatuhTempoNew : "0, 00"}
                  </h3>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        <Divider />

        <Row gutter={16}>
          <Col span={4}>
            <Search placeholder="search" onSearch={onSearch} enterButton />
          </Col>
          <Col span={20}>
            <div className="flex justify-end mb-4">
              <Link href="./pembelian/add-pembelian">
                <Button type="primary" icon={<PlusOutlined />}>
                  Add Pembelian
                </Button>
              </Link>
            </div>
          </Col>
        </Row>

        <TableViews />
      </CardMax>
    </div>
  );
}

export default function App({ fallback }) {
  return (
    <SWRConfig value={{ fallback }}>
      <Pembelian />
    </SWRConfig>
  );
}
