import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Monitors } from "./Monitors";
import { NotificationChannels } from "./NotificationChannels";

@Index("email", ["email"], { unique: true })
@Entity("users", { schema: "nestping" })
export class Users {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("varchar", { name: "name", length: 100 })
  name: string;

  @Column("varchar", { name: "email", unique: true, length: 255 })
  email: string;

  @Column("varchar", { name: "password", length: 255 })
  password: string;

  @Column("timestamp", { name: "email_verified_at", nullable: true })
  emailVerifiedAt: Date | null;

  @Column("varchar", { name: "remember_token", nullable: true, length: 100 })
  rememberToken: string | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @OneToMany(() => Monitors, (monitors) => monitors.user)
  monitors: Monitors[];

  @OneToMany(
    () => NotificationChannels,
    (notificationChannels) => notificationChannels.user
  )
  notificationChannels: NotificationChannels[];
}
