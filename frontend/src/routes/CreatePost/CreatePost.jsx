import Img from "../../components/Image/Image";
import "./CreatePost.css";

export default function CreatePost() {
  return (
    <div className="create-post-container">
      <div className="header-section">
        <h1>Create Post</h1>
        <button className="publish-btn">Publish</button>
      </div>

      <div className="content-section">
        <div className="upload-field">
          <Img src="general/upload.svg" alt="upload" className="upload-icon" />
          <div className="upload-text">
            Choose a file
          </div>
          <div className="upload-info">
            We recommend using high quality .jpg files less than 20MB or .mp4
            files less than 200MB
          </div>
        </div>

        <div className="upload-form">
          <div className="form-field">
            <label>Title</label>
            <input type="text" placeholder="Add your title" />
          </div>

          <div className="form-field">
            <label>Description</label>
            <textarea
              placeholder="Tell everyone what your Pin is about"
              rows="6"
            ></textarea>
          </div>

          <div className="form-field">
            <label>Link</label>
            <input type="url" placeholder="Add a destination link" />
          </div>

          <div className="form-field">
            <label>Board</label>
            <select>
              <option value="">Choose a board</option>
              <option value="general">General</option>
              <option value="inspiration">Inspiration</option>
              <option value="recipes">Recipes</option>
              <option value="travel">Travel</option>
            </select>
          </div>

          <div className="form-field">
            <label>Tags</label>
            <input type="text" placeholder="Add tags separated by commas" />
          </div>
        </div>
      </div>
    </div>
  );
}
