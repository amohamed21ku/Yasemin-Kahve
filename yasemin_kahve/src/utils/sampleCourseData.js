// sampleCourseData.js - Sample course data for Firebase
import { createCourse } from '../services/courseService'

export const sampleCourses = [
  {
    id: "course_1",
    enrolledStudents: [],
    title: {
      en: "Coffee Fundamentals",
      tr: "Kahve Temelleri"
    },
    shortDescription: {
      en: "Learn the basics of coffee from bean to cup. Perfect for beginners who want to understand coffee origins, processing, and basic brewing techniques.",
      tr: "Çekirdekten fincan kahveye kadar kahvenin temellerini öğrenin. Kahve orijinlerini, işlemeyi ve temel demleme tekniklerini anlamak isteyen yeni başlayanlar için mükemmel."
    },
    fullDescription: {
      en: "This comprehensive course covers everything you need to know about coffee fundamentals. From understanding different coffee origins and processing methods to mastering basic brewing techniques, you'll gain a deep appreciation for the art and science of coffee.",
      tr: "Bu kapsamlı kurs, kahve temelleri hakkında bilmeniz gereken her şeyi kapsar. Farklı kahve orijinlerini ve işleme yöntemlerini anlamaktan temel demleme tekniklerinde ustalaşmaya kadar, kahvenin sanatı ve bilimine derin bir takdir kazanacaksınız."
    },
    level: {
      en: "Beginner",
      tr: "Başlangıç"
    },
    category: "basics",
    courseType: "On Site",
    duration: 8,
    startDate: "2024-02-15",
    endDate: "2024-02-16",
    price: 299,
    originalPrice: 399,
    maxStudents: 20,
    image: "/static/images/assets/courses/fundamentals.jpg",
    location: {
      en: "Yasemin Kahve Academy, Istanbul",
      tr: "Yasemin Kahve Akademisi, İstanbul"
    },
    prerequisites: {
      en: "No prior experience required. Just bring your passion for coffee!",
      tr: "Önceden deneyim gerekmez. Sadece kahve tutkunu getirin!"
    },
    materials: [
      { en: "Course handbook and materials", tr: "Kurs el kitabı ve materyalleri" },
      { en: "Coffee samples for tasting", tr: "Tadım için kahve örnekleri" },
      { en: "Basic brewing equipment access", tr: "Temel demleme ekipmanı erişimi" },
      { en: "Certificate of completion", tr: "Tamamlama sertifikası" }
    ],
    curriculum: [
      {
        title: { en: "Introduction to Coffee", tr: "Kahveye Giriş" },
        duration: 2,
        lessons: [
          { en: "History of Coffee", tr: "Kahvenin Tarihi" },
          { en: "Coffee Plant & Bean Types", tr: "Kahve Bitkisi ve Çekirdek Türleri" },
          { en: "Global Coffee Regions", tr: "Küresel Kahve Bölgeleri" }
        ]
      },
      {
        title: { en: "Processing Methods", tr: "İşleme Yöntemleri" },
        duration: 2,
        lessons: [
          { en: "Washed Process", tr: "Yıkanmış İşlem" },
          { en: "Natural Process", tr: "Doğal İşlem" },
          { en: "Honey Process", tr: "Bal İşlemi" }
        ]
      }
    ],
    instructor: {
      name: "Ahmet Yasemin",
      avatar: "/static/images/assets/instructors/ahmet.jpg",
      title: {
        en: "Master Roaster & Coffee Expert",
        tr: "Usta Kavurucu ve Kahve Uzmanı"
      },
      bio: {
        en: "With over 15 years of experience in the coffee industry, Ahmet is a certified Q Grader and master roaster.",
        tr: "Kahve endüstrisinde 15 yılı aşkın deneyime sahip Ahmet, sertifikalı Q Grader ve usta kavurucudur."
      }
    },
    rating: 4.8,
    isActive: true
  },
  {
    id: "course_2",
    enrolledStudents: [],
    title: {
      en: "Advanced Brewing Techniques",
      tr: "İleri Demleme Teknikleri"
    },
    shortDescription: {
      en: "Master advanced brewing methods including pour-over, espresso, and alternative brewing techniques. Perfect for intermediate coffee enthusiasts.",
      tr: "Pour-over, espresso ve alternatif demleme teknikleri dahil ileri demleme yöntemlerinde ustalaşın. Orta seviye kahve meraklıları için mükemmel."
    },
    fullDescription: {
      en: "Take your brewing skills to the next level with this intensive course on advanced brewing techniques. Learn professional methods used by world-class baristas and coffee shops.",
      tr: "İleri demleme teknikleri üzerine bu yoğun kursla demleme becerilerinizi bir üst seviyeye taşıyın. Dünya çapındaki baristalar ve kahve dükkanları tarafından kullanılan profesyonel yöntemleri öğrenin."
    },
    level: {
      en: "Advanced",
      tr: "İleri"
    },
    category: "brewing",
    courseType: "Online",
    duration: 12,
    startDate: "2024-02-20",
    endDate: "2024-02-22",
    price: 499,
    originalPrice: 599,
    maxStudents: 15,
    image: "/static/images/assets/courses/brewing.jpg",
    location: {
      en: "Yasemin Kahve Academy + Online Sessions",
      tr: "Yasemin Kahve Akademisi + Online Oturumlar"
    },
    prerequisites: {
      en: "Basic coffee knowledge recommended. Complete Coffee Fundamentals course or equivalent experience.",
      tr: "Temel kahve bilgisi önerilir. Kahve Temelleri kursunu tamamlayın veya eşdeğer deneyim."
    },
    instructor: {
      name: "Fatma Demir",
      avatar: "/static/images/assets/instructors/fatma.jpg",
      title: {
        en: "Brewing Specialist & Barista Champion",
        tr: "Demleme Uzmanı ve Barista Şampiyonu"
      }
    },
    rating: 4.9,
    isActive: true
  },
  {
    id: "course_3",
    enrolledStudents: [],
    title: {
      en: "Online Coffee Cupping & Tasting",
      tr: "Online Kahve Cupping ve Tadım"
    },
    shortDescription: {
      en: "Develop your palate and learn professional cupping techniques from the comfort of your home. Includes coffee sample kit delivery.",
      tr: "Evinizin rahatlığında damak tadinizi geliştirin ve profesyonel cupping tekniklerini öğrenin. Kahve örnek kiti teslimatı dahildir."
    },
    fullDescription: {
      en: "Join our online cupping sessions and learn to identify coffee flavors, aromas, and quality indicators like a professional coffee taster.",
      tr: "Online cupping oturumlarımıza katılın ve profesyonel bir kahve tadımcısı gibi kahve tatlarını, aromalarını ve kalite göstergelerini tanımayı öğrenin."
    },
    level: {
      en: "Intermediate",
      tr: "Orta"
    },
    category: "tasting",
    courseType: "Online",
    duration: 6,
    startDate: "2024-03-01",
    endDate: "2024-03-03",
    price: 399,
    maxStudents: 25,
    image: "/static/images/assets/courses/cupping.jpg",
    prerequisites: {
      en: "Basic understanding of coffee brewing. Good sense of taste and smell required.",
      tr: "Kahve demlemenin temel anlayışı. İyi bir tat ve koku duyusu gereklidir."
    },
    instructor: {
      name: "Mehmet Özkan",
      avatar: "/static/images/assets/instructors/mehmet.jpg",
      title: {
        en: "Certified Q Grader & Sensory Analyst",
        tr: "Sertifikalı Q Grader ve Duyusal Analist"
      }
    },
    rating: 4.7,
    isActive: true
  },
  {
    id: "course_4",
    enrolledStudents: [],
    title: {
      en: "Coffee Roasting Mastery",
      tr: "Kahve Kavurma Ustalığı"
    },
    shortDescription: {
      en: "Learn the art and science of coffee roasting from industry experts. Hands-on experience with professional roasting equipment.",
      tr: "Sektör uzmanlarından kahve kavurmanın sanatını ve bilimini öğrenin. Profesyonel kavurma ekipmanları ile uygulamalı deneyim."
    },
    fullDescription: {
      en: "Master the complex art of coffee roasting with this comprehensive course. Learn to control heat, timing, and airflow to create perfect roast profiles.",
      tr: "Bu kapsamlı kursla karmaşık kahve kavurma sanatında ustalaşın. Mükemmel kavurma profilleri oluşturmak için ısı, zamanlama ve hava akımını kontrol etmeyi öğrenin."
    },
    level: {
      en: "Advanced",
      tr: "İleri"
    },
    category: "roasting",
    courseType: "On Site",
    duration: 16,
    startDate: "2024-03-10",
    endDate: "2024-03-12",
    price: 799,
    originalPrice: 999,
    maxStudents: 8,
    image: "/static/images/assets/courses/roasting.jpg",
    location: {
      en: "Yasemin Kahve Roastery, Istanbul",
      tr: "Yasemin Kahve Kavurcusu, İstanbul"
    },
    instructor: {
      name: "Ali Yılmaz",
      avatar: "/static/images/assets/instructors/ali.jpg",
      title: {
        en: "Head Roaster & Coffee Consultant",
        tr: "Baş Kavurucu ve Kahve Danışmanı"
      }
    },
    rating: 5.0,
    isActive: true
  },
  {
    id: "course_5",
    enrolledStudents: [],
    title: {
      en: "Coffee Business Management",
      tr: "Kahve İş Yönetimi"
    },
    shortDescription: {
      en: "Start and manage your own coffee business with expert guidance. Covers business planning, operations, and marketing strategies.",
      tr: "Uzman rehberliğinde kendi kahve işinizi başlatın ve yönetin. İş planlaması, operasyonlar ve pazarlama stratejilerini kapsar."
    },
    fullDescription: {
      en: "Learn everything you need to know to start and run a successful coffee business, from concept to profitability.",
      tr: "Konseptten karlılığa kadar başarılı bir kahve işletmesi başlatmak ve yürütmek için bilmeniz gereken her şeyi öğrenin."
    },
    level: {
      en: "Intermediate",
      tr: "Orta"
    },
    category: "business",
    courseType: "Online",
    duration: 20,
    startDate: "2024-03-15",
    endDate: "2024-03-19",
    price: 899,
    maxStudents: 30,
    image: "/static/images/assets/courses/business.jpg",
    instructor: {
      name: "Elif Kaya",
      avatar: "/static/images/assets/instructors/elif.jpg",
      title: {
        en: "Business Consultant & Entrepreneur",
        tr: "İş Danışmanı ve Girişimci"
      }
    },
    rating: 4.6,
    isActive: true
  },
  {
    id: "course_6",
    enrolledStudents: [],
    title: {
      en: "Latte Art Workshop",
      tr: "Latte Art Atölyesi"
    },
    shortDescription: {
      en: "Create beautiful latte art and impress your customers. Learn fundamental milk steaming and pouring techniques.",
      tr: "Güzel latte art'lar yaratın ve müşterilerinizi etkileyın. Temel süt buharlatma ve dökme tekniklerini öğrenin."
    },
    fullDescription: {
      en: "Master the artistic side of coffee with this hands-on latte art workshop. Perfect for baristas and coffee enthusiasts.",
      tr: "Bu uygulamalı latte art atölyesi ile kahvenin sanatsal yönünde ustalaşın. Baristalar ve kahve meraklıları için mükemmel."
    },
    level: {
      en: "Beginner",
      tr: "Başlangıç"
    },
    category: "barista",
    courseType: "On Site",
    duration: 4,
    startDate: "2024-03-20",
    endDate: "2024-03-20",
    price: 199,
    originalPrice: 249,
    maxStudents: 18,
    image: "/static/images/assets/courses/latte-art.jpg",
    location: {
      en: "Yasemin Kahve Training Center, Istanbul",
      tr: "Yasemin Kahve Eğitim Merkezi, İstanbul"
    },
    instructor: {
      name: "Zeynep Aydın",
      avatar: "/static/images/assets/instructors/zeynep.jpg",
      title: {
        en: "Latte Art Champion & Master Barista",
        tr: "Latte Art Şampiyonu ve Usta Barista"
      }
    },
    rating: 4.5,
    isActive: true
  }
]

export const addSampleCourses = async () => {
  try {
    console.log('Adding sample courses to Firebase...')
    
    const coursePromises = sampleCourses.map(async (course) => {
      try {
        const courseId = await createCourse(course)
        console.log(`Created course: ${course.title.en} (ID: ${courseId})`)
        return courseId
      } catch (error) {
        console.error(`Error creating course ${course.title.en}:`, error)
        throw error
      }
    })
    
    const results = await Promise.all(coursePromises)
    console.log('Successfully added all sample courses:', results)
    return results
  } catch (error) {
    console.error('Error adding sample courses:', error)
    throw error
  }
}