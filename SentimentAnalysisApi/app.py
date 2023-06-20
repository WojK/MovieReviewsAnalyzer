from flask import Flask, jsonify, request
import pickle
import tensorflow as tf
import Utils
import numpy as np
from flask_cors import CORS
import pandas as pd
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline

app = Flask(__name__)
CORS(app)

model_bert_folder = './Models/bert/'
bert_tokenizer_folder = './Models/bert/tokenizer/'
model_bert = AutoModelForSequenceClassification.from_pretrained(model_bert_folder)
bert_tokenizer = AutoTokenizer.from_pretrained(bert_tokenizer_folder)
bert_pipe = pipeline("text-classification", model=model_bert, tokenizer=bert_tokenizer, top_k=None)

tokenizer_lstm_filename = './Models/tokenizer.pickle'
tokenizer_lstm = pickle.load(open(tokenizer_lstm_filename, 'rb'))

model_lstm_filename = 'Models/lstm_model.h5'
loaded_model_lstm = tf.keras.models.load_model(model_lstm_filename)


@app.route('/logistic-regression', methods=['POST'])
def get_logistic_regression_tfidf():
    model_filename = './Models/logistic_regresiom_model.sav'
    model_tfidf_filename = 'Models/tfidf_model.sav'
    json_data = request.get_json()
    review = json_data['review']
    review = Utils.process_data(review)

    model_tfidf = pickle.load(open(model_tfidf_filename, 'rb'))
    loaded_model = pickle.load(open(model_filename, 'rb'))

    review_vectorized = model_tfidf.transform([review])
    sentiment = int(loaded_model.predict(review_vectorized)[0])
    sentiment = "Negative" if sentiment == 0 else "Positive"
    prob_neg, prob_pos = loaded_model.predict_proba(review_vectorized)[0]
    prob_pos = "{:.2f}".format(float(prob_pos))
    prob_neg = "{:.2f}".format(float(prob_neg))
    return jsonify(sentiment=sentiment, prob_pos=prob_pos, prob_neg=prob_neg)


@app.route('/multonomial-naivebayes', methods=['POST'])
def get_multonomial_naivebayes_tfidf():
    model_filename = './Models/multinomialNB_model.sav'
    model_tfidf_filename = 'Models/tfidf_model.sav'
    json_data = request.get_json()
    review = json_data['review']
    review = Utils.process_data(review)

    model_tfidf = pickle.load(open(model_tfidf_filename, 'rb'))
    loaded_model = pickle.load(open(model_filename, 'rb'))

    review_vectorized = model_tfidf.transform([review])
    sentiment = int(loaded_model.predict(review_vectorized)[0])
    sentiment = "Negative" if sentiment == 0 else "Positive"
    prob_neg, prob_pos = loaded_model.predict_proba(review_vectorized)[0]
    prob_pos = "{:.2f}".format(float(prob_pos))
    prob_neg = "{:.2f}".format(float(prob_neg))
    return jsonify(sentiment=sentiment, prob_pos=prob_pos, prob_neg=prob_neg)


@app.route('/lstm', methods=['POST'])
def get_lstm():
    json_data = request.get_json()
    review = json_data['review']
    review = Utils.process_data(review)

    max_len = 225
    trunc_type = 'post'
    padding_type = 'post'

    review = tokenizer_lstm.texts_to_sequences([review])
    review = tf.keras.utils.pad_sequences(review, maxlen=max_len, padding=padding_type, truncating=trunc_type)
    review = np.reshape(review, (1, max_len))

    result = loaded_model_lstm(review)
    sentiment = int(np.argmax(result, axis=1))
    sentiment = "Negative" if sentiment == 0 else "Positive"

    prob_neg, prob_pos = result[0]
    prob_pos = "{:.2f}".format(float(prob_pos))
    prob_neg = "{:.2f}".format(float(prob_neg))
    return jsonify(sentiment=sentiment, prob_pos=prob_pos, prob_neg=prob_neg)


@app.route('/bert', methods=['POST'])
def get_bert():
    json_data = request.get_json()
    review = json_data['review']

    pos = 0
    neg = 0
    result = bert_pipe(review)[0]
    for sentiment in result:
        if sentiment['label'] == 'LABEL_1':
            pos = sentiment['score']
        elif sentiment['label'] == 'LABEL_0':
            neg = sentiment['score']

    sentiment = "Positive" if pos >= neg else "Negative"
    prob_pos = "{:.2f}".format(float(pos))
    prob_neg = "{:.2f}".format(float(neg))

    return jsonify(sentiment=sentiment, prob_pos=prob_pos, prob_neg=prob_neg)


@app.route('/csv', methods=['POST'])
def get_result_csv():
    method = request.form['method']
    csv = request.files['csv']
    df = pd.read_csv(csv)
    reviews = df['review']
    df['review'] = df['review'].apply(Utils.process_data)
    count_pos = 0
    count_neg = 0
    reviews_scores = []
    if method == "lstm":
        prediction = Utils.get_result_csv_lstm(df['review'], tokenizer_lstm, loaded_model_lstm)
        count_pos, count_neg, reviews_scores = Utils.create_output(prediction, reviews)
    elif method == "logisticregression":
        prediction = Utils.get_result_csv_logistic_regression(df['review'])
        count_pos, count_neg, reviews_scores = Utils.create_output(prediction, reviews)
    elif method == "bert":
        count_pos, count_neg, reviews_scores = Utils.bert_csv(bert_pipe, reviews)

    return jsonify(count_pos=count_pos, count_neg=count_neg, reviews_scores=reviews_scores)


@app.route('/coef', methods=['POST'])
def get_coef_logistic_regression():
    model_filename = './Models/logistic_regresiom_model.sav'
    model_tfidf_filename = 'Models/tfidf_model.sav'
    json_data = request.get_json()
    review = json_data['review']
    review = Utils.process_data(review)
    model_tfidf = pickle.load(open(model_tfidf_filename, 'rb'))
    loaded_model = pickle.load(open(model_filename, 'rb'))

    coef = loaded_model.coef_[0]
    feature_names = model_tfidf.get_feature_names_out().tolist()

    coef_dict = Utils.get_coef_sentence(review, coef, feature_names, model_tfidf)
    coef_pos, coef_neg = Utils.split_pos_neg(coef_dict)
    return jsonify(coef_pos=coef_pos, coef_neg=coef_neg)


app.run()
