"use client";
import { Admin, Resource, ListGuesser, EditGuesser ,fetchUtils } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import postgrestRestProvider, 
     { IDataProviderConfig, 
       defaultPrimaryKeys, 
       defaultSchema } from '@raphiniert/ra-data-postgrest';
import { RiRestaurantFill } from "react-icons/ri";
import { useAuth } from "../components/AuthContextWrapper";
import {GlossaryEdit, GlossaryList} from './glossaries/Glossary'

const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");

const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    // add your own headers here
    options.headers.set('X-Custom-Header', 'foobar');
    options.headers.set('Content-Range', '0-24/319');
    options.headers.set('Access-Control-Expose-Headers', 'Content-Range');
    return fetchUtils.fetchJson(url, options);
};
const options = {
    'Content-Range': '0-24/319'
}
const url = 'http://localhost:8080'
const config = {
    apiUrl: url,
    httpClient: httpClient,
    defaultListOp: 'eq',
    primaryKeys: defaultPrimaryKeys,
    schema: defaultSchema
}

export default function Page() {

    const {user} = useAuth()
    
    return(
  <Admin dataProvider={postgrestRestProvider(config)}>
    <Resource name={`glossaries`} list={GlossaryList} edit={GlossaryEdit} />

  </Admin>
)
} 

