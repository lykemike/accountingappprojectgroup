import React from "react";
import { Table } from "antd";

export default function TableViewsBukuBesar({ dataBukuBesar }) {
  const expandedRowRender = (record) => {
    const columns = [
      {
        title: "Tanggal",
        dataIndex: "tgl_transaksi",
        width: 100,
      },
      {
        title: "Sumber Transaksi",
        dataIndex: "sumber",
        width: 200,
      },
      {
        title: "No. Referensi",
        dataIndex: "no_transaksi",
        width: 100,
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
      {
        title: "Saldo",
        dataIndex: "selisih",
        width: 200,
        render: (selisih) => {
          return <span>{`Rp. ${selisih.toLocaleString()}`}</span>;
        },
      },
    ];

    const newArrayData = [];
    record.value.map((i, index) => {
      newArrayData.push({
        key: index + 1,
        tgl_transaksi: i.tanggal,
        sumber: i.sumber_transaksi,
        no_transaksi: "#" + i.no_ref,
        debit: i.debit,
        kredit: i.kredit,
        selisih: i.selisih,
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
        showHeader={() => "HEADER"}
        title={() => {
          return <span className="ml-8">Jurnal</span>;
        }}
        summary={(pageData) => {
          let totalJurnalDebit = "Rp. " + pageData.reduce((a, b) => (a = a + b.debit), 0).toLocaleString();
          let totalJurnalKredit = "Rp. " + pageData.reduce((a, b) => (a = a + b.kredit), 0).toLocaleString();
          let selisihSaldoAwal = "Rp. " + pageData[pageData?.length - 1].selisih.toLocaleString();
          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={1} />
                <Table.Summary.Cell index={2} />

                <Table.Summary.Cell index={3} align="right">
                  Total
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}>{totalJurnalDebit}</Table.Summary.Cell>
                <Table.Summary.Cell index={5}>{totalJurnalKredit}</Table.Summary.Cell>
                <Table.Summary.Cell index={6}>{selisihSaldoAwal}</Table.Summary.Cell>
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
      width: 500,
      ellipsis: true,
    },
    {
      title: "Saldo Awal",
      dataIndex: "saldo_awal",
      width: 200,
      render: (saldo) => {
        return <span>{`Rp. ${saldo.toLocaleString()}`}</span>;
      },
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
        size="small"
        scroll={{ x: 1000 }}
        columns={columns}
        expandable={{
          expandedRowRender,
        }}
        pagination={{
          position: ["topRight"],
        }}
        dataSource={dataBukuBesar?.bukuBesar ? dataBukuBesar?.bukuBesar : []}
        loading={dataBukuBesar?.bukuBesar ? false : true}
        summary={() => {
          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={2} align="right" />
                <Table.Summary.Cell index={3} align="right" />
                <Table.Summary.Cell index={4} align="right">
                  Grand Total
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5}>{`Rp. ${dataBukuBesar?.debit?.toLocaleString()}`}</Table.Summary.Cell>
                <Table.Summary.Cell index={6}>{`Rp. ${dataBukuBesar?.kredit?.toLocaleString()}`}</Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
        // onChange={onChange}
      />
    </div>
  );
}
