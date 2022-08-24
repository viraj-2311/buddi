import React from 'react'
import { usePlaidLink } from 'react-plaid-link';
import Button from '@iso/components/uielements/button';

const AddNewBankBtn = ({plaidLinkToken, onAddNewBankSuccess}) => {
    const config = {
        token: plaidLinkToken,
        onSuccess: onAddNewBankSuccess,
        onExit: (error, metadata) => {},
    };
    const { open } = usePlaidLink(config);

    return (
        <Button type={'link'} onClick={() => { open() }} className={'add-new-bank-btn'}>
            + New Bank
        </Button>
    )
}

export default AddNewBankBtn;