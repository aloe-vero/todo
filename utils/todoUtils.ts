import { Todo } from '@/types/todo.types';
import uuid from 'react-native-uuid';
import { SQLiteDatabase } from 'expo-sqlite';

export const addTodo = (value: string, setTodoList: Function) => {
  if (value.trim() === '') return;

  const newTodo: Todo = {
    id: uuid.v4(),
    title: value,
    isCompleted: false,
  };

  setTodoList((prevTodos: Todo[]) => [...prevTodos, newTodo]);
};

export const deleteTodo = async (
  id: string,
  setTodoList: Function,
  db: SQLiteDatabase
) => {
  await db.runAsync('DELETE FROM todo WHERE id = ?;', id);
  setTodoList((prevList: Todo[]) => prevList.filter(todo => todo.id !== id));
};

export const modifyTodo = async (
  id: string,
  value: string,
  setTodoList: Function,
  db: SQLiteDatabase
) => {
  await db.runAsync('UPDATE todo SET title = ? WHERE id = ?', value, id);

  setTodoList((prevList: Todo[]) =>
    prevList.map(todo => (todo.id === id ? { ...todo, title: value } : todo))
  );
};

export const updateTodo = (id: string, setTodoList: Function) => {
  setTodoList((prevList: Todo[]) =>
    prevList.map(todo =>
      todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    )
  );
};
