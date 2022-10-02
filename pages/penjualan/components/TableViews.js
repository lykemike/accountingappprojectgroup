import React, { useState } from "react";
import Link from "next/link";
import moment from "moment";
import useSwr, { useSWRConfig } from "swr";
import axios from "../../../libs/axios";

import { Button, message, Modal, Table, Menu, Dropdown, Form, DatePicker, Divider } from "antd";
import { CheckSquareOutlined, DeleteOutlined, FileTextOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";

export default function TableViewsPenjualan() {
  const { mutate } = useSWRConfig();

  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetcher = (url) => axios.get(url).then((response) => response.data);
  const { data, error } = useSwr("/penjualan/get-penjualan", fetcher);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDeletePenerimaan = async (detail) => {
    Modal.confirm({
      title: `Are you sure, you want to delete "Invoice Penerimaan #${detail.id}"?`,
      okText: "Confirm",
      okType: "danger",
      onOk: () => {
        axios
          .delete("/penjualan/delete-penerimaan/" + detail.id)
          .then(function (response) {
            message.success(response?.data?.message);
            mutate("/penjualan/get-penjualan");
          })
          .catch(function (error) {
            message.error(error.response.data.message);
          });
      },
    });
  };

  const handleDeletePenjualan = async (penjualan) => {
    Modal.confirm({
      title: `Are you sure, you want to delete "Sales Invoice #${penjualan.id}"?`,
      okText: "Confirm",
      okType: "danger",
      onOk: () => {
        axios
          .delete("/penjualan/delete-penjualan/" + penjualan.id)
          .then(function (response) {
            message.success(response?.data?.message);
            mutate("/penjualan/get-penjualan");
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
        title: "Jumlah Penagihan",
        dataIndex: "key",
        width: 200,
        render: (key) => {
          return <span>Penagihan ke-{key}</span>;
        },
      },
      {
        title: "Invoice",
        dataIndex: "invoice",
        width: 200,
      },
      {
        title: "Tanggal Penerimaan Pembayaran",
        dataIndex: "tanggal",
        width: 200,
      },
      {
        title: "Presentase Penagihan",
        dataIndex: "presentase_penagihan",
        width: 200,
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
        render: (status) => {
          if (status == "Process") {
            return <span className="bg-orange-200 text-orange-600 py-1 px-2 rounded text-xs">{status}</span>;
          } else if (status == "Done") {
            return <span className="bg-green-200 text-green-600 py-1 px-2 rounded text-xs">{status}</span>;
          } else if (status == "Active") {
            return <span className="bg-green-200 text-green-600 py-1 px-2 rounded text-xs">{status}</span>;
          }
        },
      },
      {
        title: "Actions",
        align: "center",
        width: 100,
        render: (detail) => {
          const onFinish = (values) => {
            const penerimaanId = detail.id;
            axios
              .post("/penjualan/confirm-penerimaan", { values, penerimaanId })
              .then(function (response) {
                message.success(response?.data?.message);
                setIsModalVisible(false);
                form.resetFields();
                mutate("/penjualan/get-penjualan");
              })
              .catch(function (error) {
                message.error(error.response.data.message);
              });
          };

          return (
            <>
              <Modal
                title="Invoice Penerimaan Pembayaran"
                visible={isModalVisible}
                footer={
                  <>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button form="confirmForm" type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </>
                }
                onCancel={handleCancel}
              >
                <Form form={form} id="confirmForm" layout="vertical" onFinish={onFinish} autoComplete="off">
                  <Form.Item
                    label="Confirmation Date"
                    name="confirmation_date"
                    rules={[
                      {
                        required: true,
                        message: "Please select confrimation date!",
                      },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} format={moment().format("YYYY/MM/DD")} />
                  </Form.Item>
                </Form>

                <Divider />

                <p className="font-mono">
                  Note: Once penerimaan invoice is confirmed, it cannot be <strong>edited</strong>.
                </p>
              </Modal>

              <Dropdown
                overlay={
                  <Menu
                    items={[
                      detail.status == "Process"
                        ? {
                            label: <a onClick={showModal}>Confirm Invoice</a>,
                            key: "1",
                            icon: <CheckSquareOutlined />,
                          }
                        : null,

                      {
                        label: (
                          <Link href={`/penjualan/view-terima-pembayaran/${detail.id}`}>
                            <a>View Invoice</a>
                          </Link>
                        ),
                        key: "2",
                        icon: <FileTextOutlined />,
                      },
                      detail.status == "Process"
                        ? {
                            label: (
                              <Link href={`/penjualan/update-terima-pembayaran/${detail.id}`}>
                                <a>Edit Invoice</a>
                              </Link>
                            ),
                            key: "3",
                            icon: <EditOutlined />,
                          }
                        : null,
                      {
                        label: <a onClick={() => handleDeletePenerimaan(detail)}>Delete Invoice</a>,
                        key: "4",
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

    record.tipe_perusahaan == "false"
      ? record.PenerimaanPembayaran.map((i, index) => {
          detailPembayaran.push({
            key: index + 1,
            id: i.id,
            invoice: `Invoice Penerimaan #${i.id}`,
            tanggal: i.date,
            presentase_penagihan: `${i.presentase_penagihan}%`,
            jumlah: `Rp. ${i.tagihan_sebelum_pajak.toLocaleString()}`,
            status: i.status,
          });
        })
      : record.PenerimaanPembayaran.map((i, index) => {
          detailPembayaran.push({
            key: index + 1,
            id: i.id,
            invoice: `Invoice Penerimaan #${i.id}`,
            tanggal: i.date,
            presentase_penagihan: `${i.presentase_penagihan}%`,
            jumlah: `Rp. ${i.tagihan_setelah_pajak.toLocaleString()}`,
            status: i.status,
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
      title: "Tanggal Kontrak Mulai",
      dataIndex: "tgl_kontrak_mulai",
      width: 200,
    },
    {
      title: "Tanggal Kontrak Habis",
      dataIndex: "tgl_kontrak_habis",
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
          return <span className="bg-emerald-200 text-emerald-600 py-1 px-2 rounded text-x">{status}</span>;
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
      render: (penjualan) => (
        <div className="space-x-2">
          <Dropdown
            overlay={
              <Menu
                items={[
                  {
                    label: (
                      <Link href={`/penjualan/view/${penjualan.id}`}>
                        <a>View Sales Invoice</a>
                      </Link>
                    ),
                    key: "1",
                    icon: <FileTextOutlined />,
                  },

                  penjualan.PenerimaanPembayaran.length > 0
                    ? null
                    : {
                        label: (
                          <Link href={`/penjualan/update/${penjualan.id}`}>
                            <a>Edit Sales Invoice</a>
                          </Link>
                        ),
                        key: "2",
                        icon: <EditOutlined />,
                      },

                  {
                    label: <a onClick={() => handleDeletePenjualan(penjualan)}>Delete Sales Invoice</a>,
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
        // onExpand={(expanded, record) => {
        //   console.log("onExpand: ", record, expanded);
        // }}
        dataSource={data?.newPenjualanArray ? data?.newPenjualanArray : []}
        loading={data?.newPenjualanArray ? false : true}
        // onChange={onChange}
      />
    </div>
  );
}
