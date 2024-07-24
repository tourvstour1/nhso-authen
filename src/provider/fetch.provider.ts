import type { FetchPostMode, FetchGettMode, LinePostModel } from "./provider.entity"

class FetchProvider {
    private url = Bun.env['URL_MAIN'] as unknown as string
    
    fetchPostLine = async (post: LinePostModel) => {
        const notifyOptions = {
            method: 'post',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                'Authorization': `Bearer ${post.token}`
            },
            body: new URLSearchParams({
                message: post.text
            })
        }

        const result = await fetch(Bun.env['LINE_NONIFY_END_POINT'] as unknown as string, {
            ...notifyOptions
        })
        return result
    }

    fetchPost = async (post: FetchPostMode) => {
        const postOptions = {
            method: 'post',
            headers: {
                'Cookie': `${post.cookie}`,
                'Content-Type': 'application/json;charset=UTF-8'
            },

            body: JSON.stringify(post.body)
        }
        const result = await fetch(this.url + post.path, {
            ...postOptions
        })
        return result
    }

    fetchGet = async (get: FetchGettMode) => {
        const getOption = {
            method: 'get',
            headers: {
                'Cookie': `${get.cookie}`,
                'Content-Type': 'application/json'
            }
        }

        const result = await fetch(this.url + get.path + get.query, {
            ...getOption
        })

        return result
    }
}

export default FetchProvider