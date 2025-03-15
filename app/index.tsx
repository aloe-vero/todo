import { View, ScrollView, Alert, Appearance } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { light, dark } from '../App.style';
import Header from '../components/Header/Header';
import { CardTodo } from '../components/CardTodo/CardTodo';
import { useState, useEffect, useRef } from 'react';
import TabBottomMenu from '../components/TabBottomMenu/TabBottomMenu';
import ButtonAdd from '../components/ButtonAdd/ButtonAdd';
import Dialog from 'react-native-dialog';
import uuid from 'react-native-uuid';
import { useSQLiteContext } from 'expo-sqlite';
import { Todo } from '@/types/todo.types';

//https://docs.expo.dev/versions/latest/sdk/sqlite/ <- Database
//https://www.npmjs.com/package/uuid  <- unique id
//configuration IOS -> npx pod-install

export default function Index() {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    const theme = Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme);
    });

    return () => theme.remove();
  }, []);

  const db = useSQLiteContext();
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isAddDialogueVisible, setIsAddDialogueVisible] = useState(false);
  const [value, setValue] = useState('');
  const isFirstRender = useRef(true);
  const isLoadUpdate = useRef(false);
  const incompletedList = todoList.filter(todo => !todo.isCompleted);
  const completedList = todoList.filter(todo => todo.isCompleted);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState('');

  const getFilters = () => [
    { name: 'All', length: todoList.length, isPressed: activeFilter === 'All' },
    {
      name: 'In Progress',
      length: incompletedList.length,
      isPressed: activeFilter === 'In Progress',
    },
    {
      name: 'Done',
      length: completedList.length,
      isPressed: activeFilter === 'Done',
    },
  ];
  const getCurrentFilteredList = () => {
    switch (activeFilter) {
      case 'In Progress':
        return incompletedList;
      case 'Done':
        return completedList;
      default:
        return todoList;
    }
  };

  function renderTodoList() {
    const filteredList = getCurrentFilteredList();
    return filteredList.map(todo => (
      <View key={todo.id}>
        <CardTodo
          todo={todo}
          onTouch={() => updateTodo(todo.id)}
          onLongTouch={() => showDeleteDialog(todo.id)}
          theme={colorScheme}
        />
      </View>
    ));
  }

  function updateTodo(id: string) {
    setTodoList(prevList =>
      prevList.map(todo =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  }

  function updateButton(name: string) {
    setActiveFilter(name);
  }

  function addTodo() {
    if (value.trim() === '') return;

    const newTodo: Todo = {
      id: uuid.v4(),
      title: value,
      isCompleted: false,
    };

    setTodoList(prevTodos => [...prevTodos, newTodo]);
    setValue('');
  }

  function deleteTodo() {
    db.runAsync('DELETE FROM todo WHERE id = ?;', todoToDelete);
    setTodoList(prevList => prevList.filter(todo => todo.id !== todoToDelete));
  }

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

  function showAddDialog() {
    setIsAddDialogueVisible(true);
  }
  function showDeleteDialog(id: string) {
    setTodoToDelete(id);
    setIsDeleteDialogVisible(true);
  }

  async function saveTodoList() {
    console.log('save');
    try {
      const placeholders = todoList.map(() => '(?, ?, ?)').join(', ');
      const values = todoList.flatMap(todo => [
        todo.id,
        todo.title,
        todo.isCompleted ? 1 : 0,
      ]);

      if (todoList.length === 0) {
        await db.runAsync(`DELETE FROM todo;`);
      } else {
        await db.runAsync(
          `INSERT OR REPLACE INTO todo (id, title, isCompleted) VALUES ${placeholders}`,
          values
        );
      }
    } catch (err) {
      Alert.alert('Erreur' + err);
    }
  }

  useEffect(() => {
    async function loadTodo() {
      if (!db) return;
      const todos = await db.getAllAsync<Todo>('SELECT * FROM todo;');

      setTodoList(todos);
    }

    loadTodo();
  }, [db]);

  return (
    <>
      <SafeAreaProvider>
        <SafeAreaView style={colorScheme === 'dark' ? dark.app : light.app}>
          <View style={light.header}>
            <Header theme={colorScheme} />
          </View>

          <ScrollView style={colorScheme === 'dark' ? dark.body : light.body}>
            {renderTodoList()}
          </ScrollView>
          <ButtonAdd onPress={showAddDialog} theme={colorScheme} />
        </SafeAreaView>
      </SafeAreaProvider>
      <View style={colorScheme === 'dark' ? dark.footer : light.footer}>
        <TabBottomMenu
          filters={getFilters()}
          onTouch={updateButton}
          theme={colorScheme}
        />
      </View>

      <Dialog.Container
        visible={isDeleteDialogVisible}
        onBackdropPress={() => setIsDeleteDialogVisible(false)}
        contentStyle={colorScheme === 'dark' ? dark.dialog : light.dialog}
      >
        <Dialog.Title>Supprimer le todo</Dialog.Title>
        <Dialog.Description>
          Êtes-vous sûr de vouloir supprimer ce todo ?
        </Dialog.Description>
        <Dialog.Button
          label="Annuler"
          onPress={() => setIsDeleteDialogVisible(false)}
        />
        <Dialog.Button
          label="Supprimer"
          onPress={() => {
            deleteTodo();
            setIsDeleteDialogVisible(false);
          }}
        />
      </Dialog.Container>
      <Dialog.Container
        visible={isAddDialogueVisible}
        onBackdropPress={() => setIsAddDialogueVisible(false)}
        contentStyle={colorScheme === 'dark' ? dark.dialog : light.dialog}
      >
        <Dialog.Title>Créer une tâche</Dialog.Title>
        <Dialog.Description>
          Choisis un nom pour la nouvelle tâche
        </Dialog.Description>
        <Dialog.Input onChangeText={text => setValue(text)} value={value} />
        <Dialog.Button
          label="Créer"
          onPress={() => {
            addTodo();
            setIsAddDialogueVisible(false);
          }}
        />
      </Dialog.Container>
    </>
  );
}
