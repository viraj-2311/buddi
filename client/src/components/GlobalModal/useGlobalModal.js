import React from "react";
const initModal = {
    visible: false,
    title: 'Title',
    description: null,
    width: 400,
    buttonVertical: false,
    icon: null,
    type: null,
    primaryText: 'Ok',
    secondaryText: 'Cancel',
    secondary:true,
    onCancel: () => { },
    onOpen: () => { },
    onPrimary: () => { },
    onSecondary: () => { },
}
export default () => {
    let [modal, setModal] = React.useState({
        ...initModal,
        onCancel: () => setModal(prev => ({ ...prev, visible: false })),
        onOpen: () => setModal(prev => ({ ...prev, visible: true })),
        onSecondary: () => setModal(prev => ({ ...prev, visible: false })),
    });
    const onCancelModal = () => setModal(prev => ({ ...prev, visible: false }));
    const onOpenModal = () => setModal(prev => ({ ...prev, visible: true }));
    let initGlobalModal = (p) => {
        try {
            let props = { ...initModal, ...modal };
            props.onCancel = onCancelModal;
            props.onOpen = onOpenModal;
            if (p?.visible) props.visible = p?.visible;
            if (p?.title || p?.title == null) props.title = p?.title
            else props.title = props.title || null;
            if (p?.description || p?.description == null) props.description = p?.description
            else props.description = props.description || null;
            if (p?.width) props.width = p?.width;
            if (p?.onPrimary) {
                props.onPrimary = () => {
                    onCancelModal();
                    p.onPrimary();
                }
            }
            else props.onPrimary = props.onCancel || onCancelModal;
            if (p?.onSecondary) {
                props.onSecondary = () => {
                    onCancelModal();
                    p.onSecondary();
                }
            }
            else if (p?.onSecondary == null) props.onSecondary = onCancelModal
            else props.onSecondary = props.onSecondary || onCancelModal;
            if (p?.buttonVertical) props.buttonVertical = p?.buttonVertical;
            if (p?.icon) props.icon = p?.icon;
            if (p?.type) props.type = p?.type;
            if (p?.primaryText) props.primaryText = p?.primaryText;
            if (p?.secondaryText) props.secondaryText = p?.secondaryText;
            if(p?.secondary == null) props.secondary = null;
            else props.secondary = true;
            setModal(prev => ({ ...prev, ...props }))
        } catch (error) {
            console.log({ error })
            setModal({
                ...initModal,
                onCancel: onCancelModal,
                onOpen: onOpenModal,
                onSecondary: onCancelModal,
            });
        }
    };

    return { modal, initGlobalModal };
};
