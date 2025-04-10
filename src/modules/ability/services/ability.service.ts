import {
  AbilityBuilder,
  createMongoAbility,
  defineAbility,
  type MongoAbility,
} from '@casl/ability';

export const ability = defineAbility(can => {
  can(['create', 'read', 'edit', 'delete'], ['Assistant', 'Collection', 'User', 'Workflow']);
});

export function defineAbilityFor(user: any) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  if (user?.roles?.includes('admin')) {
    can('manage', 'all'); // read-write access to everything
  } else {
    can('read', 'all'); // read-only access to everything
  }

  // cannot('delete', 'Post', { published: true });

  return build();
}

type Actions = 'create' | 'read' | 'edit' | 'delete';
type Subjects = 'Assistant' | 'Collection' | 'User' | 'Workflow';

export type AppAbility = MongoAbility<[Actions, Subjects]>;
