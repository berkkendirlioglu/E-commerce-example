export interface CategoriesType{
    status:string,
    data:{
      data:{
        id:string,
        name:string,
        slug:string,
        order:number,
        children:{
          id:string,
          name:string,
          slug:string,
          order:number,
          sub_children:{
            name:string,
            slug:string,
            order:number,
          }[],
        }[],
        top_sellers:{
          name:string,
          slug:string,
          description:string,
          picture_src:string,
        }[],
      }[]
    }
  }