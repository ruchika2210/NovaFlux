import { Hono } from "hono";
import { z } from "zod";
import { db } from "@/db/drizzle";
import { accounts } from "@/db/schema";
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
      throw new HTTPException(401, { message: "Unauthorized" });
    }
    try {
      const data = await db
        .select({
          id: accounts.id,
          name: accounts.name,
        })
        .from(accounts)
        .where(eq(accounts.userId, auth.userId));

      return c.json({ data });
    } catch (error) {
      throw new HTTPException(500, { message: "Internal Server Error" });
    }
  })
  // POST endpoint to create a new account
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", z.object({ name: z.string().nonempty() })),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        throw new HTTPException(401, { message: "Unauthorized" });
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
        throw new HTTPException(500, { message: "Internal Server Error" });
      }
    }
  )
  // POST endpoint for bulk delete accounts
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        throw new HTTPException(401, { message: "Unauthorized" });
      }

      try {
        const data = await db
          .delete(accounts)
          .where(
            and(
              eq(accounts.userId, auth.userId),
              inArray(accounts.id, values.ids)
            )
          )
          .returning({
            id: accounts.id,
          });

        return c.json({ data });
      } catch (error) {
        throw new HTTPException(500, { message: "Internal Server Error" });
      }
    }
  );

export default app;
