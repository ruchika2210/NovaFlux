import { Hono } from "hono";
import { z } from "zod";
import { db } from "@/db/drizzle";
import { categories , insertCategorySchema } from "@/db/schema";
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
          id: categories.id,
          name: categories.name,
        })
        .from(categories)
        .where(eq(categories.userId, auth.userId));

      return c.json({ data });
    } catch (error) {
      throw new HTTPException(500, { message: "Internal Server Error" });
    }
  })

  // .get("/:id", clerkMiddleware(), async (c) => {
  //   const auth = getAuth(c);
  //   const { id } = c.req.valid("param");

  //   if (!auth?.userId) {
  //     throw new HTTPException(401, { message: "Unauthorized" });
  //   }

  //   try {
  //     const data = await db
  //       .select({
  //         id: accounts.id,
  //         name: accounts.name,
  //       })
  //       .from(accounts)
  //       .where(
  //         and(
  //           eq(accounts.userId, auth.userId),
  //           eq(accounts.id, id)
  //         )
  //       );

  //     if (data.length === 0) {
  //       throw new HTTPException(404, { message: "Account not found" });
  //     }

  //     return c.json({ data: data[0] }); // Returning the first (and only) result
  //   } catch (error) {
  //     throw new HTTPException(500, { message: "Internal Server Error" });
  //   }
  // })

  // .get("/:id", clerkMiddleware(), async (c) => {
  //   const auth = getAuth(c);
  //   const { id } = c.req.valid<string>("param");
  
  //   if (!auth?.userId) {
  //     throw new HTTPException(401, { message: "Unauthorized" });
  //   }
  
  //   try {
  //     const data = await db
  //       .select({
  //         id: accounts.id,
  //         name: accounts.name,
  //       })
  //       .from(accounts)
  //       .where(
  //         and(
  //           eq(accounts.userId, auth.userId),
  //           eq(accounts.id, id)
  //         )
  //       );
  
  //     if (data.length === 0) {
  //       throw new HTTPException(404, { message: "Account not found" });
  //     }
  // console.log(data,"acc data")
  //     return c.json({ data: data[0] }); // Returning the first (and only) result
  //   } catch (error) {
  //     throw new HTTPException(500, { message: "Internal Server Error" });
  //   }
  // })

  .get("/:id",
    zValidator("param", z.object({
      id:z.string().optional(),
    })),
    clerkMiddleware(),
    async(c) =>{
      const auth = getAuth(c);
      const {id} = c.req.valid("param");
      if(!id){
        return c.json({message:"Missing id"}, 400)
      }

      if(!auth?.userId){
        return c.json({message:"Unauthorized"}, 401)

      }
      const [data] = await db.select({
        id:categories.id,
        name:categories.name
      })

      .from(categories)
      .where(
        and(
          eq(categories.userId,auth.userId),
          eq(categories.id,id)
        ),

      )

      if(!data){
        return c.json({message:"Not found"}, 404)
      }

      return c.json({data})
    }
  )

  // POST endpoint to create a new account
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertCategorySchema.pick({
        name:true
    })),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        throw new HTTPException(401, { message: "Unauthorized" });
      }

      const values = c.req.valid("json");

      try {
        const [data] = await db
          .insert(categories)
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
          .delete(categories)
          .where(
            and(
              eq(categories.userId, auth.userId),
              inArray(categories.id, values.ids)
            )
          )
          .returning({
            id: categories.id,
          });

        return c.json({ data });
      } catch (error) {
        throw new HTTPException(500, { message: "Internal Server Error" });
      }
    }
  )

  // PATCH endpoint to update an account by ID
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    zValidator(
      "json",
      insertCategorySchema.pick({
        name: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!id) {
        return c.json({ message: "Missing id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ message: "Unauthorized" }, 401);
      }

      try {
        const [data] = await db
          .update(categories)
          .set(values)
          .where(
            and(
              eq(categories.userId, auth.userId),
              eq(categories.id, id)
            )
          )
          .returning(); // Corrected placement of returning() method

        if (!data) {
          return c.json({ message: "Not Found" }, 404);
        }

        return c.json({ data });
      } catch (error) {
        throw new HTTPException(500, { message: "Internal Server Error" });
      }
    }
  )

  //Delete
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),

    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ message: "Missing id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ message: "Unauthorized" }, 401);
      }

      try {
        const [data] = await db
          .delete(categories)
          .where(
            and(
              eq(categories.userId, auth.userId),
              eq(categories.id, id)
            )
          )
          .returning({
            id:categories.id
          }); // Corrected placement of returning() method

        if (!data) {
          return c.json({ message: "Not Found" }, 404);
        }

        return c.json({ data });
      } catch (error) {
        throw new HTTPException(500, { message: "Internal Server Error" });
      }
    }
  );


export default app;
