import {User} from "@/types/user.types";
import {useEffect, useState} from "react";
import {Todo} from "@/types/todo.types";
import {Alert} from "react-native";
import {useSQLiteContext} from "expo-sqlite";

export const useUser = () => {
    const [user, setUser] = useState<User>();
    const db = useSQLiteContext();

    useEffect(() => {
        async function loadUser() {
            if (!db) return;
            try {
                const profile = await db.getFirstAsync('SELECT * FROM user');
                setUser(profile);

            } catch (error) {
                Alert.alert('Error loading user', String(error));
            }
        }

        loadUser();
    }, [db]);




    const getLevel = (xp: number): "Beginner" | "Average" | "Master" => {
        if (xp >= 200) return "Master";
        if (xp >= 100) return "Average";
        return "Beginner";
    };


    const addXP = async (xpGained: number) => {
        if (!db || !user) return;

        try {

            if (user.xp >= 200) return;

            const newXP = user.xp + xpGained;


            const finalXP = Math.min(newXP, 200);

            const newLevel = getLevel(finalXP);

            await db.runAsync(
                'UPDATE user SET xp = ?, level = ? WHERE id = 1',
                [finalXP, newLevel]
            );

            setUser(prev => prev ? { ...prev, xp: finalXP, level: newLevel } : undefined);
        } catch (error) {
            Alert.alert('Error updating XP', String(error));
        }
    };


    const resetXP = async() => {
        await db.runAsync(
            'UPDATE user SET xp = ?, level = ? WHERE id = 1',
            [0, 'Beginner']
        );

        setUser(prev => prev ? { ...prev, xp: 0, level: 'Beginner' } : undefined);
    }
    return { user, addXP, resetXP };







}