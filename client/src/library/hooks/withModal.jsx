import React from 'react'
import Modal from '../../components/GlobalModal/GlobalModal.style'

export const withModal = Cmp = props => {
  return (
    <Modal
      visible={props?.open}
      onCancel={props?.onClose}
      footer={null}
      closable={props?.isDismiss}
      width={props?.width || 400}>
        <Cmp {...props} isModal={true} dialog={!isMobile}>

        </Cmp>
    </Modal>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(withModal)
