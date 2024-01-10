import { useEffect, useState } from 'react';
import { checkout, config } from '@imtbl/sdk';
import { passportInstance } from '@/utils/immutable';

  const checkoutSDK = new checkout.Checkout({
    baseConfig: {
      environment: config.Environment.SANDBOX,
      publishableKey: process.env.NEXT_PUBLIC_PUBLISH_KEY || '',
    },
    passport: passportInstance,
  });

const Bridge = () => {

    const [open, setOpen] = useState(false);

    const [bridge, setBridge] =
        useState<checkout.Widget<typeof checkout.WidgetType.BRIDGE>>();

    useEffect(() => {
        if (open) {
            (async () => {
                const widgets = await checkoutSDK.widgets({
                    config: { theme: checkout.WidgetTheme.DARK },
                });
                const bridge = widgets.create(checkout.WidgetType.BRIDGE, { config: { theme: checkout.WidgetTheme.DARK } })
                setBridge(bridge);

                bridge.mount("bridge");
            })();
        }
    }, [open]);

    useEffect(() => {
        if (!bridge) return;

        bridge.addListener(checkout.BridgeEventType.CLOSE_WIDGET, () => {
            bridge.unmount();
            setOpen(false);
        });
    }, [bridge])

    const headerHeight = 4.6;

    return (
        <div className="bg-gray-950 text-white text-center pb-1" style={{ minHeight: `calc(100vh - ${headerHeight}rem)` }}>
            <div className='pt-10 justify-center flex flex-col items-center'>
                <h1 className='font-bold text-2xl py-10'>Bridge Ether for IMX from Ethereum to Immutable Zkevm</h1>
                <button onClick={() => setOpen(true)} className="font-bold text-xl bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600 transition duration-300">Bridge</button>
                <div className='my-6' id="bridge" />
            </div>
        </div>);
}

export default Bridge;