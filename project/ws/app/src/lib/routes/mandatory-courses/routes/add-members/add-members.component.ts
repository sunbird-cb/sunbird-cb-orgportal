
import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { MandatoryCourseService } from '../../services/mandatory-course.service'
// tslint:disable
import _ from 'lodash'
import { MatSnackBar, PageEvent } from '@angular/material'
import { FilterTagsComponent } from '../../components/filter-tags/filter-tags.component'
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
  @ViewChild('filterTags', { static: false }) filterTags!: FilterTagsComponent

  positions: any = []
  filterConfig = {
    filterUsage: 'members',
    noOfSelectionText: "designation selected",
    filterListText: 'Search Designation',
    selectPlaceHolder: "Choose Designation",
    inputPlaceHolder: "Search by name"
  }
  bdtitles = [
    { title: 'Add members', url: 'none' },
  ]
  totalCount = 0
  pageSize = 50
  pageSizeOptions = [50, 40, 30, 20, 10]
  pageIndex = 0
  selectedMembers: any = []
  previousPage: any = []
  currentPage: any = []
  constructor(
    private configSvc: ConfigurationsService,
    private route: ActivatedRoute,
    private mandatoryCourseSvc: MandatoryCourseService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    if (this.configSvc.userProfile) {
      this.deptID = this.configSvc.userProfile.rootOrgId
    } else if (_.get(this.route, 'snapshot.data.configService.userProfile.rootOrgId')) {
      this.deptID = _.get(this.route, 'snapshot.data.configService.userProfile.rootOrgId')
    }
    this.folderInfo = this.mandatoryCourseSvc.getFolderInfo()
    this.updateBreadcrumb()
    if (this.batchMemberList.length > 0) {
      this.changeBatchMembers()
    } else {
      this.getAllUsers()
    }
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
  changeBatchMembers() {
    this.activeUsersData = this.batchMemberList.map((member: any) => {
      member.firstName = member.first_name
      member.lastName = member.last_name
      member.id = member.user_id
      member.selected = false
      return member
    })
  }
  getUserFullName(user: any) {
    // this.getHoverUser(user: any)
    if (user && user.first_name && user.last_name) {

      return `${user.first_name.trim()} ${user.last_name.trim()}`
    }
    return ''
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex
    this.getAllUsers()
    this.filterTags.onPageChange(false)
  }

  getAllUsers() {
    const filterObj = {
      request: {
        query: this.query,
        filters: {
          rootOrgId: this.deptID,
          ['profileDetails.professionalDetails.designation']: this.selectedCompetency,
        },
        limit: this.pageSize,
        offset: this.pageSize * this.pageIndex
      },
    }
    this.mandatoryCourseSvc.getAllUsers(filterObj).subscribe(
      (res: any) => {
        this.usersData = res.content
        this.totalCount = res.count
        this.filterData()
        if (this.allMembersChecked()) {
          this.filterTags.onPageChange(true)
        } else {
          this.filterTags.onPageChange(false)
        }
      })
  }

  filterData() {
    let tempMemberList: any = []
    this.activeUsersData = this.activeUsers
    if (this.batchMemberList.length > 0) {
      this.batchMemberList.forEach((member: any) => {
        const mem = this.activeUsersData.filter(m => m.userId === member.user_id)[0]
        if (mem) {
          mem.selected = false
          tempMemberList.push(mem)
        }
      })
      this.activeUsersData = tempMemberList
    }
  }
  get activeUsers() {
    const activeUsersData: any[] = []
    if (this.usersData && this.usersData.length > 0) {
      _.filter(this.usersData, { isDeleted: false }).forEach((user: any) => {
        if (this.isAlreadySelected(user)) {
          user.selected = true
        } else {
          user.selected = false
        }
        activeUsersData.push(user)
      })
      return activeUsersData
    }
    return []
  }
  allMembersChecked() {
    const checkedItems = this.activeUsersData.filter((res: any) => res.selected === true)
    return checkedItems.length === this.activeUsersData.length ? true : false
  }

  isAlreadySelected(item: any) {
    const isExist = this.selectedMembers.filter((usr: any) => usr.id === item.id)
    return isExist.length > 0 ? true : false
  }

  updateSelectedMembers(user: any) {
    if (!this.isAlreadySelected(user) && user.selected) {
      this.selectedMembers.push(user)
    }
    if (this.isAlreadySelected(user) && !user.selected) {
      this.selectedMembers = this.selectedMembers.filter((mem: any) => user.id !== mem.id)
    }
  }

  selectedMember(user: any) {
    this.activeUsersData = this.activeUsersData.map(usr => {
      if (usr.id === user.id) {
        usr.selected = !usr.selected
      }
      this.updateSelectedMembers(user)
      return usr
    })
  }
  selectAllMembers(selectAll: boolean) {
    this.activeUsersData = this.activeUsersData.map((user: any) => {
      user.selected = selectAll ? true : false
      this.updateSelectedMembers(user)
      return user
    })
    // this.activeUsersData = this.selectedMembers
  }

  // All the selected members will be there,
  async saveSelected() {
    const allSelectedUser = this.activeUsersData.filter(user => user.selected === true).map(user => user.id)
    await allSelectedUser.forEach((memberId) => {
      const requestParam = {
        request: {
          courseId: this.route.snapshot.params.doId,
          batchId: this.route.snapshot.params.batchId,
          userId: memberId
        }
      }
      this.mandatoryCourseSvc.addMember(requestParam).subscribe(() => { })
    })
    this.snackbar.open(`${allSelectedUser.length} members added.`, 'Close', { verticalPosition: 'top' })
    this.selectAllMembers(false)
    this.filterTags.onPageChange(false)
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
      this.mandatoryCourseSvc.removeMember(requestParam).subscribe(() => {
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
