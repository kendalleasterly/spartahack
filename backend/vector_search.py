import os
from pymongo import MongoClient
import vertexai
from vertexai.vision_models import Image, MultiModalEmbeddingModel

# Initialize Vertex AI with your project and location.
vertexai.init(project="spartancutz-1", location="us-central1")
# Load the pre-trained multimodal embedding model.
model = MultiModalEmbeddingModel.from_pretrained("multimodalembedding@001")

def vector_search_uploaded_image(image_path, k=1, db_name="your_database", collection_name="haircut-embeddings"):
    """
    Given a file path to an uploaded image, this function:
      1. Loads the image and creates a vector embedding using Vertex AI.
      2. Connects to MongoDB and performs a vector search query on the specified collection.
    You can adjust the number of neighbors returned with the parameter k.
    
    Args:
      image_path (str): Path to the uploaded image to be queried.
      k (int): Number of nearest neighbors to return. Default is 1.
      db_name (str): The MongoDB database name.
      collection_name (str): The MongoDB collection where embeddings are stored.
      
    Returns:
      list: A list of document(s) returned by the vector search query.
    """
    # Load the image using Vertex AI's Image loader.
    loaded_image = Image.load_from_file(image_path)
    
    # Create the embedding.
    # Adjust contextual_text and dimension as needed.
    embeddings = model.get_embeddings(image=loaded_image, contextual_text="", dimension=1408)
    embedding_vector = embeddings.image_embedding
    
    # Connect to MongoDB.
    mongodb_uri = os.getenv("MONGODB_URI")
    if not mongodb_uri:
        raise Exception("MONGODB_URI environment variable is not set.")
    client = MongoClient(mongodb_uri)
    db = client[db_name]
    collection = db[collection_name]
    
    # Create the aggregation pipeline for vector search.
    pipeline = [
        {
            "$search": {
                "knnBeta": {
                    "vector": embedding_vector,
                    "path": "embedding",
                    "k": k
                }
            }
        }
    ]
    results = list(collection.aggregate(pipeline))
    return results

if __name__ == "__main__":
    # Example usage: Provide a file path to the uploaded image.
    test_image_path = "path/to/uploaded/image.jpg"  # Replace with the actual path.
    similar_docs = vector_search_uploaded_image(test_image_path, k=1, db_name="your_database", collection_name="haircut-embeddings")
    print("Similar document(s):", similar_docs) 