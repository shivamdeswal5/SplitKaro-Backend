import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750589621719 implements MigrationInterface {
    name = 'Migration1750589621719'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expense-members" DROP CONSTRAINT "FK_3763147cc327d7fbed6a7911a22"`);
        await queryRunner.query(`ALTER TABLE "expense-members" ADD CONSTRAINT "FK_3763147cc327d7fbed6a7911a22" FOREIGN KEY ("expenseId") REFERENCES "expense"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expense-members" DROP CONSTRAINT "FK_3763147cc327d7fbed6a7911a22"`);
        await queryRunner.query(`ALTER TABLE "expense-members" ADD CONSTRAINT "FK_3763147cc327d7fbed6a7911a22" FOREIGN KEY ("expenseId") REFERENCES "expense"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
