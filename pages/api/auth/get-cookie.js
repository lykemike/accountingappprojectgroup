export default async function (req, res) {
  const { cookies } = req;

  // const jwt = cookies.access_token;
  const jwt = cookies.token;

  res.json({ message: "success", data: jwt });
}
