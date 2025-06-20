import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750402834669 implements MigrationInterface {
    name = 'Migration1750402834669'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group-members" DROP COLUMN "name"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group-members" ADD "name" character varying NOT NULL`);
    }

}
