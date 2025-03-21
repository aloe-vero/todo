import { Todo } from '@/types/todo.types';

export const getFilters = (
    todoList: Todo[],
    incompletedList: Todo[],
    completedList: Todo[],
    activeFilter: string
) => [
  { name: 'All', length: todoList.length, isPressed: activeFilter === 'All' },
  {
    name: 'In Progress',
    length: incompletedList.length,
    isPressed: activeFilter === 'In Progress',
  },
  {
    name: 'Done',
    length: completedList.length,
    isPressed: activeFilter === 'Done',
  },
];