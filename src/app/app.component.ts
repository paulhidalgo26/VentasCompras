import { Component } from '@angular/core';
import { FirebaseauthService } from './servicios/firebaseauth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private firebaseauthService: FirebaseauthService
  ) {}
}
