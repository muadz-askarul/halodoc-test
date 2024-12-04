export interface CommentEntities {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
  replies?: Array<CommentEntities>;
}

