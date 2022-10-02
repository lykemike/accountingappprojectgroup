import React, { useState } from "react";
import Router from "next/router";
import * as XLSX from "xlsx";
import axios from "../../libs/axios";
import CardMax from "../../components/CardMax";
import prisma from "../../libs/prisma";
import { Breadcrumb, Form, message, Button, Row, Col, Card, DatePicker, Upload, Divider } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export async function getServerSideProps() {
  const akuns = await prisma.akun.findMany({
    orderBy: {
      kode_akun: "asc",
    },
    include: {
      kategori_akun: true,
    },
  });

  let list = [];
  akuns.map((i) => {
    list.push({
      id: i.id,
      kode_akun: i.kode_akun,
      nama_akun: i.nama_akun,
      debit: 0,
      kredit: 0,
      tipe_saldo: i.kategori_akun.saldo_normal_nama,
    });
  });

  return {
    props: {
      coa: list,
    },
  };
}

export default function AturSaldoAwal({ coa }) {
  const dateFormat = "YYYY/MM/DD";
  const [importedData, setImportedData] = useState([]);

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsBinaryString(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "binary", cellText: false });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 0, raw: false });
        resolve(data);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
    promise.then((imported_data) => {
      setImportedData(imported_data);
    });
  };

  let importedDataNewArray = [];
  importedData.map((i) => {
    importedDataNewArray.push({
      id: i.id,
      kode_akun: i.kode_akun,
      nama_akun: i.nama_akun,
      debit_nominal: i.debit == "###" || i.debit == "DEBIT" ? 0 : parseInt(i.debit),
      kredit_nominal: i.kredit == "###" || i.kredit == "KREDIT" ? 0 : parseInt(i.kredit),
      sisa_saldo_debit: i.debit > 0 ? parseInt(i.debit) : 0,
      sisa_saldo_kredit: i.kredit > 0 ? parseInt(i.kredit) : 0,
    });
  });

  let debit_tot = importedDataNewArray.reduce((a, b) => (a = a + b.debit_nominal), 0);
  let kredit_tot = importedDataNewArray.reduce((a, b) => (a = a + b.kredit_nominal), 0);
  let balance = debit_tot - kredit_tot;

  let label_tag = "";
  let label_number = "";
  let label_boolean = false;
  if (debit_tot > kredit_tot) {
    label_tag = "Not Balance: Check Credit";
    label_number = "Rp. " + balance.toLocaleString();
    label_boolean = true;
  } else if (debit_tot < kredit_tot) {
    label_tag = "Not Balance: Check Debit";
    label_number = "Rp. " + (balance * -1).toLocaleString();
    label_boolean = true;
  } else {
    label_tag = "Balance";
    label_number = "Rp. 0, 00";
    label_boolean = false;
  }

  const onFinish = (fieldsValue) => {
    const values = {
      ...fieldsValue,
      tanggal_konversi: fieldsValue["tanggal_konversi"].format(dateFormat),
    };

    axios
      .post("/coa/create-saldo-awal", { values, importedDataNewArray })
      .then(function (response) {
        message.success(response.data.message);
        Router.push("/daftar-akun");
      })
      .catch(function (error) {
        message.error(error.response.data.message);
      });
  };

  return (
    <div>
      <div className="mb-2">
        <Breadcrumb>
          <Breadcrumb.Item>Daftar Akun</Breadcrumb.Item>
          <Breadcrumb.Item>Atur Saldo Awal</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <CardMax>
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={[16, 16]}>
            <Col xs={{ span: 24 }} md={{ span: 10 }}>
              <Card>
                <span className="text-lg">Step 1</span>
                <Divider />
                <div>
                  <p className="text-sm">
                    <label className="font-medium mr-1">1.</label>
                    <label className="font-medium mr-1 ">Download template saldo awal</label>
                  </p>
                  <Button
                    type="primary"
                    onClick={() => {
                      let akun = [];
                      coa?.map((i) => {
                        akun.push({
                          id: i.id,
                          kode_akun: i.kode_akun,
                          nama_akun: i.nama_akun,
                          debit: i.tipe_saldo == "Debit" ? "DEBIT" : "###",
                          kredit: i.tipe_saldo == "Kredit" ? "KREDIT" : "###",
                        });
                      });

                      const header_excel = akun;
                      var ws = XLSX.utils.json_to_sheet(header_excel);
                      var wb = XLSX.utils.book_new();
                      XLSX.utils.book_append_sheet(wb, ws, "Template Saldo Awal");
                      XLSX.writeFile(wb, "template_saldo_awal.xlsx");
                    }}
                  >
                    Download Template
                  </Button>
                  <p className="text-sm mt-2">
                    <label className="font-medium mr-1">2.</label>Kolom
                    <label className="font-medium text-base ml-1 mr-1 ">id, kode_akun,</label>
                    dan
                    <label className="font-medium text-base ml-1 mr-1">nama_akun</label>
                    jangan
                    <label className="font-medium text-base text-red-600 ml-1 mr-1">diubah</label>atau
                    <label className="font-medium text-base text-red-600 ml-1 mr-1">dihapus</label>
                    agar importan berjalan dengan lancar.
                  </p>
                  <p className="text-sm">
                    <label className="font-medium mr-1">3.</label>
                    Kolom yang isinya<label className="font-medium text-base ml-1 mr-1">DEBIT</label>atau
                    <label className="font-medium text-base ml-1">KREDIT</label>, itu boleh di isi, dan kolom yang isinya
                    <label className="font-medium text-base ml-1 mr-1">###</label>
                    jangan
                    <label className="font-medium text-base text-red-600 ml-1 mr-1">diubah</label>atau
                    <label className="font-medium text-base text-red-600 ml-1 ">dihapus</label>, itu akan otomatis jadi 0 ketika di import.
                  </p>
                  <p className="text-sm">
                    <label className="font-medium mr-1">4.</label>Pastikan sebelum submit
                    <label className="font-medium text-base ml-1 mr-1">DEBIT</label>dan
                    <label className="font-medium text-base ml-1 mr-1">KREDIT</label>seimbang.
                  </p>
                  <Form.Item
                    name="saldo_awal"
                    rules={[
                      {
                        required: true,
                        message: "required!",
                      },
                    ]}
                  >
                    <Upload
                      maxCount={1}
                      onChange={(e) => {
                        const file = e.file.originFileObj;
                        readExcel(file);
                      }}
                    >
                      <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                  </Form.Item>

                  <div className="mt-4">
                    {label_boolean == false ? (
                      <>
                        <h1 className="text-green-600 font-semibold text-base">{label_tag}</h1>
                        <h1 className="text-green-600 font-semibold text-base">{label_number.toLocaleString()}</h1>
                      </>
                    ) : (
                      <>
                        <h1 className="text-red-500 font-semibold text-base">{label_tag}</h1>
                        <h1 className="text-red-500 font-semibold text-base">{label_number.toLocaleString()}</h1>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 6 }}>
              <Card>
                <span className="text-lg">Step 2</span>
                <Divider />

                <Form.Item
                  label="Tanggal Konversi"
                  name="tanggal_konversi"
                  rules={[
                    {
                      required: true,
                      message: "Please select date!",
                    },
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} format={dateFormat} />
                </Form.Item>

                <div className="flex justify-end">
                  <Button disabled={label_boolean} type="primary" htmlType="submit">
                    Submit
                  </Button>
                </div>
              </Card>
            </Col>

            <Col xs={{ span: 24 }} md={{ span: 8 }} />
          </Row>
        </Form>
      </CardMax>
    </div>
  );
}
