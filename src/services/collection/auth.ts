import { BASE_URL, FetchWithAuth } from "../api-client";
import { isTokenExpired } from "../jwt-utils";
import {
  getRefreshToken,
  setAccessToken,
  setTokens,
} from "../storage";
import {
  LoginPayload,
  AuthResponse,
  RegisterPayload,
  UsersType,
  UpdateProfileType
} from "../../types/AccountType";
import { AllAddressType, CreateAddressResultType, AddressPayloadType } from "../../types/AddressType";
import { BasketProductsPayload, BasketProductType } from "../../types/ProductDetailType";
import { OrderToProductsPayload } from "../../types/PaymentTypes";
import { AllOrderTypes, OrderDetailsType } from "../../types/OrderTypes";
import { CommentResponseType, SubmitCommentType } from "../../types/CommentsType";

export async function register(data: RegisterPayload) {
  const response = await fetch(BASE_URL + "/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const registerJson = (await response.json()) as UsersType;

  return registerJson;
}

export async function login(data: LoginPayload) {
  const response = await fetch(BASE_URL + "/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const loginJson = (await response.json()) as AuthResponse;

  setTokens(
    loginJson.access_token,
    loginJson.refresh_token,
  );

  return loginJson;
}

export async function getMyProfile() {
  // access token süresi geçmedi ise access token ile fetch etmek istediğimiz data'yı çekiyoruz
  const response = await FetchWithAuth("/users/my-account", {
    method: "GET",
  });

  const userJson = (await response.json()) as UsersType;

  return userJson;
}

export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();

  if (!refreshToken || isTokenExpired(refreshToken)) {
    throw new Response(
      JSON.stringify("Refresh token is invalid"),
      { status: 401,statusText:"Refresh token is invalid", headers: { "Content-Type": "application/json" } }
    );
  }

  const response = await fetch(BASE_URL + "/auth/token/refresh", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
      "Content-Type": "application/json",
    },
  });

  const responseJson = (await response.json()) as {accessToken:string};

  setAccessToken(responseJson.accessToken)

  return responseJson;
}

export async function UpdateMyProfile(data:UpdateProfileType){
    const response = await FetchWithAuth("/users/my-account",{
    method:"PUT",
    body: JSON.stringify(data),
  })

  const responseJson = (await response.json()) as UsersType;

  return responseJson;
}

export async function CreateNewAddress(data:AddressPayloadType){
  const response = await FetchWithAuth("/users/addresses",{
    method:"POST",
    body:JSON.stringify(data),
  })

  const responseJson = await response.json() as CreateAddressResultType;

  return responseJson
}

export async function GetAllMyAddress() {
  const response = await FetchWithAuth("/users/addresses?limit=10&offset=0",{
    method:"GET",
  })

  const responseJson = await response.json() as AllAddressType;

  return responseJson
}

export async function DeleteMyAddress(addressId:string){
  const response = await FetchWithAuth(`/users/addresses/${addressId}`,{
    method:"DELETE"
  });

  const responseJson = await response.json() as {status:string, data:{}}

  return responseJson;
}

export async function EditMyAddress({data,addressId}:{data:AddressPayloadType; addressId:string}){
  const response = await FetchWithAuth(`/users/addresses/${addressId}`,{
    method:"PUT",
    body:JSON.stringify(data),
  })

  const responseJson = await response.json() as CreateAddressResultType;
  
  return responseJson;
}

export async function AddBasketToProduct(data:BasketProductsPayload){
  const response = await FetchWithAuth("/users/cart",{
    method:"POST",
    body:JSON.stringify(data)
  })
  const responseJson = await response.json() as {status:string,data:{}}

  return responseJson;
}

export async function GetMyBasket(){
  const response = await FetchWithAuth("/users/cart",{
    method:"GET"
  })

  const responseJson = await response.json() as BasketProductType

  return responseJson;
}

export async function DeleteToProductFromBasket(data:BasketProductsPayload) {
  const response = await FetchWithAuth("/users/cart",{
    method:"DELETE",
    body:JSON.stringify(data)
  })
  const responseJson = await response.json() as {status:string,data:{}}

  return responseJson;
}

export async function OrderToProducts(data:OrderToProductsPayload){
  const response = await FetchWithAuth("/orders/complete-shopping",{
    method:"POST",
    body:JSON.stringify(data)
  });

  const responseJson = await response.json() as {status:string,data:{ order_no:string}}

  return responseJson;
}

export async function GetMyAllOrder(){
  const response = await FetchWithAuth("/orders",{
    method:"GET"
  })

  const responseJson = await response.json() as AllOrderTypes;

  return responseJson;
}

export async function GetMyOrderDetails(order_id:string) {
  const response = await FetchWithAuth(`/orders/${order_id}`,{
    method:"GET"
  })

  const responseJson = await response.json() as OrderDetailsType

  return responseJson;
}

export async function ProductsComments(url:string){
  const response = await fetch(BASE_URL + url,{
    method:"GET",
    headers:{
      "Content-Type": "application/json",
    }
  })

  const responseJson = await response.json();

  return responseJson;
}

export async function AddNewComment(data:SubmitCommentType, slug:string){
  const response = await FetchWithAuth(`/products/${slug}/comments`,{
    method:"POST",
    body:JSON.stringify(data)
  });

  const responseJson = await response.json() as CommentResponseType;

  return responseJson;
}
