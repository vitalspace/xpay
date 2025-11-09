import  { rpc }  from '@stellar/stellar-sdk';

export const STELLAR_CONFIG = {
  horizonUrl: 'https://horizon-testnet.stellar.org',
  sorobanUrl: 'https://soroban-testnet.stellar.org',
  networkPassphrase: 'Test SDF Network ; September 2015',
  contractId: process.env.PAYWALL_CONTRACT_ID || 'CAELLNHR6MHAIUH6S4ECZ3GOHIXXU5XNLX6TTLKGIBJMZLID3VZ3WZFX',
};

export const sorobanServer = new rpc.Server(STELLAR_CONFIG.sorobanUrl);
