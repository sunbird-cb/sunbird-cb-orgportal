import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { ViewUserComponent } from './routes/view-user/view-user.component'
import { CreateUserComponent } from './routes/create-user/create-user.component'
import { DepartmentResolve } from '../users/resolvers/department-resolve'
import { UserResolve } from '../users/resolvers/user-resolve'
import { WorkflowHistoryResolve } from '../users/resolvers/workflow-history-resolve'
import { RolesResolver } from './resolvers/roles-resolve.service'
import { ConfigResolveService } from '../home/resolvers/config-resolve.service'

const routes: Routes = [
  {
    path: ':userId/details',
    component: ViewUserComponent,
    resolve: {
      profileData: UserResolve,
      workflowHistoryData: WorkflowHistoryResolve,
      // department: DepartmentResolve,
      rolesList: RolesResolver,
      configService: ConfigResolveService,
    },
  },
  {
    path: 'create-user',
    component: CreateUserComponent,
    resolve: {
      // department: DepartmentResolve,
      profileData: UserResolve,
      rolesList: RolesResolver,
    },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    UserResolve,
    DepartmentResolve,
    WorkflowHistoryResolve,
    RolesResolver,
    ConfigResolveService,
  ],
})
export class UsersRoutingModule { }
