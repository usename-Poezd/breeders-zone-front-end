import React from 'react';
import { GetDataConsumer } from '../data-service-context';

const withGetData = (Wrapped, mapMethodsToProps) => {

    return (props) =>(
        <GetDataConsumer>
            {
                (getData) => {
                    
                    const dataProps = mapMethodsToProps(getData);

                    return(
                        <Wrapped {...props} {...dataProps}/>
                    );
                }
            }
        </GetDataConsumer>
    );
};

export default withGetData;