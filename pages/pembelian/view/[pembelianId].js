import React from "react";
import Link from "next/link";
import useSWR, { SWRConfig } from "swr";
import axios from "../../../libs/axios";
import CardMax from "../../../components/CardMax";
import { authPage } from "../../../middlewares/authorizationPage";
import { Breadcrumb, Button, Divider, Row, Col } from "antd";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material/";

const fetcher = (url) => axios.get(url).then((response) => response.data);
const API = "/pembelian/read-pembelian/";

export async function getServerSideProps(context) {
  const { token } = await authPage(context);
  const { pembelianId } = context.params;
  const pembelianInfo = await fetcher(API + pembelianId);

  return {
    props: {
      fallback: {
        [API]: pembelianInfo,
      },
    },
  };
}

function ViewPembelian() {
  const { data } = useSWR(API);

  return (
    <div>
      <div className="mb-2">
        <Breadcrumb>
          <Breadcrumb.Item>Pembelian</Breadcrumb.Item>
          <Breadcrumb.Item>View Pembelian</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <CardMax>
        <Row gutter={[16, 16]}>
          <Col md={{ span: 6 }}>
            <Row gutter={16}>
              <Col>
                <div className="font-semibold">Supplier:</div>
              </Col>
              <Col>
                <div>{data?.getHeaderPembelian?.kontak?.nama_perusahaan}</div>
              </Col>
            </Row>
          </Col>
          <Col md={{ span: 6 }}>
            <Row gutter={16}>
              <Col>
                <div className="font-semibold">Email:</div>
              </Col>
              <Col>
                <div>{data?.getHeaderPembelian?.kontak?.email}</div>
              </Col>
            </Row>
          </Col>
          <Col md={{ span: 6 }} />
          <Col md={{ span: 6 }} />
        </Row>

        <Divider />

        <Row gutter={[16, 16]}>
          <Col md={{ span: 6 }}>
            <div className="font-semibold">Alamat Penagihan:</div>
            <div className="italic">{data?.getHeaderPembelian?.kontak?.alamat_perusahaan}</div>
          </Col>
          <Col md={{ span: 6 }}>
            <Row gutter={16}>
              <Col>
                <div className="font-semibold">Tanggal Transaksi:</div>
                <div className="font-semibold">Tanggal Jatuh Tempo:</div>
              </Col>
              <Col>
                <div>{data?.getHeaderPembelian?.tgl_transaksi}</div>
                <div>{data?.getHeaderPembelian?.tgl_jatuh_tempo}</div>
              </Col>
            </Row>
          </Col>
          <Col md={{ span: 6 }}>
            <Row gutter={16}>
              <Col>
                <div className="font-semibold">No. Transaksi:</div>
                <div className="font-semibold">No. Referensi:</div>
              </Col>
              <Col>
                <div>{`Purhcase Invoice #${data?.getHeaderPembelian?.id}`}</div>
                <div>{data?.getHeaderPembelian?.no_ref_penagihan}</div>
              </Col>
            </Row>
          </Col>
          <Col md={{ span: 6 }}>
            <Row gutter={16}>
              <Col>
                <div className="font-semibold">Syarat Pembayaran:</div>
              </Col>
              <Col>
                <div>{data?.getHeaderPembelian?.syarat_pembayaran?.nama}</div>
              </Col>
            </Row>
          </Col>
        </Row>

        <div className="mt-6">
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableHead className="bg-sky-300">
                <TableRow>
                  <TableCell style={{ width: 400 }}>Akun Biaya</TableCell>
                  <TableCell>Deskripsi</TableCell>
                  <TableCell style={{ width: 300 }}>Kuantitas</TableCell>
                  <TableCell>Harga Satuan</TableCell>
                  <TableCell>Diskon</TableCell>
                  <TableCell>Jumlah</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.getHeaderPembelian?.DetailPembelian?.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell>{`${i.akun_pembelian.kode_akun} - ${i.akun_pembelian.nama_akun}`}</TableCell>
                    <TableCell>{i.deskripsi}</TableCell>
                    <TableCell>{i.kuantitas}</TableCell>
                    <TableCell>{`Rp. ${i.jumlah.toLocaleString()}`}</TableCell>
                    <TableCell>{i.diskon}%</TableCell>
                    <TableCell>{`Rp. ${i.jumlah.toLocaleString()}`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>

              <TableRow>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell align="right">Subtotal</TableCell>
                <TableCell>{`Rp. ${data?.getHeaderPembelian?.subtotal?.toLocaleString()}`}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell align="right">Diskon</TableCell>
                <TableCell>{`Rp. ${data?.getHeaderPembelian?.total_diskon?.toLocaleString()}`}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell align="right">{`${data?.getHeaderPembelian?.pajak?.nama} (${data?.getHeaderPembelian?.pajak?.presentase_aktif}%)`}</TableCell>
                <TableCell>{`Rp. ${data?.getHeaderPembelian?.total_pajak?.toLocaleString()}`}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell align="right">Sisa Tagihan</TableCell>
                <TableCell>{`Rp. ${data?.getHeaderPembelian?.sisa_tagihan?.toLocaleString()}`}</TableCell>
              </TableRow>
            </Table>
          </TableContainer>

          <Divider />

          <Row gutter={16} className="mt-12">
            <Col md={{ span: 8 }}></Col>
            <Col md={{ span: 8 }}>
              <div className="flex justify-center">
                <Link href={`/pembelian/pengiriman-pembayaran/${data?.getHeaderPembelian?.id}`}>
                  <a>
                    <Button disabled={data?.getHeaderPembelian?.sisa_tagihan > 0 ? false : true} type="primary">
                      Kirim Pembayaran
                    </Button>
                  </a>
                </Link>
              </div>
            </Col>
            <Col md={{ span: 8 }}>
              <div className="flex justify-end space-x-2">
                <Link href={`/pembelian`}>
                  <a>
                    <Button>Kembali</Button>
                  </a>
                </Link>

                <Link href={`/pembelian/update/${data?.getHeaderPembelian?.id}`}>
                  <a>
                    <Button
                      disabled={data.getHeaderPembelian?.PengirimanBayaran?.length > 0 ? true : false}
                      type="primary"
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
      <ViewPembelian />
    </SWRConfig>
  );
}
