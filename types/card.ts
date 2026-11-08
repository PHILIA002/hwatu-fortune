
export type Card = {
  id: number;
  month: number;
  name: string;
  type: string;
  keyword: string;
  fortune: string;
};

export type SelectedCard = {
  position: number;
  card: Card;
};
