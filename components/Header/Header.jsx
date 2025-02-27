import { View, Image, Text } from 'react-native';
import logo from '../../assets/images/logo.png';
import { s } from './Header.style';

export default function Header() {
  return (
    <View style={s.container}>
      <Image source={logo} style={s.img} />
      <Text style={s.text}>Tu as probablement des trucs à faire</Text>
    </View>
  );
}
