import { StyleSheet } from 'react-native';
import { lightTheme, darkTheme } from './theme';

export const light = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: lightTheme.colors.background,
  },
  header: { flex: 0.15 },
  body: { flex: 5 },
  footer: { height: 70 },
  cardItem: { flex: 1 },
  dialog: { backgroundColor: lightTheme.colors.background },
  button: {
    width: 100,
    height: 40,
    backgroundColor: lightTheme.colors.buttonAdd,
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 20,
  },
});

export const dark = StyleSheet.create({
  app: { flex: 1, backgroundColor: darkTheme.colors.background },
  header: { flex: 0.15 },
  body: { flex: 5 },
  footer: { height: 70 },
  cardItem: { flex: 1 },
  dialog: {
    backgroundColor: darkTheme.colors.background,
  },
});
