import router from './router';

interface Module {
  router?: (router: any) => void;
}

const registerModule = (name: string, module: Module) => {
  if (module.router) {
    module.router(router);
  }
};

export const registerModules = (modules: Record<string, Module>) => {
  Object.keys(modules).forEach(moduleKey => {
    const module = modules[moduleKey];
    registerModule(moduleKey, module);
  });
};
