import {
  Component,
  computed,
  inject,
  model,
  OnDestroy,
  signal,
} from '@angular/core';
import { PostListRespDto } from '../../models/dtos/post-list-resp.dto';
import { ApiService } from '../../service/api.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list',
  imports: [RouterModule, FormsModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  providers: [ApiService],
})
export class ListComponent implements OnDestroy {
  apiService = inject(ApiService);

  items = signal<PostListRespDto>([]);
  search = model('');
  isLoading = signal(false);

  destroyed$: Subject<void> = new Subject();

  filteredItems = computed(() => {
    if (!this.search().length) return this.items();
    return this.items().filter((item) => item.title.includes(this.search()));
  });

  constructor() {
    this.apiService
      .findAllPost()
      .pipe(
        takeUntil(this.destroyed$),
        tap(() => this.isLoading.set(true))
      )
      .subscribe({
        next: (res) => {
          this.items.set(res);
        },
        complete: () => this.isLoading.set(false),
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }
}
