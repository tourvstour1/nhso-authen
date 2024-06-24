import type { FetchPostMode, FetchGettMode } from "./provider.entity"

class FetchProvider {
    private url = Bun.env['URL_MAIN'] as unknown as string

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