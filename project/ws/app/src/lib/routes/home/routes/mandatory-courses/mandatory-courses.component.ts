import { Component, OnInit } from '@angular/core'



export interface CourseFolder {
  Id: number,
  folderName: string,
  courseCount: number,
  batchCount: number
}





@Component({
  selector: 'ws-app-mandatory-courses',
  templateUrl: './mandatory-courses.component.html',
  styleUrls: ['./mandatory-courses.component.scss']
})
export class MandatoryCoursesComponent implements OnInit {

  displayedColumns: string[] = ['Id', 'folderName', 'courseCount', 'batchCount'];


  constructor() {
    const folderData: CourseFolder[] = [
      {
        "Id": 1,
        "folderName": "Course 01 folder",
        "courseCount": 5,
        "batchCount": 7
      },
      {
        "Id": 2,
        "folderName": "Course 02 folder",
        "courseCount": 5,
        "batchCount": 7
      }

    ]
  }

  ngOnInit() {
  }

}
