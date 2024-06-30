const globalModules = ['EnvModule', 'MongooseModule'];

const imp = {
  UserModule: [],
  PostModule: ['UserModule'],
  BookModule: ['PostModule', 'UserModule', 'SysAuthorizationModule'],
};

const impWithGlobal = {};

Object.keys(imp).forEach((module) => {
  impWithGlobal[module] = [...globalModules, ...imp[module]];
});

const exp = {
  UserModule: ['Model', 'Repository', 'Constant'],
  PostModule: [],
  BookModule: ['Model', 'Repository'],
};

const expWithGlobal = {};

Object.keys(exp).forEach((module) => {
  expWithGlobal[module] = [...globalModules, ...exp[module]];
});

const flattenDependencies = (deps, expObj, key) =>
  deps.length === 0
    ? []
    : Object.fromEntries(
        deps.map((dep) => {
          const expDeps = expObj[dep];
          if (!expDeps) throw new Error(`Dependency ${dep} is not found in ${key}`);

          return [dep, expDeps];
        }),
      );

const flatImp = Object.fromEntries(
  Object.entries(imp).map(([key, deps]) => [key, flattenDependencies(deps, exp, key)]),
);

console.log('[DEBUG][DzungDang] flatImp:', flatImp);

//------------------------------------------
const actualImp = {
  UserModule: [{ PostModule: ['Model'] }],
  PostModule: [{ UserModule: ['Repository'] }, { BookModule: ['Model'] }],
  BookModule: [{}],
};

const checkValidDependency = (flatImp, actualImp, exp) => {
  const invalid = [];

  Object.entries(flatImp).forEach(([key, deps]) => {
    deps.forEach((dep) => {
      const actualDep = actualImp[key].find((item) => Object.keys(item)[0] === dep);
      if (!actualDep) {
        invalid.push({ [key]: dep });
        return;
      }

      const actualDeps = Object.values(actualDep)[0];
      const expDeps = exp[key];
      if (actualDeps.length !== expDeps.length) {
        invalid.push({ [key]: dep });
        return;
      }

      actualDeps.forEach((actualDep) => {
        if (!expDeps.includes(actualDep)) {
          invalid.push({ [key]: dep });
        }
      });
    });
  });
};
