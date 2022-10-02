import prisma from "../../../libs/prisma";

export default async (req, res) => {
  try {
    const getRoles = await prisma.role.findMany({
      orderBy: {
        id: "asc",
      },
    });

    res.status(201).json({ message: "Get all roles success", getRoles });
  } catch (error) {
    res.status(400).json({ message: "Get all roles failed", error });
    console.log(error);
  }
};
