import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbDatepicker, NbDateService, NbRangepickerComponent } from '@nebular/theme';

@Component({
  selector: 'app-events',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  private user_token: String;
  private bearer_token: any;

  min: Date;
  max: Date;

  events: {
    _id: String,
    title: String,
    start_date: String,
    start_time: String,
    end_date: String,
    end_time: String,
    body: String,
    image: String,
    category: String,
    user: String,
    status: String
  };

  categories: {
    _id: String,
    type: String
  }

  selectedItem: any[];

  OneDayInMillisec = 86400000;

  constructor(
    private authService: NbAuthService,
    protected dateService: NbDateService<Date>
  ) {
    this.authService.onTokenChange()
        .subscribe((token: NbAuthJWTToken) => {
          if (token.isValid()) {
            this.user_token = token.toString();
            this.bearer_token = 'Bearer '+this.user_token;
          }
        });
    console.log("CONSTRUCTOR CALL");
    }

  ngOnInit(): void {
    console.log("ONINIT CALL");
    if(!this.refreshPageOnTransition()) {
      if(!(sessionStorage.getItem("AddEditDeleteCallOnEvent")==="false")) {
        this.getEvents();
        sessionStorage.setItem("AddEditDeleteCallOnEvent", "false");
        // evtl. neuer if-Zweig für Kategorien, falls Add/Delete Category implementiert werden soll!
        this.getCategories();
      }
    }
    this.loadCategoriesAfterOneSecond();
  }

  refreshPageOnTransition(): boolean {
    if (!(sessionStorage.getItem("pageTransition")==="false")) {
      sessionStorage.setItem("pageTransition", "false");
      window.location.reload();
      return true;
    } else {
      return false;
    }
  }

  loadCategoriesAfterOneSecond(): void {
    console.log("load cats");
    setTimeout(()=>{
      var session_cats = sessionStorage.getItem("CategoriesJson");
      var json_cats = JSON.parse(session_cats);
      this.categories = json_cats;
    }, 1000);
  }

  getEvents(): void {
    var requestOptions = {
      method: 'GET',
      headers: {
        Authorization: this.bearer_token
      }
    };
    fetch("/api/events", requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result);
        var json_event = JSON.parse(result);
        sessionStorage.setItem("EventsJson", JSON.stringify(json_event));
      })
      .catch(error => {
        //ggf http status 403 & 401 verarbeiten
        console.log('error', error);
      });
  }

  getCategories(): void {
    var requestOptions = {
      method: 'GET'
    };
    fetch("/api/categories", requestOptions)
    .then(response => response.text())
    .then(result => {
      console.log(result);
      var json_cat = JSON.parse(result);
      sessionStorage.setItem("CategoriesJson", JSON.stringify(json_cat));
    })
    .catch(error => {
      //ggf http status 403 & 401 verarbeiten
      console.log('error', error);
    });
  }

  filter_events(f: NgForm): void {
    delete this.events;
    var session_events = sessionStorage.getItem("EventsJson");

    var s_date_iso;
    var e_date_iso;
    var s_day_msec;
    var e_day_msec;
    var filtered_events;

    var date_range = {};
    if (!(f.value.date_range===null)) {
      date_range = f.value.date_range;
      if (Object.keys(date_range).length) {
        s_date_iso = new Date(f.value.date_range.start);
        if (f.value.date_range.end) {
          e_date_iso = new Date(f.value.date_range.end);
        } else {
          e_date_iso = s_date_iso;
        }
        s_day_msec = s_date_iso.getTime();
        e_day_msec = e_date_iso.getTime() + this.OneDayInMillisec - 1;
      }
    }

    var cat_arr = [];
    if (!(f.value.cats==="")) cat_arr = f.value.cats;

    if (!Object.keys(date_range).length && !Object.keys(cat_arr).length) {
      filtered_events = JSON.parse(session_events);
    } else if (Object.keys(date_range).length && !Object.keys(cat_arr).length) {
      filtered_events = JSON.parse(session_events)
        .filter(({start_date}) => this.checkDateBetweenStartAndEnd(start_date,s_day_msec,e_day_msec));
    } else if (!Object.keys(date_range).length && Object.keys(cat_arr).length) {
      filtered_events = JSON.parse(session_events)
        .filter(({category}) => cat_arr.includes(category));
    } else if (Object.keys(date_range).length && Object.keys(cat_arr).length) {
      filtered_events = JSON.parse(session_events)
        .filter(({start_date, category}) => this.checkDateBetweenStartAndEnd(start_date,s_day_msec,e_day_msec) && cat_arr.includes(category));
    } else {
      console.log("FATAL ERROR! This code part should have never been reached. Have a look at the following:");
      console.log("Date Picker: "+f.value.date_range);
      console.log("Categories Select: "+f.value.cats);
    }
    this.events = filtered_events;
  }

  checkDateBetweenStartAndEnd(date: string, start: number, end: number): boolean {
    var json_date = new Date(date);
    if ((start<=json_date.getTime()) && (json_date.getTime()<=end)) {
      return true;
    } else {
      return false;
    } 
  }

  formatDateToIso(date: string): string {
    var d = new Date(date);
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    var date_iso = [year, month, day].join('-');
    return date_iso;
  }

  edit_event(event_id: String) {

  }

  delete_event(event_id: String) {
    var requestOptions = {
      method: 'DELETE',
      headers: {
        Authorization: this.bearer_token
      }
    };
    fetch(`/api/events/${event_id}`, requestOptions)
      .then(result => {
        console.log(result);
        sessionStorage.setItem("AddEditDeleteCallOnEvent", "true");
        this.ngOnInit();
      })
      .catch(err => console.log(err));
  }
}
