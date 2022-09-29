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
          module: 'home',
        },
      },
      {
        path: 'users/:tab',
        component: UsersViewComponent,
        resolve: {
          usersList: UsersListResolve,
          pageData: PageResolve,
        },
        data: {
          pageId: 'users',
          module: 'home',
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
        },
        data: {
          pageId: 'users',
          module: 'home',
          pageType: 'feature',
          pageKey: 'users-view',
        },
      },
      {
        path: 'about',
        component: AboutComponent,
        data: {
          pageId: 'about',
          module: 'home',
        },
      },
      {
        path: 'roles-access',
        component: RolesAccessComponent,
        data: {
          pageId: 'roles-access',
          module: 'home',
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
          module: 'home',
        },
      },
      {
        path: 'workallocation/:tab',
        data: {
          pageId: 'workallocation',
          module: 'home',
        },
        component: WorkallocationComponent,
      },
      {
        path: 'workallocation',
        redirectTo: 'workallocation/draft', pathMatch: 'full',
        data: {
          pageId: 'workallocation',
          module: 'home',
        },
        component: WorkallocationComponent,
      },
    ],
  },
  {
    path: 'mdoinfo',
    component: MdoinfoComponent,
    data: {
      pageId: 'mdoinfo',
      module: 'home',
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
          module: 'home',
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
          module: 'home',
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
          module: 'home',
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
