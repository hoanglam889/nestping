import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";
import { NotificationLogs } from "./NotificationLogs";

@Index("idx_channels_user", ["userId"], {})
@Entity("notification_channels", { schema: "nestping" })
export class NotificationChannels {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("bigint", { name: "user_id", unsigned: true })
  userId: string;

  @Column("varchar", { name: "name", length: 100 })
  name: string;

  @Column("enum", { name: "type", enum: ["EMAIL", "TELEGRAM"] })
  type: "EMAIL" | "TELEGRAM";

  @Column("varchar", { name: "destination", length: 255 })
  destination: string;

  @Column("json", { name: "config", nullable: true })
  config: object | null;

  @Column("tinyint", {
    name: "is_active",
    nullable: true,
    width: 1,
    default: () => "'1'",
  })
  isActive: boolean | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @ManyToOne(() => Users, (users) => users.notificationChannels, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;

  @OneToMany(
    () => NotificationLogs,
    (notificationLogs) => notificationLogs.channel
  )
  notificationLogs: NotificationLogs[];
}
