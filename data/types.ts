// data/types.ts
export type PopupBody = { heading: string; text: string };

// กรอบลิสต์ในโมดัล
export type PopupSection = {
  title: string;
  items: ReadonlyArray<string>; // << เปลี่ยนเป็น ReadonlyArray
};

export type CatalogItem = {
  title: string;
  summary: string;
  cover: string;
  website?: string;
  facebook?: string;

  // ทั้งหมดเปลี่ยนเป็น ReadonlyArray
  samples?: ReadonlyArray<string>;
  tags?: ReadonlyArray<string>;

  popup: {
    intro?: string;
    body?: ReadonlyArray<PopupBody>;          // เดิม: PopupBody[]
    sections?: ReadonlyArray<PopupSection>;   // เดิม: PopupSection[]
    metrics?: ReadonlyArray<string>;          // เดิม: string[]
  };
};
