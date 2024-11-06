function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

function StartButton(props) {
  return <>
    <button onClick={() => props.onStart()}>Click me</button>
  </>
}
