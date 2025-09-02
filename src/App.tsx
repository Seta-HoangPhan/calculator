import { faEquals } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Divider, Grid, InputBase } from "@mui/material";
import { useRef, useState, type ChangeEvent } from "react";
import "./App.css";
import { InputList } from "./constants";
import { Action, type History, type KeyBoard } from "./types";
import { convertOperator, reverseOperator } from "./utils/convertOperator";
import { validateExpression } from "./utils/validateExpression";

function App() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [err, setErr] = useState<string | undefined>(undefined);
  const [inputVal, setInputVal] = useState<string>("");
  const [isResult, setIsResult] = useState<boolean>(false);
  const [history, setHistory] = useState<History[]>([]);

  const resetErr = () => setErr(undefined);

  const handleClickEqual = () => {
    const convertVal = reverseOperator(inputVal);

    const { isValid, result, err } = validateExpression(convertVal);
    if (!isValid || !result) {
      setErr(err);
      return;
    }

    setHistory((prev) => [...prev, { expression: inputVal, result }]);
    setInputVal(result);
    setIsResult(true);
  };

  const handleReplaceOperator = (val: string, crrCaret: number) => {
    const newVal = convertOperator(val);
    setInputVal(() => {
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(crrCaret, crrCaret);
        }
      });

      return newVal;
    });
    setIsResult(false);
  };

  const handleChangeInput = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const regex = /[^\d+\-*/%.]/g;
    const value = e.target.value.replace(regex, "");
    const crrCaret = e.target.selectionStart ?? 0;
    handleReplaceOperator(value, crrCaret);
  };

  const handleUpdateInput = (key: KeyBoard) => {
    if (!inputRef.current) return;

    const crrCaret = isResult
      ? inputVal.length
      : inputRef.current.selectionStart ?? 0;

    const isDelete = key === Action.Delete;
    const newVal = isDelete
      ? inputVal.slice(0, crrCaret - 1) + inputVal.slice(crrCaret)
      : inputVal.slice(0, crrCaret) + key + inputVal.slice(crrCaret);

    const newCaret = isDelete ? crrCaret - 1 : crrCaret + 1;
    handleReplaceOperator(newVal, newCaret);
  };

  const handleClickBoard = (key: KeyBoard) => {
    resetErr();

    if (key === Action.DeleteAll) {
      setInputVal("");
    } else {
      handleUpdateInput(key);
    }

    inputRef.current?.focus();
  };

  return (
    <div className="wrapper">
      <div className="display">
        <div className="history">
          {history.map(({ expression, result }) => (
            <>
              <div className="history-item">
                <span className="history-item__expression">{expression}</span>
                <span className="history-item__equal-icon">
                  <FontAwesomeIcon icon={faEquals} />
                </span>
                <span className="history-item__result">{result}</span>
              </div>
              <Divider />
            </>
          ))}
        </div>
        <div className="input">
          <InputBase
            inputRef={inputRef}
            fullWidth
            sx={{ flex: 1 }}
            value={inputVal}
            onChange={handleChangeInput}
            onFocus={() => setIsResult(false)}
          />
          {err && <span className="helper-text">{err}</span>}
        </div>
      </div>
      <div className="board">
        <Grid container spacing={1}>
          <Grid size="grow" container spacing={1}>
            {InputList.map(({ key, label, isNumber }) => (
              <Grid key={key} size={3}>
                <Button
                  fullWidth
                  sx={{
                    height: "100%",
                    background: isNumber ? "#b2afaf" : "#e1e1e1",
                    color: "inherit",
                  }}
                  variant="contained"
                  onClick={() => handleClickBoard(key)}
                >
                  {label}
                </Button>
              </Grid>
            ))}
          </Grid>
          <Grid size={{ xs: 2.4 }}>
            <Button
              fullWidth
              variant="contained"
              sx={{ height: "100%", background: "#d26d19" }}
              onClick={handleClickEqual}
            >
              <FontAwesomeIcon icon={faEquals} />
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default App;
