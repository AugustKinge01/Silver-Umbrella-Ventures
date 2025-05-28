
import { createContext, useContext, ReactNode } from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

const manifestUrl = 'https://silver-umbrella.lovable.app/tonconnect-manifest.json';

type TonContextType = {
  // Add any additional TON-specific methods here
};

const TonContext = createContext<TonContextType | undefined>(undefined);

export const TonProvider = ({ children }: { children: ReactNode }) => {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <TonContext.Provider value={{}}>
        {children}
      </TonContext.Provider>
    </TonContext.Provider>
  );
};

export const useTon = () => {
  const context = useContext(TonContext);
  if (context === undefined) {
    throw new Error('useTon must be used within a TonProvider');
  }
  return context;
};
