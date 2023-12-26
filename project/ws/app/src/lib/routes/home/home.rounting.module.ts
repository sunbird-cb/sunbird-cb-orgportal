import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// import { InitResolver } from './resol./routes/profile-v2/discuss-all.component'
import { HomeResolve } from './resolvers/home-resolve'
import { AboutComponent } from './routes/about/about.component'
import { HomeComponent } from './routes/home/home.component'
import { UsersViewComponent } from './routes/users-view/users-view.component'
import { RolesAccessComponent } from './routes/roles-access/roles-access.component'
// import { PageResolve } from '@sunbird-cb/utils'
import { ApprovalsComponent } from './routes/approvals/approvals.component'
import { WorkallocationComponent } from './routes/workallocation/workallocation.component'
import { WelcomeComponent } from './routes/welcome/welcome.component'
import { ConfigResolveService } from './resolvers/config-resolve.service'
import { UsersListResolve } from './resolvers/users-list-resolve.service'
import { LeadershipComponent } from './routes/leadership/leadership.component'
import { StaffComponent } from './routes/staff/staff.component'
import { BudgetComponent } from './routes/budget/budget.component'
import { MdoinfoComponent } from './routes/mdoinfo/mdoinfo.component'
import { PageResolve } from '@sunbird-cb/utils'
import { BlendedApprovalsComponent } from './routes/blended-approvals/blended-approvals.component'
import { ReportsSectionComponent } from './routes/reports-section/reports-section.component'
import { TrainingPlanDashboardComponent } from './routes/training-plan-dashboard/training-plan-dashboard.component'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'welcome',
  },
  {
    path: '',
    component: HomeComponent,
    resolve: {
      // department: DepartmentResolve,
      configService: ConfigResolveService,
      tabs: HomeResolve,
    },
    children: [
      {
        path: 'welcome',
        component: WelcomeComponent,
        data: {
          pageId: 'welcome',
          module: 'Home',
        },
      },
      {
        path: 'users/:tab',
        component: UsersViewComponent,
        resolve: {
          usersList: UsersListResolve,
          pageData: PageResolve,
          configService: ConfigResolveService,
        },
        data: {
          pageId: 'users',
          module: 'User',
          pageType: 'feature',
          pageKey: 'users-view',
        },
      },
      {
        path: 'users',
        redirectTo: 'users/active',
        component: UsersViewComponent,
        resolve: {
          usersList: UsersListResolve,
          pageData: PageResolve,
          configService: ConfigResolveService,
        },
        data: {
          pageId: 'users',
          module: 'User',
          pageType: 'feature',
          pageKey: 'users-view',
        },
      },
      {
        path: 'about',
        component: AboutComponent,
        data: {
          pageId: 'about',
          module: 'Home',
        },
      },
      {
        path: 'roles-access',
        component: RolesAccessComponent,
        data: {
          pageId: 'roles-access',
          module: 'Roles',
        },
        resolve: {
          usersList: UsersListResolve,
        },
      },
      {
        path: 'approvals',
        component: ApprovalsComponent,
        data: {
          pageId: 'approvals',
          module: 'Approvals',
        },
      },
      {
        path: 'workallocation/:tab',
        data: {
          pageId: 'workallocation',
          module: 'Work Allocation',
        },
        component: WorkallocationComponent,
      },
      {
        path: 'workallocation',
        redirectTo: 'workallocation/draft', pathMatch: 'full',
        data: {
          pageId: 'workallocation',
          module: 'Work Allocation',
        },
        component: WorkallocationComponent,
      },
      {
        path: 'blended-approvals',
        component: BlendedApprovalsComponent,
        data: {
          pageId: 'blended-approvals',
          module: 'Home',
        },
      },
      {
        path: 'reports-section',
        component: ReportsSectionComponent,
        data: {
          pageId: 'reports-section',
          module: 'Home',
        },
      },
      {
        path: 'training-plan-dashboard',
        component: TrainingPlanDashboardComponent,
        data: {
          pageId: 'training-plan-dashboard',
          pageType: 'feature',
          pageKey: 'training-plan-dashboard',
        },
        resolve: {
          configService: ConfigResolveService,
          pageData: PageResolve,
        }
      },
    ],
  },
  {
    path: 'mdoinfo',
    component: MdoinfoComponent,
    data: {
      pageId: 'mdoinfo',
      module: 'Home',
    },
    resolve: {
      configService: ConfigResolveService,
    },
    children: [
      {
        path: 'leadership',
        component: LeadershipComponent,
        data: {
          pageId: 'leadership',
          module: 'Home',
        },
        resolve: {
          configService: ConfigResolveService,
        },
      },
      {
        path: 'staff',
        component: StaffComponent,
        data: {
          pageId: 'staff',
          module: 'Home',
        },
        resolve: {
          configService: ConfigResolveService,
        },
      },
      {
        path: 'budget',
        component: BudgetComponent,
        data: {
          pageId: 'budget',
          module: 'Home',
        },
        resolve: {
          configService: ConfigResolveService,
        },
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    HomeResolve,
    // DepartmentResolve,
    ConfigResolveService,
    UsersListResolve,
  ],
})
export class HomeRoutingModule { }
