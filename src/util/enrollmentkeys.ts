import { EnrollmentKey } from '~store/modules/enrollmentkeys'

export function isEnrollmentKeyValid(key: EnrollmentKey): boolean {
  if (key === undefined || key === null) {
		return false
	}
	if (key.uses_remaining > 0) {
		return true
	}
	if (new Date(key.expiration).getTime() > Date.now()) {
		return true
	}

	return key.unlimited
}
