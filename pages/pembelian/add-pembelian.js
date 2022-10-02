import React from "react";
import Link from "next/link";
import moment from "moment";
import Router from "next/router";
import useSWR, { SWRConfig } from "swr";
import axios from "../../libs/axios";
import CardMax from "../../components/CardMax";
import { authPage } from "../../middlewares/authorizationPage";

import { Formik, Form as Forms, FieldArray } from "formik";
import { Breadcrumb, DatePicker, Input, Button, Select, InputNumber, Form, message, Row, Col, Divider, Switch, Upload } from "antd";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableFooter } from "@mui/material/";
import { CloseOutlined, InboxOutlined } from "@ant-design/icons";
const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

const fetcher = (url) => axios.get(url).then((response) => response.data);
const API = "/pembelian/get-info-pembelian";

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

function AddPembelian() {
  const { data, error } = useSWR(API);

  return (
    <div>
      <div className="mb-2">
        <Breadcrumb>
          <Breadcrumb.Item>Pembelian</Breadcrumb.Item>
          <Breadcrumb.Item>Add Pembelian</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <CardMax>
        <Formik
          initialValues={{
            kontak_id: "",
            email: "",
            alamat_perusahaan: "",
            tgl_transaksi: "",
            akun_hutang_id: "",
            tgl_jatuh_tempo: "",
            syarat_pembayaran_id: "",
            no_ref_penagihan: "",
            detail: [
              {
                akun_pembelian_id: "",
                deskripsi: "",
                kuantitas: "",
                harga_satuan: 0,
                diskon: 0,
                diskon_per_baris: 0,
                jumlah: 0,
              },
            ],
            pesan: "",
            file_attachment: [],
            akun_diskon_id: "",
            subtotal: 0,
            total_diskon: 0,
            pajak_id: "",
            pajak_masukan_id: "",
            pajak_persen: 0,
            total_pajak: 0,
            sisa_tagihan: 0,
          }}
          onSubmit={async (values) => {
            console.log(values);
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
              .post("/pembelian/create-pembelian", formData)
              .then(function (response) {
                message.success(response.data.message);
                Router.push(`/pembelian/view/` + response.data.pembelianId);
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
                        onChange={(value, event) => {
                          setFieldValue((values.kontak_id = event.otherVals.id));
                          setFieldValue((values.email = event.otherVals.email));
                          setFieldValue((values.alamat_perusahaan = event.otherVals.alamat_perusahaan));
                          setFieldValue((values.syarat_pembayaran_id = event.otherVals.syarat_pembayaran_id));
                          setFieldValue((values.akun_hutang_id = event.otherVals.akun_hutang_id));
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
                        value={values.alamat_perusahaan}
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
                    <Form.Item label="Nomor Referensi">
                      <Input size="middle" onChange={(e) => setFieldValue((values.no_ref_penagihan = e.target.value))} />
                    </Form.Item>

                    <Form.Item label="No. Transaksi">
                      <Input size="middle" disabled placeholder="Auto" />
                    </Form.Item>
                  </Form>
                </Col>

                <Col md={{ span: 6 }}>
                  <Form layout="vertical">
                    <Form.Item label="Tanggal Transaksi">
                      <DatePicker
                        style={{ width: "100%" }}
                        format={"YYYY/MM/DD"}
                        onChange={(e) => {
                          setFieldValue((values.tgl_transaksi = moment(e).format("YYYY/MM/DD HH:mm")));
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
                    <Form.Item label="Tanggal Jatuh Tempo">
                      <DatePicker
                        style={{ width: "100%" }}
                        format={"YYYY/MM/DD"}
                        onChange={(e) => {
                          setFieldValue((values.tgl_jatuh_tempo = moment(e).format("YYYY/MM/DD")));
                        }}
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
                        <TableCell>Akun Pembelian</TableCell>
                        <TableCell>Deskripsi</TableCell>
                        <TableCell>Kuantitas</TableCell>
                        <TableCell>Harga Satuan</TableCell>
                        <TableCell>Diskon</TableCell>
                        <TableCell>Jumlah</TableCell>
                        <TableCell />
                      </TableRow>
                    </TableHead>

                    <FieldArray name="detail">
                      {({ insert, remove, push }) => (
                        <TableBody>
                          {values.detail.length > 0 &&
                            values.detail.map((i, index) => (
                              <TableRow key={index}>
                                <TableCell style={{ width: 200 }}>
                                  <Select
                                    showSearch
                                    optionFilterProp="children"
                                    placeholder="Select..."
                                    style={{ width: "100%" }}
                                    size="middle"
                                    onChange={(value, event) => {
                                      setFieldValue((values.detail[index].akun_pembelian_id = event.otherVals.id));
                                    }}
                                  >
                                    {data?.newAkunBeliArray?.map((i) => (
                                      <Option value={i.id} otherVals={i}>
                                        {i.akun}
                                      </Option>
                                    ))}
                                  </Select>
                                </TableCell>

                                <TableCell style={{ width: 200 }}>
                                  <Input
                                    style={{ width: "100%" }}
                                    size="middle"
                                    onChange={(e) => {
                                      setFieldValue((values.detail[index].deskripsi = e.target.value));
                                    }}
                                  />
                                </TableCell>

                                <TableCell
                                  style={{
                                    width: 150,
                                  }}
                                >
                                  <InputNumber
                                    min={0}
                                    style={{ width: "100%" }}
                                    size="middle"
                                    onChange={(e) => {
                                      setFieldValue((values.detail[index].kuantitas = e));

                                      const jumlah = e * values.detail[index].harga_satuan;
                                      setFieldValue((values.detail[index].jumlah = jumlah));

                                      const subtotal = values.detail.reduce((a, b) => (a = a + b.jumlah), 0);
                                      setFieldValue((values.subtotal = subtotal));

                                      const diskonPerBaris = (values.detail[index].diskon / 100) * values.detail[index].jumlah;
                                      setFieldValue((values.detail[index].diskon_per_baris = diskonPerBaris));

                                      const totalDiskon = values.detail.reduce((a, b) => (a = a + b.diskon_per_baris), 0);
                                      setFieldValue((values.total_diskon = totalDiskon));

                                      const totalPajak = (values.pajak_persen / 100) * values.subtotal;
                                      setFieldValue((values.total_pajak = totalPajak));

                                      const sisaTagihan = subtotal + totalPajak - totalDiskon;
                                      setFieldValue((values.sisa_tagihan = sisaTagihan));
                                    }}
                                  />
                                </TableCell>

                                <TableCell
                                  style={{
                                    width: 200,
                                  }}
                                >
                                  <InputNumber
                                    formatter={(value) => `Rp. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    parser={(value) => value.replace(/\Rp.\s?|(,*)/g, "")}
                                    style={{ width: "100%" }}
                                    min={0}
                                    size="middle"
                                    onChange={(e) => {
                                      setFieldValue((values.detail[index].harga_satuan = e));

                                      const jumlah = values.detail[index].kuantitas * e;
                                      setFieldValue((values.detail[index].jumlah = jumlah));

                                      const subtotal = values.detail.reduce((a, b) => (a = a + b.jumlah), 0);
                                      setFieldValue((values.subtotal = subtotal));

                                      const diskonPerBaris = (values.detail[index].diskon / 100) * values.detail[index].jumlah;
                                      setFieldValue((values.detail[index].diskon_per_baris = diskonPerBaris));

                                      const totalDiskon = values.detail.reduce((a, b) => (a = a + b.diskon_per_baris), 0);
                                      setFieldValue((values.total_diskon = totalDiskon));

                                      const totalPajak = (values.pajak_persen / 100) * values.subtotal;
                                      setFieldValue((values.total_pajak = totalPajak));

                                      const sisaTagihan = subtotal + totalPajak - totalDiskon;
                                      setFieldValue((values.sisa_tagihan = sisaTagihan));
                                    }}
                                  />
                                </TableCell>

                                <TableCell
                                  style={{
                                    width: 150,
                                  }}
                                >
                                  <InputNumber
                                    style={{ width: "100%" }}
                                    defaultValue={0}
                                    min={0}
                                    max={100}
                                    formatter={(value) => `${value}%`}
                                    parser={(value) => value.replace("%", "")}
                                    onChange={(e) => {
                                      setFieldValue((values.detail[index].diskon = e));

                                      const diskonPerBaris = (e / 100) * values.detail[index].jumlah;
                                      setFieldValue((values.detail[index].diskon_per_baris = diskonPerBaris));

                                      const totalDiskon = values.detail.reduce((a, b) => (a = a + b.diskon_per_baris), 0);
                                      setFieldValue((values.total_diskon = totalDiskon));

                                      const sisaTagihan = values.subtotal + values.total_pajak - totalDiskon;
                                      setFieldValue((values.sisa_tagihan = sisaTagihan));
                                    }}
                                  />
                                </TableCell>

                                <TableCell
                                  style={{
                                    width: 200,
                                  }}
                                >
                                  <InputNumber
                                    formatter={(value) => `Rp. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    parser={(value) => value.replace(/\Rp.\s?|(,*)/g, "")}
                                    style={{ width: "100%" }}
                                    size="middle"
                                    disabled
                                    value={values.detail[index].jumlah}
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
                                akun_pembelian_id: "",
                                // nama_akun_pembelian: "",
                                deskripsi: "",
                                kuantitas: "",
                                harga_satuan: 0,
                                diskon: 0,
                                total: 0,
                                jumlah: 0,
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
                        onChange={(e) => {
                          setFieldValue((values.pesan = e.target.value));
                        }}
                      />
                    </Form.Item>
                    <Form.Item label="File Attachment">
                      <Dragger
                        maxCount={1}
                        onChange={(e) => {
                          setFieldValue((values.file_attachment = e));
                        }}
                      >
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
                        <div>Total Diskon</div>
                        <div>
                          <Select
                            showSearch
                            optionFilterProp="children"
                            placeholder="Select..."
                            style={{ width: "100%" }}
                            onChange={(value, event) => {
                              setFieldValue((values.akun_diskon_id = event.otherVals.id));
                            }}
                          >
                            {data?.newAkunDiskonArray?.map((i) => (
                              <Option value={i.id} otherVals={i}>
                                {i.akun}
                              </Option>
                            ))}
                          </Select>
                        </div>
                        <div>Pajak Masukan</div>
                        <div>
                          <Select
                            showSearch
                            optionFilterProp="children"
                            placeholder="Select..."
                            style={{ width: "100%" }}
                            onChange={(value, event) => {
                              setFieldValue((values.pajak_id = event.otherVals.id));
                              setFieldValue((values.pajak_persen = event.otherVals.persen));
                              setFieldValue((values.pajak_masukan_id = event.otherVals.akun_masukan));

                              const totalPajak = (event.otherVals.persen / 100) * values.subtotal;
                              setFieldValue((values.total_pajak = totalPajak));

                              const sisaTagihan = values.subtotal + totalPajak - values.total_diskon;
                              setFieldValue((values.sisa_tagihan = sisaTagihan));
                            }}
                          >
                            {data?.newPajaksArray?.map((i) => (
                              <Option value={i.id} otherVals={i}>
                                {i.nama} - {i.persen}%
                              </Option>
                            ))}
                          </Select>
                        </div>
                      </div>
                    </Col>
                    <Col md={{ span: 10 }}>
                      <div className="space-y-2">
                        <div>Rp. {values?.subtotal?.toLocaleString()}</div>
                        <div className="text-white">.</div>
                        <div>Rp. {values?.total_diskon?.toLocaleString()}</div>
                        <div className="text-white">.</div>
                        <div>Rp. {values?.total_pajak?.toLocaleString()}</div>
                        {/* <div className="text-white">.</div>
                        <div>Rp. {values?.pajak_hasil?.toLocaleString()}</div>
                        <div>Rp. {values?.total?.toLocaleString()}</div> */}
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
                        <div>Rp. {values?.sisa_tagihan?.toLocaleString()}</div>
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
      <AddPembelian />
    </SWRConfig>
  );
}
