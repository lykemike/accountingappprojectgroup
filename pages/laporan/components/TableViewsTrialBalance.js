import React from "react";
import { Table } from "antd";

export default function TableViewsTrialBalance({ dataTrialBalance }) {
  const expandedRowRender = (record) => {
    const columns = [
      {
        title: "Akun",
        width: 500,
        dataIndex: "heading",
      },
      {
        title: "Saldo Awal",
        width: 400,
        children: [
          {
            title: "Debit",
            width: 150,
            dataIndex: "saldo_awal_debit",
            render: (debit) => {
              return <span>{`Rp. ${debit.toLocaleString()}`}</span>;
            },
          },
          {
            title: "Kredit",
            width: 150,
            dataIndex: "saldo_awal_kredit",
            render: (kredit) => {
              return <span>{`Rp. ${kredit.toLocaleString()}`}</span>;
            },
          },
        ],
      },
      {
        title: "Penyesuaian",
        children: [
          {
            title: "Debit",
            width: 150,
            dataIndex: "pny_debit",
          },
          {
            title: "Kredit",
            width: 150,
            dataIndex: "pny_kredit",
          },
        ],
      },
      {
        title: "Saldo Akhir",

        children: [
          {
            title: "Debit",
            width: 150,
            dataIndex: "akhir_debit",
          },
          {
            title: "Kredit",
            width: 150,
            dataIndex: "akhir_kredit",
          },
        ],
      },
      //   {
      //     title: "Debit",
      //     dataIndex: "debit",
      //     width: 200,
      //     render: (debit) => {
      //       return <span>{`Rp. ${debit.toLocaleString()}`}</span>;
      //     },
      //   },
      //   {
      //     title: "Kredit",
      //     dataIndex: "kredit",
      //     width: 200,
      //     render: (kredit) => {
      //       return <span>{`Rp. ${kredit.toLocaleString()}`}</span>;
      //     },
      //   },
    ];

    const newArrayData = [];
    record.value.map((i, index) => {
      newArrayData.push({
        key: index + 1,
        heading: i.heading,
        saldo_awal_debit: i.saldo_awal_debit,
        saldo_awal_kredit: i.saldo_awal_kredit,
        pny_debit: i.pny_debit,
        pny_kredit: i.pny_kredit,
        akhir_debit: i.akhir_debit,
        akhir_kredit: i.akhir_kredit,
      });
    });

    return (
      <Table columns={columns} bordered size="small" dataSource={newArrayData} loading={newArrayData ? false : true} pagination={false} />
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
    {
      width: 200,
    },
    {
      width: 200,
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
        scroll={{ x: 1500 }}
        columns={columns}
        expandable={{
          expandedRowRender,
        }}
        pagination={false}
        dataSource={dataTrialBalance?.trialBalance ? dataTrialBalance?.trialBalance : []}
        loading={dataTrialBalance?.trialBalance ? false : true}
        summary={() => {
          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} align="right" />
                <Table.Summary.Cell index={1} align="right">
                  Grand Total
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  {`Rp. ${dataTrialBalance?.grand_total[0]?.grand_total_sa_debit?.toLocaleString()}`}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  {`Rp. ${dataTrialBalance?.grand_total[0]?.grand_total_sa_kredit?.toLocaleString()}`}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                  {`Rp. ${dataTrialBalance?.grand_total[0]?.grand_total_pny_debit?.toLocaleString()}`}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5}>
                  {`Rp. ${dataTrialBalance?.grand_total[0]?.grand_total_pny_kredit?.toLocaleString()}`}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6}>
                  {`Rp. ${dataTrialBalance?.grand_total[0]?.grand_total_akhir_debit?.toLocaleString()}`}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={7}>
                  {`Rp. ${dataTrialBalance?.grand_total[0]?.grand_total_akhir_kredit?.toLocaleString()}`}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
        // onChange={onChange}
      />
    </div>
  );
}
