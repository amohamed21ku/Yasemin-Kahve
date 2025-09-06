// Image service for handling image uploads and processing
// This is a basic implementation using local blob URLs
// In production, you would upload to Firebase Storage, Cloudinary, or similar service

export const uploadImage = async (file) => {
  return new Promise((resolve, reject) => {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        reject(new Error('Invalid file type. Please select an image file.'))
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        reject(new Error('File size too large. Maximum size is 5MB.'))
        return
      }

      // For development, create a blob URL
      // In production, upload to your preferred storage service
      const imageUrl = URL.createObjectURL(file)
      
      // Simulate upload delay
      setTimeout(() => {
        resolve(imageUrl)
      }, 1000)

    } catch (error) {
      reject(error)
    }
  })
}

export const deleteImage = async (imageUrl) => {
  try {
    // If it's a blob URL, revoke it
    if (imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl)
    }
    
    // In production, you would delete from your storage service
    return true
  } catch (error) {
    console.error('Error deleting image:', error)
    return false
  }
}

export const validateImageFile = (file) => {
  const errors = []
  
  if (!file) {
    errors.push('No file selected')
    return errors
  }

  if (!file.type.startsWith('image/')) {
    errors.push('File must be an image')
  }

  if (file.size > 5 * 1024 * 1024) {
    errors.push('File size must be less than 5MB')
  }

  // Check image dimensions (optional)
  return new Promise((resolve) => {
    if (errors.length > 0) {
      resolve(errors)
      return
    }

    const img = new Image()
    img.onload = () => {
      if (img.width < 300 || img.height < 200) {
        errors.push('Image should be at least 300x200 pixels')
      }
      if (img.width > 4000 || img.height > 3000) {
        errors.push('Image should be no larger than 4000x3000 pixels')
      }
      resolve(errors)
    }
    img.onerror = () => {
      errors.push('Invalid image file')
      resolve(errors)
    }
    img.src = URL.createObjectURL(file)
  })
}

export const resizeImage = (file, maxWidth = 800, maxHeight = 600, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }
      
      canvas.width = width
      canvas.height = height
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob(
        (blob) => {
          resolve(blob)
        },
        'image/jpeg',
        quality
      )
    }
    
    img.src = URL.createObjectURL(file)
  })
}

// Utility function to convert image to WebP format for better compression
export const convertToWebP = (file, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to convert image to WebP'))
          }
        },
        'image/webp',
        quality
      )
    }
    
    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }
    
    img.src = URL.createObjectURL(file)
  })
}

export default {
  uploadImage,
  deleteImage,
  validateImageFile,
  resizeImage,
  convertToWebP
}