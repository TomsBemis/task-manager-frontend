import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SynchronizeComponent } from "../synchronize/synchronize.component";

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    SynchronizeComponent
],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {

}
