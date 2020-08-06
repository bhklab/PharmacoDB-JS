import React from 'react';
import ReactLoading from 'react-loading';
import styled from 'styled-components';
import colors from '../../styles/colors';

const Container = styled.div`
  margin-top: 250px;
`;

const Loading = () => (
  <Container>
    <ReactLoading
      type="bubbles"
      color={colors.dark_teal_heading}
      height={160}
      width={160}
    />
  </Container>
);

export default Loading;
