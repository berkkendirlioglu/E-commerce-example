export interface CommentsType {
    status:string,
    data:{
        count:number,
        next:null | string | number,
        previous:null | string | number,
        results:{
            stars:string,
            comment:string,
            title:string,
            created_at:string,
            aroma:string,
            first_name:string,
            last_name:string,
        }[]
    }
}

export interface SubmitCommentType {
    stars:string,
    title:string,
    comment:string,
}

export interface CommentResponseType {
    status: string,
    data: {
        stars: string,
        title: string,
        comment: string,
    }
    reason?:string,
}