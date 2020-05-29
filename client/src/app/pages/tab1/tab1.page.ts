import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';
import { Post } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  posts: Post[] = [];
  infiniteScrollHabilitado: boolean = true;

  constructor(private postsService: PostsService) {}

  ngOnInit() {
    this.getPosts();

    this.postsService.nuevoPost.subscribe((res: Post) => {
      this.posts.unshift(res);
    });
  }

  siguientes(evento: any) {
    this.getPosts(evento);
  }

  private getPosts(evento?: any, pull: boolean = false) {
    this.postsService.getPosts(pull).subscribe((resp) => {
      this.posts.push(...resp.posts);

      if (evento) {
        evento.target.complete();

        if (resp.posts.length === 0) {
          this.infiniteScrollHabilitado = false;
        }
      }
    });
  }

  recargar(evento: any) {
    this.posts = [];
    this.infiniteScrollHabilitado = true;
    this.getPosts(evento, true);
  }
}
