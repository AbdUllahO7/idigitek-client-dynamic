import { ClientLogoType, StatType } from './types'

export const clientsData = {
  clients: [
    { name: "Microsoft", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBhUUvHAbQqwH-FQ02XNaAOAuxaqAaRYcKsw&s" },
    { name: "Amazon", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBhUUvHAbQqwH-FQ02XNaAOAuxaqAaRYcKsw&s" },
    { name: "Google", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBhUUvHAbQqwH-FQ02XNaAOAuxaqAaRYcKsw&s" },
    { name: "IBM", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBhUUvHAbQqwH-FQ02XNaAOAuxaqAaRYcKsw&s" },
    { name: "Oracle", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBhUUvHAbQqwH-FQ02XNaAOAuxaqAaRYcKsw&s" },
    { name: "Samsung", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBhUUvHAbQqwH-FQ02XNaAOAuxaqAaRYcKsw&s" },
    { name: "Sony", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBhUUvHAbQqwH-FQ02XNaAOAuxaqAaRYcKsw&s" },
    { name: "Tesla", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBhUUvHAbQqwH-FQ02XNaAOAuxaqAaRYcKsw&s" },
  ] as ClientLogoType[],
  
  stats: [
    { value: "500+", label: "Clients Worldwide" },
    { value: "10+", label: "Years Experience" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "24/7", label: "Support Available" },
  ] as StatType[]
}