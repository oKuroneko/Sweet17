export interface PhotoSlide {
  id: number;
  url: string;
  caption: string;
  date?: string;
  category: string;
}

export interface WishCard {
  id: number;
  text: string;
  author: string;
}
