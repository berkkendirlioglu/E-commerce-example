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

export interface DummyCommentsType {
    date:string,
    title:string,
    desc:string,
    owner:string,
    product:string,
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

export interface CommentsStatisticsType {
    status:string,
    data:{
        rate_count:number,
        one_star_count:number
        two_star_count:number,
        three_star_count:number,
        four_star_count:number,
        five_star_count:number,
        average_star:number,
    }
}