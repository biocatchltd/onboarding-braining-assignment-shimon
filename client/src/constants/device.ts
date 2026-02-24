import type { Device } from '../types/session';

export const DEVICE_OPTIONS: { value: Device; label: string }[] = [
  { value: 'pc', label: 'PC' },
  { value: 'android', label: 'Android' },
  { value: 'ios', label: 'iOS' },
];
