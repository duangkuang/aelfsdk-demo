import './App.less';
import { PageRouter } from 'routes';
import ScrollToTop from 'components/ScrollToTop';
import Header from 'components/Header';
import Footer from 'components/Footer';
import PageLoading from 'components/PageLoading';
import PageSyncTipsModal from 'components/PageSyncTipsModal';
import { useInit } from 'hooks/useInit';
import { useCheckRoute } from 'hooks';

function App() {
  useInit();
  const isFullPage = useCheckRoute('assets');
  return (
    <>
      <div className="ewell-ui-root" id="project-list-scroll">
        <>
          {/* {!isFullPage && <Header />} */}
          {false && <Header />}
          <ScrollToTop />
          <div className="page-container">
            <PageRouter />
            {/* {!isFullPage && <Footer />} */}
            {false && <Footer />}
          </div>
          <PageLoading />
          <PageSyncTipsModal />
        </>
      </div>
    </>
  );
}

export default App;
