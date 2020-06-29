import React, {useState} from 'react';
import { useQuery } from '@apollo/react-hooks';
// 1) Original
import { getCompoundsQuery} from '../../queries/queries';
// 2) Apollo cache
// import { getCompoundsQuery, disableDrug } from '../../queries/queries';

// 3) graphql-request
// import { request } from 'graphql-request'
// const query = `{
//     compounds {
//         id
//         name
//     }
// }`



const Compounds = () => {
    // 1) Original
    const { loading, error, data } = useQuery(getCompoundsQuery);
    // 2) apollo cache
    // const localStorage = useQuery(disableDrug)
    // const remoteStorage = useQuery(getCompoundsQuery)
    // const { loading, error, data } = remoteStorage 

    // 3) grapql-request
    // const [drugData, setDrugData] = useState({ data: null, loading: true, error: null });
    // if (!drugData.data) request('http://localhost:5000/graphql', query).then((data) => {
    //     console.log(data);
    //     setDrugData({ data, loading: false, error: null })
    // }).catch((err) => {
    //     console.log(err);
    //     setDrugData({ data: null, loading: false, error: true })
    // })
    // const {data, loading, error} = drugData

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error!!</p>;

    return data.compounds.map(({ id, name }) => (
        <div key={id}>
            {/* 1) original AND 3) graphql-request */}
            <p>
                {id}: {name}
            </p>
            {/* 2) apollo cache */}
            {/* <button 
                onClick={() => localStorage.client.writeData({ data: { drug: id } })}
                disabled={localStorage.data && localStorage.data.drug === id}
            >
                {id}: {name} {localStorage.data && localStorage.data.drug === id ? 'Selected' : null}
            </button> */}
        </div>
    ));
};

export default Compounds;
