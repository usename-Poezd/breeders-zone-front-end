import {DefaultSeoProps} from "next-seo";

const prepareSeo = (data: any): DefaultSeoProps => {
    return {
        ...data,
        additionalMetaTags: [
            {
                name: 'keywords',
                content: data.keywords
            }
        ]
    }

};

export {
    prepareSeo
}
