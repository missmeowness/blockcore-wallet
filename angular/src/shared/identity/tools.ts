import { keyUtils, Secp256k1KeyPair } from '@transmute/did-key-secp256k1';
import { ISecp256k1PrivateKeyJwk } from '@transmute/did-key-secp256k1/dist/keyUtils';
import { BlockcoreIdentity } from './identity';
import { KeyPair } from './interfaces';
import * as bs58 from 'bs58';
import * as secp from '@noble/secp256k1';
import { VerificationMethod } from 'did-resolver';

export class BlockcoreIdentityTools {
  /** Get the address (identity) of this DID. Returned format is "did:is:[publicKey]". Supports using publicKeyMultibase or publicKey, which can be in format of schnorr string, or array of both Schnorr and ECDSA type. */
  getIdentifier(options: {
    publicKey: string | Uint8Array;
    publicKeyMultibase: string;
  }) {
    let pubkey = '';

    // If the buffer is not supplied, then we'll convert base58 to buffer.
    if (options.publicKeyMultibase) {
      pubkey = options.publicKeyMultibase.slice(1); // Slice off the multibase prefix, 'f'.
    }

    if (options.publicKey instanceof Uint8Array) {
      let buffer;

      if (options.publicKey.length == 33) {
        buffer = this.convertEdcsaPublicKeyToSchnorr(options.publicKey);
      }

      pubkey = this.schnorrPublicKeyToHex(buffer);
    } else {
      pubkey = options.publicKey;
    }

    return `${BlockcoreIdentity.PREFIX}${pubkey}`;
  }

  convertEdcsaPublicKeyToSchnorr(publicKey: Uint8Array) {
    if (publicKey.length != 33) {
      throw Error(
        'The public key must be compressed EDCSA public key of length 33.'
      );
    }

    const schnorrPublicKey = publicKey.slice(1);
    return schnorrPublicKey;
  }

  //   getIdentifiers(identity: string | any): { id: string; controller: string } {
  //     return {
  //       id: `${identity}#key-1`,
  //       controller: `${identity}`,
  //     };
  //   }

  getProfileNetwork() {
    return {
      messagePrefix: '\x18Identity Signed Message:\n',
      bech32: 'id',
      bip32: {
        public: 0x0488b21e,
        private: 0x0488ade4,
      },
      pubKeyHash: 55,
      scriptHash: 117,
      wif: 0x08,
    };
  }

  //   getIdentifier(publicKey: Uint8Array) {
  //     return this.schnorrPublicKeyToHex(
  //       this.convertEdcsaPublicKeyToSchnorr(publicKey)
  //     );
  //   }

  //   convertEdcsaPublicKeyToSchnorr(publicKey: Uint8Array) {
  //     if (publicKey.length != 33) {
  //       throw Error(
  //         'The public key must be compressed EDCSA public key of length 33.'
  //       );
  //     }

  //     const schnorrPublicKey = publicKey.slice(1);
  //     return schnorrPublicKey;
  //   }

  schnorrPublicKeyToHex(publicKey: Uint8Array) {
    return secp.utils.bytesToHex(publicKey);
  }

  generateKey(): Uint8Array {
    return secp.utils.randomPrivateKey();
  }

  generateKeyPair(): KeyPair {
    const key = this.generateKey();
    const identifier = this.getIdentifier(key);

    return {
      privateKey: key,
      publicKey: identifier,
    };
  }

  /** Used to create an instance of the key pair from base58/hex formats. The public key must be in base58 encoding. */
  //   async keyPairFrom(options: {
  //     publicKeyBase58: string | any;
  //     privateKeyBase58?: string;
  //     privateKeyHex?: string;
  //     privateKeyJwk?: string | any | ISecp256k1PrivateKeyJwk;
  //   }): Promise<Secp256k1KeyPair> {
  //     if (options.privateKeyHex && options.privateKeyHex.startsWith('0x')) {
  //       options.privateKeyHex = options.privateKeyHex.substring(2);
  //     }

  //     const identity = this.getIdentity(options);
  //     const identifiers = this.getIdentifiers(identity);

  //     options = Object.assign(options, identifiers);

  //     // Get a new key instance parsed from either base58, hex or jwk.
  //     // The public key we require to base58, because we must include it in the options to override defaults.
  //     const key = await Secp256k1KeyPair.from(options);

  //     return key;
  //   }

  /** Converts the KeyPair and returns an verificationMethod structure with multibase public key. */

  /** Get a VerificationMethod structure from a keypair instance. */
  getVerificationMethod(key: KeyPair): VerificationMethod {
    const did = `${BlockcoreIdentity.PREFIX}${key.publicKey}`;

    return {
      id: did,
      type: 'SchnorrSecp256k1Signature2019',
      controller: did,
      publicKeyMultibase: 'f' + key.publicKey,
    };
  }
}
