async function onLoad() {
  const eventHandle = () => {
    console.log('event handle');
  };

  const element = (
    <>
      <h1>Hello, world!</h1>
      <Welcome name='John Doe'></Welcome>
      <StartButton onStart={eventHandle}></StartButton>
    </>   
  );
  const domContainer = document.querySelector('#root');
  const root = ReactDOM.createRoot(domContainer);
  root.render(element);
}

onLoad();
