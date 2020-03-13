import { writable } from 'svelte/store';

let usernames = writable([])

export const storeUsernames = {
  subscribe: usernames.subscribe,
  set: val => {
    usernames.set(val)
    localStorage.setItem('usernames', JSON.stringify(val))
  }
}