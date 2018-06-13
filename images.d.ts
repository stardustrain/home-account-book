declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.json' {
  const value: any;
  export default value;
}
declare module 'lodash'
declare module 'uuid'
declare module 'numeral'
interface Window {
  gapi: any;
}

interface IAccount {
  id: string,
  timeStamp: number,
  incomeBalance: number | string,
  expenseBalance: number | string,
  restBalance: number | string,
  category?: string,
}
