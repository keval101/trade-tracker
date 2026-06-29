import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoaderComponent {
  @Input() size = '64px';
  @Input() color = '#fff';
  dots = [0, 1, 2, 3, 4, 5];
}
