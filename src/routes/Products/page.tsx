import styles from './products.module.scss';
import {AllProductType, ProductCard , LoaderData, ProductInfo}  from '../index.ts';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { throttle } from 'lodash';
import { LoaderFunction, Params, useLoaderData, useParams } from 'react-router-dom';


const BASE_URL = "https://fe1111.projects.academy.onlyjs.com";

interface LoaderParams extends Params {
    mainCategory:string
}

export const fetchAllProducts: LoaderFunction = async ({params}) => {
  const {mainCategory} = params as LoaderParams;
  const response = await fetch(`${BASE_URL}/api/v1/products/?limit=12&offset=0${mainCategory === "all-products" ? "": mainCategory}`);
  if (!response.ok) {
    throw new Response('Data not found!', { status: response.status });
  }
  const data: AllProductType = await response.json();
  
  return {
    products: data.data.results,
    totalCount: data.data.count,
  };
};

export const Products = () => {
  const data = useLoaderData() as LoaderData;
  const { products, totalCount } = data;
  const [allProducts, setAllProducts] = useState<ProductInfo[]>(products);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [moreProducts, setMoreProducts] = useState<boolean>(true);
  const {mainCategory} = useParams();

  useEffect(() => {
    setAllProducts(products);
    setMoreProducts(true);
    setOffset(0);
  }, [mainCategory]);

  const handleScroll = useCallback(
    throttle(() => {
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 600) {
        if (moreProducts && !loading) {
          setOffset((prevOffset) => prevOffset + 1);
        }
      }
    }, 1000),
    [loading,moreProducts]
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const fetchMoreProducts = async () => {
      const limit = 12;
      const offSetNumber = offset * limit
      setLoading(true);
      try {
        const response = await axios.get<AllProductType>(`${BASE_URL}/api/v1/products/?limit=12&offset=${offSetNumber}${mainCategory === "all-products" ? "": mainCategory}`);
        const fetchedProducts = response.data.data.results;

        if(offset === 0){
          setAllProducts(products);
        }else{
          setAllProducts((prevProducts) => [...prevProducts, ...fetchedProducts]);
        }

        if (allProducts.length >= totalCount) {
          setMoreProducts(false);
        }
      } catch (error) {
        console.error("Ürünleri getirirken bir hata meydana geldi:", error);
      } finally {
        setLoading(false);
      }
    };

    if (moreProducts) {
      fetchMoreProducts();
    }
  }, [offset]);

  
  
  return (
    <div className={`${styles["all-product"]}`}>
      <div className={`${styles["all-product-container"]}`}>

          <div className={`${styles["all-product-header"]}`}>
            <h2 className={`${styles["header-text"]}`}>TÜM ÜRÜNLER</h2>
          </div>

          <ProductCard products={allProducts}/>

          {!moreProducts && loading && (
            <div className={`${styles["loading-wrapper"]}`}>
              <h3 className={`${styles["loading-text"]}`}>Loading...</h3>
            </div>
          )}


      </div>
    </div>
  )
}
