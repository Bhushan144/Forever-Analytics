import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const RelatedProducts = ({ category, subCategory }) => {

    let { products } = useContext(ShopContext);
    let [related, setRelated] = useState([]);

    useEffect(() => {

        if (products.length > 0) {
            let productsCopy = products.slice();

            productsCopy = productsCopy.filter((item) => {
                if (category === item.category) {
                    return true;
                } else {
                    return false;
                }
            })

            productsCopy = productsCopy.filter((item) => {
                if (subCategory === item.subCategory) {
                    return true;
                } else {
                    return false;
                }
            })

            setRelated(productsCopy.slice(0,5));
            
        }
    }, [products])

    return (
        <>
            {/* Related products section */}
            <div className="mt-18 flex flex-col justify-center">
                <div className="">
                    <Title title1={"Related"} title2={"Products"} />
                </div>
                <div className="mt-5 gap-4 grid grid-cols-2 sm:grid-col-3 md:grid-col-4 lg:grid-cols-5">
                    {
                        related.map((item,index)=>{
                            return <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price}/>
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default RelatedProducts
