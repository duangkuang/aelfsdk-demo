import { FormInstance } from 'antd';
import { NamePath } from 'antd/lib/form/interface';
import { ZERO } from 'constants/misc';
import { isUrl } from 'utils/reg';
import { numberGtZEROValidator, numberGteZEROValidator } from 'utils/validate';
import { timesDecimals } from 'utils/calculate';
import storages from './storages';
import { ITradingParCard } from './components/TradingPairList';
import { numberLteZERO } from 'utils/calculate';
import BigNumber from 'bignumber.js';
import { getLocalStorage } from 'utils/format';

type ValidatorFun = (form: FormInstance<any>, v: any) => any;

export const validateFields = async (form: FormInstance<any>, nameList?: NamePath[]) => {
  if (!nameList) return;
  const isValidating = !!nameList.map((name) => form.isFieldValidating(name)).filter((i) => i).length;
  const nameValues = form.getFieldsValue(nameList);
  const isNotEmpty = Object.keys(nameValues)
    .map((key) => nameValues[key])
    .every((val) => !!val);
  console.log('isValidating, isNotEmpty', isValidating, isNotEmpty);
  if (!isValidating && isNotEmpty) form.validateFields(nameList);
  return Promise.resolve();
};

export const tokenGtTokenBalance = async (value: BigNumber) => {
  await numberGteZEROValidator('', value);
  const { decimals, balance }: ITradingParCard = getLocalStorage(storages.ConfirmTradingPair) || {};
  if (!decimals && decimals !== 0 && !balance) {
    return Promise.reject('please go to select token.');
  }
  if (timesDecimals(value, decimals).gt(balance))
    return Promise.reject('Please enter a number not exceeding the token balance in your wallet.');

  return Promise.resolve();
};

export const subscriptionGteTotal = async (form: FormInstance, value: BigNumber) => {
  const { crowdFundingIssueAmount, preSalePrice } = form.getFieldsValue(['crowdFundingIssueAmount', 'preSalePrice']);
  if (crowdFundingIssueAmount && preSalePrice && ZERO.plus(crowdFundingIssueAmount).div(preSalePrice).lt(value))
    return Promise.reject('Please enter a number not exceeding the total amount for sale.');

  return Promise.resolve();
};

export const preSalePriceValidator: ValidatorFun = async (form, v) => {
  console.log('preSalePriceValidator', v);
  if (!v) return Promise.reject('Please enter the sale price.');
  const bigV = ZERO.plus(v);
  if (numberLteZERO(bigV)) {
    form.setFieldValue('preSalePrice', '');
    return;
  }
  await tokenGtTokenBalance(bigV);
  await validateFields(form, ['maxSubscription']);
  return Promise.resolve();
};

export const crowdFundingIssueAmountValidator: ValidatorFun = async (form: any, v: any) => {
  if (!v) return Promise.reject('Please enter the total amount for sale.');
  const bigV = ZERO.plus(v);
  await numberGtZEROValidator('', v);
  await tokenGtTokenBalance(bigV);
  await validateFields(form, ['maxSubscription']);
  return Promise.resolve();
};

export const minSubscriptionValidator: ValidatorFun = async (form, v) => {
  console.log('validate min', v);
  const realValue = form.getFieldValue('minSubscription');
  console.log('minSubscription-realValue', realValue);
  const bigV = ZERO.plus(realValue);

  if (bigV.isNaN()) return Promise.reject('please enter the min allocation.');

  await subscriptionGteTotal(form, bigV);
  const maxSubscription = form.getFieldValue('maxSubscription');
  if (maxSubscription && bigV.gt(maxSubscription))
    return Promise.reject(
      'Please enter whole numbers, ensuring the first is greater than 0 and the second is greater than the first number.',
    );

  return Promise.resolve();
};

export const maxSubscriptionValidator: ValidatorFun = async (form, v) => {
  console.log('validate max', v);
  const realValue = form.getFieldValue('maxSubscription');
  console.log('maxSubscription-realValue', realValue);
  const bigV = ZERO.plus(realValue);

  if (bigV.isNaN()) return Promise.reject('please enter the max allocation.');

  await subscriptionGteTotal(form, bigV);
  const minSubscription = form.getFieldValue('minSubscription');
  if (minSubscription && bigV.lt(minSubscription)) {
    return Promise.reject(
      'Please enter whole numbers, ensuring the first is greater than 0 and the second is greater than the first number.',
    );
  }

  return Promise.resolve();
};

export const urlValidator = async (_: any, v: any) => {
  if (typeof v === 'string' && v.length > 255) return Promise.reject('Your input exceeds maximum length limit.');
  return Promise.resolve(false);
};

export const descriptionValidator = async (_: any, v: any) => {
  if (typeof v === 'string' && v.length > 300) return Promise.reject('Your input exceeds maximum length limit.');
  return Promise.resolve(false);
};

export const urlRequiredValidator = async (_: any, v: any) => {
  if (!v) return Promise.reject(`Please enter`);
  const validator = await urlValidator('', v);
  if (validator) return Promise.reject(validator);
  if (!isUrl(v)) return Promise.reject('Please enter the correct url');
  return Promise.resolve();
};

export const Validators: any = {
  minSubscription: minSubscriptionValidator,
  maxSubscription: maxSubscriptionValidator,
  preSalePrice: preSalePriceValidator,
  crowdFundingIssueAmount: crowdFundingIssueAmountValidator,
};
