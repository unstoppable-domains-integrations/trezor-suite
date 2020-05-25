import React from 'react';
import { Translation } from '@suite-components/Translation';

import styled from 'styled-components';
import { Icon, colors, variables } from '@trezor/components';
import { DispatchProps } from '../../../../Container';

const Wrapper = styled.div`
    display: flex;
    cursor: pointer;
    font-size: ${variables.FONT_SIZE.TINY};
`;

const StyledIcon = styled(Icon)`
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-top: 1px;
    margin-right: 1ch;
`;

interface Props {
    outputId: number;
    removeRecipient: DispatchProps['sendFormActionsBitcoin'];
}

export default ({ removeRecipient }: Props) => (
    <Wrapper onClick={removeRecipient}>
        <StyledIcon size={12} color={colors.BLACK50} icon="CLEAR" />
        <Translation id="TR_REMOVE" />
    </Wrapper>
);
