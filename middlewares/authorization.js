import jwt from "jsonwebtoken";

export default async (req, res) => {
  return new Promise((resolve, reject) => {
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({ message: "User not authorized" }).end();

    const authSplit = authorization.split(" ");

    const [authType, authToken] = [authSplit[0], authSplit[1]];

    if (authType !== "Bearer") return res.status(401).end();

    return jwt.verify(authToken, process.env.JWT_SECRET, function (err, decoded) {
      if (err) return res.status(401).end();
      return resolve(decoded);
    });
  });

  // try {

  //   const { authorization } = req.headers;
  //   if (!authorization) return res.status(401).json({ message: "User not authorized" }).end();

  //   const authSplit = authorization.split(" ");

  //   const [authType, authToken] = [authSplit[0], authSplit[1]];

  //   if (authType !== "Bearer") return res.status(401).end();

  //   jwt.verify(authToken, "secretkeyyyy");

  //   res.status(200).json({ message: "Get users sucessfully", data: users });
  // } catch (error) {
  //   res.status(400).json({ message: "Get users failed", error });
  // }
};
