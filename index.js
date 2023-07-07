// Import all functions in order
const clonePages = require('./clone');
const publishPages = require('./publish');
const pushLive = require('./push');

// Execute the functions in order
async function executeFunctions() {
    await clonePages();
    setTimeout(async () => {
        await publishPages();
        setTimeout(async () => {
            await pushLive();
            setTimeout(async () => {
                console.log('\x1b[32m%s\x1b[0m', '\nAll functions executed.');
            }, 10000);
        }, 10000);
    }, 10000);
}

executeFunctions();
