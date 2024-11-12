# coding=utf8
#Access-Control-Allow-Origin: http://localhost:5173/
from flask import Flask, render_template, redirect, url_for, request
import torch
from transformers import GPT2Tokenizer, GPT2LMHeadModel



app = Flask(__name__)

# data_dir = "datasets/"

@app.route("/")
def index():
    return render_template("index.html")


@app.post("/model")
def model():
    data = request.get_json()
    question = data.get('prompt')
    tokenizer = GPT2Tokenizer.from_pretrained('gpt2')
    model = GPT2LMHeadModel.from_pretrained('fine-tuned-gpt2')
    
# Set device
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model.to(device)

# Define input text
    input_text = question

# Encode input text
    input_ids = tokenizer.encode(input_text, return_tensors='pt').to(device)
    print(f"{input_ids}")

# Generate output sequence
    output = model.generate(
        input_ids=input_ids,
        max_length=300,
        do_sample=True,
        top_k=50,
        top_p=0.95
    )

# Decode output sequence
    output_text = tokenizer.decode(output[0], skip_special_tokens=True)

    # Print output text
    # print(output_text)
    # for key in q:
    return {"answers":output_text}


if __name__ == "__main__":
    app.run(debug=False, port=5000)


# Import required libraries

# Load pre-trained model and tokenizer
