import Dialog from 'react-native-dialog';
export function AddDialog({
                                    isVisible,
                                    onClose,
                                    value,
                                    setValue,
                                    addTodo,

                                  }) {
  return (
      <Dialog.Container
          visible={isVisible}
          onBackdropPress={onClose}

      >
        <Dialog.Title>Créer une tâche</Dialog.Title>
        <Dialog.Description>
          Choisis un nom pour la nouvelle tâche
        </Dialog.Description>
        <Dialog.Input onChangeText={setValue} value={value} />
        <Dialog.Button
            label="Créer"
            onPress={() => {
              addTodo();
              onClose(); // Close the dialog after adding
            }}
        />
      </Dialog.Container>
  );
}