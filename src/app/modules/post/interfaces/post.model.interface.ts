import { Document } from 'mongoose';

export interface IPost extends Document {
  postNumber: string;
  title: string;
  content: string;
  author: string; // user id
}
