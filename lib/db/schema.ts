import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { relations, Relations } from "drizzle-orm/_relations";

export const files = pgTable("files", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  path: text("path").notNull(),
  size: integer("size").notNull(),
  type: text("type").notNull(),

  fileUrl: text("fileUrl").notNull(),
  thumbnailUrl: text("thumbnail_url"),

  // ownership
  userId: text("user_id").notNull(),
  parentId: uuid("parent_id"), // parent folder id (null for root item)

  isFolder: boolean("is_folder").default(false).notNull(),
  isstarred: boolean("is_starred").default(false).notNull(),
  isTrash: boolean("is_trash").default(false).notNull(),

  // timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const fileReplations = relations(files, ({ one, many }) => ({
  children: many(files),
  parent: one(files, {
    fields: [files.parentId],
    references: [files.id],
  }),
}));

//Type definition

export const File = typeof files.$inferSelect;
export const NewFile = typeof files.$inferInsert;
