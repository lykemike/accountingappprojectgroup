import React from "react";
import Link from "next/link";
import useSWR, { SWRConfig } from "swr";
import axios from "../../../libs/axios";
import CardMax from "../../../components/CardMax";
import { authPage } from "../../../middlewares/authorizationPage";
import { Breadcrumb, Button, Checkbox, Divider, Form, Input, message, Skeleton, Select, Typography } from "antd";
import { BankOutlined, FileOutlined, InfoCircleOutlined, ProfileOutlined } from "@ant-design/icons";
import { Table, TableBody, TableCell, TableFooter, TableContainer, TableHead, TableRow, Paper } from "@mui/material/";
const CheckboxGroup = Checkbox.Group;
const { Option } = Select;
const { Title } = Typography;

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

function ViewJurnal() {
  const { data } = useSWR(API);

  const inputWidth = "80%";
  return (
    <div>
      <div className="mb-2">
        <Breadcrumb>
          <Breadcrumb.Item>Jurnal</Breadcrumb.Item>
          <Breadcrumb.Item>View Jurnal</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <CardMax>
        <div className="flex justify-start space-x-10 font-sans">
          <div>
            <span className="mr-2 font-semibold">Akun Kas dan Bank:</span>
            {data?.newHeaderJurnalArray[0]?.akun}
          </div>
          <div>
            <span className="mr-2 font-semibold">Reference:</span>
            {`Journal Entry #${data?.newHeaderJurnalArray[0]?.id}`}
          </div>
        </div>

        <div className="mt-6">
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableHead className="bg-sky-300">
                <TableRow>
                  <TableCell>Tanggal Transaksi</TableCell>
                  <TableCell>Dari/Kepada</TableCell>
                  <TableCell>Kode Akun</TableCell>
                  <TableCell>Nama Akun</TableCell>
                  <TableCell>Deskripsi</TableCell>
                  <TableCell>Debit</TableCell>
                  <TableCell>Kredit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.newDetailJurnalArrays?.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell>{i.tgl_transaksi}</TableCell>
                    <TableCell>{i.darikepada}</TableCell>
                    <TableCell>{i.kode_akun}</TableCell>
                    <TableCell>{i.nama_akun}</TableCell>
                    <TableCell>{i.deskripsi}</TableCell>
                    <TableCell>{i.debit}</TableCell>
                    <TableCell>{i.kredit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell>Total Debit: {data?.newHeaderJurnalArray[0]?.total_debit}</TableCell>
                  <TableCell>Total Kredit: {data?.newHeaderJurnalArray[0]?.total_kredit}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </div>
      </CardMax>
    </div>
  );
}

export default function App({ fallback }) {
  return (
    <SWRConfig value={{ fallback }}>
      <ViewJurnal />
    </SWRConfig>
  );
}
