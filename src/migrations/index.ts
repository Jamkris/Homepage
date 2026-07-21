import * as migration_20260720_050338_initial from './20260720_050338_initial';
import * as migration_20260720_071430_about_contact_skillgroups from './20260720_071430_about_contact_skillgroups';
import * as migration_20260721_035256_contacts_and_notifications from './20260721_035256_contacts_and_notifications';

export const migrations = [
  {
    up: migration_20260720_050338_initial.up,
    down: migration_20260720_050338_initial.down,
    name: '20260720_050338_initial',
  },
  {
    up: migration_20260720_071430_about_contact_skillgroups.up,
    down: migration_20260720_071430_about_contact_skillgroups.down,
    name: '20260720_071430_about_contact_skillgroups',
  },
  {
    up: migration_20260721_035256_contacts_and_notifications.up,
    down: migration_20260721_035256_contacts_and_notifications.down,
    name: '20260721_035256_contacts_and_notifications'
  },
];
