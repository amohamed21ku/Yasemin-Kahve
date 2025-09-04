import React, { useState } from 'react'
import Header from '../HomePage/components/Header'
import Footer from '../HomePage/components/Footer'
import ProductsHero from './components/ProductsHero'
import CategoryTabs from './components/CategoryTabs'
import ProductsGrid from './components/ProductsGrid'
import FeaturesSection from './components/FeaturesSection'
import EducationCTA from './components/EducationCTA'
import { useTranslation } from '../../useTranslation'
import './Products.css'

const Products = ({ onNavigate }) => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('All');

  // All products from ProductsPreview plus Ethiopian coffee
  const allProducts = [
    {
      id: 1,
      name: "COLOMBIAN 18",
      origin: "Colombia",
      description: "Premium Colombian coffee with rich, smooth taste and balanced acidity. Sourced from high-altitude regions for exceptional quality.",
      image: "/static/images/assets/Products/Colombia/Colombiapng.png",
      category: "Colombian",
      price: "₺85.00",
      rating: 4.8,
      badge: "Premium"
    },
    {
      id: 2,
      name: "COLOMBIAN 19",
      origin: "Colombia", 
      description: "High-grade Colombian coffee with exceptional cup quality. Perfect balance of sweetness and acidity with chocolate undertones.",
      image: "/static/images/assets/Products/Colombia/Colombiapng.png",
      category: "Colombian",
      price: "₺90.00",
      rating: 4.9,
      badge: "Best Seller"
    },
    {
      id: 3,
      name: "Indian PLANTATION A",
      origin: "India",
      description: "Premium plantation coffee with rich body and aromatic profile. Grown in the Western Ghats with traditional methods.",
      image: "/static/images/assets/Products/Indian/Indian_A.png",
      category: "Indian",
      price: "₺75.00",
      rating: 4.7,
      badge: "Plantation"
    },
    {
      id: 4,
      name: "Indian PLANTATION AA",
      origin: "India",
      description: "Top-grade Indian plantation coffee with superior bean quality. Full-bodied with spicy notes and excellent aroma.",
      image: "/static/images/assets/Products/Indian/Indian_AA.png",
      category: "Indian",
      price: "₺82.00",
      rating: 4.8,
      badge: "AA Grade"
    },
    {
      id: 5,
      name: "TUCANO BRAZILIAN",
      origin: "Brazil",
      description: "Washed 17/18 - Full-bodied with chocolate notes and nutty finish. Classic Brazilian profile with low acidity.",
      image: "/static/images/assets/Products/Brazilian/Tucano_brazilian.png",
      category: "Brazilian",
      price: "₺70.00",
      rating: 4.6,
      badge: "Washed"
    },
    {
      id: 6,
      name: "TUCANO SUPER",
      origin: "Brazil",
      description: "Fully Washed Extra Fine Cup 17/18 - Premium quality Brazilian coffee with exceptional clarity and sweetness.",
      image: "/static/images/assets/Products/Brazilian/Tucano_Super.png",
      category: "Brazilian",
      price: "₺78.00",
      rating: 4.7,
      badge: "Super Grade"
    },
    {
      id: 7,
      name: "TUCANO",
      origin: "Brazil",
      description: "Rio Minas 17/18 - Classic Brazilian profile with earthy notes and full body. Traditional processing method.",
      image: "/static/images/assets/Products/Brazilian/Tucano.png",
      category: "Brazilian",
      price: "₺65.00",
      rating: 4.5
    },
    {
      id: 8,
      name: "FERAZ EFENDI",
      origin: "Brazil",
      description: "Extra Soft Rio Minas 17/18 - Smooth and balanced Brazilian coffee with gentle processing for refined taste.",
      image: "/static/images/assets/Products/Brazilian/Feraz Efendi.png",
      category: "Brazilian",
      price: "₺72.00",
      rating: 4.6,
      badge: "Extra Soft"
    },
    {
      id: 9,
      name: "Kenya FAQ AA",
      origin: "Kenya",
      description: "Bright acidity with wine-like characteristics and complex flavors. Black currant notes with full body and clean finish.",
      image: "/static/images/assets/Products/Kenya/Kenya.png",
      category: "Kenya",
      price: "₺95.00",
      rating: 4.9,
      badge: "AA Grade"
    },
    {
      id: 10,
      name: "Nicaragua SHG 19",
      origin: "Nicaragua",
      description: "Strictly High Grown coffee with excellent cup quality. Balanced acidity with chocolate and caramel notes.",
      image: "/static/images/assets/Products/Nicaragua/Nicaraguapng.png",
      category: "Nicaragua",
      price: "₺88.00",
      rating: 4.8,
      badge: "SHG"
    },
    {
      id: 11,
      name: "Guatemala Washed Arabica",
      origin: "Guatemala",
      description: "Washed Arabica Guatemala - Complex and well-balanced with bright acidity and fruity undertones.",
      image: "/static/images/assets/Products/Guatemala/Guatemala.png",
      category: "Guatemala",
      price: "₺92.00",
      rating: 4.8,
      badge: "Washed"
    },
    {
      id: 12,
      name: "Ethiopian Arabica",
      origin: "Ethiopia",
      description: "Single origin beans from Ethiopian highlands. Floral and fruity notes with bright acidity and complex flavor profile.",
      image: "/static/images/assets/Products/Ethiopian/Ethiopian_Arabica.png",
      category: "Ethiopian",
      price: "₺98.00",
      rating: 4.9,
      badge: "Single Origin"
    },
    {
      id: 13,
      name: "Third Quality MYQ",
      origin: "Turkey",
      description: "High-quality cardamom with exceptional aroma and flavor. Perfect for traditional Turkish coffee and culinary uses.",
      image: "/static/images/assets/Products/Cardamom/Cardamom.png",
      category: "Cardamom",
      price: "₺120.00",
      rating: 4.7
    },
    {
      id: 14,
      name: "Trips",
      origin: "Turkey",
      description: "Premium grade trips cardamom for culinary excellence. Intense aroma with sweet and spicy flavor profile.",
      image: "/static/images/assets/Products/Cardamom/Cardamom.png",
      category: "Cardamom",
      price: "₺110.00",
      rating: 4.6
    },
    {
      id: 15,
      name: "Small Pale Green, Ambar Green 3",
      origin: "Turkey",
      description: "Small pale green cardamom pods with amber green coloring. Delicate flavor perfect for light seasoning.",
      image: "/static/images/assets/Products/Cardamom/Cardamom.png",
      category: "Cardamom",
      price: "₺105.00",
      rating: 4.5
    },
    {
      id: 16,
      name: "Extra Jade",
      origin: "Turkey",
      description: "Premium extra jade cardamom with superior quality. Exceptional aroma and intense flavor for gourmet applications.",
      image: "/static/images/assets/Products/Cardamom/Cardamom.png",
      category: "Cardamom",
      price: "₺135.00",
      rating: 4.8,
      badge: "Premium"
    },
    {
      id: 17,
      name: "Pale Green, Ambar Green 2",
      origin: "Turkey",
      description: "Pale green cardamom with amber green grade 2 classification. Balanced flavor with sweet and aromatic notes.",
      image: "/static/images/assets/Products/Cardamom/Cardamom.png",
      category: "Cardamom",
      price: "₺115.00",
      rating: 4.6
    },
    {
      id: 18,
      name: "Medium Dark Green",
      origin: "Turkey",
      description: "Medium dark green cardamom pods with rich flavor profile. Full-bodied aroma with complex spicy notes.",
      image: "/static/images/assets/Products/Cardamom/Cardamom.png",
      category: "Cardamom",
      price: "₺125.00",
      rating: 4.7
    },
    {
      id: 19,
      name: "Cardamom Seeds Delux",
      origin: "Turkey",
      description: "Deluxe cardamom seeds for premium culinary applications. Concentrated flavor and aroma for professional use.",
      image: "/static/images/assets/Products/Cardamom/Cardamom.png",
      category: "Cardamom",
      price: "₺140.00",
      rating: 4.8,
      badge: "Deluxe"
    },
    {
      id: 20,
      name: "Super Trips",
      origin: "Turkey",
      description: "Super quality trips cardamom - our finest grade. Exceptional aroma and flavor intensity for the most demanding applications.",
      image: "/static/images/assets/Products/Cardamom/Cardamom.png",
      category: "Cardamom",
      price: "₺150.00",
      rating: 4.9,
      badge: "Super Grade"
    }
  ];

  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'All' 
    ? allProducts 
    : allProducts.filter(product => product.category === selectedCategory);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };
 
  const handleProductClick = (product) => {
    // Navigate to product detail page with the selected product
    onNavigate('product-detail', null, product);
  };

  return (
    <div className="products-page">
      <Header activeSection="products" onNavigate={onNavigate} />
      
      <ProductsHero />

      {/* Category Tabs */}
   

      <ProductsGrid 
        products={filteredProducts}
        selectedCategory={selectedCategory}
        onProductClick={handleProductClick}
        onCategoryChange={handleCategoryChange}
      />

      <FeaturesSection />

      <EducationCTA onNavigate={onNavigate} />

      <Footer />
    </div>
  )
}

export default Products