import "./ProfilePage.css";
import Img from "../../components/Image/Image";
import Gallery from "../../components/Gallery/Gallery";
import Collections from "../../components/Collections/Collections";
import { useState } from 'react';

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState('created');

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <Img
            src="/general/noavatar.svg"
            alt="Profile Avatar"
            className="avatar-image"
            w={100}
          />
        </div>
        <h1 className="profile-name">Anonymous</h1>
        <p className="profile-handle">@anonymous</p>
        <div className="profile-stats">
          <span>2 followers</span>
          <span>•</span>
          <span>5 following</span>
        </div>
        <div className="profile-buttons">
          <Img src="/icons/share.svg" alt="Share" className="btn-share" w={24} />
          <button className="btn-message">Message</button>
          <button className="btn-follow">Follow</button>
          <Img src="/icons/more.svg" alt="More" className="btn-more" w={24} />
        </div>
      </div>

      {/* Profile Navigation */}
      <div className="profile-nav">
        <button 
          className={`nav-tab ${activeSection === 'created' ? 'active' : ''}`}
          onClick={() => setActiveSection('created')}
        >
          Created
        </button>
        <button 
          className={`nav-tab ${activeSection === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveSection('saved')}
        >
          Saved
        </button>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        {activeSection === 'created' && (
          <div className="created-section">
            <Gallery variant={'profilePage'} />
          </div>
        )}
        
        {activeSection === 'saved' && (
          <div className="saved-section">
            <Collections />
          </div>
        )}
      </div>

    </div>
  );
}
