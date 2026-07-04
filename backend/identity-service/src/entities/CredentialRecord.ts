import { Entity, PrimaryColumn, Column, CreateDateColumn } from "typeorm";

@Entity("credentials")
export class CredentialRecord {
  @PrimaryColumn()
  id!: string; // Unique Credential Hash URI

  @Column()
  subjectDid!: string; // The user's DID

  @Column()
  issuerDid!: string; // The Authority's DID

  @Column("jsonb")
  claims!: Record<string, any>; // Flexible data object for payload claims

  @Column()
  signature!: string; // Issuer's cryptographic signature

  @Column({ default: "active" })
  status!: "active" | "revoked" | "expired";

  @CreateDateColumn()
  createdAt!: Date;
}