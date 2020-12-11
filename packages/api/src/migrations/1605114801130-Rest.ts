import {MigrationInterface, QueryRunner} from "typeorm";

export class Rest1605114801130 implements MigrationInterface {
    name = 'Rest1605114801130'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "view" ("viewerId" uuid NOT NULL, "targetId" uuid NOT NULL, "liked" boolean NOT NULL, CONSTRAINT "PK_26214426b9bb7fcf9098cb9a169" PRIMARY KEY ("viewerId", "targetId"))`);
        await queryRunner.query(`CREATE TABLE "match" ("userId1" uuid NOT NULL, "userId2" uuid NOT NULL, CONSTRAINT "PK_6ebfb156c129d27924a4b46ebe1" PRIMARY KEY ("userId1", "userId2"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "githubId" text NOT NULL, "username" text NOT NULL, "displayName" text, "bio" text, "goal" text, "gender" text, "genderToShow" text, "birthday" date, "ageRangeMin" integer, "ageRangeMax" integer, "location" text, "codeImgIds" text array NOT NULL DEFAULT '{}'::text[], "profileUrl" text NOT NULL, "photoUrl" text NOT NULL, "githubAccessToken" text NOT NULL, "other" jsonb NOT NULL, "tokenVersion" integer NOT NULL DEFAULT '1', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_0d84cc6a830f0e4ebbfcd6381dd" UNIQUE ("githubId"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "feed" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cursor" integer, "userIds" text array NOT NULL, "ownerId" uuid NOT NULL, CONSTRAINT "REL_fa40eb738e2003671f5e988249" UNIQUE ("ownerId"), CONSTRAINT "PK_8a8dfd1ff306ccdf65f0b5d04b2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "view" ADD CONSTRAINT "FK_e80c2593eb13c0fba1b729c6821" FOREIGN KEY ("viewerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "view" ADD CONSTRAINT "FK_5190bf1a09c9e25879cc67c2839" FOREIGN KEY ("targetId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_20b61eaa0d361848d0158a37754" FOREIGN KEY ("userId1") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_d7df83f58a249bbf65afc9196af" FOREIGN KEY ("userId2") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feed" ADD CONSTRAINT "FK_fa40eb738e2003671f5e988249f" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feed" DROP CONSTRAINT "FK_fa40eb738e2003671f5e988249f"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_d7df83f58a249bbf65afc9196af"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_20b61eaa0d361848d0158a37754"`);
        await queryRunner.query(`ALTER TABLE "view" DROP CONSTRAINT "FK_5190bf1a09c9e25879cc67c2839"`);
        await queryRunner.query(`ALTER TABLE "view" DROP CONSTRAINT "FK_e80c2593eb13c0fba1b729c6821"`);
        await queryRunner.query(`DROP TABLE "feed"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "match"`);
        await queryRunner.query(`DROP TABLE "view"`);
    }

}
