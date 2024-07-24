export interface FetchPostMode {
    path: string,
    body: any
    cookie?: string | ''
}

export interface FetchGettMode {
    path: string
    query?: string
    cookie: string | undefined
}

export interface LinePostModel {
    text: string
    token: string
}