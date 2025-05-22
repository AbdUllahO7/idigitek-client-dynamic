// data/smartDriveData.js

import { Car, Clock, CreditCard, Headphones, LineChart, MessageSquare, MonitorSmartphone, Settings } from "lucide-react";


export const heroData = {
  en: {
    backgroundImage: "https://www.xenial.com/images/drive-thruv2_results-main-2.png",
    title: "Smart Drive-Through Solutions",
    description: "Revolutionize your drive-through experience with AI-powered ordering systems, digital menu boards, and efficient queue management technology.",
    backLink: "/services",
    backLinkText: "Back to Services"
  },
  ar: {
    backgroundImage: "https://www.xenial.com/images/drive-thruv2_results-main-2.png",
    title: "حلول السيارات الذكية",
    description: "قم بثورة في تجربة خدمة السيارات مع أنظمة الطلب المدعومة بالذكاء الاصطناعي، ولوحات القوائم الرقمية، وتقنية إدارة الطوابير الفعالة.",
    backLink: "/services",
    backLinkText: "العودة إلى الخدمات"
  }
}


// Benefits Data with language support
export const benefitsData = {
  en: [
    {
      icon: Clock,
      title: "Reduced Wait Times",
      description: "Decrease average service time by up to 40% with optimized queue management"
    },
    {
      icon: MessageSquare,
      title: "Improved Order Accuracy",
      description: "AI-powered systems reduce errors by up to 85% compared to traditional methods"
    },
    {
      icon: LineChart,
      title: "Increased Sales",
      description: "Dynamic menu displays can increase average order value by 15-20%"
    },
    {
      icon: Headphones,
      title: "Enhanced Customer Experience",
      description: "Personalized interactions and faster service lead to higher satisfaction"
    }
  ],
  ar: [
    {
      icon: Clock,
      title: "تقليل أوقات الانتظار",
      description: "تقليل متوسط وقت الخدمة بنسبة تصل إلى 40٪ مع إدارة الطوابير المحسنة"
    },
    {
      icon: MessageSquare,
      title: "تحسين دقة الطلبات",
      description: "تقلل الأنظمة المدعومة بالذكاء الاصطناعي الأخطاء بنسبة تصل إلى 85٪ مقارنة بالطرق التقليدية"
    },
    {
      icon: LineChart,
      title: "زيادة المبيعات",
      description: "يمكن أن تزيد شاشات القائمة الديناميكية من متوسط قيمة الطلب بنسبة 15-20٪"
    },
    {
      icon: Headphones,
      title: "تعزيز تجربة العملاء",
      description: "تؤدي التفاعلات الشخصية والخدمة الأسرع إلى رضا أعلى"
    }
  ]
};

// Features Data with language support
export const featuresData = {
  en: [
    {
      id: "ai",
      title: "AI-Powered Ordering",
      content: {
        heading: "AI-Powered Ordering System",
        description: "Our advanced natural language processing technology understands customer orders with remarkable accuracy, even in noisy environments or with different accents.",
        features: [
          "98.5% order accuracy in real-world conditions",
          "Automatic upselling suggestions based on order patterns",
          "Multilingual support for diverse customer bases",
          "Continuous learning to improve over time"
        ],
        image: "https://www.xenial.com/images/drive-thruv2_results-main-2.png",
        imageAlt: "AI-Powered Ordering System",
        imagePosition: "right"
      }
    },
    {
      id: "digital",
      title: "Digital Menu Boards",
      content: {
        heading: "Dynamic Digital Menu Boards",
        description: "Our digital menu boards adapt in real-time to various factors, optimizing your menu presentation for maximum impact and sales.",
        features: [
          "Time-of-day menu adjustments (breakfast, lunch, dinner)",
          "Weather-based promotions (hot drinks on cold days)",
          "Inventory-aware displays that highlight available items",
          "High-definition visuals with animated promotions"
        ],
        image: "https://www.xenial.com/images/drive-thruv2_results-main-2.png",
        imageAlt: "Digital Menu Boards",
        imagePosition: "left"
      }
    },
    {
      id: "queue",
      title: "Queue Management",
      content: {
        heading: "Intelligent Queue Management",
        description: "Our queue management system optimizes the flow of vehicles through your drive-through, reducing bottlenecks and improving throughput.",
        features: [
          "Real-time wait time estimates for customers",
          "Smart lane allocation for multi-lane setups",
          "Staff allocation recommendations based on demand",
          "Historical data analysis for operational improvements"
        ],
        image: "https://www.xenial.com/images/drive-thruv2_results-main-2.png",
        imageAlt: "Queue Management System",
        imagePosition: "right"
      }
    },
    {
      id: "integration",
      title: "System Integration",
      content: {
        heading: "Seamless System Integration",
        description: "Our solutions integrate smoothly with your existing POS systems, kitchen display systems, and other operational software.",
        features: [
          "Compatible with all major POS providers",
          "API-first architecture for custom integrations",
          "Cloud-based management with real-time updates",
          "Secure data handling with encryption and compliance"
        ],
        image: "https://www.xenial.com/images/drive-thruv2_results-main-2.png",
        imageAlt: "System Integration",
        imagePosition: "left"
      }
    }
  ],
  ar: [
    {
      id: "ai",
      title: "طلب مدعوم بالذكاء الاصطناعي",
      content: {
        heading: "نظام طلب مدعوم بالذكاء الاصطناعي",
        description: "تفهم تقنية معالجة اللغة الطبيعية المتقدمة لدينا طلبات العملاء بدقة مذهلة، حتى في البيئات الصاخبة أو مع اللهجات المختلفة.",
        features: [
          "دقة طلب بنسبة 98.5٪ في ظروف العالم الحقيقي",
          "اقتراحات بيع إضافية تلقائية بناءً على أنماط الطلب",
          "دعم متعدد اللغات لقواعد العملاء المتنوعة",
          "التعلم المستمر للتحسين مع مرور الوقت"
        ],
        image: "https://www.xenial.com/images/drive-thruv2_results-main-2.png",
        imageAlt: "نظام طلب مدعوم بالذكاء الاصطناعي",
        imagePosition: "right"
      }
    },
    {
      id: "digital",
      title: "لوحات قوائم رقمية",
      content: {
        heading: "لوحات قوائم رقمية ديناميكية",
        description: "تتكيف لوحات القوائم الرقمية لدينا في الوقت الفعلي مع عوامل مختلفة، لتحسين عرض القائمة لتحقيق أقصى تأثير ومبيعات.",
        features: [
          "تعديلات القائمة حسب وقت اليوم (الإفطار، الغداء، العشاء)",
          "عروض ترويجية قائمة على الطقس (مشروبات ساخنة في الأيام الباردة)",
          "شاشات عرض تراعي المخزون وتبرز العناصر المتاحة",
          "صور عالية الدقة مع عروض ترويجية متحركة"
        ],
        image: "https://www.xenial.com/images/drive-thruv2_results-main-2.png",
        imageAlt: "لوحات قوائم رقمية",
        imagePosition: "left"
      }
    },
    {
      id: "queue",
      title: "إدارة الطوابير",
      content: {
        heading: "إدارة ذكية للطوابير",
        description: "يعمل نظام إدارة الطوابير لدينا على تحسين تدفق المركبات عبر خدمة السيارات، مما يقلل من الاختناقات ويحسن الإنتاجية.",
        features: [
          "تقديرات وقت الانتظار في الوقت الفعلي للعملاء",
          "تخصيص ذكي للمسارات للإعدادات متعددة المسارات",
          "توصيات تخصيص الموظفين بناءً على الطلب",
          "تحليل البيانات التاريخية للتحسينات التشغيلية"
        ],
        image: "https://www.xenial.com/images/drive-thruv2_results-main-2.png",
        imageAlt: "نظام إدارة الطوابير",
        imagePosition: "right"
      }
    },
    {
      id: "integration",
      title: "تكامل النظام",
      content: {
        heading: "تكامل سلس للنظام",
        description: "تتكامل حلولنا بسلاسة مع أنظمة نقاط البيع الحالية وأنظمة عرض المطبخ وبرامج التشغيل الأخرى.",
        features: [
          "متوافق مع جميع مزودي نقاط البيع الرئيسيين",
          "بنية قائمة على واجهة برمجة التطبيقات للتكاملات المخصصة",
          "إدارة سحابية مع تحديثات في الوقت الفعلي",
          "معالجة آمنة للبيانات مع التشفير والامتثال"
        ],
        image: "https://www.xenial.com/images/drive-thruv2_results-main-2.png",
        imageAlt: "تكامل النظام",
        imagePosition: "left"
      }
    }
  ]
};

// Process Steps Data with language support
export const processStepsData = {
  en: [
    {
      icon: Car,
      title: "Customer Arrival",
      description: "Vehicle detection sensors identify approaching customers and trigger the system to prepare for their order."
    },
    {
      icon: MonitorSmartphone,
      title: "Order Placement",
      description: "AI-powered system takes the customer's order through voice recognition or touchscreen interface with high accuracy."
    },
    {
      icon: Settings,
      title: "Processing",
      description: "Order is instantly transmitted to kitchen systems and queue management for optimal preparation timing."
    },
    {
      icon: CreditCard,
      title: "Completion",
      description: "Customer completes payment and receives their order with minimal wait time and maximum accuracy."
    }
  ],
  ar: [
    {
      icon: Car,
      title: "وصول العميل",
      description: "تحدد أجهزة استشعار اكتشاف المركبات العملاء القادمين وتعمل على تشغيل النظام للاستعداد لطلبهم."
    },
    {
      icon: MonitorSmartphone,
      title: "تقديم الطلب",
      description: "يأخذ النظام المدعوم بالذكاء الاصطناعي طلب العميل من خلال التعرف على الصوت أو واجهة شاشة اللمس بدقة عالية."
    },
    {
      icon: Settings,
      title: "المعالجة",
      description: "يتم نقل الطلب على الفور إلى أنظمة المطبخ وإدارة الطوابير للحصول على توقيت تحضير مثالي."
    },
    {
      icon: CreditCard,
      title: "الإكمال",
      description: "يكمل العميل الدفع ويستلم طلبه بأقل وقت انتظار وأقصى دقة."
    }
  ]
};

// FAQ Data with language support
export const faqData = {
  en: [
    {
      question: "How long does implementation take?",
      answer: "Typical implementation takes 2-4 weeks depending on the complexity of your existing systems and the number of locations. Our team works efficiently to minimize disruption to your operations."
    },
    {
      question: "Is this compatible with my existing POS?",
      answer: "Our solutions integrate with all major POS systems including Square, Toast, NCR, Oracle, and many others. We have dedicated integration specialists to ensure smooth connectivity."
    },
    {
      question: "What kind of ROI can I expect?",
      answer: "Most clients see a return on investment within 6-12 months through increased throughput, higher average order values, and reduced operational costs. We provide detailed analytics to track your ROI."
    },
    {
      question: "Do you offer ongoing support?",
      answer: "Yes, we provide 24/7 technical support, regular software updates, and preventative maintenance. Our service level agreements ensure minimal downtime and quick resolution of any issues."
    }
  ],
  ar: [
    {
      question: "كم من الوقت يستغرق التنفيذ؟",
      answer: "يستغرق التنفيذ النموذجي 2-4 أسابيع حسب تعقيد الأنظمة الحالية وعدد المواقع. يعمل فريقنا بكفاءة لتقليل الاضطراب في عملياتك."
    },
    {
      question: "هل هذا متوافق مع نظام نقاط البيع الحالي الخاص بي؟",
      answer: "تتكامل حلولنا مع جميع أنظمة نقاط البيع الرئيسية بما في ذلك Square و Toast و NCR و Oracle والعديد من الأنظمة الأخرى. لدينا متخصصون في التكامل مخصصون لضمان الاتصال السلس."
    },
    {
      question: "ما نوع العائد على الاستثمار الذي يمكنني توقعه؟",
      answer: "يرى معظم العملاء عائدًا على الاستثمار في غضون 6-12 شهرًا من خلال زيادة الإنتاجية وارتفاع متوسط قيم الطلبات وانخفاض تكاليف التشغيل. نحن نقدم تحليلات مفصلة لتتبع العائد على الاستثمار الخاص بك."
    },
    {
      question: "هل تقدمون دعمًا مستمرًا؟",
      answer: "نعم، نحن نقدم دعمًا فنيًا على مدار الساعة طوال أيام الأسبوع وتحديثات برمجية منتظمة وصيانة وقائية. تضمن اتفاقيات مستوى الخدمة لدينا الحد الأدنى من التوقف وحل سريع لأي مشاكل."
    }
  ]
};