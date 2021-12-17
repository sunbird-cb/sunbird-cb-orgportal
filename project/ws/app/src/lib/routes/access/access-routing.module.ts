import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { HomeComponent } from './routes/home/home.component'
import { PrivilegesComponent } from './routes/privileges/privileges.component'
import { UsersComponent } from './routes/users/users.component'
import { UsersListResolve } from '../home/resolvers/users-list-resolve.service'
import { ConfigResolveService } from '../home/resolvers/config-resolve.service'

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: {
      // department: DepartmentResolve,
      configService: ConfigResolveService,
    },
    children: [
      {
        path: ':role/privileges',
        component: PrivilegesComponent,
        data: {
          pageId: ':role',
          module: 'roles-access',
        },
      },
      {
        path: ':role/users',
        component: UsersComponent,
        data: {
          pageId: ':role',
          module: 'roles-access',
        },
        resolve: {
          usersList: UsersListResolve,
        },
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [UsersListResolve],
})
export class AccessRoutingModule { }
