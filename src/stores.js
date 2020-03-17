import { writable } from 'svelte/store';

let usernames = writable([])
let ChatRooms = writable([])
let thisUser = writable('sample user')
let thisColor = writable('')
let thisEmoji = writable('')
let RoomName = writable('')
let ChatUnderway = writable(false)

export const storeUsernames = {
  subscribe: usernames.subscribe,
  set: val => {
    usernames.set(val)
    localStorage.setItem('usernames', JSON.stringify(val))
  }
}

export const storeChatRooms = {
  subscribe: ChatRooms.subscribe,
  set: val => {
    ChatRooms.set(val)
    localStorage.setItem('ChatRooms', JSON.stringify(val))
  }
}

export const storeThisUser = {
  subscribe: thisUser.subscribe,
  set: val => {
    thisUser.set(val)
    console.log(`storeThisUser.set called`)
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


export const storeRoomName = {
  subscribe: RoomName.subscribe,
  set: val => {
    RoomName.set(val)
    localStorage.setItem('RoomName', JSON.stringify(val))
  }
}



export const storeChatUnderway = {
  subscribe: ChatUnderway.subscribe,
  set: val => {
    ChatUnderway.set(val)
    localStorage.setItem('ChatUnderway', JSON.stringify(val))
  }
}