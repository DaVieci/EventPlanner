import { Component, OnInit } from '@angular/core';

import { NbRegisterComponent } from '@nebular/auth';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent extends NbRegisterComponent implements OnInit {

  ngOnInit(): void {
    this.setPageTransition();
  }

  setPageTransition(): void {
    if (!(sessionStorage.getItem("pageTransition")==="true")) sessionStorage.setItem("pageTransition","true");
  }

}
