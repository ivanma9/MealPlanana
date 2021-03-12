import CircleLoader from 'react-spinners/ClipLoader';
import React, {
} from 'react';
/*
Loading page component for page transitions
*/
const LoadingPage = () => (
  <div style={{
    display: 'flex',
    height: '100vh',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  }}
  >
    <div>
      <CircleLoader color="skyblue" loading size={200} />
      <br />
      <div style={{
        display: 'flex',

        justifyContent: 'center',
        alignItems: 'center',
      }}
      >
        Loading...
      </div>
    </div>
  </div>
);
export default LoadingPage;
