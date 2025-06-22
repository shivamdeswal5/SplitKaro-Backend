import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750589206633 implements MigrationInterface {
    name = 'Migration1750589206633'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expense-members" ALTER COLUMN "amount" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "expense" ALTER COLUMN "amount" TYPE numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expense" ALTER COLUMN "amount" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "expense-members" ALTER COLUMN "amount" TYPE numeric(10,2)`);
    }

}
