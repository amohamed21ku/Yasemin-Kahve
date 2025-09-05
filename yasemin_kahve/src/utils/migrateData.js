// Migration utility to populate Firebase with existing product data
import { productService, categoryService } from '../services/productService';

// Default categories to create
const defaultCategories = [
  {
    name: { en: 'Brazilian', tr: 'Brezilya' },
    description: { en: 'Premium Brazilian coffee beans', tr: 'Özel Brezilya kahve çekirdekleri' }
  },
  {
    name: { en: 'Colombian', tr: 'Kolombiya' },
    description: { en: 'High-quality Colombian coffee', tr: 'Yüksek kalite Kolombiya kahvesi' }
  },
  {
    name: { en: 'Indian', tr: 'Hint' },
    description: { en: 'Rich Indian plantation coffee', tr: 'Zengin Hint plantasyon kahvesi' }
  },
  {
    name: { en: 'Ethiopian', tr: 'Etiyopya' },
    description: { en: 'Single origin Ethiopian beans', tr: 'Tek köken Etiyopya çekirdekleri' }
  },
  {
    name: { en: 'Kenyan', tr: 'Kenya' },
    description: { en: 'Bright and complex Kenyan coffee', tr: 'Parlak ve karmaşık Kenya kahvesi' }
  },
  {
    name: { en: 'Nicaraguan', tr: 'Nikaragua' },
    description: { en: 'Strictly high grown Nicaraguan coffee', tr: 'Sıkı yüksek büyütülmüş Nikaragua kahvesi' }
  },
  {
    name: { en: 'Guatemalan', tr: 'Guatemala' },
    description: { en: 'Complex Guatemalan washed coffee', tr: 'Karmaşık Guatemala yıkanmış kahve' }
  },
  {
    name: { en: 'Cardamom', tr: 'Kardamom' },
    description: { en: 'Premium quality cardamom spices', tr: 'Premium kalite kardamom baharatları' }
  }
];

// Sample products with multilingual support
const sampleProducts = [
  {
    name: { en: 'Colombian 18', tr: 'Kolombiya 18' },
    description: {
      en: 'Premium Colombian coffee with rich, smooth taste and balanced acidity. Sourced from high-altitude regions for exceptional quality.',
      tr: 'Zengin, yumuşak tat ve dengeli asitliğe sahip özel Kolombiya kahvesi. İstisnaî kalite için yüksek rakım bölgelerinden tedarik edilmiştir.'
    },
    categoryId: '', // Will be set during migration
    origin: 'Colombia',
    price: '₺85.00',
    badge: 'Premium',
    isVisible: true,
    image: '/static/images/assets/Products/Colombia/Colombiapng.png'
  },
  {
    name: { en: 'Indian Plantation AA', tr: 'Hint Plantation AA' },
    description: {
      en: 'Top-grade Indian plantation coffee with superior bean quality. Full-bodied with spicy notes and excellent aroma.',
      tr: 'Üstün çekirdek kalitesine sahip birinci sınıf Hint plantasyon kahvesi. Baharatlı notalar ve mükemmel aroma ile tam gövdeli.'
    },
    categoryId: '', // Will be set during migration
    origin: 'India',
    price: '₺82.00',
    badge: 'AA Grade',
    isVisible: true,
    image: '/static/images/assets/Products/Indian/Indian_AA.png'
  },
  {
    name: { en: 'Brazilian Tucano Super', tr: 'Brezilya Tucano Super' },
    description: {
      en: 'Fully washed extra fine cup 17/18 - Premium quality Brazilian coffee with exceptional clarity and sweetness.',
      tr: 'Tam yıkanmış ekstra ince fincan 17/18 - Olağanüstü berraklık ve tatlılığa sahip premium kalite Brezilya kahvesi.'
    },
    categoryId: '', // Will be set during migration
    origin: 'Brazil',
    price: '₺78.00',
    badge: 'Super Grade',
    isVisible: true,
    image: '/static/images/assets/Products/Brazilian/Tucano_Super.png'
  },
  {
    name: { en: 'Ethiopian Arabica', tr: 'Etiyopya Arabica' },
    description: {
      en: 'Single origin beans from Ethiopian highlands. Floral and fruity notes with bright acidity and complex flavor profile.',
      tr: 'Etiyopya yaylalarından tek köken çekirdekler. Çiçeksi ve meyveli notalar ile parlak asitlik ve karmaşık lezzet profili.'
    },
    categoryId: '', // Will be set during migration
    origin: 'Ethiopia',
    price: '₺98.00',
    badge: 'Single Origin',
    isVisible: true,
    image: '/static/images/assets/Products/Ethiopian/Ethiopian_Arabica.png'
  },
  {
    name: { en: 'Kenya FAQ AA', tr: 'Kenya FAQ AA' },
    description: {
      en: 'Bright acidity with wine-like characteristics and complex flavors. Black currant notes with full body and clean finish.',
      tr: 'Şarap benzeri özellikler ve karmaşık tatlar ile parlak asitlik. Tam gövde ve temiz bitiş ile siyah frenk üzümü notaları.'
    },
    categoryId: '', // Will be set during migration
    origin: 'Kenya',
    price: '₺95.00',
    badge: 'AA Grade',
    isVisible: true,
    image: '/static/images/assets/Products/Kenya/Kenya.png'
  },
  {
    name: { en: 'Extra Jade Cardamom', tr: 'Extra Jade Kardamom' },
    description: {
      en: 'Premium extra jade cardamom with superior quality. Exceptional aroma and intense flavor for gourmet applications.',
      tr: 'Üstün kaliteli premium extra jade kardamom. Gurme uygulamalar için olağanüstü aroma ve yoğun lezzet.'
    },
    categoryId: '', // Will be set during migration
    origin: 'Turkey',
    price: '₺135.00',
    badge: 'Premium',
    isVisible: true,
    image: '/static/images/assets/Products/Cardamom/Cardamom.png'
  }
];

export const migrateCategories = async () => {
  console.log('🔄 Starting category migration...');
  const createdCategories = [];
  
  try {
    for (const category of defaultCategories) {
      const categoryId = await categoryService.addCategory(category);
      createdCategories.push({ id: categoryId, ...category });
      console.log(`✅ Created category: ${category.name.en} (ID: ${categoryId})`);
    }
    
    console.log(`🎉 Successfully migrated ${createdCategories.length} categories`);
    return createdCategories;
  } catch (error) {
    console.error('❌ Error during category migration:', error);
    throw error;
  }
};

export const migrateProducts = async (categories) => {
  console.log('🔄 Starting product migration...');
  
  try {
    // Create a mapping of category names to IDs
    const categoryMap = {};
    categories.forEach(cat => {
      const englishName = cat.name.en.toLowerCase();
      if (englishName.includes('brazilian')) categoryMap['brazilian'] = cat.id;
      if (englishName.includes('colombian')) categoryMap['colombian'] = cat.id;
      if (englishName.includes('indian')) categoryMap['indian'] = cat.id;
      if (englishName.includes('ethiopian')) categoryMap['ethiopian'] = cat.id;
      if (englishName.includes('kenyan')) categoryMap['kenyan'] = cat.id;
      if (englishName.includes('nicaraguan')) categoryMap['nicaraguan'] = cat.id;
      if (englishName.includes('guatemalan')) categoryMap['guatemalan'] = cat.id;
      if (englishName.includes('cardamom')) categoryMap['cardamom'] = cat.id;
    });
    
    // Map products to their categories
    const productsToMigrate = sampleProducts.map(product => {
      let categoryId = '';
      
      const origin = product.origin.toLowerCase();
      const name = product.name.en.toLowerCase();
      
      if (origin.includes('colombia') || name.includes('colombian')) {
        categoryId = categoryMap['colombian'];
      } else if (origin.includes('india') || name.includes('indian')) {
        categoryId = categoryMap['indian'];
      } else if (origin.includes('brazil') || name.includes('brazilian')) {
        categoryId = categoryMap['brazilian'];
      } else if (origin.includes('ethiopia') || name.includes('ethiopian')) {
        categoryId = categoryMap['ethiopian'];
      } else if (origin.includes('kenya') || name.includes('kenya')) {
        categoryId = categoryMap['kenyan'];
      } else if (name.includes('cardamom')) {
        categoryId = categoryMap['cardamom'];
      }
      
      return {
        ...product,
        categoryId
      };
    });
    
    // Create products
    const createdProducts = [];
    for (const product of productsToMigrate) {
      const productId = await productService.addProduct(product);
      createdProducts.push({ id: productId, ...product });
      console.log(`✅ Created product: ${product.name.en} (ID: ${productId})`);
    }
    
    console.log(`🎉 Successfully migrated ${createdProducts.length} products`);
    return createdProducts;
  } catch (error) {
    console.error('❌ Error during product migration:', error);
    throw error;
  }
};

export const runFullMigration = async () => {
  console.log('🚀 Starting full data migration...');
  
  try {
    // Step 1: Create categories
    const categories = await migrateCategories();
    
    // Step 2: Create products with category references
    const products = await migrateProducts(categories);
    
    console.log('🎉 Full migration completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Products: ${products.length}`);
    
    return { categories, products };
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};

// Utility to clear all data (use with caution)
export const clearAllData = async () => {
  console.log('⚠️  Starting data cleanup...');
  
  try {
    // Get all products and delete them
    const products = await productService.getAllProducts();
    for (const product of products) {
      await productService.deleteProduct(product.id);
      console.log(`🗑️  Deleted product: ${product.name?.en || product.name}`);
    }
    
    // Get all categories and delete them
    const categories = await categoryService.getAllCategories();
    for (const category of categories) {
      await categoryService.deleteCategory(category.id);
      console.log(`🗑️  Deleted category: ${category.name?.en || category.name}`);
    }
    
    console.log('✅ Data cleanup completed');
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  }
};