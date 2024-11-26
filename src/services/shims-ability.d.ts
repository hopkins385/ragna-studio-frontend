import type { AppAbility } from './ability.service';

declare module 'vue' {
  interface ComponentCustomProperties {
    $ability: AppAbility;
    $can(this: this, ...args: Parameters<this['$ability']['can']>): boolean;
  }
}
