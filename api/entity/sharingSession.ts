// src/entity/sharingSession.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user';
import { Ressource } from './ressource';
import { Tag } from './tag';
import { Reference } from './reference';
import { Refer } from './refer';

@Entity('sharing_sessions')
export class SharingSession {
  @PrimaryGeneratedColumn('uuid')
  sharing_session_uuid!: string;

  @Column({ length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'timestamptz' })
  event_start_datetime!: Date;

  @Column({ type: 'timestamptz' })
  event_end_datetime!: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @ManyToOne(() => User, (user) => user.sharingSessions)
  @JoinColumn({ name: 'user_uuid' })
  user!: User;

  @ManyToMany(() => Ressource, (ressource) => ressource.sharingSessions)
  @JoinTable({
    name: 'reference',
    joinColumn: { name: 'sharing_session_uuid', referencedColumnName: 'sharing_session_uuid' },
    inverseJoinColumn: { name: 'ressource_uuid', referencedColumnName: 'ressource_uuid' }
  })
  ressources!: Ressource[];

  @ManyToMany(() => Tag, (tag) => tag.sharingSessions)
  @JoinTable({
    name: 'refer',
    joinColumn: { name: 'sharing_session_uuid', referencedColumnName: 'sharing_session_uuid' },
    inverseJoinColumn: { name: 'tag_uuid', referencedColumnName: 'tag_uuid' }
  })
  tags!: Tag[];
}
