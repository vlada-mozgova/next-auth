import { getSession } from "next-auth/react";
import { hashPassword, verifyPassword } from "../../../helpers/auth";
import {
  connectDatabase,
  getDocument,
  updateDocument,
} from "../../../helpers/db-utils";

const handler = async (req, res) => {
  if (req.method !== "PATCH") return;
  const session = await getSession({ req: req });

  if (!session) {
    res.status(401).json({ message: "Not authenticated!" });
    return;
  }

  const userEmail = session.user.email;
  const { oldPassword, newPassword } = req.body;

  const client = await connectDatabase();
  const user = await getDocument(client, "users", { email: userEmail });

  if (!user) {
    res.status(404).json({ message: "User not found." });
    return;
  }

  const currentPassword = user.password;
  const isValidPassword = await verifyPassword(oldPassword, currentPassword);
  if (!isValidPassword) {
    res.status(403).json({ message: "Invalid paasword." });
    return;
  }

  await updateDocument(
    client,
    "users",
    { email: userEmail },
    { $set: { password: await hashPassword(newPassword) } }
  );

  res.status(200).json({ message: "Password updated!" });
};

export default handler;
