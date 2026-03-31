import { beforeUpdate } from 'svelte'

export function useClientBeforeUpdate(callback) {
	beforeUpdate(callback)
}
