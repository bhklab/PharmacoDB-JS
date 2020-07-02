import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../Layout/Layout';

import { getCompoundsQuery} from '../../queries/queries';

/**
 * Parent component for the compounds page.
 *
 * @component
 * @example
 *
 * return (
 *   <Compounds/>
 * )
 */
const Compounds = () => {
    const { loading, error, data } = useQuery(getCompoundsQuery);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error!!</p>;

    return (
        <Layout>
            {data.compounds.map(({ id, name }) => (
                <div key={id}>
                    <p>
                        {id}: {name}
                    </p>
                </div>
            ))}
        </Layout>
    );
};

export default Compounds;
