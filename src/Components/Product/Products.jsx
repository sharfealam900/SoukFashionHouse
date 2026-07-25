import React from 'react'
import ProductCard from './ProductCard';

export default function Products() {
    const products = [

        {
            id: 1,
            badge: "Bestseller",
            category: "Pashmina Shawl",
            name: "Rampur Paisley Wrap",
            oldPrice: 4999,
            price: 3499,
            image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=700"
        },

        {
            id: 2,
            badge: "New",
            category: "Embroidered Suit",
            name: "Noor Thread Work Set",
            price: 2799,
            image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=700"
        },

        {
            id: 3,
            category: "Silk Saree",
            name: "Zari Border Drape",
            price: 3199,
            image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700"
        },

        {
            id: 4,
            category: "Winter Shawl",
            name: "Kani Weave Stole",
            price: 1899,
            image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=700"
        },

        {
            id: 5,
            badge: "Bestseller",
            category: "Kurta Set",
            name: "Eidi Festive Two Piece",
            price: 2299,
            image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=700"
        },

        {
            id: 6,
            category: "Dupatta",
            name: "Tilla Embroidery Veil",
            price: 999,
            image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700"
        }

    ];

    return (
        <>
            <section className="products-section">

                <div className="container">

                    <div className="section-title">

                        <h2>This Week's Bestsellers</h2>

                        <p>

                            The most loved pieces from our latest collection.

                        </p>

                    </div>

                    <div className="row g-4">

                        {

                            products.map((item) => (

                                <div className="col-lg-4 col-md-6" key={item.id}>

                                    <ProductCard product={item} />

                                </div>

                            ))

                        }

                    </div>

                </div>

            </section>
        </>
    )
}
