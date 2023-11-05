from flask import Flask, request, render_template
import matplotlib.pyplot as plt
import tensorflow as tf
import numpy as np
import cv2

app = Flask(__name__)

# This variable will store the received image data
received_image = None


@app.route('/')
def home():
    return render_template('predict.page.html')



@app.route('/predict', methods=['POST'])
def upload_image():
     global received_image
     print(request.data)
     if 'lungPic' in request.files:
          # Load saved model
          model = tf.keras.models.load_model("best_lung_cancer_model.h5")
          
          # Get uploaded image and convert to tensors
          image = request.files['lungPic']
          image = image.read()
          image = cv2.imdecode(np.frombuffer(image, dtype=np.uint8), cv2.IMREAD_UNCHANGED)

          # Preprocess image 
          grayscale_image = np.mean(image[:, :, :3], axis=2)
          grayscale_image = np.expand_dims(grayscale_image, axis=2)
          resized_image = tf.image.resize(grayscale_image, size=(28, 28))
          print(resized_image.shape)
          img = np.array([resized_image])
          print(img.shape)

          # Perform predictions
          pred = model.predict(img)
          print(pred)
          # Highest probability
          maxIndex = np.argmax(pred[0])

          # Get the class labels
          class_labels = ["Malignant", "Normal"]

          result = class_labels[maxIndex]

     else:
          return 'No image received in the request.', 400

     firstname = request.form['firstname']
     lastname = request.form['lastname']
     fullname = firstname + " " + lastname
     print(fullname)
     return render_template("result.page.html")





if __name__ == '__main__':
    app.run(debug=True)