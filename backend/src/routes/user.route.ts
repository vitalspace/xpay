import { Elysia, t } from "elysia";
import {
  createUser,
  profile,
  updateUser,
} from "../controllers/user.controller";

export const userRoutes = new Elysia({
  detail: {
    tags: ["User"],
  },
})
  .post("/create-user", createUser, {
    body: t.Object({
      address: t.String({
        minLength: 40,
      }),
      avatar: t.Optional(t.String()),
      banner: t.Optional(t.String()),
      username: t.Optional(t.String({ maxLength: 50 })),
      email: t.Optional(t.String()),
      bio: t.Optional(t.String({ maxLength: 160 })),
    }),
  })
  .post("/profile", profile, {
    body: t.Object({
      address: t.String(),
    }),
  })
  .put("/update-user", updateUser, {
    body: t.Object({
      address: t.String(),
      username: t.Optional(t.String({ maxLength: 50 })),
      email: t.Optional(t.String()),
      avatar: t.Optional(t.String({})),
      banner: t.Optional(t.String({})),
      bio: t.Optional(t.String({ maxLength: 160 })),
    }),
  });
