import React from "react";
import Link from "next/link";
import moment from "moment";
import Router from "next/router";
import useSWR, { SWRConfig } from "swr";
import axios from "../../../libs/axios";
import CardMax from "../../../components/CardMax";
import { authPage } from "../../../middlewares/authorizationPage";

import { Formik, Form as Forms } from "formik";
import { Breadcrumb, DatePicker, Input, Button, Select, InputNumber, Form, message, Row, Col, Divider, Upload } from "antd";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material/";
const { Option } = Select;
const { TextArea } = Input;

const fetcher = (url) => axios.get(url).then((response) => response.data);
const API = "/pembelian/read-pembelian/";

export async function getServerSideProps(context) {
  const { token } = await authPage(context);
  const { pengirimanId } = context.params;
  const pembelianInfo = await fetcher(API + pengirimanId);

  return {
    props: {
      fallback: {
        [API]: pembelianInfo,
      },
    },
  };
}

function PengirimanPembayaran() {
  const { data, error } = useSWR(API);
  console.log(data);
  return (
    <div>
      <div className="mb-2">
        <Breadcrumb>
          <Breadcrumb.Item>Pembelian</Breadcrumb.Item>
          <Breadcrumb.Item>Pengiriman Pembayaran</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <CardMax>
        <Formik
          initialValues={{
            id: data?.getHeaderPembelian?.id,
            kontak_id: data?.getHeaderPembelian?.kontak_id,
            akun_id: "",
            cara_pembayaran_id: "",
            tgl_transaksi: "",
            deskripsi: "",
            jumlah: 0,
            limit: "",
            limit_bool: false,
          }}
          onSubmit={async (values) => {
            axios
              .post("/pembelian/create-pengiriman-pembayaran", values)
              .then(function (response) {
                message.success(response.data.message);
                Router.push(`/pembelian/view-pengiriman-pembayaran/` + response.data.pengirimanId);
              })
              .catch(function (error) {
                message.error(error.response.data.message);
              });
          }}
        >
          {({ values, setFieldValue, handleSubmit }) => (
            <Forms noValidate>
              <Row gutter={16}>
                <Col md={{ span: 6 }}>
                  <Form layout="vertical">
                    <Form.Item label="Supplier">
                      <Select
                        showSearch
                        optionFilterProp="children"
                        placeholder="Select..."
                        style={{ width: "100%" }}
                        size="middle"
                        value={data?.getHeaderPembelian?.kontak?.nama_perusahaan}
                        disabled
                      />
                    </Form.Item>
                  </Form>
                </Col>
                <Col md={{ span: 6 }}>
                  <Form layout="vertical">
                    <Form.Item label="Bayar Dari" required>
                      <Select
                        showSearch
                        optionFilterProp="children"
                        placeholder="Select..."
                        style={{ width: "100%" }}
                        size="middle"
                        onChange={(e) => setFieldValue((values.akun_id = e))}
                      >
                        {data?.getAkunBayarDari?.map((i) => (
                          <Option value={i.id} otherVals={i}>
                            {i.kode_akun} - {i.nama_akun}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Form>
                </Col>
              </Row>

              <Divider />
              <Row gutter={16}>
                <Col md={{ span: 6 }}>
                  <Form layout="vertical">
                    <Form.Item label="Tanggal Pembayaran" required>
                      <DatePicker
                        style={{ width: "100%" }}
                        format={"YYYY/MM/DD"}
                        onChange={(e) => {
                          setFieldValue((values.tgl_transaksi = moment(e).format("YYYY/MM/DD HH:mm")));
                        }}
                      />
                    </Form.Item>
                  </Form>
                </Col>
                <Col md={{ span: 6 }}>
                  <Form layout="vertical">
                    <Form.Item label="Cara Pembayaran" required>
                      <Select
                        showSearch
                        optionFilterProp="children"
                        placeholder="Select..."
                        style={{ width: "100%" }}
                        size="middle"
                        onChange={(e) => setFieldValue((values.cara_pembayaran_id = e))}
                      >
                        {data?.getCaraPembayaran?.map((i) => (
                          <Option value={i.id} otherVals={i}>
                            {i.nama}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Form>
                </Col>
                <Col md={{ span: 6 }}>
                  <Form layout="vertical">
                    <Form.Item label="No. Transaksi">
                      <Input size="middle" disabled placeholder="Auto" value={`Purchase Invoice #${data?.getHeaderPembelian?.id}`} />
                    </Form.Item>
                  </Form>
                </Col>
                <Col md={{ span: 6 }}>
                  <Form layout="vertical">
                    <Form.Item label="No. Referensi Penagihan">
                      <Input size="middle" disabled placeholder="Auto" value={data?.getHeaderPembelian?.no_ref_penagihan} />
                    </Form.Item>
                  </Form>
                </Col>
              </Row>

              <Divider />

              <div className="card mt-8">
                <TableContainer component={Paper}>
                  <Table size="small" aria-label="a dense table">
                    <TableHead className="bg-sky-300">
                      <TableRow>
                        <TableCell style={{ width: 200 }}>Nomor</TableCell>
                        <TableCell>Deskripsi</TableCell>
                        <TableCell style={{ width: 200 }}>Tanggal Jatuh Tempo</TableCell>
                        <TableCell style={{ width: 200 }}>Sisa Tagihan</TableCell>
                        <TableCell style={{ width: 300 }}>Jumlah</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>{`Purchase Invoice #${data?.getHeaderPembelian?.id}`}</TableCell>
                        <TableCell>
                          <TextArea
                            showCount
                            maxLength={200}
                            autoSize={{
                              minRows: 2,
                            }}
                            onChange={(e) => setFieldValue((values.deskripsi = e.target.value))}
                          />
                        </TableCell>
                        <TableCell>{data?.getHeaderPembelian?.tgl_transaksi}</TableCell>
                        <TableCell>{`Rp. ${data?.getHeaderPembelian?.sisa_tagihan?.toLocaleString()}`}</TableCell>
                        <TableCell>
                          <InputNumber
                            value={values.tagihan_sebelum_pajak}
                            style={{ width: "100%" }}
                            formatter={(value) => `Rp. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            parser={(value) => value.replace(/\Rp.\s?|(,*)/g, "")}
                            onChange={(e) => {
                              if (e > data?.getHeaderPembelian?.sisa_tagihan) {
                                setFieldValue((values.limit = "jumlah cannot be more than sisa tagihan"));
                                setFieldValue((values.limit_bool = true));
                              } else {
                                setFieldValue((values.limit = null));
                                setFieldValue((values.limit_bool = false));
                                setFieldValue((values.jumlah = e));
                              }
                            }}
                          />
                          <span className="text-xs text-red-500 font-sans">{values.limit}</span>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell />
                        <TableCell />
                        <TableCell />
                        <TableCell align="right">Total</TableCell>
                        <TableCell>{`Rp. ${values.jumlah.toLocaleString()}`}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              <Divider />

              <div class="flex justify-end space-x-2 mt-8">
                <Link href="/pembelian">
                  <a>
                    <Button variant="danger">Batal</Button>
                  </a>
                </Link>

                <Button type="primary" onClick={handleSubmit} disabled={values.limit_bool}>
                  Submit
                </Button>
              </div>
            </Forms>
          )}
        </Formik>
      </CardMax>
    </div>
  );
}

export default function App({ fallback }) {
  return (
    <SWRConfig value={{ fallback }}>
      <PengirimanPembayaran />
    </SWRConfig>
  );
}
