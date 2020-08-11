import { colors, variables } from '@trezor/components';
import React from 'react';
import styled from 'styled-components';
import { ProvidedByInvity } from '@wallet-components';

const Wrapper = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    padding-top: 20px;
    border-top: 1px solid ${colors.NEUE_STROKE_GREY};
`;

const Left = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
    color: ${colors.NEUE_TYPE_LIGHT_GREY};
    font-weight: ${variables.FONT_WEIGHT.DEMI_BOLD};
`;

const Right = styled.div`
    display: flex;
    flex: 1;

    justify-content: flex-end;
`;

const CoinmarketFooter = () => {
    return (
        <Wrapper>
            <Left>
                <ProvidedByInvity />
            </Left>
            <Right>learn more</Right>
        </Wrapper>
    );
};

export default CoinmarketFooter;