import React from "react";
import Link from "next/link";
import moment from "moment";
import useSWR, { SWRConfig } from "swr";
import axios from "../../../libs/axios";
import CardMax from "../../../components/CardMax";
import { authPage } from "../../../middlewares/authorizationPage";

import { Breadcrumb, Button, Divider, Row, Col, Descriptions, Collapse } from "antd";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material/";
const { Panel } = Collapse;

const fetcher = (url) => axios.get(url).then((response) => response.data);
const API = "/pembelian/read-pengiriman/";

export async function getServerSideProps(context) {
  const { token } = await authPage(context);
  const { pengirimanId } = context.params;
  const pengirimanInfo = await fetcher(API + pengirimanId);

  return {
    props: {
      fallback: {
        [API]: pengirimanInfo,
      },
    },
  };
}

function ViewPengiriman() {
  const { data } = useSWR(API);
  console.log(data);
  return (
    <div>
      <div className="mb-2">
        <Breadcrumb>
          <Breadcrumb.Item>Pembelian</Breadcrumb.Item>
          <Breadcrumb.Item>View Pengiriman Pembayaran</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <CardMax>
        <Descriptions bordered>
          <Descriptions.Item label={<span className="font-semibold">Supplier</span>} span={1}>
            {data?.newPengirimanArray[0]?.nama_supplier}
          </Descriptions.Item>

          <Descriptions.Item label={<span className="font-semibold">Bayar Dari</span>} span={2}>
            {data?.newPengirimanArray[0]?.bayar_dari}
          </Descriptions.Item>

          <Descriptions.Item label={<span className="font-semibold">Tanggal Pembayaran</span>} span={1}>
            {data?.newPengirimanArray[0]?.tgl_pembayaran}
          </Descriptions.Item>

          <Descriptions.Item label={<span className="font-semibold">Cara Pembayaran</span>} span={1}>
            {data?.newPengirimanArray[0]?.cara_pembayaran}
          </Descriptions.Item>

          <Descriptions.Item label={<span className="font-semibold">No. Transaksi</span>} span={1}>
            {data?.newPengirimanArray[0]?.no_transaksi}
          </Descriptions.Item>
          <Descriptions.Item label={<span className="font-semibold">No. Referensi Tagihan</span>} span={1}>
            {data?.newPengirimanArray[0]?.no_ref}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <div className="mt-6">
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableHead className="bg-sky-300">
                <TableRow>
                  <TableCell width={300}>Nomor</TableCell>
                  <TableCell width={400}>Deskripsi</TableCell>
                  <TableCell width={200}>Tanggal Jatuh Tempo</TableCell>
                  <TableCell width={200}>Sisa Tagihan</TableCell>
                  <TableCell width={200}>Jumlah Yang Di Bayar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{data?.newPengirimanArray[0]?.invoice}</TableCell>
                  <TableCell>{data?.newPengirimanArray[0]?.deskripsi}</TableCell>
                  <TableCell>{data?.newPengirimanArray[0]?.tgl_jatuh_tempo}</TableCell>
                  <TableCell>{`Rp. ${data?.newPengirimanArray[0]?.sisa_tagihan.toLocaleString()}`}</TableCell>
                  <TableCell>{`Rp. ${data?.newPengirimanArray[0]?.jumlah.toLocaleString()}`}</TableCell>
                </TableRow>
              </TableBody>

              <TableRow>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell align="right">Total</TableCell>
                <TableCell>{`Rp. ${data?.newPengirimanArray[0]?.jumlah.toLocaleString()}`}</TableCell>
              </TableRow>
            </Table>
          </TableContainer>

          <Divider />

          <Row gutter={16} className="mt-12">
            <Col md={{ span: 8 }} />
            <Col md={{ span: 8 }} />
            <Col md={{ span: 8 }}>
              <div className="flex justify-end space-x-2 ">
                <Link href={`/pembelian`}>
                  <a>
                    <Button>Kembali</Button>
                  </a>
                </Link>
                {/* <Link href={`/pembelian/update-pengiriman-pembayaran/${data?.pengirimanPembayaran?.id}`}>
                  <a>
                    <Button type="primary">Ubah</Button>
                  </a>
                </Link> */}
              </div>
            </Col>
          </Row>
        </div>
      </CardMax>
    </div>
  );
}

export default function App({ fallback }) {
  return (
    <SWRConfig value={{ fallback }}>
      <ViewPengiriman />
    </SWRConfig>
  );
}
