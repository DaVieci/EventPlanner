import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';


@Component({
  selector: 'app-add-event',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {

  categories: {
    type: String
  };

  user = {
    email: String,
    fullName: String
  };
  private user_token: String;
  private bearer_token: any;

  id_event: string;

  title_value: string;
  sdate_value: Date;
  stime_value: Date;
  edate_value: Date;
  edate_min: Date;
  etime_value: Date;
  etime_min: Date;
  body_value: string;
  sel_cat: string;
  sel_stat: string;

  image_from_json: string;
  imageLink: string;
  imageURL: string;

  dummy_button: boolean;
  canv_visible: boolean;
  delimg_button: boolean;
  error_msg: boolean;
  success_msg: boolean;

  /**
   * Sets up the services and user token.
   * @param authService authentication service provided by Nebular
   * @param acRoute route service from Angular
   */
  constructor(
    private authService: NbAuthService,
    private acRoute: ActivatedRoute
  ) {
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.user = token.getPayload();
          this.user_token = token.toString();
          this.bearer_token = 'Bearer '+this.user_token;
        }
      });
  }

  /**
   * When on page load, the canvas, buttons and alert boxes will be disabled.
   * Loads categories from the storage.
   * Gets the event id from the url. If an ID exists, it will load all information from the given event id and puts them into the right fields.
   * If an event has got created, it will clear all inputs and show a success alert.
   * If an event has got editted, it will only an success alert.
   */
  ngOnInit(): void {
    this.canv_visible = false;
    this.delimg_button = false;
    this.error_msg = false;
    this.success_msg = false;
    this.dummy_button = true;
    this.loadCategoriesFromStorage();
    this.id_event = this.acRoute.snapshot.paramMap.get('id');
    if (this.id_event) {
      if (sessionStorage.getItem("EventEditted")==="true") {
        sessionStorage.removeItem("EventEditted");
        this.success_msg = true;
      } else {
        console.log(this.id_event); 
        this.getEventById();
        setTimeout(()=>{
          this.loadEventInInputs();
        }, 1000);
      }
    } else if (sessionStorage.getItem("EventCreated")==="true") {
      sessionStorage.removeItem("EventCreated");
      this.clearAllInputs();
      this.success_msg = true;
    }
    setTimeout(()=>{
      (<HTMLButtonElement>document.getElementById("dummy_button")).click();
    }, 1000);
  }

  /**
   * Loads categories from storage and sets them into the select field.
   */
  loadCategoriesFromStorage(): void {
    console.log("load cats");
    var session_cats = sessionStorage.getItem("CategoriesJson");
    var json_cats = JSON.parse(session_cats);
    this.categories = json_cats;
  }
  
  /**
   * Loads the base64 image code from the json and creates an image.
   * @param b64 base64 code of the img
   * @returns url to the image
   */
  createImageUrl(b64: string): string {
    var image_blob = this.convertDataUrlToBlob(b64);
    const objectURL = URL.createObjectURL(image_blob);
    return objectURL;
  }

  /**
   * Converts base64 to a blob.
   * @param b64_code base64 code
   * @returns blob
   */
  convertDataUrlToBlob(b64_code: string): Blob {
    const arr = b64_code.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
}

  /**
   * Sets the options, the event id and the bearer token for the get api and calls it.
   * If successful, it will return the whole event from the given id. The event will be stored as a json string.
   */
  getEventById(): void {
    var requestOptions = {
      method: 'GET',
      headers: {
        Authorization: this.bearer_token
      }
    };
    fetch(`/api/events/${this.id_event}`, requestOptions)
      .then(response => response.text()) 
      .then(result => {
        var json_event = JSON.parse(result);
        sessionStorage.setItem("EditEventJson", JSON.stringify(json_event));
      })
      .catch(err => console.log(err));
  }

  /**
   * Loads the event from the storage and sets the information into the right input fields.
   * If an image is given, it will create an url out of the base64 code and display the image on the canvas. 
   */
  loadEventInInputs(): void {
    var session_event = sessionStorage.getItem("EditEventJson");
    var json_event = JSON.parse(session_event);
    console.log(json_event);
    this.title_value = json_event.title;
    this.sdate_value = json_event.start_date;
    this.stime_value = json_event.start_time;
    this.edate_value = json_event.end_date;
    this.etime_value = json_event.end_time;
    this.body_value = json_event.body;
    this.image_from_json = json_event.image;
    if (this.image_from_json) {
      this.imageLink = this.createImageUrl(this.image_from_json);
      this.showImageOnCanvas();
    }
    this.sel_cat = json_event.category;
    this.sel_stat = json_event.status;
  }

  /**
   * Clears all input fields.
   */
  clearAllInputs(): void {
    this.title_value = "";
    this.sdate_value = null;
    this.stime_value = null;
    this.edate_value = null;
    this.etime_value = null;
    this.body_value = "";
    (<HTMLInputElement>document.getElementById("inpimg")).value = null;
  }

  /**
   * Sets all input form values to the belonged input fields.
   * @remarks both don't have the same values apparently
   * @param f json which holds all field values
   */
  setFormValueToInputFields(f: NgForm): void {
    if (!(f.value.title==="")) this.title_value = f.value.title;
    if (!(f.value.body==="")) this.body_value = f.value.body;
    if (!(f.value.cat==="")) this.sel_cat = f.value.cat;
    if (!(f.value.stat==="")) this.sel_stat = f.value.stat;
  }

  /**
   * Sets all date form values to the belonged input fields.
   * @remarks both don't have the same values apparently
   * @param f json which holds all field values
   */
  setFormValueToDateFields(f: NgForm): void {
    if (!(f.value.start_date==="")) this.sdate_value = f.value.start_date;
    if (!(f.value.start_time==="")) this.stime_value = f.value.start_time;
    if (!(f.value.end_date==="")) this.edate_value = f.value.end_date;
    if (!(f.value.end_time==="")) this.etime_value = f.value.end_time;
  }

  /**
   * Sets a json with all the values of the fields. Sets options for either an post or put call and calls it.
   * If successful, it will set some variables in the storage to mark the successful call for the next page load.
   * @param f json which holds all field values
   */
  uploadEvent(f: NgForm): void {
    if (this.image_from_json) {
      if (!(this.imageURL)) this.imageURL = this.image_from_json;
    }
    this.setFormValueToInputFields(f);
    this.setFormValueToDateFields(f);
    var sd="", st="", ed="", et="";
    if (this.sdate_value) sd = this.sdate_value.toString();
    if (this.stime_value) st = this.stime_value.toString();
    if (this.edate_value) ed = this.edate_value.toString();
    if (this.etime_value) et = this.etime_value.toString();
    if (!(this.title_value==="") && !(sd==="") && !(st==="") && !(ed==="") && !(et==="")) {
      this.error_msg = false;
      const json_events = {
        title: this.title_value,
        start_date: this.sdate_value,
        start_time: this.stime_value,
        end_date: this.edate_value,
        end_time: this.etime_value,
        body: this.body_value,
        image: this.imageURL, 
        category: this.sel_cat,
        user: this.user.email,
        status: this.sel_stat
      };
      const str_events = JSON.stringify(json_events);
      let push_method;
      let push_api;
      if (this.id_event) {
        push_method = 'PUT';
        push_api = `/api/events/${this.id_event}`;
      } else {
        push_method = 'POST';
        push_api = "/api/events";
      }
      const requestOptions = {
        method: push_method,
        headers: {
          Authorization: this.bearer_token,
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: str_events
      };
      fetch(push_api, requestOptions)
        .then(response => response.text())
        .then(result => {
          if (this.id_event) {
            sessionStorage.setItem("EventEditted", "true");
          } else {
            sessionStorage.setItem("EventCreated", "true");
          }
          sessionStorage.setItem("AddEditDeleteCallOnEvent", "true");
          this.ngOnInit();
        })
        .catch(error => {
          //ggf http status 403 & 401 verarbeiten
          console.log('error', error);
        });
    } else {
      this.error_msg = true;
    }
  }

  /**
   * If start-date goes behind the end-date, it will set end-date and end-time to the values of start-date and start-time.
   * Sets the minimum date to the start-date.
   * @param f json which holds all field values
   */
  setDateMinimums(f: NgForm): void {
    this.setFormValueToDateFields(f);
    this.edate_min = this.sdate_value;
    let e_d = new Date(this.edate_value);
    let s_d = new Date(this.sdate_value);
    if (e_d.getTime()<=s_d.getTime()) {
      this.edate_value = this.sdate_value;
      this.etime_value = this.stime_value;
    } 
  }

  /**
   * If start-date equals end-date and the start-time goes behind the end-time, it will set end-time to the start-time. Same vice verca.
   * @param f json which holds all field values
   * @param inputT string that marks the input which has got clicked
   */
  setTimeMinimums(f: NgForm, inputT: String): void {
    this.setFormValueToDateFields(f);
    let e_d = new Date(this.edate_value);
    let s_d = new Date(this.sdate_value);
    if (e_d.getTime()===s_d.getTime()) {
      if (f.value.end_time < f.value.start_time) {
        if (inputT==='s_t') {
          this.etime_value = f.value.start_time;
        } else if (inputT==='e_t') {
          this.stime_value = f.value.end_time;
        }
      }
    }
  }

  /**
   * Gets the uploaded image or the image from the given json and displays it on a canvas.
   * If it's a newly uploaded picture, it will store it's base64 code in a variable of the storage.
   */
  showImageOnCanvas(): void {
    this.canv_visible = true;
    this.delimg_button = true;
    var image = <HTMLInputElement>document.getElementById("inpimg");
    var background = new Image();
    var imglink = this.imageLink;
    if(imglink){
      background.src = imglink;
    }else {
      background.src = URL.createObjectURL(image.files[0]);
    }
    background.onload = function () {
      var canvas = <HTMLCanvasElement>document.getElementById("canvimg");
      const context = canvas.getContext("2d");
      canvas.width = background.width;
      canvas.height = background.height;
      context.drawImage(background, 0, 0);
      if(!(imglink)) {
        var imgurl = canvas.toDataURL('image/jpeg');
        sessionStorage.setItem("ImageBase64", imgurl);
      }
    }
    this.imageURL = sessionStorage.getItem("ImageBase64");
    sessionStorage.removeItem("ImageBase64");
  }

  /**
   * Deletes an uploaded image or an image from the given json.
   * Clears canvas and variables.
   */
  deleteImageUpload(): void {
    (<HTMLInputElement>document.getElementById("inpimg")).value = null;
    var canvas = <HTMLCanvasElement>document.getElementById("canvimg");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    this.imageURL = "";
    this.imageLink = "";
    this.image_from_json = "";
    this.delimg_button = false;
    this.canv_visible = false;
    setTimeout(()=>{
      (<HTMLButtonElement>document.getElementById("dummy_button")).click();
    }, 1000);
  }

}
