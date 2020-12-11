import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Message } from "./Message";
import { User } from "./User";

@Unique(["userId1", "userId2"])
@Entity()
export class Match extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId1: string;

  @ManyToOne(() => User, (u) => u.matches1, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId1" })
  user1: Promise<User>;

  @Column()
  userId2: string;

  @ManyToOne(() => User, (u) => u.matches2, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId2" })
  user2: Promise<User>;

  @Column("boolean", { default: false })
  read1: boolean;

  @Column("boolean", { default: false })
  read2: boolean;

  @Column("boolean", { default: false })
  unmatched: boolean;

  @OneToMany(() => Message, (m) => m.match)
  messages: Promise<Message[]>;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;
}
