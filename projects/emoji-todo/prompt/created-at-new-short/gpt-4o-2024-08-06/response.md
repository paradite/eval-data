```ts
// db.ts modifications
import { timestamp } from 'drizzle-orm/pg-core';

export const todosTable = pgTable('todos', {
  id: serial('id').primaryKey(),
  text: varchar('text', { length: 10 }).default(''),
  created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});
```

```jsx
// page.jsx modifications
const todos = await db
  .select({
    id: todosTable.id,
    text: todosTable.text,
    created_at: todosTable.created_at,
  })
  .from(todosTable)
  // ...
<ul>
  {todos.map((todo) => (
      <li key={todo.id}>
        {todo.text} <small>{new Date(todo.created_at).toLocaleString()}</small>
      </li>
  ))}
</ul>
```