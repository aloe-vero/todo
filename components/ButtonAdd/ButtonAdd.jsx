import { Text, TouchableOpacity } from 'react-native';
import { s } from './ButtonAdd.style';

export default function ButtonAdd({ onPress }) {
  return (
    <>
      <TouchableOpacity style={s.button} onPress={onPress}>
        <Text style={s.text}>+ New Todo</Text>
      </TouchableOpacity>
    </>
  );
}
