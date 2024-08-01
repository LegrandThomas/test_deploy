// src/entity/ressource.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinColumn } from 'typeorm';
import { User } from './user';
import { RessourceType } from './ressourceType';
import { RessourceStatus } from './ressourceStatus';
import { Comment } from './comment';
import { Tag } from './tag';
import { RessourceStatusHistory } from './ressourceStatusHistory';

@Entity('ressources')
export class Ressource {
  @PrimaryGeneratedColumn('uuid')
  ressource_uuid!: string;

  @Column({ length: 50 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  content!: string;

  @Column({ length: 255, nullable: true })
  summary!: string;

  @Column({ default: false })
  is_reported!: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @ManyToOne(() => User, (user) => user.ressources)
  @JoinColumn({ name: 'user_uuid' })
  user!: User;

  @ManyToOne(() => RessourceType, (ressourceType) => ressourceType.ressources)
  @JoinColumn({ name: 'ressource_type_uuid' })
  ressourceType!: RessourceType;

  @ManyToOne(() => RessourceStatus, (ressourceStatus) => ressourceStatus.ressources)
  @JoinColumn({ name: 'ressource_status_uuid' })
  ressourceStatus!: RessourceStatus;

  @ManyToOne(() => User, (user) => user.ressources)
  @JoinColumn({ name: 'user_uuid_1' })
  updatedBy!: User;

  @OneToMany(() => Comment, (comment) => comment.ressource)
  comments!: Comment[];

  @OneToMany(() => RessourceStatusHistory, (statusHistory) => statusHistory.ressource)
  statusHistory!: RessourceStatusHistory[];

  @ManyToMany(() => Tag, (tag) => tag.ressources)
  tags!: Tag[];
    sharingSessions: any;
}
