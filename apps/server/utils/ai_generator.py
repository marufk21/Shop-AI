from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import SecretStr

from core.config import settings

PROMPTS: dict[str, str] = {
    "name": (
        "You are an expert e-commerce copywriter. Improve the following product name "
        "to be more compelling, SEO-friendly, and marketable. Keep it to 1-5 words "
        "maximum. Make it concise, memorable, and likely to attract clicks. "
        "Return ONLY the improved name, nothing else."
    ),
    "description": (
        "You are an expert e-commerce copywriter. Improve the following product "
        "description to be more persuasive and feature-rich. Keep it to 2-3 lines "
        "maximum. Highlight key benefits and value proposition. Be concise and "
        "customer-focused. Return ONLY the improved description, nothing else."
    ),
}


def improve_text(text: str, field: str) -> str:
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        api_key=SecretStr(settings.gemini_api_key),
        temperature=0.7,
    )

    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", PROMPTS[field]),
            ("human", "{text}"),
        ]
    )

    chain = prompt | llm
    response = chain.invoke({"text": text})
    return str(response.content).strip()
