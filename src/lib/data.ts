// ============================================================
// Central data layer — all hardcoded data lives here
// ============================================================

// ─── Products ────────────────────────────────────────────────

export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  images: string[];
  category: string;
  colors?: string[];
  material?: string;
  sale?: boolean;
  description?: string;
  specifications?: Record<string, string>;
}

export const allProducts: Product[] = [
  {
    id: 1,
    name: 'Heidi 48" გაშლადი მაგიდა - კაკლის ხე',
    price: 699,
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    ],
    category: 'სასადილო ოთახი',
    colors: ['#8B5A2B', '#D2B48C'],
    material: 'ხე',
    sale: false,
    description:
      'Heidi სასადილო მაგიდა დამზადებულია მაღალი ხარისხის კაკლის ხისგან. გაშლადი კონსტრუქცია საშუალებას გაძლევთ მოარგოთ სივრცე ნებისმიერ შეკრებას. კლასიკური ხაზები ნებისმიერ ინტერიერში ჰარმონიულად ჩაჯდება.',
    specifications: {
      'სიგრძე (დახურული)': '122 სმ',
      'სიგრძე (გაშლილი)': '168 სმ',
      'სიგანე': '80 სმ',
      'სიმაღლე': '76 სმ',
      'მასალა': 'კაკლის ხე',
      'მწარმოებელი ქვეყანა': 'ევროპა',
    },
  },
  {
    id: 2,
    name: 'Nosh სკამი - მწვანე',
    price: 149,
    oldPrice: 199,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1550254478-ead40cc54513?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    ],
    category: 'სასადილო ოთახი',
    colors: ['#556B2F', '#D3D3D3', '#778899', '#8B0000'],
    material: 'ქსოვილი',
    sale: true,
    description:
      'Nosh სკამი — სტილური და კომფორტული სასადილო სკამი, ხელმისაწვდომი სხვადასხვა ფერში. ლითონის კარკასი და რბილი ქსოვილის ზედაპირი კომფორტსა და გამძლეობას უზრუნველყოფს.',
    specifications: {
      'სიმაღლე': '82 სმ',
      'სიგანე': '48 სმ',
      'სიღრმე': '52 სმ',
      'დასაჯდომი სიმაღლე': '46 სმ',
      'მასალა': 'ქსოვილი',
      'კარკასი': 'ლითონი',
    },
  },
  {
    id: 3,
    name: 'Timber ტყავის დივანი',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    ],
    category: 'მისაღები ოთახი',
    colors: ['#D2B48C', '#8B4513', '#2F4F4F'],
    material: 'ტყავი',
    sale: false,
    description:
      'Timber — კლასიკური სტილის ტყავის დივანი, კომფორტისა და ელეგანტურობის სრულყოფილი შეხამება. ბუნებრივი ტყავი წლების განმავლობაში ინარჩუნებს სილამაზეს.',
    specifications: {
      'სიგრძე': '220 სმ',
      'სიღრმე': '90 სმ',
      'სიმაღლე': '78 სმ',
      'დასაჯდომი სიმაღლე': '44 სმ',
      'მასალა': 'ბუნებრივი ტყავი',
      'ფეხები': 'მასიური ხე',
      'მწარმოებელი ქვეყანა': 'იტალია',
    },
  },
  {
    id: 4,
    name: 'Leap შავი სანათი',
    price: 79,
    oldPrice: 99,
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80',
    ],
    category: 'განათება',
    colors: ['#000000', '#FFDF00'],
    material: 'ლითონი',
    sale: true,
    description:
      'Leap — მინიმალისტური დიზაინის რეგულირებადი სამაგიდე სანათი. LED ტექნოლოგია ენერგოეფექტურ განათებას უზრუნველყოფს.',
    specifications: {
      'სიმაღლე': '45 სმ',
      'სიგანე': '20 სმ',
      'სიმძლავრე': '10W LED',
      'მასალა': 'ლითონი',
      'ელ. კვება': '220V',
    },
  },
  {
    id: 5,
    name: 'Oscuro 72" კომოდი',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1530018607912-eff2df114fbe?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1530018607912-eff2df114fbe?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    ],
    category: 'მისაღები ოთახი',
    colors: ['#3E2723', '#4E342E'],
    material: 'ხე',
    sale: false,
    description:
      'Oscuro — ფართო შესანახი სივრცის მქონე კომოდი ელეგანტური გარეგნობით. 6 დიდი უჯრა ნივთების მოწესრიგებისთვის.',
    specifications: {
      'სიგრძე': '183 სმ',
      'სიღრმე': '45 სმ',
      'სიმაღლე': '60 სმ',
      'უჯრები': '6',
      'მასალა': 'MDF + ბუნებრივი ხე',
    },
  },
  {
    id: 6,
    name: 'Ceni ნაცრისფერი სავარძელი',
    price: 449,
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1550254478-ead40cc54513?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    ],
    category: 'მისაღები ოთახი',
    colors: ['#708090', '#F5DEB3', '#B0C4DE'],
    material: 'ქსოვილი',
    sale: false,
    description:
      'Ceni — სუფთა ხაზების კომფორტული სავარძელი ნებისმიერი სივრცისთვის. მაღალი ხარისხის ქსოვილი ადვილად იწმინდება.',
    specifications: {
      'სიმაღლე': '80 სმ',
      'სიგანე': '76 სმ',
      'სიღრმე': '80 სმ',
      'დასაჯდომი სიმაღლე': '44 სმ',
      'მასალა': 'ქსოვილი',
      'კარკასი': 'ხე',
    },
  },
];

export function getAllProducts(): Product[] {
  return allProducts;
}

export function getProductById(id: string | number): Product {
  return allProducts.find((p) => p.id === Number(id)) ?? allProducts[0];
}

// ─── Services ────────────────────────────────────────────────

export interface Service {
  id: number;
  title: string;
  desc: string;
  fullDesc: string;
  image: string;
  features: string[];
}

export const allServices: Service[] = [
  {
    id: 1,
    title: 'ინტერიერის დიზაინი',
    desc: 'პროფესიონალური დიზაინ-პროექტის მომზადება თქვენი სახლისთვის ან ოფისისთვის.',
    fullDesc:
      'ჩვენი ინტერიერის დიზაინის გუნდი დაგეხმარებათ თქვენი ოცნების სივრცის რეალობად ქცევაში. ჩვენ ვქმნით ფუნქციურ, კომფორტულ და ესთეტიურად მიმზიდველ გარემოს, რომელიც ზუსტად ერგება თქვენს მოთხოვნებსა და ცხოვრების სტილს. თითოეული პროექტი უნიკალურია და ეფუძნება დამკვეთის ინდივიდუალურ ხედვას.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    features: [
      'სივრცის გეგმარება და ზონირება',
      '3D რენდერები და ვიზუალიზაცია',
      'ავეჯისა და დეკორის შერჩევა',
      'ელექტროობის და სანტექნიკის ნახაზები',
      'მასალების სპეციფიკაცია',
    ],
  },
  {
    id: 2,
    title: 'ავეჯის დამზადება',
    desc: 'ინდივიდუალური შეკვეთით ავეჯის დამზადება უმაღლესი ხარისხის მასალებით.',
    fullDesc:
      'ჩვენ ვამზადებთ ნებისმიერი სირთულისა და დიზაინის ავეჯს ინდივიდუალური შეკვეთით. ჩვენი საწარმო აღჭურვილია თანამედროვე დანადგარებით, რაც საშუალებას გვაძლევს მივაღწიოთ იდეალურ ხარისხს. ვიყენებთ მხოლოდ ეკოლოგიურად სუფთა და სერტიფიცირებულ მასალებს წამყვანი ევროპული ბრენდებისგან.',
    image: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=800&q=80',
    features: [
      'სამზარეულოს ავეჯი',
      'საძინებლის კომპლექტები',
      'ჩაშენებული კარადები და გარდერობები',
      'აბაზანის ავეჯი',
      'საოფისე ავეჯი',
    ],
  },
  {
    id: 3,
    title: 'განათების დაგეგმარება',
    desc: 'სწორი განათების შერჩევა და მონტაჟი იდეალური ატმოსფეროს შესაქმნელად.',
    fullDesc:
      'განათება ერთ-ერთი ყველაზე მნიშვნელოვანი ელემენტია ინტერიერში. ჩვენი სპეციალისტები შეიმუშავებენ განათების კომპლექსურ სცენარს, რომელიც იქნება როგორც ფუნქციური, ასევე ემოციურად დატვირთული. ჩვენ ვთანამშრომლობთ საუკეთესო სანათების მწარმოებლებთან ევროპიდან.',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
    features: [
      'განათების პროექტის შედგენა',
      'სანათების შერჩევა-კომპლექტაცია',
      'სიმძლავრეების გაანგარიშება',
      'ჭკვიანი სახლის სტანდარტებთან ინტეგრაცია',
      'სამონტაჟო სამუშაოების ზედამხედველობა',
    ],
  },
  {
    id: 4,
    title: 'რემონტი და ზედამხედველობა',
    desc: 'სრული სარემონტო სამუშაოების მართვა და ხარისხის კონტროლი.',
    fullDesc:
      'გთავაზობთ სრულ სარემონტო მომსახურებას "გასაღების ჩაბარებით". ჩვენი გამოცდილი ოსტატების გუნდი შეასრულებს ნებისმიერი ტიპის სარემონტო სამუშაოს უმაღლესი სტანდარტების დაცვით. პროექტის მენეჯერი მუდმივად გაკონტროლებთ ხარისხს და ვადებს.',
    image: 'https://images.unsplash.com/photo-1503387762-592dee58c460?auto=format&fit=crop&w=800&q=80',
    features: [
      'დემონტაჟი და შავი კარკასის სამუშაოები',
      'ელექტროობა და სანტექნიკა',
      'სამალიარო და მოსაპირკეთებელი სამუშაოები',
      'მასალების შესყიდვა და ტრანსპორტირება',
      'ყოველკვირეული რეპორტინგი დამკვეთთან',
    ],
  },
];

export function getAllServices(): Service[] {
  return allServices;
}

export function getServiceById(id: string | number): Service {
  return allServices.find((s) => s.id === Number(id)) ?? allServices[0];
}

// ─── Projects ────────────────────────────────────────────────

export interface Project {
  id: number;
  title: string;
  location: string;
  year: string;
  category: string;
  area: string;
  duration: string;
  client: string;
  desc: string;
  image: string;
  images: string[];
}

export const allProjects: Project[] = [
  {
    id: 1,
    title: 'თანამედროვე აპარტამენტი ვაკეში',
    location: 'თბილისი, ვაკე',
    year: '2025',
    category: 'საცხოვრებელი',
    area: '145 კვ.მ',
    duration: '4 თვე',
    client: 'კერძო პირი',
    desc: 'ამ პროექტის მთავარი გამოწვევა იყო სივრცის მაქსიმალური ათვისება და ბუნებრივი განათების შენარჩუნება. გამოვიყენეთ თბილი ფერები, ბუნებრივი ხე და მინიმალისტური ავეჯი. შედეგად მივიღეთ მყუდრო, თანამედროვე და ძალიან ფუნქციური აპარტამენტი. სმარტ სახლის სისტემა ინტეგრირებულია ყველა ოთახში.',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1920&q=80',
    ],
  },
  {
    id: 2,
    title: "ოფისი 'Tech Hub'",
    location: 'ბათუმი, ცენტრი',
    year: '2024',
    category: 'კომერციული',
    area: '420 კვ.მ',
    duration: '6 თვე',
    client: 'IT კომპანია',
    desc: "Tech Hub-ის ოფისი დაპროექტდა როგორც ღია ტიპის (Open Space) სამუშაო სივრცე, რომელიც ხელს უწყობს თანამშრომლობასა და კრეატიულობას. ინტერიერში დომინირებს ინდუსტრიული სტილი ბიოფილურ ელემენტებთან ერთად.",
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1920&q=80',
    ],
  },
  {
    id: 3,
    title: 'ვილა საგურამოში',
    location: 'მცხეთა, საგურამო',
    year: '2025',
    category: 'საცხოვრებელი',
    area: '350 კვ.მ',
    duration: '10 თვე',
    client: 'კერძო პირი',
    desc: 'ორსართულიანი ვილა საგურამოში, ულამაზესი ხედებით. პროექტი მოიცავდა როგორც ინტერიერის, ასევე ექსტერიერისა და ლანდშაფტის დიზაინს. გამოყენებულია უმაღლესი ხარისხის ბუნებრივი მასალები: ქვა, მარმარილო, მასიური ხე.',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80',
    ],
  },
  {
    id: 4,
    title: "რესტორანი 'Gusto'",
    location: 'თბილისი, ძველი თბილისი',
    year: '2024',
    category: 'კომერციული',
    area: '280 კვ.მ',
    duration: '5 თვე',
    client: 'HoReCa Group',
    desc: "Gusto არის იტალიური რესტორანი ძველ თბილისში, რომლის ინტერიერიც აერთიანებს რეტრო და თანამედროვე ელემენტებს. დაცული იქნა ისტორიული შენობის ავთენტურობა, აღდგა ძველი აგურის კედლები.",
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=80',
    ],
  },
];

// ─── Blogs ───────────────────────────────────────────────────

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  author: string;
  slug: string;
}

export const allBlogs: BlogPost[] = [
  {
    id: 1,
    title: '2026 წლის ინტერიერის ტენდენციები',
    excerpt: 'აღმოაჩინეთ ფერები, მასალები და ფორმები, რომლებიც წელს თქვენს სახლს განსაკუთრებულს გახდის.',
    date: '24 თებერვალი, 2026',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
    author: 'მარიამ ბერიძე',
    slug: 'interior-trends-2026',
  },
  {
    id: 2,
    title: 'როგორ შევარჩიოთ სწორი განათება',
    excerpt: 'განათება ინტერიერის სულია. შეიტყვეთ, როგორ შექმნათ იდეალური ატმოსფერო ყველა ოთახში.',
    date: '15 თებერვალი, 2026',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
    author: 'გიორგი კაპანაძე',
    slug: 'how-to-choose-lighting',
  },
  {
    id: 3,
    title: 'მინიმალისტური დიზაინის უპირატესობები',
    excerpt: 'ნაკლები მეტია — რატომ ირჩევენ თანამედროვე ადამიანები სიმარტივეს და ფუნქციურობას.',
    date: '05 თებერვალი, 2026',
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80',
    author: 'ელენე გაბუნია',
    slug: 'minimalist-design-benefits',
  },
];

// ─── Categories ──────────────────────────────────────────────

export interface Category {
  id: number;
  name: string;
  image: string;
  link: string;
}

export const homeCategories: Category[] = [
  {
    id: 1,
    name: 'მისაღები ოთახი',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    link: '/products/living-room',
  },
  {
    id: 2,
    name: 'განათება',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
    link: '/products/lighting',
  },
  {
    id: 3,
    name: 'სასადილო ოთახი',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80',
    link: '/products/dining-room',
  },
  {
    id: 4,
    name: 'საძინებელი',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&w=800&q=80',
    link: '/products/bedroom',
  },
];

export function getAllProjects(): Project[] {
  return allProjects;
}

export function getProjectById(id: string | number): Project {
  return allProjects.find((p) => p.id === Number(id)) ?? allProjects[0];
}

export function getAllBlogs(): BlogPost[] {
  return allBlogs;
}

export function getHomeCategories(): Category[] {
  return homeCategories;
}
