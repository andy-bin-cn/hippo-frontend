import { Antd } from 'components';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import commonAction from 'modules/common/actions';
import { Footer, Header } from './components';
import { getLayoutHeight } from 'modules/common/reducer';
import { useSelector } from 'react-redux';
import useCurrentPage from 'hooks/useCurrentPage';
import classNames from 'classnames';
import SwapIllu from 'resources/img/swap-illu-2x.png';
// import styles from './PageLayout.module.scss';

const { Content } = Antd.Layout;

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const contentHeight = useSelector(getLayoutHeight);

  useEffect(() => {
    if (containerRef?.current && containerRef?.current?.clientHeight && !contentHeight)
      dispatch(commonAction.SET_LAYOUT_HEIGHT(containerRef?.current?.clientHeight));
  }, [containerRef, contentHeight, dispatch]);

  const [currentPageName] = useCurrentPage();

  return (
    <Antd.Layout
      className={classNames('relative min-h-screen bg-white overflow-hidden', {
        'bg-home1': currentPageName === 'Home',
        'bg-swap': currentPageName !== 'Home'
      })}>
      {currentPageName !== 'Home' && (
        <>
          <img src={SwapIllu} className="absolute top-0 bottom-0 mx-auto w-full opacity-[0.2]" />
        </>
      )}
      <Header />
      <Content
        className={classNames(
          'relative pt-[136px] px-16 tablet:px-8 mobile:px-4 mobile:pt-[56px]'
        )}>
        <div className={classNames('py-16')} ref={containerRef}>
          <div className="relative z-10">{children}</div>
        </div>
      </Content>
      <Footer />
    </Antd.Layout>
  );
};

export default PageLayout;
