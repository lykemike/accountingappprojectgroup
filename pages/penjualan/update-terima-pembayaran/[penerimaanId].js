import React from "react";
import Link from "next/link";
import moment from "moment";
import Router from "next/router";
import useSWR, { SWRConfig } from "swr";
import axios from "../../../libs/axios";
import CardMax from "../../../components/CardMax";
import { authPage } from "../../../middlewares/authorizationPage";

import { Formik, Form as Forms } from "formik";
import {
  Breadcrumb,
  DatePicker,
  Input,
  Button,
  Select,
  InputNumber,
  Form,
  message,
  Row,
  Col,
  Divider,
  Upload,
} from "antd";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material/";
const { Option } = Select;
const { TextArea } = Input;

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

function UpdatePenerimaan() {
  const { data, error } = useSWR(API);

  return (
    <div>
      <div className="mb-2">
        <Breadcrumb>
          <Breadcrumb.Item>Penjualan</Breadcrumb.Item>
          <Breadcrumb.Item>Update Penerimaan Pembayaran</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <CardMax>
        <Formik
          initialValues={{
            id: data?.getPenerimaanPembayaran?.id,
            header_penjualan_id: data?.getHeaderPenjualan?.id,
            setor_ke_id: data?.getPenerimaanPembayaran?.akun_id,
            date: data?.getPenerimaanPembayaran.date,
            timestamp: data?.getPenerimaanPembayaran?.timestamp,
            pajak_id: data?.getPenerimaanPembayaran?.pajak_id,
            pajak_nama: data?.getPenerimaanPembayaran?.pajak_nama,
            pajak_persen: data?.getPenerimaanPembayaran?.pajak_persen,
            presentase_penagihan: data?.getPenerimaanPembayaran?.presentase_penagihan,
            deskripsi: data?.getPenerimaanPembayaran?.deskripsi,
            tagihan_sebelum_pajak: data?.getPenerimaanPembayaran?.tagihan_sebelum_pajak,
            pajak_total: data?.getPenerimaanPembayaran?.pajak_total,
            tagihan_setelah_pajak: data?.getPenerimaanPembayaran?.tagihan_setelah_pajak,
            say: data?.getPenerimaanPembayaran?.say,
            subtotal: data?.getHeaderPenjualan?.subtotal,
            pajak_keluaran_nama: data?.getHeaderPenjualan?.pajak_nama,
            pajak_keluaran_presentase_aktif: data?.getHeaderPenjualan?.pajak_persen,
            pajak_keluaran_total: data?.getPenerimaanPembayaran?.pajak_keluaran_total,
          }}
          onSubmit={async (values) => {
            console.log(values);
            axios
              .post("/penjualan/update-penerimaan/" + values.id, values)
              .then(function (response) {
                message.success(response.data.message);
                Router.push(`/penjualan/view-terima-pembayaran/` + response.data.penerimaanId);
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
                    <Form.Item label="Pelanggan">
                      <Select
                        showSearch
                        optionFilterProp="children"
                        placeholder="Select..."
                        style={{ width: "100%" }}
                        size="middle"
                        disabled
                        value={data?.getHeaderPenjualan?.kontak?.nama_perusahaan}
                      />
                    </Form.Item>
                  </Form>
                </Col>
                <Col md={{ span: 6 }}>
                  <Form layout="vertical">
                    <Form.Item label="Setor Ke">
                      <Select
                        showSearch
                        optionFilterProp="children"
                        placeholder="Select..."
                        style={{ width: "100%" }}
                        size="middle"
                        value={values.setor_ke_id}
                        onChange={(e) => setFieldValue((values.setor_ke_id = e))}
                      >
                        {data?.getAkunSetor?.map((i) => (
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
                    <Form.Item label="Tanggal Pembayaran">
                      <DatePicker
                        style={{ width: "100%" }}
                        format={"YYYY/MM/DD"}
                        value={moment(values.date)}
                        onChange={(e) => {
                          setFieldValue((values.date = moment(e).format("YYYY/MM/DD HH:mm")));
                        }}
                      />
                    </Form.Item>
                  </Form>
                </Col>

                <Col md={{ span: 6 }}>
                  <Form layout="vertical">
                    <Form.Item label="Nomor Kontrak">
                      <Input
                        size="middle"
                        disabled
                        placeholder="Auto"
                        value={data?.getHeaderPenjualan?.nomor_kontrak}
                      />
                    </Form.Item>
                  </Form>
                </Col>
                <Col md={{ span: 6 }}>
                  <Form layout="vertical">
                    <Form.Item label="Custom Invoice">
                      <Input
                        size="middle"
                        disabled
                        placeholder="Auto"
                        value={data?.getHeaderPenjualan?.custom_invoice}
                      />
                    </Form.Item>
                  </Form>
                </Col>
              </Row>

              <Divider />

              <div className="mt-8 card">
                <TableContainer component={Paper}>
                  <Table size="small" aria-label="a dense table">
                    <TableHead className="bg-sky-300">
                      <TableRow>
                        <TableCell style={{ width: 250 }}>Nomor</TableCell>
                        <TableCell>Deskripsi</TableCell>
                        <TableCell>Subtotal</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Sisa Tagihan</TableCell>
                        <TableCell style={{ width: 250 }}>Pajak Masukan</TableCell>
                        <TableCell style={{ width: 130 }}>Presentase %</TableCell>
                        <TableCell style={{ width: 200 }}>Jumlah</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>{`Sales Invoice #${values.id}`}</TableCell>
                        <TableCell>
                          <TextArea
                            showCount
                            maxLength={200}
                            autoSize={{
                              minRows: 2,
                            }}
                            value={values.deskripsi}
                            onChange={(e) => setFieldValue((values.deskripsi = e.target.value))}
                          />
                        </TableCell>
                        <TableCell>{`Rp. ${data?.getHeaderPenjualan?.subtotal?.toLocaleString()}`}</TableCell>
                        <TableCell>{`Rp. ${data?.getHeaderPenjualan?.total?.toLocaleString()}`}</TableCell>
                        <TableCell>{`Rp. ${data?.getHeaderPenjualan?.sisa_tagihan?.toLocaleString()}`}</TableCell>
                        <TableCell>
                          <Select
                            showSearch
                            optionFilterProp="children"
                            placeholder="Select..."
                            style={{ width: "100%" }}
                            size="middle"
                            value={values.pajak_id}
                            onChange={(value, event) => {
                              setFieldValue((values.pajak_id = event.otherVals.id));
                              setFieldValue((values.pajak_nama = event.otherVals.nama));
                              setFieldValue((values.pajak_persen = event.otherVals.presentase_aktif));

                              let tagihan_sebelum_pajak = values.subtotal * (values.presentase_penagihan / 100);
                              setFieldValue((values.tagihan_sebelum_pajak = tagihan_sebelum_pajak));

                              let total_pajak = tagihan_sebelum_pajak * (event.otherVals.presentase_aktif / 100);
                              setFieldValue((values.pajak_total = total_pajak));

                              let total_pajak_keluaran =
                                tagihan_sebelum_pajak * (values.pajak_keluaran_presentase_aktif / 100);
                              setFieldValue((values.pajak_keluaran_total = total_pajak_keluaran));

                              let tagihan_setelah_pajak = tagihan_sebelum_pajak + total_pajak_keluaran;
                              setFieldValue((values.tagihan_setelah_pajak = tagihan_setelah_pajak));
                            }}
                          >
                            {data?.getPajak?.map((i) => (
                              <Option value={i.id} otherVals={i}>
                                {i.nama} ({i.presentase_aktif}%)
                              </Option>
                            ))}
                          </Select>
                        </TableCell>
                        <TableCell>
                          <InputNumber
                            style={{ width: "100%" }}
                            defaultValue={0}
                            min={0}
                            max={100}
                            formatter={(value) => `${value}%`}
                            parser={(value) => value.replace("%", "")}
                            value={values.presentase_penagihan}
                            onChange={(e) => {
                              let persen = e;
                              setFieldValue((values.presentase_penagihan = persen));

                              let tagihan_sebelum_pajak = values.subtotal * (e / 100);
                              setFieldValue((values.tagihan_sebelum_pajak = tagihan_sebelum_pajak));

                              let total_pajak = tagihan_sebelum_pajak * (values.pajak_persen / 100);
                              setFieldValue((values.pajak_total = total_pajak));

                              let total_pajak_keluaran =
                                tagihan_sebelum_pajak * (values.pajak_keluaran_presentase_aktif / 100);
                              setFieldValue((values.pajak_keluaran_total = total_pajak_keluaran));

                              let tagihan_setelah_pajak = tagihan_sebelum_pajak + total_pajak_keluaran;
                              setFieldValue((values.tagihan_setelah_pajak = tagihan_setelah_pajak));
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <InputNumber
                            disabled
                            value={values.tagihan_sebelum_pajak}
                            style={{ width: "100%" }}
                            defaultValue={1000}
                            formatter={(value) => `Rp. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            parser={(value) => value.replace(/\Rp.\s?|(,*)/g, "")}
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>Jumlah Tagihan Sebelum Pajak</TableCell>
                        <TableCell>{`Rp. ${values.tagihan_sebelum_pajak.toLocaleString()}`}</TableCell>
                        <TableCell />
                        <TableCell />
                        <TableCell />
                        <TableCell />
                        <TableCell />
                        <TableCell />
                      </TableRow>

                      <TableRow>
                        <TableCell>{`${values.pajak_keluaran_nama} (${values.pajak_keluaran_presentase_aktif}%)`}</TableCell>
                        <TableCell>{`Rp. ${values.pajak_keluaran_total.toLocaleString()}`}</TableCell>
                        <TableCell />
                        <TableCell />
                        <TableCell />
                        <TableCell />
                        <TableCell />
                        <TableCell />
                      </TableRow>

                      <TableRow>
                        <TableCell>Jumlah Tagihan Setelah Pajak</TableCell>
                        <TableCell>{`Rp. ${values.tagihan_setelah_pajak.toLocaleString()}`}</TableCell>
                        <TableCell />
                        <TableCell />
                        <TableCell />
                        <TableCell />
                        <TableCell />
                        <TableCell />
                      </TableRow>

                      <TableRow>
                        <TableCell>Terbilang</TableCell>
                        <TableCell>
                          <TextArea
                            showCount
                            maxLength={200}
                            autoSize={{
                              minRows: 2,
                            }}
                            value={values.say}
                            onChange={(e) => setFieldValue((values.say = e.target.value))}
                          />
                        </TableCell>
                        <TableCell />
                        <TableCell />
                        <TableCell />
                        <TableCell />
                        <TableCell align="right">Total</TableCell>
                        <TableCell>{`Rp. ${values.tagihan_setelah_pajak.toLocaleString()}`}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              <Divider />

              <div class="flex justify-end space-x-2 mt-8">
                <Link href="/penjualan">
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
      <UpdatePenerimaan />
    </SWRConfig>
  );
}
