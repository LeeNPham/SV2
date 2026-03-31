import { beforeUpdate } from 'svelte'

export function useServerBeforeUpdate(callback) {
	if (typeof window === 'undefined') {
		beforeUpdate(callback)
	}
}
