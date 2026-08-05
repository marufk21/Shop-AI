"""Product specialist agent.

Handles product search, filtering, comparison, and recommendation
requests using tool-calling against the product catalog.
"""

from collections.abc import Awaitable, Callable

from langchain_core.messages import (
    AIMessage,
    BaseMessage,
    SystemMessage,
    ToolMessage,
)
from langchain_core.tools import BaseTool
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import SecretStr
from sqlalchemy.ext.asyncio import AsyncSession

from agents.state import AgentState
from agents.tools import get_product_tools
from core.config import settings

AgentNode = Callable[[AgentState], Awaitable[dict[str, object]]]

PRODUCT_AGENT_PROMPT = """\
You are the Product Specialist for ShopAI e-commerce.

Your job:
1. Search and filter products based on customer requests using the
   search_products tool.
2. Recommend products based on preferences using the recommend_products
   tool.
3. Compare products when asked.
4. Provide product details (price, category, availability).

Always use the tools to get real data from the catalog. Never make up
product information.

Formatting rules:
- Write in clean, well-structured plain text. Never use Markdown syntax
  like **bold**, *italic*, or `code`.
- Use line breaks to separate paragraphs for readability.
- When listing items, use a dash (-) at the start of each line followed
  by a space. Put each list item on its own line.
- For emphasis, use labels like [Tip], [Note], or [Important] at the
  start of a paragraph.
- Keep headers or section titles on their own line, followed by a blank
  line before the content.
"""


def create_product_agent(db: AsyncSession) -> AgentNode:
    """Return an async graph node that handles product queries."""

    tools = get_product_tools(db)
    tools_by_name: dict[str, BaseTool] = {t.name: t for t in tools}

    async def product_agent_node(state: AgentState) -> dict[str, object]:
        temperature: float = state.get("temperature", 0.7)

        llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            api_key=SecretStr(settings.gemini_api_key),
            temperature=temperature,
            streaming=True,
        ).bind_tools(tools)

        messages: list[BaseMessage] = [
            SystemMessage(content=PRODUCT_AGENT_PROMPT),
            *state["messages"],
        ]

        ai_response: AIMessage = await llm.ainvoke(messages)

        # If the LLM wants to call tools, execute them and re-invoke
        if ai_response.tool_calls:
            messages.append(ai_response)
            for tool_call in ai_response.tool_calls:
                tool = tools_by_name[tool_call["name"]]
                result = await tool.ainvoke(tool_call["args"])
                messages.append(
                    ToolMessage(
                        content=str(result),
                        tool_call_id=tool_call["id"],
                    )
                )

            ai_response = await llm.ainvoke(messages)

        return {"messages": [ai_response]}

    return product_agent_node
