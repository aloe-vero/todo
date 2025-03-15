import { Stack } from 'expo-router';
import { SQLiteProvider, type SQLiteDatabase } from 'expo-sqlite';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="todo.db" onInit={createDBifNeeded}>
      <Stack />
    </SQLiteProvider>
  );
}

async function createDBifNeeded(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = 'wal';
    CREATE TABLE IF NOT EXISTS todo (
      id TEXT PRIMARY KEY NOT NULL, 
      title TEXT NOT NULL, 
      isCompleted INTEGER DEFAULT 0
    );
  `);
}
