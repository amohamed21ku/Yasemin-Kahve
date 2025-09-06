# Yasemin Kahve Academy

A comprehensive coffee education platform with course enrollment and payment functionality.

## Features

### 🎓 Academy Homepage
- **Hero Section**: Professional academy presentation with statistics
- **Course Grid**: Display of all available courses with search and filtering
- **Authentication Integration**: Seamless login/registration flow

### 📚 Course Management
- **Course Cards**: Attractive course display with key information
- **Course Details**: Comprehensive course information pages
- **Instructor Profiles**: Detailed instructor information and credentials
- **Course Curriculum**: Structured learning modules and lessons

### 💰 Enrollment System
- **Authentication Check**: Users must be logged in to enroll
- **Payment Integration**: Credit card payment form (placeholder for Stripe/PayPal)
- **Enrollment Modal**: Professional checkout experience
- **Course Access**: Enrolled students can access course materials

### 🔍 Course Discovery
- **Search Functionality**: Search courses by title and description
- **Filter Options**: Filter by level, category, and other criteria
- **Sorting**: Sort by popularity, price, rating, duration, and start date
- **Responsive Design**: Works perfectly on all devices

## Components Structure

```
src/Pages/Academy/
├── Academy.jsx                 # Main academy page
├── Academy.css                # Academy page styles
├── README.md                  # This documentation
└── components/
    ├── AcademyHero.jsx        # Hero section with academy intro
    ├── AcademyHero.css        # Hero section styles
    ├── CourseCard.jsx         # Individual course display
    ├── CourseCard.css         # Course card styles
    ├── CourseGrid.jsx         # Courses listing with filters
    ├── CourseGrid.css         # Course grid styles
    ├── EnrollmentModal.jsx    # Payment and enrollment modal
    └── EnrollmentModal.css    # Enrollment modal styles

src/Pages/CourseDetail/
├── CourseDetail.jsx           # Detailed course page
└── CourseDetail.css           # Course detail styles
```

## Sample Courses

The academy includes 6 sample courses:

1. **Coffee Fundamentals** - Beginner level (8 hours)
2. **Advanced Brewing Techniques** - Advanced level (12 hours)
3. **Coffee Cupping & Tasting** - Intermediate level (6 hours)
4. **Coffee Roasting Mastery** - Advanced level (16 hours)
5. **Coffee Business Management** - Intermediate level (20 hours)
6. **Latte Art Workshop** - Beginner level (4 hours)

## Authentication Integration

- Uses existing `AuthContext` for user authentication
- Redirects non-authenticated users to login/register
- Tracks enrolled courses for each user
- Admin access control for course management

## Payment System

The enrollment modal includes a complete payment form with:

- Credit card number formatting
- Expiry date validation
- CVV security code
- Cardholder name
- Terms and conditions agreement
- Secure payment notice

**Note**: This is a placeholder implementation. For production, integrate with:
- Stripe for credit card processing
- PayPal for alternative payment methods
- Firebase for enrollment tracking
- Email service for confirmations

## Localization Support

All components support multi-language content:
- Course titles and descriptions
- Instructor information
- UI text and labels
- Error messages and notifications

## Images and Assets

Expected image structure:
```
public/static/images/assets/
├── academy/
│   └── academy-hero.jpg       # Academy hero background
├── courses/
│   ├── fundamentals.jpg       # Course thumbnails
│   ├── brewing.jpg
│   ├── cupping.jpg
│   ├── roasting.jpg
│   ├── business.jpg
│   └── latte-art.jpg
└── instructors/
    ├── ahmet.jpg              # Instructor photos
    ├── fatma.jpg
    ├── mehmet.jpg
    ├── ali.jpg
    ├── elif.jpg
    └── zeynep.jpg
```

## Future Enhancements

### Phase 2
- Video course content streaming
- Progress tracking and completion certificates
- Student reviews and ratings
- Live virtual classes scheduling
- Course forum and Q&A

### Phase 3
- Mobile app development
- Offline course downloads
- Advanced analytics dashboard
- Affiliate marketing system
- Corporate training packages

## Technical Implementation

### State Management
- React hooks for local state
- Context API for authentication
- Course data management

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interfaces
- Optimized images and loading

### Performance
- Lazy loading for images
- Efficient re-rendering
- Optimized component structure
- Fast search and filtering

## Usage

1. **Navigate to Academy**: Users click "Academy" in main navigation
2. **Browse Courses**: View all courses with search and filtering options
3. **View Course Details**: Click on any course to see full details
4. **Enroll in Course**: Click "Enroll Now" (requires authentication)
5. **Complete Payment**: Fill out payment form and complete enrollment
6. **Access Course**: Enrolled students can access course materials

## Configuration

### Course Data
Courses are currently stored as static data in `CourseGrid.jsx`. For production:
- Move course data to Firebase/database
- Implement course management admin panel
- Add course creation and editing tools

### Payment Integration
To integrate real payments:
1. Sign up for Stripe/PayPal merchant account
2. Install payment SDK (e.g., `@stripe/stripe-js`)
3. Replace placeholder payment logic in `EnrollmentModal.jsx`
4. Add server-side payment processing
5. Implement webhook handlers for payment confirmation

### Email Notifications
Add email service integration for:
- Enrollment confirmations
- Course reminders
- Certificate delivery
- Payment receipts

This academy system provides a solid foundation for a professional coffee education platform with room for extensive future development.