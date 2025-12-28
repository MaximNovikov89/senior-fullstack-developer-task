import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum UserStatuses {
  ENABLED = 'Enabled',
  DISABLED = 'Disabled',
  DELETED = 'Deleted'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ type: 'json', default: [] }) // ❌ Single role only (was)
  // Changed single role to type json and defaults to an empty array. 
  role: string[];
  // changed to strings array since we are changing the DB role from role to a json array 
  // "it will contain a JSON array of roles"

  @Column({
    type: 'enum',
    enum: UserStatuses,
    default: UserStatuses.ENABLED
    // assuming default is ENABLED (or we can configure otherwise)
  })
  status: UserStatuses
}

// changing the DB schema will include the following:
//
// first of all we do not want to lose any data we have from our current state.
// as a backup i would clone the DB as it is right now just before running the change script.
// the script itself we will run on a separate environment lets say dev environment were we ca safely test without affecting production
//
// we will rename the column from role to roles, change its type from string to JSON
// the script itself should include fetching the relevant data and storing it the as json array 
// we will fetch column role and place it as a string inside an array example: from 'editor' to ['editor']
