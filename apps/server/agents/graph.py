"""Assemble the LangGraph multi-agent StateGraph.

Flow::

    START → supervisor → (conditional) → product / support → END

The supervisor classifies the user's intent and routes to the matching
specialist. Each specialist runs once per request and then the graph
ends.
"""

from typing import Any

from langgraph.graph import END, START, StateGraph
from sqlalchemy.ext.asyncio import AsyncSession

from agents.specialist.product_agent import create_product_agent
from agents.specialist.support_agent import create_support_agent
from agents.state import AgentState
from agents.supervisor import supervisor_node


def route_from_supervisor(state: AgentState) -> str:
    """Conditional edge: read ``current_agent`` and return the node name."""

    agent = state.get("current_agent", "support")
    if agent == "product":
        return "product"
    return "support"


def build_agent_graph(db: AsyncSession) -> Any:  # noqa: ANN401
    """Compile and return a per-request StateGraph.

    Tools close over the given ``AsyncSession`` so they share the same
    database transaction as the calling request.
    """

    graph = StateGraph(AgentState)

    graph.add_node("supervisor", supervisor_node)
    graph.add_node("product", create_product_agent(db))  # type: ignore[arg-type]
    graph.add_node("support", create_support_agent(db))  # type: ignore[arg-type]

    graph.add_edge(START, "supervisor")

    graph.add_conditional_edges(
        "supervisor",
        route_from_supervisor,
        {
            "product": "product",
            "support": "support",
        },
    )

    graph.add_edge("product", END)
    graph.add_edge("support", END)

    return graph.compile()
