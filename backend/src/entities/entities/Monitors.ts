import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Incidents } from "./Incidents";
import { MonitorChecks } from "./MonitorChecks";
import { Users } from "./Users";

@Index("idx_monitors_next_check", ["nextCheckAt"], {})
@Index("idx_monitors_status", ["status"], {})
@Index("idx_monitors_user", ["userId"], {})
@Entity("monitors", { schema: "nestping" })
export class Monitors {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("bigint", { name: "user_id", unsigned: true })
  userId: string;

  @Column("varchar", { name: "name", length: 150 })
  name: string;

  @Column("varchar", { name: "url", length: 2048 })
  url: string;

  @Column("varchar", {
    name: "method",
    nullable: true,
    length: 10,
    default: () => "'GET'",
  })
  method: string | null;

  @Column("int", {
    name: "check_interval",
    nullable: true,
    unsigned: true,
    default: () => "'60'",
  })
  checkInterval: number | null;

  @Column("int", {
    name: "timeout",
    nullable: true,
    unsigned: true,
    default: () => "'10'",
  })
  timeout: number | null;

  @Column("enum", {
    name: "status",
    nullable: true,
    enum: ["PENDING", "UP", "DOWN", "PAUSED"],
    default: () => "'PENDING'",
  })
  status: "PENDING" | "UP" | "DOWN" | "PAUSED" | null;

  @Column("int", {
    name: "consecutive_failures",
    nullable: true,
    unsigned: true,
    default: () => "'0'",
  })
  consecutiveFailures: number | null;

  @Column("int", {
    name: "consecutive_successes",
    nullable: true,
    unsigned: true,
    default: () => "'0'",
  })
  consecutiveSuccesses: number | null;

  @Column("datetime", { name: "last_checked_at", nullable: true })
  lastCheckedAt: Date | null;

  @Column("datetime", { name: "next_check_at", nullable: true })
  nextCheckAt: Date | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @OneToMany(() => Incidents, (incidents) => incidents.monitor)
  incidents: Incidents[];

  @OneToMany(() => MonitorChecks, (monitorChecks) => monitorChecks.monitor)
  monitorChecks: MonitorChecks[];

  @ManyToOne(() => Users, (users) => users.monitors, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;
}
