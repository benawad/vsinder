import { MigrationInterface, QueryRunner } from "typeorm";

export class NumSwipes1607570310661 implements MigrationInterface {
  name = "NumSwipes1607570310661";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "numSwipes" integer NOT NULL DEFAULT '0'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "numSwipes"`);
  }
}
