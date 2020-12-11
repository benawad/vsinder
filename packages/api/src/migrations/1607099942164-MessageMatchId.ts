import { MigrationInterface, QueryRunner } from "typeorm";

export class MessageMatchId1607099942164 implements MigrationInterface {
  name = "MessageMatchId1607099942164";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`delete from "message"`);
    await queryRunner.query(
      `ALTER TABLE "message" ADD "matchId" character varying`
    );
  }

  public async down(): Promise<void> {}
}
