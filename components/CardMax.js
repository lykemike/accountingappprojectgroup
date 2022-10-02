import React from "react";
import { Card } from "antd";

export default function CardMax({ children }) {
  return (
    <div
      className="bg-white rounded-md"
      style={{
        padding: 30,
        margin: 0,
        minHeight: "100vh",
      }}
    >
      {children}
    </div>
    // <Card
    //   style={{
    //     padding: 4,
    //     margin: 0,
    //     minHeight: "100vh",
    //   }}
    // >
    //   {children}
    // </Card>
  );
}
