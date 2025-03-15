import { Text, TouchableOpacity } from 'react-native';
import { light, dark } from './ButtonAdd.style';

export default function ButtonAdd({ onPress, theme }) {
  return (
    <>
      <TouchableOpacity
        style={theme === 'dark' ? dark.button : light.button}
        onPress={onPress}
      >
        <Text style={theme === 'dark' ? dark.text : light.text}>
          + New Todo
        </Text>
      </TouchableOpacity>
    </>
  );
}
