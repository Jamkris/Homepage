import * as migration_20260720_050338_initial from './20260720_050338_initial';
import * as migration_20260720_071430_about_contact_skillgroups from './20260720_071430_about_contact_skillgroups';

export const migrations = [
  {
    up: migration_20260720_050338_initial.up,
    down: migration_20260720_050338_initial.down,
    name: '20260720_050338_initial',
  },
  {
    up: migration_20260720_071430_about_contact_skillgroups.up,
    down: migration_20260720_071430_about_contact_skillgroups.down,
    name: '20260720_071430_about_contact_skillgroups'
  },
];
