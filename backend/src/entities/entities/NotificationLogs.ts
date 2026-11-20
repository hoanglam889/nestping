import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { NotificationChannels } from "./NotificationChannels";
import { Incidents } from "./Incidents";

@Index("idx_notification_channel", ["channelId"], {})
@Index("idx_notification_incident", ["incidentId"], {})
@Index("idx_notification_status", ["status"], {})
@Entity("notification_logs", { schema: "nestping" })
export class NotificationLogs {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("bigint", { name: "incident_id", nullable: true, unsigned: true })
  incidentId: string | null;

  @Column("bigint", { name: "channel_id", nullable: true, unsigned: true })
  channelId: string | null;

  @Column("enum", { name: "event_type", enum: ["DOWN", "RECOVERY"] })
  eventType: "DOWN" | "RECOVERY";

  @Column("varchar", { name: "recipient", length: 255 })
  recipient: string;

  @Column("enum", {
    name: "status",
    nullable: true,
    enum: ["PENDING", "SENT", "FAILED"],
    default: () => "'PENDING'",
  })
  status: "PENDING" | "SENT" | "FAILED" | null;

  @Column("tinyint", {
    name: "attempts",
    nullable: true,
    unsigned: true,
    default: () => "'0'",
  })
  attempts: number | null;

  @Column("datetime", { name: "sent_at", nullable: true })
  sentAt: Date | null;

  @Column("text", { name: "error_message", nullable: true })
  errorMessage: string | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @ManyToOne(
    () => NotificationChannels,
    (notificationChannels) => notificationChannels.notificationLogs,
    { onDelete: "SET NULL", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "channel_id", referencedColumnName: "id" }])
  channel: NotificationChannels;

  @ManyToOne(() => Incidents, (incidents) => incidents.notificationLogs, {
    onDelete: "SET NULL",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "incident_id", referencedColumnName: "id" }])
  incident: Incidents;
}
