import Img from "../../components/Image/Image";
import BoardSelector from "../../components/BoardSelector/BoardSelector";
import "./CreatePost.css";
import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import { pinsApi } from "../../api/pinsApi";
import { boardsApi } from "../../api/boardsApi";
import { useNavigate } from "react-router";
import { resizeImage } from "../../utils/imageUtils";
import CustomError from "../../components/CustomError/CustomError";
import ImageEditor from "../../components/ImageEditor/ImageEditor";

export default function CreatePost() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    board: "",
    slug: "",
    file: null,
  });
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [isBoardSelectorOpen, setIsBoardSelectorOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const { data: boards } = useQuery({
    queryKey: ["boards", user?._id],
    queryFn: () => boardsApi.getBoardsByUser(user._id),
    enabled: !!user?._id,
  });

  const createPinMutation = useMutation({
    mutationFn: (pinData) => pinsApi.createPin(pinData),
    onSuccess: () => {
      navigate("/");
    },
    onError: (error) => {
      console.log(error);
      setError(error.response.data.error);
      setIsError(true);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      return;
    }

    if (!formData.title || !formData.file) {
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("image", formData.file);
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("tags", formData.tags);
    if (selectedBoard) {
      formDataToSend.append("board", selectedBoard._id);
    }
    if (formData.slug) {
      formDataToSend.append("slug", formData.slug);
    }

    createPinMutation.mutate(formDataToSend);
  };

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file!");
        setIsError(true);
        return;
      }

      if (file.size > 20 * 1024 * 1024) {
        setError("File too large. Please select a file under 20MB");
        setIsError(true);
        return;
      }

      const img = new Image();
      img.onload = async () => {
        const aspectRatio = img.height / img.width;
        const maxAspectRatio = 1.5;

        if (aspectRatio > maxAspectRatio) {
          setError(
            `Image is too tall. Maximum allowed ratio is ${maxAspectRatio}:1, but your image is ${aspectRatio.toFixed(
              2
            )}:1. Please use a less tall image.`
          );
          setIsError(true);
          return;
        }

        let processedFile = file;
        if (file.size > 2 * 1024 * 1024) {
          processedFile = await resizeImage(file);
        }

        const url = URL.createObjectURL(processedFile);
        setPreviewUrl(url);

        setFormData((prev) => ({
          ...prev,
          file: processedFile,
        }));
      };

      img.src = URL.createObjectURL(file);
    }
  };

  useEffect(() => {
    document.body.classList.add("create-post-page");
    document.documentElement.classList.add("create-post-page");

    return () => {
      document.body.classList.remove("create-post-page");
      document.documentElement.classList.remove("create-post-page");

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBoardSelect = (board) => {
    setSelectedBoard(board);
    setFormData((prev) => ({
      ...prev,
      board: board._id,
    }));
  };

  const handleCloseError = (e) => {
    setIsError(false);
  };

  const openEditImage = () => {
    setIsEditorOpen(true);
  };

  const handleImageSave = (editedFile) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const newUrl = URL.createObjectURL(editedFile);
    setPreviewUrl(newUrl);
    setFormData((prev) => ({
      ...prev,
      file: editedFile
    }));
    setIsEditorOpen(false);
  }
  

  return (
    <div className="create-post-container">
      {isError ? (
        <CustomError message={error} close={handleCloseError} />
      ) : null}

      <div className="header-section">
        <h1>Create Post</h1>
        <button
          className="publish-btn"
          onClick={handleSubmit}
          disabled={createPinMutation.isPending}
        >
          {createPinMutation.isPending ? "Publishing..." : "Publish"}
        </button>
      </div>

      <div className={`content-section ${previewUrl ? "has-preview" : ""}`}>
        <div
          className={`upload-field ${previewUrl ? "has-preview" : ""}`}
          onClick={handleDivClick}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden-file-input"
          />

          {previewUrl ? (
            <div className="preview-container">
              <img src={previewUrl} alt="Preview" className="preview-image" />
              <div onClick={(e) => e.stopPropagation()}>
                <button className="edit-image-button" onClick={openEditImage}>
                  <Img
                    src={"icons/edit-image.svg"}
                    className={"fullscreen-button"}
                  />
                </button>
                {isEditorOpen && (
                  <ImageEditor
                    close={() => setIsEditorOpen(false)}
                    src={previewUrl}
                    onSave={handleImageSave}
                  />
                )}
              </div>
            </div>
          ) : (
            <>
              <Img
                src="general/upload.svg"
                alt="upload"
                className="upload-icon"
              />
              <div className="upload-text">Choose a file</div>
            </>
          )}
        </div>

        <div className="upload-form">
          <div className="form-field">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Add your title"
              required
            />
          </div>

          <div className="form-field">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Tell everyone what your Pin is about"
              rows="6"
            ></textarea>
          </div>

          <div className="form-field">
            <label>Custom URL (optional)</label>
            <input
              name="slug"
              type="text"
              placeholder="my-awesome-pin"
              onChange={handleInputChange}
              value={formData.slug}
            />
          </div>

          <div className="form-field">
            <label>Board</label>
            <button
              type="button"
              className={`board-selector-trigger ${
                selectedBoard ? "has-selection" : ""
              }`}
              onClick={() => setIsBoardSelectorOpen(true)}
            >
              {selectedBoard ? selectedBoard.title : "Choose a board"}
              <span className="arrow-down">▼</span>
            </button>
          </div>

          <div className="form-field">
            <label>Tags</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="Add tags separated by commas (e.g., travel, nature, photography)"
            />
          </div>
        </div>
      </div>

      <BoardSelector
        isOpen={isBoardSelectorOpen}
        onClose={() => setIsBoardSelectorOpen(false)}
        selectedBoard={selectedBoard}
        onBoardSelect={handleBoardSelect}
      />
    </div>
  );
}
