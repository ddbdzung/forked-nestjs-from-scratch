import { ModuleFactory } from '@/core/module-factory';

/**
 * This function initializes the metadata application
 * @param entry Entry class constructor (so called root module, main module)
 */
export function initMetadataApplication(entry: Type) {
  return new ModuleFactory(entry);
}
