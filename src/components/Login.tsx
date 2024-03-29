import React, { useContext, useEffect, useState } from "react";
import { checkout, config } from '@imtbl/sdk';
import { passportInstance } from '@/utils/immutable';
import { UserContext } from "@/utils/Context";
import Load from "./utils/Load";

const checkoutSDK = new checkout.Checkout({
  baseConfig: {
    environment: config.Environment.SANDBOX,
    publishableKey: process.env.NEXT_PUBLIC_PUBLISH_KEY || '',
  },
  passport: passportInstance,
});

interface LoadProps {
  userLoading: boolean;
}

function Login({ userLoading }: LoadProps) {
  const [Open, setOpen] = useState(false);
  const [_, setUser] = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  const [connect, setConnect] =
    useState<checkout.Widget<typeof checkout.WidgetType.CONNECT>>();

  useEffect(() => {
    (async () => {
      const widgets = await checkoutSDK.widgets({
        config: { theme: checkout.WidgetTheme.DARK },
      });
      const connect = widgets.create(checkout.WidgetType.CONNECT);
      setLoading(false);
      if (Open) {
        connect.mount("connect");
        setConnect(connect)
      }
    })();
  }, [Open]);

  useEffect(() => {
    if (!connect) return;

    connect.addListener(checkout.ConnectEventType.SUCCESS, (data: any) => {
      localStorage.setItem('user_provider_pixels_invader', data.walletProviderName || '');
      setUser(data.walletProviderName);
    });

    connect.addListener(checkout.ConnectEventType.CLOSE_WIDGET, () => {
      connect.unmount();
      setOpen(false);
    });

    return () => {
      connect.removeListener(checkout.ConnectEventType.SUCCESS);
    };
  }, [connect]);

  const headerHeight = 4.6;

  return (
    <div className="flex items-center bg-gray-950 text-white justify-center" style={{ minHeight: `calc(100vh - ${headerHeight}rem)` }}>
      <div className="text-center flex items-center justify-center flex-col">
        <h1 className="text-3xl font-bold my-4">Please Login</h1>
        {!Open ? <button onClick={() => {
          setOpen(true)
        }} className="font-bold text-xl bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600 transition duration-300" disabled={loading || userLoading}>{loading || userLoading ? <Load /> : 'Log in with Wallet'}</button> : null}
        <h1 className="text-lg font-semibold mt-4">Reload in case of error or the button is still loading even after half a minute.</h1>
        <div className='my-6' id="connect" />
      </div>
    </div>
  );
}

export default Login;
