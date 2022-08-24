import React from 'react';
import NotEnoughMoneyOnWalletModal from './NotEnoughMoneyOnWalletModal.style';
import { InfoCircleFilled } from '@ant-design/icons';
import MultiplyIcon from '@iso/components/icons/Multiply';
import Button from '@iso/components/uielements/button';
import { formatCurrency } from '@iso/lib/helpers/utility';
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

export default ({visible, walletBalance, closeModal, debitBankAccount}) => {
    const history = useHistory();
    const { companyId } = useSelector((state) => state.AccountBoard);

    const ModalHeader = () => {
        return (
            <>
                <p className='modal-icon'>
                    <InfoCircleFilled style={{ color: '#e25656' }} />
                </p>
                <h3 className='title'>You don't have enough wallet balance</h3>
            </>
        );
    };

    const onCancel = () => {
        closeModal();
    }

    const loadBuddiWallet = () => {
        history.push(`/companies/${companyId}/wallet`);
    }

    return (
        <NotEnoughMoneyOnWalletModal
            onCancel={onCancel}
            visible={visible}
            width={406}
            maskClosable={false}
            title={<ModalHeader />}
            footer={null}
            closeIcon={<MultiplyIcon width={14} height={14} />}
        >
            <div className='inner-content'>
                <div className='note'>
                    Your current wallet balance is <strong>{formatCurrency('$', walletBalance)}</strong>.Please load up
                    your wallet to proceed with the transaction or use a different payment method.
                </div>
                <div className='action-buttons'>
                    <Button type={'primary'} shape={'round'} className={'load-up-wallet-btn'} onClick={loadBuddiWallet}>
                        Load up Buddi Wallet
                    </Button>
                    <Button type={'default'} shape={'round'} onClick={debitBankAccount}>
                        Debit Bank Account
                    </Button>
                </div>
            </div>
        </NotEnoughMoneyOnWalletModal>
    )
}