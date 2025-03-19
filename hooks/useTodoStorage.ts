import { useState, useEffect } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { Todo } from '@/types/todo.types';

export const useTodoStorage = () => {
  const db = useSQLiteContext();
  const [todoList, setTodoList] = useState<Todo[]>([]);

  useEffect(() => {
    async function loadTodos() {
      const todos = await db.getAllAsync<Todo>('SELECT * FROM todo;');
      setTodoList(todos);
    }
    loadTodos();
  }, [db]);

  const saveTodoList = async () => {
    if (todoList.length === 0) {
      await db.runAsync(`DELETE FROM todo;`);
      return;
    }

    const placeholders = todoList.map(() => '(?, ?, ?)').join(', ');
    const values = todoList.flatMap(todo => [
      todo.id,
      todo.title,
      todo.isCompleted ? 1 : 0,
    ]);

    await db.runAsync(
      `INSERT OR REPLACE INTO todo (id, title, isCompleted) VALUES ${placeholders}`,
      values
    );
  };

  useEffect(() => {
    saveTodoList();
  }, [todoList]);

  return { todoList, setTodoList };
};
