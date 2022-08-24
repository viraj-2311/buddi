import React from 'react'
import ChangeBankWrapper from "./ChangeBank.style";
import { Form, Radio } from "antd";
import Button from '@iso/components/uielements/button';
import IconBankLink from '@iso/assets/images/ic_card.svg';
import AddNewBankBtn from "./AddNewBankBtn";

const ChangeBank = ({bankAccounts, onCancel, selectBank, selectedBank, plaidLinkToken, onAddNewBankSuccess}) => {
    const selectedBankId = selectedBank.id;
    const submitForm = (values) => {
        selectBank(values.bankAccount)
    }

    return (
        <ChangeBankWrapper>
            <div className="content">
                <Form name={'bankAccountSelect'} layout={'vertical'} onFinish={submitForm}>
                    <Form.Item name={'bankAccount'} initialValue={selectedBankId} style={{marginBottom: 0}}>
                        <Radio.Group>
                            {
                                bankAccounts.map((bankAccount) => {
                                    return (
                                        <Radio value={bankAccount.id} key={bankAccount.id} className='bank-account-view'>
                                            <div className="bank-account-view-inner-content">
                                                <div className='cover-icon'>
                                                    <img src={IconBankLink} alt='Bank' />
                                                </div>
                                                <div className="bank-title-block">
                                                    <p className='bank-title'>{bankAccount.accountName}</p>
                                                    <div className='bank-title-savings'>
                                                        <span>Savings</span>
                                                        <span className={'bank-account-number'}>
                                                        {bankAccount.accountNumber}
                                                    </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Radio>
                                    )
                                })
                            }
                        </Radio.Group>
                    </Form.Item>
                    {
                        plaidLinkToken &&
                        <AddNewBankBtn plaidLinkToken={plaidLinkToken} onAddNewBankSuccess={onAddNewBankSuccess} />
                    }
                    <Form.Item className={'footer-button-container'}>
                        <Button type={'default'} shape={'round'} onClick={onCancel}>Back</Button>
                        <Button type={'primary'} shape={'round'} htmlType="submit">Next</Button>
                    </Form.Item>
                </Form>
            </div>
        </ChangeBankWrapper>
    )
}

export default ChangeBank