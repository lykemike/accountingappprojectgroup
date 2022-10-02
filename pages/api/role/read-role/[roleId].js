import prisma from "../../../../libs/prisma";

export default async (req, res) => {
  try {
    const { roleId } = req.query;

    const currentRole = await prisma.role.findFirst({
      where: {
        id: +roleId,
      },
    });

    const fields = [
      {
        name: ["role_name"],
        value: currentRole.role_name,
      },
      {
        name: ["role_description"],
        value: currentRole.role_desc,
      },
    ];

    res.status(201).json({ message: "Get current role success", currentRole, fields });
  } catch (error) {
    res.status(400).json({ message: "Get current role failed", error });
    console.log(error);
  }
};
