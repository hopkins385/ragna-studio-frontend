function logRagnaLogo(appVersion?: string) {
  console.log(`
    ██████╗  █████╗  ██████╗ ███╗   ██╗ █████╗
    ██╔══██╗██╔══██╗██╔════╝ ████╗  ██║██╔══██╗
    ██████╔╝███████║██║  ███╗██╔██╗ ██║███████║
    ██╔══██╗██╔══██║██║   ██║██║╚██╗██║██╔══██║
    ██║  ██║██║  ██║╚██████╔╝██║ ╚████║██║  ██║
    ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝
      `);
  console.log(`RAGNA SPA ${appVersion ? `version ${appVersion}` : ''}`);
}

export default logRagnaLogo;
