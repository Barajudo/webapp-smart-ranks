import { Component, OnInit } from '@angular/core';
import {
  User,
  CreateUserDto,
  UpdateUserDto,
  UserRole,
} from '../../interfaces/user.interface';
import { UsersService } from '../../services/users.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  providers: [MessageService, ConfirmationService],
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  user: User = this.getEmptyUser();
  selectedUsers: User[] = [];
  userDialog = false;
  submitted = false;
  loading = false;
  confirmPassword = '';
  currentUserRole: string = '';
  currentUserId: string = '';

  constructor(
    private usersService: UsersService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.currentUserRole = localStorage.getItem('userRole') || '';
    this.currentUserId = localStorage.getItem('userId') || '';
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    if (this.currentUserRole === 'admin') {
      this.usersService.getUsers().subscribe({
        next: (data) => {
          this.users = data;
          this.loading = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
          this.loading = false;
        },
      });
    } else {
      this.usersService.getUser(this.currentUserId).subscribe({
        next: (oneUser) => {
          console.log({ oneUser });
          this.users = [oneUser]; 
          this.loading = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
          this.loading = false;
        },
      });
    }
  }

  openNew() {
    this.user = this.getEmptyUser();
    this.confirmPassword = '';
    this.submitted = false;
    this.userDialog = true;
  }

  editUser(u: User) {
    this.user = { ...u };
    this.confirmPassword = '';
    this.userDialog = true;
  }

  deleteUser(u: User) {
    if (this.currentUserRole !== 'admin') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No tienes permisos para eliminar usuarios',
      });
      return;
    }

    if (u._id === this.currentUserId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'You cannot delete your own user account',
      });
      return;
    }

    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${u.name}?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (!u._id) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'User ID not found',
          });
          return;
        }
        this.usersService.deleteUser(u._id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'User deleted successfully',
            });
            this.loadUsers();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message || 'Error deleting user',
            });
          },
        });
      },
    });
  }

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }

  saveUser() {
    this.submitted = true;
    if (!this.user.name || !this.user.email) return;
    if (!this.isEmailValid()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid email format',
      });
      return;
    }
    if (this.user._id) {
      const changes: UpdateUserDto = {
        name: this.user.name,
        email: this.user.email,
        role: this.user.role,
      };
      this.usersService.updateUser(this.user._id, changes).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User updated',
          });
          this.loadUsers();
          this.userDialog = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
        },
      });
    } else {
      if (!this.user.password || !this.confirmPassword) return;
      if (this.user.password !== this.confirmPassword) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Passwords do not match',
        });
        return;
      }
      const data: CreateUserDto = {
        name: this.user.name,
        email: this.user.email,
        role: this.user.role,
        password: this.user.password,
      };
      this.usersService.createUser(data).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User created',
          });
          this.loadUsers();
          this.userDialog = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
        },
      });
    }
  }

  isEmailValid(): boolean {
    if (!this.user.email) return false;
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(this.user.email.trim());
  }

  private getEmptyUser(): User {
    return {
      name: '',
      email: '',
      password: '',
      role: UserRole.USER,
    };
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
