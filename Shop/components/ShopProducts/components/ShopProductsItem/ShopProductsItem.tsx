import * as React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGenderless, faMars, faPen, faTimes, faVenus} from "@fortawesome/free-solid-svg-icons";
import {activeShopProduct, deleteProduct} from "../../../../../redux/Shop";
import Link from "next/link";
import {connect} from "react-redux";
import {DataService, Pipes} from "../../../../../services";
import {compareMorph, currencyOptions} from "../../../../../utils";
import Switch from "react-switch";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import * as moment from "moment";
import * as currency from "currency.js";
import {mainColorHover, secondColor} from "../../../../../variables/style-variables";
import getSymbolFromCurrency from "currency-symbol-map";
import {FC} from "react";
import {ShopProductsItemPropsType} from "./types";
const dataService = new DataService();
const debounceUpdate = AwesomeDebouncePromise(
    dataService.updateProduct,
    300
);

const ShopProductsItemComponent: FC<ShopProductsItemPropsType> = (props) => {
    const {
        id,
        article,
        name,
        sex,
        cb,
        is_active,
        morphs,
        price,
        kind,
        subcategory,
        locality,
        preview,
        deleteProduct,
        activeShopProduct
    } = props;

    const delProduct = () => {
        deleteProduct(id);
    };
    const handleSwitch = () => {
        activeShopProduct(id);
        debounceUpdate({is_active: !is_active}, id);
    };

    const { toTraitClass } = new Pipes();

    return (
        <div className="products-item feather-shadow d-flex">
            <div className="products-item-img">
                {
                    preview ?
                        <img
                            src={preview.img_src}
                            alt={name}
                            className="img-fluid"
                        />
                        : null
                }
            </div>
            <div className="products-item-info">
                <h2 className="font-weight-bold">{name}</h2>
                <ul>
                    <li className="product-card-info-item flex-row align-items-center">
                        <h3 className="title-sex">{article ? 'Уникальный индификатор' : 'Номер в системе'}:</h3>
                        <h3 className="info info-text">{article ? article : id}</h3>
                    </li>
                    <li className="product-card-info-item flex-row align-items-center">
                        <h3 className="title-sex">Категория:</h3>
                        <h3 className="info info-text">{kind.title_eng}</h3>
                    </li>
                    {
                        subcategory ?
                            (
                                <li className="product-card-info-item flex-row align-items-center">
                                    <h3 className="title-sex">Под вид:</h3>
                                    <h3 className="info info-text">{subcategory.title}</h3>
                                </li>
                            )
                            : null
                    }
                    {
                        locality !== null ?
                            (
                                <li className="product-card-info-item flex-row align-items-center">
                                    <h3 className="title-sex">Локалитет:</h3>
                                    <div className="info morphs d-inline-block">
                                        <div className="morph-indicator morph-other-normal d-inline-block">{locality.title}</div>
                                    </div>
                                </li>
                            )
                            : null
                    }
                    <li className="product-card-info-item flex-row align-items-center">
                        <h3 className="title-sex">Пол:</h3>
                        {
                            sex === null ?
                                <FontAwesomeIcon icon={faGenderless} className="info" size="lg"/>
                                : <FontAwesomeIcon icon={sex ? faMars : faVenus} size="lg" className={"info sex-" + (sex ? 'male' : 'female') } />
                        }
                    </li>
                    <li className="product-card-info-item">
                        <h3 className="title">Дата рождения:</h3>
                        <h3 className="info info-text">{moment(cb).format('DD.MM.YYYY')}</h3>
                    </li>
                    <li className="product-card-info-item flex-row">
                        <h3 className="title">Цена:</h3>
                        <h3 className="info">
                            {currency(price.find((item) => item.type === 'main').amount, currencyOptions).format()}
                            {getSymbolFromCurrency(price.find((item) => item.type === 'main').currency)}
                        </h3>
                    </li>
                    {
                        morphs.length !== 0 ?
                            (
                                <li className="product-card-info-item flex-row align-items-start">
                                    <h3 className="title-sex">Морфы:</h3>
                                    <div className="info morphs d-inline-block">
                                        {
                                            morphs.map( ({gene, trait}) => <div key={`${id}-${gene.title}-${trait.title}-${name}`} className={`morph-indicator morph-${gene.type}-${toTraitClass(trait.trait_group ? trait.trait_group.label : trait.title)} d-inline-block`}>{compareMorph(trait.title, gene.title)}</div>)
                                        }
                                    </div>
                                </li>
                            )
                            : null
                    }
                </ul>
            </div>
            <div className="products-item-controls-container d-flex flex-column flex-md-row flex-md-column justify-content-center align-items-center">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h3 className="mr--5">Активен:</h3>
                    <Switch
                        checked={is_active}
                        onChange={handleSwitch}
                        onColor={secondColor}
                        onHandleColor={mainColorHover}
                        handleDiameter={30}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        boxShadow="0px 1px 3px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 5px rgba(0, 0, 0, 0.2)"
                        height={20}
                        width={48}
                    />
                </div>
                <div className="products-item-controls d-flex align-items-start justify-content-center">
                    <Link href="/products/edit/[id]" as={`/products/edit/${id}`} >
                        <a className="products-item-controls-item">
                            <FontAwesomeIcon icon={faPen}/>
                        </a>
                    </Link>
                    <div className="products-item-controls-item times pointer-event" onClick={() => delProduct()}>
                        <FontAwesomeIcon icon={faTimes}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ShopProductsItem = connect(null, {deleteProduct, activeShopProduct})(ShopProductsItemComponent);

export {
    ShopProductsItem
}
