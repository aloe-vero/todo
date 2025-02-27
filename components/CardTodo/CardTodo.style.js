import { StyleSheet } from 'react-native';

export const s = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
    height: 115,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    backgroundColor: 'white',
    elevation: 10,
    padding: 25,
    borderRadius: 20,
    justifyContent: 'space-between',
    margin: 10,
  },
  text: { fontSize: 25 },
  img: { height: 25, width: 25 },
});
