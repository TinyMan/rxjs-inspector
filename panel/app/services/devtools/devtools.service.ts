import { Injectable } from '@angular/core';
import { ConnectionService } from './connection.service';

declare var window: Window & { [k: string]: any };
@Injectable({
  providedIn: 'root',
})
export class DevtoolsService {
  constructor(private connection: ConnectionService) {
    console.log('Devtools Service!');

    this.connection.messages$.subscribe(m => console.log('message', m));
    window.connection = this.connection;
  }
}
