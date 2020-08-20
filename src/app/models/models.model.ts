export interface User {
    id: string;
    photo: string;
    name: string; 
    lastname: string;   
    password: string;
    credit: number;
    address: string;  
    email: string;   
    phonenumber: string;
    role: string;
    token: string;
}

export interface Dolar{
    value: number;
    
}

export interface Product{
    id: string;
    img: string;
    name: string;   
    price: number;
    amount: number;  
    
}

export interface Category{
    name: string,
    description: string,
    img: string,
    product: [{
      
        img: string;
        name: string;
        category: string;
        price: number;
        amount: number;         
    }]      
}

export interface Chat{
    id: string;
    chatrole: any;
    creatorid: any;
    creatorname: any;
    creatorphoto: any;
    userid: any;    
    username: any;
    userphoto: any;         
    message: [
        {
            content: string;
            date: Date;            
            sender: string;
        }
    ]
}

export interface Message {
    content: string;
    sender: string;
    date: number;    
}