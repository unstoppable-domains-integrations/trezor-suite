import React from 'react';
import { useSelector } from '@suite-hooks';
import { Button, CleanSelect, colors, variables } from '@trezor/components';
import regional from '@wallet-constants/coinmarket/regional';
import { AmountLimits } from '@wallet-utils/coinmarket/buyUtils';
import { BuyInfo } from '@wallet-actions/coinmarketBuyActions';
import { Controller, useFormContext } from 'react-hook-form';
import styled from 'styled-components';

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    padding-top: 50px;
    border-top: 1px solid ${colors.NEUE_STROKE_GREY};
`;

const Left = styled.div`
    display: flex;
    flex: 1;
`;

const Right = styled.div`
    display: flex;
    flex: 1;
    justify-content: flex-end;
`;

const Label = styled.div`
    display: flex;
    align-items: center;
    padding-right: 5px;
    white-space: nowrap;
    padding-top: 1px;
    color: ${colors.NEUE_TYPE_LIGHT_GREY};
    font-weight: ${variables.FONT_WEIGHT.DEMI_BOLD};
`;

const StyledButton = styled(Button)`
    min-width: 200px;
    margin-left: 20px;
`;

interface Props {
    buyInfo: BuyInfo;
    setAmountLimits: (amountLimits: AmountLimits | undefined) => void;
}

const Footer = ({ buyInfo, setAmountLimits }: Props) => {
    const { control, formState, watch } = useFormContext();
    const countrySelect = 'countrySelect';
    const selectedAccount = useSelector(state => state.wallet.selectedAccount);

    if (selectedAccount.status !== 'loaded') {
        return null;
    }

    const country = buyInfo.buyInfo?.country || regional.unknownCountry;
    const defaultCountry = {
        label: regional.countriesMap.get(country),
        value: country,
    };

    const hasValues =
        (watch('fiatInput') || watch('cryptoInput')) && !!watch('currencySelect').value;

    return (
        <Wrapper>
            <Left>
                <Label>Offers for:</Label>
                <Controller
                    control={control}
                    defaultValue={defaultCountry}
                    name={countrySelect}
                    render={({ onChange, value }) => {
                        return (
                            <CleanSelect
                                noTopLabel
                                isHovered
                                options={regional.countriesOptions}
                                isSearchable
                                value={value}
                                isClearable={false}
                                minWidth="160px"
                                onChange={(selected: any) => {
                                    onChange(selected);
                                    setAmountLimits(undefined);
                                }}
                            />
                        );
                    }}
                />
            </Left>
            <Right>
                <StyledButton
                    isDisabled={!(formState.isValid && hasValues) || formState.isSubmitting}
                    isLoading={formState.isSubmitting}
                    type="submit"
                >
                    Show offers
                </StyledButton>
            </Right>
        </Wrapper>
    );
};

export default Footer;