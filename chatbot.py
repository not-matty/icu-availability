import random
import torch
from chatmodel import NeuralNet
from utils import tokenize, bag_of_words

# Check if CUDA is available, otherwise use CPU
dev = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

def parse_course_recommendations(file_path):
    prompts = []
    responses = []

    # Option 1: Open the file in text mode
    with open(file_path, 'r') as file:
        for line in file:
            line = line.strip()  # Remove leading/trailing whitespace
            if line.startswith("Prompt:"):
                prompts.append(line[8:].strip())  # Append the prompt without "Prompt: "
            elif line.startswith("Response"):
                response = line.split(":", 1)[1].strip()  # Get everything after "Response:"
                responses.append(response)

    return prompts, responses

# Example usage
prompts, responses = parse_course_recommendations('final_course_recommendations_full_prereqs.txt')

# Load the trained model data
FILE = "model_data.pth"
data = torch.load(FILE)

input_size = data["input_size"]
output_size = data["output_size"]
hidden_size = data["hidden_size"]
all_words = data["all_words"]
tags = data["tags"]
chatmodel_state = data["chatmodel_state"]

# Initialize the neural network model
chatmodel = NeuralNet(input_size, hidden_size, output_size).to(dev)
chatmodel.load_state_dict(chatmodel_state)
chatmodel.eval()

chatbot_name = "HuskyPal"
print("Let's chat! type 'quit' to exit")

while True:
    sentence = input('You: ')
    if sentence.lower() == "quit":
        break

    # Tokenize and create a bag of words
    sentence = tokenize(sentence)
    bag = bag_of_words(sentence, all_words)
    bag = bag.reshape(1, bag.shape[0])
    bag = torch.from_numpy(bag).to(dev)  # Convert to a PyTorch tensor

    # Pass the bag of words through the model
    output = chatmodel(bag)
    _, predicted = torch.max(output, dim=1)
    tag = tags[predicted.item()]

    # Calculate probability
    probs = torch.softmax(output, dim=1)
    probability = probs[0][predicted.item()]

    # Check if the probability is greater than a threshold (e.g., 0.75)
    if probability.item() > 0.75:
        # Try to match the user's input to a prompt in the parsed data
        found_match = False
        for i, prompt in enumerate(prompts):
            if tag in prompt:  # Simple matching by tag, you can improve this with NLP methods
                # Respond with the associated response
                found_match = True
                print(f"{chatbot_name}: Here are some course recommendations based on your query:")
                for response in responses[i]:
                    print(response)
                break

        if not found_match:
            print(f"{chatbot_name}: I do not have a specific recommendation for that, but I'll try to assist!")
    else:
        print(f"{chatbot_name}: I do not understand...")
