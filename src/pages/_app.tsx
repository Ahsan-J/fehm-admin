import React, { useCallback, useEffect, useMemo } from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app'
import { Provider, useDispatch, useSelector } from 'react-redux';
import { createReduxStore } from '../redux/store';
import { StyleSheet } from 'spidev-react-elements';
import { AppThunkDispatch, RootState } from '../redux/types';
import { useRouter } from 'next/router'
import { setAuthUser } from '../redux/actions/auth';
import MainLayout from '../layout/main';
import Script from 'next/script';
import { authRoutes } from '../constant/app';
import useSocket from '../hooks/useSocket';
import { useRTCClient } from '../helper/rtcClient';

if (typeof window !== 'undefined') {
  StyleSheet.rehydrate((window as any).__REHYDRATE_IDS)
}

const App = React.memo((props) => {
  const user = useSelector((store: RootState) => store.auth.user)
  const router = useRouter();
  const dispatch = useDispatch<AppThunkDispatch>();

  // useRTCClient();
  // const renderBtn = useSocket()

  const authenticate = useCallback(() => {
    const auth_user = localStorage.getItem("auth_user");
    if (auth_user) {
      try {
        return dispatch(setAuthUser(JSON.parse(auth_user)));
      }
      catch (e) {
        console.log(e);
      }
    } else if (!authRoutes.some(v => router.pathname.includes(v))) {
      router.replace('/login');
    }
  }, [dispatch, router]);


  useEffect(() => {
    if (!user?.id) {
      authenticate()
    } else if (authRoutes.some(v => router.pathname.includes(v))) {
      router.replace("/")
    }
  }, [authenticate, router, user]);

  // useInitAPI();

  if (!user?.id) {
    return (
      <React.Fragment>
        {props.children}
      </React.Fragment>
    )
  }

  return (
    <MainLayout>
      {props.children}
    </MainLayout>
  )

})

export default React.memo(({ Component, pageProps }: AppProps) => {
  const store = useMemo(() => createReduxStore(), [])
  return (
    <Provider store={store}>
      <audio id="remoteVideo" autoPlay controls style={{display: "none"}}/>
      <Script src="/jquery.min.js" strategy="beforeInteractive" />
      <Script src="/popper.min.js" strategy="beforeInteractive" />
      <Script src="/bootstrap.min.js" strategy="beforeInteractive" />
      <App>
        <Component {...pageProps} />
      </App>
    </Provider>
  );
});