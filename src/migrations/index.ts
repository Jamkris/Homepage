import * as migration_20260720_050338_initial from './20260720_050338_initial';
import * as migration_20260720_071430_about_contact_skillgroups from './20260720_071430_about_contact_skillgroups';
import * as migration_20260721_035256_contacts_and_notifications from './20260721_035256_contacts_and_notifications';
import * as migration_20260721_044247_cert_attachment from './20260721_044247_cert_attachment';
import * as migration_20260721_044508_activities from './20260721_044508_activities';
import * as migration_20260721_050000_activities_daterange_tags from './20260721_050000_activities_daterange_tags';
import * as migration_20260721_060000_activities_slug from './20260721_060000_activities_slug';
import * as migration_20260721_070000_activities_references from './20260721_070000_activities_references';
import * as migration_20260721_080000_home_portfolio_limit from './20260721_080000_home_portfolio_limit';
import * as migration_20260727_090000_seo_fields from './20260727_090000_seo_fields';
import * as migration_20260727_100000_seo_default_image from './20260727_100000_seo_default_image';

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
    name: '20260721_035256_contacts_and_notifications',
  },
  {
    up: migration_20260721_044247_cert_attachment.up,
    down: migration_20260721_044247_cert_attachment.down,
    name: '20260721_044247_cert_attachment',
  },
  {
    up: migration_20260721_044508_activities.up,
    down: migration_20260721_044508_activities.down,
    name: '20260721_044508_activities'
  },
  {
    up: migration_20260721_050000_activities_daterange_tags.up,
    down: migration_20260721_050000_activities_daterange_tags.down,
    name: '20260721_050000_activities_daterange_tags',
  },
  {
    up: migration_20260721_060000_activities_slug.up,
    down: migration_20260721_060000_activities_slug.down,
    name: '20260721_060000_activities_slug',
  },
  {
    up: migration_20260721_070000_activities_references.up,
    down: migration_20260721_070000_activities_references.down,
    name: '20260721_070000_activities_references',
  },
  {
    up: migration_20260721_080000_home_portfolio_limit.up,
    down: migration_20260721_080000_home_portfolio_limit.down,
    name: '20260721_080000_home_portfolio_limit',
  },
  {
    up: migration_20260727_090000_seo_fields.up,
    down: migration_20260727_090000_seo_fields.down,
    name: '20260727_090000_seo_fields',
  },
  {
    up: migration_20260727_100000_seo_default_image.up,
    down: migration_20260727_100000_seo_default_image.down,
    name: '20260727_100000_seo_default_image',
  },
];
