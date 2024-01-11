import React, { useContext, useEffect, useState } from "react";
import { checkout, config } from '@imtbl/sdk';
import { passportInstance } from '@/utils/immutable';
import { UserContext } from "@/utils/Context";

const checkoutSDK = new checkout.Checkout({
  baseConfig: {
    environment: config.Environment.SANDBOX,
    publishableKey: process.env.NEXT_PUBLIC_PUBLISH_KEY || '',
  },
  passport: passportInstance,
});

function Login() {
  const [Open, setOpen] = useState(false);
  const [_, setUser] = useContext(UserContext);
  const [connect, setConnect] =
    useState<checkout.Widget<typeof checkout.WidgetType.CONNECT>>();

    useEffect(() => {
    (async () => {
      const widgets = await checkoutSDK.widgets({
        config: { theme: checkout.WidgetTheme.DARK },
      });
      const connect = widgets.create(checkout.WidgetType.CONNECT);
      if (Open) {
        connect.mount("connect");
        setConnect(connect)
      }
    })();
  }, [Open]);

  useEffect(() => {
    if (!connect) return;

    connect.addListener(checkout.ConnectEventType.SUCCESS, (data: checkout.ConnectionSuccess) => {
      setUser(data.walletProviderName)
    });

    connect.addListener(checkout.ConnectEventType.CLOSE_WIDGET, () => {
      connect.unmount();
      setOpen(false);
    });
  }, [connect])


  const headerHeight = 4.6;

  return (
    <div className="flex items-center bg-gray-950 text-white justify-center" style={{ minHeight: `calc(100vh - ${headerHeight}rem)` }}>
      <div className="text-center">
        <h1 className="text-3xl font-bold my-4">Please Login</h1>
        {!Open? <button onClick={() => {
          setOpen(true)
        }} className="font-bold text-xl bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600 transition duration-300">Log in with Wallet</button>: null}
        <div className='my-6' id="connect" />
      </div>
    </div>
  );
}

export default Login;
