import { Component, OnInit } from '@angular/core';

import { NbLoginComponent } from '@nebular/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends NbLoginComponent implements OnInit {

  ngOnInit(): void {
    this.setPageTransition();
  }

  setPageTransition(): void {
    if (!(sessionStorage.getItem("pageTransition")==="true")) sessionStorage.setItem("pageTransition","true");
  }

}
