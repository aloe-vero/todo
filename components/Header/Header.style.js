import { StyleSheet } from 'react-native';
import { lightTheme, darkTheme } from '../../theme';
export const light = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    paddingTop: 10,
    backgroundColor: lightTheme.colors.headerBg,
    height: 100,
  },
  img: { width: 170, flex: 1 },
  text: { flex: 1, color: 'grey' },
});

export const dark = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    paddingTop: 10,
    backgroundColor: darkTheme.colors.headerBg,
    height: 100,
  },
  img: { width: 170, flex: 1 },
  text: { flex: 1, color: 'grey' },
});
