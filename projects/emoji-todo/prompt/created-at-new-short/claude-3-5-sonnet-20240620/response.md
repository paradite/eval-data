Here's the modified code to add the `created_at` field to todos and update both backend and frontend:

db.ts
```ts
import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

neonConfig.fetchConnectionCache = true;
const client = neon(process.env.DATABASE_URL!, {
  fetchOptions: { cache: 'no-store' },
});
export const db = drizzle(client);

export const todosTable = pgTable('todos', {
  id: serial('id').primaryKey(),
  text: varchar('text', { length: 10 }).default(''),
  created_at: timestamp('created_at').defaultNow(),
});
```

page.jsx
```jsx
import { db, todosTable } from './db';
import { submit } from './actions';
import { sql } from 'drizzle-orm';

export default async function Home({ searchParams }) {
  const todos = await db
    .select({
      id: todosTable.id,
      text: todosTable.text,
      created_at: todosTable.created_at,
    })
    .from(todosTable)
    .limit(20)
    .orderBy(searchParams.asc ? sql`${todosTable.id} ASC` : sql`${todosTable.id} DESC`);

  return (
    <main key={todos[0]?.id}>
      <h1>Emoji TODO <a href="https://github.com/rauchg/emoji-todo" target="_blank">source</a></h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.text} - {new Date(todo.created_at).toLocaleString()}
          </li>
        ))}
      </ul>
      <form action={submit}>
        <input type="text" placeholder="🫡 (only emojis allowed)" pattern="^[\p{Emoji}]+$" name="text" autoFocus maxLength="10" required />
        <button>✉️</button>
      </form>
    </main>
  );
}
```