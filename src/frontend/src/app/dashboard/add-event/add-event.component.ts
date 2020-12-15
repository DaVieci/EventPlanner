import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-event',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {

  event: {
    title: String,
    start: Date,
    end: Date,
    body: String,
    image: String,
    category: String,
    user: String,
    status: String
  }

  categories: {
    type: String
  }

  event_title: String;
  selectedCategory: String;
  isVisible: boolean;
  selectedStatus: String;


  constructor() { }

  ngOnInit(): void {
    this.isVisible = false;
    this.loadCategoriesAfterOneSecond();
  }

  loadCategoriesAfterOneSecond(): void {
    console.log("load cats");
    setTimeout(()=>{
      var session_cats = sessionStorage.getItem("CategoriesJson");
      var json_cats = JSON.parse(session_cats);
      this.categories = json_cats;
    }, 1000);
  }

  uploadEvent(f: NgForm): void {
    // sessionStorage von Events auf "true" setzen, falls erfolgreich
    console.log(f.value);
    console.log(this.selectedCategory);
    console.log(this.selectedStatus);
  }

  setMinimums(): void {

  }

  showImageOnCanvas(): void {

  }

  deleteImageUpload(): void {

  }

}
