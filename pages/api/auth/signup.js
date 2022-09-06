import { hashPassword } from "../../../helpers/auth";
import {
  connectDatabase,
  getDocument,
  insertDocument,
} from "../../../helpers/db-utils";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!password || password.trim().length < 7) {
      res
        .status(422)
        .json({ message: "Password should be at least 8 characters long." });
      return;
    }
    if (!email || !email.includes("@")) {
      res.status(422).json({ message: "Invalid email." });
      return;
    }

    const client = await connectDatabase();

    const existingUser = await getDocument(client, "users", { email: email });
    if (existingUser) {
      res.status(422).json({ message: "User exists already!" });
      return;
    }

    const result = insertDocument(client, "users", {
      email: email,
      password: await hashPassword(password),
    });
    res.status(201).json({ message: "Created user!" });
  }
};

export default handler;
