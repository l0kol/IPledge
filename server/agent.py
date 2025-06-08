import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain_community.tools import DuckDuckGoSearchResults
from langchain_core.tools import Tool
from langchain_core.messages import HumanMessage
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langchain_core.tools import tool

# Load environment variables from .env file (don't forget to create it, it's in gitignore, so it won't be committed)
load_dotenv()
app = FastAPI()


class IdeaRequest(BaseModel):
    text: str  # The idea description
    enhance_with_search: bool = True  # Whether to add web research


# Check and load required environment variables
if not os.environ.get("OPENAI_API_KEY"):
    raise ValueError("OPENAI_API_KEY missing in .env")
# if not os.environ.get("SERPAPI_API_KEY"):
#     raise ValueError("SERPAPI_API_KEY missing in .env")

# ***************** TOOL definitions *****************
search = DuckDuckGoSearchResults(max_results=3)
search_tool = Tool.from_function(
    name="web_search",
    description="Search for recent information to enhance ideas",
    func=search.run,
)


@tool
def summarize_idea(text: str) -> str:
    """Generate a concise summary of an idea description."""
    llm = ChatOpenAI(model="gpt-4")
    return llm.invoke(f"Summarize this idea in 2-3 sentences:\n\n{text}").content


# ****************** AGENT setup *****************
tools = [summarize_idea, search_tool]
agent = create_react_agent(ChatOpenAI(model="gpt-4"), tools)

# ******************* API Endpoint *******************


@app.post("/enhance-idea")
async def enhance_idea(request: IdeaRequest):
    try:
        # Build the agent's input
        prompt = f"""Here's an idea:
        {request.text}
        
        Add your insights on how viable this idea is and if you think it would do good on the contect platforms (youtube, instagram, ...).
        This text is for potential investors, so be honest but also try to be positive.
        {"Find some information on similair ideas and how succesfull were they among consumers." if request.enhance_with_search else ""}
        """

        response = agent.invoke({"messages": [HumanMessage(content=prompt)]})

        return {
            "summary": summarize_idea.run(request.text),
            "opinion": response["messages"][-1].content,
            "search_performed": request.enhance_with_search,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
async def root():
    return {
        "message": "Welcome to the Idea Enhancer API! Use /enhance-idea to enhance your ideas."
    }
