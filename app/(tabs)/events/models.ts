// Model for Category - represents the structure of an event category with type safety
export type Category = {
  id: string;
  name: string;
};

// Model for Event - represents the structure of an event with type safety
export type Event = {
  title: string;
  description: string;
  location: string;
  date: string;
  categoryId: string;
  imageUrl: string;
  imageDescription: string;
};
