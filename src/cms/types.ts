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
  url: string
  alt?: string
  copyright?: string
  dimensions: {
    width: number
    height: number
  }
}

