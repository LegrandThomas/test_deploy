// src/entity/comment.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user';
import { Ressource } from './ressource';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  comment_uuid!: string;

  @Column({ length: 255, nullable: true })
  content!: string;

  @Column({ default: false })
  is_reported!: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @ManyToOne(() => Comment, (comment) => comment.replies)
  @JoinColumn({ name: 'comment_uuid_1' })
  parentComment!: Comment;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'user_uuid' })
  user!: User;

  @ManyToOne(() => Ressource, (ressource) => ressource.comments)
  @JoinColumn({ name: 'ressource_uuid' })
  ressource!: Ressource;

  replies!: Comment[];
}
