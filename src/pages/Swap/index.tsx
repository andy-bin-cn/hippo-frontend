import { Popover } from 'components/Antd';
import Card from 'components/Card';
import { Formik, FormikHelpers } from 'formik';
import { useCallback, useMemo, useState } from 'react';
import * as yup from 'yup';
import { SettingIcon } from 'resources/icons';
import SwapSetting from './components/SwapSetting';
import styles from './Swap.module.scss';
import { useSelector } from 'react-redux';
import { getSwapSettings } from 'modules/swap/reducer';
import TokenSwap from './components/TokenSwap';
import useHippoClient from 'hooks/useHippoClient';
import { ISwapSettings } from './types';

const validationSchema = yup.object({
  // currencyFrom: yup.object().shape({
  //   // token: yup.required(),
  //   amount: yup.number().required(),
  //   balance: yup.number().required()
  // }),
  // currencyTo: yup.object().shape({
  //   // token: yup.required(),
  //   amount: yup.number().required(),
  //   balance: yup.number().required()
  // })
  currencyFrom: yup.object({
    // token: yup.required(),
    amount: yup.number().required(),
    balance: yup.number().required()
  })
});

const Swap: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const swapSettings = useSelector(getSwapSettings);
  const { hippoSwap, hippoWallet, requestSwapByRoute } = useHippoClient();

  const renderCardHeader = useMemo(
    () => (
      <div className="absolute w-14 h-14 rounded-xxl shadow-main1 top-0 -right-16 flex justify-center align-center bg-secondary mobile:-top-16 mobile:right-0">
        <Popover
          overlayClassName={styles.popover}
          trigger="click"
          visible={isVisible}
          onVisibleChange={(visible) => setIsVisible(visible)}
          content={<SwapSetting onClose={() => setIsVisible(false)} />}
          placement="rightBottom">
          <button className="cursor-pointer">
            <SettingIcon />
          </button>
        </Popover>
      </div>
    ),
    [setIsVisible, isVisible]
  );

  const onSubmitSwap = useCallback(
    async (values: ISwapSettings, formikHelper: FormikHelpers<ISwapSettings>) => {
      const fromSymbol = values.currencyFrom?.token?.symbol.str();
      const toSymbol = values.currencyTo?.token?.symbol.str();
      const fromUiAmt = values.currencyFrom?.amount;
      if (hippoSwap && hippoWallet && fromSymbol && toSymbol && fromUiAmt) {
        const quote = values.quoteChosen;
        if (quote) {
          const result = await requestSwapByRoute(quote, values.slipTolerance);
          if (result) {
            formikHelper.resetForm();
          }
          formikHelper.setSubmitting(false);
        } else {
          // TODO: info bubble "route note available"
        }
      }
    },
    [hippoSwap, hippoWallet, requestSwapByRoute]
  );

  return (
    <div className="w-full flex justify-center items-center h-full relative">
      <Formik
        initialValues={swapSettings}
        validationSchema={validationSchema}
        onSubmit={onSubmitSwap}>
        <Card className="w-full max-w-[497px] min-h-[430px] flex flex-col py-10 relative">
          {renderCardHeader}
          <TokenSwap />
        </Card>
      </Formik>
    </div>
  );
};

export default Swap;
