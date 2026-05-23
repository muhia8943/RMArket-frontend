import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterLink, CommonModule, HttpClientModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {

  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        console.log('Users:', data);
        this.users = data;
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }

  deleteUser(user: User) {
    console.log('Deleting:', user);

    if (!user.id) {
      console.error('No ID:', user);
      return;
    }

    if (confirm(`Delete ${user.username}?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          console.log('Deleted');
          this.loadUsers();
        },
        error: (err) => {
          console.error('Delete error:', err);
        }
      });
    }
  }
}