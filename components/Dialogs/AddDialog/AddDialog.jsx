import Dialog from 'react-native-dialog';
export function AddDialog({
                                    isVisible,
                                    onClose,
                                    value,
                                    setValue,
                                    addTodo,
                                    date,
    setDate,

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
          <Dialog.Input onChangeText={setDate} value={date} />
        <Dialog.Button
            label="Créer"
            onPress={() => {
              addTodo();
              onClose();
            }}
        />
      </Dialog.Container>
  );
}