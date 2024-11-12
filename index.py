# from haystack.nodes import FARMReader
# reader = FARMReader(model_name_or_path="distilbert-base-uncased-distilled-squad", use_gpu=True)
# data_dir = "datasets/"
# reader.train(data_dir = data_dir, train_filename = "answers.json", use_gpu=True, n_epochs=100, save_dir="my_model")
# reader.save(directory="my_model")
from transformers import AutoTokenizer, AutoModelWithLMHead, TextDataset, DataCollatorForLanguageModeling, Trainer, TrainingArguments
import torch
# Load the pre-trained tokenizer and model
tokenizer = AutoTokenizer.from_pretrained("gpt2")
model = AutoModelWithLMHead.from_pretrained("gpt2")

# Load the custom dataset
train_dataset = TextDataset(
    tokenizer=tokenizer,
    file_path="datasets\\all-data.txt",
    block_size=128
)

# Initialize the data collator
data_collator = DataCollatorForLanguageModeling(
    tokenizer=tokenizer, mlm=False
)

# Define the training arguments
training_args = TrainingArguments(
    output_dir="\\fine-tuned-gpt2",
    overwrite_output_dir=True,
    num_train_epochs=100,
    per_device_train_batch_size=5,
    save_steps=500,
    save_total_limit=2,
    prediction_loss_only=True,
    fp16=True,
)

# Initialize the trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    data_collator=data_collator,
)

torch.cuda.empty_cache()
# Fine-tune the model
trainer.train()

model.save_pretrained('fine-tuned-gpt2')

