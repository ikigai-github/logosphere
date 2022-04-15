import { Query } from "@nestjs/common";
import { Address } from "cluster";

const SELECT_COMMANDS = new Set(['select', 'selectOne', 'selectDistinct']);

class Builder {
  constructor(private selectKey: string, private filterKey: string);
}

export interface FlureeEntity {
  _id: string;
}

export interface Address extends FlureeEntity {
  line1: string;
  line2: string;
  country: string;
}

export interface Movie extends FlureeEntity {
  id: string,
  title: string
  Actors: Person[] | string[]
}

export interface Person extends FlureeEntity {
  name: string;
  Address: Address | string;
  movies: Movie[] | string[];
}


// Not sure if we can get here but ideally something like
query.select<User>('*').crawl('address', 'movies');
query.select<User>('*')
  .crawl<Address>('*')
    .crawl()

query.select<User>('*').crawl<Address>('address').crawl<Movie[]>;

const result = {
  _id: "k32j42",
  name: "Mr. Name",
  address: {
    line1: "abc",
    line2: "asd",
  }
}
