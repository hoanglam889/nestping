import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Monitors } from "./Monitors";

@Index("idx_checks_monitor_time", ["monitorId", "checkedAt"], {})
@Index("idx_checks_status", ["status"], {})
@Index("idx_checks_time", ["checkedAt"], {})
@Entity("monitor_checks", { schema: "nestping" })
export class MonitorChecks {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("bigint", { name: "monitor_id", unsigned: true })
  monitorId: string;

  @Column("datetime", { name: "checked_at" })
  checkedAt: Date;

  @Column("enum", { name: "status", enum: ["SUCCESS", "FAILURE"] })
  status: "SUCCESS" | "FAILURE";

  @Column("smallint", {
    name: "http_status_code",
    nullable: true,
    unsigned: true,
  })
  httpStatusCode: number | null;

  @Column("int", { name: "response_time_ms", nullable: true, unsigned: true })
  responseTimeMs: number | null;

  @Column("varchar", { name: "error_type", nullable: true, length: 100 })
  errorType: string | null;

  @Column("text", { name: "error_message", nullable: true })
  errorMessage: string | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt: Date | null;

  @ManyToOne(() => Monitors, (monitors) => monitors.monitorChecks, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "monitor_id", referencedColumnName: "id" }])
  monitor: Monitors;
}
