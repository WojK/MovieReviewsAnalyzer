import classes from "./wordCoef.module.css";

export default function WordCoef(props) {
  const coefPos = [];
  const coefNeg = [];

  const sortedPos = Object.entries(props.coef_pos).sort((a, b) => b[1] - a[1]);
  const sortedNeg = Object.entries(props.coef_neg).sort((a, b) => a[1] - b[1]);

  for (const [key, value] of sortedPos) {
    coefPos.push(
      <div className={classes["word-coef"]} key={key}>
        <p className={classes.word}>{key}</p>
        <p>{value}</p>
      </div>
    );
  }

  for (const [key, value] of sortedNeg) {
    coefNeg.push(
      <div className={classes["word-coef"]} key={key}>
        <p className={classes.word}>{key}</p>
        <p>{value}</p>
      </div>
    );
  }

  return (
    <>
      <h3 className={classes["text-header"]}>
        Based on logistic regression coefficients most significant words:
      </h3>
      <div className={classes["coef-container"]}>
        <div className={classes["pos-coef"]}>{coefPos}</div>
        <div className={classes["neg-coef"]}>{coefNeg}</div>
      </div>
    </>
  );
}
