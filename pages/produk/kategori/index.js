import React from "react";
import Link from "next/link";
import TableViews from "./components/TableViews";
import CardMax from "../../../components/CardMax";
import { authPage } from "../../../middlewares/authorizationPage";
import { Breadcrumb, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AddModal from "./components/AddModal";

export async function getServerSideProps(context) {
  const { token } = await authPage(context);

  return {
    props: {},
  };
}

export default function Produk() {
  return (
    <div>
      <div name="breadcrumb" className="mb-4">
        <Breadcrumb>
          <Breadcrumb.Item>Produk</Breadcrumb.Item>
          <Breadcrumb.Item>Kategori</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <CardMax>
        <div className="flex justify-end mb-4 space-x-2">
          {/* <Button type="primary" icon={<PlusOutlined />}>
            Add Kategori
          </Button> */}
          <AddModal />
        </div>

        <TableViews />
      </CardMax>
    </div>
  );
}
