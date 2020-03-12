import * as sapper from '@sapper/app';
// import clientSocket from 'socket.io-client'

console.log(`window.origin now: ${window.origin}`)

sapper.start({
	target: document.querySelector('#sapper')
});
const clientSocket = io.connect(window.origin)