import {TouchableOpacity, Text, Image, View} from 'react-native';
import { light, dark } from './CardTodo.style';
import check from '../../assets/images/light/check.png';
import darkcheck from '../../assets/images/dark/darkcheck.png';

export function CardTodo({ todo, onTouch, onLongTouch, theme }) {

    const today = new Date().toLocaleString();;
    console.log(today);
  return (
    <>

      <TouchableOpacity
        style={theme === 'dark' ? dark.card : light.card}
        todoId={todo.id}
        onPress={onTouch}
        onLongPress={onLongTouch}
      >
          <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
        <Text
          style={[
            theme === 'dark' ? dark.text : light.text,
            {
              textDecorationLine: todo.isCompleted ? 'line-through' : 'none',
            },
          ]}
        >
          {todo.title}
        </Text>
        <Image
          style={[
            theme === 'dark' ? dark.img : light.img,
            { opacity: !todo.isCompleted ? 0 : 1 },
          ]}
          source={theme === 'dark' ? darkcheck : check}
          isCompleted={todo.isCompleted}
        ></Image></View>
          <Text style={theme === 'dark'?{color:"white"}:{color:"black"}}>{todo.date}</Text>
      </TouchableOpacity>
    </>
  );
}
