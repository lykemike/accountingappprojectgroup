import React from "react";
import Link from "next/link";
import moment from "moment";
import Router from "next/router";
import useSWR, { SWRConfig } from "swr";
import axios from "../../libs/axios";
import CardMax from "../../components/CardMax";
import { authPage } from "../../middlewares/authorizationPage";

import { Formik, Form as Forms, FieldArray } from "formik";
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
  Switch,
  Upload,
} from "antd";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableFooter } from "@mui/material/";
import { CloseOutlined, InboxOutlined } from "@ant-design/icons";
const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

const fetcher = (url) => axios.get(url).then((response) => response.data);
const API = "/penjualan/get-info-penjualan";

export async function getServerSideProps(context) {
  const { token } = await authPage(context);
  const penjualanInfo = await fetcher(API);

  return {
    props: {
      fallback: {
        [API]: penjualanInfo,
      },
    },
  };
}

function AddPenjualan() {
  const { data, error } = useSWR(API);

  return (
    <div>
      <div className="mb-2">
        <Breadcrumb>
          <Breadcrumb.Item>Penjualan</Breadcrumb.Item>
          <Breadcrumb.Item>Add Penjualan</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <CardMax>
        <Formik
          initialValues={{
            kontak_id: "",
            nama_perusahaan: "",
            email: "",
            alamat_penagihan: "",
            syarat_pembayaran_id: "",
            syarat_pembayaran_nama: "",
            nomor_npwp: "",
            nomor_kontrak: "",
            tgl_kontrak_mulai: "",
            tgl_kontrak_expired: "",
            tipe_perusahaan: false,
            pesan: "",
            file_attachment: [],
            subtotal: 0,
            pajak_id: "",
            pajak_nama: "",
            pajak_persen: 0,
            pajak_hasil: 0,
            total: 0,
            sisa_tagihan: 0,
            detail: [
              {
                produk_id: "",
                produk_name: "",
                produk_deskripsi: "",
                produk_harga: 0,
              },
            ],
          }}
          onSubmit={async (values) => {
            let formData = new FormData();

            for (var key in values) {
              if (key == "detail") {
                formData.append(`${key}`, JSON.stringify(values[key]));
              } else {
                formData.append(`${key}`, `${values[key]}`);
              }
            }

            if (values?.file_attachment?.fileList?.length > 0) {
              formData.append("file", values.file_attachment.fileList[0]?.originFileObj);
            }

            axios
              .post("/penjualan/create-penjualan", formData)
              .then(function (response) {
                message.success(response.data.message);
                Router.push(`/penjualan/view/` + response.data.penjualanId);
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
                        onChange={(value, event) => {
                          setFieldValue((values.kontak_id = event.otherVals.id));
                          setFieldValue((values.nama_perusahaan = event.otherVals.nama_perusahaan));
                          setFieldValue((values.email = event.otherVals.email));
                          setFieldValue((values.alamat_penagihan = event.otherVals.alamat_perusahaan));
                          setFieldValue((values.syarat_pembayaran_id = event.otherVals.syarat_pembayaran_id));
                          setFieldValue((values.syarat_pembayaran_nama = event.otherVals.syarat_pembayaran_nama));
                          setFieldValue((values.nomor_npwp = event.otherVals.nomor_npwp));
                          setFieldValue((values.syarat_pembayaran_id = event.otherVals.syarat_pembayaran_id));
                        }}
                      >
                        {data?.newKontaksArray?.map((i) => (
                          <Option value={i.id} otherVals={i}>
                            {i.nama_perusahaan}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Form>
                </Col>
                <Col md={{ span: 6 }}>
                  <Form layout="vertical">
                    <Form.Item label="Email">
                      <Input size="middle" disabled placeholder="Auto" value={values.email} />
                    </Form.Item>
                  </Form>
                </Col>
              </Row>

              <Divider />
              <Row gutter={16}>
                <Col md={{ span: 6 }}>
                  <Form layout="vertical">
                    <Form.Item label="Alamat Penagihan">
                      <TextArea
                        disabled
                        value={values.alamat_penagihan}
                        placeholder="Auto"
                        showCount
                        maxLength={200}
                        autoSize={{
                          minRows: 5,
                        }}
                      />
                    </Form.Item>
                  </Form>
                </Col>
                <Col md={{ span: 6 }}>
                  <Form layout="vertical">
                    <Form.Item label="Nomor Kontrak">
                      <Input size="middle" onChange={(e) => setFieldValue((values.nomor_kontrak = e.target.value))} />
                    </Form.Item>

                    <Form.Item label="No. Transaksi">
                      <Input size="middle" disabled placeholder="Auto" />
                    </Form.Item>
                  </Form>
                </Col>

                <Col md={{ span: 6 }}>
                  <Form layout="vertical">
                    <Form.Item label="Tanggal Kontrak Mulai">
                      <DatePicker
                        style={{ width: "100%" }}
                        format={"YYYY/MM/DD"}
                        onChange={(e) => {
                          setFieldValue((values.tgl_kontrak_mulai = moment(e).format("YYYY/MM/DD HH:mm")));
                        }}
                      />
                    </Form.Item>
                    <Form.Item label="Syarat Pembayaran">
                      <Select
                        value={values.syarat_pembayaran_id}
                        showSearch
                        optionFilterProp="children"
                        placeholder="Select..."
                        style={{ width: "100%" }}
                        size="middle"
                        disabled
                      >
                        {data?.getSyaratPembayaran?.map((i) => (
                          <Option value={i.id}>{i.nama}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Form>
                </Col>

                <Col md={{ span: 6 }}>
                  <Form layout="vertical">
                    <Form.Item label="Tanggal Kontrak Habis">
                      <DatePicker
                        style={{ width: "100%" }}
                        format={"YYYY/MM/DD"}
                        onChange={(e) => {
                          setFieldValue((values.tgl_kontrak_expired = moment(e).format("YYYY/MM/DD")));
                        }}
                      />
                    </Form.Item>
                    <Form.Item label="NPWP">
                      <Input size="middle" disabled placeholder="Auto" value={values.nomor_npwp} />
                    </Form.Item>
                  </Form>
                </Col>
              </Row>

              <Divider />

              <div className="flex justify-end mt-4">
                <Switch
                  checkedChildren="Swasta"
                  unCheckedChildren="Negara"
                  onChange={(e) => {
                    if (e == false) {
                      setFieldValue((values.tipe_perusahaan = false));

                      const subtotal = values.detail.reduce((a, b) => (a = a + b.produk_harga), 0);
                      setFieldValue((values.subtotal = subtotal));

                      const hasil_pajak = (values.pajak_persen / 100) * subtotal;
                      setFieldValue((values.pajak_hasil = hasil_pajak));

                      const total = subtotal;
                      setFieldValue((values.total = total));

                      setFieldValue((values.sisa_tagihan = total));
                    } else {
                      setFieldValue((values.tipe_perusahaan = true));

                      const subtotal = values.detail.reduce((a, b) => (a = a + b.produk_harga), 0);
                      setFieldValue((values.subtotal = subtotal));

                      const hasil_pajak = (values.pajak_persen / 100) * subtotal;
                      setFieldValue((values.pajak_hasil = hasil_pajak));

                      const total = subtotal + hasil_pajak;
                      setFieldValue((values.total = total));

                      setFieldValue((values.sisa_tagihan = total));
                    }
                  }}
                />
              </div>

              <div className="mt-8 card">
                <TableContainer component={Paper}>
                  <Table size="small" aria-label="a dense table">
                    <TableHead className="bg-sky-300">
                      <TableRow>
                        <TableCell>Produk</TableCell>
                        <TableCell>Deskripsi</TableCell>
                        <TableCell>Harga</TableCell>
                        <TableCell />
                      </TableRow>
                    </TableHead>
                    <TableBody></TableBody>
                    <FieldArray name="detail">
                      {({ insert, remove, push }) => (
                        <TableBody>
                          {values.detail.length > 0 &&
                            values.detail.map((i, index) => (
                              <TableRow key={index}>
                                <TableCell style={{ width: 100, maxWidth: 100 }}>
                                  <Select
                                    showSearch
                                    optionFilterProp="children"
                                    placeholder="Select..."
                                    style={{ width: "100%" }}
                                    size="middle"
                                    onChange={(value, event) => {
                                      if (values.tipe_perusahaan == false) {
                                        setFieldValue((values.detail[index].produk_id = event.otherVals.id));
                                        setFieldValue((values.detail[index].produk_name = event.otherVals.nama));
                                        setFieldValue(
                                          (values.detail[index].produk_deskripsi = event.otherVals.deskripsi)
                                        );
                                        setFieldValue((values.detail[index].produk_harga = event.otherVals.harga));

                                        const subtotal = values.detail.reduce((a, b) => (a = a + b.produk_harga), 0);
                                        setFieldValue((values.subtotal = subtotal));

                                        const hasil_pajak = (values.pajak_persen / 100) * subtotal;
                                        setFieldValue((values.pajak_hasil = hasil_pajak));

                                        const total = subtotal;
                                        setFieldValue((values.total = total));

                                        setFieldValue((values.sisa_tagihan = total));
                                      } else {
                                        setFieldValue((values.detail[index].produk_id = event.otherVals.id));
                                        setFieldValue((values.detail[index].produk_name = event.otherVals.nama));
                                        setFieldValue(
                                          (values.detail[index].produk_deskripsi = event.otherVals.deskripsi)
                                        );
                                        setFieldValue((values.detail[index].produk_harga = event.otherVals.harga));

                                        const subtotal = values.detail.reduce((a, b) => (a = a + b.produk_harga), 0);
                                        setFieldValue((values.subtotal = subtotal));

                                        const hasil_pajak = (values.pajak_persen / 100) * subtotal;
                                        setFieldValue((values.pajak_hasil = hasil_pajak));

                                        const total = subtotal + hasil_pajak;
                                        setFieldValue((values.total = total));

                                        setFieldValue((values.sisa_tagihan = total));
                                      }
                                    }}
                                  >
                                    {data?.newProduksArray?.map((i) => (
                                      <Option value={i.id} otherVals={i}>
                                        {i.nama}
                                      </Option>
                                    ))}
                                  </Select>
                                </TableCell>

                                <TableCell style={{ width: 300 }}>
                                  <Input
                                    style={{ width: "100%" }}
                                    size="middle"
                                    disabled
                                    value={values.detail[index].produk_deskripsi}
                                  />
                                </TableCell>

                                <TableCell
                                  style={{
                                    width: 100,
                                  }}
                                >
                                  <InputNumber
                                    formatter={(value) => `Rp. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    parser={(value) => value.replace(/\Rp.\s?|(,*)/g, "")}
                                    style={{ width: "100%" }}
                                    size="middle"
                                    disabled
                                    value={values.detail[index].produk_harga}
                                  />
                                </TableCell>
                                <TableCell
                                  style={{
                                    minWidth: 50,
                                    width: 50,
                                  }}
                                >
                                  <Button
                                    type="primary"
                                    shape="circle"
                                    icon={<CloseOutlined />}
                                    size="small"
                                    onClick={() => remove(index)}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}

                          <Button
                            className="m-4"
                            type="primary"
                            onClick={() =>
                              push({
                                produk_id: "",
                                produk_name: "",
                                produk_deskripsi: "",
                                produk_harga: 0,
                              })
                            }
                          >
                            Tambah data
                          </Button>
                        </TableBody>
                      )}
                    </FieldArray>
                  </Table>
                </TableContainer>
              </div>

              <Divider />

              <Row gutter={16}>
                <Col md={{ span: 6 }}>
                  <Form layout="vertical">
                    <Form.Item label="Pesan">
                      <TextArea
                        showCount
                        maxLength={100}
                        autoSize={{
                          minRows: 5,
                        }}
                        onChange={(e) => setFieldValue((values.pesan = e.target.value))}
                      />
                    </Form.Item>
                    <Form.Item label="File Attachment">
                      <Dragger maxCount={1} onChange={(e) => setFieldValue((values.file_attachment = e))}>
                        <p className="ant-upload-drag-icon">
                          <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                      </Dragger>
                    </Form.Item>
                  </Form>
                </Col>
                <Col md={{ span: 6 }} />
                <Col md={{ span: 6 }} />
                <Col md={{ span: 6 }}>
                  <Row gutter={[16, 16]}>
                    <Col md={{ span: 14 }}>
                      <div className="space-y-2 font-semibold">
                        <div>Subtotal</div>
                        <div>Pajak Keluaran</div>
                        <div>
                          <Select
                            showSearch
                            optionFilterProp="children"
                            placeholder="Select..."
                            style={{ width: "100%" }}
                            size="small"
                            onChange={(value, event) => {
                              if (values.tipe_perusahaan == false) {
                                setFieldValue((values.pajak_id = event.otherVals.id));
                                setFieldValue((values.pajak_nama = event.otherVals.nama));
                                setFieldValue((values.pajak_persen = event.otherVals.persen));

                                const hasil_pajak = (event.otherVals.persen / 100) * values.subtotal;
                                setFieldValue((values.pajak_hasil = hasil_pajak));

                                const total = values.subtotal;
                                setFieldValue((values.total = total));
                                setFieldValue((values.sisa_tagihan = total));
                              } else {
                                setFieldValue((values.pajak_id = event.otherVals.id));
                                setFieldValue((values.pajak_nama = event.otherVals.nama));
                                setFieldValue((values.pajak_persen = event.otherVals.persen));

                                const hasil_pajak = (event.otherVals.persen / 100) * values.subtotal;
                                setFieldValue((values.pajak_hasil = hasil_pajak));

                                const total = values.subtotal + hasil_pajak;
                                setFieldValue((values.total = total));
                                setFieldValue((values.sisa_tagihan = total));
                              }
                            }}
                          >
                            {data?.newPajaksArray?.map((i) => (
                              <Option value={i.id} otherVals={i}>
                                {i.nama} - {i.persen}%
                              </Option>
                            ))}
                          </Select>
                        </div>
                        <div>Total</div>
                      </div>
                    </Col>
                    <Col md={{ span: 10 }}>
                      <div className="space-y-2">
                        <div>Rp. {values.subtotal.toLocaleString()}</div>
                        <div className="text-white">.</div>
                        <div>Rp. {values.pajak_hasil.toLocaleString()}</div>
                        <div>Rp. {values.total.toLocaleString()}</div>
                      </div>
                    </Col>
                  </Row>

                  <Divider />

                  <Row gutter={[16, 16]}>
                    <Col md={{ span: 14 }}>
                      <div className="space-y-2 font-semibold">
                        <div>Sisa Tagihan</div>
                      </div>
                    </Col>
                    <Col md={{ span: 10 }}>
                      <div className="space-y-2">
                        <div>Rp. {values.sisa_tagihan.toLocaleString()}</div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <div class="flex justify-end space-x-2 mt-8">
                <Link href="/jurnal">
                  <a>
                    <Button variant="danger">Batal</Button>
                  </a>
                </Link>

                <Button type="primary" onClick={handleSubmit}>
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
      <AddPenjualan />
    </SWRConfig>
  );
}
