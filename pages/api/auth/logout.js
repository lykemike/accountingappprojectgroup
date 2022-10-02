import moment from "moment";
import { serialize } from "cookie";
import prisma from "../../../libs/prisma";

export default async (req, res) => {
  try {
    const { cookies } = req;
    const jwt = cookies.access_token;
    const userInfo = req.body;

    if (!jwt) {
      return res.json({ message: "Are already not logged in..." });
    } else {
      await prisma.user.update({
        where: {
          id: +userInfo.id,
        },
        data: {
          logged_in: false,
        },
      });

      const currentDatetime = moment().toISOString().substring(0, 10) + " " + moment().format("HH:mm");
      const findRole = await prisma.role.findFirst({
        where: {
          id: +userInfo.role,
        },
      });

      await prisma.auditLog.create({
        data: {
          user: userInfo.first_name,
          role: findRole.role_name,
          page: "/logout",
          time: currentDatetime,
          action: "LOGOUT",
          description: `${currentDatetime} | ${userInfo.first_name} has logged out.`,
        },
      });

      const serialized = serialize("access_token", null, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: -1,
        path: "/",
      });

      res.setHeader("Set-Cookie", serialized);

      res.status(200).json({ message: "Logout successful" });
    }

    res.status(200).json({ message: "Logout sucessfully" });
  } catch (error) {
    res.status(400).json({ message: "Logout Failed", error });
  }
};
