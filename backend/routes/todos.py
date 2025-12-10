from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Todo
from schemas import TodoCreate, TodoResponse

router = APIRouter()

@router.get("/todos", response_model=List[TodoResponse])
def get_todos(db: Session = Depends(get_db)):
    """Obtener todas las tareas"""
    todos = db.query(Todo).order_by(Todo.created_at.desc()).all()
    return todos

@router.post("/todos", response_model=TodoResponse)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    """Crear una nueva tarea"""
    new_todo = Todo(title=todo.title)
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)
    return new_todo

@router.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    """Eliminar una tarea"""
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    
    db.delete(todo)
    db.commit()
    return {"message": "Tarea eliminada exitosamente"}

@router.put("/todos/{todo_id}", response_model=TodoResponse)
def edit_todo(todo_id: int, todo: TodoCreate, db: Session = Depends(get_db)):
    """Editar una tarea existente"""
    existing_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not existing_todo:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    
    existing_todo.title = todo.title
    db.commit()
    db.refresh(existing_todo)
    return existing_todo    