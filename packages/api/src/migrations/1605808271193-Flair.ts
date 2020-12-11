import {MigrationInterface, QueryRunner} from "typeorm";

export class Flair1605808271193 implements MigrationInterface {
    name = 'Flair1605808271193'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "flair" text NOT NULL DEFAULT ''`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."codeImgIds" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "codeImgIds" SET DEFAULT '{}'::text[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "codeImgIds" SET DEFAULT '{}'`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."codeImgIds" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "flair"`);
    }

}
