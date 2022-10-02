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
const API = "/penjualan/read-penerimaan/";

export async function getServerSideProps(context) {
  const { token } = await authPage(context);
  const { penerimaanId } = context.params;
  const penerimaanInfo = await fetcher(API + penerimaanId);

  return {
    props: {
      fallback: {
        [API]: penerimaanInfo,
      },
    },
  };
}

function ViewPenerimaan() {
  const { data } = useSWR(API);

  return (
    <div>
      <div className="mb-2">
        <Breadcrumb>
          <Breadcrumb.Item>Penjualan</Breadcrumb.Item>
          <Breadcrumb.Item>View Penerimaan Pembayaran</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <CardMax>
        <Descriptions bordered>
          <Descriptions.Item label={<span className="font-semibold">Pelanggan</span>} span={1}>
            {data?.getHeaderPenjualan?.kontak?.nama_perusahaan}
          </Descriptions.Item>

          <Descriptions.Item label={<span className="font-semibold">Setor Ke</span>} span={2}>
            {`${data?.getPenerimaanPembayaran?.akun?.kode_akun} - ${data?.getPenerimaanPembayaran?.akun?.nama_akun}`}
          </Descriptions.Item>

          <Descriptions.Item label={<span className="font-semibold">Tanggal Pembayaran</span>} span={1}>
            {moment(data?.getPenerimaanPembayaran?.date).format("DD MMMM, YYYY")}
          </Descriptions.Item>

          <Descriptions.Item label={<span className="font-semibold">Nomor Kontrak</span>} span={1}>
            {data?.getHeaderPenjualan?.nomor_kontrak}
          </Descriptions.Item>
          <Descriptions.Item label={<span className="font-semibold">Custom Invoice</span>} span={1}>
            {data?.getHeaderPenjualan?.custom_invoice}
          </Descriptions.Item>
          <Descriptions.Item label={<span className="font-semibold">Tipe Perusahaan</span>} span={1}>
            {data?.getHeaderPenjualan?.tipe_perusahaan == "false" ? <>Negeri</> : <>Swasta</>}
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
                  <TableCell width={200}>Total</TableCell>
                  <TableCell width={200}>Sisa Tagihan</TableCell>
                  <TableCell width={300}>Presentase Penagihan %</TableCell>
                  <TableCell width={200}>Jumlah</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{`Sales Invoice #${data?.getHeaderPenjualan?.id}`}</TableCell>
                  <TableCell>{`${data?.getPenerimaanPembayaran?.deskripsi}`}</TableCell>
                  <TableCell>{`Rp. ${data?.getHeaderPenjualan?.total?.toLocaleString()}`}</TableCell>
                  <TableCell>{`Rp. ${data?.getHeaderPenjualan?.sisa_tagihan?.toLocaleString()}`}</TableCell>
                  <TableCell>{`${data?.getPenerimaanPembayaran?.presentase_penagihan}%`}</TableCell>
                  <TableCell>{`Rp. ${data?.getPenerimaanPembayaran?.tagihan_sebelum_pajak?.toLocaleString()}`}</TableCell>
                </TableRow>
              </TableBody>

              <TableRow>
                <TableCell align="right">{`Jumlah Tagihan Sebelum ${data?.getHeaderPenjualan?.pajak_nama} (${data?.getHeaderPenjualan?.pajak_persen}%)`}</TableCell>
                <TableCell>{`Rp. ${data?.getPenerimaanPembayaran?.tagihan_sebelum_pajak?.toLocaleString()}`}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell align="right">{`Nominal ${data?.getHeaderPenjualan?.pajak_nama} (${data?.getHeaderPenjualan?.pajak_persen}%)`}</TableCell>
                <TableCell>{`Rp. ${data?.getPenerimaanPembayaran?.pajak_keluaran_total?.toLocaleString()}`}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell align="right">{`Jumlah Tagihan Setelah ${data?.getHeaderPenjualan?.pajak_nama} (${data?.getHeaderPenjualan?.pajak_persen}%)`}</TableCell>
                <TableCell>{`Rp. ${data?.getPenerimaanPembayaran?.tagihan_setelah_pajak?.toLocaleString()}`}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell align="right">Terbilang</TableCell>
                <TableCell>
                  <span className="font-sans italic">{`${data?.getPenerimaanPembayaran?.say}`}</span>
                </TableCell>
              </TableRow>
            </Table>
          </TableContainer>

          <Divider />
          <Row>
            <Col span={10}>
              <Collapse>
                <Panel header="Journal" key="1">
                  <TableContainer component={Paper}>
                    <Table size="small" aria-label="a dense table">
                      <TableHead className="bg-sky-300">
                        <TableRow>
                          <TableCell>Nama Akun</TableCell>
                          <TableCell>Debit</TableCell>
                          <TableCell>Kredit</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data?.getPenerimaanPembayaran?.JurnalPenerimaanPembayaran?.map((i, index) => (
                          <TableRow key={index}>
                            <TableCell>{i.akun.kode_akun + " - " + i.akun.nama_akun}</TableCell>
                            <TableCell>
                              {i.tipe_saldo == "Debit"
                                ? "Rp. " + i.nominal.toLocaleString({ minimumFractionDigits: 0 })
                                : null}
                            </TableCell>
                            <TableCell>
                              {i.tipe_saldo == "Kredit"
                                ? "Rp. " + i.nominal.toLocaleString({ minimumFractionDigits: 0 })
                                : null}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Panel>
              </Collapse>
            </Col>
          </Row>
          <Divider />

          <Row gutter={16} className="mt-12">
            <Col md={{ span: 8 }} />
            <Col md={{ span: 8 }} />
            <Col md={{ span: 8 }}>
              <div className="flex justify-end space-x-2 ">
                <Link href={`/penjualan`}>
                  <a>
                    <Button>Kembali</Button>
                  </a>
                </Link>

                <Link href={`/penjualan/update-terima-pembayaran/${data?.getPenerimaanPembayaran?.id}`}>
                  <a>
                    <Button disabled={data?.getPenerimaanPembayaran?.status == "Done" ? true : false} type="primary">
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
      <ViewPenerimaan />
    </SWRConfig>
  );
}
