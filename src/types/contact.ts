
export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  isFavorite: boolean;
  avatarUrl?: string;
  lastContacted?: string;
  createdAt: string;
  updatedAt: string;
}
