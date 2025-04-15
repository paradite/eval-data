> ChatGPT Share Link: https://chat.openai.com/share/1a9cd1ae-f40e-49ed-9c03-48f70de92986

```sql
-- Add created_at column
ALTER TABLE todos ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
```

```ts
// Update db.ts
export const todosTable = pgTable('todos', {
  id: serial('id').primaryKey(),
  // Other columns...
  created_at: timestamp('created_at').default(sql`NOW()`),
});
```

```jsx
// Modify page.jsx
import { format } from 'date-fns'; // Assume date-fns is installed

export default async function Home({ searchParams }) {
  const todos = await db
    .select({
      id: todosTable.id,
      text: todosTable.text,
      created_at: todosTable.created_at,
    })
    // Other query parts...

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
          <li key={todo.id}>
            {todo.text} - <small>{format(new Date(todo.created_at), 'PPP')}</small>
          </li>
        ))}
      </ul>
      // Form remains unchanged...
    </main>
  );
}
```