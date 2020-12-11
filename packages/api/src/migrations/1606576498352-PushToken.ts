import {MigrationInterface, QueryRunner} from "typeorm";

export class PushToken1606576498352 implements MigrationInterface {
    name = 'PushToken1606576498352'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "pushToken" text`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."codeImgIds" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "codeImgIds" SET DEFAULT '{}'::text[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "codeImgIds" SET DEFAULT '{}'`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."codeImgIds" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "pushToken"`);
    }

}
