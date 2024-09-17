import { InjectionToken } from '@/core/dependencies/injection-token';
import { Module } from '@/core/module';

export interface DIContainerInterface {
  /**
   * Instance dictionary to store the dependencies by related injection token
   */
  instanceDict: Map<InjectionToken['token'], unknown>;

  /**
   * Get dependency by token
   * @param injectionToken Injection token related to the dependency
   */
  getDependencyByToken<T>(injectionToken: InjectionToken): T;

  /**
   * Construct dependency by class constructor, mapping the dependencies by token
   * @param ctr Class constructor to be instantiated
   * @param injectionToken Injection token related to the dependency
   */
  construct<T>(ctr: Ctr, injectionToken: InjectionToken, originModule?: Module): T;
}
