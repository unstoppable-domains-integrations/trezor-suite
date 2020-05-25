import { useForm } from 'react-hook-form';
import { useActions } from '@suite-hooks';
import { WalletLayout } from '@wallet-components';
import { Card, Translation } from '@suite-components';
import { Output } from '@wallet-types/sendForm';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { variables, colors } from '@trezor/components';
import Add from './components/Add/components/NetworkTypeBitcoin';
import Address from './components/Address';
import AdditionalForm from './components/AdvancedForm';
import Amount from './components/Amount/Container';
import ButtonToggleAdditional from './components/ButtonToggleAdditional';
import Clear from './components/Clear/Container';
import OutputHeader from './components/OutputHeader';
import ReviewButtonSection from './components/ReviewButtonSection/Container';
import { Props } from './Container';

const Row = styled.div`
    display: flex;
    flex-direction: ${(props: { isColumn?: boolean }) => (props.isColumn ? 'column' : 'row')};
    padding: 0 0 30px 0;

    &:last-child {
        padding: 0;
    }
`;

const Header = styled.div`
    display: flex;
    padding: 6px 12px;
`;

const HeaderLeft = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
    font-size: ${variables.FONT_SIZE.TINY};
    font-weight: ${variables.FONT_WEIGHT.DEMI_BOLD};
    text-transform: uppercase;
    color: ${colors.BLACK50};
`;

const HeaderRight = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 1;
`;

const StyledCard = styled(Card)`
    display: flex;
    flex-direction: column;
    margin-bottom: 40px;
`;

const OutputWrapper = styled.div`
    padding: 0 12px 12px 12px;
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }
`;

const AdditionalInfoWrapper = styled.div`
    margin-top: 20px;
`;

const AdditionalFormHeader = styled.div`
    padding: 5px 12px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
`;

const OUTPUT = {
    id: 0,
    address: { value: null, error: null },
    amount: { value: null, error: null },
    setMax: false,
    fiatValue: { value: null },
    localCurrency: { value: 'usd' },
};

const STATE = {
    address: [''],
    amount: [''],
    fiat: [''],
    fiatCurrency: [''],
    fee: '1',
    feeLimit: '1',
};

export default ({ selectedAccount, sendFormActions, sendFormActionsBitcoin }: Props) => {
    const { register, watch, errors, formState, reset, setValue } = useForm({
        mode: 'onChange',
        defaultValues: STATE,
    });

    const storeTx = useActions(payload => ({
        type: 'STORE-TX',
        payload,
    }));

    const [outputs, setOutputs] = React.useState([OUTPUT]);
    const [account, setAccount] = React.useState(selectedAccount.account);

    useEffect(() => {
        console.warn('on mount2!');
        return () => {
            console.warn('on unmount!');
        };
    }, []);

    useEffect(() => {
        if (!account && selectedAccount.account) {
            // account loaded, load draft or set default
            setAccount(selectedAccount.account);
            console.warn('---1. Load state');
            reset({ ...STATE, amount: ['1'] });
            // setValue('address', ['a']);
        } else if (account !== selectedAccount.account) {
            // account changed (balance? tokens?), validate
            setAccount(selectedAccount.account);
            console.warn('---1ab. Account change, recal state');
            reset({ ...STATE, amount: ['2'] });
        }
        // sendFormActions.init();
        // console.warn('SELECTED ACC CHANE', selectedAccount.account);
    }, [selectedAccount.account, account, reset, setValue]);

    useEffect(() => {
        if (formState.dirty && formState.isValid) {
            console.warn('VALID');
        }
    }, [formState.dirty, formState.isValid]);

    const watchAmount = watch(['amount']);
    useEffect(() => {
        console.warn('watchAmount', watchAmount);
    }, [watchAmount]);

    const addOutput = () => {
        setOutputs([
            ...outputs,
            {
                ...OUTPUT,
                id: outputs[outputs.length - 1].id + 1,
            },
        ]);
    };

    const removeOutput = (id: number) => {
        setOutputs(outputs.filter(o => o.id !== id));
    };

    const watchAllFields = watch();

    // console.warn('RENDER!', formState.touched);
    // console.warn('dirty!', formState.dirty, formState.dirtyFields);
    console.warn('touched!', formState.touched, formState.isValid);
    console.warn('ERRORs!', errors);
    console.warn('watchAllFields!', watchAmount);

    if (!account) {
        return <WalletLayout title="Send" account={selectedAccount} />;
    }

    return (
        <WalletLayout title="Send" account={selectedAccount}>
            <StyledCard
                customHeader={
                    <Header>
                        <HeaderLeft>
                            <Translation
                                id="SEND_TITLE"
                                values={{ symbol: account.symbol.toUpperCase() }}
                            />
                        </HeaderLeft>
                        <HeaderRight>
                            <Clear />
                        </HeaderRight>
                    </Header>
                }
            >
                {outputs.map((output, index) => (
                    <OutputWrapper key={output.id}>
                        <OutputHeader
                            index={index}
                            output={output}
                            removeRecipient={outputs.length > 1 ? removeOutput : undefined}
                        />
                        <Row>
                            <Address
                                output={output}
                                register={register}
                                errors={errors.address}
                                touched={formState.touched.address}
                            />
                        </Row>
                        <Row>
                            <Amount output={output} register={register} errors={errors.amount} />
                        </Row>
                    </OutputWrapper>
                ))}
                <AdditionalInfoWrapper>
                    <Row isColumn>
                        <AdditionalFormHeader>
                            {/* <ButtonToggleAdditional
                                isActive={send.isAdditionalFormVisible}
                                sendFormActions={sendFormActions}
                            /> */}
                            <Add addRecipient={addOutput} />
                        </AdditionalFormHeader>
                        {/* {send.isAdditionalFormVisible && (
                            <AdditionalForm networkType={network.networkType} />
                        )} */}
                    </Row>
                </AdditionalInfoWrapper>
                <ReviewButtonSection />
            </StyledCard>
        </WalletLayout>
    );
};
