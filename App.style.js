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
  panel:{  backgroundColor: lightTheme.colors.background,borderBottomColor:"grey", borderWidth:1,
    position: "absolute",
    zIndex: 1,
    top: 65,
    width: "100%"},
  accordion:{color:'black', backgroundColor:lightTheme.colors.headerBg, borderTopColor:"grey", borderWidth:1},
  text: {
    color: 'white',
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
  accordion:{color:'white', backgroundColor:darkTheme.colors.headerBg, borderTopColor:"grey", borderWidth:1},
  panel:{  backgroundColor: darkTheme.colors.background,borderBottomColor:"grey", borderWidth:1,
    position: "absolute",
    zIndex: 1,
    top: 65,
    width: "100%"},
  button: {
    width: 100,
    height: 40,
    backgroundColor: darkTheme.colors.buttonAdd,
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  text:{color:'white'}
});
