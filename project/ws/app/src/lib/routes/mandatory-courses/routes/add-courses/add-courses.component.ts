import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'ws-app-add-courses',
  templateUrl: './add-courses.component.html',
  styleUrls: ['./add-courses.component.scss'],
})
export class AddCoursesComponent implements OnInit {
  bdtitles = [
    { title: 'Folders', url: '/app/home/mandatory-courses' },
    { title: 'Folder name', url: '/app/mandatory-courses/132' },
    { title: 'Choose courses', url: 'none' },
  ]
  constructor() { }

  ngOnInit() {
  }

}
