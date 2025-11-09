import * as Client from '../packages/paywall_contract';


// Configuración base del contrato
export const CONTRACT_CONFIG = {
  networkPassphrase: 'Test SDF Network ; September 2015',
  contractId: 'CAELLNHR6MHAIUH6S4ECZ3GOHIXXU5XNLX6TTLKGIBJMZLID3VZ3WZFX',
  rpcUrl: "TESTNET",
  allowHttp: true,
};

// Función para crear cliente con publicKey del usuario
export const getPaywallClient = (publicKey?: string) => {
  return new Client.Client({
    ...CONTRACT_CONFIG,
    publicKey, // Se configura dinámicamente
  });
};

// Cliente por defecto (solo lectura)
export default getPaywallClient();
