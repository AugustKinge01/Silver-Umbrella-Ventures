import { Eip1193Provider } from 'ethers';

declare global {
  interface Window {
    ethereum?: Eip1193Provider & {
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeAllListeners: (event: string) => void;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
    };
  }
}

export {};
