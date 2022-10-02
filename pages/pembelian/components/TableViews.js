import React, { useState } from "react";
import Link from "next/link";
import moment from "moment";
import useSwr, { useSWRConfig } from "swr";
import axios from "../../../libs/axios";

import { Button, message, Modal, Table, Menu, Dropdown, Form, DatePicker, Divider } from "antd";
import { CheckSquareOutlined, DeleteOutlined, FileTextOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";

export default function TableViewsPembelian() {
  const { mutate } = useSWRConfig();

  const fetcher = (url) => axios.get(url).then((response) => response.data);
  const { data, error } = useSwr("/pembelian/get-pembelian", fetcher);

  const handleDeletePengiriman = async (detail) => {
    Modal.confirm({
      title: `Are you sure, you want to delete "Invoice Pengiriman Pembayaran #${detail.id}"?`,
      okText: "Confirm",
      okType: "danger",
      onOk: () => {
        axios
          .delete("/pembelian/delete-pengiriman/" + detail.id)
          .then(function (response) {
            message.success(response?.data?.message);
            mutate("/pembelian/get-pembelian");
          })
          .catch(function (error) {
            message.error(error.response.data.message);
          });
      },
    });
  };

  const handleDeletepembelian = async (pembelian) => {
    Modal.confirm({
      title: `Are you sure, you want to delete "Purchase Invoice #${pembelian.id}"?`,
      okText: "Confirm",
      okType: "danger",
      onOk: () => {
        axios
          .delete("/pembelian/delete-pembelian/" + pembelian.id)
          .then(function (response) {
            message.success(response?.data?.message);
            mutate("/pembelian/get-pembelian");
          })
          .catch(function (error) {
            message.error(error.response.data.message);
          });
      },
    });
  };

  const expandedRowRender = (record) => {
    const columns = [
      {
        title: "Jumlah Pengiriman",
        dataIndex: "key",
        width: 150,
        render: (key) => {
          return <span>Pengiriman ke-{key}</span>;
        },
      },
      {
        title: "Invoice",
        dataIndex: "invoice",
        width: 200,
      },
      {
        title: "Tanggal Pengiriman Pembayaran",
        dataIndex: "tanggal",
        width: 220,
      },

      {
        title: "Jumlah",
        dataIndex: "jumlah",
        width: 200,
      },
      {
        title: "Status",
        dataIndex: "status",
        width: 100,
        align: "center",
        render: () => {
          return <span className="bg-green-200 text-green-600 py-1 px-2 rounded text-xs">Done</span>;
        },
      },
      {
        title: "Actions",
        align: "center",
        width: 100,
        render: (detail) => {
          return (
            <>
              <Dropdown
                overlay={
                  <Menu
                    items={[
                      {
                        label: (
                          <Link href={`/pembelian/view-pengiriman-pembayaran/${detail.id}`}>
                            <a>View Invoice</a>
                          </Link>
                        ),
                        key: "1",
                        icon: <FileTextOutlined />,
                      },
                      // {
                      //   label: (
                      //     <Link href={`/pembelian/update-pengiriman-pembayaran/${detail.id}`}>
                      //       <a>Edit Invoice</a>
                      //     </Link>
                      //   ),
                      //   key: "2",
                      //   icon: <EditOutlined />,
                      // },
                      {
                        label: <a onClick={() => handleDeletePengiriman(detail)}>Delete Invoice</a>,
                        key: "3",
                        icon: <DeleteOutlined />,
                      },
                    ]}
                  />
                }
              >
                <Button size="small" shape="circle" type="dashed" icon={<MoreOutlined />} />
              </Dropdown>
            </>
          );
        },
      },
    ];

    const detailPembayaran = [];
    record.PengirimanBayaran.map((i, index) => {
      detailPembayaran.push({
        key: index + 1,
        id: i.id,
        invoice: `Invoice Pengiriman #${i.id}`,
        tanggal: i.tgl_pembayaran.split(" ")[0],
        jumlah: `Rp. ${i.jumlah.toLocaleString()}`,
      });
    });

    return (
      <Table columns={columns} size="small" dataSource={detailPembayaran} loading={detailPembayaran ? false : true} pagination={false} />
    );
  };

  const columns = [
    {
      title: "Nomor",
      dataIndex: "nomor",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Pelanggan",
      dataIndex: "pelanggan",
      width: 300,
    },
    {
      title: "Tanggal Transaksi",
      dataIndex: "tgl_transaksi",
      width: 200,
    },
    {
      title: "Tanggal Jatuh Tempo",
      dataIndex: "tgl_jatuh_tempo",
      width: 200,
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      width: 100,
      render: (status) => {
        if (status == "Active") {
          return <span className="bg-orange-200 text-orange-600 py-1 px-2 rounded text-xs">{status}</span>;
        } else if (status == "Partial") {
          return <span className="bg-purple-200 text-purple-600 py-1 px-2 rounded text-xs">{status}</span>;
        } else if (status == "Complete") {
          return <span className="bg-emerald-200 text-emerald-600 py-1 px-2 rounded text-xs">{status}</span>;
        } else if (status == "Jatuh Tempo") {
          return <span className="bg-red-200 text-red-600 py-1 px-2 rounded text-xs">{status}</span>;
        }
      },
    },
    {
      title: "Sisa Tagihan",
      dataIndex: "sisa_tagihan",
      width: 200,
    },
    {
      title: "Actions",
      width: 100,
      align: "center",
      render: (pembelian) => (
        <div className="space-x-2">
          <Dropdown
            overlay={
              <Menu
                items={[
                  {
                    label: (
                      <Link href={`/pembelian/view/${pembelian.id}`}>
                        <a>View Purchase Invoice</a>
                      </Link>
                    ),
                    key: "1",
                    icon: <FileTextOutlined />,
                  },

                  pembelian.PengirimanBayaran.length > 0
                    ? null
                    : {
                        label: (
                          <Link href={`/pembelian/update/${pembelian.id}`}>
                            <a>Edit Purchase Invoice</a>
                          </Link>
                        ),
                        key: "2",
                        icon: <EditOutlined />,
                      },

                  {
                    label: <a onClick={() => handleDeletepembelian(pembelian)}>Delete Purchase Invoice</a>,
                    key: "3",
                    icon: <DeleteOutlined />,
                  },
                ]}
              />
            }
          >
            <Button size="small" type="primary" icon={<MoreOutlined />} />
          </Dropdown>
        </div>
      ),
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    // console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <div>
      <Table
        bordered
        size="small"
        scroll={{ x: 1000 }}
        columns={columns}
        expandable={{
          expandedRowRender,
        }}
        dataSource={data?.newPembelianArray ? data?.newPembelianArray : []}
        loading={data?.newPembelianArray ? false : true}
        // onChange={onChange}
      />
    </div>
  );
}
