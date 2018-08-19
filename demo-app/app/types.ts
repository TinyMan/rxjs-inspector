export interface IPerson {
  firstname: string;
  lastname: string;
  birth: Date;
  gender: 'm' | 'f';
}

export const names = [
  'Loralee Hiney',
  'Darlene Lafromboise',
  'Venus Borton',
  'Felton Redman',
  'Angeles Sandford',
  'Candis Minogue',
  'Mikki Hadfield',
  'Werner Wilkie',
  'Alethea Corrales',
  'John Kapoor',
  'Deandrea Ries',
  'Tiana Morrissey',
  'Juliann Condron',
  'Berry Hier',
  'Kaycee Vause',
  'Mollie Waldman',
  'Mavis Midgette',
  'Candance Amburgey',
  'Nicol Greening',
  'Hilma Hyder',
  'Julene Saulters',
  'Duane Cathcart',
  'Faye Tuthill',
  'Rosaria Wingham',
  'Joyce Alicea',
  'Angelia Adler',
  'Bess Hatfield',
  'Alaine Sidney',
  'Nicolasa Callahan',
  'Gidget Dunnington',
  'Maricela Stefanik',
  'Bong Palomares',
  'Wynell Favors',
  'Joanie Resto',
  'Elois Urban',
  'Lorette Varela',
  'Roxie Wismer',
  'Brunilda Herrington',
  'Francene Ditzler',
  'Sina Carleton',
  'Khadijah Malo',
  'Lore Cromley',
  'Viola Woodyard',
  'Brent Stogsdill',
  'Gregorio Vitello',
  'Lael Rumsey',
  'Norberto Hathcock',
  'Emery Parshall',
  'Kamilah Streich',
  'Patti Hiatt',
];

export function rand(max = 1, min = 0) {
  return Math.random() * (max - min) + min;
}
export function randInt(max = 1, min = 0) {
  return Math.floor(rand(max, min));
}
export class Person implements IPerson {
  public gender: 'm' | 'f' = rand() < 0.5 ? 'm' : 'f';
  public firstname = names[randInt(names.length)].split(' ')[0];
  public lastname = names[randInt(names.length)].split(' ')[1];

  constructor(
    public birth = new Date(randInt(2010, 1950), randInt(12), randInt(28))
  ) {}
}

export class Child extends Person {
  constructor() {
    super(new Date(randInt(2015, 1990), randInt(12), randInt(28)));
  }
}
export class Parent extends Person {
  public children: IPerson[];
  constructor() {
    super(new Date(randInt(1990, 1950), randInt(12), randInt(28)));
    this.children = Array.from({ length: randInt(4, 1) }, () => new Child());
  }
}
