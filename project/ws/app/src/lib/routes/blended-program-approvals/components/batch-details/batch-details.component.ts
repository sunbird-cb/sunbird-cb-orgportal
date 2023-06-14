import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'ws-app-batch-details',
  templateUrl: './batch-details.component.html',
  styleUrls: ['./batch-details.component.scss'],
})
export class BatchDetailsComponent implements OnInit {
  currentFilter = 'pending'
  usersData: any = []

  constructor() { }

  ngOnInit() {
    this.usersData = [
      {
        city: '',
        department: 'jpal',
        desc: '',
        designation: '',
        email: 'test01july0907@yopmail.com',
        first_name: 'test01 july0907',
        last_name: '',
        userLocation: '',
        user_id: '27a35578-841c-450b-afc7-ace35f1051da',
      },
      {
        city: '',
        department: 'General Administration Ladakh',
        desc: '',
        designation: 'ACCOUNTS ASSISTANT',
        email: 'JulyTest.Testjuly@yopmail.com',
        first_name: 'JulyTest Testjuly',
        last_name: '',
        userLocation: '',
        user_id: 'bdf547ba-79e8-49d9-9143-54353673212d',
      },
      {
        city: '',
        department: 'jpal',
        desc: '',
        designation: '',
        email: 'testinguser0007@yopmail.com',
        first_name: 'testinguser user',
        last_name: '',
        userLocation: '',
        user_id: '8a24ee2d-20ec-4eb0-b559-627b30dfd894',
      },
    ]
  }

  filter(key: 'pending' | 'approved' | 'rejected') {
    switch (key) {
      case 'pending':
        this.currentFilter = 'pending'
        // this.getPendingList()
        break
      case 'approved':
        this.currentFilter = 'approved'
        // this.getApprovedList()
        break
      case 'rejected':
        this.currentFilter = 'rejected'
        // this.getRejectedList()
        break
      default:
        break
    }
  }

}
