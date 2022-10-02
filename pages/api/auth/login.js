import moment from "moment";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import prisma from "../../../libs/prisma";

export default async (req, res) => {
  // if (req.method !== "POST") return res.status(405).end();

  try {
    const { email, password } = req.body;
    const checkUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
      include: {
        role: true,
      },
    });

    if (!checkUser) return res.status(401).json({ message: "Incorrect email" }).end();

    const checkPassword = await bcrypt.compare(password, checkUser.password);
    if (!checkPassword) return res.status(401).json({ message: "Incorrect password" }).end();

    await prisma.user.update({
      where: {
        id: checkUser.id,
      },
      data: {
        logged_in: true,
      },
    });

    const currentDatetime = moment().toISOString().substring(0, 10) + " " + moment().format("HH:mm");
    await prisma.auditLog.create({
      data: {
        user: checkUser.first_name,
        role: checkUser.role.role_name,
        page: "/auth/login",
        time: currentDatetime,
        action: "LOGIN",
        description: `${currentDatetime} | ${checkUser.first_name} has logged in.`,
      },
    });

    const access_token = jwt.sign(
      {
        id: checkUser.id,
        first_name: checkUser.first_name,
        role: checkUser.role_id,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 1 day
      },
      process.env.JWT_SECRET
    );

    const serialized = serialize("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 60 * 60 * 24 * 1 => (60 seconds in 1 minute x 60 minutes in 1 hours x 24 hours x 1 (day))
      path: "/",
    });

    res.setHeader("Set-Cookie", serialized);

    res.status(200).json({ message: "Login sucessfully", access_token, serialized });
  } catch (error) {
    res.status(400).json({ message: "Login Failed", error });
  }
};
