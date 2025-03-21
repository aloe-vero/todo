import { useState, useEffect } from 'react';
import { Appearance } from 'react-native';

export const useTheme = () => {
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

    useEffect(() => {
        const theme = Appearance.addChangeListener(({ colorScheme }) => {
            setColorScheme(colorScheme);
        });

        return () => theme.remove();
    }, []);

    return { colorScheme };
};