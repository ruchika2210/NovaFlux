import { Hono } from "hono";
import {z} from "zod";
import { db } from "@/db/drizzle";
import { accounts, insertAccountSchema } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { createId } from "@paralleldrive/cuid2";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";

const app = new Hono()
  // GET endpoint to fetch user-specific accounts
  .get("/", clerkMiddleware(), async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) {
      throw new HTTPException(401, { error: "Unauthorized" });
    }
    const data = await db
      .select({
        id: accounts.id,
        name: accounts.name,
      })
      .from(accounts)
      .where(eq(accounts.userId, auth.userId));

    return c.json({ data });
  })
  // POST endpoint to create a new account
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertAccountSchema.pick({ name: true })),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        throw new HTTPException(401, { error: "Unauthorized" });
      }

      const values = c.req.valid("json");

      try {
        const [data] = await db
          .insert(accounts)
          .values({
            id: createId(),
            userId: auth.userId,
            ...values,
          })
          .returning();

        return c.json({ data });
      } catch (error) {
        // Handle database or other operational errors
        throw new HTTPException(500, { error: "Internal Server Error" });
      }
    }
  )
  .post("/bulk-delete",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        ids:z.array(z.string()),
      })
    ),
    async(c) =>{
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if(!auth?.userId){
        return c.json({error:"Unauthorozed"}, 401)
      }

      const data = await db
      .delete(accounts)
      .where(
          and(
            eq(accounts.userId, auth.userId),
            inArray(accounts.id,values.ids)
          )
      )
      .returning({
        id:accounts.id
      })

      return c.json({data});
    }

  )

export default app;
