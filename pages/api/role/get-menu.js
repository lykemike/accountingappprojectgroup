import prisma from "../../../libs/prisma";

export default async (req, res) => {
  try {
    const getMenus = await prisma.menu.findMany();

    const getMenuOptions = [];
    getMenus?.map((i) => {
      getMenuOptions.push({
        label: i.menu_name,
        value: "" + i.id,
      });
    });

    res.status(201).json({ message: "Get all menus success", getMenuOptions });
  } catch (error) {
    res.status(400).json({ message: "Get all menus failed", error });
    console.log(error);
  }
};
