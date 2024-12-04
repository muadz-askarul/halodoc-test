import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { forkJoin, map, Subject, switchMap, takeUntil } from 'rxjs';
import { PostDetailRespDto } from '../../models/dtos/post-detail-resp.dto';
import { ApiService } from '../../service/api.service';
import { CommentListRespDto } from '../../models/dtos/comment-resp.dto';
import { UserRespDto } from '../../models/dtos/user-resp.dto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail',
  imports: [RouterModule, FormsModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
  providers: [ApiService],
})
export class DetailComponent {
  activatedRoute = inject(ActivatedRoute);
  apiService = inject(ApiService);

  postId = signal('');
  postData = signal<PostDetailRespDto | undefined>(undefined);
  userData = signal<UserRespDto | undefined>(undefined);
  commentList = signal<CommentListRespDto>([]);

  commentParentId: undefined | number = undefined;
  commentString = '';

  destroyed$: Subject<void> = new Subject();

  constructor() {
    this.activatedRoute.params
      .pipe(
        takeUntil(this.destroyed$),
        map((res: Params) => res['id'])
      )
      .subscribe((res) => this.postId.set(res));

    effect(() => {
      forkJoin({
        postData: this.apiService.findPostById(this.postId()),
        commentData: this.apiService.findPostComments(this.postId()),
      })
        .pipe(takeUntil(this.destroyed$))
        .subscribe(({ postData, commentData }) => {
          this.postData.set(postData);
          this.commentList.set(commentData);
        });
    });

    effect(() => {
      const userId = this.postData()?.userId;
      if (!!userId) {
        this.apiService
          .findUserById(userId)
          .pipe(takeUntil(this.destroyed$))
          .subscribe((res) => {
            this.userData.set(res);
          });
      }
    });
  }

  setCommentParent(id: number) {
    this.commentParentId = id;
  }

  addComment(str: string) {
    const lastComment = this.commentList()[this.commentList().length - 1];
    const newComment = {
      id: lastComment.id + 1,
      body: str,
      postId: Number(this.postId()),
      email: 'someEmail@mail.com',
      name: 'mr random',
      replies: [],
    };
    if (!this.commentParentId) {
      this.commentList.update((val) => [...val, newComment]);
      this.commentString = '';
      return;
    }
    const _comments = structuredClone(this.commentList());
    const found = _comments.find((c) => c.id === this.commentParentId);
    if (found) {
      if (!found?.replies) {
        found.replies = [newComment];
      } else {
        found.replies = [...found.replies, newComment];
      }
    }
    this.commentList.set(_comments);
    this.commentParentId = undefined;
    this.commentString = '';
  }
}
