import Link from "next/link";
import React from "react";
import CardMax from "../../components/CardMax";
import { authPage } from "../../middlewares/authorizationPage";
import TableViewsClient from "./components/TableViewsClient";
import TableViewsKaryawan from "./components/TableViewsKaryawan";
import TableViewsLainnya from "./components/TableViewsLainnya";
import TableViewsPrinciple from "./components/TableViewsPrinciple";
import TableViewsSupplier from "./components/TableViewsSupplier";

import { PlusOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Tabs } from "antd";
const { TabPane } = Tabs;

export async function getServerSideProps(context) {
  const { token } = await authPage(context);

  return {
    props: {},
  };
}

export default function kontak() {
  return (
    <div>
      <div className="mb-2">
        <Breadcrumb>
          <Breadcrumb.Item>Kontak</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <CardMax>
        <div name="primary-button" className="flex justify-end mb-4">
          <Link href="./kontak/add-kontak">
            <Button type="primary" icon={<PlusOutlined />}>
              Add Kontak
            </Button>
          </Link>
        </div>

        <Tabs defaultActiveKey="1">
          <TabPane tab="Client" key="1">
            <TableViewsClient />
          </TabPane>
          <TabPane tab="Supplier" key="2">
            <TableViewsSupplier />
          </TabPane>
          <TabPane tab="Principle" key="3">
            <TableViewsPrinciple />
          </TabPane>
          <TabPane tab="Karyawan" key="4">
            <TableViewsKaryawan />
          </TabPane>
          <TabPane tab="Lainnya" key="5">
            <TableViewsLainnya />
          </TabPane>
        </Tabs>
      </CardMax>
    </div>
  );
}
