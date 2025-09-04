import React from 'react'
import { useTranslation } from '../../../useTranslation'

const ProductsHero = () => {
  const { t } = useTranslation();

  return (
    <section className="products-hero">
      <div className="container">
        <h1 className="hero-title">{t("ourProducts") || "Our Premium Coffee Collection"}</h1>
        <p className="hero-subtitle">
          {t("createNewStory") || "Discover exceptional coffee beans carefully sourced from around the world. Each blend tells a story of tradition, craftsmanship, and passion for the perfect cup."}
        </p>
      </div>
    </section>
  )
}

export default ProductsHero