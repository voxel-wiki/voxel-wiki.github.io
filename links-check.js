import {URL} from 'node:url';
import net from 'node:net';
import fs from 'node:fs';
import TOML from './j-toml.mjs';

const args = process.argv;
console.log(args);

console.log("Reading references.toml ...");
let references = TOML.parse(fs.readFileSync('./content/wiki/references.toml', 'utf8'));
var out = fs.openSync('links-check-2.log', 'w');

function* next(references) {
	let count = 0;
	for (const ref in references) {
		if(count++ > 100) break;
		yield {
			/** @type string */
			ref: ref,
			/** @type string */
			url: references[ref].url,
			/** @type string */
			title: references[ref].title
		};
	}
}

let headers = new Headers({
	"User-Agent": "voxel.wiki (Link Integrity Checker -MANUALRUN -DEVENV)",
	"X-Notice": "Feel free to block this via a 403 Forbidden. ;)"
});

class Queue {
	constructor(maxConcurrent = 1) {
		this.queue = [];
		this.pendingPromises = 0;
		this.maxConcurrent = maxConcurrent;
	}
	enqueue(promiseGenerator) {
		return new Promise((resolve, reject) => {
			this.queue.push({ promiseGenerator, resolve, reject });
			this._dequeue();
		});
	}
	async _dequeue() {
		if (this.pendingPromises >= this.maxConcurrent) {
			return;
		}
		if (this.queue.length === 0) {
			return;
		}
		this.pendingPromises++;
		const { promiseGenerator, resolve, reject } = this.queue.shift();
		try {
			const result = await promiseGenerator();
			resolve(result);
		} catch (error) {
			reject(error);
		} finally {
			this.pendingPromises--;
			this._dequeue();
		}
	}
}

function delay(ms) {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}

async function proc(ref, url) {
	try {
		/** @type Response */
		const response = await fetch(url, {
			method: 'HEAD',
			keepalive: false,
			headers: headers,
			signal: AbortSignal.timeout(5000) // max 5sec
		});
		
		// If it's OK, dont write anything.
		if(response.status === 200) {return;}
		
		// URL Mismatch, due to redirect/rename/etc.? Write to log.
		if(response.url != url) {
			fs.writeSync(out, `Reference[${ref}] URL '${url}' does not match remote: ${response.url}\n`);
		}
		
		// Write status and response to log.
		fs.writeSync(out, `Reference[${ref}] URL '${url}' returned '${response.status}: ${response.statusText}'\n`);
		fs.fsyncSync(out);
	} catch (error) {
		console.error(ref, url, error);
		if(error && error.message) {
			fs.writeSync(out, `Reference[${ref}] URL '${url}' is unreachable: ${error.message}'\n`);
		} else {
			fs.writeSync(out, `Reference[${ref}] URL '${url}' is unreachable: ${error}'\n`);
		}
		fs.fsyncSync(out);
	}
}

const queue = new Queue(16);

console.log("Enqueuing references ...");

let references_gen = next(references);
let all_promises = [];
while(true) {
	let {done, value} = references_gen.next();
	if(done) break;
	
	// The following domains will be skipped:
	if(value.url.includes("voxel.wiki")
	|| value.url.includes("shadertoy")
	|| value.url.includes("wikipedia")
	|| value.url.includes("youtube")
	|| value.url.includes("twitter")
	) {
		fs.writeSync(out, `Reference[${value.ref}] URL '${value.url}' skipped.\n`);
		continue;
	}
	all_promises.push(queue.enqueue(() => proc(value.ref, value.url)));
}

let last_promise = queue.enqueue(() => Promise.resolve());

console.log("Sleep (1)...");
await last_promise;

console.log("Sleep (2)...");
await Promise.allSettled(all_promises);

console.log("Done!");
fs.closeSync(out);
