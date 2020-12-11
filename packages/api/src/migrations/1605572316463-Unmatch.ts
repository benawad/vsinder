import {MigrationInterface, QueryRunner} from "typeorm";

export class Unmatch1605572316463 implements MigrationInterface {
    name = 'Unmatch1605572316463'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match" ADD "unmatched" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."codeImgIds" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "codeImgIds" SET DEFAULT '{}'::text[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "codeImgIds" SET DEFAULT '{}'`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."codeImgIds" IS NULL`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "unmatched"`);
    }

}
