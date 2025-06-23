import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750672810334 implements MigrationInterface {
    name = 'Migration1750672810334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "groups" RENAME COLUMN "createdBy" TO "createdById"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "createdById"`);
        await queryRunner.query(`ALTER TABLE "groups" ADD "createdById" uuid`);
        await queryRunner.query(`ALTER TABLE "groups" ADD CONSTRAINT "FK_e0522c4be8bab20520896919da0" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "groups" DROP CONSTRAINT "FK_e0522c4be8bab20520896919da0"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "createdById"`);
        await queryRunner.query(`ALTER TABLE "groups" ADD "createdById" character varying`);
        await queryRunner.query(`ALTER TABLE "groups" RENAME COLUMN "createdById" TO "createdBy"`);
    }

}
