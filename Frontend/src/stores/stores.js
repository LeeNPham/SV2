import { writable } from 'svelte/store'

//add username data minus password to stores, call it identity baby

export const isLoggedIn = writable(false)

export const token = writable({})
export const userId = writable('')
export const user_username = writable('')
export const user_description = writable('')
export const myTodos = writable([])
export const categoriesStore = writable([])
