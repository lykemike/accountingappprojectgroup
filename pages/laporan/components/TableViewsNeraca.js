import React from "react";
import { Table } from "antd";

export default function TableViewsTrialNeraca({ dataNeraca }) {
  const expandedRowRender = (record) => {
    const columns = [
      {
        title: "Akun",
        width: 500,
        dataIndex: "heading",
      },
      {
        title: "Penyesuaian",
        children: [
          {
            title: "Debit",
            width: 150,
            dataIndex: "pny_debit",
            render: (debit) => {
              return <span>{debit.toLocaleString()}</span>;
            },
          },
          {
            title: "Kredit",
            width: 150,
            dataIndex: "pny_kredit",
            render: (kredit) => {
              return <span>{kredit.toLocaleString()}</span>;
            },
          },
        ],
      },
    ];

    const newArrayData = [];
    record.value.map((i, index) => {
      newArrayData.push({
        key: index + 1,
        heading: i.heading,
        pny_debit: i.total_pny_debit,
        pny_kredit: i.total_pny_kredit,
        grand_debit: i.grand_debit,
        grand_kredit: i.grand_kredit,
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
        summary={(pageData) => {
          const totalDebit = pageData.reduce((a, b) => (a = a + b.grand_debit), 0);
          const totalKredit = pageData.reduce((a, b) => (a = a + b.grand_kredit), 0);

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={1} align="right">
                  Total
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right">
                  {totalDebit < 0 ? "(Rp . " + (totalDebit * -1).toLocaleString() + ")" : "Rp . " + totalDebit.toLocaleString()}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right">
                  {totalKredit < 0 ? "(Rp . " + (totalKredit * -1).toLocaleString() + ")" : "Rp . " + totalKredit.toLocaleString()}
                </Table.Summary.Cell>
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
        dataSource={dataNeraca?.neraca ? dataNeraca?.neraca : []}
        loading={dataNeraca?.neraca ? false : true}
        summary={() => {
          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} align="right" />
                <Table.Summary.Cell index={1} align="right">
                  Grand Total
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>{`Aset: ${dataNeraca?.new_array[0]?.grandtotalaset}`}</Table.Summary.Cell>
                <Table.Summary.Cell index={3}>{`Liabilitas: ${dataNeraca?.new_array[1]?.grandtotalliabilitas}`}</Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
        // onChange={onChange}
      />
    </div>
  );
}
