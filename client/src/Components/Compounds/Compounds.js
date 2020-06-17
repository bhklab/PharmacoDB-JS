import React from 'react';
import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { getCompoundsQuery, disableDrug } from '../../queries/queries';
import { gql } from 'apollo-boost';



const Compounds = () => {
    // const { loading, error, data } = useQuery(getCompoundsQuery);
    
    const localStorage = useQuery(disableDrug)
    const remoteStorage = useQuery(getCompoundsQuery)
    
    const { loading, error, data } = remoteStorage 

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error!!</p>;

    return data.compounds.map(({ id, name }) => (
        <div key={id}>
            <button 
                onClick={() => localStorage.client.writeData({ data: { drug: id } })}
                disabled={localStorage.data && localStorage.data.drug === id}
            >
                {id}: {name} {localStorage.data && localStorage.data.drug === id ? 'Selected' : null}
            </button>
        </div>
    ));
};

export default Compounds;
