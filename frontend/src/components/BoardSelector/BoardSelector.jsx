import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import { boardsApi } from "../../api/boardsApi";
import { pinsApi } from "../../api/pinsApi";
import Collections from "../Collections/Collections";
import "./BoardSelector.css";
import Img from "../Image/Image";

export default function BoardSelector({ 
  isOpen, 
  onClose, 
  selectedBoard, 
  onBoardSelect,
  mode = "select", // "select" or "save"
  pinId = null // for save mode
}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBoardData, setNewBoardData] = useState({
    title: "",
    description: ""
  });
  const [tempSelectedBoard, setTempSelectedBoard] = useState(selectedBoard);

  useEffect(() => {
    if (isOpen) {
      setTempSelectedBoard(selectedBoard);
    }
  }, [isOpen, selectedBoard]);

  const createBoardMutation = useMutation({
    mutationFn: (boardData) => boardsApi.createBoard(boardData),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["boards", user._id]);
      if (mode === "save" && pinId) {
        savePinMutation.mutate({ pinId, boardId: data.board._id });
      } else {
        setTempSelectedBoard(data.board);
        setNewBoardData({ title: "", description: "" });
        setShowCreateForm(false);
      }
    },
    onError: (error) => {
      alert("Error creating board");
    },
  });

  const savePinMutation = useMutation({
    mutationFn: ({ pinId, boardId }) => pinsApi.savePinToBoard(pinId, boardId),
    onSuccess: () => {
      queryClient.invalidateQueries(["boards", user._id]);
      setNewBoardData({ title: "", description: "" });
      setShowCreateForm(false);
      onClose();
    },
    onError: (error) => {
      alert(`Failed to save pin: ${error.response?.data?.error || error.message}`);
    },
  });

  const handleCreateBoard = (e) => {
    e.preventDefault();
    if (!newBoardData.title.trim()) return;
    
    createBoardMutation.mutate({
      title: newBoardData.title,
      description: newBoardData.description,
      owner: user._id
    });
  };

  const handleBoardSelect = (board) => {
    setTempSelectedBoard(board);
  };

  const handleConfirm = () => {
    if (tempSelectedBoard) {
      if (mode === "select") {
        onBoardSelect(tempSelectedBoard);
        onClose();
      } else if (mode === "save" && pinId) {
        savePinMutation.mutate({ pinId, boardId: tempSelectedBoard._id });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBoardData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="board-selector-overlay" onClick={onClose}>
      <div className="board-selector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === "save" ? "Save to board" : "Choose board"}</h2>
          <button className="close-btn" onClick={onClose}>
            <Img src={"/icons/close.svg"} w={80} className={"close-button-image"}/>
          </button>
        </div>

        <div className="modal-content">
          {!showCreateForm ? (
            <>
              <div className="boards-selection-container">
                <Collections 
                  userId={user._id}
                  selectionMode={true}
                  selectedBoard={tempSelectedBoard}
                  onBoardSelect={handleBoardSelect}
                  variant="modal"
                  currentUser={user}
                />
              </div>

              <div className="modal-actions">
                <button 
                  className="create-board-btn"
                  onClick={() => setShowCreateForm(true)}
                >
                  + Create board
                </button>
                
                <button 
                  className="confirm-btn"
                  onClick={handleConfirm}
                  disabled={!tempSelectedBoard}
                >
                  {mode === "save" ? "Save Pin" : "Confirm"}
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleCreateBoard} className="create-board-form">
              <div className="form-field">
                <label>Board name</label>
                <input
                  type="text"
                  name="title"
                  value={newBoardData.title}
                  onChange={handleInputChange}
                  placeholder="Enter board name"
                  required
                  autoFocus
                />
              </div>

              <div className="form-field">
                <label>Description (optional)</label>
                <textarea
                  name="description"
                  value={newBoardData.description}
                  onChange={handleInputChange}
                  placeholder="What's your board about?"
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewBoardData({ title: "", description: "" });
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="create-btn"
                  disabled={createBoardMutation.isPending || !newBoardData.title.trim()}
                >
                  {createBoardMutation.isPending ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}