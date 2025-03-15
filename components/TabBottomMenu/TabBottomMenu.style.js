import { StyleSheet } from 'react-native';
import { lightTheme, darkTheme } from '../../theme';
export const light = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: lightTheme.colors.headerBg,
  },
  button: { flex: 1, alignItems: 'center', top: 20 },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: lightTheme.colors.text,
  },
});

export const dark = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: darkTheme.colors.headerBg,
  },
  button: { flex: 1, alignItems: 'center', top: 20 },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: darkTheme.colors.text,
  },
});
