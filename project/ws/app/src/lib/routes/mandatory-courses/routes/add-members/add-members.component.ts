
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { MandatoryCourseService } from '../../services/mandatory-course.service'
// tslint:disable
import _ from 'lodash'
@Component({
  selector: 'ws-app-add-members',
  templateUrl: './add-members.component.html',
  styleUrls: ['./add-members.component.scss'],
})
export class AddMembersComponent implements OnInit {
  deptID: any = ''
  usersData!: any
  activeUsersData!: any[]
  isSelectedMember: boolean = false
  selectedId: BigInteger | undefined
  selectedUser: any[] = []
  bdtitles = [
    { title: 'Folders', url: '/app/home/mandatory-courses' },
    { title: 'Folder name', url: '/app/mandatory-courses/132' },
    { title: 'Batch name', url: '/app/mandatory-courses/132/batch-details/123' },
    { title: 'Add members', url: 'none' },
  ]
  constructor(
    private configSvc: ConfigurationsService,
    private activeRoute: ActivatedRoute,
    private mandatoryCourseSvc: MandatoryCourseService,
  ) { }

  ngOnInit() {
    if (this.configSvc.userProfile) {
      this.deptID = this.configSvc.userProfile.rootOrgId
    } else if (_.get(this.activeRoute, 'snapshot.data.configService.userProfile.rootOrgId')) {
      this.deptID = _.get(this.activeRoute, 'snapshot.data.configService.userProfile.rootOrgId')
    }
    this.getAllUsers()
  }

  getUserFullName(user: any) {
    // this.getHoverUser(user: any)
    if (user && user.first_name && user.last_name) {

      return `${user.first_name.trim()} ${user.last_name.trim()}`
    }
    return ''
  }

  getAllUsers() {
    const filterObj = {
      request: {
        query: '',
        filters: {
          rootOrgId: this.deptID,
        },
      },
    }
    this.mandatoryCourseSvc.getAllUsers(filterObj).subscribe(
      (res: any) => {
        // this.usersData = res.content
        this.usersData = res.content
        this.filterData()
      })
  }

  filterData() {
    this.activeUsersData = this.activeUsers
  }
  get activeUsers() {
    const activeUsersData: any[] = []
    if (this.usersData && this.usersData.length > 0) {
      _.filter(this.usersData, { isDeleted: false }).forEach((user: any) => {
        user.selected = false
        activeUsersData.push(user)
      })
      return activeUsersData
    }
    return []
  }



  selectedMember(user: any) {

    // const index = this.selectedUser.indexOf(user)
    // if (index > -1) { // only splice array when item is found
    //   this.selectedUser.splice(index, 1) // 2nd parameter means remove one item only

    //   // this.isSelectedMember = false
    // } else {
    //   this.selectedUser.push(user)
    //   this.selectedId = user.id
    //   this.isSelectedMember = true
    // }

    // // this.selectedId = user.id
    // console.log(this.selectedUser, 'this.selectedUser arry ---')
    // console.log(user, 'selected user----')
    this.activeUsersData = this.activeUsersData.map(usr => {
      if (usr.id === user.id) {
        usr.selected = !usr.selected
      }
      return usr
    })
  }

  // All the selected members will be there,
  saveSelected() {
    const allSelectedUser = this.activeUsersData.filter(user => user.selected === true)
    console.log(allSelectedUser)
  }

}
