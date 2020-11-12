import {useContext} from "react";
import {DataServiceContext} from "../contexts/DataServiceConext";
import {DataService} from "../services";

export const useDataService = (): DataService => useContext(DataServiceContext);
