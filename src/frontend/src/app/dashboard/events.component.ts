import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  private user_token: String;
  private bearer_token = ''; 

  constructor(
    private authService: NbAuthService,
    private http: HttpClient
  ) {
    this.authService.onTokenChange()
        .subscribe((token: NbAuthJWTToken) => {
          if (token.isValid()) {
            this.user_token = token.toString();
            this.bearer_token = 'Bearer '+this.user_token;
          }
        });

      var requestOptions = {
        method: 'GET',
        headers: {
          Authorization: this.bearer_token
        }
      };

      fetch("/api/events", requestOptions)
        .then(response => response.text())
        .then(result => {
          //html rendern für event info...
          console.log(result)
        })
        .catch(error => {
          //ggf http status 403 & 401 verarbeiten
          console.log('error', error)
        });

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
