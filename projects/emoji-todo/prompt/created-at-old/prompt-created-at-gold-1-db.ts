// Update db.ts
export const todosTable = pgTable('todos', {
  id: serial('id').primaryKey(),
  // Other columns...
  created_at: timestamp('created_at').default(sql`NOW()`),
});
