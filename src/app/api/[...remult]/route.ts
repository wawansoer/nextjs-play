import { Task } from '@/shared/Task'
import { remultNextApp } from 'remult/remult-next'
import { createPostgresDataProvider } from "remult/postgres"

const DB_URL = process.env.DATABASE_URL

const api = remultNextApp({
  entities: [Task],
  // TODO : Implement User Admin
  admin: true,
  dataProvider: DB_URL ? createPostgresDataProvider({ connectionString: DB_URL }) : undefined,
})
export const { POST, PUT, DELETE, GET } = api