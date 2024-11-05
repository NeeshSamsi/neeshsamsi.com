// Code generated by Slice Machine. DO NOT EDIT.

import type * as prismic from "@prismicio/client"

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] }

type NotesDocumentDataSlicesSlice = CodeBlockSlice | RichTextSlice

/**
 * Content for Notes documents
 */
interface NotesDocumentData {
  /**
   * Title field in *Notes*
   *
   * - **Field Type**: Title
   * - **Placeholder**: *None*
   * - **API ID Path**: notes.title
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  title: prismic.TitleField

  /**
   * Description field in *Notes*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: notes.description
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  description: prismic.KeyTextField

  /**
   * Tags field in *Notes*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: notes.tags
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  tags: prismic.KeyTextField

  /**
   * Slice Zone field in *Notes*
   *
   * - **Field Type**: Slice Zone
   * - **Placeholder**: *None*
   * - **API ID Path**: notes.slices[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#slices
   */
  slices: prismic.SliceZone<NotesDocumentDataSlicesSlice> /**
   * Meta Title field in *Notes*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A title of the page used for social media and search engines
   * - **API ID Path**: notes.meta_title
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  meta_title: prismic.KeyTextField

  /**
   * Meta Description field in *Notes*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A brief summary of the page
   * - **API ID Path**: notes.meta_description
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  meta_description: prismic.KeyTextField

  /**
   * Meta Image field in *Notes*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: notes.meta_image
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  meta_image: prismic.ImageField<never>
}

/**
 * Notes document from Prismic
 *
 * - **API ID**: `notes`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type NotesDocument<Lang extends string = string> =
  prismic.PrismicDocumentWithUID<Simplify<NotesDocumentData>, "notes", Lang>

type PageDocumentDataSlicesSlice =
  | NotesSlice
  | PageHeadingSlice
  | AboutSlice
  | ReviewsSlice
  | WorkSlice
  | HeroSlice

/**
 * Content for Page documents
 */
interface PageDocumentData {
  /**
   * Slice Zone field in *Page*
   *
   * - **Field Type**: Slice Zone
   * - **Placeholder**: *None*
   * - **API ID Path**: page.slices[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#slices
   */
  slices: prismic.SliceZone<PageDocumentDataSlicesSlice> /**
   * Meta Title field in *Page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A title of the page used for social media and search engines
   * - **API ID Path**: page.meta_title
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  meta_title: prismic.KeyTextField

  /**
   * Meta Description field in *Page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A brief summary of the page
   * - **API ID Path**: page.meta_description
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  meta_description: prismic.KeyTextField

  /**
   * Meta Image field in *Page*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: page.meta_image
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  meta_image: prismic.ImageField<never>
}

/**
 * Page document from Prismic
 *
 * - **API ID**: `page`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type PageDocument<Lang extends string = string> =
  prismic.PrismicDocumentWithUID<Simplify<PageDocumentData>, "page", Lang>

type PlayDocumentDataSlicesSlice = RichTextSlice | CodeBlockSlice

/**
 * Content for Play documents
 */
interface PlayDocumentData {
  /**
   * Cover Image field in *Play*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: play.image
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  image: prismic.ImageField<never>

  /**
   * Title field in *Play*
   *
   * - **Field Type**: Title
   * - **Placeholder**: *None*
   * - **API ID Path**: play.title
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  title: prismic.TitleField

  /**
   * Description field in *Play*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: play.description
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  description: prismic.KeyTextField

  /**
   * Tags field in *Play*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: play.tags
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  tags: prismic.KeyTextField

  /**
   * Call to Action field in *Play*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: play.cta
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  cta: prismic.LinkField

  /**
   * Slice Zone field in *Play*
   *
   * - **Field Type**: Slice Zone
   * - **Placeholder**: *None*
   * - **API ID Path**: play.slices[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#slices
   */
  slices: prismic.SliceZone<PlayDocumentDataSlicesSlice> /**
   * Meta Title field in *Play*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A title of the page used for social media and search engines
   * - **API ID Path**: play.meta_title
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  meta_title: prismic.KeyTextField

  /**
   * Meta Description field in *Play*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A brief summary of the page
   * - **API ID Path**: play.meta_description
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  meta_description: prismic.KeyTextField

  /**
   * Meta Image field in *Play*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: play.meta_image
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  meta_image: prismic.ImageField<never>
}

/**
 * Play document from Prismic
 *
 * - **API ID**: `play`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type PlayDocument<Lang extends string = string> =
  prismic.PrismicDocumentWithUID<Simplify<PlayDocumentData>, "play", Lang>

/**
 * Item in *Site Settings → Navigation Links*
 */
export interface SettingsDocumentDataNavLinksItem {
  /**
   * Link field in *Site Settings → Navigation Links*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: settings.navLinks[].link
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  link: prismic.LinkField
}

/**
 * Content for Site Settings documents
 */
interface SettingsDocumentData {
  /**
   * Navigation Links field in *Site Settings*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: settings.navLinks[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#group
   */
  navLinks: prismic.GroupField<Simplify<SettingsDocumentDataNavLinksItem>>

  /**
   * Email field in *Site Settings*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: settings.email
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  email: prismic.KeyTextField

  /**
   * YouTube field in *Site Settings*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: settings.youtube
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  youtube: prismic.LinkField

  /**
   * GitHub field in *Site Settings*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: settings.github
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  github: prismic.LinkField

  /**
   * LinkedIn field in *Site Settings*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: settings.linkedin
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  linkedin: prismic.LinkField

  /**
   * Instagram field in *Site Settings*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: settings.instagram
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  instagram: prismic.LinkField

  /**
   * Footer Image field in *Site Settings*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: settings.footerImage
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  footerImage: prismic.ImageField<never> /**
   * Title (Default) field in *Site Settings*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: settings.title
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  title: prismic.KeyTextField

  /**
   * Description (Default) field in *Site Settings*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: settings.description
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  description: prismic.KeyTextField

  /**
   * Twitter field in *Site Settings*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: settings.twitter
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  twitter: prismic.KeyTextField

  /**
   * Site Name field in *Site Settings*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: settings.siteName
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  siteName: prismic.KeyTextField

  /**
   * Theme Color field in *Site Settings*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: settings.themeColor
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  themeColor: prismic.KeyTextField

  /**
   * OG Image field in *Site Settings*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: settings.ogImage
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  ogImage: prismic.ImageField<never>
}

/**
 * Site Settings document from Prismic
 *
 * - **API ID**: `settings`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type SettingsDocument<Lang extends string = string> =
  prismic.PrismicDocumentWithoutUID<
    Simplify<SettingsDocumentData>,
    "settings",
    Lang
  >

type WorkDocumentDataSlicesSlice = RichTextSlice

/**
 * Content for Work documents
 */
interface WorkDocumentData {
  /**
   * Cover Image field in *Work*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: work.image
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  image: prismic.ImageField<never>

  /**
   * Title field in *Work*
   *
   * - **Field Type**: Title
   * - **Placeholder**: *None*
   * - **API ID Path**: work.title
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  title: prismic.TitleField

  /**
   * Description field in *Work*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: work.description
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  description: prismic.KeyTextField

  /**
   * Tags field in *Work*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: work.tags
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  tags: prismic.KeyTextField

  /**
   * Call to Action field in *Work*
   *
   * - **Field Type**: Link
   * - **Placeholder**: *None*
   * - **API ID Path**: work.cta
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  cta: prismic.LinkField

  /**
   * Publish Date field in *Work*
   *
   * - **Field Type**: Date
   * - **Placeholder**: *None*
   * - **API ID Path**: work.pubDate
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#date
   */
  pubDate: prismic.DateField

  /**
   * Slice Zone field in *Work*
   *
   * - **Field Type**: Slice Zone
   * - **Placeholder**: *None*
   * - **API ID Path**: work.slices[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#slices
   */
  slices: prismic.SliceZone<WorkDocumentDataSlicesSlice> /**
   * Meta Title field in *Work*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A title of the page used for social media and search engines
   * - **API ID Path**: work.meta_title
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  meta_title: prismic.KeyTextField

  /**
   * Meta Description field in *Work*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A brief summary of the page
   * - **API ID Path**: work.meta_description
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  meta_description: prismic.KeyTextField

  /**
   * Meta Image field in *Work*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: work.meta_image
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  meta_image: prismic.ImageField<never>
}

/**
 * Work document from Prismic
 *
 * - **API ID**: `work`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type WorkDocument<Lang extends string = string> =
  prismic.PrismicDocumentWithUID<Simplify<WorkDocumentData>, "work", Lang>

export type AllDocumentTypes =
  | NotesDocument
  | PageDocument
  | PlayDocument
  | SettingsDocument
  | WorkDocument

/**
 * Item in *About → Default → Primary → Cards*
 */
export interface AboutSliceDefaultPrimaryCardsItem {
  /**
   * Card Heading field in *About → Default → Primary → Cards*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: about.default.primary.cards[].heading
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  heading: prismic.KeyTextField

  /**
   * Content field in *About → Default → Primary → Cards*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: about.default.primary.cards[].content
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  content: prismic.KeyTextField
}

/**
 * Primary content in *About → Default → Primary*
 */
export interface AboutSliceDefaultPrimary {
  /**
   * Section Heading field in *About → Default → Primary*
   *
   * - **Field Type**: Title
   * - **Placeholder**: *None*
   * - **API ID Path**: about.default.primary.heading
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  heading: prismic.TitleField

  /**
   * Cards field in *About → Default → Primary*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: about.default.primary.cards[]
   * - **Documentation**: https://prismic.io/docs/field#group
   */
  cards: prismic.GroupField<Simplify<AboutSliceDefaultPrimaryCardsItem>>
}

/**
 * Default variation for About Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type AboutSliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<AboutSliceDefaultPrimary>,
  never
>

/**
 * Slice variation for *About*
 */
type AboutSliceVariation = AboutSliceDefault

/**
 * About Shared Slice
 *
 * - **API ID**: `about`
 * - **Description**: About
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type AboutSlice = prismic.SharedSlice<"about", AboutSliceVariation>

/**
 * Primary content in *CodeBlock → Default → Primary*
 */
export interface CodeBlockSliceDefaultPrimary {
  /**
   * Language field in *CodeBlock → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: TypeScript
   * - **API ID Path**: code_block.default.primary.lang
   * - **Documentation**: https://prismic.io/docs/field#select
   */
  lang: prismic.SelectField<
    "TypeScript" | "JavaScript" | "HTML" | "CSS" | "Terminal" | "JSON",
    "filled"
  >

  /**
   * Code field in *CodeBlock → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: code_block.default.primary.code
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  code: prismic.RichTextField
}

/**
 * Default variation for CodeBlock Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type CodeBlockSliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<CodeBlockSliceDefaultPrimary>,
  never
>

/**
 * Slice variation for *CodeBlock*
 */
type CodeBlockSliceVariation = CodeBlockSliceDefault

/**
 * CodeBlock Shared Slice
 *
 * - **API ID**: `code_block`
 * - **Description**: CodeBlock
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type CodeBlockSlice = prismic.SharedSlice<
  "code_block",
  CodeBlockSliceVariation
>

/**
 * Primary content in *Hero → Default → Primary*
 */
export interface HeroSliceDefaultPrimary {
  /**
   * Hi I'm .. field in *Hero → Default → Primary*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: hero.default.primary.name
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  name: prismic.KeyTextField

  /**
   * Description field in *Hero → Default → Primary*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: hero.default.primary.description
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  description: prismic.KeyTextField

  /**
   * Work CTA field in *Hero → Default → Primary*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: hero.default.primary.workCta
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  workCta: prismic.KeyTextField

  /**
   * Contact CTA field in *Hero → Default → Primary*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: hero.default.primary.contactCta
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  contactCta: prismic.KeyTextField
}

/**
 * Default variation for Hero Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type HeroSliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<HeroSliceDefaultPrimary>,
  never
>

/**
 * Slice variation for *Hero*
 */
type HeroSliceVariation = HeroSliceDefault

/**
 * Hero Shared Slice
 *
 * - **API ID**: `hero`
 * - **Description**: Hero
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type HeroSlice = prismic.SharedSlice<"hero", HeroSliceVariation>

/**
 * Primary content in *Notes → Default → Primary*
 */
export interface NotesSliceDefaultPrimary {
  /**
   * Section Heading field in *Notes → Default → Primary*
   *
   * - **Field Type**: Title
   * - **Placeholder**: Will not show if left empty
   * - **API ID Path**: notes.default.primary.heading
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  heading: prismic.TitleField

  /**
   * Limit field in *Notes → Default → Primary*
   *
   * - **Field Type**: Number
   * - **Placeholder**: *None*
   * - **API ID Path**: notes.default.primary.limit
   * - **Documentation**: https://prismic.io/docs/field#number
   */
  limit: prismic.NumberField

  /**
   * CTA Text field in *Notes → Default → Primary*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: notes.default.primary.cta
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  cta: prismic.KeyTextField
}

/**
 * Default variation for Notes Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type NotesSliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<NotesSliceDefaultPrimary>,
  never
>

/**
 * Slice variation for *Notes*
 */
type NotesSliceVariation = NotesSliceDefault

/**
 * Notes Shared Slice
 *
 * - **API ID**: `notes`
 * - **Description**: Notes
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type NotesSlice = prismic.SharedSlice<"notes", NotesSliceVariation>

/**
 * Primary content in *PageHeading → Default → Primary*
 */
export interface PageHeadingSliceDefaultPrimary {
  /**
   * Heading field in *PageHeading → Default → Primary*
   *
   * - **Field Type**: Title
   * - **Placeholder**: *None*
   * - **API ID Path**: page_heading.default.primary.heading
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  heading: prismic.TitleField
}

/**
 * Default variation for PageHeading Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type PageHeadingSliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<PageHeadingSliceDefaultPrimary>,
  never
>

/**
 * Slice variation for *PageHeading*
 */
type PageHeadingSliceVariation = PageHeadingSliceDefault

/**
 * PageHeading Shared Slice
 *
 * - **API ID**: `page_heading`
 * - **Description**: PageHeading
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type PageHeadingSlice = prismic.SharedSlice<
  "page_heading",
  PageHeadingSliceVariation
>

/**
 * Primary content in *Play → Default → Primary*
 */
export interface PlaySliceDefaultPrimary {
  /**
   * Section Heading field in *Play → Default → Primary*
   *
   * - **Field Type**: Title
   * - **Placeholder**: Will not show if left empty
   * - **API ID Path**: play.default.primary.heading
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  heading: prismic.TitleField

  /**
   * Limit field in *Play → Default → Primary*
   *
   * - **Field Type**: Number
   * - **Placeholder**: *None*
   * - **API ID Path**: play.default.primary.limit
   * - **Documentation**: https://prismic.io/docs/field#number
   */
  limit: prismic.NumberField

  /**
   * CTA Text field in *Play → Default → Primary*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: play.default.primary.cta
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  cta: prismic.KeyTextField
}

/**
 * Default variation for Play Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type PlaySliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<PlaySliceDefaultPrimary>,
  never
>

/**
 * Slice variation for *Play*
 */
type PlaySliceVariation = PlaySliceDefault

/**
 * Play Shared Slice
 *
 * - **API ID**: `play`
 * - **Description**: Play
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type PlaySlice = prismic.SharedSlice<"play", PlaySliceVariation>

/**
 * Item in *Reviews → Default → Primary → Reviews*
 */
export interface ReviewsSliceDefaultPrimaryReviewsItem {
  /**
   * Avatar field in *Reviews → Default → Primary → Reviews*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: reviews.default.primary.reviews[].avatar
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  avatar: prismic.ImageField<never>

  /**
   * Name field in *Reviews → Default → Primary → Reviews*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: reviews.default.primary.reviews[].name
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  name: prismic.KeyTextField

  /**
   * Designation field in *Reviews → Default → Primary → Reviews*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: reviews.default.primary.reviews[].designation
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  designation: prismic.KeyTextField

  /**
   * Review field in *Reviews → Default → Primary → Reviews*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: reviews.default.primary.reviews[].review
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  review: prismic.KeyTextField
}

/**
 * Primary content in *Reviews → Default → Primary*
 */
export interface ReviewsSliceDefaultPrimary {
  /**
   * Section Heading field in *Reviews → Default → Primary*
   *
   * - **Field Type**: Title
   * - **Placeholder**: *None*
   * - **API ID Path**: reviews.default.primary.heading
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  heading: prismic.TitleField

  /**
   * Reviews field in *Reviews → Default → Primary*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: reviews.default.primary.reviews[]
   * - **Documentation**: https://prismic.io/docs/field#group
   */
  reviews: prismic.GroupField<Simplify<ReviewsSliceDefaultPrimaryReviewsItem>>
}

/**
 * Default variation for Reviews Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type ReviewsSliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<ReviewsSliceDefaultPrimary>,
  never
>

/**
 * Slice variation for *Reviews*
 */
type ReviewsSliceVariation = ReviewsSliceDefault

/**
 * Reviews Shared Slice
 *
 * - **API ID**: `reviews`
 * - **Description**: Reviews
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type ReviewsSlice = prismic.SharedSlice<"reviews", ReviewsSliceVariation>

/**
 * Primary content in *RichText → Default → Primary*
 */
export interface RichTextSliceDefaultPrimary {
  /**
   * Content field in *RichText → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: rich_text.default.primary.content
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  content: prismic.RichTextField
}

/**
 * Default variation for RichText Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type RichTextSliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<RichTextSliceDefaultPrimary>,
  never
>

/**
 * Slice variation for *RichText*
 */
type RichTextSliceVariation = RichTextSliceDefault

/**
 * RichText Shared Slice
 *
 * - **API ID**: `rich_text`
 * - **Description**: RichText
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type RichTextSlice = prismic.SharedSlice<
  "rich_text",
  RichTextSliceVariation
>

/**
 * Primary content in *Work → Default → Primary*
 */
export interface WorkSliceDefaultPrimary {
  /**
   * Section Heading field in *Work → Default → Primary*
   *
   * - **Field Type**: Title
   * - **Placeholder**: Will not show if left empty
   * - **API ID Path**: work.default.primary.heading
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  heading: prismic.TitleField

  /**
   * Limit field in *Work → Default → Primary*
   *
   * - **Field Type**: Number
   * - **Placeholder**: Number of works displayed
   * - **API ID Path**: work.default.primary.limit
   * - **Documentation**: https://prismic.io/docs/field#number
   */
  limit: prismic.NumberField

  /**
   * CTA Text field in *Work → Default → Primary*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: work.default.primary.cta
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  cta: prismic.KeyTextField
}

/**
 * Default variation for Work Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type WorkSliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<WorkSliceDefaultPrimary>,
  never
>

/**
 * Slice variation for *Work*
 */
type WorkSliceVariation = WorkSliceDefault

/**
 * Work Shared Slice
 *
 * - **API ID**: `work`
 * - **Description**: Work
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type WorkSlice = prismic.SharedSlice<"work", WorkSliceVariation>

declare module "@prismicio/client" {
  interface CreateClient {
    (
      repositoryNameOrEndpoint: string,
      options?: prismic.ClientConfig,
    ): prismic.Client<AllDocumentTypes>
  }

  interface CreateWriteClient {
    (
      repositoryNameOrEndpoint: string,
      options: prismic.WriteClientConfig,
    ): prismic.WriteClient<AllDocumentTypes>
  }

  interface CreateMigration {
    (): prismic.Migration<AllDocumentTypes>
  }

  namespace Content {
    export type {
      NotesDocument,
      NotesDocumentData,
      NotesDocumentDataSlicesSlice,
      PageDocument,
      PageDocumentData,
      PageDocumentDataSlicesSlice,
      PlayDocument,
      PlayDocumentData,
      PlayDocumentDataSlicesSlice,
      SettingsDocument,
      SettingsDocumentData,
      SettingsDocumentDataNavLinksItem,
      WorkDocument,
      WorkDocumentData,
      WorkDocumentDataSlicesSlice,
      AllDocumentTypes,
      AboutSlice,
      AboutSliceDefaultPrimaryCardsItem,
      AboutSliceDefaultPrimary,
      AboutSliceVariation,
      AboutSliceDefault,
      CodeBlockSlice,
      CodeBlockSliceDefaultPrimary,
      CodeBlockSliceVariation,
      CodeBlockSliceDefault,
      HeroSlice,
      HeroSliceDefaultPrimary,
      HeroSliceVariation,
      HeroSliceDefault,
      NotesSlice,
      NotesSliceDefaultPrimary,
      NotesSliceVariation,
      NotesSliceDefault,
      PageHeadingSlice,
      PageHeadingSliceDefaultPrimary,
      PageHeadingSliceVariation,
      PageHeadingSliceDefault,
      PlaySlice,
      PlaySliceDefaultPrimary,
      PlaySliceVariation,
      PlaySliceDefault,
      ReviewsSlice,
      ReviewsSliceDefaultPrimaryReviewsItem,
      ReviewsSliceDefaultPrimary,
      ReviewsSliceVariation,
      ReviewsSliceDefault,
      RichTextSlice,
      RichTextSliceDefaultPrimary,
      RichTextSliceVariation,
      RichTextSliceDefault,
      WorkSlice,
      WorkSliceDefaultPrimary,
      WorkSliceVariation,
      WorkSliceDefault,
    }
  }
}
