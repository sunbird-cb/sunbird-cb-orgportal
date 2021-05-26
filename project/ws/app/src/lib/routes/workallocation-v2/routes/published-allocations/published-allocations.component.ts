import { Component, OnInit, SimpleChanges } from '@angular/core'
import { ITableData } from '@sunbird-cb/collection/lib/ui-org-table/interface/interfaces'
import { MatPaginator } from '@angular/material'
import { ExportAsService, ExportAsConfig } from 'ngx-export-as'
/* tslint:disable */
import _ from 'lodash'
import { WorkallocationService } from '../../../home/services/workallocation.service'
import FileSaver from 'file-saver'
@Component({
  selector: 'ws-app-published-allocations',
  templateUrl: './published-allocations.component.html',
  styleUrls: ['./published-allocations.component.scss'],
})
export class PublishedAllocationsComponent implements OnInit {
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

  config: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'downloadtemplate',
  }
  userslist: any[] = []
  downloaddata: any = []
  totalusersCount: any
  // p: number = 1;
  constructor(private exportAsService: ExportAsService,
    private workallocationSrvc: WorkallocationService) { }

  ngOnInit() {
    this.tabledata = {
      actions: [],
      columns: [
        { displayName: 'Full Name', key: 'fullname' },
        { displayName: 'Roles', key: 'roles' },
        { displayName: 'Activities', key: 'activities' },
      ],
      needCheckBox: false,
      needHash: false,
      sortColumn: 'fullName',
      sortState: 'asc',
      needUserMenus: true,
    }
    this.data = [
      {
        fullname: 'Latika Paharia',
        firstname: 'Latika',
        surname: 'Paharia',
        email: 'latika@test.com',
        userId: '2542352352523FF',
        position: 'Director (Admin & GA)',
        phone: '3214567890',
        competencies: '',
        error: 'true',
        roleCompetencyList: [
          {
            roleDetails: {
              type: 'ROLE',
              id: 'RID001',
              name: 'Training cell',
              description: '',
              status: 'UNVERIFIED',
              childNodes: [
                {
                  type: 'ACTIVITY',
                  id: 'AID001',
                  name: 'Mandatory Training Programme of officers belonging to various services viz. CSS, CSSS, CSCS conducted by ISTM',
                  description: '',
                  parentRole: 'RID001',
                  submitToInt: 'RA',
                  submitTo: 'Rajesh Agarwal',
                  submitToOther: '',
                  submitFromInt: 'PD',
                  submitFrom: 'Prerna Dadasheb',
                  submitFromOther: '',
                },
                {
                  type: 'ACTIVITY',
                  id: 'AID001',
                  name: 'Mandatory and Mid-Career training programmes of officers appointed through Central Staffing Scheme and officers belonging to various others services viz. IES, ISS, SSS, etc.',
                  description: '',
                  parentRole: 'RID001',
                  submitToInt: 'RA',
                  submitTo: 'Rajesh Agarwal',
                  submitToOther: '',
                  submitFromInt: 'PD',
                  submitFrom: 'Prerna Dadasheb',
                  submitFromOther: '',
                },
                {
                  type: 'ACTIVITY',
                  id: 'AID001',
                  name: 'Familiarization Training of Non-Technical Officers of Department on Water',
                  description: '',
                  parentRole: 'RID001',
                  submitToInt: '',
                  submitTo: '',
                  submitToOther: 'Final authority',
                  submitFromInt: 'SK',
                  submitFrom: 'Swanand Kirkire',
                  submitFromOther: '',
                }
              ],
            },
            competencyDetails: [],
          },
          {
            roleDetails: {
              type: 'ROLE',
              id: 'RID001',
              name: 'Budget related matters',
              description: '',
              status: 'UNVERIFIED',
              childNodes: [
                {
                  type: 'ACTIVITY',
                  id: 'AID001',
                  name: 'Planning BE, RE etc.',
                  description: '',
                  parentRole: 'RID001',
                  submitToInt: 'MP',
                  submitTo: 'Midhun Pottayil',
                  submitToOther: '',
                  submitFromInt: 'DK',
                  submitFrom: 'Dileep Kumar',
                  submitFromOther: '',
                },
                {
                  type: 'ACTIVITY',
                  id: 'AID001',
                  name: 'Compiling details related to budgetary provisions as required by Budget Section and furnishing information as and when required by them.',
                  description: '',
                  parentRole: 'RID001',
                  submitToInt: 'MP',
                  submitTo: 'Midhun Pottayil',
                  submitToOther: '',
                  submitFromInt: 'SK',
                  submitFrom: 'Sneha Kakkar',
                  submitFromOther: '',
                },
                {
                  type: 'ACTIVITY',
                  id: 'AID001',
                  name: 'Maintaining and furnishing information to Budget Section on allocation/expenditure of funds under KRD CB Scheme',
                  description: '',
                  parentRole: 'RID001',
                  submitToInt: 'DK',
                  submitTo: 'Dhawal Kulkarni',
                  submitToOther: '',
                  submitFromInt: 'RM',
                  submitFrom: 'Rajeev Masand',
                  submitFromOther: '',
                }
              ],
            },
            competencyDetails: [],
          },
        ]
      },
      {
        fullname: 'Joy Mathew',
        firstname: 'Joy',
        surname: 'Mathew',
        email: 'latika@test.com',
        userId: '2542352352523FF',
        position: 'Director (External & international cooperation)',
        phone: '3214567890',
        competencies: '',
        error: 'true',
        roleCompetencyList: [
          {
            roleDetails: {
              type: 'ROLE',
              id: 'RID001',
              name: 'Externally aided projects',
              description: '',
              status: 'UNVERIFIED',
              childNodes: [
                {
                  type: 'ACTIVITY',
                  id: 'AID001',
                  name: 'Obtaining in-principal approval of the Department of Water Resources, RD & GR for the State Government projects seeking external assistance from Multilateral Banks/ Foreign Funding agencies after getting them examined by Central Water Commission and other concerned Organizations at the PPR and DPR stage.',
                  description: '',
                  parentRole: 'RID001',
                  submitToInt: 'DK',
                  submitTo: 'Dhawal Kulkarni',
                  submitToOther: '',
                  submitFromInt: 'RK',
                  submitFrom: 'Ramachandran KR',
                  submitFromOther: '',
                },
                {
                  type: 'ACTIVITY',
                  id: 'AID001',
                  name: 'Liasoning with State Government and Department of Economics Affairs in this matter',
                  description: '',
                  parentRole: 'RID001',
                  submitToInt: 'DK',
                  submitTo: 'Dhawal Kulkarni',
                  submitToOther: '',
                  submitFromInt: 'RM',
                  submitFrom: 'Rajeev Masand',
                  submitFromOther: '',
                },
                {
                  type: 'ACTIVITY',
                  id: 'AID001',
                  name: 'Proposals for studies/ technical assistance from the States for taking up the proposals with the external Funding agencies.',
                  description: '',
                  parentRole: 'RID001',
                  submitToInt: 'DK',
                  submitTo: 'Dhawal Kulkarni',
                  submitToOther: '',
                  submitFromInt: 'SK',
                  submitFrom: 'Sneha Kakkar',
                  submitFromOther: '',
                }
              ],
            },
            competencyDetails: [],
          },
          {
            roleDetails: {
              type: 'ROLE',
              id: 'RID001',
              name: 'International cooperation',
              description: '',
              status: 'UNVERIFIED',
              childNodes: [
                {
                  type: 'ACTIVITY',
                  id: 'AID001',
                  name: 'Collaboration / Bilateral agreements / Cooperation in the filed of Water Resources with Foreign countries including signing of memoranda of understanding',
                  description: '',
                  parentRole: 'RID001',
                  submitToInt: 'SS',
                  submitTo: 'Shreya Singhal',
                  submitToOther: '',
                  submitFromInt: 'DK',
                  submitFrom: 'Dileep Kumar',
                  submitFromOther: '',
                },
                {
                  type: 'ACTIVITY',
                  id: 'AID001',
                  name: 'Drafting of cabinet note and its subsequent approval from the Cabinet and PMO; coordination and liasing with foreign countries/ Ministry of External Affairs for mutually deciding the areas of cooperation and terms of such international agreements; Constitution of Joint Working Group for the implementation of the activites envisaged in the MoUs;',
                  description: '',
                  parentRole: 'RID001',
                  submitToInt: 'DK',
                  submitTo: 'Dhawal Kulkarni',
                  submitToOther: '',
                  submitFromInt: 'RM',
                  submitFrom: 'Rajeev Masand',
                  submitFromOther: '',
                },
                {
                  type: 'ACTIVITY',
                  id: 'AID001',
                  name: 'Mattersrelating to water issues in various UN organizations such as UNESCO, UN Environment, FAO, etc.',
                  description: '',
                  parentRole: 'RID001',
                  submitToInt: 'SS',
                  submitTo: 'Shreya Singhal',
                  submitToOther: '',
                  submitFromInt: 'SK',
                  submitFrom: 'Sneha Kakkar',
                  submitFromOther: '',
                }
              ],
            },
            competencyDetails: [],
          }
        ]
      }
    ]

    this.getdeptUsers()
  }

  viewscanned() {
    const pdfName = 'Scanned'
    const pdfUrl = '/assets/files/scaned.pdf'
    FileSaver.saveAs(pdfUrl, pdfName)
  }

  print() {
    const pdfName = 'Published'
    const pdfUrl = '/assets/files/published.pdf'
    FileSaver.saveAs(pdfUrl, pdfName)
  }

  // Download format
  export() {
    this.exportAsService.save(this.config, 'WorkAllocation').subscribe(() => {
      // save started
    })
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
}
