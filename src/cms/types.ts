/**
 * CMS Type Definitions
 * 
 * These types represent the structure of data from Prismic CMS
 * and are used throughout the application for type safety.
 */

export type Driver = {
  id: string
  name: string
  label: string
  description: string
  photo: CMSImage
  languages: string[]
  vehicles: Vehicle[]
}

export type Vehicle = {
  id: string
  name: string
  seats: number
  description: string
  image: CMSImage
}

export type CMSRichText = Array<{
  type: string
  text: string
  spans?: unknown[]
}>

export type CMSImage = {
  id: string
  url: string
  alt?: string
  copyright?: string
  dimensions: {
    width: number
    height: number
  }
}

export type ImageWithLabel = {
  id: string
  image: CMSImage | null
  label: string
  title: string
  iconName?: string
}

export type WhyChooseUs = {
  id: string
  title: string
  label: string
  reasons: ImageWithLabel[]
}

export type PageSection = {
  id: string
  uid?: string
  title: string
  label: string
  buttonText: string
}

export type FooterContactInfo = {
  id: string
  uid?: string
  email: string
  phoneNumber: string
  location: string
}

export type Location = {
  id: string
  value: string
}

export type Tour = {
  id: string
  uid: string
  title: string
  description: string
  longDescription: string
  locations: Location[]
  bannerImage: CMSImage | null
  images: CMSImage[]
  duration: number
  price: number
  includedItems: string[]
}

