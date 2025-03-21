import { Stack } from 'expo-router';
import { SQLiteProvider, type SQLiteDatabase } from 'expo-sqlite';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="todo.db" onInit={createDBifNeeded}>
      <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#161A1D',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
      />
    </SQLiteProvider>
  );
}

async function createDBifNeeded(db: SQLiteDatabase) {
    await db.execAsync(`
    PRAGMA journal_mode = 'wal';

    CREATE TABLE IF NOT EXISTS todo (
      id TEXT PRIMARY KEY NOT NULL, 
      title TEXT NOT NULL, 
      isCompleted INTEGER DEFAULT 0,
      date TEXT
    );

    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      xp INTEGER DEFAULT 0,
      level TEXT DEFAULT 'Beginner'
    );

INSERT INTO user (xp, level)
SELECT 0, 'Beginner'
WHERE NOT EXISTS (SELECT 1 FROM user);
  `);
}