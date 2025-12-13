export type Project = {
  id: number
  name: string
  owner: User
  memberships: Array<Membership>
}

export type User = {
  id: number
  username: string
}

export type Membership = {
  role: 'viewer' | 'editor'
  user: User
  id: number
}

export interface ChartDataPoint {
  time?: Date
  value: number
  label?: string
  [key: string]: unknown
}
