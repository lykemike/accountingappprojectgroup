// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  try {
    console.log(hey);
    res.status(201).json({ message: "Seed default data success" });
  } catch (error) {
    res.status(400).json({ message: "Seed default data failed", error });
    console.log(error);
  }
}
