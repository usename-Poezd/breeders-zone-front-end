import * as React from "react";
import {Component, FC} from 'react';
import {DataServiceConsumer} from "../contexts/DataServiceConext";
import {DataService} from "../services";

const withDataService = (Wrapped: typeof Component|FC, mapMethodsToProps: (getData: DataService) => Object) => {

    return (props: any) =>(
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
