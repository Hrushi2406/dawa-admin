export interface Variant {
  name: string;
  dosage: string;
  quantity: number;
}

export interface IMedicine {
  id: string;
  name: string;
  slug: string[];
  meta: any;
  brand: string;
  dosage: string;
  stock: number;
  quantity: number;
  price: number;
  description: string;
  expiryDate: Date;
  sideEffects: string;
  indication: string;
  category: string;
  tabCount: number;
  images: string[]; // Array of image URLs
  prescriptionRequired: boolean;
}

export interface IOrder {
  orderId: string;
  customerName: string;
  customerAddress: string;
  medicines: IMedicine[];
  orderDate: Date;
  deliveryTime: number; // in minutes
  status: "pending" | "confirmed" | "delivered" | "cancelled";
  prescriptionRequired: boolean; // Indicates if prescription is required for the order
}
