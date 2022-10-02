import moment from "moment";
import jwtDecode from "jwt-decode";
import prisma from "../../../libs/prisma";

export default async (req, res) => {
  try {
    /*
     * get current params id
     * get input data from frontend
     * create role
     * create role privellege
     * set current datetime, get serverside cookies, decoded token
     * find role of current loggedIn user
     * create audit log
     */
    const { role_name, role_description, menu_options } = req.body;
    await prisma.role.create({
      data: {
        role_name: role_name,
        role_desc: role_description,
      },
    });

    const findLatestRole = await prisma.role.findFirst({
      orderBy: {
        id: "desc",
      },
    });

    const currentDatetime = moment().toISOString().substring(0, 10) + " " + moment().format("HH:mm");
    const { cookies } = req;
    const accessToken = cookies.access_token;
    const decodedAccessToken = jwtDecode(accessToken);

    const findRole = await prisma.role.findFirst({
      where: {
        id: +decodedAccessToken.role,
      },
    });

    await prisma.auditLog.create({
      data: {
        user: decodedAccessToken.first_name,
        role: findRole.role_name,
        page: "/role/add-role",
        time: currentDatetime,
        action: "CREATE",
        description: `${currentDatetime} | ${decodedAccessToken.first_name} has created a new role "${findLatestRole.role_name}".`,
      },
    });

    res.status(201).json({ message: "Create role success" });
  } catch (error) {
    res.status(400).json({ message: "Create role failed", error });
    console.log(error);
  }
};
