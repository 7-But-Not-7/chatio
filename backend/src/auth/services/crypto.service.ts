import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createCipheriv, createDecipheriv, randomBytes, randomInt, scryptSync } from "crypto";

@Injectable()
export class CryptoService {
  protected readonly key: Buffer;
  private readonly encryptionAlgorithm: string;

  constructor(private readonly configService: ConfigService) {
    this.key = scryptSync(this.configService.get<string>('CRYPTO_KEY'), 'salt', 32);
    this.encryptionAlgorithm = this.configService.get<string>('CRYPTO_ENCRYPTION_ALGORITHM') as string;
  }

  encrypt(text: string): string {
    try {
      const iv = randomBytes(16); // Generate a 16-byte IV
      const cipher = createCipheriv(this.encryptionAlgorithm, this.key, iv);
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return iv.toString('hex') + ':' + encrypted; // Prepend IV to the encrypted text
    } catch (error) {
      console.error(error);
      throw new Error('Error encrypting text');
    }
  }

  decrypt(encryptedText: string): string {
    try {
      const [ivHex, encrypted] = encryptedText.split(':');
      const iv = Buffer.from(ivHex, 'hex'); // Convert IV from hex to Buffer
      const decipher = createDecipheriv(this.encryptionAlgorithm, this.key, iv);
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      console.error(error);
      throw new Error('Error decrypting text');
    }
  }

  random(n?: number): string {
    if (n) return randomInt(Math.pow(10, n - 1), Math.pow(10, n)).toString();
    return randomBytes(16).toString('hex');
  }
}