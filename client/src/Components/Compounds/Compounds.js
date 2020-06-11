import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { getCompoundsQuery } from '../../queries/queries';

const Compounds = () => {
    const { loading, error, data } = useQuery(getCompoundsQuery);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error!!</p>;

    return data.compounds.map(({ id, name }) => (
        <div key={id}>
            <p>
                {id}: {name}
            </p>
        </div>
    ));
};

export default Compounds;
