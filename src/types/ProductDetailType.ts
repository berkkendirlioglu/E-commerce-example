export default interface ProductDetailType{
    status:string,
    data:{
        id:string,
        name:string,
        slug:string,
        short_explanation:string,
        explanation:{
            usage:string,
            features:string,
            description:string,
            nutritional_content:{
                ingredients:{
                    aroma:string,
                    value:string,
                }[],
                nutrition_facts:{
                    ingredients:{
                        name:string,
                        amounts:string[],
                    }[],
                    portion_sizes:string[],
                },
                amino_acid_facts:{
                    ingredients:{
                        name:string,
                        amounts:string[],
                    }[],
                    portion_sizes:string[],
                },
            },
        },
        main_category_id:string,
        sub_category_id:string,
        tags:string[],
        variants:VariantsType[],
        comment_count:number,
        average_star:number | string,
    }
}

export interface VariantsType {
    id:string,
    name?:string,
    count?:number,
    size:{
        gram:number,
        pieces:number,
        total_services:number,
    },
    aroma:string,
    price:{
        profit:null | number,
        total_price:number,
        discounted_price:null | number,
        price_per_servings:number,
        discount_percentage:null | number,
    },
    photo_src:string,
    is_available:boolean,
}

export interface SizeType {
    gram: number;
    pieces: number;
    total_services: number;
}