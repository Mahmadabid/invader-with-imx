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

    const [bridgeOpen, setBridgeOpen] = useState(false);
    const [swapOpen, setSwapOpen] = useState(false);

    const [bridge, setBridge] =
        useState<checkout.Widget<typeof checkout.WidgetType.BRIDGE>>();
    const [swap, setSwap] =
        useState<checkout.Widget<typeof checkout.WidgetType.SWAP>>();

    useEffect(() => {
        (async () => {
            const widgets = await checkoutSDK.widgets({
                config: { theme: checkout.WidgetTheme.DARK },
            });
            if (bridgeOpen) {
                const bridge = widgets.create(checkout.WidgetType.BRIDGE, { config: { theme: checkout.WidgetTheme.DARK } })
                setBridge(bridge);
                bridge.mount("bridge");
            }
            if (swapOpen) {
                const swap = widgets.create(checkout.WidgetType.SWAP);
                setSwap(swap);
                swap.mount("swap");
            }
        })();        

    }, [bridgeOpen, swapOpen]);

    useEffect(() => {
        if (!bridge) return;

        bridge.addListener(checkout.BridgeEventType.CLOSE_WIDGET, () => {
            bridge.unmount();
            setBridgeOpen(false);
        });
    }, [bridge])

    useEffect(() => {
        if(!swap) return;
    
        swap.addListener(checkout.SwapEventType.CLOSE_WIDGET, () => {
          swap.unmount();
          setSwapOpen(false);
        });
      }, [swap])
    
    const headerHeight = 4.6;

    return (
        <div className="bg-gray-950 text-white text-center pb-1" style={{ minHeight: `calc(100vh - ${headerHeight}rem)` }}>
            <div className='pt-10 justify-center flex flex-col items-center'>
                <h1 className='font-bold text-2xl py-10'>Bridge Ether for IMX from Ethereum to Immutable Zkevm</h1>
                <button onClick={() => setBridgeOpen(true)} className="font-bold text-xl bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600 transition duration-300">Bridge</button>
                <h1 className='font-medium text-lg text-red-600 py-5'>It may take an hour to bridge.</h1>
                <div className='my-6' id="bridge" />
                <h1 className='font-bold text-2xl py-10'>Swap IMX for other tokens</h1>
                <button onClick={() => setSwapOpen(true)} className="font-bold text-xl bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition duration-300">Swap</button>
                <div className='my-6' id="swap" />
            </div>
        </div>);
}

export default Bridge;