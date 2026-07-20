import * as migration_20260720_050338_initial from './20260720_050338_initial';

export const migrations = [
  {
    up: migration_20260720_050338_initial.up,
    down: migration_20260720_050338_initial.down,
    name: '20260720_050338_initial'
  },
];
