import React from "react";
import Link from "next/link";
import moment from "moment";
import Router from "next/router";
import useSWR, { SWRConfig } from "swr";
import axios from "../../../libs/axios";
import CardMax from "../../../components/CardMax";
import { authPage } from "../../../middlewares/authorizationPage";

import { Formik, Form as Forms, FieldArray } from "formik";
import { Breadcrumb, DatePicker, Input, Button, Select, InputNumber, Form, message } from "antd";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material/";
import { CloseOutlined } from "@ant-design/icons";
const { Option } = Select;

const fetcher = (url) => axios.get(url).then((response) => response.data);
const API = "/jurnal/read-jurnal/";

export async function getServerSideProps(context) {
  const { token } = await authPage(context);
  const { jurnalId } = context.params;
  const jurnalInfo = await fetcher(API + jurnalId);

  return {
    props: {
      fallback: {
        [API]: jurnalInfo,
      },
    },
  };
}

function FormEdit() {
  const { data } = useSWR(API);
  console.log(data);

  return (
    <div>
      <div className="mb-2">
        <Breadcrumb>
          <Breadcrumb.Item>Jurnal</Breadcrumb.Item>
          <Breadcrumb.Item>Update Jurnal</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <CardMax>
        <Formik
          initialValues={{
            akun_kasbank: data?.headerJurnal?.akun.id,
            total_debit: data?.headerJurnal?.total_debit,
            total_kredit: data?.headerJurnal?.total_kredit,
            balance: "",
            detail_jurnal: data?.headerJurnal?.DetailJurnal,
          }}
          onSubmit={async (values) => {
            axios
              .post("/jurnal/update-jurnal/" + data?.headerJurnal?.id, values)
              .then(function (response) {
                message.success(response.data.message);
                Router.push(`/jurnal/view/` + response.data.jurnalId);
              })
              .catch(function (error) {
                message.error(error.response.data.message);
              });
          }}
        >
          {(props) => (
            <Forms noValidate>
              <div className="flex space-x-4">
                <Form layout="vertical">
                  <Form.Item style={{ width: 300 }}>
                    Pilih Akun Kas Bank:
                    <Select
                      showSearch
                      optionFilterProp="children"
                      placeholder="Select akun"
                      style={{ minwidth: "100%" }}
                      size="middle"
                      defaultValue={props.values.akun_kasbank}
                      onChange={(e) =>
                        axios
                          .get("/jurnal/get_akunkasbank/" + e)
                          .then(function (response) {
                            message.success(response.data.message);
                            data_akunkasbank.push(response.data.getAkuns);
                            props.setFieldValue((props.values.akun_kasbank = e));
                            props.setFieldValue(
                              (props.values.detail_jurnal[0].sisa_saldo = data_akunkasbank[0].sisa_saldo)
                            );
                          })
                          .catch(function (error) {
                            message.error(error.response.data.message);
                          })
                      }
                    >
                      {data?.getAkunKasBank?.map((i) => (
                        <Option value={i.id}>
                          {i.kode_akun}-{i.nama_akun}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Form>

                <div className="flex justify-end">
                  <div className="flex items-center justify-end"></div>
                </div>
              </div>

              <div className="mt-8 card">
                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                  <TableContainer component={Paper}>
                    <Table stickyHeader size="small" aria-label="a dense table">
                      <TableHead className="bg-gray-300">
                        <TableRow>
                          <TableCell>Tanggal Transaksi</TableCell>
                          <TableCell>Dari / Kepada</TableCell>
                          <TableCell>Nama Akun</TableCell>
                          <TableCell>Deskripsi</TableCell>
                          <TableCell>Debit</TableCell>
                          <TableCell>Kredit</TableCell>
                          <TableCell>Sisa Saldo</TableCell>
                          <TableCell />
                        </TableRow>
                      </TableHead>
                      <FieldArray name="detail_jurnal">
                        {({ insert, remove, push }) => (
                          <TableBody>
                            {props.values.detail_jurnal.length > 0 &&
                              props.values.detail_jurnal.map((i, index) => (
                                <TableRow key={index}>
                                  <TableCell style={{ minWidth: 170 }}>
                                    <DatePicker
                                      placeholder={props.values.detail_jurnal[index].tgl_transaksi}
                                      format={"YYYY/MM/DD"}
                                      onChange={(e) =>
                                        props.setFieldValue(
                                          (props.values.detail_jurnal[index].tgl_transaksi = moment(e._d).format(
                                            "YYYY/MM/DD"
                                          ))
                                        )
                                      }
                                    />
                                  </TableCell>
                                  <TableCell style={{ minWidth: 200 }}>
                                    <Input
                                      defaultValue={props.values.detail_jurnal[index].darikepada}
                                      style={{ width: "100%" }}
                                      size="middle"
                                      onChange={(e) =>
                                        props.setFieldValue(
                                          (props.values.detail_jurnal[index].darikepada = e.target.value)
                                        )
                                      }
                                    />
                                  </TableCell>
                                  <TableCell style={{ minWidth: 300 }}>
                                    <Select
                                      showSearch
                                      optionFilterProp="children"
                                      defaultValue={props.values.detail_jurnal[index].akun_id}
                                      placeholder="Select akun"
                                      style={{ width: "100%" }}
                                      size="middle"
                                      onChange={(value, event) => {
                                        props.setFieldValue(
                                          (props.values.detail_jurnal[index].akun_id = event.otherVals.akun_id)
                                        );
                                        props.setFieldValue(
                                          (props.values.detail_jurnal[index].kategori_id = event.otherVals.kategori_id)
                                        );
                                      }}
                                    >
                                      {data?.newAkunsArray?.map((i) => (
                                        <Option value={i.akun_id} otherVals={i}>
                                          {i.akun}
                                        </Option>
                                      ))}
                                    </Select>
                                  </TableCell>
                                  <TableCell style={{ minWidth: 300 }}>
                                    <Input
                                      defaultValue={props.values.detail_jurnal[index].deskripsi}
                                      style={{ width: "100%" }}
                                      size="middle"
                                      onChange={(e) =>
                                        props.setFieldValue(
                                          (props.values.detail_jurnal[index].deskripsi = e.target.value)
                                        )
                                      }
                                    />
                                  </TableCell>
                                  <TableCell
                                    style={{
                                      minWidth: 200,
                                    }}
                                  >
                                    <InputNumber
                                      defaultValue={props.values.detail_jurnal[index].debit}
                                      formatter={(value) => `Rp. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                      parser={(value) => value.replace(/\Rp.\s?|(,*)/g, "")}
                                      name="debit"
                                      min={0}
                                      size="middle"
                                      style={{ width: "100%" }}
                                      disabled={props.values.detail_jurnal[index].debit_disable}
                                      onChange={(e) => {
                                        if (e > 0) {
                                          let debit = e;
                                          props.setFieldValue((props.values.detail_jurnal[index].debit = debit));
                                          props.setFieldValue((props.values.detail_jurnal[index].nominal = debit));
                                          props.setFieldValue((props.values.detail_jurnal[index].tipe_saldo = "Debit"));

                                          const total_debit = props.values.detail_jurnal.reduce(
                                            (a, b) => (a = a + b.debit),
                                            0
                                          );
                                          props.setFieldValue((props.values.total_debit = total_debit));
                                          props.setFieldValue("total_debit", total_debit);

                                          if (props.values.total_kredit / props.values.total_debit == 1) {
                                            props.setFieldValue((props.values.balance = "Balance"));
                                          } else if (props.values.total_kredit > props.values.total_debit) {
                                            let balance = props.values.total_kredit - props.values.total_debit;
                                            props.setFieldValue(
                                              (props.values.balance =
                                                "Debit kurang: Rp. " +
                                                Math.abs(balance).toLocaleString({ minimumFractionDigits: 0 }))
                                            );
                                          } else {
                                            let balance = props.values.total_kredit - props.values.total_debit;
                                            props.setFieldValue(
                                              (props.values.balance =
                                                "Kredit kurang: Rp. " +
                                                Math.abs(balance).toLocaleString({
                                                  minimumFractionDigits: 0,
                                                }))
                                            );
                                          }

                                          if (props.values.detail_jurnal[index].akun_id == props.values.akun_kasbank) {
                                            if (index == 0) {
                                              let total_sisa_saldo = data_akunkasbank[0].sisa_saldo + debit;
                                              props.setFieldValue(
                                                (props.values.detail_jurnal[index].sisa_saldo =
                                                  parseInt(total_sisa_saldo))
                                              );
                                            } else {
                                              let total_sisa_saldo =
                                                props.values.detail_jurnal[index - 1].sisa_saldo + debit;
                                              props.setFieldValue(
                                                (props.values.detail_jurnal[index].sisa_saldo =
                                                  parseInt(total_sisa_saldo))
                                              );
                                            }
                                          } else {
                                            if (index == 0) {
                                              let total_sisa_saldo = data_akunkasbank[0].sisa_saldo;
                                              props.setFieldValue(
                                                (props.values.detail_jurnal[index].sisa_saldo =
                                                  parseInt(total_sisa_saldo))
                                              );
                                            } else {
                                              let total_sisa_saldo = props.values.detail_jurnal[index - 1].sisa_saldo;
                                              props.setFieldValue(
                                                (props.values.detail_jurnal[index].sisa_saldo =
                                                  parseInt(total_sisa_saldo))
                                              );
                                            }
                                          }
                                        } else {
                                          let debit = 0;
                                          props.setFieldValue((props.values.detail_jurnal[index].debit = debit));
                                          props.setFieldValue((props.values.detail_jurnal[index].nominal = debit));
                                          props.setFieldValue((props.values.detail_jurnal[index].tipe_saldo = "Debit"));

                                          const total_debit = props.values.detail_jurnal.reduce(
                                            (a, b) => (a = a + b.debit),
                                            0
                                          );
                                          props.setFieldValue((props.values.total_debit = total_debit));
                                        }
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell
                                    style={{
                                      minWidth: 200,
                                    }}
                                  >
                                    <InputNumber
                                      defaultValue={props.values.detail_jurnal[index].kredit}
                                      formatter={(value) => `Rp. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                      parser={(value) => value.replace(/\Rp.\s?|(,*)/g, "")}
                                      style={{ width: "100%" }}
                                      size="middle"
                                      min={0}
                                      name="kredit"
                                      disabled={props.values.detail_jurnal[index].kredit_disable}
                                      onChange={(e) => {
                                        if (e > 0) {
                                          let kredit = e;
                                          props.setFieldValue((props.values.detail_jurnal[index].kredit = kredit));
                                          props.setFieldValue((props.values.detail_jurnal[index].nominal = kredit));
                                          props.setFieldValue(
                                            (props.values.detail_jurnal[index].tipe_saldo = "Kredit")
                                          );

                                          const total_kredit = props.values.detail_jurnal.reduce(
                                            (a, b) => (a = a + b.kredit),
                                            0
                                          );
                                          props.setFieldValue((props.values.total_kredit = total_kredit));
                                          props.setFieldValue("total_kredit", total_kredit);

                                          if (props.values.total_kredit / props.values.total_debit == 1) {
                                            props.setFieldValue((props.values.balance = "Balance"));
                                          } else if (props.values.total_debit > props.values.total_kredit) {
                                            let balance = props.values.total_kredit - props.values.total_debit;
                                            props.setFieldValue(
                                              (props.values.balance =
                                                "Kredit kurang: Rp. " +
                                                Math.abs(balance).toLocaleString({
                                                  minimumFractionDigits: 0,
                                                }))
                                            );
                                          } else {
                                            let balance = props.values.total_debit - props.values.total_kredit;
                                            props.setFieldValue(
                                              (props.values.balance =
                                                "Debit kurang: Rp. " +
                                                Math.abs(balance).toLocaleString({
                                                  minimumFractionDigits: 0,
                                                }))
                                            );
                                          }

                                          if (props.values.detail_jurnal[index].akun_id == props.values.akun_kasbank) {
                                            if (index == 0) {
                                              let total_sisa_saldo = data_akunkasbank[0].sisa_saldo - kredit;
                                              props.setFieldValue(
                                                (props.values.detail_jurnal[index].sisa_saldo =
                                                  parseInt(total_sisa_saldo))
                                              );
                                            } else {
                                              let total_sisa_saldo =
                                                props.values.detail_jurnal[index - 1].sisa_saldo - kredit;
                                              props.setFieldValue(
                                                (props.values.detail_jurnal[index].sisa_saldo =
                                                  parseInt(total_sisa_saldo))
                                              );
                                            }
                                          } else {
                                            if (index == 0) {
                                              let total_sisa_saldo = data_akunkasbank[0].sisa_saldo;
                                              props.setFieldValue(
                                                (props.values.detail_jurnal[index].sisa_saldo =
                                                  parseInt(total_sisa_saldo))
                                              );
                                            } else {
                                              let total_sisa_saldo = props.values.detail_jurnal[index - 1].sisa_saldo;
                                              props.setFieldValue(
                                                (props.values.detail_jurnal[index].sisa_saldo =
                                                  parseInt(total_sisa_saldo))
                                              );
                                            }
                                          }
                                        } else {
                                          let kredit = 0;
                                          props.setFieldValue((props.values.detail_jurnal[index].kredit = kredit));
                                          props.setFieldValue((props.values.detail_jurnal[index].nominal = kredit));
                                          props.setFieldValue(
                                            (props.values.detail_jurnal[index].tipe_saldo = "Kredit")
                                          );

                                          const total_kredit = props.values.detail_jurnal.reduce(
                                            (a, b) => (a = a + b.kredit),
                                            0
                                          );
                                          props.setFieldValue((props.values.total_kredit = total_kredit));
                                        }
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell
                                    style={{
                                      minWidth: 170,
                                    }}
                                  >
                                    <InputNumber
                                      formatter={(value) => `Rp. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                      parser={(value) => value.replace(/\Rp.\s?|(,*)/g, "")}
                                      name="sisa_saldo"
                                      defaultValue={props.values.detail_jurnal[index].sisa_saldo}
                                      min={0}
                                      size="middle"
                                      style={{ width: "100%" }}
                                      disabled
                                      value={props.values.detail_jurnal[index].sisa_saldo}
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
                                  tgl_transaksi: "",
                                  darikepada: "",
                                  akun_id: "",
                                  kategori_id: "",
                                  deskripsi: "",
                                  nominal: 0,
                                  tipe_saldo: "",
                                  debit: 0,
                                  debit_disable: false,
                                  kredit: 0,
                                  kredit_disable: false,
                                  sisa_saldo: 0,
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
                </Paper>
              </div>

              <div className="mt-8 card">
                <div className="shadow-md card-body">
                  <div className="flex justify-end px-20 space-x-52">
                    <div className="text-xl">
                      {props.values.balance == "Balance" ? (
                        <h1 className="text-green-500">Balance</h1>
                      ) : (
                        <h2 className="text-red-500">{props.values.balance}</h2>
                      )}
                    </div>
                    <div>
                      <h4>
                        Total Debit <br />
                        {`Rp. ${props.values.total_debit.toLocaleString({ minimumFractionDigits: 0 })}`}
                      </h4>
                    </div>
                    <div>
                      <h4>
                        Total Kredit <br />
                        {`Rp. ${props.values.total_kredit.toLocaleString({ minimumFractionDigits: 0 })}`}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex justify-end space-x-2 mt-8">
                <Link href="/jurnal">
                  <a>
                    <Button variant="danger">Batal</Button>
                  </a>
                </Link>

                {props.values.total_debit == props.values.total_kredit ? (
                  <Button type="primary" onClick={props.handleSubmit}>
                    Submit
                  </Button>
                ) : (
                  <Button type="primary" disabled>
                    Submit
                  </Button>
                )}
              </div>
            </Forms>
          )}
        </Formik>
      </CardMax>
    </div>
  );
}

export default function Page({ fallback }) {
  return (
    <SWRConfig value={{ fallback }}>
      <FormEdit />
    </SWRConfig>
  );
}
