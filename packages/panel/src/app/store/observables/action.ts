import { action, payload } from 'ts-action';
import { Notif } from '@rxjs-inspector/core';

export const Notification = action('Notification', payload<Notif>());
