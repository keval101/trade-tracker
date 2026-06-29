import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-screen-loader',
  templateUrl: './screen-loader.component.html',
  styleUrls: ['./screen-loader.component.scss']
})
export class ScreenLoaderComponent {
  @Input() loading = false;
}
