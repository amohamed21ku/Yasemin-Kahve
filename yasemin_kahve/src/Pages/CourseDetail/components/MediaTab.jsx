import React from 'react'
import { Play, FileText, Download, ZoomIn } from 'lucide-react'
import { useTranslate } from '../../../useTranslate'
import './TabContent.css'
import './MediaTab.css'

const MediaTab = ({ courseDetails, openImageViewer }) => {
  const { t } = useTranslate()
  return (
    <div className="tab-content">
      <h3>{t("courseMedia") || "Course Media"}</h3>
      
      {/* Course Videos */}
      {courseDetails.videos && courseDetails.videos.length > 0 && (
        <div className="media-section">
          <h4>{t("videos") || "Videos"}</h4>
          <div className="media-grid">
            {courseDetails.videos.map((video, index) => (
              <div key={index} className="media-item video-item">
                <div className="media-preview">
                  <Play size={24} />
                  <span>{video.name}</span>
                </div>
                <a href={video.url} target="_blank" rel="noopener noreferrer" className="media-link">
                  {t("watchVideo") || "Watch Video"}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Additional Images */}
      {courseDetails.additionalImages && courseDetails.additionalImages.length > 0 && (
        <div className="media-section">
          <h4>{t("images") || "Images"}</h4>
          <div className="image-gallery">
            {courseDetails.additionalImages.map((image, index) => (
              <div 
                key={index} 
                className="gallery-image"
                onClick={() => openImageViewer(index)}
                style={{ cursor: 'pointer' }}
              >
                <img src={image} alt={`Course image ${index + 1}`} />
                <div className="image-overlay">
                  <ZoomIn size={24} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Course Documents */}
      {courseDetails.documents && courseDetails.documents.length > 0 && (
        <div className="media-section">
          <h4>{t("documents") || "Documents"}</h4>
          <div className="documents-list">
            {courseDetails.documents.map((doc, index) => (
              <div key={index} className="document-item">
                <FileText size={20} />
                <span>{doc.name}</span>
                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="download-link">
                  <Download size={16} />
                  {t("download") || "Download"}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* No media message */}
      {(!courseDetails.videos || courseDetails.videos.length === 0) &&
       (!courseDetails.additionalImages || courseDetails.additionalImages.length === 0) &&
       (!courseDetails.documents || courseDetails.documents.length === 0) && (
        <div className="no-media">
          <p>{t("noMediaAvailable") || "No additional media content is available for this course yet."}</p>
        </div>
      )}
    </div>
  )
}

export default MediaTab