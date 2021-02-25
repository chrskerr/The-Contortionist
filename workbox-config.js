module.exports = {
	"globDirectory": "build/",
	"globPatterns": [
		"**/*.{png,json,xml,ico,html,txt,svg,webmanifest,css,js,woff,ttf,eot}",
	],
	"swDest": "build/service-worker.js",
	"cleanupOutdatedCaches": true,
	"importScripts": [ "src/sw-precache.js" ],
};