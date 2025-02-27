import { View, TouchableOpacity, Text } from 'react-native';
import { s } from './TabBottomMenu.style';

export default function TabBottomMenu({ todos, onTouch }) {
  return (
    <View style={s.container}>
      {todos.map(filter => (
        <TouchableOpacity
          key={filter.name}
          style={s.button}
          onPress={() => onTouch(filter.name)}
        >
          <Text
            style={[s.text, { color: filter.isPressed ? '#467DCD' : 'black' }]}
          >
            {filter.name} ({filter.length})
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
