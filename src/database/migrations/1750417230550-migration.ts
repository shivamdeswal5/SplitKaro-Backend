import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750417230550 implements MigrationInterface {
    name = 'Migration1750417230550'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "expense" ADD "categoryId" uuid`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "message" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "isRead" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "expense" ADD CONSTRAINT "FK_42eea5debc63f4d1bf89881c10a" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_692a909ee0fa9383e7859f9b406"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP CONSTRAINT "FK_42eea5debc63f4d1bf89881c10a"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "isRead"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "message"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "name"`);
    }

}
