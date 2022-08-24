import React from 'react';
import RegisterWalletModal from "./RegisterWalletModal.style";
import MultiplyIcon from '@iso/components/icons/Multiply';
import RegisterBgImage from '@iso/assets/images/register-bg.png'
import BuddiWalletImage from '@iso/assets/images/buddi-wallet-bg.png'
import Button from '@iso/components/uielements/button';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { triggerSetupBuddiWallet } from '../../redux/auth/actions';
export default ({ visible, onCancel = () => { }  }) => {        
    const dispatch = useDispatch()
    const goToWallet = () => {
        dispatch(triggerSetupBuddiWallet(true));
        onCancel();
      };
    return <RegisterWalletModal visible={visible}
        onCancel={onCancel}
        footer={null}
        centered
        className="registerWalletModal"
        closable={false}        
    >
        <Button type="link" className="closeBtn" onClick={onCancel}>
            <MultiplyIcon width={14} height={14} />
        </Button>
        <div className='register-wallet-wrapper'>
            <div className='buddi-image-wrapper'>
                <img src={RegisterBgImage} />
            </div>
            <div className='buddi-wallet-wrapper'>
                <div className='buddi-wallet-content'>
                    <h1>Get paid fast with</h1>
                    <img src={BuddiWalletImage} />
                    <Button
                        type="primary"
                        shape="round"
                        onClick={goToWallet}
                        autoFocus
                    >
                        Setup Your Wallet Now
                    </Button>
                </div>
            </div>
        </div>
    </RegisterWalletModal>
}