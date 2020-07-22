export interface Games{
  question:string;
  choices:Choices[];
}

  interface Choices{
    choice:number;
    text:string;
  }
