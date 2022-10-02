import React from "react";
import Link from "next/link";
import TableViews from "./components/TableViews";
import CardMax from "../../components/CardMax";
import { authPage } from "../../middlewares/authorizationPage";
import { Breadcrumb, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export async function getServerSideProps(context) {
  const { token } = await authPage(context);

  return {
    props: {},
  };
}

export default function Role() {
  return (
    <div>
      <div name="breadcrumb" className="mb-2">
        <Breadcrumb>
          <Breadcrumb.Item>Role</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <CardMax>
        <TableViews />
      </CardMax>
    </div>
  );
}
