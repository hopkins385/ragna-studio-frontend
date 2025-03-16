import type { AppAbility } from './services/ability.service';

declare module 'vue' {
  interface ComponentCustomProperties {
    $ability: AppAbility;
    $can(this: this, ...args: Parameters<this['$ability']['can']>): boolean;
  }
}
