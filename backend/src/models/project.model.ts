export interface IProject{
    id?: string;
    title: string;
    slug: string;
    short_description: string;
    content_markdown: string;
    github_url?: string;
    live_url?: string;
    thumbnail_image_url: string;
    created_at?: string;
}