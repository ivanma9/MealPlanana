import CircleLoader from 'react-spinners/ClipLoader';
import React, {
  Component,
} from 'react';

export default class LoadingPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
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
  }
}
