import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const insertUser = async (user: typeof UserTable.$inferInsert) => {
  await db.insert(UserTable).values(user).onConflictDoNothing();
};

export const updateUser = async (
  id: string,
  user: Partial<typeof UserTable.$inferInsert>
) => {
  await db.update(UserTable).set(user).where(eq(UserTable.id, id));
};

export const deleteUser = async (id: string) => {
  await db.delete(UserTable).where(eq(UserTable.id, id));
};
