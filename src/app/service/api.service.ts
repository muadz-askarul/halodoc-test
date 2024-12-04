import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostListRespDto } from '../models/dtos/post-list-resp.dto';
import { HttpClient } from '@angular/common/http';
import { PostDetailRespDto } from '../models/dtos/post-detail-resp.dto';
import { UserRespDto } from '../models/dtos/user-resp.dto';
import { CommentListRespDto } from '../models/dtos/comment-resp.dto';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'https://jsonplaceholder.typicode.com';

  constructor(private httpClient: HttpClient) {}

  findAllPost(): Observable<PostListRespDto> {
    return this.httpClient.get<PostListRespDto>(`${this.baseUrl}/posts`);
  }

  findPostById(postId: string): Observable<PostDetailRespDto> {
    return this.httpClient.get<PostDetailRespDto>(
      `${this.baseUrl}/posts/${postId}`
    );
  }

  findUserById(userId: number): Observable<UserRespDto> {
    return this.httpClient.get<UserRespDto>(`${this.baseUrl}/users/${userId}`);
  }

  findPostComments(postId: string): Observable<CommentListRespDto> {
    return this.httpClient.get<CommentListRespDto>(
      `${this.baseUrl}/posts/${postId}/comments`
    );
  }
}
