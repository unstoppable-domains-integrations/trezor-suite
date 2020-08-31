import { v4 as uuidv4 } from 'uuid';
import { Account } from '@wallet-types';
import { BuyTrade, BuyTradeQuoteRequest, BuyTradeFormResponse } from 'invity-api';
import { Trade } from '@wallet-reducers/coinmarketReducer';

export interface AmountLimits {
    currency: string;
    minCrypto?: number;
    minFiat?: number;
    maxCrypto?: number;
    maxFiat?: number;
}

// loop through quotes and if all quotes are either with error below minimum or over maximum, return the limits
export function getAmountLimits(
    request: BuyTradeQuoteRequest,
    quotes: BuyTrade[],
): AmountLimits | undefined {
    let minAmount: number | undefined;
    let maxAmount: number | undefined;
    // eslint-disable-next-line no-restricted-syntax
    for (const quote of quotes) {
        // if at least one quote succeeded do not return any message
        if (!quote.error) {
            return;
        }
        if (request.wantCrypto) {
            const amount = Number(quote.receiveStringAmount);
            if (quote.minCrypto && amount < quote.minCrypto) {
                minAmount = Math.min(minAmount || 1e28, quote.minCrypto);
            }
            if (quote.maxCrypto && amount > quote.maxCrypto) {
                maxAmount = Math.max(maxAmount || 0, quote.maxCrypto);
            }
        } else {
            const amount = Number(quote.fiatStringAmount);
            if (quote.minFiat && amount < quote.minFiat) {
                minAmount = Math.min(minAmount || 1e28, quote.minFiat);
            }
            if (quote.maxFiat && amount > quote.maxFiat) {
                maxAmount = Math.max(maxAmount || 0, quote.maxFiat);
            }
        }
    }
    if (minAmount) {
        if (!maxAmount) {
            return request.wantCrypto
                ? { currency: request.receiveCurrency, minCrypto: minAmount }
                : { currency: request.fiatCurrency, minFiat: minAmount };
        }
    } else if (maxAmount) {
        return request.wantCrypto
            ? { currency: request.receiveCurrency, maxCrypto: maxAmount }
            : { currency: request.fiatCurrency, maxFiat: maxAmount };
    }
}

// split the quotes to base and alternative and assign order and payment ids
export function processQuotes(allQuotes: BuyTrade[]): [BuyTrade[], BuyTrade[]] {
    if (!allQuotes) allQuotes = [];
    allQuotes.forEach(q => {
        q.orderId = uuidv4();
        q.paymentId = uuidv4();
    });
    const quotes = allQuotes.filter(q => !q.tags || !q.tags.includes('alternativeCurrency'));
    const alternativeQuotes = allQuotes.filter(
        q => q.tags && q.tags.includes('alternativeCurrency') && !q.error,
    );
    return [quotes, alternativeQuotes];
}

export const getAccountInfo = (account: Account) => {
    switch (account.networkType) {
        case 'bitcoin': {
            const firstUnused = account.addresses?.unused[0];
            if (firstUnused) {
                return { address: firstUnused.address, path: firstUnused.path };
            }

            return { address: undefined, path: undefined };
        }
        case 'ripple':
        case 'ethereum': {
            return {
                address: account.descriptor,
                path: account.path,
            };
        }
        // no default
    }
};

export function createQuoteLink(request: BuyTradeQuoteRequest): string {
    let hash: string;
    if (request.wantCrypto) {
        hash = `qc/${request.country}/${request.fiatCurrency}/${request.cryptoStringAmount}/${request.receiveCurrency}`;
    } else {
        hash = `qf/${request.country}/${request.fiatCurrency}/${request.fiatStringAmount}/${request.receiveCurrency}`;
    }
    return `${window.location.origin}/coinmarket-redirect#/${hash}`;
}

export function createTxLink(trade: BuyTrade): string {
    if (process.env.SUITE_TYPE === 'desktop') {
        return `trezor-suite://coinmarket-detail#/${trade.paymentId}`;
    }

    return `${window.location.origin}/coinmarket-detail#/${trade.paymentId}`;
}

function addHiddenFieldToForm(form: any, fieldName: string, fieldValue: any) {
    const hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = fieldName;
    hiddenField.value = fieldValue;
    form.appendChild(hiddenField);
}

export function submitRequestForm(tradeForm: BuyTradeFormResponse): void {
    if (!tradeForm || !tradeForm.form) return;
    // for IFRAME there is nothing to submit
    if (tradeForm.form.formMethod === 'IFRAME') return;
    const form = document.createElement('form');
    if (tradeForm.form.formMethod === 'GET' && tradeForm.form.formAction) {
        window.open(tradeForm.form.formAction, '_self');
        return;
    }
    form.method = tradeForm.form.formMethod;
    form.action = tradeForm.form.formAction;
    const { fields } = tradeForm.form;
    Object.keys(fields).forEach(k => {
        addHiddenFieldToForm(form, k, fields[k]);
    });
    if (!document.body) return;
    document.body.appendChild(form);
    form.submit();
}

export const getStatusMessage = (status: Trade['data']['status']) => {
    switch (status) {
        case 'LOGIN_REQUEST':
        case 'APPROVAL_PENDING':
            return 'TR_BUY_STATUS_PENDING';
        case 'SUBMITTED':
            return 'TR_BUY_STATUS_PENDING_GO_TO_GATEWAY';
        case 'BLOCKED':
        case 'ERROR':
            return 'TR_BUY_STATUS_ERROR';
        case 'SUCCESS':
            return 'TR_BUY_STATUS_SUCCESS';
        default:
            return 'TR_BUY_STATUS_PENDING';
    }
};
