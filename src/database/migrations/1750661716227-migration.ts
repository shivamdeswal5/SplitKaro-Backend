import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750661716227 implements MigrationInterface {
    name = 'Migration1750661716227'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" RENAME COLUMN "updatedAt" TO "type"`);
        await queryRunner.query(`ALTER TABLE "groups" ADD "createdBy" character varying`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "type"`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_type_enum" AS ENUM('group', 'expense', 'settlement')`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "type" "public"."notifications_type_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "type" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "notifications" RENAME COLUMN "type" TO "updatedAt"`);
    }

}
