import { MODULE_OPTION_KEYS as moduleOptionConstants } from '../constants/common.constant';

export const moduleOptionKeys = [
  moduleOptionConstants.IMPORTS,
  moduleOptionConstants.EXPORTS,
  moduleOptionConstants.PROVIDERS,
  moduleOptionConstants.CONTROLLERS,
  moduleOptionConstants.MODEL,
];

export function validateModuleKeys(keys: string[]) {
  const validateKey = (key: string) => {
    if (!moduleOptionKeys.includes(key)) {
      throw new Error(`Invalid key: ${key}`);
    }
  };

  keys.forEach(validateKey);
}
