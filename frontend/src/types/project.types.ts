export type Project = {
  id: number
  name: string
  owner: User | null
  memberships: Array<Membership>
}

export type User = {
  id: number | null
  username: string
}

export type Membership = {
  role: 'viewer' | 'editor'
  user: User
  id: number
}
