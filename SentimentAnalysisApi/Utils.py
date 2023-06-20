import pickle
from nltk.corpus import stopwords
from string import punctuation
import re
from bs4 import BeautifulSoup
import numpy as np
import tensorflow as tf

stop = set(stopwords.words('english'))
punctuation = list(punctuation)
stop.update(punctuation)


def remove_stopwords(text, stopwords_set):
    output = []
    for i in text.split():
        word = i.strip().lower()
        if word not in stopwords_set and word.isalpha():
            output.append(word)
    return " ".join(output)


def process_data(text):
    soup = BeautifulSoup(text, "html.parser")
    text = soup.get_text()
    text = re.sub(r'https?:\/\/.*[\r\n]*', '', text)
    text = remove_stopwords(text, stop)
    return text


def bert_csv(pipe, reviews):
    output = []
    count_pos = 0
    count_neg = 0

    for review in reviews:

        result = pipe(review)[0]
        pos = 0
        neg = 0
        for sentiment in result:
            if sentiment['label'] == 'LABEL_1':
                pos = sentiment['score']
            elif sentiment['label'] == 'LABEL_0':
                neg = sentiment['score']

        pos = "{:.2f}".format(float(pos))
        neg = "{:.2f}".format(float(neg))

        sentiment = "Positive" if pos >= neg else "Negative"
        if sentiment == "Negative":
            count_neg += 1
        else:
            count_pos += 1

        output.append({'review': review, 'sentiment': sentiment, 'prob_pos'
        : pos, 'prob_neg': neg})

    return count_pos, count_neg, output


def create_output(prediction, reviews):
    output = []
    count_pos = 0
    count_neg = 0

    for p, r in zip(prediction, reviews):
        sentiment = int(np.argmax(p))
        sentiment = "Negative" if sentiment == 0 else "Positive"
        prob_neg, prob_pos = p
        prob_pos = "{:.2f}".format(float(prob_pos))
        prob_neg = "{:.2f}".format(float(prob_neg))
        if sentiment == "Negative":
            count_neg += 1
        else:
            count_pos += 1

        output.append({'review': r, 'sentiment': sentiment, 'prob_pos'
        : prob_pos, 'prob_neg': prob_neg})

    return count_pos, count_neg, output


def get_result_csv_lstm(reviews, tokenizer, model):
    sequences = tokenizer.texts_to_sequences(reviews)
    max_len = 225
    trunc_type = 'post'
    padding_type = 'post'

    sequences = tf.keras.utils.pad_sequences(sequences, maxlen=max_len, padding=padding_type, truncating=trunc_type)
    prediction = model.predict(sequences)
    return prediction


def get_result_csv_logistic_regression(reviews):
    model_filename = './Models/logistic_regresiom_model.sav'
    model_tfidf_filename = 'Models/tfidf_model.sav'

    model_tfidf = pickle.load(open(model_tfidf_filename, 'rb'))
    loaded_model = pickle.load(open(model_filename, 'rb'))
    reviews_vectorized = model_tfidf.transform(reviews)
    prediction = loaded_model.predict_proba(reviews_vectorized)
    return prediction


def get_coef_words(words, coef, feature_names):
    output = {}
    for word in words:
        if word in feature_names:
            index = feature_names.index(word)
            c = coef[index]
            output[word] = "{:.2f}".format(float(c))

    return output


from scipy.sparse import find


def get_coef_sentence(sentence, coef, feature_names, vectorizer):
    sentence = vectorizer.transform([sentence])
    word_indexes = find(sentence)[1]
    output = {}
    for i in word_indexes:
        word = feature_names[i]
        c = coef[i]
        output[word] = "{:.2f}".format(float(c))

    return output


def split_pos_neg(coef_dict):
    pos = {}
    neg = {}
    for key, value in coef_dict.items():
        if float(value) > 0:
            pos[key] = value
        else:
            neg[key] = value

    return pos, neg
