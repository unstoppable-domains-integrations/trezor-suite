import React from 'react';
import { colors, variables } from '@trezor/components';
import styled from 'styled-components';
import { Output } from '@wallet-types/sendForm';
import Remove from './components/Remove';

import { Props as DProps } from '../../Container';

const Wrapper = styled.div`
    display: flex;
    min-height: 17px;
    justify-content: space-between;
`;

const OutputIndex = styled.div`
    display: flex;
    flex: 1;
    justify-content: center;
    font-size: ${variables.FONT_SIZE.TINY};
    color: ${colors.BLACK25};
`;

const Column = styled.div`
    display: flex;
    flex: 1;
`;

const ColumnRight = styled(Column)`
    justify-content: flex-end;
`;

interface Props {
    index: number;
    output: Output;
    removeRecipient?: (id: number) => void;
}

export default ({ index, output, removeRecipient }: Props) => (
    <Wrapper>
        <Column />
        <Column>{removeRecipient && <OutputIndex>#{index + 1}</OutputIndex>}</Column>
        <ColumnRight>
            {removeRecipient && <Remove removeRecipient={() => removeRecipient(output.id)} />}
        </ColumnRight>
    </Wrapper>
);
