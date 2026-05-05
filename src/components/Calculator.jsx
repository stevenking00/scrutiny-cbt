import { useState, useEffect } from "react";

export default function Calculator({ onClose }) {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState(null);
  const [op, setOp] = useState(null);
  const [waiting, setWaiting] = useState(false);

  const inputDigit = (d) => {
    if (waiting) { setDisplay(String(d)); setWaiting(false); }
    else { setDisplay(display === "0" ? String(d) : display + d); }
  };
  const decimal = () => {
    if (waiting) { setDisplay("0."); setWaiting(false); }
    else if (!display.includes(".")) setDisplay(display + ".");
  };
  const clear = () => { setDisplay("0"); setPrev(null); setOp(null); setWaiting(false); };
  const operate = (nextOp) => {
    const val = parseFloat(display);
    if (prev === null) setPrev(val);
    else if (op) {
      const result = eval(`${prev} ${op} ${val}`);
      setDisplay(String(result));
      setPrev(result);
    }
    setWaiting(true);
    setOp(nextOp);
  };
  const equal = () => {
    if (!op) return;
    const val = parseFloat(display);
    const result = eval(`${prev} ${op} ${val}`);
    setDisplay(String(result));
    setPrev(null);
    setOp(null);
    setWaiting(true);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key >= "0" && e.key <= "9") inputDigit(parseInt(e.key));
      if (e.key === ".") decimal();
      if (e.key === "Enter") equal();
      if (e.key === "Escape") clear();
      if (e.key === "+") operate("+");
      if (e.key === "-") operate("-");
      if (e.key === "*") operate("*");
      if (e.key === "/") operate("/");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [display, prev, op, waiting]);

  return (
    <div className="calculator-overlay" onClick={onClose}>
      <div className="calculator" onClick={e => e.stopPropagation()}>
        <div className="calc-display">{display}</div>
        <div className="calc-buttons">
          <button onClick={clear}>AC</button>
          <button onClick={() => operate("/")}>÷</button>
          <button onClick={() => operate("*")}>×</button>
          <button onClick={() => operate("-")}>−</button>
          <button onClick={() => operate("+")}>+</button>
          <button onClick={() => inputDigit(7)}>7</button>
          <button onClick={() => inputDigit(8)}>8</button>
          <button onClick={() => inputDigit(9)}>9</button>
          <button onClick={equal}>=</button>
          <button onClick={() => inputDigit(4)}>4</button>
          <button onClick={() => inputDigit(5)}>5</button>
          <button onClick={() => inputDigit(6)}>6</button>
          <button onClick={decimal}>.</button>
          <button onClick={() => inputDigit(1)}>1</button>
          <button onClick={() => inputDigit(2)}>2</button>
          <button onClick={() => inputDigit(3)}>3</button>
          <button onClick={() => inputDigit(0)}>0</button>
        </div>
        <button className="calc-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}