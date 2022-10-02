import prisma from "../../../../libs/prisma";
import bcrypt from "bcrypt";
import jwtDecode from "jwt-decode";
import moment from "moment";

export default async (req, res) => {
  try {
    /*
     * get current params id
     * get input data from frontend
     * hash password
     * update
     * find the updated data for audit purposes
     * set current datetime, get serverside cookies, decoded token
     * find role of current loggedIn user
     * create audit log
     */
    const { userId } = req.query;
    const { first_name, last_name, email, password, role_id } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    await prisma.user.update({
      where: {
        id: +userId,
      },
      data: {
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: passwordHash,
        role_id: role_id,
      },
    });

    const findUpdatedUser = await prisma.user.findFirst({
      where: {
        id: +userId,
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
        page: "/user/update-user",
        time: currentDatetime,
        action: "UPDATE",
        description: `${currentDatetime} | ${decodedAccessToken.first_name} has updated user "${findUpdatedUser.first_name}".`,
      },
    });

    res.status(201).json({ message: "Update user success" });
  } catch (error) {
    res.status(400).json({ message: "Update user failed", error });
    console.log(error);
  }
};
