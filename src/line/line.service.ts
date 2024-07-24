import LineProvider from "../provider/line.provider";

class LineService extends LineProvider {

    lineAlert = async (message: string) => {
       return await this.lineNotify(message)
    }

}

export default LineService