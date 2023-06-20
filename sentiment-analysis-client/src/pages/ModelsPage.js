import classes from "./modelsPage.module.css";
import { api } from "../api";
import { useState } from "react";
import { MagnifyingGlass } from "react-loader-spinner";
import WordCoef from "../components/WordCoef";

export default function ModelsPage() {
  const [logisticRegression, setLogisticRegression] = useState({
    pos: "",
    neg: "",
    sentiment: "",
  });

  const [naiveBayes, setNaiveBayes] = useState({
    pos: "",
    neg: "",
    sentiment: "",
  });

  const [bert, setBert] = useState({
    pos: "",
    neg: "",
    sentiment: "",
  });

  const [lstm, setLstm] = useState({
    pos: "",
    neg: "",
    sentiment: "",
  });

  const [isLoadingLogisticRegression, setIsLoadingLogisticRegression] =
    useState(false);

  const [isLoadingNB, setIsLoadingNB] = useState(false);
  const [isLoadingLSTM, setIsLoadingLSTM] = useState(false);
  const [isLoadingBERT, setIsLoadingBERT] = useState(false);

  const [review, setReview] = useState("");

  const [coefPos, setCoefPos] = useState({});
  const [coefNeg, setCoefNeg] = useState({});
  const [isVisibleCoef, setIsVisibleCoef] = useState(false);

  const onClickHandler = () => {
    setIsLoadingLogisticRegression(true);
    setIsLoadingNB(true);
    setIsLoadingLSTM(true);
    setIsLoadingBERT(true);
    setIsVisibleCoef(false);

    fetch(`${api}/logistic-regression`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ review: review }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        const pos = res.prob_pos;
        const neg = res.prob_neg;
        const sentiment = res.sentiment;
        setLogisticRegression({ pos: pos, neg: neg, sentiment: sentiment });
      })
      .catch((err) => {
        alert("Error while sending request to logistic regression");
      })
      .finally(() => {
        setIsLoadingLogisticRegression(false);
      });

    fetch(`${api}/multonomial-naivebayes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ review: review }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        const pos = res.prob_pos;
        const neg = res.prob_neg;
        const sentiment = res.sentiment;
        setNaiveBayes({ pos: pos, neg: neg, sentiment: sentiment });
      })
      .catch((err) => {
        alert("Error while sending request to Naive Bayes");
      })
      .finally(() => {
        setIsLoadingNB(false);
      });

    fetch(`${api}/lstm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ review: review }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        const pos = res.prob_pos;
        const neg = res.prob_neg;
        const sentiment = res.sentiment;
        setLstm({ pos: pos, neg: neg, sentiment: sentiment });
      })
      .catch((err) => {
        alert("Error while sending request to LSTM");
      })
      .finally(() => {
        setIsLoadingLSTM(false);
      });

    fetch(`${api}/bert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ review: review }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        const pos = res.prob_pos;
        const neg = res.prob_neg;
        const sentiment = res.sentiment;
        setBert({ pos: pos, neg: neg, sentiment: sentiment });
      })
      .catch((err) => {
        alert("Error while sending request to bert");
        setIsLoadingBERT(false);
      })
      .finally(() => {
        setIsLoadingBERT(false);
      });

    fetch(`${api}/coef`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ review: review }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setCoefPos(res.coef_pos);
        setCoefNeg(res.coef_neg);
      })
      .catch((err) => {
        alert("Error while sending request to coef");
        setIsVisibleCoef(false);
      })
      .finally(() => {
        setIsVisibleCoef(true);
      });
  };

  return (
    <div className={classes["main-container"]}>
      <div className={classes["input-container"]}>
        <textarea
          onChange={(e) => {
            setReview(e.target.value);
          }}
          value={review}
          placeholder="Review..."
        ></textarea>
        <button className={classes["button"]} onClick={onClickHandler}>
          Analyse
        </button>
      </div>

      <div className={classes["models"]}>
        <div className={classes["models-title"]}>
          <div className={classes["model-type"]}>
            <p>Machine Learning</p>
          </div>

          <div className={classes["models"]}>
            <div
              className={`${classes["models-title"]} ${classes["model-type"]}`}
            >
              <p>Logistic Regression TFIDF</p>

              {isLoadingLogisticRegression && (
                <MagnifyingGlass
                  visible={true}
                  height="80"
                  width="80"
                  ariaLabel="MagnifyingGlass-loading"
                  wrapperStyle={{ marginTop: "30px" }}
                  wrapperClass="MagnifyingGlass-wrapper"
                  glassColor="#c0efff"
                  color="#e15b64"
                />
              )}
              {!isLoadingLogisticRegression && (
                <ScoreTable result={logisticRegression} />
              )}
            </div>

            <div
              className={`${classes["models-title"]} ${classes["model-type"]}`}
            >
              <p>Naive Bayes TFIDF</p>

              {isLoadingNB && (
                <MagnifyingGlass
                  visible={true}
                  height="80"
                  width="80"
                  ariaLabel="MagnifyingGlass-loading"
                  wrapperStyle={{ marginTop: "30px" }}
                  wrapperClass="MagnifyingGlass-wrapper"
                  glassColor="#c0efff"
                  color="#e15b64"
                />
              )}
              {!isLoadingNB && <ScoreTable result={naiveBayes} />}
            </div>
          </div>
        </div>
        <div className={classes["models-title"]}>
          <div
            className={`${classes["models-title"]} ${classes["model-type"]}`}
          >
            <p>Deep Learning</p>
          </div>

          <div className={classes["models"]}>
            <div
              className={`${classes["models-title"]} ${classes["model-type"]}`}
            >
              <p>LSTM</p>
              {isLoadingLSTM && (
                <MagnifyingGlass
                  visible={true}
                  height="80"
                  width="80"
                  ariaLabel="MagnifyingGlass-loading"
                  wrapperStyle={{ marginTop: "30px" }}
                  wrapperClass="MagnifyingGlass-wrapper"
                  glassColor="#c0efff"
                  color="#e15b64"
                />
              )}
              {!isLoadingLSTM && <ScoreTable result={lstm} />}
            </div>

            <div
              className={`${classes["models-title"]} ${classes["model-type"]}`}
            >
              <p>DistilBert</p>
              {isLoadingBERT && (
                <MagnifyingGlass
                  visible={true}
                  height="80"
                  width="80"
                  ariaLabel="MagnifyingGlass-loading"
                  wrapperStyle={{ marginTop: "30px" }}
                  wrapperClass="MagnifyingGlass-wrapper"
                  glassColor="#c0efff"
                  color="#e15b64"
                />
              )}
              {!isLoadingBERT && <ScoreTable result={bert} />}
            </div>
          </div>
        </div>
      </div>

      {isVisibleCoef && <WordCoef coef_pos={coefPos} coef_neg={coefNeg} />}
    </div>
  );
}

function ScoreTable(props) {
  let sentimentClasses = `${classes.sentiment} `;
  if (props.result.sentiment === "") {
    sentimentClasses += `${classes["empty-sentiment"]}`;
  } else {
    sentimentClasses +=
      parseFloat(props.result.neg) < parseFloat(props.result.pos)
        ? `${classes["pos-sentiment"]}`
        : `${classes["neg-sentiment"]}`;
  }

  return (
    <div>
      <div className={sentimentClasses}>{props.result.sentiment}</div>
      <div className={classes.scores}>
        <div className={classes["score-pos"]}>{props.result.pos}</div>
        <div className={classes["score-neg"]}>{props.result.neg}</div>
      </div>
    </div>
  );
}
