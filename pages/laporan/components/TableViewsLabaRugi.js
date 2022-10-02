import React from "react";
import { Table, TableRow, TableCell, TableFooter, TableBody, Paper, TableContainer, Typography } from "@mui/material/";

export default function TableViewsArusKas({
  labaRugi,
  labaKotor,
  pendapatanBersihOperasional,
  pendapatanBersihSebelumPajak,
  pendapatanBersihSesudahPajak,
  bebanSelainBebanPajak,
}) {
  return (
    <div>
      <TableContainer className="shadow-md rounded-md">
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell>
                <span className="font-sans">Pendapatan Penjualan</span>
              </TableCell>
              <TableCell align="right" />
              <TableCell align="right">
                <span className="font-sans">
                  {`Rp. ${labaRugi
                    ?.filter((i) => i.label == "Pendapatan Penjualan")
                    .map((j) => j.total)
                    .toLocaleString({ minimumFractionDigits: 0 })}`}
                </span>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <span className="font-sans">Harga Pokok Penjualan</span>
              </TableCell>
              <TableCell align="right" />
              <TableCell align="right">
                <span className="font-sans">
                  {labaRugi?.filter((i) => i.label == "Harga Pokok Penjualan").map((j) => j.total)
                    ? `Rp. ${labaRugi
                        ?.filter((i) => i.label == "Harga Pokok Penjualan")
                        .map((j) => j.total)
                        .toLocaleString()}`
                    : "Rp. 0"}
                </span>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <span className="font-sans font-semibold text-xl">TOTAL LABA KOTOR</span>
              </TableCell>
              <TableCell />
              <TableCell align="right">
                <span className="font-sans font-semibold text-xl">{labaKotor ? `Rp. ${labaKotor.toLocaleString()}` : "Rp. 0"}</span>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <span className="font-sans">Beban Operasional</span>
              </TableCell>
              <TableCell align="right" />
              <TableCell align="right" />
            </TableRow>

            {bebanSelainBebanPajak?.map((i, index) => (
              <TableRow key={index}>
                <TableCell>
                  <span className="font-sans ml-4">{i.label}</span>
                </TableCell>
                <TableCell>
                  <span className="font-sans">{`Rp. ${i.data.reduce((a, b) => (a = a + b.debit), 0).toLocaleString()}`}</span>
                </TableCell>
                <TableCell align="right" />
              </TableRow>
            ))}

            <TableRow>
              <TableCell>
                <span className="font-sans">Total Beban Operasional</span>
              </TableCell>
              <TableCell align="right" />
              <TableCell align="right">
                {"Rp. " +
                  labaRugi
                    ?.filter((i) => i.label == "Beban Selain Beban Pajak")
                    .map((j) => j.total)
                    .toLocaleString({ minimumFractionDigits: 0 })}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <span className="font-sans font-semibold text-xl">PENDAPATAN BERSIH OPERASIONAL</span>
              </TableCell>
              <TableCell />
              <TableCell align="right">
                <span className="font-sans font-semibold text-xl">
                  {pendapatanBersihOperasional ? `Rp. ${pendapatanBersihOperasional.toLocaleString()}` : "Rp. 0"}
                </span>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <span className="font-sans">Pendapatan Lainnya</span>
              </TableCell>
              <TableCell align="right" />
              <TableCell align="right">
                <span className="font-sans">
                  {labaRugi
                    ?.filter((i) => i.label == "Pendapatan Lainnya")
                    .map((j) => j.total)
                    .toLocaleString({ minimumFractionDigits: 0 })
                    ? `Rp. ${labaRugi
                        ?.filter((i) => i.label == "Pendapatan Lainnya")
                        .map((j) => j.total)
                        .toLocaleString({ minimumFractionDigits: 0 })}`
                    : `Rp. 0`}
                </span>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <span className="font-sans">Beban Lainnya</span>
              </TableCell>
              <TableCell align="right" />
              <TableCell align="right">
                <span className="font-sans">
                  {labaRugi
                    ?.filter((i) => i.label == "Beban Lainnya Selain Beban Pajak")
                    .map((j) => j.total)
                    .toLocaleString({ minimumFractionDigits: 0 })
                    ? `Rp. ${labaRugi
                        ?.filter((i) => i.label == "Beban Lainnya Selain Beban Pajak")
                        .map((j) => j.total)
                        .toLocaleString({ minimumFractionDigits: 0 })}`
                    : `Rp. 0`}
                </span>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <span className="font-sans font-semibold text-xl">PENDAPATAN BERSIH SEBELUM PAJAK</span>
              </TableCell>
              <TableCell />
              <TableCell align="right">
                <span className="font-sans font-semibold text-xl">
                  {pendapatanBersihSebelumPajak ? `Rp. ${pendapatanBersihSebelumPajak.toLocaleString()}` : "Rp. 0"}
                </span>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <span className="font-sans">Beban Pajak</span>
              </TableCell>
              <TableCell align="right" />
              <TableCell align="right">
                {labaRugi?.filter((i) => i.label == "Beban Pajak").map((j) => j.total)
                  ? `Rp. ${labaRugi
                      ?.filter((i) => i.label == "Beban Pajak")
                      .map((j) => j.total)
                      .toLocaleString({ minimumFractionDigits: 0 })}`
                  : "Rp. 0"}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <span className="font-sans font-semibold text-xl">PENDAPATAN BERSIH SESUDAH PAJAK</span>
              </TableCell>
              <TableCell />
              <TableCell align="right">
                <span className="font-sans font-semibold text-xl">
                  {pendapatanBersihSesudahPajak ? `Rp. ${pendapatanBersihSesudahPajak.toLocaleString()}` : "Rp. 0"}
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
