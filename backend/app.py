from flask import Flask, request, jsonify, render_template
import pickle
import sklearn
from flask_cors import CORS 
from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer
from textblob import TextBlob

app = Flask(__name__)
CORS(app)
cors = CORS(app, resource={
    r"/*":{
        "origins":"*"
    }
})
#model = pickle.load(open('C:/Users/Hardik/Desktop/Gmail-clone/backend/spamdetection.pkl', 'rb'))

def split_into_lemmas(message):
    message = message.lower()
    words = TextBlob(message).words
    # for each word, take its "base form" = lemma 
    return [word.lemma for word in words]

#function to apply the count vectorizer(BOW) and TF-IDF transforms to a set of input features
def features_transform(mail):
    #get the bag of words for the mail text
    bow_transformer = CountVectorizer(analyzer=split_into_lemmas).fit(mail)
    #print(len(bow_transformer.vocabulary_))
    messages_bow = bow_transformer.transform(mail)
    #print sparsity value
    print('sparse matrix shape:', messages_bow.shape)
    print('number of non-zeros:', messages_bow.nnz) 
    print('sparsity: %.2f%%' % (100.0 * messages_bow.nnz / (messages_bow.shape[0] * messages_bow.shape[1])))
    #apply the TF-IDF transform to the output of BOW
    tfidf_transformer = TfidfTransformer().fit(messages_bow)
    messages_tfidf = tfidf_transformer.transform(messages_bow)
    #print(messages_tfidf.shape)
    #return result of transforms
    return messages_tfidf

@app.route('/predict',methods=['POST'])
def predict():

    # email = request.get('resp')
    #     #return email
    # email=[email]
    # email= features_transform(email)
    # output = model.predict(email)

    # if output[0]=='spam':
    #     return True
    # else:
    #     return False
    print("hello")
    return True
    #email="Dear Student, Last chance to Register for the Event, Dont miss out on interacting with 15+ banks and exciting offers , Hurry up ..!!! REGISTER NOW..!!!.We are exhilarated to invite you all the Fall 2021 aspirants for EduLoans Online Loan Mela, an event that helps you acquire financial assistance to achieve your dreams. Join us for the Mela and get a chance to interact directly with the loan representatives from 15+ financial institutions from the comfort of your home.Why EduLoans ?With student centric education loan solutions, EduLoans ensures that students can pursue their higher education without being shackled by finances. Abroad aspirants can now get an unbiased comparison between more that 15+ banks/financial institutes and choose the best loan offer for completely free on EduLoans."
    

# @app.route('/predict_api',methods=['POST'])
# def predict_api():
#     '''
#     For direct API calls trought request
#     '''
#     data = request.get_json(force=True)
#     prediction = model.predict([np.array(list(data.values()))])

#     output = prediction[0]
#     return jsonify(output)

if __name__ == "__main__":
    app.run(debug=True)