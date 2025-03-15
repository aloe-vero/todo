import { StyleSheet } from 'react-native';
import { lightTheme, darkTheme } from '../../theme';

export const light = StyleSheet.create({
  button: {
    backgroundColor: lightTheme.colors.buttonAdd,
    position: 'absolute',
    bottom: 60,
    right: 20,
    width: 150,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },

  text: {
    color: lightTheme.colors.buttonText,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export const dark = StyleSheet.create({
  button: {
    backgroundColor: darkTheme.colors.buttonAdd,
    position: 'absolute',
    bottom: 60,
    right: 20,
    width: 150,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },

  text: {
    color: darkTheme.colors.buttonText,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
