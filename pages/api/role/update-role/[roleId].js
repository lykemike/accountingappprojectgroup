import moment from "moment";
import jwtDecode from "jwt-decode";
import prisma from "../../../../libs/prisma";

export default async (req, res) => {
  try {
    /*
     * get current params id
     * get input data from frontend
     * update
     * delete then insert new updated
     * set current datetime, get serverside cookies, decoded token
     * find role of current loggedIn user
     * create audit log
     */

    const { roleId } = req.query;
    const { role_name, role_description } = req.body;

    await prisma.role.update({
      where: {
        id: +roleId,
      },
      data: {
        role_name: role_name,
        role_desc: role_description,
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
        page: "/role/update-role",
        time: currentDatetime,
        action: "UPDATE",
        description: `${currentDatetime} | ${decodedAccessToken.first_name} has updated role "${role_name}".`,
      },
    });

    res.status(201).json({ message: "Update role success" });
  } catch (error) {
    res.status(400).json({ message: "Update role failed", error });
    console.log(error);
  }
};
