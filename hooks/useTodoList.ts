import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import uuid from 'react-native-uuid';
import { Todo } from '@/types/todo.types';

export const useTodoList = () => {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const db = useSQLiteContext();
  const isFirstRender = useRef(true);
  const isLoadUpdate = useRef(false);

  // Derived states
  const incompletedList = todoList.filter(todo => !todo.isCompleted);
  const completedList = todoList.filter(todo => todo.isCompleted);

  // Load todos from the database
  useEffect(() => {
    async function loadTodo() {
      if (!db) return;
      try {
        const todos = await db.getAllAsync<Todo>('SELECT * FROM todo;');
        const uniqueTodos = Array.from(
            new Map(todos.map(todo => [todo.id, todo])).values()
        );  // Remove duplicates based on the 'id'
        setTodoList(uniqueTodos);
      } catch (error) {
        Alert.alert('Error loading todos', String(error));
      }
    }

    loadTodo();
  }, [db]);

  // Save todos to the database when they change
  useEffect(() => {
    if (isLoadUpdate.current) {
      isLoadUpdate.current = false;
    } else {
      if (!isFirstRender.current) {
        saveTodoList();
      } else {
        isFirstRender.current = false;
      }
    }
  }, [todoList]);

  // Save todoList to the database
  async function saveTodoList() {
    try {
      if (todoList.length === 0) {
        await db.runAsync(`DELETE FROM todo;`);
        return;
      }

      const placeholders = todoList.map(() => '(?, ?, ?, ?)').join(', ');
      const values = todoList.flatMap(todo => [
        todo.id,
        todo.title,
        todo.isCompleted ? 1 : 0,
        todo.date
      ]);

      await db.runAsync(
          `INSERT OR REPLACE INTO todo (id, title, isCompleted, date) VALUES ${placeholders}`,
          values
      );
    } catch (err) {
      Alert.alert('Error saving todos', String(err));
    }
  }


  const addTodo = (title: string, date:string) => {
    const newTodo: Todo = {
      id: uuid.v4() as string,
      title,
      isCompleted: false,
      date: date,
    };

    setTodoList(prevTodos => {

      const existingTodo = prevTodos.find(todo => todo.id === newTodo.id);
      if (existingTodo) {

        return prevTodos;
      }

      return [...prevTodos, newTodo];
    });
  };

  const updateTodo = (id: string) => {
    setTodoList(prevList =>
        prevList.map(todo =>
            todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
        )
    );
  };

  const deleteTodo = async (id: string) => {
    try {
      await db.runAsync('DELETE FROM todo WHERE id = ?;', id);
      setTodoList(prevList => prevList.filter(todo => todo.id !== id));
    } catch (error) {
      Alert.alert('Error deleting todo', String(error));
    }
  };

  const modifyTodo = async (id: string, newTitle: string) => {
    try {
      await db.runAsync(
          'UPDATE todo SET title = ? WHERE id = ?',
          newTitle,
          id
      );

      setTodoList(prevList =>
          prevList.map(todo =>
              todo.id === id ? { ...todo, title: newTitle } : todo
          )
      );
    } catch (error) {
      Alert.alert('Error modifying todo', String(error));
    }
  };

  const deleteAllCompleted = async () => {
    try {
      await db.runAsync("DELETE FROM todo WHERE isCompleted = ?;", 1);
      setTodoList(prevList => prevList.filter(todo => !todo.isCompleted));
    } catch (error) {
      Alert.alert('Error deleting completed todos', String(error));
    }
  };

  // Sorting operations
  const sortByCompletion = () => {
    setTodoList(prevList =>
        [...prevList].sort(
            (a, b) => Number(b.isCompleted) - Number(a.isCompleted)
        )
    );
  };

  const sortByAlpha = () => {
    setTodoList(prevList =>
        [...prevList].sort((a, b) => a.title.localeCompare(b.title))
    );
  };

  return {
    todoList,
    incompletedList,
    completedList,
    addTodo,
    updateTodo,
    deleteTodo,
    modifyTodo,
    deleteAllCompleted,
    sortByCompletion,
    sortByAlpha
  };
};