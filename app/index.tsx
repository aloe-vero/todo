import {
  View,
  ScrollView,
  Alert,
  Appearance,
  Text,
  TouchableOpacity,
} from 'react-native';
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
import { Searchbar } from 'react-native-paper';
import { List } from 'react-native-paper';
import { useDoubleTap } from 'use-double-tap';

//https://docs.expo.dev/versions/latest/sdk/sqlite/ <- Database
//https://www.npmjs.com/package/uuid  <- unique id
//configuration IOS -> npx pod-install
//npm install react-native-paper

export default function Index() {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isAddDialogueVisible, setIsAddDialogueVisible] = useState(false);
  const [value, setValue] = useState('');
  const [isOptionDialog, setisOptionDialog] = useState(false);
  const [isModifyDialogVisible, setIsModifyDialogVisible] = useState(false);
  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const [chosenTodo, setChosenTodo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [count, setCount] = useState(0);
  const db = useSQLiteContext();
  const isFirstRender = useRef(true);
  const isLoadUpdate = useRef(false);
  const incompletedList = todoList.filter(todo => !todo.isCompleted);
  const completedList = todoList.filter(todo => todo.isCompleted);

  const onPress = () => setCount(prevCount => prevCount + 1);

  useEffect(() => {
    const theme = Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme);
    });

    return () => theme.remove();
  }, []);

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
  const bind = useDoubleTap(event => {
    // Your action here
    console.log('Double tapped');
  });

  const getCurrentFilteredList = () => {
    let filteredList = todoList;

    switch (activeFilter) {
      case 'In Progress':
        filteredList = incompletedList;
      case 'Done':
        filteredList = completedList;
      default:
        filteredList = todoList;

        return filteredList.filter(todo =>
          todo.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
  };

  function renderTodoList() {
    const filteredList = getCurrentFilteredList();

    return filteredList.length > 0 ? (
      filteredList.map(todo => (
        <View key={todo.id}>
          <CardTodo
            todo={todo}
            onTouch={() => updateTodo(todo.id)}
            onLongTouch={() => showOptionDialog(todo.id)}
            theme={colorScheme}
          />
        </View>
      ))
    ) : (
      <Text style={{ textAlign: 'center', marginTop: 10 }}>
        Aucune tâche trouvée.
      </Text>
    );
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
    db.runAsync('DELETE FROM todo WHERE id = ?;', chosenTodo);
    setTodoList(prevList => prevList.filter(todo => todo.id !== chosenTodo));
  }

  async function modifyTodo() {
    await db.runAsync(
      'UPDATE todo SET title = ? WHERE id = ?',
      value,
      chosenTodo
    );

    setTodoList(prevList =>
      prevList.map(todo =>
        todo.id === chosenTodo ? { ...todo, title: value } : todo
      )
    );
  }

  function deleteAllCompleted() {
    db.runAsync('DELETE FROM todo WHERE isCompleted = ?;', 1);
    setTodoList(prevList =>
      prevList.filter(todo => todo.isCompleted === false)
    );
  }
  useEffect(() => {
    if (count === 2) {
      setIsDeleteDialog(true);
      console.log(count);
    } else if (count === 1) {
      sortByCompletion();
    }
    restartCount();
  }, [count]);
  console.log(count);
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

  function restartCount() {
    const timeoutId = setTimeout(() => {
      setCount(0);
    }, 2000);
    return () => clearTimeout(timeoutId);
  }

  function sortByCompletion() {
    setTodoList(prevList =>
      [...prevList].sort(
        (a, b) => Number(b.isCompleted) - Number(a.isCompleted)
      )
    );
  }

  function sortByAlpha() {
    setTodoList(prevList =>
      [...prevList].sort((a, b) => a.title.localeCompare(b.title))
    );
  }

  function showAddDialog() {
    setIsAddDialogueVisible(true);
  }
  function showOptionDialog(id: string) {
    setChosenTodo(id);
    setisOptionDialog(true);
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
          <TouchableOpacity style={light.header} onPress={onPress}>
            <Header theme={colorScheme} />
          </TouchableOpacity>

          <List.Accordion title="Search">
            <Searchbar
              placeholder="Search"
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={{
                width: '80%',
                alignSelf: 'center',
                margin: 20,
              }}
            />
            <TouchableOpacity style={light.button} onPress={sortByAlpha}>
              <Text style={light.text}>Sort</Text>
            </TouchableOpacity>
          </List.Accordion>

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
      {/**Modify and Delete Dialog */}
      <Dialog.Container
        visible={isOptionDialog}
        onBackdropPress={() => setisOptionDialog(false)}
        contentStyle={colorScheme === 'dark' ? dark.dialog : light.dialog}
        verticalButtons="true"
      >
        <Dialog.Title>Que souhaitez vous faire?</Dialog.Title>

        <Dialog.Button
          label="Modifier"
          onPress={() => {
            setisOptionDialog(false);
            setTimeout(() => {
              setIsModifyDialogVisible(true);
            }, 1000);
          }}
        />

        <Dialog.Button
          label="Supprimer"
          onPress={() => {
            deleteTodo();
            setisOptionDialog(false);
          }}
          style={{ color: 'red' }}
        />
        <Dialog.Button
          label="Annuler"
          onPress={() => setisOptionDialog(false)}
        />
      </Dialog.Container>
      {/**Delete all completed todos Dialog */}
      <Dialog.Container
        visible={isDeleteDialog}
        onBackdropPress={() => setIsDeleteDialog(false)}
        contentStyle={colorScheme === 'dark' ? dark.dialog : light.dialog}
        verticalButtons="true"
      >
        <Dialog.Title>Êtes vous sûre de tous suprrimer?</Dialog.Title>
        <Dialog.Button
          label="Supprimer"
          onPress={() => {
            deleteAllCompleted();
            setIsDeleteDialog(false);
          }}
        />
        <Dialog.Button
          label="Annuler"
          onPress={() => {
            setIsDeleteDialog(false);
          }}
          style={{ color: 'red' }}
        />
      </Dialog.Container>
      {/**Modify Dialog */}
      <Dialog.Container
        visible={isModifyDialogVisible}
        onBackdropPress={() => setIsModifyDialogVisible(false)}
        contentStyle={colorScheme === 'dark' ? dark.dialog : light.dialog}
      >
        <Dialog.Title>Modifier une tâche</Dialog.Title>

        <Dialog.Input onChangeText={text => setValue(text)} value={value} />
        <Dialog.Button
          label="Modifier"
          onPress={() => {
            modifyTodo();
            setIsModifyDialogVisible(false);
          }}
        />
      </Dialog.Container>
      {/**Add Dialog */}
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
