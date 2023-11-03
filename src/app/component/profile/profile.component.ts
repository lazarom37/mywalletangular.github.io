import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private auth: AuthService, private router : Router) { }

  ngOnInit(): void {
    if (!this.auth.checkUserLogin()) {
      this.router.navigate(['login']);
    }
  }


}