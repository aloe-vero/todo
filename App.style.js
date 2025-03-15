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
});

export const dark = StyleSheet.create({
  app: { flex: 1, backgroundColor: darkTheme.colors.background },
  header: { flex: 0.15 },
  body: { flex: 5 },
  footer: { height: 70 },
  cardItem: { flex: 1 },
  dialog: { backgroundColor: darkTheme.colors.background },
});
