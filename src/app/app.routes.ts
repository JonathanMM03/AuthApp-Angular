import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Register } from './components/register/register';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { AccountDetail } from './pages/account-detail/account-detail';
import { Users } from './pages/users/users';
import { Role } from './pages/role/role';

export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },
    {
        path: '',
        component: Home
    },
    {
        path: 'register',
        component: Register
    },
    {
        path: 'forgot-password',
        component: ForgotPassword
    },
    {
        path: 'account/:id',
        component: AccountDetail
    },
    {
        path: 'users',
        component: Users
    },
    {
        path: 'roles',
        component: Role
    }
];
