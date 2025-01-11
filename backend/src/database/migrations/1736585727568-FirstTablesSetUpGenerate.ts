import { MigrationInterface, QueryRunner } from "typeorm";

export class FirstTablesSetUpGenerate1736585727568 implements MigrationInterface {
    name = 'FirstTablesSetUpGenerate1736585727568'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "theme" character varying NOT NULL DEFAULT 'light', "receiveEmails" boolean NOT NULL DEFAULT true, "receiveNotifications" boolean NOT NULL DEFAULT true, "videoType" character varying NOT NULL DEFAULT 'casual', "readReceipts" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "call_participant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "joinedAt" TIMESTAMP NOT NULL, "leftAt" TIMESTAMP NOT NULL, "callId" uuid, "chatMemberId" uuid, CONSTRAINT "PK_ec54a131e46b1cbfa8293f65562" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "call" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying NOT NULL, "status" character varying NOT NULL, "startedAt" TIMESTAMP NOT NULL, "endedAt" TIMESTAMP NOT NULL, "recordingUrl" character varying, "chatRoomId" uuid, "callerId" uuid, CONSTRAINT "PK_2098af0169792a34f9cfdd39c47" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "role" character varying NOT NULL DEFAULT 'member', "isMuted" boolean NOT NULL DEFAULT false, "isBanned" boolean NOT NULL DEFAULT false, "deletedAt" TIMESTAMP, "userId" uuid, "addedById" uuid, "chatRoomId" uuid, CONSTRAINT "PK_2aad8c13481bba9b43eaa2a774f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "url" character varying NOT NULL, "type" character varying NOT NULL, "size" integer NOT NULL, "messageId" uuid, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "content" character varying NOT NULL, "authorId" uuid, "chatRoomId" uuid, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_invitation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "status" character varying NOT NULL, "isGroup" boolean NOT NULL DEFAULT false, "chatRoomId" uuid, "receiverId" uuid, "senderId" uuid, CONSTRAINT "PK_5b884afbfd6e4620288c78f902c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_room" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying, "description" character varying, "isGroup" boolean DEFAULT false, "isDeleted" boolean NOT NULL DEFAULT false, "createdById" uuid, CONSTRAINT "PK_8aa3a52cf74c96469f0ef9fbe3e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "content" character varying NOT NULL, "type" character varying NOT NULL, "readDate" TIMESTAMP, "deletedDate" TIMESTAMP, "actionURL" character varying, "image" character varying, "userId" uuid, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "fcm_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "token" character varying NOT NULL, "deviceId" character varying NOT NULL, "userId" uuid, CONSTRAINT "UQ_5e9d89960e941c45b0a3090efce" UNIQUE ("userId", "deviceId"), CONSTRAINT "PK_ec8f7ff07f44545126442edd9e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "fullName" character varying, "username" character varying NOT NULL, "phoneNumber" character varying, "email" character varying NOT NULL, "password" character varying, "gender" character varying, "profilePicture" character varying, "emailVerifiedDate" TIMESTAMP, "phoneNumberVerifiedDate" TIMESTAMP, "googleId" character varying, "appleId" character varying, "lastSeen" TIMESTAMP, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_f2578043e491921209f5dadd080" UNIQUE ("phoneNumber"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f2578043e491921209f5dadd08" ON "user" ("phoneNumber") `);
        await queryRunner.query(`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
        await queryRunner.query(`ALTER TABLE "call_participant" ADD CONSTRAINT "FK_ceb8f957dba8ec3e44f002434c6" FOREIGN KEY ("callId") REFERENCES "call"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "call_participant" ADD CONSTRAINT "FK_1a8baeb9b19d1de51f977542527" FOREIGN KEY ("chatMemberId") REFERENCES "chat_member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "call" ADD CONSTRAINT "FK_22b0b3ca3496b57f1fb2a96900f" FOREIGN KEY ("chatRoomId") REFERENCES "chat_room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "call" ADD CONSTRAINT "FK_bc1ce7da4b86dd0dcce42a216af" FOREIGN KEY ("callerId") REFERENCES "chat_member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_member" ADD CONSTRAINT "FK_0b7f67b9d8726c419922462e848" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_member" ADD CONSTRAINT "FK_cfa9077e18c55f229694c82b236" FOREIGN KEY ("addedById") REFERENCES "chat_member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_member" ADD CONSTRAINT "FK_592075056897acf0accad689a11" FOREIGN KEY ("chatRoomId") REFERENCES "chat_room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "FK_a78a68c3f577a485dd4c741909f" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_c72d82fa0e8699a141ed6cc41b3" FOREIGN KEY ("authorId") REFERENCES "chat_member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_f3cc0ca0c4b191410f1e0ab5d21" FOREIGN KEY ("chatRoomId") REFERENCES "chat_room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_invitation" ADD CONSTRAINT "FK_0ab39dba0f47473a8fc4579c037" FOREIGN KEY ("chatRoomId") REFERENCES "chat_room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_invitation" ADD CONSTRAINT "FK_23d7cd69352edb1b1b0b4e35343" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_invitation" ADD CONSTRAINT "FK_a38ea14a16767c03420c04d3c51" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_room" ADD CONSTRAINT "FK_bff80df3083fc07e2b088823da1" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_1ced25315eb974b73391fb1c81b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fcm_token" ADD CONSTRAINT "FK_eda4e3fc14adda28b0c06e095cd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fcm_token" DROP CONSTRAINT "FK_eda4e3fc14adda28b0c06e095cd"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_1ced25315eb974b73391fb1c81b"`);
        await queryRunner.query(`ALTER TABLE "chat_room" DROP CONSTRAINT "FK_bff80df3083fc07e2b088823da1"`);
        await queryRunner.query(`ALTER TABLE "chat_invitation" DROP CONSTRAINT "FK_a38ea14a16767c03420c04d3c51"`);
        await queryRunner.query(`ALTER TABLE "chat_invitation" DROP CONSTRAINT "FK_23d7cd69352edb1b1b0b4e35343"`);
        await queryRunner.query(`ALTER TABLE "chat_invitation" DROP CONSTRAINT "FK_0ab39dba0f47473a8fc4579c037"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_f3cc0ca0c4b191410f1e0ab5d21"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_c72d82fa0e8699a141ed6cc41b3"`);
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "FK_a78a68c3f577a485dd4c741909f"`);
        await queryRunner.query(`ALTER TABLE "chat_member" DROP CONSTRAINT "FK_592075056897acf0accad689a11"`);
        await queryRunner.query(`ALTER TABLE "chat_member" DROP CONSTRAINT "FK_cfa9077e18c55f229694c82b236"`);
        await queryRunner.query(`ALTER TABLE "chat_member" DROP CONSTRAINT "FK_0b7f67b9d8726c419922462e848"`);
        await queryRunner.query(`ALTER TABLE "call" DROP CONSTRAINT "FK_bc1ce7da4b86dd0dcce42a216af"`);
        await queryRunner.query(`ALTER TABLE "call" DROP CONSTRAINT "FK_22b0b3ca3496b57f1fb2a96900f"`);
        await queryRunner.query(`ALTER TABLE "call_participant" DROP CONSTRAINT "FK_1a8baeb9b19d1de51f977542527"`);
        await queryRunner.query(`ALTER TABLE "call_participant" DROP CONSTRAINT "FK_ceb8f957dba8ec3e44f002434c6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f2578043e491921209f5dadd08"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "fcm_token"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TABLE "chat_room"`);
        await queryRunner.query(`DROP TABLE "chat_invitation"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TABLE "file"`);
        await queryRunner.query(`DROP TABLE "chat_member"`);
        await queryRunner.query(`DROP TABLE "call"`);
        await queryRunner.query(`DROP TABLE "call_participant"`);
        await queryRunner.query(`DROP TABLE "settings"`);
    }

}
