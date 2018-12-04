import Crochet, { useChildren, useState, useEffect } from "./crochet";
import { useDomChildren, useRoot, Div, Button } from "./crochet-dom";

const $root = document.getElementById("root");

function Bar(props) {
  // console.log("Bar", props);
  const [count, setCount] = useState(2);
  // console.log("count", count);
  useDomChildren(<Div name={props.name + count} />);
  useChildren(<Button onClick={() => setCount(count + 1)} />);
}

function App(props) {
  // console.log("App", props);
  useRoot($root);
  useChildren(<Bar name={props.name + "1"} />);
}

Crochet.render(<App name="a" />);
// globalSetCount(3);
