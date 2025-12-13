import type React from 'react';

export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: React.ElementType;
}


