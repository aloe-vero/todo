import { View, ScrollView, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { s } from '../App.style';
import Header from '../components/Header/Header';
import { CardTodo } from '../components/CardTodo/CardTodo';
import { useState, useEffect, useRef } from 'react';
import TabBottomMenu from '../components/TabBottomMenu/TabBottomMenu';
import ButtonAdd from '../components/ButtonAdd/ButtonAdd';
import Dialog from 'react-native-dialog';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Todo {
  id: number;
  title: string;
  isCompleted: boolean;
}

export default function Index() {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isAddDialogueVisible, setIsAddDialogueVisible] = useState(false);
  const [value, setValue] = useState('');

  const isFirstRender = useRef(true);
  const isLoadUpdate = useRef(false);

  const incompletedList = todoList.filter(todo => !todo.isCompleted);
  const completedList = todoList.filter(todo => todo.isCompleted);

  const all = todoList.length;
  const incompleted = incompletedList.length;
  const completed = completedList.length;

  const getFilters = () => [
    { name: 'All', length: all, isPressed: activeFilter === 'All' },
    {
      name: 'Incomplete',
      length: incompleted,
      isPressed: activeFilter === 'Incomplete',
    },
    {
      name: 'Complete',
      length: completed,
      isPressed: activeFilter === 'Complete',
    },
  ];

  const getCurrentFilteredList = () => {
    switch (activeFilter) {
      case 'Incomplete':
        return incompletedList;
      case 'Complete':
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
          onLongTouch={() => deleteTodo(todo.id)}
        />
      </View>
    ));
  }

  function updateTodo(id: number) {
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

    const highestId =
      todoList.length > 0 ? Math.max(...todoList.map(todo => todo.id)) : 0;

    const newTodo: Todo = {
      id: highestId + 1,
      title: value,
      isCompleted: false,
    };

    setTodoList(prevTodos => [...prevTodos, newTodo]);
    setValue('');
  }

  function deleteTodo(id: number) {
    Alert.alert(
      'Supprimer le todo',
      'Êtes-vous sûr de vouloir supprimer ce todo ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          onPress: () => {
            setTodoList(prevList => prevList.filter(todo => todo.id !== id));
          },
          style: 'destructive',
        },
      ]
    );
  }

  useEffect(() => {
    loadTodoList();
  }, []);

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

  async function saveTodoList() {
    console.log('save');
    try {
      await AsyncStorage.setItem('@todolist', JSON.stringify(todoList));
    } catch (err) {
      Alert.alert('Erreur', `Erreur de sauvegarde: ${err}`);
    }
  }

  async function loadTodoList() {
    console.log('Load');
    try {
      const stringifiedTodoList = await AsyncStorage.getItem('@todolist');
      if (stringifiedTodoList !== null) {
        const parsedTodoList = JSON.parse(stringifiedTodoList);
        setTodoList(parsedTodoList);
        isLoadUpdate.current = true;
      }
    } catch (err) {
      Alert.alert('Erreur', `Erreur de chargement: ${err}`);
    }
  }

  return (
    <>
      <SafeAreaProvider>
        <SafeAreaView style={s.app}>
          <View style={s.header}>
            <Header />
          </View>

          <ScrollView style={s.body}>{renderTodoList()}</ScrollView>
          <ButtonAdd onPress={showAddDialog} />
        </SafeAreaView>
      </SafeAreaProvider>
      <View style={s.footer}>
        <TabBottomMenu todos={getFilters()} onTouch={updateButton} />
      </View>

      <Dialog.Container
        visible={isAddDialogueVisible}
        onBackdropPress={() => setIsAddDialogueVisible(false)}
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
