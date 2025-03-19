import Dialog from 'react-native-dialog';

export function DeleteDialog({
                                         isVisible,
                                         onClose,
                                         deleteAllCompleted,

                                     }) {
    return (
        <Dialog.Container
            visible={isVisible}
            onBackdropPress={onClose}

            verticalButtons="true"
        >
            <Dialog.Title>Êtes-vous sûr de tout supprimer ?</Dialog.Title>

            <Dialog.Button
                label="Supprimer"
                onPress={() => {
                    deleteAllCompleted();
                    onClose();
                }}
            />

            <Dialog.Button label="Annuler" onPress={onClose} style={{ color: "red" }} />
        </Dialog.Container>
    );
}
