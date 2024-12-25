import { FooterMenuType } from "../routes/index.ts";
import LOGO_Beyaz from '../assets/images/LOGO_Beyaz.png';

const FooterMenu: FooterMenuType[] = [
    {
        resTitle:"OJS Nutrition",
        title:LOGO_Beyaz,
        links:[
            {link:"iletişim", href:"/contact"},
            {link:"hakkımızda", href:"/about"},
            {link:"sıkça sorulan sorular", href:"/SSS"},
            {link:"KVKK", href:"/"},
            {link:"çalışma ilkelerimiz", href:"/"},
            {link:"satış sözleşmesi", href:"/"},
            {link:"garanti ve iade koşulları", href:"/"},
            {link:"gerçek müşteri yorumları", href:"/"},
            {link:"blog", href:"/"},
        ]
    },
    {
        resTitle:"kategoriler",
        title:"kategoriler",
        links:[
            {link:"protein", href:"/"},
            {link:"spor gıdaları", href:"/"},
            {link:"sağlık", href:"/"},
            {link:"gıda", href:"/"},
            {link:"vitamin", href:"/"},
            {link:"aksesuar", href:"/"},
            {link:"tüm ürünler", href:"/"},
            {link:"paketler", href:"/"},
            {link:"lansmana özel fırsatlar", href:"/"},
        ]
    },
    {
        resTitle:"popüler ürünler",
        title:"popüler ürünler",
        links:[
            {link:"whey protein", href:"/"},
            {link:"cream of rice", href:"/"},
            {link:"creatine", href:"/"},
            {link:"BCAA+", href:"/"},
            {link:"pre-Workout", href:"/"},
            {link:"fitness paketi", href:"/"},
            {link:"collagen", href:"/"},
            {link:"günlük vitamin paketi", href:"/"},
            {link:"ZMA", href:"/"},
        ]
    }
];


export default FooterMenu;