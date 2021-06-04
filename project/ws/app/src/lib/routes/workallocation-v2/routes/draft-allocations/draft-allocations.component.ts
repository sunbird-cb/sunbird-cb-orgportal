import { Component, OnInit, SimpleChanges } from '@angular/core'
import { ITableData } from '@sunbird-cb/collection/lib/ui-org-table/interface/interfaces'
import { MatPaginator, MatDialog } from '@angular/material'
import { Router, ActivatedRoute } from '@angular/router'
import { ExportAsService, ExportAsConfig } from 'ngx-export-as'
/* tslint:disable */
import _ from 'lodash'
import { WorkallocationService } from '../../../home/services/workallocation.service'
import { PublishPopupComponent } from '../../components/publish-popup/publish-popup.component'
import { AllocationService } from '../../services/allocation.service'
import FileSaver from 'file-saver'
@Component({
  selector: 'ws-app-draft-allocations',
  templateUrl: './draft-allocations.component.html',
  styleUrls: ['./draft-allocations.component.scss'],
})
export class DraftAllocationsComponent implements OnInit {
  tabs: any
  currentUser!: string | null
  tabledata!: ITableData
  data: any = []
  term!: string | null
  length!: number
  pageSize = 10
  pageSizeOptions = [5, 10, 20]
  paginator!: MatPaginator
  departmentName: any
  departmentID: any
  bdtitles = [{ title: 'Work allocation tool', url: '/app/home/workallocation' },
  { title: 'Drafts', url: '/app/home/workallocation' }]

  config: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'downloadtemplate',
  }
  userslist: any[] = []
  downloaddata: any = []
  totalusersCount: any
  statscount: any = {}
  queryParams: any
  workorderID: any
  workorderData: any
  constructor(private activated: ActivatedRoute, private exportAsService: ExportAsService, private router: Router,
    private workallocationSrvc: WorkallocationService, public dialog: MatDialog,
    private allocateSrvc: AllocationService) {
    this.activated.queryParamMap.subscribe((queryParams: any) => {
      if (queryParams.has('status')) {
        this.queryParams = queryParams.get('status') || ''
      }
    })
    this.activated.params.subscribe((param: any) => {
      this.workorderID = param['workorders'] || ''
      this.getAllocatedUsers(this.workorderID)
    })
  }

  ngOnInit() {
    // this.tabledata = {
    //   actions: [],
    //   columns: [
    //     { displayName: 'Full Name', key: 'fullname' },
    //     { displayName: 'Roles', key: 'roles' },
    //     { displayName: 'Activities', key: 'activities' },
    //   ],
    //   needCheckBox: false,
    //   needHash: false,
    //   sortColumn: 'fullName',
    //   sortState: 'asc',
    //   needUserMenus: true,
    // }
    // if (this.queryParams === 'New') {
    //   this.statscount = {
    //     Officers: '0',
    //     Progress: '0%',
    //     Errors: '0',
    //     Roles: '0',
    //     Competencies: '0',
    //     Activities: '0',
    //   }
    //   this.data = []
    // } else {
    //   this.statscount = {
    //     Officers: '3',
    //     Progress: '67%',
    //     Errors: '3',
    //     Roles: '8',
    //     Competencies: '1',
    //     Activities: '15',
    //   }
    // this.data = [
    //   {
    //     fullname: 'Devaprathap Nagendra',
    //     firstname: 'Devaprathap',
    //     surname: 'Nagendra',
    //     email: 'Devaprathap@test.com',
    //     userId: '2542352352523FF',
    //     position: 'Director (Coordination)',
    //     phone: '3214567890',
    //     competencies: '',
    //     error: 'true',
    //     roleCompetencyList: [
    //       {
    //         roleDetails: {
    //           type: 'ROLE',
    //           id: 'RID001',
    //           name: 'Coordination matters',
    //           description: '',
    //           status: 'UNVERIFIED',
    //           childNodes: [
    //             {
    //               type: 'ACTIVITY',
    //               id: 'AID001',
    //               name: 'Coordination of matters relating to RTI Act, 2005 with concerned CPIOs of this Department and its organizations',
    //               description: '',
    //               parentRole: 'RID001',
    //               submitToInt: '',
    //               submitTo: '',
    //               submitToOther: 'Final authority',
    //               submitFromInt: 'SK',
    //               submitFrom: 'Sneha Kakkar',
    //               submitFromOther: '',
    //             },
    //             {
    //               type: 'ACTIVITY',
    //               id: 'AID001',
    //               name: 'Preparation and monitoring of periodic reports on disposal of RTI requests/appeals and compliance of CIC instructions issued from time to time',
    //               description: '',
    //               parentRole: 'RID001',
    //               submitToInt: 'SD',
    //               submitTo: 'Sambit Dattachaudhari',
    //               submitToOther: '',
    //               submitFromInt: 'AR',
    //               submitFrom: 'Anwar Rashad',
    //               submitFromOther: '',
    //             },
    //             {
    //               type: 'ACTIVITY',
    //               id: 'AID001',
    //               name: 'Monitoring of public/ staff grievances and follow up actions thereon and submission of periodic returns to the concerned Ministry(s)/Department(s)',
    //               description: '',
    //               parentRole: 'RID001',
    //               submitToInt: 'DK',
    //               submitTo: 'Dhawal Kulkarni',
    //               submitToOther: '',
    //               submitFromInt: 'AL',
    //               submitFrom: 'Ankit Lokhande',
    //               submitFromOther: '',
    //             }
    //           ],
    //         },
    //         competencyDetails: [{
    //           type: 'COMPETENCY',
    //           name: 'Planning and coordination',
    //           description: '',
    //         },
    //         {
    //           type: 'COMPETENCY',
    //           name: 'Lean project management',
    //           description: '',
    //         }
    //         ],
    //       },
    //       {
    //         roleDetails: {
    //           type: 'ROLE',
    //           id: 'RID002',
    //           name: 'Organisation and methods (O&M)',
    //           description: '',
    //           status: 'UNVERIFIED',
    //           childNodes: [
    //             {
    //               type: 'ACTIVITY',
    //               id: 'AID001',
    //               name: 'Recording, Reviewing and Destruction of old records in the Department',
    //               description: '',
    //               parentRole: 'RID001',
    //               submitToInt: 'MP',
    //               submitTo: 'Midhun Pottayil',
    //               submitToOther: '',
    //               submitFromInt: 'DK',
    //               submitFrom: 'Dileep Kumar',
    //               submitFromOther: '',
    //             },
    //             {
    //               type: 'ACTIVITY',
    //               id: 'AID001',
    //               name: 'Compilation of Organizational History of the Department',
    //               description: '',
    //               parentRole: 'RID001',
    //               submitToInt: '',
    //               submitTo: '',
    //               submitToOther: 'Final authority',
    //               submitFromInt: 'MM',
    //               submitFrom: 'Mridula Mehta',
    //               submitFromOther: '',
    //             },
    //             {
    //               type: 'ACTIVITY',
    //               id: 'AID001',
    //               name: 'Compilation of information on Review of Records Retention Schedule for substantive functions of the Department and getting vetted by NAI',
    //               description: '',
    //               parentRole: 'RID001',
    //               submitToInt: 'RR',
    //               submitTo: 'Rajeev Ravi',
    //               submitToOther: '',
    //               submitFromInt: 'DM',
    //               submitFrom: 'Diksha Mishra',
    //               submitFromOther: '',
    //             }
    //           ],
    //         },
    //         competencyDetails: [{
    //           type: 'COMPETENCY',
    //           name: 'Record management',
    //           description: '',
    //         }],
    //       }
    //     ]
    //   },
    //   {
    //     fullname: 'Latika Paharia',
    //     firstname: 'Latika',
    //     surname: 'Paharia',
    //     email: 'latika@test.com',
    //     userId: '2542352352523FF',
    //     position: 'Director (Admin & GA)',
    //     phone: '3214567890',
    //     competencies: '',
    //     error: '',
    //     roleCompetencyList: [
    //       {
    //         roleDetails: {
    //           type: 'ROLE',
    //           id: 'RID001',
    //           name: 'Training cell',
    //           description: '',
    //           status: 'UNVERIFIED',
    //           childNodes: [
    //             {
    //               type: 'ACTIVITY',
    //               id: 'AID001',
    //               name: 'Mandatory Training Programme of officers belonging to various services viz. CSS, CSSS, CSCS conducted by ISTM',
    //               description: '',
    //               parentRole: 'RID001',
    //               submitToInt: 'RA',
    //               submitTo: 'Rajesh Agarwal',
    //               submitToOther: '',
    //               submitFromInt: 'PD',
    //               submitFrom: 'Prerna Dadasheb',
    //               submitFromOther: '',
    //             },
    //             {
    //               type: 'ACTIVITY',
    //               id: 'AID001',
    //               name: 'Mandatory and Mid-Career training programmes of officers appointed through Central Staffing Scheme and officers belonging to various others services viz. IES, ISS, SSS, etc.',
    //               description: '',
    //               parentRole: 'RID001',
    //               submitToInt: 'RA',
    //               submitTo: 'Rajesh Agarwal',
    //               submitToOther: '',
    //               submitFromInt: 'PD',
    //               submitFrom: 'Prerna Dadasheb',
    //               submitFromOther: '',
    //             },
    //             {
    //               type: 'ACTIVITY',
    //               id: 'AID001',
    //               name: 'Familiarization Training of Non-Technical Officers of Department on Water',
    //               description: '',
    //               parentRole: 'RID001',
    //               submitToInt: '',
    //               submitTo: '',
    //               submitToOther: 'Final authority',
    //               submitFromInt: 'SK',
    //               submitFrom: 'Swanand Kirkire',
    //               submitFromOther: '',
    //             }
    //           ],
    //         },
    //         competencyDetails: [{
    //           type: 'COMPETENCY',
    //           name: 'Leading others',
    //           description: '',
    //         }
    //         ],
    //       },
    //       {
    //         roleDetails: {
    //           type: 'ROLE',
    //           id: 'RID001',
    //           name: 'Budget related matters',
    //           description: '',
    //           status: 'UNVERIFIED',
    //           childNodes: [
    //             {
    //               type: 'ACTIVITY',
    //               id: 'AID001',
    //               name: 'Planning BE, RE etc.',
    //               description: '',
    //               parentRole: 'RID001',
    //               submitToInt: 'MP',
    //               submitTo: 'Midhun Pottayil',
    //               submitToOther: '',
    //               submitFromInt: 'DK',
    //               submitFrom: 'Dileep Kumar',
    //               submitFromOther: '',
    //             },
    //             {
    //               type: 'ACTIVITY',
    //               id: 'AID001',
    //               name: 'Compiling details related to budgetary provisions as required by Budget Section and furnishing information as and when required by them.',
    //               description: '',
    //               parentRole: 'RID001',
    //               submitToInt: 'MP',
    //               submitTo: 'Midhun Pottayil',
    //               submitToOther: '',
    //               submitFromInt: 'SK',
    //               submitFrom: 'Sneha Kakkar',
    //               submitFromOther: '',
    //             },
    //             {
    //               type: 'ACTIVITY',
    //               id: 'AID001',
    //               name: 'Maintaining and furnishing information to Budget Section on allocation/expenditure of funds under KRD CB Scheme',
    //               description: '',
    //               parentRole: 'RID001',
    //               submitToInt: 'DK',
    //               submitTo: 'Dhawal Kulkarni',
    //               submitToOther: '',
    //               submitFromInt: 'RM',
    //               submitFrom: 'Rajeev Masand',
    //               submitFromOther: '',
    //             }
    //           ],
    //         },
    //         competencyDetails: [{
    //           type: 'COMPETENCY',
    //           name: 'Budgeting',
    //           description: '',
    //         }
    //         ],
    //       },
    //     ]
    //   },
    //   {
    //     fullname: 'Joy Mathew',
    //     firstname: 'Joy',
    //     surname: 'Mathew',
    //     email: 'latika@test.com',
    //     userId: '2542352352523FF',
    //     position: 'Director (External & international cooperation)',
    //     phone: '3214567890',
    //     competencies: '',
    //     error: '',
    //     roleCompetencyList: [
    //       {
    //         roleDetails: {
    //           type: 'ROLE',
    //           id: 'RID001',
    //           name: 'Externally aided projects',
    //           description: '',
    //           status: 'UNVERIFIED',
    //           childNodes: [
    //             {
    //               type: 'ACTIVITY',
    //               id: 'AID001',
    //               name: 'Obtaining in-principal approval of the Department of Water Resources, RD & GR for the State Government projects seeking external assistance from Multilateral Banks/ Foreign Funding agencies after getting them examined by Central Water Commission and other concerned Organizations at the PPR and DPR stage.',
    //               description: '',
    //               parentRole: 'RID001',
    //               submitToInt: 'DK',
    //               submitTo: 'Dhawal Kulkarni',
    //               submitToOther: '',
    //               submitFromInt: 'RK',
    //               submitFrom: 'Ramachandran KR',
    //               submitFromOther: '',
    //             },
    //             {
    //               type: 'ACTIVITY',
    //               id: 'AID001',
    //               name: 'Liasoning with State Government and Department of Economics Affairs in this matter',
    //               description: '',
    //               parentRole: 'RID001',
    //               submitToInt: 'DK',
    //               submitTo: 'Dhawal Kulkarni',
    //               submitToOther: '',
    //               submitFromInt: 'RM',
    //               submitFrom: 'Rajeev Masand',
    //               submitFromOther: '',
    //             },
    //             {
    //               type: 'ACTIVITY',
    //               id: 'AID001',
    //               name: 'Proposals for studies/ technical assistance from the States for taking up the proposals with the external Funding agencies.',
    //               description: '',
    //               parentRole: 'RID001',
    //               submitToInt: 'DK',
    //               submitTo: 'Dhawal Kulkarni',
    //               submitToOther: '',
    //               submitFromInt: 'SK',
    //               submitFrom: 'Sneha Kakkar',
    //               submitFromOther: '',
    //             }
    //           ],
    //         },
    //         competencyDetails: [{
    //           type: 'COMPETENCY',
    //           name: 'Stakeholder management',
    //           description: '',
    //         }
    //         ],
    //       },
    //       {
    //         roleDetails: {
    //           type: 'ROLE',
    //           id: 'RID001',
    //           name: 'International cooperation',
    //           description: '',
    //           status: 'UNVERIFIED',
    //           childNodes: [
    //             {
    //               type: 'ACTIVITY',
    //               id: 'AID001',
    //               name: 'Collaboration / Bilateral agreements / Cooperation in the filed of Water Resources with Foreign countries including signing of memoranda of understanding',
    //               description: '',
    //               parentRole: 'RID001',
    //               submitToInt: 'SS',
    //               submitTo: 'Shreya Singhal',
    //               submitToOther: '',
    //               submitFromInt: 'DK',
    //               submitFrom: 'Dileep Kumar',
    //               submitFromOther: '',
    //             },
    //             {
    //               type: 'ACTIVITY',
    //               id: 'AID001',
    //               name: 'Drafting of cabinet note and its subsequent approval from the Cabinet and PMO; coordination and liasing with foreign countries/ Ministry of External Affairs for mutually deciding the areas of cooperation and terms of such international agreements; Constitution of Joint Working Group for the implementation of the activites envisaged in the MoUs;',
    //               description: '',
    //               parentRole: 'RID001',
    //               submitToInt: 'DK',
    //               submitTo: 'Dhawal Kulkarni',
    //               submitToOther: '',
    //               submitFromInt: 'RM',
    //               submitFrom: 'Rajeev Masand',
    //               submitFromOther: '',
    //             },
    //             {
    //               type: 'ACTIVITY',
    //               id: 'AID001',
    //               name: 'Mattersrelating to water issues in various UN organizations such as UNESCO, UN Environment, FAO, etc.',
    //               description: '',
    //               parentRole: 'RID001',
    //               submitToInt: 'SS',
    //               submitTo: 'Shreya Singhal',
    //               submitToOther: '',
    //               submitFromInt: 'SK',
    //               submitFrom: 'Sneha Kakkar',
    //               submitFromOther: '',
    //             }
    //           ],
    //         },
    //         competencyDetails: [{
    //           type: 'COMPETENCY',
    //           name: 'Planning and coordination',
    //           description: '',
    //         }
    //         ],
    //       }
    //     ]
    //   }
    // ]
    // }

    this.getdeptUsers()
  }

  // Download format
  export() {
    // this.exportAsService.save(this.config, 'WorkAllocation').subscribe(() => {
    // save started
    // })
    const pdfName = 'Draft'
    const pdfUrl = '/assets/files/draft.pdf'
    FileSaver.saveAs(pdfUrl, pdfName)
  }

  pdfCallbackFn(pdf: any) {
    // example to add page number as footer to every page of pdf
    const noOfPages = pdf.internal.getNumberOfPages()
    // tslint:disable-next-line:no-increment-decrement
    for (let i = 1; i <= noOfPages; i++) {
      pdf.setPage(i)
      // tslint:disable-next-line:prefer-template
      pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 100, pdf.internal.pageSize.getHeight() - 30)
    }
  }

  getdeptUsers() {
    this.workallocationSrvc.getAllUsers().subscribe(res => {
      this.departmentName = res.deptName
      this.departmentID = res.id
      this.getAllUsers('Draft')
    })
  }

  getAllUsers(statusKey: string) {
    const req = {
      pageNo: 0,
      pageSize: 1000,
      departmentName: this.departmentName,
      status: (statusKey !== '') ? statusKey : "Draft",
    }
    //if (this.currentFilter !== statusKey) {
    this.workallocationSrvc.getUsers(req).subscribe(res => {
      this.userslist = res.result.data
      this.totalusersCount = res.result.totalhit
      // this.filter(statusKey)
    })
    //}
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnChanges(data: SimpleChanges) {
    this.data = _.get(data, 'data.currentValue')
    this.length = this.data.length
    this.paginator.firstPage()
  }

  buttonClick(action: string, row: any) {
    this.downloaddata = []
    if (action === 'Download') {
      console.log('row data', row)
      this.downloaddata.push(row)
      this.exportAsService.save(this.config, 'WorkAllocation').subscribe(() => {
        // save started
      })
    } else if (action === 'Archive') {
      // const index = this.ralist.indexOf(row)
      // if (index >= 0) {
      //   this.ralist.splice(index, 1)
      // }
      // row.isArchived = true
      // this.archivedlist.push(row)
    }
  }

  // viewAllocation(data: any) {
  //   this.router.navigate([`/app/workallocation/details/${data.userId}`])
  // }

  onNewAllocationClick() {
    this.router.navigate([`/app/workallocation/create`, { workorder: this.workorderID }])
  }

  publishWorkOrder() {
    const dialogRef = this.dialog.open(PublishPopupComponent, {
      maxHeight: 'auto',
      height: '62%',
      width: '54%',
      panelClass: 'remove-pad',
    })
    dialogRef.afterClosed().subscribe((response: any) => {
      console.log(response)
    })
  }

  getAllocatedUsers(woId: any) {
    this.allocateSrvc.getAllocatedUsers(woId).subscribe((res: any) => {
      this.workorderData = res.result.data
      const newbdtitle = { title: this.workorderData.name, url: 'none' }
      this.bdtitles.push(newbdtitle)
      this.data = this.workorderData.users
    })
  }

}
