import React from "react";
import MultiplyIcon from '@iso/components/icons/Multiply';
import HowToPayModalWrapper from "./HowToPay.style";
import { Button } from "antd";
import IconBankLink from '@iso/assets/images/ic_card.svg';
import AcceptedIcon from '@iso/assets/images/benji-glass.png';
import Icon from '@iso/components/icons/Icon';

const HowToPay = ({ handleHowToPayModal, selectedPaymentMethod, selectPaymentMethod }) => {
    const paymentMethods = [
        {
            id: 'wallet',
            title: 'Pay using Buddi Wallet',
            time: 'Instant transfer',
            image: <Icon src={AcceptedIcon} width={22} height={41} />,
        },
        {
            id: 'bank',
            title: 'Pay using Bank Account',
            time: '1-3 Business days',
            image: <Icon src={IconBankLink} width={39} height={32} />,
        },
    ];

    const onCancel = () => {
        handleHowToPayModal('close');
    };

    const onContinue = () => {
        handleHowToPayModal('success');
    }

    return (
        <HowToPayModalWrapper
            visible={true}
            maskClosable={false}
            width={680}
            title={'How do you want to pay?'}
            closeIcon={<MultiplyIcon width={14} height={14} />}
            onCancel={onCancel}
            footer={null}
        >
            <div className="inner-content">
                <div className="payment-methods">
                    {
                        paymentMethods.map((paymentMethod) => {
                            const classNames = ['payment-method-item', 'payment-method-' + paymentMethod.id];
                            if (selectedPaymentMethod === paymentMethod.id) {
                                classNames.push('payment-method-item-selected')
                            }

                            return (
                                <div
                                    className={classNames.join(' ')}
                                    key={paymentMethod.id}
                                    onClick={() => {
                                        selectPaymentMethod(paymentMethod.id)
                                    }}
                                >
                                    <div className="payment-method-image">{paymentMethod.image}</div>
                                    <div className="payment-method-content">
                                        <p className={'payment-method-title'}>{paymentMethod.title}</p>
                                        <p className={'payment-method-timing'}>{paymentMethod.time}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="footer-button-container">
                    <Button type={'primary'} shape={'round'} onClick={onContinue}>
                        Continue
                    </Button>
                </div>
            </div>
        </HowToPayModalWrapper>
    )
}

export default HowToPay