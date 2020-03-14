import { writable } from 'svelte/store';

let usernames = writable([])
let thisUser = writable('sample user')
let thisColor = writable('')
let thisEmoji = writable('')

export const storeUsernames = {
  subscribe: usernames.subscribe,
  set: val => {
    usernames.set(val)
    localStorage.setItem('usernames', JSON.stringify(val))
  }
}

export const storeThisUser = {
  subscribe: thisUser.subscribe,
  set: val => {
    thisUser.set(val)
    localStorage.setItem('thisUser', JSON.stringify(val))
  }
}

export const storeThisColor = {
  subscribe: thisColor.subscribe,
  set: val => {
    thisColor.set(val)
    localStorage.setItem('thisColor', JSON.stringify(val))
  }
}

export const storeThisEmoji = {
  subscribe: thisEmoji.subscribe,
  set: val => {
    thisEmoji.set(val)
    localStorage.setItem('thisEmoji', JSON.stringify(val))
  }
}