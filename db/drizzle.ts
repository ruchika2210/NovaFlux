import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { accounts } from "./schema";


export const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);


