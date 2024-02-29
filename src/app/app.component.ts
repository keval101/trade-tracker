import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { DataService } from './service/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'paper-trading';


  constructor(private data: DataService) {}

  ngOnInit() {
    initFlowbite();
  }
}
