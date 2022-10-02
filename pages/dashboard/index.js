import React from "react";
import Link from "next/link";
import axios from "../../libs/axios";
import CardMax from "../../components/CardMax";
import { authPage } from "../../middlewares/authorizationPage";
import { NotificationOutlined } from "@ant-design/icons";

import { Row, Col } from "antd";
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle
);

const fetcher = (url) => axios.get(url).then((response) => response.data);
const API = "/chart-data/arus-kas";
const API2 = "/chart-data/penjualan-pembelian";

export async function getServerSideProps(context) {
  const { token } = await authPage(context);
  const arusKasInfo = await fetcher(API);
  const penjualanPembelianInfo = await fetcher(API2);

  return {
    props: {
      arusKasInfo: arusKasInfo,
      penjualanPembelianInfo: penjualanPembelianInfo,
    },
  };
}

export default function User({ arusKasInfo, penjualanPembelianInfo }) {
  const data2 = {
    labels: ["Arus Kas & Bank"],
    datasets: [
      {
        label: "Saldo Awal",
        data: [arusKasInfo?.totalSaldoAwal],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Saldo Sekarang",
        data: [arusKasInfo?.totalSaldoSkrg],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const options2 = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Arus Kas",
      },
    },
  };

  const dataPiePenjualan = {
    labels: ["Penjualan Lunas", "Penjualan Jatuh Tempo", "Penjualan Yang Belum Bayar"],
    datasets: [
      {
        data: penjualanPembelianInfo?.allPenjualan,
        backgroundColor: ["rgb(54,190,50)", "rgb(255, 99, 132)", "rgb(54, 162, 235)"],
        hoverOffset: 4,
      },
    ],
  };

  const optionsPenjualan = {
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 1,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Penjualan",
      },
    },
  };

  const dataPiePembelian = {
    labels: ["Pembelian Jatuh Tempo", "Pembelian Yang Belum Bayar"],
    datasets: [
      {
        data: penjualanPembelianInfo?.allPembelian,
        backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
        hoverOffset: 4,
      },
    ],
  };

  const optionsPembelian = {
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 1,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Pembelian",
      },
    },
  };

  return (
    <div>
      <CardMax>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <div className="shadow-md p-4 transition duration-500 hover:scale-105 min-h-full">
              <div className="text-6xl font-sans font-semibold text-slate-800">Dashboard</div>
              <div className="mt-4">
                <div>
                  <NotificationOutlined /> Important Notices:
                </div>
                <div classname="text-lg font-sans">
                  <Link href={"/pembelian"}>
                    <a>Pembelian yang jatuh tempo ({penjualanPembelianInfo?.totalJatuhTempoPembelian})</a>
                  </Link>
                </div>
                <div classname="text-lg font-sans">
                  <Link href={"/penjualan"}>
                    <a>Penjualan yang jatuh tempo ({penjualanPembelianInfo?.totalJatuhTempoPenjualan})</a>
                  </Link>
                </div>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className="p-4 rounded-md shadow-md transition duration-500 hover:scale-105">
              <Doughnut data={dataPiePembelian} options={optionsPembelian} />
            </div>
          </Col>
          <Col span={6}>
            <div className="p-4 rounded-md shadow-md transition duration-500 hover:scale-105">
              <Doughnut data={dataPiePenjualan} options={optionsPenjualan} />
            </div>
          </Col>
          <Col span={10}>
            <div className="p-4 rounded-md shadow-md transition duration-500 hover:scale-105">
              <Bar data={data2} width={100} height={40} options={options2} />
            </div>
          </Col>
        </Row>
      </CardMax>
    </div>
  );
}
