import { EnrollmentKey } from '~store/modules/enrollmentkeys'

export function isEnrollmentKeyValid(key: EnrollmentKey): boolean {
  if (
    key.uses_remaining > 0 &&
    key.expiration < Date.now() &&
    !key.unlimited
  ) {
    return false
  }
  return true
}
