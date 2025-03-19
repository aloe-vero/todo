import { View, Image, Text } from 'react-native';
import logo from '../../assets/images/light/logo.png';
import { light, dark } from './Header.style';
import darklogo from '../../assets/images/dark/darklogo.png';

export default function Header({ theme }) {
  return (
    <View
      style={theme === 'dark' ? dark.container : light.container}
      singleTap={() => {
        console.log('single tap');
      }}
      doubleTap={() => {
        console.log('double tap');
      }}
    >
      <Image
        source={theme === 'dark' ? darklogo : logo}
        style={theme === 'dark' ? dark.img : light.img}
      />
      <Text style={theme === 'dark' ? dark.text : light.text}>
        Tu as probablement des trucs à faire
      </Text>
    </View>
  );
}
