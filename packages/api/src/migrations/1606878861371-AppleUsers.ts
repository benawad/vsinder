import {MigrationInterface, QueryRunner} from "typeorm";

export class AppleUsers1606878861371 implements MigrationInterface {
    name = 'AppleUsers1606878861371'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "appleId" text`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_909a03b328747bd46fc52eb66de" UNIQUE ("appleId")`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "githubId" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."githubId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "username" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."username" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."codeImgIds" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "codeImgIds" SET DEFAULT '{}'::text[]`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "profileUrl" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."profileUrl" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "githubAccessToken" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."githubAccessToken" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "other" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."other" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "user"."other" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "other" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."githubAccessToken" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "githubAccessToken" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."profileUrl" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "profileUrl" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "codeImgIds" SET DEFAULT '{}'`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."codeImgIds" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."username" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "username" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."githubId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "githubId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_909a03b328747bd46fc52eb66de"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "appleId"`);
    }

}
