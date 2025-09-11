import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage'
import { storage } from '../firebase'

export const uploadCourseImage = async (courseId, imageFile, courseTitle = '', oldImageUrl = null) => {
  try {
    // Validate inputs
    if (!imageFile) {
      throw new Error('No image file provided')
    }
    
    if (!courseId) {
      throw new Error('Course ID is required')
    }

    // Validate file type
    if (!imageFile.type.startsWith('image/')) {
      throw new Error('File must be an image')
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (imageFile.size > maxSize) {
      throw new Error('File size must be less than 5MB')
    }
    
    // Delete old image if it exists (but don't fail upload if deletion fails)
    if (oldImageUrl && !oldImageUrl.startsWith('blob:') && !oldImageUrl.startsWith('data:')) {
      try {
        await deleteFileFromStorage(oldImageUrl)
        console.log('Old image deleted successfully')
      } catch (deletionError) {
        console.warn('Failed to delete old image, but continuing with upload:', deletionError)
      }
    }
    
    // Generate meaningful filename
    const sanitizedTitle = courseTitle 
      ? courseTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')
      : courseId
    const fileExtension = imageFile.name.split('.').pop()
    const timestamp = Date.now()
    const fileName = `${sanitizedTitle}_main_image_${timestamp}.${fileExtension}`
    
    const imageRef = ref(storage, `courses/${courseId}/images/${fileName}`)
    
    console.log('Uploading image to:', `courses/${courseId}/images/${fileName}`)
    const snapshot = await uploadBytes(imageRef, imageFile)
    const downloadURL = await getDownloadURL(snapshot.ref)
    
    console.log('Image uploaded successfully:', downloadURL)
    return downloadURL
  } catch (error) {
    console.error('Error uploading course image:', error)
    
    // Provide more specific error messages
    if (error.code === 'storage/unauthorized') {
      throw new Error('You do not have permission to upload files. Please check your authentication.')
    } else if (error.code === 'storage/canceled') {
      throw new Error('Upload was canceled. Please try again.')
    } else if (error.code === 'storage/unknown') {
      throw new Error('An unknown error occurred during upload. Please try again.')
    }
    
    throw error
  }
}

// Function to remove course image completely
export const removeCourseImage = async (imageUrl) => {
  try {
    if (imageUrl) {
      await deleteFileFromStorage(imageUrl)
      console.log('Course image deleted successfully:', imageUrl)
    }
  } catch (error) {
    console.error('Error removing course image:', error)
    throw error
  }
}


export const uploadCourseVideo = async (courseId, videoFile, courseTitle = '') => {
  try {
    const sanitizedTitle = courseTitle 
      ? courseTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')
      : courseId
    const fileExtension = videoFile.name.split('.').pop()
    const fileName = `${sanitizedTitle}_video_${Date.now()}.${fileExtension}`
    
    const videoRef = ref(storage, `courses/${courseId}/videos/${fileName}`)
    const snapshot = await uploadBytes(videoRef, videoFile)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error) {
    console.error('Error uploading course video:', error)
    throw error
  }
}

export const uploadCourseDocument = async (courseId, documentFile, courseTitle = '') => {
  try {
    const sanitizedTitle = courseTitle 
      ? courseTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')
      : courseId
    const fileExtension = documentFile.name.split('.').pop()
    const fileName = `${sanitizedTitle}_document_${Date.now()}.${fileExtension}`
    
    const docRef = ref(storage, `courses/${courseId}/documents/${fileName}`)
    const snapshot = await uploadBytes(docRef, documentFile)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error) {
    console.error('Error uploading course document:', error)
    throw error
  }
}

export const uploadAdditionalImage = async (courseId, imageFile, courseTitle = '') => {
  try {
    const sanitizedTitle = courseTitle 
      ? courseTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')
      : courseId
    const fileExtension = imageFile.name.split('.').pop()
    const fileName = `${sanitizedTitle}_additional_${Date.now()}.${fileExtension}`
    
    const imageRef = ref(storage, `courses/${courseId}/additional-images/${fileName}`)
    const snapshot = await uploadBytes(imageRef, imageFile)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error) {
    console.error('Error uploading additional image:', error)
    throw error
  }
}

export const deleteFileFromStorage = async (downloadURL) => {
  try {
    if (!downloadURL || typeof downloadURL !== 'string') {
      console.warn('Invalid URL provided for deletion:', downloadURL)
      return
    }

    // Extract the file path from the Firebase Storage URL
    const url = new URL(downloadURL)
    const pathSegment = url.pathname.split('/v0/b/')[1]
    if (!pathSegment) {
      throw new Error('Invalid Firebase Storage URL format')
    }
    
    const filePath = pathSegment.split('/o/')[1]
    if (!filePath) {
      throw new Error('Could not extract file path from URL')
    }
    
    // Decode the file path
    const decodedPath = decodeURIComponent(filePath.split('?')[0])
    
    const fileRef = ref(storage, decodedPath)
    await deleteObject(fileRef)
    console.log('File deleted successfully:', decodedPath)
  } catch (error) {
    console.error('Error deleting file from storage:', error)
    // Don't throw error for non-existent files to avoid blocking the process
    if (error.code === 'storage/object-not-found') {
      console.warn('File not found, may have been already deleted:', downloadURL)
      return
    }
    throw error
  }
}

export const deleteCourseFiles = async (courseId, courseData) => {
  const deletionPromises = []

  try {
    // Delete course main image
    if (courseData.image) {
      deletionPromises.push(deleteFileFromStorage(courseData.image))
    }

    // Delete instructor avatar (if it belongs to this course)
    if (courseData.instructor?.avatar && courseData.instructor.avatar.includes(`courses/${courseId}`)) {
      deletionPromises.push(deleteFileFromStorage(courseData.instructor.avatar))
    }

    // Delete additional images
    if (courseData.additionalImages && courseData.additionalImages.length > 0) {
      courseData.additionalImages.forEach(imageUrl => {
        deletionPromises.push(deleteFileFromStorage(imageUrl))
      })
    }

    // Delete videos
    if (courseData.videos && courseData.videos.length > 0) {
      courseData.videos.forEach(video => {
        deletionPromises.push(deleteFileFromStorage(video.url))
      })
    }

    // Delete documents
    if (courseData.documents && courseData.documents.length > 0) {
      courseData.documents.forEach(document => {
        deletionPromises.push(deleteFileFromStorage(document.url))
      })
    }

    // Wait for all deletions to complete
    await Promise.allSettled(deletionPromises)
    
    // Delete the entire course folder structure to ensure cleanup
    await deleteCourseFolderStructure(courseId)
    
    console.log(`All files and folder structure for course ${courseId} have been deleted`)

  } catch (error) {
    console.error('Error deleting course files:', error)
    throw error
  }
}

export const deleteCourseFolderStructure = async (courseId) => {
  try {
    // List of all possible subfolders for a course
    const subfolders = ['images', 'videos', 'documents', 'additional-images']
    const deletionPromises = []

    // Delete all remaining files in each subfolder
    for (const subfolder of subfolders) {
      const folderRef = ref(storage, `courses/${courseId}/${subfolder}`)
      
      try {
        const folderList = await listAll(folderRef)
        
        // Delete all files in this subfolder
        folderList.items.forEach(fileRef => {
          deletionPromises.push(deleteObject(fileRef))
        })
        
        // Recursively delete any nested folders (though unlikely in this structure)
        folderList.prefixes.forEach(prefixRef => {
          deletionPromises.push(deleteAllFilesInFolder(prefixRef))
        })
      } catch (error) {
        // Folder might not exist, which is fine
        if (error.code !== 'storage/object-not-found') {
          console.warn(`Could not list files in ${subfolder}:`, error.message)
        }
      }
    }

    // Also try to delete any files directly in the course root folder
    try {
      const courseRootRef = ref(storage, `courses/${courseId}`)
      const rootList = await listAll(courseRootRef)
      
      rootList.items.forEach(fileRef => {
        deletionPromises.push(deleteObject(fileRef))
      })
    } catch (error) {
      if (error.code !== 'storage/object-not-found') {
        console.warn(`Could not list files in course root:`, error.message)
      }
    }

    // Wait for all deletions to complete
    await Promise.allSettled(deletionPromises)
    console.log(`Course folder structure for ${courseId} has been completely removed`)

  } catch (error) {
    console.error(`Error deleting course folder structure for ${courseId}:`, error)
    // Don't throw error to avoid blocking course deletion from database
  }
}

// Helper function to recursively delete all files in a folder
const deleteAllFilesInFolder = async (folderRef) => {
  try {
    const folderList = await listAll(folderRef)
    const deletionPromises = []

    // Delete all files
    folderList.items.forEach(fileRef => {
      deletionPromises.push(deleteObject(fileRef))
    })

    // Recursively delete subfolders
    folderList.prefixes.forEach(prefixRef => {
      deletionPromises.push(deleteAllFilesInFolder(prefixRef))
    })

    await Promise.all(deletionPromises)
  } catch (error) {
    console.error('Error deleting files in folder:', error)
  }
}

export const deleteSpecificCourseFile = async (fileUrl) => {
  try {
    await deleteFileFromStorage(fileUrl)
    console.log('File deleted successfully:', fileUrl)
  } catch (error) {
    console.error('Error deleting specific file:', error)
    throw error
  }
}