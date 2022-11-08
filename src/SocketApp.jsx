import { socketConnect } from 'socket.io-react';

function SocketApp(props) {
  function sendMessage() {
    props.socket.emit('message', 'Hello world!');
  }

  return (
    <button onClick={sendMessage}>
      Send!
    </button>
  );
}

export default socketConnect(SocketApp);
