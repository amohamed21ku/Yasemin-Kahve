import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '../firebase'

export const uploadCourseImage = async (courseId, imageFile) => {
  try {
    const imageRef = ref(storage, `courses/${courseId}/images/course-image-${Date.now()}`)
    const snapshot = await uploadBytes(imageRef, imageFile)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error) {
    console.error('Error uploading course image:', error)
    throw error
  }
}

export const uploadInstructorAvatar = async (courseId, avatarFile) => {
  try {
    const avatarRef = ref(storage, `courses/${courseId}/instructor/avatar-${Date.now()}`)
    const snapshot = await uploadBytes(avatarRef, avatarFile)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error) {
    console.error('Error uploading instructor avatar:', error)
    throw error
  }
}

export const uploadCourseVideo = async (courseId, videoFile, videoName) => {
  try {
    const videoRef = ref(storage, `courses/${courseId}/videos/${videoName}-${Date.now()}`)
    const snapshot = await uploadBytes(videoRef, videoFile)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error) {
    console.error('Error uploading course video:', error)
    throw error
  }
}

export const uploadCourseDocument = async (courseId, documentFile, documentName) => {
  try {
    const docRef = ref(storage, `courses/${courseId}/documents/${documentName}-${Date.now()}`)
    const snapshot = await uploadBytes(docRef, documentFile)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error) {
    console.error('Error uploading course document:', error)
    throw error
  }
}

export const uploadAdditionalImage = async (courseId, imageFile, imageName) => {
  try {
    const imageRef = ref(storage, `courses/${courseId}/additional-images/${imageName}-${Date.now()}`)
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