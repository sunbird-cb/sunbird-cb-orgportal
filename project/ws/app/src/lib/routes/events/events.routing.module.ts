import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { ViewEventComponent } from './routes/view-event/view-event.component'
import { CreateEventComponent } from './routes/create-event/create-event.component'
import { ListEventComponent } from './routes/list/list-event.component'
import { EventsHomeComponent } from './routes/events-home/events-home.component'
import { ConfigResolveService } from './resolvers/config-resolve.service'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: '',
    component: EventsHomeComponent,
    children: [
      {
        path: 'list',
        component: ListEventComponent,
        resolve: {
          configService: ConfigResolveService,
        },
      },
      {
        path: ':eventId/details',
        component: ViewEventComponent,
      },
    ],
  },
  {
    path: 'create-event',
    component: CreateEventComponent,
    resolve: {
      configService: ConfigResolveService,
    },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ConfigResolveService],
})
export class EventsRoutingModule {

}
