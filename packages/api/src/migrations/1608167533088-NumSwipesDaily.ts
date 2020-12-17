import { MigrationInterface, QueryRunner } from "typeorm";

export class NumSwipesDaily1608167533088 implements MigrationInterface {
  name = "NumSwipesDaily1608167533088";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "view" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "lastSwipe" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "numSwipesToday" integer NOT NULL DEFAULT '0'`
    );
    await queryRunner.query(
      `
      update "user" u
      set "numSwipes" = (select count(*) from "view" where "viewerId" = u.id)
      `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "numSwipesToday"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastSwipe"`);
    await queryRunner.query(`ALTER TABLE "view" DROP COLUMN "createdAt"`);
  }
}
