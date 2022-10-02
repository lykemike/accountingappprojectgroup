import prisma from "../../../libs/prisma";
import moment from "moment";

export default async (req, res) => {
  try {
    const getAuditLogData = await prisma.auditLog.findMany({
      orderBy: {
        id: "desc",
      },
    });

    const newAuditArray = [];
    getAuditLogData.map((i) => {
      const splitDate = i.time.split(" ");

      newAuditArray.push({
        key: i.id,
        user: i.user,
        role: i.role,
        action: i.action,
        description: i.description.split(" | ")[1],
        date: moment(splitDate[0]).format("LL"),
        time: splitDate[1],
      });
    });

    res.status(201).json({ message: "Get all audit log data success", newAuditArray });
  } catch (error) {
    res.status(400).json({ message: "Get all audit log data failed", error });
    console.log(error);
  }
};
