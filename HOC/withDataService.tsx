import React from 'react';
import {DataServiceConsumer} from "../contexts/DataServiceConext";

const withDataService = (Wrapped, mapMethodsToProps) => {

    return (props) =>(
        <DataServiceConsumer>
            {
                (getData) => {

                    const dataProps = mapMethodsToProps(getData);

                    return(
                        <Wrapped {...props} {...dataProps}/>
                    );
                }
            }
        </DataServiceConsumer>
    );
};

export {
    withDataService
};
