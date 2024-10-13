import json
from utils import tokenize, bag_of_words, stem
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from chatmodel import NeuralNet
from chatbot import parse_course_recommendations

# Parse course recommendations
prompts, responses = parse_course_recommendations('final_course_recommendations_full_prereqs.txt')

# Store the words from the prompts
all_words = []
tags = []
patterns_tags = []

#-------------Tokenize-----------#
# Each prompt is treated as a pattern, and each response is treated as a tag
for i in range(len(prompts)):
    prompt = prompts[i]
    response = responses[i]

    # Assign a unique tag to each response
    tag = f"response_{i}"
    tags.append(tag)

    # Tokenize each prompt and add to all_words
    tokenized_prompt = tokenize(prompt)
    all_words.extend(tokenized_prompt)
    patterns_tags.append((tokenized_prompt, tag))

# Exclude punctuation
ignore = ['?', '!', '.', ',']

#--------------Stemming and Sorting -----------------#
all_words = [stem(word) for word in all_words if word not in ignore]
all_words = sorted(set(all_words))  # Remove duplicates

#--------------Training Data-------------------------#
pattern_train = []
tags_train = []

for (tokenized_pattern, tag) in patterns_tags:
    bag = bag_of_words(tokenized_pattern, all_words)
    pattern_train.append(bag)

    # Find the index of the tag and append it
    tag_index = tags.index(tag)
    tags_train.append(tag_index)

pattern_train = np.array(pattern_train)
tags_train = np.array(tags_train)

# Hyperparameters
batch_size = 8
hidden_size = 8
input_size = len(all_words)  # Input size should match the size of all words
output_size = len(tags)  # Output size should match the number of responses (tags)
learning_rate = 0.001
num_epochs = 1000

#----------Creating the Dataset------------#
class ChatDataset(Dataset):
    def __init__(self):
        self.n_samples = len(pattern_train)
        self.x_data = pattern_train
        self.y_data = tags_train

    def __getitem__(self, index):
        return self.x_data[index], self.y_data[index]

    def __len__(self):
        return self.n_samples

dataset = ChatDataset()
train_loader = DataLoader(dataset=dataset, batch_size=batch_size, shuffle=True, num_workers=0)

# Initialize device and model
dev = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
chatmodel = NeuralNet(input_size, hidden_size, output_size).to(dev)

# Loss and optimizer functions
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(chatmodel.parameters(), lr=learning_rate)

# Training loop
for epoch in range(num_epochs):
    for (words, reps) in train_loader:
        words = words.to(dev)
        reps = reps.to(dtype=torch.long).to(dev)

        # Forward pass
        outputs = chatmodel(words)
        loss = criterion(outputs, reps)

        # Backward and optimize
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

    if (epoch + 1) % 100 == 0:
        print(f'Epoch [{epoch+1}/{num_epochs}], Loss: {loss.item():.4f}')

print(f'Final loss: {loss.item():.4f}')

#------------------Save the data--------------------------#
data = {
   "chatmodel_state": chatmodel.state_dict(),
   "input_size": input_size,
   "output_size": output_size,
   "hidden_size": hidden_size,
   "all_words": all_words,
   "tags": tags
}

FILE = "model_data.pth"
torch.save(data, FILE)
