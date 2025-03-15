import { View, TouchableOpacity, Text } from 'react-native';
import { light, dark } from './TabBottomMenu.style';

export default function TabBottomMenu({ filters, onTouch, theme }) {
  return (
    <View style={theme === 'dark' ? dark.container : light.container}>
      {filters.map(filter => (
        <TouchableOpacity
          key={filter.name}
          style={theme === 'dark' ? dark.button : light.button}
          onPress={() => onTouch(filter.name)}
        >
          <Text
            style={[
              theme === 'dark' ? dark.text : light.text,
              {
                color: filter.isPressed
                  ? theme === 'dark'
                    ? '#8270DB'
                    : '#467DCD'
                  : theme === 'light'
                  ? 'dark'
                  : 'white',
              },
            ]}
          >
            {filter.name} ({filter.length})
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
