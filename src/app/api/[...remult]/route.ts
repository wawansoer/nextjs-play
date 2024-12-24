import { Task } from "@/shared/Task";
import { remultNextApp } from "remult/remult-next";
import { createPostgresDataProvider } from "remult/postgres";
import { authOptions } from "@/utils/auth";
import { prisma } from "@/utils/prismaDB";
import { getServerSession } from "next-auth";
import { remult } from "remult";
import { randomUUID } from "crypto";

const DB_URL = process.env.DATABASE_URL;

const api = remultNextApp({
  entities: [Task],
  // TODO : Implement User Admin
  getUser: async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user) return undefined;

    return {
      id: randomUUID(),
      email: session.user.email,
      roles: ["user"],
    };
  },
  admin: true,
  dataProvider: DB_URL
    ? createPostgresDataProvider({ connectionString: DB_URL })
    : undefined,
});

export const { POST, PUT, DELETE, GET } = api;
