import prisma from "../../../../libs/prisma";
import jwtDecode from "jwt-decode";
import moment from "moment";

export default async (req, res) => {
  try {
    /*
     * get current params id
     * get current user data
     * set current datetime, get serverside cookies, decoded token
     * find role of current loggedIn user
     * check if user is logged in or not
     * create audit log
     */
    const { userId } = req.query;
    const checkLoggedIn = await prisma.user.findFirst({
      where: {
        id: +userId,
      },
      select: {
        logged_in: true,
        first_name: true,
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

    if (checkLoggedIn.logged_in == true) {
      return res.status(400).json({ message: `User ${checkLoggedIn.first_name} is still logged in` });
    } else if (checkLoggedIn.logged_in == false) {
      await prisma.user.delete({
        where: {
          id: +userId,
        },
      });

      await prisma.auditLog.create({
        data: {
          user: decodedAccessToken.first_name,
          role: findRole.role_name,
          page: "/user",
          time: currentDatetime,
          action: "DELETE",
          description: `${currentDatetime} | ${decodedAccessToken.first_name} has deleted user "${checkLoggedIn.first_name}".`,
        },
      });

      return res.status(201).json({ message: `User ${checkLoggedIn.first_name} sucessfully deleted` });
    }

    res.status(201).json({ message: "Delete user success" });
  } catch (error) {
    res.status(400).json({ message: "Delete user failed", error });
    console.log(error);
  }
};
