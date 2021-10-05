/** @type {import('@sveltejs/kit').Config} */

const config = {
        kit: {
                // hydrate the <div id="svelte"> element in src/app.html
                target: '#svelte',
                vite: {
                        server: {
                                hmr: {
                                        host: 'localhost',  // host url
                                        port: 80,           // 443 for https
                                        protocol: 'ws',     // wss for https
                                },
                        },
                },
        },
}

export default config;
