import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { View } from "./View";
import { Match } from "./Match";
import { Message } from "./Message";
import { Report } from "./Report";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text", { unique: true, nullable: true })
  appleId: string | null;

  @Column("text", { unique: true, nullable: true })
  githubId: string | null;

  @Column("text", { unique: true, nullable: true })
  username: string | null;

  @Column("text", { nullable: true })
  displayName: string | null;

  @Column("text", { nullable: true })
  bio: string | null;

  @Column("text", { nullable: true })
  goal: string | null;

  @Column("text", { nullable: true })
  gender: string | null;

  @Column("text", { nullable: true })
  genderToShow: string | null;

  @Column("text", {
    default: "array['male', 'female', 'non-binary']",
    array: true,
  })
  gendersToShow: string[];

  @Column("date", { nullable: true })
  birthday: Date | null;

  @Column("int", { nullable: true })
  ageRangeMin: number | null;

  @Column("int", { nullable: true })
  ageRangeMax: number | null;

  @Column("text", { nullable: true })
  location: string | null;

  @Column("text", { default: "{}", array: true })
  codeImgIds: string[];

  @Column("text", { nullable: true })
  profileUrl: string | null;

  @Column("text")
  photoUrl: string;

  @Column("timestamp with time zone", { default: () => "CURRENT_TIMESTAMP" })
  lastSwipe: Date;

  @Column("int", { default: 0 })
  numSwipes: number;

  @Column("int", { default: 0 })
  numSwipesToday: number;

  @Column("int", { default: 0 })
  numLikes: number;

  @Column("text", { nullable: true })
  githubAccessToken: string | null;

  @Column("boolean", { default: true })
  global: boolean;

  @Column("text", { default: "" })
  flair: string;

  @Column("jsonb", { nullable: true })
  other: any;

  @Column("boolean", { default: false })
  shadowBanned: boolean;

  @Column("int", { default: 1 })
  tokenVersion: number;

  @Column("text", { nullable: true })
  pushToken: string;

  @OneToMany(() => Report, (m) => m.reporter)
  reports: Promise<Report[]>;
  @OneToMany(() => Report, (m) => m.target)
  reportsAgainstMe: Promise<Report[]>;

  @OneToMany(() => View, (m) => m.viewer)
  views: Promise<View[]>;
  @OneToMany(() => View, (m) => m.target)
  targets: Promise<View[]>;

  @OneToMany(() => Match, (m) => m.user1)
  matches1: Promise<Match[]>;

  @OneToMany(() => Match, (m) => m.user2)
  matches2: Promise<Match[]>;

  @OneToMany(() => Message, (m) => m.sender)
  messagesSent: Promise<Message[]>;
  @OneToMany(() => Message, (m) => m.recipient)
  messagesRecipiented: Promise<Message[]>;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;
}
