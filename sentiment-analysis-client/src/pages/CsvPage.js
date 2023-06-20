import { api } from "../api";
import classes from "./csvPage.module.css";
import { useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { ThreeCircles } from "react-loader-spinner";

import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CsvPage() {
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState();
  const [model, setModel] = useState("lstm");
  const [sentimentCounts, setSentimentCounts] = useState({ pos: 0, neg: 0 });
  const [reviewsAndScores, setReviewsAndScores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [scoresDisplay, setScoresDisplay] = useState(false);

  const chartData = {
    labels: ["Positive", "Negative"],
    datasets: [
      {
        label: "Count",
        data: [sentimentCounts.pos, sentimentCounts.neg],
        backgroundColor: ["rgb(19 158 19 / 60%)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgb(19 158 19)", "rgba(255, 99, 132, 1)"],
        borderWidth: 2,
      },
    ],
  };

  const buttonAnalyseHandler = () => {
    setIsLoading(true);
    setScoresDisplay(false);
    const fd = new FormData();
    fd.append("csv", file);
    fd.append("method", model);

    fetch(`${api}/csv`, { method: "POST", body: fd })
      .then((response) => response.json())
      .then((json) => {
        setSentimentCounts({ pos: json.count_pos, neg: json.count_neg });
        setReviewsAndScores(json.reviews_scores);
        setScoresDisplay(true);
      })
      .catch((e) => console.log(e))
      .finally(() => setIsLoading(false));
  };

  const chooseFileHandler = (e) => {
    setFileName(e.target.files[0].name);
    setFile(e.target.files[0]);
  };

  const selectHandler = (e) => {
    setModel(e.target.value);
  };

  const displayReviewScores = (reviews) => {
    return reviews.map(function (score, i) {
      return (
        <div className={classes["review-div"]}>
          <div className={classes.review}>
            <p>{score.review}</p>
          </div>

          <div className={classes["sentiment-pos"]}>{score.prob_pos}</div>
          <div className={classes["sentiment-neg"]}>{score.prob_neg}</div>
        </div>
      );
    });
  };

  return (
    <div>
      <div className={classes["input-container"]}>
        <label className={classes["custom-file-upload"]}>
          <input type="file" accept=".csv" onChange={chooseFileHandler} />
          Choose file
        </label>
        <select onChange={selectHandler}>
          <option value="lstm">LSTM</option>
          <option value="bert">Bert</option>
          <option value="logisticregression">Logistic Regression</option>
        </select>
      </div>
      <div className={classes.center}>
        <p className={classes["file-name"]}>{fileName}</p>
        <button className={classes["button"]} onClick={buttonAnalyseHandler}>
          Analyse
        </button>
      </div>
      <hr />

      <div className={classes["reviews-and-scores"]}>
        {isLoading && (
          <ThreeCircles
            height="150"
            width="150"
            color="#080336"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="three-circles-rotating"
            outerCircleColor=""
            innerCircleColor=""
            middleCircleColor=""
          />
        )}
        {scoresDisplay && (
          <>
            <div className={classes["reviews"]}>
              {displayReviewScores(reviewsAndScores)}
            </div>
            <div className={classes.chart}>
              <Pie data={chartData} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
