import { useActions } from '@suite-hooks';
import { Translation, AddressLabeling, QuestionTooltip } from '@suite-components';
import styled from 'styled-components';
import { Input } from '@trezor/components';

import { VALIDATION_ERRORS } from '@wallet-constants/sendForm';
import { Output } from '@wallet-types/sendForm';
import { getInputState } from '@wallet-utils/sendFormUtils';
import React from 'react';
import { Props } from './Container';
import * as modalActions from '@suite-actions/modalActions';
import * as sendFormRippleActions from '@wallet-actions/send/sendFormRippleActions';

const Label = styled.div`
    display: flex;
    align-items: center;
`;

const Text = styled.div`
    margin-right: 3px;
`;

const getErrorMessage = (error: Output['address']['error'], isLoading: boolean) => {
    if (isLoading && !error) return 'Loading'; // TODO loader or text?

    switch (error) {
        case VALIDATION_ERRORS.IS_EMPTY:
            return <Translation id="TR_ADDRESS_IS_NOT_SET" />;
        case VALIDATION_ERRORS.NOT_VALID:
            return <Translation id="TR_ADDRESS_IS_NOT_VALID" />;
        case VALIDATION_ERRORS.XRP_CANNOT_SEND_TO_MYSELF:
            return <Translation id="TR_XRP_CANNOT_SEND_TO_MYSELF" />;
        default:
            return undefined;
    }
};

export default ({ output, account, sendFormActions, send, register, errors, touched }: Props) => {
    // if (!account) return null;
    const { address, id } = output;
    const openModal = useActions(modalActions.openModal);
    const checkReserve = useActions(sendFormRippleActions.checkAccountReserve);
    // const openModal2 = useActions(modalActions.onReceiveConfirmation);
    // const { isComposing } = send;
    const showLoadingForCompose = false;
    const isComposing = false;
    const { value, error } = address;

    // if (isComposing && account.networkType === 'bitcoin') {
    //     showLoadingForCompose = true;
    // }

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    const er = errors ? errors[id] : null;
    const validate = touched && touched[id];

    return (
        <Input
            state={getInputState(error, value, showLoadingForCompose, true)}
            monospace
            topLabel={
                <Label>
                    <Text>
                        <Translation id="TR_RECIPIENT_ADDRESS" />
                    </Text>
                    <QuestionTooltip messageId="TR_RECIPIENT_ADDRESS_TOOLTIP" />
                </Label>
            }
            bottomText={(er && er.message) || <AddressLabeling address={value} knownOnly />}
            button={{
                icon: 'QR',
                onClick: () =>
                    openModal({
                        type: 'qr-reader',
                        outputId: id,
                    }),
                text: <Translation id="TR_SCAN" />,
            }}
            // value={value || ''}
            name={`address[${id}]`}
            innerRef={register({
                // required: true,
                validate: async value => {
                    if (!validate && value.length === 0) return true; // address is valid until not touched (tx not final)
                    // 1. length (every coin different)
                    // 2. checksum
                    // 3. reserve?

                    // TODO: debouncing
                    // await sleep(3000);
                    // const r = await checkReserve(0, 'abc');
                    const rand = Math.random();
                    console.warn('asyc RESULT', rand, validate);
                    return value === 'a' ? true : 'i huj!';
                },
                // validate: {
                //     // TR_EMPTY: value => value.length === 0,
                //     TR_INVALID: value => value.length === 1,
                //     // TR_INVALID2: async value => {
                //     //     await sleep(1000);
                //     //     return value === 'aaa';
                //     // },
                // },
            })}
            // onChange={e => sendFormActions.handleAddressChange(id, e.target.value)}
        />
    );
};
