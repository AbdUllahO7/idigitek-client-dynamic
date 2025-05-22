import { CaseStudy, SectionText } from "./types"

export const sectionTranslations: Record<string, SectionText> = {
  en: {
    title: "Success Stories from Our Clients",
    badge: "Case Studies",
    description: "Discover how our technology solutions have transformed businesses across various industries, delivering measurable results and exceptional value."
  },
  ar: {
    title: "قصص النجاح من عملائنا",
    badge: "دراسات الحالة",
    description: "اكتشف كيف ساهمت حلولنا التكنولوجية في تحويل الأعمال عبر مختلف الصناعات، وتقديم نتائج قابلة للقياس وقيمة استثنائية."
  }
}

export const caseStudiesData: Record<string, CaseStudy[]> = {
  en: [
    {
      title: "Retail Chain Transformation",
      description: "Implemented a seamless POS system across 500 locations, improving checkout speed and customer satisfaction.",
      image: "https://img.freepik.com/free-vector/going-up-concept-illustration_114360-2292.jpg",
      stats: [
        { value: "30%", label: "Faster Service" },
        { value: "25%", label: "Higher Satisfaction" },
        { value: "15%", label: "Revenue Increase" },
      ],
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "Restaurant Group Success",
      description: "Deployed an integrated inventory and ordering solution that reduced waste and optimized stock levels.",
      image: "https://img.freepik.com/premium-vector/team-leader-concept-illustration-business-team-walking-success-ladder-steps-concept-business-success-leadership-vector-illustration-flat-style_7737-2323.jpg",
      stats: [
        { value: "40%", label: "Fewer Stockouts" },
        { value: "20%", label: "Inventory Cost Reduction" },
        { value: "35%", label: "Staff Efficiency" },
      ],
      color: "from-emerald-500 to-teal-500",
    },
    {
      title: "Healthcare Provider Network",
      description: "Implemented a custom patient management system that reduced administrative time by 45% and improved patient satisfaction scores by 30%.",
      image: "/placeholder.svg?height=400&width=600",
      stats: [
        { value: "45%", label: "Admin Time Saved" },
        { value: "30%", label: "Patient Satisfaction" },
        { value: "22%", label: "Cost Reduction" },
      ],
      color: "from-purple-500 to-violet-500",
    },
  ],
  ar: [
    {
      title: "تحول سلسلة البيع بالتجزئة",
      description: "قمنا بتنفيذ نظام نقاط بيع سلس عبر 500 موقع، مما أدى إلى تحسين سرعة الدفع ورضا العملاء.",
      image: "https://img.freepik.com/free-vector/going-up-concept-illustration_114360-2292.jpg",
      stats: [
        { value: "30%", label: "خدمة أسرع" },
        { value: "25%", label: "رضا أعلى" },
        { value: "15%", label: "زيادة الإيرادات" },
      ],
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "نجاح مجموعة المطاعم",
      description: "نشرنا حلاً متكاملاً للمخزون والطلبات مما قلل الهدر وحسّن مستويات المخزون.",
      image: "https://img.freepik.com/premium-vector/team-leader-concept-illustration-business-team-walking-success-ladder-steps-concept-business-success-leadership-vector-illustration-flat-style_7737-2323.jpg",
      stats: [
        { value: "40%", label: "نفاد المخزون أقل" },
        { value: "20%", label: "تخفيض تكلفة المخزون" },
        { value: "35%", label: "كفاءة الموظفين" },
      ],
      color: "from-emerald-500 to-teal-500",
    },
    {
      title: "شبكة مزودي الرعاية الصحية",
      description: "قمنا بتنفيذ نظام مخصص لإدارة المرضى مما قلل وقت الإدارة بنسبة 45% وحسّن درجات رضا المرضى بنسبة 30%.",
      image: "/placeholder.svg?height=400&width=600",
      stats: [
        { value: "45%", label: "توفير وقت الإدارة" },
        { value: "30%", label: "رضا المرضى" },
        { value: "22%", label: "تخفيض التكاليف" },
      ],
      color: "from-purple-500 to-violet-500",
    },
  ]
}