export interface FoodItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number; // For discount mock
  rating: number;
  sold: string;
  desc: string;
  category: "Lalapan" | "Penyet" | "Minuman" | "Cemilan";
  image: string;
  isTerlaris?: boolean;
  isAvailable?: boolean;
}

export const CATEGORIES = ["Semua", "Lalapan", "Penyet", "Minuman", "Cemilan"] as const;

export const FOOD_ITEMS: FoodItem[] = [
  {
    id: "lala-1",
    name: "Paket Lalapan Ayam Goreng Juara",
    price: 22000,
    originalPrice: 26000,
    rating: 4.9,
    sold: "500+",
    desc: "Ayam ungkep bumbu rempah garing + nasi pulen hangat + sambal korek bawang super pedas + lalapan segar lengkap (timun, kol, kemangi).",
    category: "Lalapan",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=500&q=80",
    isTerlaris: true,
  },
  {
    id: "lala-2",
    name: "Paket Lalapan Lele Kriuk (Isi 2)",
    price: 18000,
    rating: 4.8,
    sold: "300+",
    desc: "Dua ekor lele goreng ketumbar super garing bebas amis + nasi hangat + sambal tomat segar + lalapan kol & timun.",
    category: "Lalapan",
    image: "https://images.unsplash.com/photo-1580442151529-343f2f5e0e27?auto=format&fit=crop&w=500&q=80",
    isTerlaris: true,
    isAvailable: false,
  },
  {
    id: "lala-3",
    name: "Paket Lalapan Bebek Goreng Empuk",
    price: 32000,
    originalPrice: 35000,
    rating: 4.9,
    sold: "150+",
    desc: "Bebek bumbu kuning empuk meresap dengan taburan kremesan gurih + nasi + sambal korek khas Cak Bud + lalap kemangi.",
    category: "Lalapan",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80",
    isTerlaris: true,
  },
  {
    id: "penyet-1",
    name: "Ayam Penyet Sambal Ijo",
    price: 20000,
    rating: 4.7,
    sold: "200+",
    desc: "Ayam goreng garing yang dipenyet dengan ulekan sambal cabai hijau khas Padang yang pedas-segar + tahu tempe.",
    category: "Penyet",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "penyet-2",
    name: "Tahu Tempe Penyet Kemangi",
    price: 12000,
    rating: 4.6,
    sold: "120+",
    desc: "Tahu & tempe goreng gurih dipenyet di cobek dengan sambal terasi matang dan aroma daun kemangi segar yang harum.",
    category: "Penyet",
    image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "penyet-3",
    name: "Bakso Goreng Penyet Pedas",
    price: 15000,
    rating: 4.7,
    sold: "90+",
    desc: "Bakso sapi goreng renyah dipenyet kasar bersama sambal korek super pedas yang menggugah selera makan.",
    category: "Penyet",
    image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=500&q=80",
    isAvailable: false,
  },
  {
    id: "minum-1",
    name: "Es Dawet Ayu Gula Merah",
    price: 10000,
    rating: 4.8,
    sold: "250+",
    desc: "Dawet kenyal segar dengan santan gurih melimpah, siraman gula merah asli yang pekat, dan serutan es batu dingin.",
    category: "Minuman",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80",
    isTerlaris: true,
  },
  {
    id: "minum-2",
    name: "Es Jeruk Peras Murni",
    price: 8000,
    rating: 4.7,
    sold: "180+",
    desc: "Perasan jeruk manis lokal segar disajikan dingin dengan es batu, manisnya pas dan pelepas dahaga instan.",
    category: "Minuman",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80",
    isAvailable: false,
  },
  {
    id: "minum-3",
    name: "Es Teh Manis Jasmine",
    price: 5000,
    rating: 4.9,
    sold: "1000+",
    desc: "Seduhan teh wangi melati berkualitas khas Jawa Tengah dengan gula pasir murni dan es batu melimpah.",
    category: "Minuman",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "cemilan-1",
    name: "Mendoan Panas Sambal Kecap (Isi 4)",
    price: 12000,
    rating: 4.8,
    sold: "400+",
    desc: "Tempe mendoan lebar goreng setengah matang bertabur irisan daun bawang, disajikan panas dengan cocolan sambal kecap pedas.",
    category: "Cemilan",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "cemilan-2",
    name: "Pisang Goreng Pasir Keju",
    price: 14000,
    rating: 4.7,
    sold: "130+",
    desc: "Pisang kepok manis digoreng tepung roti renyah luar lembut dalam, diberi topping parutan keju cheddar melimpah dan susu kental manis.",
    category: "Cemilan",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80",
  }
];
