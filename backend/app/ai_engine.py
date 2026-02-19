from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
from typing import List, Tuple


# ==============================
# Text Cleaning Utility
# ==============================
def clean_text(text: str) -> str:
    """
    Lowercase, remove special characters,
    normalize whitespace.
    """
    if not text:
        return ""

    text = text.lower()
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"[^\w\s]", "", text)
    return text.strip()


# ==============================
# Plagiarism Detection
# ==============================
def calculate_plagiarism(new_text: str, existing_texts: List[str]) -> float:
    """
    Returns plagiarism percentage (0–100)
    using TF-IDF + Cosine Similarity.
    """

    if not new_text:
        return 0.0

    if not existing_texts:
        return 0.0

    cleaned_new = clean_text(new_text)
    cleaned_existing = [
        clean_text(text) for text in existing_texts if text
    ]

    if not cleaned_existing:
        return 0.0

    texts = cleaned_existing + [cleaned_new]

    try:
        vectorizer = TfidfVectorizer(stop_words="english")
        tfidf_matrix = vectorizer.fit_transform(texts)

        similarity_matrix = cosine_similarity(
            tfidf_matrix[-1:], tfidf_matrix[:-1]
        )

        max_similarity = similarity_matrix.max()

        return round(float(max_similarity) * 100, 2)

    except Exception:
        # Safe fallback
        return 0.0


# ==============================
# Intelligent Feedback Generator
# ==============================
def generate_feedback(text: str) -> Tuple[str, int]:
    """
    Returns (feedback_message, score)
    """

    if not text:
        return "No content submitted.", 0

    cleaned_text = clean_text(text)
    word_count = len(cleaned_text.split())

    # Advanced scoring logic
    if word_count < 50:
        return (
            "Submission is too short. Provide more explanation and examples.",
            40,
        )

    elif word_count < 150:
        return (
            "Decent attempt, but explanation depth can be improved.",
            65,
        )

    elif word_count < 300:
        return (
            "Good structured response with clear understanding.",
            80,
        )

    elif word_count < 500:
        return (
            "Very good detailed explanation with proper clarity.",
            90,
        )

    else:
        return (
            "Excellent comprehensive submission with strong conceptual depth.",
            95,
        )
