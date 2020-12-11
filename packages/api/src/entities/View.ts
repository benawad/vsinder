import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class View extends BaseEntity {
  @PrimaryColumn()
  viewerId: string;

  @PrimaryColumn()
  targetId: string;

  @ManyToOne(() => User, (u) => u.views, {
    primary: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "viewerId" })
  viewer: Promise<User>;

  @ManyToOne(() => User, (u) => u.targets, {
    primary: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "targetId" })
  target: Promise<User>;

  @Column("boolean")
  liked: boolean;
}
