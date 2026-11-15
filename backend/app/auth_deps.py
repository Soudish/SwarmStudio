from fastapi import Depends, HTTPException, status, Header
from typing import Optional, Dict, Any
from app.services.auth_service import auth_service
from app.database import db_manager

async def get_optional_user(authorization: Optional[str] = Header(None)) -> Optional[Dict[str, Any]]:
    if not authorization:
        return None
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            return None
        payload = auth_service.decode_access_token(token)
        if not payload or "sub" not in payload:
            return None
        user = db_manager.get_user_by_id(payload["sub"])
        return user
    except Exception:
        return None

async def get_current_user(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    user = await get_optional_user(authorization)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please log in or register.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user
