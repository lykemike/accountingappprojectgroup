import prisma from "../../../libs/prisma";

export default async (req, res) => {
  try {
    const getUsers = await prisma.user.findMany({
      orderBy: {
        id: "asc",
      },
      include: {
        role: {
          select: {
            role_name: true,
          },
        },
      },
    });

    const newUsersArray = [];
    getUsers.map((i) => {
      newUsersArray.push({
        id: i.id,
        first_name: i.first_name,
        last_name: i.last_name,
        email: i.email,
        role_name: i.role.role_name,
      });
    });

    res.status(201).json({ message: "Get all users success", newUsersArray });
  } catch (error) {
    res.status(400).json({ message: "Get all users failed", error });
    console.log(error);
  }
};
