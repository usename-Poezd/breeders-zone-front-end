import {ProductPage} from "../../components/pages";
import {DataService} from "../../services";

export default ProductPage;

export const getServerSideProps = async (ctx) => {
    const dataService = await new DataService();
    const product = await dataService.getProduct(ctx.query.id, true);

    return {
        props: {
            product
        }
    }
};