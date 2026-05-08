import {URL} from 'node:url';
import fs from 'node:fs';
import TOML from './j-toml.mjs';

const args = process.argv;
console.log(args);

let references = TOML.parse(fs.readFileSync('./content/wiki/references.toml', 'utf8'));

let seen_host = new Set();
let seen_uris = new Set();
let seen_slug = new Set();
for (const ref in references) {
	seen_uris.add(references[ref].url);
	seen_slug.add(ref);
}

let seen_size = seen_uris.size;
console.log("Currently ", seen_size, " refs.");

let bookmarks = JSON.parse(fs.readFileSync(args[2], 'utf8'));

let results = [];

String.prototype.trimPrefix = function trimPrefix(prefix) {
    if (this.startsWith(prefix)) {
        return this.slice(prefix.length)
    } else {
        return this
    }
};

String.prototype.trimSuffix = function trimSuffix(suffix) {
    if (this.endsWith(suffix)) {
        return this.slice(0, -suffix.length)
    } else {
        return this
    }
};

function slugify(input) {
    if (!input) return '';
    var slug = input.toLowerCase().trim();
    slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    slug = slug.replace(/[^a-z0-9\s-]/g, ' ').trim();
    slug = slug.replace(/[\s-]+/g, '-');
    return slug;
}

const blocklist = [
];

function visit_entry(entry_) {
	let {children, ...entry} = entry_;
	
	check: if(entry.uri && entry.type == "text/x-moz-place") {
		if(entry.uri.startsWith('javascript:')) {break check;}
		if(entry.uri.startsWith('about:')) {break check;}
		if(entry.uri.startsWith('data:')) {break check;}
		if(entry.uri.startsWith('file:')) {break check;}
		if(entry.uri.includes(':8080/')) {break check;}
		if(seen_uris.has(entry.uri)) {break check;}
		let url = URL.parse(entry.uri);
		
		let HOST = url.host.toLowerCase().trimPrefix('www.').trimPrefix('en.');
		let FQDN = HOST.toLowerCase().split('.').reverse().join('.');
		let PATH = url.pathname + url.search + url.hash;
		
		let TITLE = entry.title.replaceAll('"',"'").replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
		let SLUG = slugify(PATH);
		let tags = entry.tags ? entry.tags.split(',').map(t=>t.replaceAll(' ','')) : [];
		
		let INDX = SLUG + ' ' + slugify(TITLE) + ' ' + tags.join(' ');
		let TYPE = "";
		
		for (const block of blocklist) {
			if(HOST.includes(block)) break check;
			if(PATH.includes(block)) break check;
			if(INDX.includes(block)) break check;
		}
		
		if(HOST == 'reddit.com') {
			SLUG = 'reddit' + '-' + SLUG;
		} else if(HOST.endsWith('github.com')) {
			SLUG = 'github' + '-' + SLUG;
			TYPE = 'repository';
		} else if(HOST.endsWith('githubusercontent.com')) {
			SLUG = 'githubusercontent' + '-' + SLUG;
		} else if(HOST.endsWith('gist.github.com')) {
			SLUG = 'gist' + '-' + SLUG;
		} else if(HOST.endsWith('github.io')) {
			let SUBH = HOST.trimSuffix('.github.io');
			SLUG = SUBH + '-' + SLUG; // github.io pages are UGC subdomains
		} else if(HOST.endsWith('gitlab.com')) {
			SLUG = 'gitlab' + '-' + SLUG;
		} else if(HOST.endsWith('bitbucket.org')) {
			SLUG = 'bitbucket' + '-' + SLUG;
		} else if(HOST.endsWith('stackexchange.com')) {
			SLUG = 'stackexchange' + '-' + SLUG;
		} else if(HOST.endsWith('stackoverflow.com')) {
			SLUG = 'stackoverflow' + '-' + SLUG;
		} else if(HOST.endsWith('realtimerendering.com')) {
			SLUG = 'realtimerendering' + '-' + SLUG;
		} else if(HOST.endsWith('redblobgames.com')) {
			SLUG = 'redblobgames' + '-' + SLUG;
		} else if(HOST.endsWith('scratchapixel.com')) {
			SLUG = 'scratchapixel' + '-' + SLUG;
		} else if(HOST.endsWith('blogspot.com')) {
			SLUG = 'blogspot' + '-' + SLUG;
		} else if(HOST.endsWith('oreilly.com')) {
			SLUG = 'oreilly' + '-' + SLUG;
		} else if(HOST.endsWith('gamedev.net')) {
			SLUG = 'gamedev' + '-' + SLUG;
		} else if(HOST.endsWith('reedbeta.com')) {
			SLUG = 'reedbeta' + '-' + SLUG;
		} else if(HOST.endsWith('polygon.com')) {
			SLUG = 'polygon' + '-' + SLUG;
		} else if(HOST.endsWith('slideshare.net')) {
			SLUG = 'slideshare' + '-' + SLUG;
			TYPE = 'presentation';
		} else if(HOST.endsWith('lwn.net')) {
			SLUG = 'lwn' + '-' + SLUG.trimPrefix('articles-');
		} else if(HOST.endsWith('dl.acm.org')) {
			SLUG = 'acm' + '-' + SLUG;
			TYPE = 'paper';
		} else if(HOST.endsWith('acm.org')) {
			SLUG = 'acm' + '-' + SLUG;
		} else if(HOST.endsWith('arxiv.org')) {
			SLUG = 'arxiv' + '-' + SLUG.trimPrefix('abs-').trimPrefix('pdf-');
		} else if(HOST.endsWith('jcgt.org')) {
			SLUG = 'jcgt' + '-' + SLUG.trimPrefix('published-');
		} else if(HOST.endsWith('sourceforge.net')) {
			if(HOST.length > '.sourceforge.net'.length) {
				let SUBH = HOST.trimSuffix('.sourceforge.net');
				SLUG = 'sourceforge' + '-' + SUBH + '-' + SLUG;
			} else {
				SLUG = 'sourceforge' + '-' + SLUG;
			}
		} else if(HOST.endsWith('medium.com')) {
			if(HOST.length > '.medium.com'.length) {
				let SUBH = HOST.trimSuffix('.medium.com');
				SLUG = 'medium' + '-' + SUBH + '-' + SLUG;
			} else {
				SLUG = 'medium' + '-' + SLUG;
			}
		} else if(HOST.endsWith('wordpress.com')) {
			if(HOST.length > '.wordpress.com'.length) {
				let SUBH = HOST.trimSuffix('.wordpress.com');
				SLUG = 'wordpress' + '-' + SUBH + '-' + SLUG;
			} else {
				SLUG = 'wordpress' + '-' + SLUG;
			}
		} else if(HOST.endsWith('devblogs.microsoft.com')) {
			SLUG = 'microsoft-devblogs' + '-' + SLUG;
		} else if(HOST.endsWith('microsoft.com')) {
			SLUG = 'microsoft' + '-' + SLUG;
		} else if(HOST.endsWith('nvidia.com')) {
			SLUG = 'nvidia' + '-' + SLUG;
		} else if(HOST.endsWith('khronos.org')) {
			SLUG = 'khronos' + '-' + SLUG;
		} else if(HOST.endsWith('iquilezles.org')) {
			SLUG = 'iquilezles' + '-' + SLUG;
		} else if(HOST.endsWith('gdcvault.com')) {
			SLUG = 'gdcvault' + '-' + SLUG;
		} else if(HOST.endsWith('rust-lang.org')) {
			SLUG = 'rust-lang' + '-' + SLUG;
		} else if(HOST.endsWith('archive.org')) {
			SLUG = 'archive' + '-' + SLUG;
		} else if(HOST.endsWith('shadertoy.com')) {
			SLUG = 'shadertoy' + '-' + PATH.trimPrefix('/view/');
		} else if(HOST.endsWith('pastebin.com')) {
			SLUG = 'pastebin' + '-' + PATH.substring(1);
		} else if(HOST.endsWith('npmjs.com')) {
			SLUG = 'npmjs' + '-' + SLUG;
		} else if(HOST.endsWith('reddit.com')) {
			SLUG = 'reddit' + '-' + SLUG;
		} else if(HOST.endsWith('crates.io')) {
			SLUG = 'cratesio' + '-' + SLUG.trimPrefix('crates-');
			tags.push('rust', 'library');
		} else if(HOST.endsWith('lib.rs')) {
			SLUG = 'librs' + '-' + SLUG.trimPrefix('crates-');
			tags.push('rust', 'library');
		} else if(HOST.endsWith('itch.io')) {
			SLUG = HOST.trimSuffix('.itch.io') + '-' + SLUG + '-' + slugify(TITLE);
		} else if(HOST.includes('google')) {
			SLUG = 'google' + '-' + SLUG;
		} else if(HOST == 'vimeo.com') {
			SLUG = 'vimeo' + '-' + PATH.substring(1);
		} else if(HOST == 'en.wikipedia.org') {
			SLUG = 'wikipedia' + '-' + SLUG;
		} else if(HOST == 'youtube.com') {
			TITLE = TITLE.trimSuffix(' - YouTube');
			if(url.pathname.startsWith('/watch')) {
				let args = url.search.substring('?v='.length);
				while(args.includes('&')) {
					args = args.substring(0, args.indexOf('&'));
				}
				SLUG = "youtube-" + args;
				TYPE = "video";
			} else if(url.pathname.startsWith('/playlist')) {
				SLUG = "youtube-" + url.search.substring('?list='.length);
				TYPE = "video-list";
			} else if(url.pathname.startsWith('/user/')) {
				SLUG = "youtube-" + slugify(url.pathname.substring('/user/'.length));
				TYPE = "user";
			} else if(url.pathname.startsWith('/channel/')) {
				SLUG = "youtube-" + slugify(url.pathname.substring('/channel/'.length));
				TYPE = "user";
			} else {
				tags.push('youtube');
			}
		} else {
			SLUG = slugify(HOST) + '-' + SLUG;
			seen_host.add(FQDN);
			
			if(!TYPE)if(INDX.includes('guide') || INDX.includes('tutorial')) {
				TYPE = "tutorial";
			}
			
			if(FQDN.startsWith('rs.')) {
				tags.push('rust');
			}
			
			if(!TYPE)if(SLUG.endsWith('pdf')) {TYPE = 'paper';}
			
			if(!TYPE)if(SLUG.endsWith('png')) {TYPE = 'image';}
			if(!TYPE)if(SLUG.endsWith('jpg')) {TYPE = 'image';}
			if(!TYPE)if(SLUG.endsWith('jpeg')) {TYPE = 'image';}
		}
		
		if(seen_slug.has(SLUG)) {
			break check;
		}
		seen_slug.add(SLUG);
		
		if(INDX.includes('render')) tags.push('rendering');
		if(INDX.includes('rasterization')) tags.push('rasterization', 'rendering');
		if(INDX.includes('raytracing')) tags.push('raytracing', 'rendering');
		if(INDX.includes('raycasting')) tags.push('raycasting', 'rendering');
		if(INDX.includes('pathtracing')) tags.push('pathtracing', 'rendering');
		if(INDX.includes('sparse')) tags.push('sparsity');
		if(INDX.includes('octree')) tags.push('octree');
		if(INDX.includes('design')) tags.push('design');
		if(INDX.includes('gpu')) tags.push('gpu');
		if(INDX.includes('directx')) tags.push('directx', 'rendering', 'windows');
		if(INDX.includes('opengl')) tags.push('opengl', 'rendering');
		if(INDX.includes('vulkan')) tags.push('vulkan', 'rendering');
		if(INDX.includes('render')) tags.push('render', 'rendering');
		if(INDX.includes('texture')) tags.push('texture', 'rendering');
		if(INDX.includes('gradient')) tags.push('gradient', 'rendering');
		if(INDX.includes('sampling')) tags.push('sampling', 'rendering');
		if(INDX.includes('temporal')) tags.push('sampling', 'rendering');
		if(INDX.includes('graphics')) tags.push('graphics', 'rendering');
		if(INDX.includes('antialiasing')) tags.push('sampling', 'rendering');
		if(INDX.includes('cull')) tags.push('culling', 'rendering');
		if(INDX.includes('occlu')) tags.push('occlusion', 'rendering');
		if(INDX.includes('color')) tags.push('colors', 'colortheory');
		if(INDX.includes('colour')) tags.push('colors', 'colortheory');
		if(INDX.includes('noise')) tags.push('noise', 'procgen');
		if(INDX.includes('perlin')) tags.push('noise', 'procgen');
		if(INDX.includes('simplex')) tags.push('noise', 'procgen');
		if(INDX.includes('procgen')) tags.push('noise', 'procgen');
		if(INDX.includes('voxel')) tags.push('voxel');
		if(INDX.includes('opengl')) tags.push('opengl');
		if(INDX.includes('-gl')) tags.push('opengl');
		if(INDX.includes('gl-')) tags.push('opengl');
		if(INDX.includes('glsl')) tags.push('opengl');
		if(INDX.includes('gles')) tags.push('opengl');
		if(INDX.includes('npmjs')) tags.push('javascript');
		if(INDX.includes('javascript')) tags.push('javascript');
		if(INDX.includes('eclipse-org')) tags.push('java', 'jvm');
		if(INDX.includes('openjdk')) tags.push('java', 'jvm');
		if(INDX.includes('java')) tags.push('java', 'jvm');
		if(INDX.includes('jvm')) tags.push('java', 'jvm');
		if(INDX.includes('groovy')) tags.push('java', 'jvm');
		if(INDX.includes('kotlin')) tags.push('java', 'jvm');
		if(INDX.includes('cargo')) tags.push('rust');
		if(INDX.includes('rust')) tags.push('rust');
		if(INDX.includes('c++')) tags.push('c++');
		if(INDX.includes('cpp')) tags.push('c++');
		if(INDX.includes('cplusplus')) tags.push('c++');
		if(INDX.includes('dotnet')) tags.push('csharp');
		if(INDX.includes('csharp')) tags.push('csharp');
		if(INDX.includes('nuget-org')) tags.push('csharp', 'library');
		if(INDX.includes('python')) tags.push('python');
		if(INDX.includes('lua')) tags.push('lua');
		if(INDX.includes('simd')) tags.push('simd');
		if(INDX.includes('wasm')) tags.push('wasm');
		if(INDX.includes('webasm')) tags.push('wasm');
		if(INDX.includes('webassembly')) tags.push('wasm');
		if(INDX.includes('emscripten')) tags.push('wasm');
		if(INDX.includes('minecraft')) tags.push('minecraft');
		if(INDX.includes('unrealengine')) tags.push('unrealengine');
		if(INDX.includes('unreal')) tags.push('unrealengine');
		if(INDX.includes('tool')) tags.push('tool');
		
		seen_uris.add(entry.uri);
		results.push({
			fqdn: FQDN,
			host: HOST,
			path: PATH,
			slug: SLUG,
			indx: INDX,
			type: TYPE || undefined,
			title: TITLE,
			uri: url,
			tags: tags.filter((value, index, array) => array.indexOf(value) === index)
		});
	}
	
	if(children) {
		for (const child of children) {
			visit_entry(child);
		}
	}
}

visit_entry(bookmarks);

results = results.sort((a, b) => {
	let A = a.fqdn;
	let B = b.fqdn;
	if(A < B) return -1;
	if(A > B) return +1;
	A = a.path.toUpperCase(); // ignore upper and lowercase
	B = b.path.toUpperCase(); // ignore upper and lowercase
	if(A < B) return -1;
	if(A > B) return +1;
	return 0;
});

let out = fs.openSync('links.toml', 'w');
let jsonl = "";

for (const entry of results) {
	if(entry.tags.length > 0 || entry.type) {
		fs.writeSync(out, `[${entry.slug}]\n`);
		fs.writeSync(out, `title = "${entry.title}"\n`);
		fs.writeSync(out, `url   = "${entry.uri}"\n`);
		if(entry.type)fs.writeSync(out, `type  = "${entry.type}"\n`);
		fs.writeSync(out, `tags  = ${JSON.stringify(entry.tags)}\n`);
		fs.writeSync(out, `\n`);
	}
	jsonl += JSON.stringify(entry) + '\n';
}
fs.writeSync(out, `\n`);
fs.writeSync(out, `# Found ${seen_uris.size - seen_size} new URIs.\n`);
fs.writeSync(out, `# Found ${seen_host.size} Hosts: ${JSON.stringify([...seen_host].sort())}.\n`);
fs.closeSync(out);

fs.writeFileSync('links.jsonl', jsonl)

console.log("Found new ", seen_uris.size - seen_size, " refs.");
