import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Match } from "./Match";
import { User } from "./User";

@Entity()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  matchId: string;

  @ManyToOne(() => Match, (m) => m.messages, {
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "senderId" })
  match: Promise<Match>;

  @Column()
  senderId: string;

  @ManyToOne(() => User, (u) => u.messagesSent, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "senderId" })
  sender: Promise<User>;

  @Column()
  recipientId: string;

  @ManyToOne(() => User, (u) => u.messagesRecipiented, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "recipientId" })
  recipient: Promise<User>;

  @Column("text")
  text: string;

  @CreateDateColumn({
    type: "timestamp with time zone",
    transformer: { from: (a) => a.getTime(), to: (a) => a },
  })
  createdAt: Date;
}
