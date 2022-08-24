import React from 'react'
import GlobalModal from './GlobalModal.style'
import MultiplyIcon from '@iso/components/icons/Multiply';
import Button from '@iso/components/uielements/button';
import { InfoCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { GlobalModalContext } from './GlobalModalContext'
const ICON_MAP = {
    ERROR: <InfoCircleFilled style={{ color: '#e25656' }} />,
    SUCCESS: <CheckCircleFilled style={{ color: '#19913d' }} />,
}
export default () => {
    let { modal } = React.useContext(GlobalModalContext);
    return (
        <GlobalModal
            visible={modal?.visible}
            onCancel={modal?.onCancel}
            footer={null}
            closable={false}
            width={modal?.width || 400}>
            <Button type="link" className="closeBtn" onClick={modal?.onCancel}>
                <MultiplyIcon width={14} height={14} />
            </Button>
            {modal?.icon || modal?.type && ICON_MAP[modal?.type] && <p className="modal-icon-wrapper">
                {modal?.icon || ICON_MAP[modal?.type]}
            </p>
            }
            {modal?.title && <h2 className="title">{modal?.title}</h2>}
            {modal?.description && <p className="description">{modal?.description}</p>}
            <div className={`actions ${modal?.buttonVertical && 'column' || ''}`}>
                <Button
                    type="primary"
                    shape="round"
                    onClick={modal?.onPrimary}
                    autoFocus
                >
                    {modal?.primaryText}
                </Button>
                {
                    modal?.secondary!=null && <Button
                        shape="round"
                        onClick={modal?.onSecondary}
                        autoFocus
                    >
                        {modal?.secondaryText}
                    </Button>
                }
            </div>
        </GlobalModal>
    )
}