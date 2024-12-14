import { Injectable } from "@nestjs/common";
import { compare, hash } from "bcrypt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class BcryptService {
  private readonly saltRounds: number;

  constructor(private readonly configService: ConfigService) {
    this.saltRounds = parseInt(this.configService.get<string>('BCRYPT_SALT_ROUNDS', '10'), 10);
  }

  async hashPassword(password: string): Promise<string> {
    try {
      return await hash(password, this.saltRounds);
    } catch (error) {
      throw new Error('Hashing password failed');
    }
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    try {
      return await compare(password, hash);
    } catch (error) {
      throw new Error('Comparing password failed');
    }
  }
}