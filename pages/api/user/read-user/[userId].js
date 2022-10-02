import prisma from "../../../../libs/prisma";

export default async (req, res) => {
  try {
    const { userId } = req.query;

    const currentUser = await prisma.user.findFirst({
      where: {
        id: +userId,
      },
    });

    const getAllRoles = await prisma.role.findMany({
      orderBy: {
        role_name: "asc",
      },
    });

    const fields = [
      {
        name: ["first_name"],
        value: currentUser.first_name,
      },
      {
        name: ["last_name"],
        value: currentUser.last_name,
      },
      {
        name: ["email"],
        value: currentUser.email,
      },
      {
        name: ["role_id"],
        value: currentUser.role_id,
      },
    ];

    res.status(201).json({ message: "Create role success", currentUser, getAllRoles, fields });
  } catch (error) {
    res.status(400).json({ message: "Create role failed", error });
    console.log(error);
  }
};
