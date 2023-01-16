
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core'
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
  folderInfo: any
  selectedCompetency: any = []
  query = ''
  @Input() hideBreadScrum: boolean = false
  @Input() batchMemberList: any = []
  @Output() updateBatchList = new EventEmitter()
  filterConfig = {
    filterUsage: 'members',
    noOfSelectionText: "designation selected",
    filterListText: 'Search Designation',
    selectPlaceHolder: "Choose Designation",
    inputPlaceHolder: "Search by name"
  }
  bdtitles = [
    { title: 'Folders', url: '/app/home/mandatory-courses' },
    { title: 'Folder name', url: '/app/mandatory-courses/132' },
    { title: 'Batch name', url: '/app/mandatory-courses/132/batch-details/123' },
    { title: 'Add members', url: 'none' },
  ]
  constructor(
    private configSvc: ConfigurationsService,
    private route: ActivatedRoute,
    private mandatoryCourseSvc: MandatoryCourseService,
  ) { }

  ngOnInit() {
    if (this.configSvc.userProfile) {
      this.deptID = this.configSvc.userProfile.rootOrgId
    } else if (_.get(this.route, 'snapshot.data.configService.userProfile.rootOrgId')) {
      this.deptID = _.get(this.route, 'snapshot.data.configService.userProfile.rootOrgId')
    }
    this.folderInfo = this.mandatoryCourseSvc.getFolderInfo()
    this.updateBreadcrumb()
    this.getAllUsers()
  }

  searchData(filterList: any) {
    this.selectedCompetency.length = 0
    this.query = ''
    filterList.forEach((fil: any) => {
      if (fil.type === 'query') {
        this.query = fil.name
      } else {
        this.selectedCompetency.push(fil.name)
      }
    })
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
        query: this.query,
        filters: {
          rootOrgId: this.deptID,
          ['competencies_v3.name']: this.selectedCompetency,
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
    let tempMemberList: any = []
    this.activeUsersData = this.activeUsers
    if (this.batchMemberList.length > 0) {
      this.batchMemberList.forEach((member: any) => {
        tempMemberList.push(this.activeUsersData.filter(mem => mem.userId === member.user_id)[0])
      })
      console.log(tempMemberList)
      this.activeUsersData = tempMemberList
    }
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
    this.activeUsersData = this.activeUsersData.map(usr => {
      if (usr.id === user.id) {
        usr.selected = !usr.selected
      }
      return usr
    })
  }
  selectAllMembers(selectAll: boolean) {
    this.activeUsersData = this.activeUsersData.map((course: any) => {
      course.selected = selectAll ? true : false
      return course
    })

  }
  // All the selected members will be there,
  saveSelected() {
    const allSelectedUser = this.activeUsersData.filter(user => user.selected === true).map(user => user.id)
    allSelectedUser.forEach((memberId) => {
      const requestParam = {
        request: {
          courseId: this.route.snapshot.params.doId,
          batchId: this.route.snapshot.params.batchId,
          userId: memberId
        }
      }
      this.mandatoryCourseSvc.addMember(requestParam).subscribe(res => {
        console.log(res)
      })
    })
  }
  deleteSelected() {
    const allSelectedUser = this.activeUsersData.filter(user => user.selected === true).map(user => user.id)
    allSelectedUser.forEach((memberId) => {
      const requestParam = {
        request: {
          courseId: this.route.snapshot.params.doId,
          batchId: this.route.snapshot.params.batchId,
          userId: memberId
        }
      }
      this.mandatoryCourseSvc.removeMember(requestParam).subscribe(res => {
        console.log(res)
        this.updateBatchList.emit()
      })
    })
  }
  updateBreadcrumb() {
    this.bdtitles = [{ title: 'Folders', url: '/app/home/mandatory-courses' }]
    this.bdtitles.push({ title: this.folderInfo.name, url: `/app/mandatory-courses/${this.folderInfo.identifier}` })
    this.bdtitles.push({
      title: this.folderInfo.batches.filter((batch: any) => batch.batchId === this.route.snapshot.params.batchId)[0].name,
      url: `/app/mandatory-courses/${this.folderInfo.identifier}/batch-details//${this.route.snapshot.params.batchId}`
    })
    this.bdtitles.push({ title: 'Add members', url: 'none' })
  }
}
