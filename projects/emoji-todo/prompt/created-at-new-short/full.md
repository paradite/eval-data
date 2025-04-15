You are tasked to implement a feature. Instructions are as follows:

add created_at field to todos, update both backend and frontend.

Instructions for the output format:
- Output code without descriptions, unless it is important.
- Minimize prose, comments and empty lines.
- Only show the relevant code that needs to be modified. Use comments to represent the parts that are not modified.
- Make it easy to copy and paste.
- Consider other possibilities to achieve the result, do not be limited by the prompt.

db.ts
```ts
import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

neonConfig.fetchConnectionCache = true;
const client = neon(process.env.DATABASE_URL!, {
  fetchOptions: {
    cache: 'no-store',
  },
});
export const db = drizzle(client);

export const todosTable = pgTable('todos', {
  id: serial('id').primaryKey(),
  text: varchar('text', { length: 10 }).default(''),
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
    })
    .from(todosTable)
    .limit(20)
    .orderBy(searchParams.asc ? sql`${todosTable.id} ASC` : sql`${todosTable.id} DESC`);

  return (
    <main key={todos[0]?.id}>
      <h1>
        Emoji TODO{' '}
        <a href="https://github.com/rauchg/emoji-todo" target="_blank">
          source
        </a>
      </h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>

      <form action={submit}>
        <input
          type="text"
          placeholder="🫡 (only emojis allowed)"
          pattern="^[\p{Emoji}]+$"
          name="text"
          autoFocus
          maxLength="10"
          required
        />
        <button>✉️</button>
      </form>
    </main>
  );
}
```