import Dialog from 'react-native-dialog';

export function ChoiceDialog({
                                         isVisible,
                                         onClose,
                                         setIsModifyDialogVisible,
                                         deleteTodo,

                                     }) {
    return (
        <Dialog.Container
            visible={isVisible}
            onBackdropPress={onClose}

            verticalButtons="true"
        >
            <Dialog.Title>Que souhaitez-vous faire ?</Dialog.Title>

            <Dialog.Button
                label="Modifier"
                onPress={() => {
                    onClose(); // Close the dialog
                    setTimeout(() => {
                        setIsModifyDialogVisible(true);
                    }, 1000);
                }}
            />

            <Dialog.Button
                label="Supprimer"
                onPress={() => {
                    deleteTodo();
                    onClose();
                }}
                style={{ color: "red" }}
            />

            <Dialog.Button label="Annuler" onPress={onClose} />
        </Dialog.Container>
    );
}
