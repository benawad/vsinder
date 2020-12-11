import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Report extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  reporterId: string;

  @ManyToOne(() => User, (u) => u.reports, {
    primary: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "reporterId" })
  reporter: Promise<User>;

  @Column()
  targetId: string;

  @ManyToOne(() => User, (u) => u.reportsAgainstMe, {
    primary: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "targetId" })
  target: Promise<User>;

  @Column("text")
  message: string;

  @CreateDateColumn({
    type: "timestamp with time zone",
    transformer: { from: (a) => a.getTime(), to: (a) => a },
  })
  createdAt: Date;
}
