import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
    this.refreshPageOnTransition();
  }

  refreshPageOnTransition(): void {
    if (!(sessionStorage.getItem("pageTransition")==="false")) {
      sessionStorage.setItem("pageTransition", "false");
      window.location.reload();
    }
  }

}
