import React, { useState, useRef } from 'react';
import {
    View,
    ScrollView,
    Text,
    TouchableOpacity,
    Animated
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Searchbar, List } from 'react-native-paper';
import { light, dark } from '../App.style';
import Header from '../components/Header/Header';
import { CardTodo } from '../components/CardTodo/CardTodo';
import TabBottomMenu from '../components/TabBottomMenu/TabBottomMenu';
import ButtonAdd from '../components/ButtonAdd/ButtonAdd';
import { AddDialog } from "@/components/Dialogs/AddDialog/AddDialog";
import { ChoiceDialog } from "@/components/Dialogs/ChoiceDialog/ChoiceDialog";
import { DeleteDialog } from "@/components/Dialogs/DeleteDialog/DeleteDialog";
import { ModifyDialog } from "@/components/Dialogs/ModifyDialog/ModifyDialog";
import { useTodoList } from '../hooks/useTodoList';
import { useTheme } from '../hooks/useTheme';
import { getFilters } from '../utils/todoUtils';
import {useUser} from "../hooks/useUser";
import LottieView from 'lottie-react-native';
import { StyleSheet } from 'react-native';
import confetti from '../assets/confetti.json'


export default function Index() {
    const { colorScheme } = useTheme();
    const {user, addXP, resetXP} = useUser();

    const {
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
    } = useTodoList();

    const [activeFilter, setActiveFilter] = useState('All');
    const [isAddDialogueVisible, setIsAddDialogueVisible] = useState(false);
    const [value, setValue] = useState('');
    const [date, setDate] = useState('');
    const [isOptionDialog, setIsOptionDialog] = useState(false);
    const [isModifyDialogVisible, setIsModifyDialogVisible] = useState(false);
    const [isDeleteDialog, setIsDeleteDialog] = useState(false);
    const [chosenTodo, setChosenTodo] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const confettiRef = useRef<LottieView>(null);
    const tapTimeout = useRef(null);

    const handleTap = () => {
        if (tapTimeout.current) {
            clearTimeout(tapTimeout.current);
            tapTimeout.current = null;
            setIsDeleteDialog(true);
        } else {
            tapTimeout.current = setTimeout(() => {
                sortByCompletion();
                tapTimeout.current = null;
            }, 300);
        }
    };

    function triggerConfetti() {
        confettiRef.current?.play(0);
    }
    const filters = getFilters(todoList, incompletedList, completedList, activeFilter);

    const updateButton = (name: string) => {
        setActiveFilter(name);
    };


    const showAddDialog = () => {
        setIsAddDialogueVisible(true);
    };

    const showOptionDialog = (id: string) => {
        setChosenTodo(id);
        setIsOptionDialog(true);
    };

    const handleAddTodo = () => {
        if (value.trim() === '') return;
        const {now, future}=addTimer(Number(date));
        addTodo(value,future.toLocaleString() );
        setValue('');
    };

    const handleModifyTodo = () => {
        modifyTodo(chosenTodo, value);
    };

    const handleDeleteTodo = () => {
        deleteTodo(chosenTodo);
    };
    function addTimer(minutes: number): { now: Date; future: Date } {
        const now = new Date();
        const future = new Date(now.getTime() + minutes * 60000); // Ajoute X minutes

        return { now, future };
    }


    const getCurrentFilteredList = () => {
        let filteredList = todoList;

        switch (activeFilter) {
            case "In Progress":
                filteredList = incompletedList;
                break;
            case "Done":
                filteredList = completedList;
                break;
            default:
                filteredList = todoList;
                break;
        }

        return filteredList.filter(todo =>
            todo.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const renderTodoList = () => {
        const filteredList = getCurrentFilteredList();

        return filteredList.length > 0 ? (
            filteredList.map(todo => (
                <View key={todo.id}>
                    <CardTodo
                        todo={todo}
                        onTouch={() => {
                            const wasCompleted = todo.isCompleted;
                            updateTodo(todo.id);

                            if (!wasCompleted) {
                                addXP(50);
                                triggerConfetti()
                            }

                        }}
                        onLongTouch={() => showOptionDialog(todo.id)}
                        theme={colorScheme}
                    />
                </View>
            ))
        ) : (
            <Text style={[colorScheme === 'dark'?{color:"white"}:{color:"black"},{ textAlign: 'center', marginTop: 10 }]}>
                Aucune tâche trouvée.
            </Text>
        );
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        lottie: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            pointerEvents: 'none',
        },
    });


// Exemple d'utilisation
    const { now, future } = addTimer(2);
    console.log("Maintenant :", now);
    console.log("Dans 2 minutes :", future);
    return (
        <>
            <SafeAreaProvider>
                <SafeAreaView style={colorScheme === 'dark' ? dark.app : light.app}>
                    <TouchableOpacity style={colorScheme === 'dark' ? dark.header:light.header} onPress={handleTap}>
                        <Header theme={colorScheme} user={user} />
                    </TouchableOpacity>

                    <List.Accordion title="Search" titleStyle={colorScheme === 'dark' ?{ color:"white"}:{ color:'black'}} style={colorScheme === 'dark' ?dark.accordion: light.accordion}>
                        <View style={colorScheme === 'dark' ?dark.panel : light.panel}>
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
                            <View style={{flex: 1, flexDirection:"row", gap: 5,alignSelf:"center"}}>

                                <TouchableOpacity style={colorScheme === 'dark' ?dark.button:light.button} onPress={sortByAlpha}>
                                    <Text style={light.text}>Sort</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={colorScheme === 'dark' ?dark.button:light.button} onPress={resetXP}>
                                    <Text style={light.text}>Reset XP</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </List.Accordion>

                    <ScrollView style={colorScheme === 'dark' ? dark.body : light.body}>
                        {renderTodoList()}
                    </ScrollView>
                    <ButtonAdd onPress={showAddDialog} theme={colorScheme} />
                </SafeAreaView>
            </SafeAreaProvider>
            <View style={colorScheme === 'dark' ? dark.footer : light.footer}>
                <TabBottomMenu
                    filters={filters}
                    onTouch={updateButton}
                    theme={colorScheme}
                />
            </View>

            {/* Dialogs */}
            <ChoiceDialog
                isVisible={isOptionDialog}
                onClose={() => setIsOptionDialog(false)}
                setIsModifyDialogVisible={setIsModifyDialogVisible}
                deleteTodo={handleDeleteTodo}
            />
            <DeleteDialog
                isVisible={isDeleteDialog}
                onClose={() => setIsDeleteDialog(false)}
                deleteAllCompleted={deleteAllCompleted}
            />
            <ModifyDialog
                isVisible={isModifyDialogVisible}
                onClose={() => setIsModifyDialogVisible(false)}
                value={value}
                setValue={setValue}
                modifyTodo={handleModifyTodo}
            />
            <AddDialog
                isVisible={isAddDialogueVisible}
                onClose={() => setIsAddDialogueVisible(false)}
                date={date}
                setDate={setDate}
                value={value}
                setValue={setValue}
                addTodo={handleAddTodo}
            />
            <LottieView
                ref={confettiRef}
                source={confetti}
                autoPlay={false}
                loop={false}
                style={styles.lottie}
                resizeMode='cover'
            />

        </>
    );
}}