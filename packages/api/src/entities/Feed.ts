import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Feed extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("int", { nullable: true })
  cursor: number;

  @Column("text", { array: true })
  userIds: string[];

  @Column()
  ownerId: number;

  @OneToOne(() => User, {
    primary: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "ownerId" })
  owner: Promise<User>;
}
