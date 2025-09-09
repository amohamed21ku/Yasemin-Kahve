import React, { useState } from 'react'
import { Star, User, ThumbsUp, ChevronDown, ChevronUp } from 'lucide-react'
import { useTranslation } from '../../../useTranslation'
import { useAuth } from '../../../AuthContext'
import './ReviewsTab.css'

const ReviewsTab = ({ courseDetails, getLocalizedText }) => {
  const { t, language } = useTranslation()
  const { currentUser } = useAuth()
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [sortBy, setSortBy] = useState('newest')

  // Mock reviews data - in real app this would come from props or API
  const reviews = courseDetails.reviews || [
    {
      id: 1,
      user: { name: 'Ahmet Yılmaz', avatar: null },
      rating: 5,
      date: '2024-01-15',
      review: {
        en: 'Excellent course! Learned so much about coffee brewing techniques.',
        tr: 'Mükemmel kurs! Kahve demleme teknikleri hakkında çok şey öğrendim.'
      },
      helpful: 12
    },
    {
      id: 2,
      user: { name: 'Elif Kaya', avatar: null },
      rating: 4,
      date: '2024-01-10',
      review: {
        en: 'Great instructor and comprehensive curriculum. Would recommend!',
        tr: 'Harika eğitmen ve kapsamlı müfredat. Tavsiye ederim!'
      },
      helpful: 8
    },
    {
      id: 3,
      user: { name: 'Mehmet Demir', avatar: null },
      rating: 5,
      date: '2024-01-08',
      review: {
        en: 'Perfect for beginners and advanced learners alike.',
        tr: 'Hem yeni başlayanlar hem de ileri seviye öğrenciler için mükemmel.'
      },
      helpful: 15
    }
  ]

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date) - new Date(a.date)
      case 'oldest':
        return new Date(a.date) - new Date(b.date)
      case 'highest':
        return b.rating - a.rating
      case 'lowest':
        return a.rating - b.rating
      case 'helpful':
        return b.helpful - a.helpful
      default:
        return 0
    }
  })

  const displayedReviews = showAllReviews ? sortedReviews : sortedReviews.slice(0, 3)
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  const ratingCounts = [5, 4, 3, 2, 1].map(rating => 
    reviews.filter(review => review.rating === rating).length
  )

  const renderStars = (rating, size = 16) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={size}
        fill={index < rating ? 'currentColor' : 'none'}
        className={index < rating ? 'star-filled' : 'star-empty'}
      />
    ))
  }

  return (
    <div className="reviews-tab">
      <div className="reviews-summary">
        <div className="overall-rating">
          <div className="rating-score">
            <span className="rating-number">{averageRating.toFixed(1)}</span>
            <div className="rating-stars">
              {renderStars(Math.round(averageRating), 20)}
            </div>
            <span className="rating-count">
              {reviews.length} {t('reviews') || 'reviews'}
            </span>
          </div>
        </div>

        <div className="rating-distribution">
          {ratingCounts.map((count, index) => {
            const rating = 5 - index
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
            return (
              <div key={rating} className="rating-bar">
                <span className="rating-label">{rating}</span>
                <Star size={12} fill="currentColor" />
                <div className="bar-container">
                  <div className="bar-fill" style={{ width: `${percentage}%` }}></div>
                </div>
                <span className="rating-count-small">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="reviews-controls">
        <div className="sort-controls">
          <label>{t('sortBy') || 'Sort by'}:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">{t('newest') || 'Newest'}</option>
            <option value="oldest">{t('oldest') || 'Oldest'}</option>
            <option value="highest">{t('highestRated') || 'Highest Rated'}</option>
            <option value="lowest">{t('lowestRated') || 'Lowest Rated'}</option>
            <option value="helpful">{t('mostHelpful') || 'Most Helpful'}</option>
          </select>
        </div>
      </div>

      <div className="reviews-list">
        {displayedReviews.map((review) => (
          <div key={review.id} className="review-item">
            <div className="review-header">
              <div className="reviewer-info">
                <div className="reviewer-avatar">
                  {review.user.avatar ? (
                    <img src={review.user.avatar} alt={review.user.name} />
                  ) : (
                    <User size={24} />
                  )}
                </div>
                <div className="reviewer-details">
                  <h4 className="reviewer-name">{review.user.name}</h4>
                  <span className="review-date">{formatDate(review.date)}</span>
                </div>
              </div>
              <div className="review-rating">
                {renderStars(review.rating)}
              </div>
            </div>
            
            <div className="review-content">
              <p>{getLocalizedText(review.review)}</p>
            </div>
            
            <div className="review-actions">
              <button className="helpful-btn">
                <ThumbsUp size={14} />
                <span>{t('helpful') || 'Helpful'} ({review.helpful})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {reviews.length > 3 && (
        <div className="reviews-show-more">
          <button
            className="show-more-btn"
            onClick={() => setShowAllReviews(!showAllReviews)}
          >
            {showAllReviews ? (
              <>
                <ChevronUp size={16} />
                {t('showLess') || 'Show Less'}
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                {t('showMore') || `Show More (${reviews.length - 3} more)`}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default ReviewsTab