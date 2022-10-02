import React from "react";
import TableViews from "./components/TableViews";
import CardMax from "../../components/CardMax";
import { authPage } from "../../middlewares/authorizationPage";
import { Breadcrumb } from "antd";

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
        </Breadcrumb>
      </div>

      <CardMax>
        <TableViews />
      </CardMax>
    </div>
  );
}
