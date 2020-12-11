import {MigrationInterface, QueryRunner} from "typeorm";

export class Read121606611089464 implements MigrationInterface {
    name = 'Read121606611089464'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "read"`);
        await queryRunner.query(`ALTER TABLE "match" ADD "read1" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "match" ADD "read2" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."codeImgIds" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "codeImgIds" SET DEFAULT '{}'::text[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "codeImgIds" SET DEFAULT '{}'`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."codeImgIds" IS NULL`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "read2"`);
        await queryRunner.query(`ALTER TABLE "match" DROP COLUMN "read1"`);
        await queryRunner.query(`ALTER TABLE "match" ADD "read" boolean NOT NULL DEFAULT false`);
    }

}
