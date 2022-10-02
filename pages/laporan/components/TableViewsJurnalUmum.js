import React from "react";
import { Table } from "antd";

export default function TableViewsJurnalUmum({ dataJurnal }) {
  const expandedRowRender = (record) => {
    const columns = [
      {
        title: "Akun",
        dataIndex: "akun",
      },
      {
        title: "Debit",
        dataIndex: "debit",
        width: 200,
        render: (debit) => {
          return <span>{`Rp. ${debit.toLocaleString()}`}</span>;
        },
      },
      {
        title: "Kredit",
        dataIndex: "kredit",
        width: 200,
        render: (kredit) => {
          return <span>{`Rp. ${kredit.toLocaleString()}`}</span>;
        },
      },
    ];

    const newArrayData = [];
    record.data.map((i, index) => {
      newArrayData.push({
        key: index + 1,
        id: i.id,
        akun: i.kode_akun + " - " + i.nama_akun,
        debit: i.debit,
        kredit: i.kredit,
      });
    });

    return (
      <Table
        columns={columns}
        bordered
        size="small"
        dataSource={newArrayData}
        loading={newArrayData ? false : true}
        pagination={false}
        title={() => {
          return <span className="ml-8">Jurnal</span>;
        }}
        summary={(pageData) => {
          let totalJurnalDebit = "Rp. " + pageData.reduce((a, b) => (a = a + b.debit), 0).toLocaleString();
          let totalJurnalKredit = "Rp. " + pageData.reduce((a, b) => (a = a + b.kredit), 0).toLocaleString();

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} align="right">
                  Total
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>{totalJurnalDebit}</Table.Summary.Cell>
                <Table.Summary.Cell index={2}>{totalJurnalKredit}</Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
    );
  };

  const columns = [
    {
      title: "Sumber Transaksi",
      dataIndex: "label",
      width: 300,
      ellipsis: true,
      render: (label) => {
        return <span>{label?.split("-")[0]}</span>;
      },
    },
    {
      title: "Tanggal Pembuatan",
      dataIndex: "label",
      width: 300,
      render: (date) => {
        return <span>{date?.split("-")[1]}</span>;
      },
    },
    {
      width: 100,
    },
    {
      width: 200,
    },
    {
      width: 200,
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    // console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <div>
      <Table
        // bordered
        size="small"
        scroll={{ x: 1000 }}
        columns={columns}
        expandable={{
          expandedRowRender,
        }}
        pagination={{
          position: ["topRight"],
        }}
        dataSource={dataJurnal?.jurnalUmum ? dataJurnal?.jurnalUmum : []}
        loading={dataJurnal?.jurnalUmum ? false : true}
        summary={() => {
          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={1} align="right" />
                <Table.Summary.Cell index={2} align="right" />
                <Table.Summary.Cell index={3} align="right" />
                <Table.Summary.Cell index={4} align="right">
                  Grand Total
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5}>{`Rp. ${dataJurnal?.debit?.toLocaleString()}`}</Table.Summary.Cell>
                <Table.Summary.Cell index={6}>{`Rp. ${dataJurnal?.kredit?.toLocaleString()}`}</Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
        // onChange={onChange}
      />
    </div>
  );
}
