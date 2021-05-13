from django.http import HttpResponse
from django.http import JsonResponse
import pickle
import json
import os

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import pickle

def index(request):
    return HttpResponse("Model server is running")



def getrecommendeditem(request):
    id = request.GET.get("id")
    reco = recommend(item_id=id, num=4)
    return HttpResponse(json.dumps(reco), content_type="application/json")


def recommend(item_id, num):
    ds = pd.read_csv("products.csv")
    tf = TfidfVectorizer(analyzer='word', ngram_range=(1, 3), min_df=0, stop_words='english')
    tfidf_matrix = tf.fit_transform(ds['category'])
    cosine_similarities = linear_kernel(tfidf_matrix, tfidf_matrix)
    results = {}

    for idx, row in ds.iterrows():
        similar_indices = cosine_similarities[idx].argsort()[:-100:-1]
        similar_items = [(cosine_similarities[idx][i], ds['_id'][i]) for i in similar_indices]
        results[row['_id']] = similar_items[1:]

    recs = results[item_id][:num]
    recommend_arr = []
    for rec in recs:
        recommend_arr.append(rec[1])
    return recommend_arr