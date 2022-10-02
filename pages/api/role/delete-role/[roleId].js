import prisma from "../../../../libs/prisma";
import jwtDecode from "jwt-decode";
import moment from "moment";

export default async (req, res) => {
  try {
    /*
     * get current params id
     * if current role has linked users return 400
     * if current role has no linked users return 201 then
     * * delete selected roles in role privellege
     * * delete role
     * * set current datetime, get serverside cookies, decoded token
     * * find role of current loggedIn user
     * * create audit log
     */
    const { roleId } = req.query;

    const findLinkedUsers = await prisma.user.findMany({
      where: {
        role_id: +roleId,
      },
    });

    const findCurrentRole = await prisma.role.findFirst({
      where: {
        id: +roleId,
      },
    });

    if (findLinkedUsers.length > 0) {
      return res.status(400).json({ message: `${findCurrentRole.role_name} role still has linked users` });
    } else if (findLinkedUsers.length == 0) {
      await prisma.rolePrivellege.deleteMany({
        where: {
          role_id: +roleId,
        },
      });

      await prisma.role.delete({
        where: {
          id: +roleId,
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
          page: "/role/delete-role",
          time: currentDatetime,
          action: "DELETE",
          description: `${currentDatetime} | ${decodedAccessToken.first_name} has deleted role "${findCurrentRole.role_name}".`,
        },
      });

      return res.status(201).json({ message: `${findCurrentRole.role_name} role sucessfully deleted` });
    }

    res.status(201).json({ message: "Delete role success" });
  } catch (error) {
    res.status(400).json({ message: "Delete role failed", error });
    console.log(error);
  }
};
