/**
 * EnrollmentKey is a key used to control netclient access to netmaker sever.
 */
export interface EnrollmentKey {
  value: string // ID
  tags: string[] // names
  token: string
  networks: string[]
  expiration: number
  uses_remaining: number
  unlimited: boolean
}

export interface GetEnrollmentKeysPayload {
  Request: void
  Response: EnrollmentKey[]
}

export interface DeleteEnrollmentKeyPayload {
  Request: {
    id: EnrollmentKey['value']
  }
  Response: { id: EnrollmentKey['value'] }
}

export interface CreateEnrollmentKeyPayload {
  Request: Omit<EnrollmentKey, 'value' | 'token'>
  Response: EnrollmentKey
}
