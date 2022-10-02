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

function UpdatePengirimanPembayaran() {
  const { data, error } = useSWR(API);

  return (
    <div>
      <div className="mb-2">
        <Breadcrumb>
          <Breadcrumb.Item>Pembelian</Breadcrumb.Item>
          <Breadcrumb.Item>Update Pengiriman Pembayaran</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <CardMax>
        <Formik
          initialValues={{
            id: data?.newPengirimanArray[0]?.id,
            header_pembelian_id: data?.newPengirimanArray[0]?.header_pembelian_id,
            kontak_id: data?.pengirimanPembayaran?.header_pembelian?.kontak_id,
            deskripsi: data?.newPengirimanArray[0]?.deskripsi,
            kontak_name: data?.newPengirimanArray[0]?.nama_supplier,
            akun_id: data?.pengirimanPembayaran?.akun_id,
            old_akun_id: data?.pengirimanPembayaran?.akun_id,
            cara_pembayaran_id: data?.pengirimanPembayaran?.cara_pembayaran_id,
            tgl_transaksi: data?.pengirimanPembayaran?.tgl_pembayaran,
            jumlah: data?.newPengirimanArray[0]?.jumlah,
            old_jumlah: data?.newPengirimanArray[0]?.jumlah,
          }}
          onSubmit={async (values) => {
            console.log(values);
            axios
              .put("/pembelian/update-pengiriman/" + values.id, values)
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
                        value={values.kontak_name}
                        disabled
                      />
                    </Form.Item>
                  </Form>
                </Col>
                <Col md={{ span: 6 }}>
                  <Form layout="vertical">
                    <Form.Item label="Bayar Dari" required>
                      <Select
                        value={values.akun_id}
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
                        value={moment(values.tgl_transaksi)}
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
                        value={values.cara_pembayaran_id}
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
                      <Input size="middle" disabled placeholder="Auto" value={`Pengiriman Pembayaran #${values.id}`} />
                    </Form.Item>
                  </Form>
                </Col>
                <Col md={{ span: 6 }}>
                  <Form layout="vertical">
                    <Form.Item label="No. Referensi Penagihan">
                      <Input
                        size="middle"
                        disabled
                        placeholder="Auto"
                        value={data?.pengirimanPembayaran?.header_pembelian?.no_ref_penagihan}
                      />
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
                        <TableCell>{`Purchase Invoice #${values.header_pembelian_id}`}</TableCell>
                        <TableCell>
                          <TextArea
                            value={values.deskripsi}
                            showCount
                            maxLength={200}
                            autoSize={{
                              minRows: 2,
                            }}
                            onChange={(e) => setFieldValue((values.deskripsi = e.target.value))}
                          />
                        </TableCell>
                        <TableCell>{data?.newPengirimanArray[0]?.tgl_jatuh_tempo}</TableCell>
                        <TableCell>{`Rp. ${data?.newPengirimanArray[0]?.sisa_tagihan.toLocaleString()}`}</TableCell>
                        <TableCell>
                          <InputNumber
                            value={values.jumlah}
                            style={{ width: "100%" }}
                            formatter={(value) => `Rp. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            parser={(value) => value.replace(/\Rp.\s?|(,*)/g, "")}
                            onChange={(e) => {
                              setFieldValue((values.jumlah = e));
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

                <Button type="primary" onClick={handleSubmit}>
                  Update
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
      <UpdatePengirimanPembayaran />
    </SWRConfig>
  );
}
