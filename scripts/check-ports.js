const net = require('net');

const PORTS = [
    { name: 'Backend API', port: 3038 },
    { name: 'Admin Frontend', port: 3039 },
    // { name: 'H5 Frontend', port: 3040 } // Optional
];

const checkPort = (port) => {
    return new Promise((resolve) => {
        const server = net.createServer();
        server.unref();
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(false);
            } else {
                resolve(true); // Other error, assume free-ish or retryable
            }
        });
        server.listen(port, '0.0.0.0', () => {
            server.close(() => {
                resolve(true);
            });
        });
    });
};

async function main() {
    console.log('🔍 Checking port availability...');
    let hasError = false;

    for (const { name, port } of PORTS) {
        const isFree = await checkPort(port);
        if (isFree) {
            console.log(`✅ [${name}] Port ${port} is available`);
        } else {
            console.log(`⚠️  [${name}] Port ${port} is in use!`);
            // This might be okay if we are restarting, but good to know
        }
    }

    console.log('\n✅ Port check complete. Enforcing strictly:');
    console.log(`   Backend:  ${PORTS[0].port}`);
    console.log(`   Frontend: ${PORTS[1].port}`);
}

main();
