import { MigrationInterface, QueryRunner } from "typeorm";

export class MatchId1607098818992 implements MigrationInterface {
  name = "MatchId1607098818992";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`delete from "match"`);
    await queryRunner.query(
      `ALTER TABLE "match" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`
    );
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "PK_6ebfb156c129d27924a4b46ebe1"`
    );
    await queryRunner.query(
      `ALTER TABLE "match" ADD CONSTRAINT "PK_92b6c3a6631dd5b24a67c69f69d" PRIMARY KEY ("id")`
    );
    await queryRunner.query(
      `ALTER TABLE "match" ADD CONSTRAINT "UQ_6ebfb156c129d27924a4b46ebe1" UNIQUE ("userId1", "userId2")`
    );
  }

  public async down(): Promise<void> {}
}
