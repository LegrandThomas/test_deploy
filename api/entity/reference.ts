// src/entity/reference.ts
import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Ressource } from './ressource';
import { SharingSession } from './sharingSession';

@Entity('reference')
export class Reference {
  @PrimaryColumn('uuid')
  ressource_uuid!: string;

  @PrimaryColumn('uuid')
  sharing_session_uuid!: string;

  @ManyToOne(() => Ressource)
  @JoinColumn({ name: 'ressource_uuid' })
  ressource!: Ressource;

  @ManyToOne(() => SharingSession)
  @JoinColumn({ name: 'sharing_session_uuid' })
  sharingSession!: SharingSession;
}
