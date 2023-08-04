import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { EventsService } from '../../services/events.service'
import { ConfigurationsService, EventService } from '@sunbird-cb/utils'
import * as moment from 'moment'
/* tslint:disable */
import _ from 'lodash'
import { TelemetryEvents } from '../../../../head/_services/telemetry.event.model'
/* tslint:enable */
@Component({
    selector: 'ws-app-list-event',
    templateUrl: './list-event.component.html',
    styleUrls: ['./list-event.component.scss'],
})
export class ListEventComponent implements OnInit, AfterViewInit, OnDestroy {
    tabledata: any = []
    data: any = []
    eventData: any = []
    math: any
    currentFilter = 'upcoming'
    discussionList!: any
    discussProfileData!: any
    userDetails: any
    location!: string | null
    tabs: any
    currentUser!: string | null
    connectionRequests!: any[]
    usersData!: any
    department: any
    departmentID: any
    configService: any
    constructor(
        private router: Router,
        private eventSvc: EventsService,
        private configSvc: ConfigurationsService,
        private activeRoute: ActivatedRoute,
        private events: EventService
    ) {
        this.math = Math
        this.configService = this.activeRoute.snapshot.data.configService
        if (this.configSvc.userProfile) {
            this.currentUser = this.configSvc.userProfile && this.configSvc.userProfile.userId
            this.department = this.configSvc.userProfile && this.configSvc.userProfile.departmentName
            this.departmentID = this.configSvc.userProfile && this.configSvc.userProfile.rootOrgId
        } else {
            if (_.get(this.activeRoute, 'snapshot.data.configService.userProfile.rootOrgId')) {
                this.departmentID = _.get(this.activeRoute, 'snapshot.data.configService.userProfile.rootOrgId')
            }
            if (_.get(this.activeRoute, 'snapshot.data.configService.userProfile.departmentName')) {
                this.department = _.get(this.activeRoute, 'snapshot.data.configService.userProfile.departmentName')
                _.set(this.department, 'snapshot.data.configService.userProfile.departmentName', this.department ? this.department : '')
            }
            if (_.get(this.activeRoute, 'snapshot.data.configService.userProfile.userId')) {
                this.currentUser = _.get(this.activeRoute, 'snapshot.data.configService.userProfile.userId')
            }
            if (this.configService.userProfile && this.configService.userProfile.departmentName) {
                this.configService.userProfile.departmentName = this.department
            }
        }
    }

    ngOnInit() {
        this.tabledata = {
            columns: [
                { displayName: 'Cover Picture', key: 'eventThumbnail' },
                { displayName: 'Title', key: 'eventName' },
                { displayName: 'Date and time', key: 'eventStartDate' },
                { displayName: 'Created On', key: 'eventCreatedOn' },
                { displayName: 'Duration', key: 'eventDuration' },
                { displayName: 'Joined', key: 'eventjoined' },
            ],
            needCheckBox: false,
            needHash: false,
            sortColumn: '',
            sortState: 'asc',
        }
        this.fetchEvents()
    }

    ngAfterViewInit() {
    }

    onEventClick(event: any) {
        this.router.navigate([`/app/events/${event.id}`])
    }

    fetchEvents() {
        // const requestObj = { "request": { "filters": { "status": ["Live"] }, "sort_by": { "createdOn": "desc" } } }
        // this.eventSvc.searchEvent(requestObj).subscribe(events => {
        //     this.setEventListData(events)
        // })

        const requestObj = {
            locale: [
                'en',
            ],
            query: '',
            request: {
                query: '',
                filters: {
                    status: ['Live'],
                    contentType: 'Event',
                },
                sort_by: {
                    startDate: 'desc',
                },
            },
        }

        this.eventSvc.getEventsList(requestObj).subscribe((events: any) => {
            this.setEventListData(events)
        })
    }

    setEventListData(eventObj: any) {
        if (eventObj !== undefined) {
            const data = eventObj.result.Event
            this.eventData['pastEvents'] = []
            this.eventData['upcomingEvents'] = []
            Object.keys(data).forEach((index: any) => {
                const obj = data[index]
                if (obj.createdFor && obj.createdFor[0] === this.departmentID) {
                    const expiryDateFormat = this.customDateFormat(obj.endDate, obj.endTime)
                    const floor = Math.floor
                    const hours = floor(obj.duration / 60)
                    const minutes = obj.duration % 60
                    const duration = (hours === 0) ? ((minutes === 0) ? '---' : `${minutes} minutes`) : (minutes === 0) ? (hours === 1) ?
                        `${hours} hour` : `${hours} hours` : (hours === 1) ? `${hours} hour ${minutes} minutes` :
                        `${hours} hours ${minutes} minutes`
                    const creatordata = obj.creatorDetails !== undefined ? obj.creatorDetails : []
                    const str = creatordata && creatordata.length > 0 ? creatordata.replace(/\\/g, '') : []
                    const creatorDetails = str && str.length > 0 ? JSON.parse(str) : creatordata
                    const eventDataObj = {
                        eventName: obj.name.substring(0, 100),
                        eventStartDate: this.customDateFormat(obj.startDate, obj.startTime),
                        eventCreatedOn: this.allEventDateFormat(obj.createdOn),
                        eventDuration: duration,
                        eventjoined: (creatorDetails !== undefined && creatorDetails.length > 0) ?
                            ((creatorDetails.length === 1) ? '1 person' : `${creatorDetails.length} people`) : ' --- ',
                        eventThumbnail: obj.appIcon && (obj.appIcon !== null || obj.appIcon !== undefined) ?
                            this.eventSvc.getPublicUrl(obj.appIcon) :
                            '/assets/icons/Events_default.png',
                    }
                    const isPast = this.compareDate(expiryDateFormat);
                    (isPast) ? this.eventData['pastEvents'].push(eventDataObj) : this.eventData['upcomingEvents'].push(eventDataObj)
                }
            })
            this.filter('upcoming')
        }
    }

    customDateFormat(date: any, time: any) {
        // const year = date.split('T')[0].substring(0, 4)
        // const month = date.split('T')[0].substring(4, 6)
        // const dDate = date.split('T')[0].substring(6, 8)
        // const hour = date.split('T')[1].substring(0, 2)
        // const min = date.split('T')[1].substring(2, 4)
        // return `${dDate}-${month}-${year} ${hour}:${min}`
        const stime = time.split('+')[0]
        const hour = stime.substr(0, 2)
        const min = stime.substr(2, 3)
        return `${date} ${hour}${min}`
    }

    filter(key: string | 'timestamp' | 'best' | 'saved') {
        const upcomingEventsData: any[] = []
        const pastEventsData: any[] = []
        if (this.eventData['pastEvents'] && this.eventData['pastEvents'].length > 0) {
            this.eventData['pastEvents'].forEach((event: any) => {
                pastEventsData.push(event)
            })
        }

        if (this.eventData['upcomingEvents'] && this.eventData['upcomingEvents'].length > 0) {
            this.eventData['upcomingEvents'].forEach((event: any) => {
                upcomingEventsData.push(event)
            })
        }

        if (key) {
            this.currentFilter = key
            switch (key) {
                case 'upcoming':
                    this.data = upcomingEventsData
                    break
                case 'past':
                    this.data = pastEventsData
                    break
                default:
                    this.data = upcomingEventsData
                    break
            }
        }
    }

    onCreateClick() {
        this.router.navigate([`/app/users/create-user`])
    }

    onRoleClick(user: any) {
        this.router.navigate([`/app/users/${user.userId}/details`])
    }

    ngOnDestroy() {

    }

    compareDate(selectedDate: any) {
        const now = new Date()
        const today = moment(now).format('YYYY-MM-DD HH:mm')
        return (selectedDate < today) ? true : false
    }

    allEventDateFormat(datetime: any) {
        const date = new Date(datetime).getDate()
        const year = new Date(datetime).getFullYear()
        const month = new Date(datetime).getMonth()
        const hours = new Date(datetime).getHours()
        const minutes = new Date(datetime).getMinutes()
        const seconds = new Date(datetime).getSeconds()
        const formatedDate = new Date(year, month, date, hours, minutes, seconds, 0)
        // let format = 'YYYY-MM-DD hh:mm a'
        // if (!timeAllow) {
        const format = 'YYYY-MM-DD'
        // }
        const readableDateMonth = moment(formatedDate).format(format)
        const finalDateTimeValue = `${readableDateMonth}`
        return finalDateTimeValue
    }

    formatTimeAmPm(futureDate: any) {
        let hours = futureDate.getHours()
        let minutes = futureDate.getMinutes()
        const ampm = hours >= 12 ? 'pm' : 'am'
        hours = hours % 12
        hours = hours ? hours : 12
        minutes = minutes < 10 ? `0${minutes}` : minutes
        const strTime = `${hours}:${minutes} ${ampm}`
        return strTime
    }
    public tabTelemetry(label: string, index: number) {
        const data: TelemetryEvents.ITelemetryTabData = {
            label,
            index,
        }
        this.events.handleTabTelemetry(
            TelemetryEvents.EnumInteractSubTypes.APPROVAL_TAB,
            data,
        )
    }

}
