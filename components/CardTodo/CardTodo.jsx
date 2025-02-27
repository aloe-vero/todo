import { TouchableOpacity, Text, Image } from 'react-native';
import { s } from './CardTodo.style';
import check from '../../assets/images/check.png';

export function CardTodo({ todo, onTouch, onLongTouch }) {
  return (
    <>
      <TouchableOpacity
        style={s.card}
        todoId={todo.id}
        onPress={onTouch}
        onLongPress={onLongTouch}
      >
        <Text
          style={[
            s.text,
            {
              textDecorationLine: todo.isCompleted ? 'line-through' : 'none',
            },
          ]}
        >
          {todo.title}
        </Text>
        <Image
          style={[s.img, { opacity: !todo.isCompleted ? 0 : 1 }]}
          source={check}
          isCompleted={todo.isCompleted}
        ></Image>
      </TouchableOpacity>
    </>
  );
}
