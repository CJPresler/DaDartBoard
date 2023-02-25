const shell = require('shelljs');

// Ensure submodules are updated
shell.exec("git submodule update --init");

// Build the local boardgames.io/p2p package
shell.exec("npm i", {cwd: "../submodules/p2p"});
shell.exec("npx tsc -b src", {cwd: "../submodules/p2p"});