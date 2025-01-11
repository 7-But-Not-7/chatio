import { MigrationInterface, QueryRunner } from "typeorm";

export class FirstTablesSetUp1736585450441 implements MigrationInterface {
    name = 'FirstTablesSetUp1736585450441'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "settings" ADD "readReceipts" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "readReceipts"`);
    }

}
