import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { UserInfoDto } from '../entities/dtos/user-info.dto';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  constructor(private readonly httpService: HttpService) {}

  getUserInfos(): Observable<any> {
    return this.httpService.get(`/users-info`);
  }

  getUserInfo(userId: string): Observable<any> {
    return this.httpService.get(`/users-info/${userId}/user-info`);
  }

  getUserInfoPromise(userId: string): Promise<any> {
    return this.httpService.get(`/users-info/${userId}/user-info`).toPromise();
  }

  searchUserInfo(username: string): Observable<any> {
    return this.httpService.get(
      `/users-info/search/users-info?username=${username}`
    );
  }

  updateUserInfo(userInfoId: string, userInfo: UserInfoDto): Observable<any> {
    return this.httpService.put(`/users-info/${userInfoId}`, userInfo);
  }

  /* Follow/Unfollow */

  followUnfollow(
    userId: string,
    userToFollowUnfollowId: string
  ): Observable<any> {
    return this.httpService.put(
      `/users-info/${userId}/follow-unfollow/${userToFollowUnfollowId}`,
      null
    );
  }

  getUserFollowers(userId: string) {
    return this.httpService.get(`/users-info/${userId}/followers`);
  }

  getUserFollowing(userId: string) {
    return this.httpService.get(`/users-info/${userId}/following`);
  }
}
