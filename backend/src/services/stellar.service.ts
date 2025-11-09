import { sorobanServer, STELLAR_CONFIG } from '../config/stellar.config';
import { rpc } from '@stellar/stellar-sdk';
import * as StellarSdk from '@stellar/stellar-sdk';

export class StellarService {
  private server: rpc.Server;

  constructor() {
    this.server = sorobanServer;
  }

  // Verificar si un usuario tiene acceso a un post en el contrato
  async hasAccess(postId: string, userAddress: string): Promise<boolean> {
    try {
      // console.log(`StellarService: Checking access for post ${postId} with user ${userAddress}`);
      const contract = new StellarSdk.Contract(STELLAR_CONFIG.contractId);
      // console.log(`StellarService: Contract ID: ${STELLAR_CONFIG.contractId}`);

      // Usar la dirección del usuario como source account para la simulación
      const account = new StellarSdk.Account(userAddress, '0');

      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: STELLAR_CONFIG.networkPassphrase,
      })
        .addOperation(
          contract.call(
            'has_access',
            StellarSdk.nativeToScVal(postId, { type: 'string' }),
            StellarSdk.nativeToScVal(userAddress, { type: 'address' })
          )
        )
        .setTimeout(30)
        .build();

      // console.log(`StellarService: Simulating transaction for access check`);
      const simulated = await this.server.simulateTransaction(transaction);
      // console.log(`StellarService: Simulation result:`, simulated);

      if ('result' in simulated && simulated.result) {
        const result = simulated.result.retval;
        const accessResult = result ? StellarSdk.scValToNative(result) : false;
        console.log(`StellarService: Access result: ${accessResult}`);
        return accessResult;
      }

      console.log(`StellarService: No result in simulation, returning false`);
      return false;
    } catch (error) {
      console.error('StellarService: Error checking access:', error);
      return false;
    }
  }

  // Obtener información de un post del contrato
  async getPost(postId: string,  userAddress: string) {
    try {
      const contract = new StellarSdk.Contract(STELLAR_CONFIG.contractId);

      // Usar la dirección del usuario como source account para la simulación
      const account = new StellarSdk.Account(userAddress, '0');

      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: STELLAR_CONFIG.networkPassphrase,
      })
        .addOperation(
          contract.call(
            'get_post',
            StellarSdk.nativeToScVal(postId, { type: 'string' })
          )
        )
        .setTimeout(30)
        .build();

      const simulated = await this.server.simulateTransaction(transaction);

      if ('result' in simulated && simulated.result) {
        const result = simulated.result.retval;
        return result ? StellarSdk.scValToNative(result) : null;
      }

      return null;
    } catch (error) {
      console.error('Error getting post:', error);
      return null;
    }
  }

  // Verificar que una transacción existe y es exitosa
  async verifyTransaction(txHash: string): Promise<boolean> {
    try {
      const transaction = await this.server.getTransaction(txHash);
      return transaction.status === 'SUCCESS';
    } catch (error) {
      console.error('Error verifying transaction:', error);
      return false;
    }
  }
}

export const stellarService = new StellarService();
