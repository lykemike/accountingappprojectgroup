import React from "react";
import { Table, TableRow, TableCell, TableFooter, TableBody, Paper, TableContainer } from "@mui/material/";

export default function TableViewsArusKas({ dataArusKas, kasBersih }) {
  return (
    <div>
      <TableContainer className="shadow-md rounded-md">
        <Table size="small">
          {/* <TableHead className="bg-dark">
            <TableRow>
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead> */}

          <TableBody>
            <TableRow>
              <TableCell>
                <span className="font-sans font-semibold text-xl">Arus kas dari Aktivitas Operasional</span>
              </TableCell>
              <TableCell />
              <TableCell />
            </TableRow>

            <TableRow>
              <TableCell>
                <span className="font-sans">Penerimaan dari pelanggan</span>
              </TableCell>
              <TableCell />
              <TableCell align="right">
                <span className="font-sans">
                  {dataArusKas?.filter((i) => i.penerimaan_dari_pelanggan).map((j) => j.penerimaan_dari_pelanggan).length == 0
                    ? "Rp. 0"
                    : dataArusKas?.filter((i) => i.penerimaan_dari_pelanggan).map((j) => j.penerimaan_dari_pelanggan)}
                </span>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <span className="font-sans">Aset Lancar Lainya</span>
              </TableCell>
              <TableCell />
              <TableCell align="right">
                <span className="font-sans">
                  {dataArusKas?.filter((i) => i.aset).map((j) => j.aset).length == 0
                    ? "Rp. 0"
                    : dataArusKas?.filter((i) => i.aset).map((j) => j.aset)}
                </span>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <span className="font-sans">Pembayaran ke Pemasok</span>
              </TableCell>
              <TableCell />
              <TableCell align="right">
                <span className="font-sans">
                  {dataArusKas?.filter((i) => i.pembayaran).map((j) => j.pembayaran).length == 0
                    ? "Rp. 0"
                    : dataArusKas?.filter((i) => i.pembayaran).map((j) => j.pembayaran)}
                </span>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <span className="font-sans">Kartu Kredit dan Liabilitas Jangka Pendek Lainnya</span>
              </TableCell>
              <TableCell />
              <TableCell align="right">
                <span className="font-sans">
                  {dataArusKas?.filter((i) => i.kartukredit).map((j) => j.kartukredit).length == 0
                    ? "Rp. 0"
                    : dataArusKas?.filter((i) => i.kartukredit).map((j) => j.kartukredit)}
                </span>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <span className="font-sans">Pendapatan Lainnya</span>
              </TableCell>
              <TableCell />
              <TableCell align="right">
                <span className="font-sans">
                  {dataArusKas?.filter((i) => i.pendapatanlain).map((j) => j.pendapatanlain).length == 0
                    ? "Rp. 0"
                    : dataArusKas?.filter((i) => i.pendapatanlain).map((j) => j.pendapatanlain)}
                </span>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <span className="font-sans">Pengeluaran operasional</span>
              </TableCell>
              <TableCell />
              <TableCell align="right">
                <span className="font-sans">
                  {dataArusKas?.filter((i) => i.pengeluaran).map((j) => j.pengeluaran).length == 0
                    ? "Rp. 0"
                    : dataArusKas?.filter((i) => i.pengeluaran).map((j) => j.pengeluaran)}
                </span>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <span className="font-sans ml-6">KAS BERSIH YANG DIPEROLEH DARI AKTIVIAS OPERASIONAL</span>
              </TableCell>
              <TableCell />
              <TableCell align="right">
                <span className="font-sans">{kasBersih[0]?.aktivias_opr}</span>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <span className="font-sans font-semibold text-xl">Arus kas dari akativitas investasi</span>
              </TableCell>
              <TableCell />
              <TableCell />
            </TableRow>

            <TableRow>
              <TableCell>
                <span className="font-sans">Perolehan/Penjualan Aset</span>
              </TableCell>
              <TableCell />
              <TableCell align="right">
                <span className="font-sans">
                  {dataArusKas?.filter((i) => i.penjualanaset).map((j) => j.penjualanaset).length == 0
                    ? "Rp. 0"
                    : dataArusKas?.filter((i) => i.penjualanaset).map((j) => j.penjualanaset)}
                </span>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <span className="font-sans">Aktivitas Investasi Lainnya</span>
              </TableCell>
              <TableCell />
              <TableCell align="right">
                <span className="font-sans">
                  {dataArusKas?.filter((i) => i.aktivitas).map((j) => j.aktivitas).length == 0
                    ? "Rp. 0"
                    : dataArusKas?.filter((i) => i.aktivitas).map((j) => j.aktivitas)}
                </span>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <span className="font-sans ml-6">KAS BERSIH YANG DIPEROLEH DARI AKTIVITAS INVESTASI</span>
              </TableCell>
              <TableCell />
              <TableCell align="right">
                <span className="font-sans">{kasBersih[0]?.aktivias_inv}</span>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <span className="font-sans font-semibold text-xl">Arus kas dari Aktivitas Pendanaan</span>
              </TableCell>
              <TableCell />
              <TableCell />
            </TableRow>

            <TableRow>
              <TableCell>
                <span className="font-sans">Pembayaran/Penerimaan pinjaman</span>
              </TableCell>
              <TableCell />
              <TableCell align="right">
                <span className="font-sans">
                  {dataArusKas?.filter((i) => i.penerimaanpinjaman).map((j) => j.penerimaanpinjaman).length == 0
                    ? "Rp. 0"
                    : dataArusKas?.filter((i) => i.penerimaanpinjaman).map((j) => j.penerimaanpinjaman)}
                </span>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <span className="font-sans">Ekuitas/Modal</span>
              </TableCell>
              <TableCell />
              <TableCell align="right" />
            </TableRow>

            <TableRow>
              <TableCell>
                <span className="font-sans ml-6">KAS BERSIH YANG DIPEROLEH DARI AKTIVIAS PENDANAAN</span>
              </TableCell>
              <TableCell />
              <TableCell align="right">
                <span className="font-sans">{kasBersih[0]?.aktivias_dana}</span>
              </TableCell>
            </TableRow>
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell>
                <span className="font-sans text-base">Kenaikan(Penurunan) Kas</span>
              </TableCell>
              <TableCell />
              <TableCell align="right">
                <span className="font-sans">{kasBersih[0]?.total}</span>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <span className="font-sans text-base">Saldo Kas Awal</span>
              </TableCell>
              <TableCell />
              <TableCell align="right">
                <span className="font-sans">{kasBersih[0]?.saldo_awal}</span>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <span className="font-sans text-base">Saldo Kas Akhir</span>
              </TableCell>
              <TableCell />
              <TableCell align="right">
                <span className="font-sans">{kasBersih[0]?.saldo_akhir}</span>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
}
