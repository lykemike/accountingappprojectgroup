import React from "react";
import Link from "next/link";
import useSWR, { SWRConfig } from "swr";
import axios from "../../../libs/axios";
import CardMax from "../../../components/CardMax";
import { authPage } from "../../../middlewares/authorizationPage";
import {
  Breadcrumb,
  Button,
  Checkbox,
  Divider,
  Descriptions,
  Form,
  Input,
  message,
  Skeleton,
  Select,
  Typography,
  Row,
  Col,
} from "antd";
import { BankOutlined, FileOutlined, InfoCircleOutlined, ProfileOutlined } from "@ant-design/icons";
import { Table, TableBody, TableCell, TableFooter, TableContainer, TableHead, TableRow, Paper } from "@mui/material/";
const CheckboxGroup = Checkbox.Group;
const { Option } = Select;
const { Title } = Typography;

const fetcher = (url) => axios.get(url).then((response) => response.data);
const API = "/penjualan/read-penjualan/";

export async function getServerSideProps(context) {
  const { token } = await authPage(context);
  const { penjualanId } = context.params;
  const penjualanInfo = await fetcher(API + penjualanId);

  return {
    props: {
      fallback: {
        [API]: penjualanInfo,
      },
    },
  };
}

function ViewPenjualan() {
  const { data } = useSWR(API);

  return (
    <div>
      <div className="mb-2">
        <Breadcrumb>
          <Breadcrumb.Item>Penjualan</Breadcrumb.Item>
          <Breadcrumb.Item>View Penjualan</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <CardMax>
        <Row gutter={[16, 16]}>
          <Col md={{ span: 6 }}>
            <Row gutter={16}>
              <Col>
                <div className="font-semibold">Pelanggan:</div>
              </Col>
              <Col>
                <div>{data?.getHeaderPenjualan?.kontak?.nama_perusahaan}</div>
              </Col>
            </Row>
          </Col>
          <Col md={{ span: 6 }}>
            <Row gutter={16}>
              <Col>
                <div className="font-semibold">Email:</div>
              </Col>
              <Col>
                <div>{data?.getHeaderPenjualan?.kontak?.email}</div>
              </Col>
            </Row>
          </Col>
          <Col md={{ span: 6 }} />
          <Col md={{ span: 6 }}>
            <div className="flex justify-end">
              {data?.getHeaderPenjualan?.sisa_tagihan > 0
                ? data?.getHeaderPenjualan?.PenerimaanPembayaran.length > 0
                  ? "TERBAYAR SEBAGIAN"
                  : "BELUM TERBAYAR"
                : "LUNAS"}
            </div>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[16, 16]}>
          <Col md={{ span: 6 }}>
            <div className="font-semibold">Alamat Penagihan:</div>
            <div className="italic">{data?.getHeaderPenjualan?.kontak?.alamat_perusahaan}</div>
          </Col>
          <Col md={{ span: 6 }}>
            <Row gutter={16}>
              <Col>
                <div className="font-semibold">Tanggal Mulai Kontrak:</div>
                <div className="font-semibold">NPWP:</div>
                <div className="font-semibold">Syarat Pembayaran:</div>
              </Col>
              <Col>
                <div>{data?.getHeaderPenjualan?.tgl_kontrak_mulai}</div>
                <div>{data?.getHeaderPenjualan?.nomor_npwp}</div>
                <div>{data?.getHeaderPenjualan?.syarat_pembayaran?.nama}</div>
              </Col>
            </Row>
          </Col>
          <Col md={{ span: 6 }}>
            <Row gutter={16}>
              <Col>
                <div className="font-semibold">Tanggal Habis Kontrak:</div>
                <div className="font-semibold">Reference Invoice:</div>
                <div className="font-semibold">Tipe Perusahaan:</div>
              </Col>
              <Col>
                <div>{data?.getHeaderPenjualan?.tgl_kontrak_expired}</div>
                <div>{`Sales Invoice #${data?.getHeaderPenjualan?.id}`}</div>
                <div>{data?.getHeaderPenjualan?.tipe_perusahaan == "false" ? "Negeri" : "Swasta"}</div>
              </Col>
            </Row>
          </Col>
          <Col md={{ span: 6 }}>
            <Row gutter={16}>
              <Col>
                <div className="font-semibold">Nomor Kontrak:</div>
                <div className="font-semibold">Custom Invoice:</div>
              </Col>
              <Col>
                <div>{data?.getHeaderPenjualan?.nomor_kontrak}</div>
                <div>{data?.getHeaderPenjualan?.custom_invoice}</div>
              </Col>
            </Row>
          </Col>
        </Row>

        <div className="mt-6">
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableHead className="bg-sky-300">
                <TableRow>
                  <TableCell style={{ width: 400 }}>Produk</TableCell>
                  <TableCell>Deskripsi</TableCell>
                  <TableCell style={{ width: 300 }}>Harga</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.getHeaderPenjualan?.DetailPenjualan?.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell>{i.produk_name}</TableCell>
                    <TableCell>{i.produk_deskripsi}</TableCell>
                    <TableCell>{`Rp. ${i.produk_harga.toLocaleString()}`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>

              <TableRow>
                <TableCell />
                <TableCell align="right">Subtotal</TableCell>
                <TableCell>{`Rp. ${data?.getHeaderPenjualan?.subtotal?.toLocaleString()}`}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell />
                <TableCell align="right">{`${data?.getHeaderPenjualan?.pajak_nama} (${data?.getHeaderPenjualan?.pajak_persen}%)`}</TableCell>
                <TableCell>{`Rp. ${data?.getHeaderPenjualan?.pajak_hasil?.toLocaleString()}`}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell />
                <TableCell align="right">Total</TableCell>
                <TableCell>{`Rp. ${data?.getHeaderPenjualan?.total?.toLocaleString()}`}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell />
                <TableCell align="right">Sisa Tagihan</TableCell>
                <TableCell>{`Rp. ${data?.getHeaderPenjualan?.sisa_tagihan?.toLocaleString()}`}</TableCell>
              </TableRow>
            </Table>
          </TableContainer>

          <Divider />

          <Row gutter={16} className="mt-12">
            <Col md={{ span: 8 }}></Col>
            <Col md={{ span: 8 }}>
              <div className="flex justify-center">
                <Link href={`/penjualan/terima-pembayaran/${data?.getHeaderPenjualan?.id}`}>
                  <a>
                    <Button type="primary" disabled={data?.getHeaderPenjualan?.sisa_tagihan > 0 ? false : true}>
                      Terima Pembayaran
                    </Button>
                  </a>
                </Link>
              </div>
            </Col>
            <Col md={{ span: 8 }}>
              <div className="flex justify-end space-x-2">
                <Link href={`/penjualan`}>
                  <a>
                    <Button>Kembali</Button>
                  </a>
                </Link>

                <Link href={`/penjualan/update/${data?.getHeaderPenjualan?.id}`}>
                  <a>
                    <Button
                      type="primary"
                      disabled={data?.getHeaderPenjualan?.PenerimaanPembayaran?.length > 0 ? true : false}
                    >
                      Ubah
                    </Button>
                  </a>
                </Link>
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
      <ViewPenjualan />
    </SWRConfig>
  );
}
