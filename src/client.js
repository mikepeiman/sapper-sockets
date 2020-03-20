// import * as chat from './chat.js'
import * as sapper from "@sapper/app";

console.log(`window.location now: ${window.location}`);

sapper.start({
  target: document.querySelector("#sapper")
});
