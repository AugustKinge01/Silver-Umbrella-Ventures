
import { TonConnectButton } from '@tonconnect/ui-react';

const TonWalletButton = () => {
  return (
    <TonConnectButton 
      className="ton-connect-button"
      style={{
        background: '#0088CC',
        color: 'white',
        borderRadius: '8px',
        padding: '8px 16px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500'
      }}
    />
  );
};

export default TonWalletButton;
