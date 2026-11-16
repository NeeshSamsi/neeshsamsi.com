import type * as prismic from "@prismicio/client";

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] };


type PickContentRelationshipFieldData<
	TRelationship extends prismic.CustomTypeModelFetchCustomTypeLevel1 | prismic.CustomTypeModelFetchCustomTypeLevel2 | prismic.CustomTypeModelFetchGroupLevel1 | prismic.CustomTypeModelFetchGroupLevel2,
	TData extends Record<string, prismic.AnyRegularField | prismic.GroupField | prismic.NestedGroupField | prismic.SliceZone>,
	TLang extends string
> = |
	// Content relationship fields
	{
		[TSubRelationship in Extract<
			TRelationship["fields"][number], prismic.CustomTypeModelFetchContentRelationshipLevel1
		> as TSubRelationship["id"]]:
			ContentRelationshipFieldWithData<TSubRelationship["customtypes"], TLang>;
	} &
	// Group
	{
		[TGroup in Extract<
			TRelationship["fields"][number], prismic.CustomTypeModelFetchGroupLevel1 | prismic.CustomTypeModelFetchGroupLevel2
		> as TGroup["id"]]:
			TData[TGroup["id"]] extends prismic.GroupField<infer TGroupData>
				? prismic.GroupField<PickContentRelationshipFieldData<TGroup, TGroupData, TLang>>
				: never
	} &
	// Other fields
	{
		[TFieldKey in Extract<TRelationship["fields"][number], string>]:
			TFieldKey extends keyof TData ? TData[TFieldKey] : never;
	};

type ContentRelationshipFieldWithData<
	TCustomType extends readonly (prismic.CustomTypeModelFetchCustomTypeLevel1 | string)[] | readonly (prismic.CustomTypeModelFetchCustomTypeLevel2 | string)[],
	TLang extends string = string
> = {
	[ID in Exclude<TCustomType[number], string>["id"]]:
		prismic.ContentRelationshipField<
			ID,
			TLang,
			PickContentRelationshipFieldData<
				Extract<TCustomType[number], { id: ID }>,
				Extract<prismic.Content.AllDocumentTypes, { type: ID }>["data"],
				TLang
			>
		>
}[Exclude<TCustomType[number], string>["id"]];

type NotesDocumentDataSlicesSlice = CodeBlockSlice | TextContentSlice

/**
 * Content for Note documents
 */
interface NotesDocumentData {
	/**
	 * Title field in *Note*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: notes.title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	title: prismic.RichTextField;
	
	/**
	 * Description field in *Note*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: notes.description
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	description: prismic.KeyTextField;
	
	/**
	 * Tags field in *Note*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: notes.tags
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	tags: prismic.KeyTextField;
	
	/**
	 * Slice Zone field in *Note*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: notes.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<NotesDocumentDataSlicesSlice>;/**
	 * Meta Title field in *Note*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: notes.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Note*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: notes.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Note*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: notes.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Note document from Prismic
 *
 * - **API ID**: `notes`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type NotesDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<NotesDocumentData>, "notes", Lang>;

type PageDocumentDataSlicesSlice = ProjectShowcaseSlice | FeaturedProjectSlice | NotesSlice | PageHeadingSlice

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
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<PageDocumentDataSlicesSlice>;/**
	 * Meta Title field in *Page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: page.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: page.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Page*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: page.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Page document from Prismic
 *
 * - **API ID**: `page`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type PageDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<PageDocumentData>, "page", Lang>;

type ProjectDocumentDataSlicesSlice = ExternalLinkCalloutSlice | MediaContentSlice | ProjectOverviewSlice | TextContentSlice

/**
 * Content for Project documents
 */
interface ProjectDocumentData {
	/**
	 * Primary Cover Image (Mockup) field in *Project*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project.image
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Secondary Cover Image (Hover) field in *Project*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project.hoverImage
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	hoverImage: prismic.ImageField<never>;
	
	/**
	 * Subtitle field in *Project*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Ecommerce, UI UX, Visual design
	 * - **API ID Path**: project.subtitle
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	subtitle: prismic.KeyTextField;
	
	/**
	 * Title field in *Project*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Website Redesign for ...
	 * - **API ID Path**: project.title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Project Type field in *Project*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: Exploration & Play
	 * - **API ID Path**: project.type
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	type: prismic.SelectField<"Exploration & Play" | "Client Work", "filled">;
	
	/**
	 * Published Date field in *Project*
	 *
	 * - **Field Type**: Date
	 * - **Placeholder**: Today
	 * - **API ID Path**: project.publishedDate
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/date
	 */
	publishedDate: prismic.DateField;
	
	/**
	 * Slice Zone field in *Project*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<ProjectDocumentDataSlicesSlice>;/**
	 * Meta Title field in *Project*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: project.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Project*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: project.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Project*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Project document from Prismic
 *
 * - **API ID**: `project`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type ProjectDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<ProjectDocumentData>, "project", Lang>;

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
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Item in *Site Settings → Contact Widget*
 */
export interface SettingsDocumentDataContactItem {
	/**
	 * Image field in *Site Settings → Contact Widget*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.contact[].image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Call to Action field in *Site Settings → Contact Widget*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.contact[].ctaText
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	ctaText: prismic.KeyTextField;
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
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	navLinks: prismic.GroupField<Simplify<SettingsDocumentDataNavLinksItem>>;
	
	/**
	 * Email field in *Site Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.email
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	email: prismic.KeyTextField;
	
	/**
	 * YouTube field in *Site Settings*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.youtube
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	youtube: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * GitHub field in *Site Settings*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.github
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	github: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * LinkedIn field in *Site Settings*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.linkedin
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	linkedin: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Instagram field in *Site Settings*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.instagram
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	instagram: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Contact Widget field in *Site Settings*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.contact[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	contact: prismic.GroupField<Simplify<SettingsDocumentDataContactItem>>;/**
	 * Title (Default) field in *Site Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Description (Default) field in *Site Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	description: prismic.KeyTextField;
	
	/**
	 * Twitter field in *Site Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.twitter
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	twitter: prismic.KeyTextField;
	
	/**
	 * Site Name field in *Site Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.siteName
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	siteName: prismic.KeyTextField;
	
	/**
	 * Theme Color field in *Site Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.themeColor
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	themeColor: prismic.KeyTextField;
	
	/**
	 * OG Image field in *Site Settings*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.ogImage
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	ogImage: prismic.ImageField<never>;
}

/**
 * Site Settings document from Prismic
 *
 * - **API ID**: `settings`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type SettingsDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<SettingsDocumentData>, "settings", Lang>;

export type AllDocumentTypes = NotesDocument | PageDocument | ProjectDocument | SettingsDocument;

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
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	lang: prismic.SelectField<"TypeScript" | "JavaScript" | "HTML" | "CSS" | "Terminal" | "JSON", "filled">;
	
	/**
	 * Code field in *CodeBlock → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: code_block.default.primary.code
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	code: prismic.RichTextField;
}

/**
 * Default variation for CodeBlock Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type CodeBlockSliceDefault = prismic.SharedSliceVariation<"default", Simplify<CodeBlockSliceDefaultPrimary>, never>;

/**
 * Slice variation for *CodeBlock*
 */
type CodeBlockSliceVariation = CodeBlockSliceDefault

/**
 * CodeBlock Shared Slice
 *
 * - **API ID**: `code_block`
 * - **Description**: CodeBlock
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type CodeBlockSlice = prismic.SharedSlice<"code_block", CodeBlockSliceVariation>;

/**
 * Primary content in *ExternalLinkCallout → Default → Primary*
 */
export interface ExternalLinkCalloutSliceDefaultPrimary {
	/**
	 * Call to Action field in *ExternalLinkCallout → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: external_link_callout.default.primary.ctaText
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	ctaText: prismic.KeyTextField;
	
	/**
	 * Link field in *ExternalLinkCallout → Default → Primary*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: external_link_callout.default.primary.link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Default variation for ExternalLinkCallout Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ExternalLinkCalloutSliceDefault = prismic.SharedSliceVariation<"default", Simplify<ExternalLinkCalloutSliceDefaultPrimary>, never>;

/**
 * Slice variation for *ExternalLinkCallout*
 */
type ExternalLinkCalloutSliceVariation = ExternalLinkCalloutSliceDefault

/**
 * ExternalLinkCallout Shared Slice
 *
 * - **API ID**: `external_link_callout`
 * - **Description**: ExternalLinkCallout
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ExternalLinkCalloutSlice = prismic.SharedSlice<"external_link_callout", ExternalLinkCalloutSliceVariation>;

/**
 * Primary content in *FeaturedProject → Default → Primary*
 */
export interface FeaturedProjectSliceDefaultPrimary {
	/**
	 * Featured Project field in *FeaturedProject → Default → Primary*
	 *
	 * - **Field Type**: Content Relationship
	 * - **Placeholder**: *None*
	 * - **API ID Path**: featured_project.default.primary.featuredProject
	 * - **Documentation**: https://prismic.io/docs/fields/content-relationship
	 */
	featuredProject: ContentRelationshipFieldWithData<[{"id":"project","fields":["image","title","type","hoverImage"]}]>;
}

/**
 * Default variation for FeaturedProject Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FeaturedProjectSliceDefault = prismic.SharedSliceVariation<"default", Simplify<FeaturedProjectSliceDefaultPrimary>, never>;

/**
 * Slice variation for *FeaturedProject*
 */
type FeaturedProjectSliceVariation = FeaturedProjectSliceDefault

/**
 * FeaturedProject Shared Slice
 *
 * - **API ID**: `featured_project`
 * - **Description**: FeaturedProject
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FeaturedProjectSlice = prismic.SharedSlice<"featured_project", FeaturedProjectSliceVariation>;

/**
 * Primary content in *MediaContent → SingleMedia → Primary*
 */
export interface MediaContentSliceDefaultPrimary {
	/**
	 * Section Title field in *MediaContent → SingleMedia → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Optional - does not show anything if not provided
	 * - **API ID Path**: media_content.default.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	title: prismic.RichTextField;
	
	/**
	 * Width field in *MediaContent → SingleMedia → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: Full
	 * - **API ID Path**: media_content.default.primary.width
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	width: prismic.SelectField<"Full" | "One Third" | "Half" | "Two Third", "filled">;
	
	/**
	 * Image field in *MediaContent → SingleMedia → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: media_content.default.primary.image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Video (optional - overrides the image, which becomes the poster) field in *MediaContent → SingleMedia → Primary*
	 *
	 * - **Field Type**: Link to Media
	 * - **Placeholder**: *None*
	 * - **API ID Path**: media_content.default.primary.video
	 * - **Documentation**: https://prismic.io/docs/fields/link-to-media
	 */
	video: prismic.LinkToMediaField<prismic.FieldState, never>;
	
	/**
	 * Original Dimensions field in *MediaContent → SingleMedia → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: true
	 * - **API ID Path**: media_content.default.primary.originalDimensions
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	originalDimensions: prismic.BooleanField;
	
	/**
	 * Description field in *MediaContent → SingleMedia → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Optional - does not show anything if not provided
	 * - **API ID Path**: media_content.default.primary.description
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	description: prismic.RichTextField;
}

/**
 * SingleMedia variation for MediaContent Slice
 *
 * - **API ID**: `default`
 * - **Description**: A single image or video
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type MediaContentSliceDefault = prismic.SharedSliceVariation<"default", Simplify<MediaContentSliceDefaultPrimary>, never>;

/**
 * Primary content in *MediaContent → DoubleMedia → Primary*
 */
export interface MediaContentSliceDoubleMediaPrimary {
	/**
	 * Section Title field in *MediaContent → DoubleMedia → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Optional - does not show anything if not provided
	 * - **API ID Path**: media_content.doubleMedia.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	title: prismic.RichTextField;
	
	/**
	 * Layout Type field in *MediaContent → DoubleMedia → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: Half & Half
	 * - **API ID Path**: media_content.doubleMedia.primary.layout
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	layout: prismic.SelectField<"Half & Half" | "Wide Right" | "Wide Left", "filled">;
	
	/**
	 * Image Left field in *MediaContent → DoubleMedia → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: media_content.doubleMedia.primary.image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Video Left (optional - overrides Image Left, which becomes the poster) field in *MediaContent → DoubleMedia → Primary*
	 *
	 * - **Field Type**: Link to Media
	 * - **Placeholder**: *None*
	 * - **API ID Path**: media_content.doubleMedia.primary.video
	 * - **Documentation**: https://prismic.io/docs/fields/link-to-media
	 */
	video: prismic.LinkToMediaField<prismic.FieldState, never>;
	
	/**
	 * Image Right field in *MediaContent → DoubleMedia → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: media_content.doubleMedia.primary.image2
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image2: prismic.ImageField<never>;
	
	/**
	 * Video Right (optional - overrides Image Right, which becomes the poster) field in *MediaContent → DoubleMedia → Primary*
	 *
	 * - **Field Type**: Link to Media
	 * - **Placeholder**: *None*
	 * - **API ID Path**: media_content.doubleMedia.primary.video2
	 * - **Documentation**: https://prismic.io/docs/fields/link-to-media
	 */
	video2: prismic.LinkToMediaField<prismic.FieldState, never>;
	
	/**
	 * Original Dimensions field in *MediaContent → DoubleMedia → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: media_content.doubleMedia.primary.originalDimensions
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	originalDimensions: prismic.BooleanField;
	
	/**
	 * Description field in *MediaContent → DoubleMedia → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Optional - does not show anything if not provided
	 * - **API ID Path**: media_content.doubleMedia.primary.description
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	description: prismic.RichTextField;
}

/**
 * DoubleMedia variation for MediaContent Slice
 *
 * - **API ID**: `doubleMedia`
 * - **Description**: Two slots side by side, each an image or video
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type MediaContentSliceDoubleMedia = prismic.SharedSliceVariation<"doubleMedia", Simplify<MediaContentSliceDoubleMediaPrimary>, never>;

/**
 * Slice variation for *MediaContent*
 */
type MediaContentSliceVariation = MediaContentSliceDefault | MediaContentSliceDoubleMedia

/**
 * MediaContent Shared Slice
 *
 * - **API ID**: `media_content`
 * - **Description**: MediaContent
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type MediaContentSlice = prismic.SharedSlice<"media_content", MediaContentSliceVariation>;

/**
 * Primary content in *Notes → Default → Primary*
 */
export interface NotesSliceDefaultPrimary {
	/**
	 * Section Heading field in *Notes → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Will not show if left empty
	 * - **API ID Path**: notes.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * Limit field in *Notes → Default → Primary*
	 *
	 * - **Field Type**: Number
	 * - **Placeholder**: *None*
	 * - **API ID Path**: notes.default.primary.limit
	 * - **Documentation**: https://prismic.io/docs/fields/number
	 */
	limit: prismic.NumberField;
	
	/**
	 * CTA Text field in *Notes → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: notes.default.primary.cta
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	cta: prismic.KeyTextField;
}

/**
 * Default variation for Notes Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type NotesSliceDefault = prismic.SharedSliceVariation<"default", Simplify<NotesSliceDefaultPrimary>, never>;

/**
 * Slice variation for *Notes*
 */
type NotesSliceVariation = NotesSliceDefault

/**
 * Notes Shared Slice
 *
 * - **API ID**: `notes`
 * - **Description**: Notes
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type NotesSlice = prismic.SharedSlice<"notes", NotesSliceVariation>;

/**
 * Primary content in *PageHeading → Default → Primary*
 */
export interface PageHeadingSliceDefaultPrimary {
	/**
	 * Heading field in *PageHeading → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: page_heading.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
}

/**
 * Default variation for PageHeading Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type PageHeadingSliceDefault = prismic.SharedSliceVariation<"default", Simplify<PageHeadingSliceDefaultPrimary>, never>;

/**
 * Slice variation for *PageHeading*
 */
type PageHeadingSliceVariation = PageHeadingSliceDefault

/**
 * PageHeading Shared Slice
 *
 * - **API ID**: `page_heading`
 * - **Description**: PageHeading
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type PageHeadingSlice = prismic.SharedSlice<"page_heading", PageHeadingSliceVariation>;

/**
 * Item in *ProjectOverview → Default → Primary → Paragraphs*
 */
export interface ProjectOverviewSliceDefaultPrimaryParagraphsItem {
	/**
	 * Title field in *ProjectOverview → Default → Primary → Paragraphs*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project_overview.default.primary.paragraphs[].title
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	title: prismic.RichTextField;
	
	/**
	 * Description field in *ProjectOverview → Default → Primary → Paragraphs*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project_overview.default.primary.paragraphs[].description
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	description: prismic.RichTextField;
}

/**
 * Primary content in *ProjectOverview → Default → Primary*
 */
export interface ProjectOverviewSliceDefaultPrimary {
	/**
	 * Paragraphs field in *ProjectOverview → Default → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project_overview.default.primary.paragraphs[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	paragraphs: prismic.GroupField<Simplify<ProjectOverviewSliceDefaultPrimaryParagraphsItem>>;
}

/**
 * Default variation for ProjectOverview Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ProjectOverviewSliceDefault = prismic.SharedSliceVariation<"default", Simplify<ProjectOverviewSliceDefaultPrimary>, never>;

/**
 * Slice variation for *ProjectOverview*
 */
type ProjectOverviewSliceVariation = ProjectOverviewSliceDefault

/**
 * ProjectOverview Shared Slice
 *
 * - **API ID**: `project_overview`
 * - **Description**: ProjectOverview
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ProjectOverviewSlice = prismic.SharedSlice<"project_overview", ProjectOverviewSliceVariation>;

/**
 * Primary content in *ProjectShowcase → Default → Primary*
 */
export interface ProjectShowcaseSliceDefaultPrimary {
	/**
	 * Section Usage field in *ProjectShowcase → Default → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project_showcase.default.primary.usage
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	usage: prismic.SelectField<"In-line Sections" | "Standalone Page">;
	
	/**
	 * Section Heading field in *ProjectShowcase → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Will not show if left empty
	 * - **API ID Path**: project_showcase.default.primary.heading
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	heading: prismic.RichTextField;
	
	/**
	 * Project Type field in *ProjectShowcase → Default → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: Exploration & Play
	 * - **API ID Path**: project_showcase.default.primary.projectType
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	projectType: prismic.SelectField<"Exploration & Play" | "Client Work", "filled">;
	
	/**
	 * Limit field in *ProjectShowcase → Default → Primary*
	 *
	 * - **Field Type**: Number
	 * - **Placeholder**: Number of projects displayed. Do not set in standalone mode.
	 * - **API ID Path**: project_showcase.default.primary.limit
	 * - **Documentation**: https://prismic.io/docs/fields/number
	 */
	limit: prismic.NumberField;
	
	/**
	 * CTA Text field in *ProjectShowcase → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project_showcase.default.primary.cta
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	cta: prismic.KeyTextField;
	
	/**
	 * Exclude Project field in *ProjectShowcase → Default → Primary*
	 *
	 * - **Field Type**: Content Relationship
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project_showcase.default.primary.exclude
	 * - **Documentation**: https://prismic.io/docs/fields/content-relationship
	 */
	exclude: prismic.ContentRelationshipField<"project">;
}

/**
 * Default variation for ProjectShowcase Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ProjectShowcaseSliceDefault = prismic.SharedSliceVariation<"default", Simplify<ProjectShowcaseSliceDefaultPrimary>, never>;

/**
 * Slice variation for *ProjectShowcase*
 */
type ProjectShowcaseSliceVariation = ProjectShowcaseSliceDefault

/**
 * ProjectShowcase Shared Slice
 *
 * - **API ID**: `project_showcase`
 * - **Description**: ProjectShowcase
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ProjectShowcaseSlice = prismic.SharedSlice<"project_showcase", ProjectShowcaseSliceVariation>;

/**
 * Primary content in *TextContent → Default → Primary*
 */
export interface TextContentSliceDefaultPrimary {
	/**
	 * Section Title field in *TextContent → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Optional - does not show anything if not provided
	 * - **API ID Path**: text_content.default.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	title: prismic.RichTextField;
	
	/**
	 * Content field in *TextContent → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: text_content.default.primary.content
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	content: prismic.RichTextField;
}

/**
 * Default variation for TextContent Slice
 *
 * - **API ID**: `default`
 * - **Description**: An optional section title with rich text content
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type TextContentSliceDefault = prismic.SharedSliceVariation<"default", Simplify<TextContentSliceDefaultPrimary>, never>;

/**
 * Slice variation for *TextContent*
 */
type TextContentSliceVariation = TextContentSliceDefault

/**
 * TextContent Shared Slice
 *
 * - **API ID**: `text_content`
 * - **Description**: TextContent
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type TextContentSlice = prismic.SharedSlice<"text_content", TextContentSliceVariation>;

declare module "@prismicio/client" {
	interface CreateClient {
		(repositoryNameOrEndpoint: string, options?: prismic.ClientConfig): prismic.Client<AllDocumentTypes>;
	}
	
	interface CreateWriteClient {
		(repositoryNameOrEndpoint: string, options: prismic.WriteClientConfig): prismic.WriteClient<AllDocumentTypes>;
	}
	
	interface CreateMigration {
		(): prismic.Migration<AllDocumentTypes>;
	}
	
	namespace Content {
		export type {
			NotesDocument,
			NotesDocumentData,
			NotesDocumentDataSlicesSlice,
			PageDocument,
			PageDocumentData,
			PageDocumentDataSlicesSlice,
			ProjectDocument,
			ProjectDocumentData,
			ProjectDocumentDataSlicesSlice,
			SettingsDocument,
			SettingsDocumentData,
			SettingsDocumentDataNavLinksItem,
			SettingsDocumentDataContactItem,
			AllDocumentTypes,
			CodeBlockSlice,
			CodeBlockSliceDefaultPrimary,
			CodeBlockSliceVariation,
			CodeBlockSliceDefault,
			ExternalLinkCalloutSlice,
			ExternalLinkCalloutSliceDefaultPrimary,
			ExternalLinkCalloutSliceVariation,
			ExternalLinkCalloutSliceDefault,
			FeaturedProjectSlice,
			FeaturedProjectSliceDefaultPrimary,
			FeaturedProjectSliceVariation,
			FeaturedProjectSliceDefault,
			MediaContentSlice,
			MediaContentSliceDefaultPrimary,
			MediaContentSliceDoubleMediaPrimary,
			MediaContentSliceVariation,
			MediaContentSliceDefault,
			MediaContentSliceDoubleMedia,
			NotesSlice,
			NotesSliceDefaultPrimary,
			NotesSliceVariation,
			NotesSliceDefault,
			PageHeadingSlice,
			PageHeadingSliceDefaultPrimary,
			PageHeadingSliceVariation,
			PageHeadingSliceDefault,
			ProjectOverviewSlice,
			ProjectOverviewSliceDefaultPrimaryParagraphsItem,
			ProjectOverviewSliceDefaultPrimary,
			ProjectOverviewSliceVariation,
			ProjectOverviewSliceDefault,
			ProjectShowcaseSlice,
			ProjectShowcaseSliceDefaultPrimary,
			ProjectShowcaseSliceVariation,
			ProjectShowcaseSliceDefault,
			TextContentSlice,
			TextContentSliceDefaultPrimary,
			TextContentSliceVariation,
			TextContentSliceDefault
		}
	}
}