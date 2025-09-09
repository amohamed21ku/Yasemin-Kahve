import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '../firebase'

export const uploadCourseImage = async (courseId, imageFile, courseTitle = '', oldImageUrl = null) => {
  try {
    // Delete old image if it exists
    if (oldImageUrl) {
      await deleteFileFromStorage(oldImageUrl)
    }
    
    // Generate meaningful filename
    const sanitizedTitle = courseTitle 
      ? courseTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')
      : courseId
    const fileExtension = imageFile.name.split('.').pop()
    const fileName = `${sanitizedTitle}_main_image.${fileExtension}`
    
    const imageRef = ref(storage, `courses/${courseId}/images/${fileName}`)
    const snapshot = await uploadBytes(imageRef, imageFile)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error) {
    console.error('Error uploading course image:', error)
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
    const fileRef = ref(storage, downloadURL)
    await deleteObject(fileRef)
  } catch (error) {
    console.error('Error deleting file from storage:', error)
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
    console.log(`All files for course ${courseId} have been processed for deletion`)

  } catch (error) {
    console.error('Error deleting course files:', error)
    throw error
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