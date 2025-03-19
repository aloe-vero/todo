import Dialog from 'react-native-dialog';

export function ModifyDialog({
                                       isVisible,
                                       onClose,
                                       value,
                                       setValue,
                                       modifyTodo,

                                     }) {
  return (
      <Dialog.Container
          visible={isVisible}
          onBackdropPress={onClose}

      >
        <Dialog.Title>Modifier une tâche</Dialog.Title>

        <Dialog.Input onChangeText={setValue} value={value} />

        <Dialog.Button
            label="Modifier"
            onPress={() => {
              modifyTodo();
              onClose();
            }}
        />
      </Dialog.Container>
  );
}
