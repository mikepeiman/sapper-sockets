import * as sapper from '@sapper/app';
import * as chat from './chat.js'
// import clientSocket from 'socket.io-client'

console.log(`window.origin now: ${window.origin}`)

sapper.start({
	target: document.querySelector('#sapper')
});
const clientSocket = io.connect(window.origin)