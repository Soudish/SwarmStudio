import os
import sys
from pathlib import Path

# Ensure backend root is in python path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

data_dir = Path(current_dir) / "data"
data_dir.mkdir(exist_ok=True, parents=True)
os.environ["LOCALAPPDATA"] = str(data_dir)
os.environ["APPDATA"] = str(data_dir)
os.environ["CREWAI_DISABLE_TELEMETRY"] = "true"
os.environ["OTEL_SDK_DISABLED"] = "true"

import uvicorn

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
