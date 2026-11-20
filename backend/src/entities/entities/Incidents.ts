import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Monitors } from "./Monitors";
import { NotificationLogs } from "./NotificationLogs";

@Index("idx_incidents_monitor", ["monitorId"], {})
@Index("idx_incidents_started", ["startedAt"], {})
@Index("idx_incidents_status", ["status"], {})
@Entity("incidents", { schema: "nestping" })
export class Incidents {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("bigint", { name: "monitor_id", unsigned: true })
  monitorId: string;

  @Column("varchar", { name: "title", length: 255 })
  title: string;

  @Column("text", { name: "cause", nullable: true })
  cause: string | null;

  @Column("enum", {
    name: "status",
    nullable: true,
    enum: ["OPEN", "RESOLVED"],
    default: () => "'OPEN'",
  })
  status: "OPEN" | "RESOLVED" | null;

  @Column("datetime", { name: "started_at" })
  startedAt: Date;

  @Column("datetime", { name: "detected_at" })
  detectedAt: Date;

  @Column("datetime", { name: "resolved_at", nullable: true })
  resolvedAt: Date | null;

  @Column("int", { name: "duration_seconds", nullable: true, unsigned: true })
  durationSeconds: number | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @ManyToOne(() => Monitors, (monitors) => monitors.incidents, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "monitor_id", referencedColumnName: "id" }])
  monitor: Monitors;

  @OneToMany(
    () => NotificationLogs,
    (notificationLogs) => notificationLogs.incident
  )
  notificationLogs: NotificationLogs[];
}
