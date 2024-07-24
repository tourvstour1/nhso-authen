import FetchProvider from "./fetch.provider";
import type { LinePostModel } from "./provider.entity";

class LineProvider extends FetchProvider {

    lineNotify = async (message: string) => {
        console.log(message);
        const token_id = Bun.env['LINE_TOKEN'] as unknown as string
        const post: LinePostModel = {
            text: message,
            token: token_id
        }
        const resJson = await this.fetchPostLine(post)
        return resJson
    }
}

export default LineProvider