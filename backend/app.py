from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import numpy as np
from collections import Counter
import io
from sklearn.cluster import KMeans

app = Flask(__name__)
CORS(app)


def extract_colors(image, num_colors=10):
    # Convert image to RGB if it's not
    if image.mode != "RGB":
        image = image.convert("RGB")

    # Resize image to speed up processing
    image = image.resize((150, 150))

    # Convert image to numpy array
    img_array = np.array(image)

    # Reshape the array to 2D array of pixels
    pixels = img_array.reshape(-1, 3)

    # Use K-means clustering to find the most representative colors
    kmeans = KMeans(n_clusters=num_colors, random_state=42)
    kmeans.fit(pixels)

    # Get the cluster centers (colors)
    colors = kmeans.cluster_centers_.astype(int)

    # Convert RGB values to hex codes
    hex_colors = ["#{:02x}{:02x}{:02x}".format(r, g, b) for r, g, b in colors]

    # Count the number of pixels in each cluster
    labels = kmeans.labels_
    unique_labels, counts = np.unique(labels, return_counts=True)

    # Create a list of colors with their frequencies
    color_data = [
        {"color": hex_colors[label], "frequency": int(count)}
        for label, count in zip(unique_labels, counts)
    ]

    # Sort by frequency
    color_data.sort(key=lambda x: x["frequency"], reverse=True)

    return color_data


def generate_color_palettes(colors, num_palettes=3):
    """Generate color palettes from the extracted colors"""
    # Sort colors by frequency
    sorted_colors = sorted(colors, key=lambda x: x["frequency"], reverse=True)

    # Convert hex colors to RGB
    def hex_to_rgb(hex_color):
        hex_color = hex_color.lstrip("#")
        return tuple(int(hex_color[i : i + 2], 16) for i in (0, 2, 4))

    # Convert RGB to hex
    def rgb_to_hex(rgb):
        return "#{:02x}{:02x}{:02x}".format(*rgb)

    # Calculate color distance
    def color_distance(c1, c2):
        return sum((a - b) ** 2 for a, b in zip(c1, c2)) ** 0.5

    # Generate palettes
    palettes = []
    for _ in range(num_palettes):
        # Start with the most frequent color
        palette = [sorted_colors[0]["color"]]
        remaining_colors = sorted_colors[1:]

        # Add 3 more colors that complement the base color
        base_rgb = hex_to_rgb(palette[0])
        for _ in range(3):
            if not remaining_colors:
                break

            # Find color with maximum distance from existing palette colors
            max_distance = -1
            best_color = None
            best_idx = -1

            for idx, color in enumerate(remaining_colors):
                color_rgb = hex_to_rgb(color["color"])
                min_distance = min(
                    color_distance(color_rgb, hex_to_rgb(p)) for p in palette
                )
                if min_distance > max_distance:
                    max_distance = min_distance
                    best_color = color["color"]
                    best_idx = idx

            if best_color:
                palette.append(best_color)
                remaining_colors.pop(best_idx)

        palettes.append(palette)

    return palettes


@app.route("/extract-colors", methods=["POST"])
def process_image():
    try:
        # Check if image file is present in request
        if "image" not in request.files:
            return jsonify({"error": "No image file provided"}), 400

        file = request.files["image"]
        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400

        # Read and process the image
        image_data = file.read()
        image = Image.open(io.BytesIO(image_data))

        # Extract colors
        colors = extract_colors(image)

        return jsonify(colors)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/generate-palettes", methods=["POST"])
def generate_palettes():
    try:
        if "image" not in request.files:
            return jsonify({"error": "No image file provided"}), 400

        file = request.files["image"]
        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400

        # Read and process the image
        image_data = file.read()
        image = Image.open(io.BytesIO(image_data))

        # Extract colors
        colors = extract_colors(image)

        # Generate palettes
        palettes = generate_color_palettes(colors)

        return jsonify(palettes)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok"}), 200


if __name__ == "__main__":
    app.run(debug=True, port=5051)
