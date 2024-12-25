interface ShippingMethodType {
    name:string,
    content:string,
}

export const shippingMethod:ShippingMethodType[] = [
    {
        name:"Kargo 1",
        content:"1-3 iş günü içinde teslim"
    },
    {
        name:"Kargo 2",
        content:"3-5 iş günü içinde teslim"
    },
    {
        name:"Kargo 3",
        content:"1 hafta içinde teslim"
    }
]