export type Category = {
  id: string;
  name: string;
};

export type Event = {
  title: string;
  description: string;
  location: string;
  date: string;
  categoryId: string;
  imageUrl: string;
  imageDescription: string;
};
